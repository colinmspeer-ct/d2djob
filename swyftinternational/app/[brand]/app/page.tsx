import Link from "next/link";
import { notFound } from "next/navigation";
import { brandHref } from "@/components/brand-shell";
import { getBrandConfig } from "@/lib/brands";

export const metadata = { title: "App view" };

export default async function BrandAppPage(props: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await props.params;
  const brand = getBrandConfig(id);
  if (!brand) notFound();
  const terms = brand.pricingDefaults;
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold tracking-[0.14em] text-ink/55 uppercase">App view · {brand.name}</p>
      <h1 className="mt-2 text-5xl">Shared recruiting desk configuration for {brand.domain}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/75">
        This view confirms the app modules and brand settings in one shared codebase. Site tag: <strong>{brand.siteTag}</strong>. Stripe remains
        test-mode only in this branch.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.5rem] bg-foam p-6 ring-1 ring-ink/10">
          <h2 className="text-2xl">Candidate intake and generated profiles</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Candidate intake, generated profile drafting, and shortlist packet publishing follow the same desk workflow used by the Swyft International preview.
          </p>
          <p className="mt-3 text-xs text-ink/60">Sample candidates shown in preview are fictional placeholders.</p>
        </article>
        <article className="rounded-[1.5rem] bg-foam p-6 ring-1 ring-ink/10">
          <h2 className="text-2xl">Job posts and meeting requests</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Role posts and meeting requests are grouped by brand identity and site tag while sharing the same Worker/desk pattern.
          </p>
        </article>
        <article className="rounded-[1.5rem] bg-foam p-6 ring-1 ring-ink/10">
          <h2 className="text-2xl">Signed login and training library</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Private desk login and rep training library stay behind signed login. Training content remains keyed by site id through the shared module.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link className="rounded-full bg-ink px-4 py-2 font-semibold text-paper" href="/admin/login">
              Desk login
            </Link>
            <Link className="rounded-full px-4 py-2 ring-1 ring-ink/20" href="/library/login">
              Library login
            </Link>
          </div>
        </article>
        <article className="rounded-[1.5rem] bg-ink p-6 text-paper">
          <h2 className="text-2xl">Fee settings and Stripe mode</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-paper/85">
            <li>Success fee: {terms.successFeePercent}% of first-year salary</li>
            <li>Search deposit: ${(terms.depositCents / 100).toLocaleString("en-US")}</li>
            <li>Replacement window: {terms.replacementDays} days</li>
            <li>Stripe: test mode only (no live keys)</li>
          </ul>
          <Link className="mt-4 inline-flex rounded-full bg-dandelion px-4 py-2 text-sm font-semibold text-ink" href={brandHref(brand, "/pricing")}>
            Open pricing view
          </Link>
        </article>
      </div>
    </section>
  );
}
