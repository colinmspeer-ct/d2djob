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
import { getIndustry } from "@/data/industries";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { breadcrumbJsonLd, clipDescription, faqJsonLd, seoMetadata, type Crumb, type Faq } from "@/lib/seo";

export function generateStaticParams() {
  return sampleJobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const job = await getPublicJob(slug);
  if (!job) return { title: "Job" };
  const title = `${job.industryName} job in ${job.city}, ${job.state}`;
  return seoMetadata(title, clipDescription(job.description), `/job/${job.slug}`);
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
  const industry = getIndustry(job.industrySlug);
  const cityPath = industry ? `/${industry.geoPrefix}/${job.locationSlug}` : "/jobs";
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Door-to-Door Sales Jobs", path: "/door-to-door-sales" },
    { name: job.industryName, path: `/jobs/${job.industrySlug}` },
    { name: `${job.city}, ${job.state}`, path: cityPath },
    { name: job.title, path: `/job/${job.slug}` },
  ];
  const faqs: Faq[] = [
    {
      question: job.isSample
        ? "Is this door to door sales job a live opening?"
        : "Is this listing still the place to read the offer?",
      answer: job.isSample
        ? "No. This record is marked Sample. It shows the shape of a listing. It is not a requisition you can accept."
        : "Read the description and the valid-through date on this page. The desk unpublishes listings that are no longer open.",
    },
    {
      question: "How is the pay described?",
      answer: job.commissionNote
        ? `The listing says: ${job.commissionNote} Any dollar figure on a sample record is demo data, not a quote.`
        : "Read the pay line on this page. Commission, base plus commission, and hourly plus commission are different plans.",
    },
    {
      question: `Where is the ${job.industryName.toLowerCase()} route?`,
      answer: `The job location is ${job.city}, ${job.state}. The city page for this trade has the local knocking notes, and the industry page explains the work without the street detail.`,
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={{ "@context": "https://schema.org", ...posting }} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs items={crumbs} />
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
      <p className="mt-8 leading-relaxed">
        Local notes for this trade are on the{" "}
        <Link href={cityPath} className="font-medium text-clay hover:underline">
          {job.city} city page
        </Link>
        . The work in general is on the{" "}
        <Link href={`/jobs/${job.industrySlug}`} className="font-medium text-clay hover:underline">
          {job.industryName.toLowerCase()} sales jobs
        </Link>{" "}
        page and the{" "}
        <Link href="/door-to-door-sales" className="font-medium text-clay hover:underline">
          door-to-door sales jobs
        </Link>{" "}
        guide. Hiring managers start on the{" "}
        <Link href="/employers" className="font-medium text-clay hover:underline">
          employers page
        </Link>
        . This preview does not take public applications.
      </p>
      <FaqList faqs={faqs} />
    </article>
  );
}
