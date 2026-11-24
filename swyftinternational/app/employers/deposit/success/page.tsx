import Link from "next/link";
import { connection } from "next/server";
import { MarketingShell } from "@/components/site-chrome";
import { confirmDepositSession } from "@/lib/checkout";
import { one } from "@/lib/format";
import { getSearch } from "@/lib/queries";

export const metadata = { title: "Deposit", robots: { index: false, follow: false } };

export default async function DepositSuccessPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const query = await props.searchParams;
  const search = getSearch(one(query.search));
  const preview = one(query.preview) === "1";
  const sessionId = one(query.session_id);
  let note = "Nothing was charged.";
  if (search && sessionId && sessionId !== "{CHECKOUT_SESSION_ID}") {
    const result = await confirmDepositSession(search.id, sessionId);
    note = result.ok && result.paid ? "Stripe test mode reports this deposit as paid. It was not a live charge." : result.ok ? "Stripe has the test session, and it is not paid yet." : result.message;
  } else if (preview) {
    note = "Preview hold recorded. Stripe was not called, and no card was charged. The deposit is still credited on paper toward the fee.";
  }
  const current = search ? getSearch(search.id) : null;
  return (
    <MarketingShell>
      <section className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-5xl">{current?.status === "deposit_paid" ? "Test deposit paid" : "Deposit step recorded"}</h1>
        <p className="mt-4 text-sm leading-7">{note}</p>
        {current ? <p className="mt-2 text-sm text-ink/60">Status on the desk: {current.status.replaceAll("_", " ")}.</p> : null}
        <Link href="/" className="mt-6 inline-flex rounded-full bg-dandelion px-5 py-3 text-sm font-semibold">
          Back to the homepage
        </Link>
      </section>
    </MarketingShell>
  );
}
