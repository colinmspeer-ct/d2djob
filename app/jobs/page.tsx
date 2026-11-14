import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getIndustry } from "@/data/industries";
import { getLocation } from "@/data/locations";
import { ListingFilters } from "@/components/filters";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { formatDate, one, payLine } from "@/lib/format";
import { buildJobPostingGraph, type JobPostingInput } from "@/lib/job-posting";
import { labelFor, EMPLOYMENT_TYPES } from "@/lib/labels";
import { listPublicJobs, type PublicJob } from "@/lib/queries";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Door to Door Sales Jobs",
  description:
    "Door to door sales jobs and d2d sales jobs by industry and city. Fiber roles are listed in official AT&T Fiber markets. Other trades include South Jersey, the Philadelphia suburbs, Lancaster, Chicago, and Boston.",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "Door to Door Sales Jobs",
    description: "Filter door-to-door and d2d sales jobs by industry and city.",
    url: "/jobs",
  },
};

export default function JobsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-2 sm:pt-14">
        <p className="text-sm font-medium tracking-wide text-clay">Jobs hub</p>
        <h1 className="mt-2 max-w-3xl text-4xl leading-[1.02] sm:text-6xl">Door to door sales jobs</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Openings for door-to-door and d2d sales work, sorted by industry and city. Fiber seats are listed only in
          official AT&T Fiber markets. Pest, roofing, windows, and exterior work can sit in other cities, including
          South Jersey, the Philadelphia suburbs, Lancaster, Chicago, and Boston.
        </p>
      </section>
      <Suspense fallback={<p className="mx-auto max-w-6xl px-4 py-10 text-sm">Loading listings…</p>}>
        <JobResults searchParams={props.searchParams} />
      </Suspense>
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

async function JobResults({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const industry = getIndustry(one(params.industry)) ? one(params.industry) : "";
  const location = getLocation(one(params.location)) ? one(params.location) : "";
  const jobs = await listPublicJobs(industry, location);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd data={buildJobPostingGraph(jobs.map(toPosting))} />
      <ListingFilters basePath="/jobs" industry={industry} location={location} />
      <p className="mt-6 text-sm text-muted-foreground">
        {jobs.length} {jobs.length === 1 ? "listing" : "listings"}. Sample badges are demo records, not live requisitions.
      </p>
      {jobs.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-card px-5 py-10 text-center ring-1 ring-foreground/10">
          No published job matches that filter.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {jobs.map((job) => (
            <li key={job.slug}>
              <Link
                href={`/job/${job.slug}`}
                className="desk-card block rounded-3xl bg-card p-5 ring-1 ring-foreground/10"
              >
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
    </section>
  );
}
