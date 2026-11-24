import "server-only";
import { markDepositPaid } from "./queries";
import { fetchCheckoutSession, readStripeMode } from "./stripe";

export async function confirmDepositSession(searchId: string, sessionId: string) {
  const mode = readStripeMode();
  if (!mode.ok) return { ok: false as const, message: "Stripe test mode is not configured." };
  try {
    const session = await fetchCheckoutSession(mode.secretKey, sessionId);
    if (session.metadata?.searchId && session.metadata.searchId !== searchId) {
      return { ok: false as const, message: "That Checkout session belongs to a different search." };
    }
    if (session.payment_status === "paid" && session.id) {
      markDepositPaid(searchId, session.id);
      return { ok: true as const, paid: true as const };
    }
    return { ok: true as const, paid: false as const };
  } catch (error) {
    return { ok: false as const, message: error instanceof Error ? error.message : "Could not confirm the test session." };
  }
}
