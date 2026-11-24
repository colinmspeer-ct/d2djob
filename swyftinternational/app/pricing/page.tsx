import { connection } from "next/server";
import { PricingPanel } from "@/components/pricing-panel";
import { MarketingShell } from "@/components/site-chrome";
import { one } from "@/lib/format";
import { readPlacementTerms } from "@/lib/terms";

export const metadata = { title: "Pricing", robots: { index: false, follow: false } };

export default async function PricingPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  const query = await props.searchParams;
  const raw = Number(String(one(query.salary) || "60000").replace(/[$,]/g, ""));
  const salary = Number.isFinite(raw) ? Math.min(500000, Math.max(18000, Math.round(raw))) : 60000;
  const terms = readPlacementTerms();
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-semibold tracking-[0.14em] text-ink/50 uppercase">Pricing</p>
        <h1 className="mt-2 max-w-3xl text-5xl">You pay the hire. We invoice the placement.</h1>
        <p className="mt-4 max-w-2xl text-ink/75 leading-7">
          The success fee is a share of year-one salary. The deposit only applies when we have to start a search, and it is credited. If they leave inside the guarantee, the replacement search is free.
        </p>
        <div className="mt-10">
          <PricingPanel terms={terms} salaryDollars={salary} />
        </div>
      </section>
    </MarketingShell>
  );
}
