import { createHmac, timingSafeEqual } from "node:crypto";

export type StripeMode =
  | { ok: true; secretKey: string }
  | { ok: false; reason: "missing" | "live" | "not-test" };

export function readStripeMode(secret = process.env.STRIPE_SECRET_KEY ?? ""): StripeMode {
  const key = secret.trim();
  if (!key) return { ok: false, reason: "missing" };
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) return { ok: false, reason: "live" };
  if (!key.startsWith("sk_test_")) return { ok: false, reason: "not-test" };
  return { ok: true, secretKey: key };
}

export function verifyStripeSignature(payload: string, header: string, secret: string, now = Date.now()) {
  const parts = Object.fromEntries(
    header.split(",").map((piece) => {
      const [key, value] = piece.split("=");
      return [key, value ?? ""];
    }),
  );
  const timestamp = parts.t ?? "";
  const signature = parts.v1 ?? "";
  if (!/^\d+$/.test(timestamp) || !/^[a-f0-9]+$/i.test(signature)) return false;
  const age = Math.abs(now - Number(timestamp) * 1000);
  if (age > 5 * 60 * 1000) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export type CheckoutDraft = {
  searchId: string;
  email: string;
  depositCents: number;
  successUrl: string;
  cancelUrl: string;
};

export async function createDepositCheckout(secretKey: string, draft: CheckoutDraft) {
  const mode = readStripeMode(secretKey);
  if (!mode.ok) throw new Error("Stripe checkout is limited to a test secret key.");
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", draft.successUrl);
  body.set("cancel_url", draft.cancelUrl);
  body.set("client_reference_id", draft.searchId);
  body.set("customer_email", draft.email);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "usd");
  body.set("line_items[0][price_data][unit_amount]", String(draft.depositCents));
  body.set("line_items[0][price_data][product_data][name]", "Swyft International search deposit");
  body.set(
    "line_items[0][price_data][product_data][description]",
    "Credited toward the success fee if you hire. Test mode only.",
  );
  body.set("metadata[searchId]", draft.searchId);
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mode.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const payload = (await response.json()) as { id?: string; url?: string; error?: { message?: string } };
  if (!response.ok || !payload.url || !payload.id) {
    throw new Error(payload.error?.message || "Stripe did not open a test checkout.");
  }
  if (!payload.id.startsWith("cs_test_")) {
    throw new Error("Refusing a checkout session that is not in test mode.");
  }
  if (!payload.url.startsWith("https://checkout.stripe.com/")) {
    throw new Error("Stripe returned an unexpected checkout URL.");
  }
  return { id: payload.id, url: payload.url };
}

export async function fetchCheckoutSession(secretKey: string, sessionId: string) {
  const mode = readStripeMode(secretKey);
  if (!mode.ok) throw new Error("Stripe checkout is limited to a test secret key.");
  if (!sessionId.startsWith("cs_test_")) throw new Error("Only a test-mode Checkout session can be confirmed.");
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${mode.secretKey}` },
  });
  const payload = (await response.json()) as {
    id?: string;
    livemode?: boolean;
    payment_status?: string;
    metadata?: { searchId?: string };
    error?: { message?: string };
  };
  if (!response.ok) throw new Error(payload.error?.message || "Stripe did not return that test session.");
  if (payload.livemode) throw new Error("Refusing a live-mode Stripe session.");
  return payload;
}
