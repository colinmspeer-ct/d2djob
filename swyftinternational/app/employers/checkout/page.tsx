import Link from "next/link";
import { connection } from "next/server";
import { MarketingShell } from "@/components/site-chrome";
import { recordPreviewHold, startCheckout } from "@/lib/actions/desk";
import { one } from "@/lib/format";
import { getSearch } from "@/lib/queries";
import { readStripeMode } from "@/lib/stripe";
import { balanceAfterDeposit, formatUsd, successFeeCents } from "@/lib/terms";

export const metadata = { title: "Deposit", robots: { index: false, follow: false } };

export default async function CheckoutPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  const query = await props.searchParams;
  const search = getSearch(one(query.search));
  const error = one(query.error);
  const mode = readStripeMode();
  if (!search) {
    return (
      <MarketingShell>
        <section className="mx-auto max-w-xl px-4 py-20">
          <h1 className="text-4xl">Start again</h1>
          <Link href="/employers/start" className="mt-4 inline-flex text-glacier">Back to intake</Link>
        </section>
      </MarketingShell>
    );
  }
  const fee = successFeeCents(search.firstYearSalaryCents, search.feePercent);
  const balance = balanceAfterDeposit(fee, search.depositCents);
  return (
    <MarketingShell>
      <section className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-5xl">Search deposit</h1>
        <p className="mt-3 text-sm leading-6 text-ink/75">
          {search.company} · {search.roleTitle}. Fee {formatUsd(fee)} at {search.feePercent}%. Deposit {formatUsd(search.depositCents)} credited. Balance if you hire: {formatUsd(balance)}. Replacement window: {search.guaranteeDays} days.
        </p>
        {error ? <p className="mt-4 rounded-xl bg-[#fde8e6] px-3 py-2 text-sm">{error}</p> : null}
        {mode.ok ? (
          <form action={startCheckout} className="mt-6">
            <input type="hidden" name="searchId" value={search.id} />
            <button className="h-11 rounded-full bg-dandelion px-5 text-sm font-semibold" type="submit">
              Continue to Stripe test checkout
            </button>
            <p className="mt-3 text-xs text-ink/60">Test key detected. Live keys are refused. This button cannot create a live charge.</p>
          </form>
        ) : (
          <form action={recordPreviewHold} className="mt-6 grid gap-3">
            <input type="hidden" name="searchId" value={search.id} />
            <p className="rounded-xl bg-[#fff4d4] px-3 py-2 text-sm">
              {mode.reason === "live"
                ? "A live Stripe key is set. This preview will not use it, and nothing will be charged."
                : "No Stripe test key is set. Recording a preview hold does not call Stripe and does not charge a card."}
            </p>
            {mode.reason === "live" ? null : (
              <button className="h-11 w-fit rounded-full bg-ink px-5 text-sm font-semibold text-paper" type="submit">
                Record a preview hold
              </button>
            )}
          </form>
        )}
      </section>
    </MarketingShell>
  );
}
