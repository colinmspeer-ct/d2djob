import { notFound } from "next/navigation";
import { connection } from "next/server";
import { MarketingShell } from "@/components/site-chrome";
import { countryLabel, formatDate } from "@/lib/format";
import { getPublishedJobBySlug } from "@/lib/queries";

export const metadata = { robots: { index: false, follow: false } };

export default async function RolePage(props: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await props.params;
  const job = getPublishedJobBySlug(slug);
  if (!job) notFound();
  const unit = job.salaryUnit === "MONTH" ? "month" : job.salaryUnit === "YEAR" ? "year" : job.salaryUnit === "HOUR" ? "hour" : "";
  const pay =
    job.salaryMin != null
      ? `$${job.salaryMin.toLocaleString()}${job.salaryMax != null ? `–$${job.salaryMax.toLocaleString()}` : ""}${unit ? ` / ${unit}` : ""}`
      : "Pay on request";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: { "@type": "Organization", name: job.hiringOrganization },
    jobLocation: { "@type": "Place", address: job.locationLabel },
  };
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink/50 uppercase">{job.isSample ? "Fictional sample role" : "Role"}</p>
        <h1 className="mt-2 text-5xl">{job.title}</h1>
        <p className="mt-3 text-sm text-ink/70">
          {job.hiringOrganization} pays the hire. {countryLabel(job.country)}. {job.locationLabel}. {pay}. Posted {formatDate(job.datePosted)}.
        </p>
        <p className="mt-6 whitespace-pre-wrap text-sm leading-7">{job.description}</p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>
    </MarketingShell>
  );
}
