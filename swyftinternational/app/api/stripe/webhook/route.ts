import { markDepositPaid } from "@/lib/queries";
import { readStripeMode, verifyStripeSignature } from "@/lib/stripe";

export async function POST(request: Request) {
  const mode = readStripeMode();
  if (!mode.ok) return Response.json({ error: "Stripe test mode is not configured." }, { status: 400 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  if (!secret) return Response.json({ error: "Set STRIPE_WEBHOOK_SECRET for the test endpoint." }, { status: 400 });
  const payload = await request.text();
  if (!verifyStripeSignature(payload, request.headers.get("stripe-signature") ?? "", secret)) {
    return Response.json({ error: "Bad signature." }, { status: 400 });
  }
  const event = JSON.parse(payload) as {
    type?: string;
    livemode?: boolean;
    data?: { object?: { id?: string; payment_status?: string; metadata?: { searchId?: string } } };
  };
  if (event.livemode) return Response.json({ error: "Live mode refused." }, { status: 400 });
  const object = event.data?.object;
  if (
    event.type === "checkout.session.completed" &&
    object?.payment_status === "paid" &&
    object.metadata?.searchId &&
    object.id?.startsWith("cs_test_")
  ) {
    markDepositPaid(object.metadata.searchId, object.id);
  }
  return Response.json({ received: true });
}
