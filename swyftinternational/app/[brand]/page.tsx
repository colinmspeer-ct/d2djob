import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandJsonLd } from "@/components/brand-json-ld";
import { brandHref } from "@/components/brand-shell";
import { getBrandConfig } from "@/lib/brands";

export default async function BrandHomePage(props: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await props.params;
  const brand = getBrandConfig(id);
  if (!brand) notFound();

  return (
    <>
      <BrandJsonLd brand={brand} />
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8 md:pt-16">
        <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${brand.accentClass}`}>Preview build · {brand.domain}</p>
        <blockquote className="mt-5 max-w-4xl text-2xl leading-tight md:text-3xl">{brand.quote}</blockquote>
        <h1 className="mt-6 max-w-4xl text-5xl leading-[0.95] md:text-7xl">{brand.h1}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/80">{brand.intro}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={brandHref(brand, "/app")} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper">
            {brand.leadCta}
          </Link>
          <Link href={brandHref(brand, "/pricing")} className="rounded-full px-5 py-3 text-sm font-semibold ring-1 ring-ink/20">
            View pricing model
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="text-3xl md:text-4xl">What the desk includes for {brand.name}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/75">
          One shared codebase, brand-specific copy. Candidate examples in this preview are fictional. No real Stripe keys or live personal data are used.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-[1.4rem] bg-foam p-5 ring-1 ring-ink/10">
            <h3 className="text-2xl">Candidate intake + generated profiles</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">Intake forms feed generated profile drafts for review before shortlist publishing.</p>
          </article>
          <article className="rounded-[1.4rem] bg-foam p-5 ring-1 ring-ink/10">
            <h3 className="text-2xl">Shortlist packets + role posts</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">Shortlists and role posts are organized per site tag so each brand can run independently.</p>
          </article>
          <article className="rounded-[1.4rem] bg-foam p-5 ring-1 ring-ink/10">
            <h3 className="text-2xl">Signed login + training library</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">Private desk and rep-library access are behind login, aligned with the shared Worker and training-library module.</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-3xl md:text-4xl">Role tracks for this brand</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brand.roleTracks.map((role) => (
            <li key={role} className="rounded-2xl bg-white p-4 text-sm ring-1 ring-ink/10">
              {role}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-3xl md:text-4xl">FAQ</h2>
        <div className="mt-6 grid gap-4">
          {brand.faq.map((entry) => (
            <article key={entry.question} className="rounded-[1.2rem] bg-white p-5 ring-1 ring-ink/10">
              <h3 className="text-xl">{entry.question}</h3>
              <p className="mt-2 text-sm leading-7 text-ink/75">{entry.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-[1.8rem] bg-white p-6 ring-1 ring-ink/10 md:p-8">
          <h2 className="text-3xl">Lead form</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-ink/70">
            This preview lead form routes to the brand app view for review. No live outreach, billing, or production contact storage happens in this branch.
          </p>
          <form action={brandHref(brand, "/app")} className="mt-5 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span>Name</span>
              <input className="input" name="name" placeholder="Hiring manager" />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Company</span>
              <input className="input" name="company" placeholder="Company name" />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Email</span>
              <input className="input" type="email" name="email" placeholder="name@company.com" />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Role needed</span>
              <input className="input" name="role" placeholder={brand.roleTracks[0]} />
            </label>
            <button className="mt-1 h-11 w-fit rounded-full bg-ink px-5 text-sm font-semibold text-paper" type="submit">
              Open app intake preview
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
