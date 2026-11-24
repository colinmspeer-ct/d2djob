import Link from "next/link";
import { balanceAfterDeposit, formatUsd, successFeeCents, type PlacementTerms } from "@/lib/terms";

export function PricingPanel({ terms, salaryDollars }: { terms: PlacementTerms; salaryDollars: number }) {
  const fee = successFeeCents(salaryDollars * 100, terms.successFeePercent);
  const balance = balanceAfterDeposit(fee, terms.depositCents);
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.6rem] bg-foam p-6 ring-1 ring-ink/10">
          <p className="text-sm font-semibold tracking-[0.14em] text-ink/50 uppercase">Success fee</p>
          <p className="mt-3 font-heading text-6xl">{terms.successFeePercent}%</p>
          <p className="mt-3 text-sm leading-6 text-ink/75">
            Of the hire’s first-year salary, invoiced when they start. You pay the salary to the hire directly.
          </p>
        </article>
        <article className="rounded-[1.6rem] bg-ink p-6 text-paper">
          <p className="text-sm font-semibold tracking-[0.14em] text-dandelion uppercase">New search</p>
          <p className="mt-3 font-heading text-6xl">{formatUsd(terms.depositCents)}</p>
          <p className="mt-3 text-sm leading-6 text-paper/80">
            Deposit to open a search when nobody in the database fits. It is credited toward the fee.
          </p>
        </article>
        <article className="rounded-[1.6rem] bg-foam p-6 ring-1 ring-ink/10">
          <p className="text-sm font-semibold tracking-[0.14em] text-ink/50 uppercase">Replacement</p>
          <p className="mt-3 font-heading text-6xl">{terms.replacementGuaranteeDays}</p>
          <p className="mt-3 text-sm leading-6 text-ink/75">Days. If the hire leaves inside the window, the replacement search is free.</p>
        </article>
      </div>
      <form action="/pricing" className="mt-6 rounded-[1.6rem] bg-white p-5 ring-1 ring-ink/10">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">First-year salary</span>
            <input className="input w-40" name="salary" inputMode="numeric" defaultValue={salaryDollars} />
          </label>
          <button className="h-11 rounded-full bg-dandelion px-5 text-sm font-semibold" type="submit">
            Estimate the fee
          </button>
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-ink/55">Fee at {terms.successFeePercent}%</dt>
            <dd className="font-heading text-2xl">{formatUsd(fee)}</dd>
          </div>
          <div>
            <dt className="text-ink/55">Deposit credited</dt>
            <dd className="font-heading text-2xl">{formatUsd(terms.depositCents)}</dd>
          </div>
          <div>
            <dt className="text-ink/55">Due when they start</dt>
            <dd className="font-heading text-2xl">{formatUsd(balance)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-6 text-ink/70">
          The fee, the deposit, and the replacement window are settings Colin can change. A database match skips the deposit.{" "}
          <Link href="/employers/start" className="font-semibold text-glacier">
            Start a search
          </Link>
        </p>
      </form>
    </div>
  );
}
