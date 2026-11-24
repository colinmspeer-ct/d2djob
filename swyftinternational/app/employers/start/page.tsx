import { connection } from "next/server";
import { MarketingShell } from "@/components/site-chrome";
import { startSearch } from "@/lib/actions/desk";
import { one } from "@/lib/format";
import { formatUsd, readPlacementTerms } from "@/lib/terms";

export const metadata = { title: "Start a search", robots: { index: false, follow: false } };

export default async function StartPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  const query = await props.searchParams;
  const terms = readPlacementTerms();
  const error = one(query.error);
  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="text-5xl">Start a search</h1>
          <p className="mt-4 text-sm leading-7 text-ink/75">
            Tell us the seat. If the database has a fit, there is no deposit. If it does not, the next step is a {formatUsd(terms.depositCents)} deposit in Stripe test mode, credited toward the {terms.successFeePercent}% fee. The hire’s salary is paid by you.
          </p>
        </div>
        <form action={startSearch} className="grid gap-4 rounded-[1.6rem] bg-foam p-5 ring-1 ring-ink/10">
          {error ? <p className="rounded-xl bg-[#fde8e6] px-3 py-2 text-sm">{error}</p> : null}
          <label className="hidden" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">Your name<input className="input" name="contactName" required /></label>
            <label className="grid gap-1 text-sm">Company<input className="input" name="company" required /></label>
            <label className="grid gap-1 text-sm">Email<input className="input" name="email" type="email" required /></label>
            <label className="grid gap-1 text-sm">Phone<input className="input" name="phone" required /></label>
          </div>
          <label className="grid gap-1 text-sm">Role<input className="input" name="roleTitle" required placeholder="Bilingual client success" /></label>
          <label className="grid gap-1 text-sm">
            First-year salary in dollars
            <input className="input" name="salary" inputMode="numeric" required defaultValue={60000} />
          </label>
          <label className="grid gap-1 text-sm">
            What the person has to be able to do
            <textarea className="area" name="notes" />
          </label>
          <button className="h-11 w-fit rounded-full bg-dandelion px-5 text-sm font-semibold" type="submit">
            Continue to the deposit
          </button>
        </form>
      </section>
    </MarketingShell>
  );
}
