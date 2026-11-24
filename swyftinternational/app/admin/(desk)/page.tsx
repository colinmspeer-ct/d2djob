import Link from "next/link";
import { connection } from "next/server";
import { counts, listSearches } from "@/lib/queries";
import { sampleShortlistToken } from "@/lib/paths";
import { formatUsd, readPlacementTerms } from "@/lib/terms";

export default async function AdminHome() {
  await connection();
  const stats = counts();
  const terms = readPlacementTerms();
  const searches = listSearches().slice(0, 5);
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl">Overview</h1>
        <Link href="/admin/shortlists/new" className="rounded-full bg-dandelion px-4 py-2 text-sm font-semibold">
          Build a shortlist
        </Link>
      </div>
      <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Candidates", stats.candidates],
          ["Published", stats.published],
          ["Roles", stats.jobs],
          ["Open requests", stats.requests],
          ["Searches", stats.searches],
          ["Shortlists", stats.shortlists],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl bg-foam p-4 ring-1 ring-ink/10">
            <dt className="text-xs tracking-wide text-ink/50 uppercase">{label}</dt>
            <dd className="font-heading text-3xl">{value}</dd>
          </div>
        ))}
      </dl>
      <section className="rounded-[1.4rem] bg-ink p-5 text-paper">
        <h2 className="text-2xl">Current terms</h2>
        <p className="mt-2 text-sm text-paper/80">
          {terms.successFeePercent}% success fee · {formatUsd(terms.depositCents)} deposit · {terms.replacementGuaranteeDays}-day replacement. Change them with environment variables. The sample packet is /s/{sampleShortlistToken()}.
        </p>
      </section>
      <section>
        <h2 className="text-2xl">Recent searches</h2>
        <ul className="mt-3 grid gap-2">
          {searches.map((search) => (
            <li key={search.id} className="rounded-2xl bg-foam px-4 py-3 text-sm ring-1 ring-ink/10">
              {search.company} · {search.roleTitle} · {search.status.replaceAll("_", " ")} · deposit {formatUsd(search.depositCents)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
