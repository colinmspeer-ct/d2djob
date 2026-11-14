import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { industries, getIndustry } from "@/data/industries";
import { fiberMarkets, locations } from "@/data/locations";
import { PageShell } from "@/components/page-shell";
import { TodoCallout } from "@/components/todo-callout";
import { payLine } from "@/lib/format";
import { listPublicJobs } from "@/lib/queries";

export function generateStaticParams() {
  return industries.map((industry) => ({ industry: industry.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry: slug } = await props.params;
  const industry = getIndustry(slug);
  if (!industry) return { title: "Jobs" };
  const description =
    industry.slug === "fiber"
      ? "Door-to-door fiber sales jobs in official AT&T Fiber markets, from Raleigh and Charlotte to Atlanta, Miami, and the rest of the first 20 cities."
      : `Door-to-door ${industry.name.toLowerCase()} sales jobs. City pages include markets outside AT&T Fiber, such as South Jersey, the Philadelphia suburbs, and Lancaster.`;
  return {
    title: `${industry.name} sales jobs`,
    description,
    alternates: { canonical: `/jobs/${industry.slug}` },
  };
}

export default function Page(props: { params: Promise<{ industry: string }> }) {
  return (
    <PageShell>
      <Suspense fallback={<p className="px-4 py-10 text-sm">Loading industry…</p>}>
        <IndustryPage params={props.params} />
      </Suspense>
    </PageShell>
  );
}

async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();
  const jobs = await listPublicJobs(industry.slug, "");
  const cities = industry.slug === "fiber" ? fiberMarkets() : locations;

  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <div className="max-w-3xl">
        <p className="text-sm text-muted-foreground">
          <Link href="/jobs" className="hover:text-foreground">
            Door to door sales jobs
          </Link>
        </p>
        <h1 className="mt-2 text-4xl leading-[1.05] sm:text-5xl">{industry.name} sales jobs</h1>
        {industry.slug === "fiber" ? (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Fiber city pages are limited to official AT&T Fiber markets. Reps can still live in South Jersey, the
            Philadelphia suburbs, Lancaster, Chicago, or Boston and sell other products. Those profiles stay on the
            talent desk. They do not get a fiber city URL.
          </p>
        ) : (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {industry.name} routes can be listed in any city on the desk, including places AT&T Fiber does not serve.
          </p>
        )}
        <div className="mt-4">
          <TodoCallout>
            <p>
              Replace this scaffold with the full {industry.name.toLowerCase()} sales jobs article: what the week looks
              like, how pay is usually split between base and commission, and which kinds of companies hire.
            </p>
          </TodoCallout>
        </div>
      </div>
      <section>
        <h2 className="text-2xl">Open listings</h2>
        {jobs.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No published {industry.name.toLowerCase()} listing yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {jobs.map((job) => (
              <li key={job.slug}>
                <Link href={`/job/${job.slug}`} className="block rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
                  <p className="font-medium">{job.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{payLine(job)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="text-2xl">Cities</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {cities.map((location) => (
            <li key={location.slug}>
              <Link
                href={`/${industry.geoPrefix}/${location.slug}`}
                className="inline-flex rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-foreground/10"
              >
                {location.city}, {location.state}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
