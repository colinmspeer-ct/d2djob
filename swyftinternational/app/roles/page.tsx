import Link from "next/link";
import { connection } from "next/server";
import { MarketingShell } from "@/components/site-chrome";
import { countryLabel, formatDate } from "@/lib/format";
import { listPublishedJobs } from "@/lib/queries";

export const metadata = { title: "Roles", robots: { index: false, follow: false } };

export default async function RolesPage() {
  await connection();
  const jobs = listPublishedJobs();
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-5xl">Roles on the desk</h1>
        <p className="mt-3 text-sm leading-6 text-ink/70">Sample posts are fictional. A published role is a seat the desk is filling, not a job at Swyft.</p>
        <ul className="mt-8 grid gap-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link href={`/roles/${job.slug}`} className="block rounded-[1.4rem] bg-foam p-5 ring-1 ring-ink/10">
                <p className="text-xs font-semibold tracking-[0.14em] text-ink/50 uppercase">{job.isSample ? "Fictional sample" : "Published"}</p>
                <h2 className="mt-1 text-2xl">{job.title}</h2>
                <p className="mt-2 text-sm text-ink/70">
                  {job.hiringOrganization} · {countryLabel(job.country)} · {job.locationLabel} · Posted {formatDate(job.datePosted)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </MarketingShell>
  );
}
