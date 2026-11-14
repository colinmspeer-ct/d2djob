import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sampleJobs } from "@/data/jobs";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { formatDate, payLine } from "@/lib/format";
import { buildJobPosting } from "@/lib/job-posting";
import { labelFor, EMPLOYMENT_TYPES } from "@/lib/labels";
import { getPublicJob } from "@/lib/queries";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return sampleJobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const job = await getPublicJob(slug);
  if (!job) return { title: "Job" };
  return {
    title: job.title,
    description: job.description.slice(0, 180).replace(/\s+/g, " "),
    alternates: { canonical: `/job/${job.slug}` },
  };
}

export const instant = false;

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const job = await getPublicJob(slug);
  if (!job) notFound();
  return (
    <PageShell>
      <JobDetail job={job} />
    </PageShell>
  );
}

function JobDetail({ job }: { job: NonNullable<Awaited<ReturnType<typeof getPublicJob>>> }) {
  const site = siteUrl();
  const posting = buildJobPosting({
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
    siteUrl: site,
  });
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Jobs", item: `${site}/jobs` },
      { "@type": "ListItem", position: 2, name: job.industryName, item: `${site}/jobs/${job.industrySlug}` },
      { "@type": "ListItem", position: 3, name: job.title, item: `${site}/job/${job.slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={{ "@context": "https://schema.org", ...posting }} />
      <JsonLd data={crumbs} />
      <p className="text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-foreground">
          Jobs
        </Link>
        {" / "}
        <Link href={`/jobs/${job.industrySlug}`} className="hover:text-foreground">
          {job.industryName}
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-4xl leading-[1.05]">{job.title}</h1>
        {job.isSample ? (
          <span className="rounded-full bg-[#f3e4c4] px-2 py-1 text-[0.68rem] font-medium tracking-wide text-[#6a4b12] uppercase">
            Sample
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-muted-foreground">
        {job.city}, {job.state}
        {job.state === "PA" || job.state === "NJ" ? ` · ${job.county}` : ""} · {job.hiringOrganization}
      </p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-card px-4 py-3 ring-1 ring-foreground/10">
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">Employment</dt>
          <dd className="mt-1">{labelFor(EMPLOYMENT_TYPES, job.employmentType)}</dd>
        </div>
        <div className="rounded-2xl bg-card px-4 py-3 ring-1 ring-foreground/10">
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">Pay</dt>
          <dd className="mt-1">{payLine(job)}</dd>
        </div>
        <div className="rounded-2xl bg-card px-4 py-3 ring-1 ring-foreground/10">
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">Posted</dt>
          <dd className="mt-1">{formatDate(job.datePosted)}</dd>
        </div>
        <div className="rounded-2xl bg-card px-4 py-3 ring-1 ring-foreground/10">
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">Valid through</dt>
          <dd className="mt-1">{formatDate(job.validThrough)}</dd>
        </div>
      </dl>
      <div className="mt-8 space-y-4 leading-relaxed whitespace-pre-wrap">{job.description}</div>
      <p className="mt-8 text-sm text-muted-foreground">
        To talk about a listing, start on the{" "}
        <Link href="/employers" className="underline-offset-4 hover:underline">
          employers page
        </Link>
        . This preview does not take public applications.
      </p>
    </article>
  );
}
