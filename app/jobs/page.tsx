import type { Metadata } from "next";
import Link from "next/link";
import { ListingFilters } from "@/components/filters";
import { LiveFilter } from "@/components/live-filter";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { formatDate, payLine } from "@/lib/format";
import { buildJobPostingGraph, type JobPostingInput } from "@/lib/job-posting";
import { labelFor, EMPLOYMENT_TYPES } from "@/lib/labels";
import { listPublicJobs, type PublicJob } from "@/lib/queries";
import { siteUrl } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd, seoMetadata, type Crumb, type Faq } from "@/lib/seo";

const title = "D2D Sales Job Openings – Browse Current Roles";
const description =
  "Browse current door-to-door sales job openings by trade and city. A Sample badge means the record is demo data, not a live offer.";

export const metadata: Metadata = seoMetadata(title, description, "/jobs");

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Current Door-to-Door Sales Job Openings", path: "/jobs" },
];

const faqs: Faq[] = [
  {
    question: "Which openings are listed on this page?",
    answer:
      "Published listings for fiber, pest control, roofing, windows and doors, window cleaning, exterior cleaning, and other exterior sales. Sample badges mean the record is demo data, not a live offer.",
  },
  {
    question: "Why are some cities missing from fiber filters?",
    answer:
      "Fiber listings are limited to official AT&T Fiber markets. South Jersey, the Philadelphia suburbs, Lancaster, Chicago, and Boston can still appear for other trades.",
  },
  {
    question: "How do I read a d2d sales job listing?",
    answer:
      "Check the city, the product, the season, and how pay is described. Commission on a signature is not the same as commission on an install. The dollar amount, if any, is on that listing and may be a sample.",
  },
];

export const instant = false;

export default async function JobsPage() {
  const jobs = await listPublicJobs("", "");

  return (
    <PageShell>
      <article className="mx-auto max-w-6xl px-4 py-10">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <JsonLd data={faqJsonLd(faqs)} />
        <JsonLd data={buildJobPostingGraph(jobs.map(toPosting))} />
        <LiveFilter />
        <Breadcrumbs items={crumbs} />
        <p className="mt-4 text-sm font-medium tracking-wide text-clay">Open listings</p>
        <h1 className="mt-2 max-w-3xl text-4xl leading-[1.02] sm:text-6xl">
          Current Door-to-Door Sales Job Openings
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">
          Filter current door-to-door roles by trade and city. Fiber seats stay in official AT&T Fiber markets. Pest,
          roofing, windows, and exterior work can sit in South Jersey, the Philadelphia suburbs, Lancaster, Chicago,
          and Boston. A Sample badge means the record is demo data, not a live offer. Read the guide to{" "}
          <Link href="/door-to-door-sales" className="font-medium text-clay hover:underline">
            learn what door-to-door sales jobs involve
          </Link>
          .
        </p>
        <div className="mt-8">
          <ListingFilters basePath="/jobs" industry="" location="" />
        </div>
        <p className="mt-6 text-sm text-muted-foreground" data-filter-count>
          {jobs.length} {jobs.length === 1 ? "listing" : "listings"}. A Sample badge means the record is demo data, not a
          live requisition.
        </p>
        {jobs.length === 0 ? (
          <p className="mt-8 rounded-3xl bg-card px-5 py-10 text-center ring-1 ring-foreground/10">
            No published job matches that filter.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4">
            {jobs.map((job) => (
              <li
                key={job.slug}
                data-filter-item
                data-industries={job.industrySlug}
                data-location={job.locationSlug}
                data-travel="1"
              >
                <Link href={`/job/${job.slug}`} className="desk-card block rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl leading-snug">{job.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {job.city}, {job.state} · {job.industryName} · {labelFor(EMPLOYMENT_TYPES, job.employmentType)}
                      </p>
                    </div>
                    {job.isSample ? (
                      <span className="rounded-full bg-[#f3e4c4] px-2 py-1 text-[0.68rem] font-medium tracking-wide text-[#6a4b12] uppercase">
                        Sample
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">{payLine(job)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Posted {formatDate(job.datePosted)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10">
          <FaqList faqs={faqs} />
        </div>
      </article>
    </PageShell>
  );
}

function toPosting(job: PublicJob): JobPostingInput {
  return {
    slug: job.slug,
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: job.hiringOrganization,
    city: job.city,
    state: job.state,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryUnit: job.salaryUnit,
    commissionNote: job.commissionNote,
    siteUrl: siteUrl(),
  };
}
