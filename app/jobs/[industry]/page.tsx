import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, getIndustry, type IndustrySlug } from "@/data/industries";
import { fiberMarkets, locations, locationsByGroup } from "@/data/locations";
import { industryArticles } from "@/content/industry-pages";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { payLine } from "@/lib/format";
import { listPublicJobs } from "@/lib/queries";
import { breadcrumbJsonLd, faqJsonLd, seoMetadata, type Crumb } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((industry) => ({ industry: industry.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry: slug } = await props.params;
  const article = industryArticles[slug as IndustrySlug];
  if (!article) return { title: "Jobs" };
  return seoMetadata(article.metaTitle, article.metaDescription, `/jobs/${slug}`);
}

export const instant = false;

export default async function Page(props: { params: Promise<{ industry: string }> }) {
  const { industry: slug } = await props.params;
  const industry = getIndustry(slug);
  const article = industryArticles[slug as IndustrySlug];
  if (!industry || !article) notFound();

  const jobs = await listPublicJobs(industry.slug, "");
  const cities = industry.slug === "fiber" ? fiberMarkets() : locations;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Door-to-Door Sales Jobs", path: "/door-to-door-sales" },
    { name: article.h1, path: `/jobs/${industry.slug}` },
  ];
  const grouped = locationsByGroup().filter(([, items]) =>
    items.some((item) => cities.some((city) => city.slug === item.slug)),
  );

  return (
    <PageShell>
      <article className="mx-auto grid max-w-3xl gap-8 px-4 py-10">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <JsonLd data={faqJsonLd(article.faqs)} />
        <Breadcrumbs items={crumbs} />
        <header className="grid gap-4">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">{article.h1}</h1>
          <p className="text-lg leading-relaxed">{article.lede}</p>
          <p className="leading-relaxed">
            The longer map of the work sits on the{" "}
            <Link href="/door-to-door-sales" className="font-medium text-clay hover:underline">
              door-to-door sales jobs
            </Link>{" "}
            page. Open listings are on the{" "}
            <Link href="/jobs" className="font-medium text-clay hover:underline">
              jobs hub
            </Link>
            .
          </p>
        </header>
        {article.sections.map((section) => (
          <section key={section.heading} className="grid gap-3">
            <h2 className="text-2xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        <section className="grid gap-3">
          <h2 className="text-2xl">Open listings</h2>
          {jobs.length === 0 ? (
            <p className="leading-relaxed">
              No published {industry.name.toLowerCase()} listing is on the hub right now.
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
        </section>
        <section className="grid gap-4">
          <h2 className="text-2xl">Cities</h2>
          {grouped.map(([group, items]) => (
            <div key={group}>
              <h3 className="text-lg">{group}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {items
                  .filter((location) => cities.some((city) => city.slug === location.slug))
                  .map((location) => (
                    <li key={location.slug}>
                      <Link
                        href={`/${industry.geoPrefix}/${location.slug}`}
                        className="inline-flex rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-foreground/10"
                      >
                        {article.h1.replace(/ Jobs$/, "")} in {location.city}, {location.state}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </section>
        <FaqList faqs={article.faqs} />
      </article>
    </PageShell>
  );
}
