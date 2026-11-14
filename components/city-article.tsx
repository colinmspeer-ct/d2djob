import Link from "next/link"
import type { IndustrySlug } from "@/data/industries"
import type { PublicJob } from "@/lib/queries"
import { payLine } from "@/lib/format"
import type { Crumb, Faq } from "@/lib/seo"
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { FaqList } from "@/components/faq-list"
import { JsonLd } from "@/components/json-ld"

export function CityArticle({
  h1,
  paragraphs,
  faqs,
  crumbs,
  industrySlug,
  industryHref,
  industryLabel,
  citySlug,
  nearby,
  jobs,
}: {
  h1: string
  paragraphs: string[]
  faqs: Faq[]
  crumbs: Crumb[]
  industrySlug: IndustrySlug
  industryHref: string
  industryLabel: string
  citySlug: string
  nearby: { href: string; label: string }[]
  jobs: PublicJob[]
}) {
  return (
    <article className="mx-auto grid max-w-3xl gap-8 px-4 py-10">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs items={crumbs} />
      <header className="grid gap-4">
        <h1 className="text-4xl leading-[1.05] sm:text-5xl">{h1}</h1>
        {paragraphs.slice(0, 1).map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
      </header>
      {paragraphs.slice(1).map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="leading-relaxed">
          {paragraph}
        </p>
      ))}
      <p className="leading-relaxed">
        The trade, without the city detail, is on the{" "}
        <Link href={industryHref} className="font-medium text-clay hover:underline">
          {industryLabel}
        </Link>{" "}
        page. The full map of door knocking work is the{" "}
        <Link href="/door-to-door-sales" className="font-medium text-clay hover:underline">
          door-to-door sales jobs
        </Link>{" "}
        guide. Current postings are on the{" "}
        <Link href="/jobs" className="font-medium text-clay hover:underline">
          jobs hub
        </Link>
        .
      </p>
      <section className="grid gap-3">
        <h2 className="text-2xl">Listings here</h2>
        {jobs.length === 0 ? (
          <p className="leading-relaxed">
            No published listing matches this city and trade yet. A sample record on the jobs hub is a demo, not an offer
            in this town.
          </p>
        ) : (
          <ul className="grid gap-3">
            {jobs.map((job) => (
              <li key={job.slug}>
                <Link href={`/job/${job.slug}`} className="block rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{job.title}</span>
                    {job.isSample ? (
                      <span className="rounded-full bg-[#f3e4c4] px-2 py-0.5 text-[0.68rem] font-medium tracking-wide text-[#6a4b12] uppercase">
                        Sample
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{payLine(job)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href={`/?industry=${industrySlug}&location=${citySlug}`} className="text-sm font-medium text-clay">
          Reps on the desk tagged for this trade and city
        </Link>
      </section>
      {nearby.length > 0 ? (
        <section className="grid gap-3">
          <h2 className="text-2xl">Other city pages</h2>
          <ul className="flex flex-wrap gap-2">
            {nearby.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-foreground/10"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <FaqList faqs={faqs} />
    </article>
  )
}
