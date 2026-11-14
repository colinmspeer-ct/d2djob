import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndustry } from "@/data/industries";
import { fiberMarkets, getLocation } from "@/data/locations";
import { fiberCities } from "@/content/fiber-cities";
import { CityArticle } from "@/components/city-article";
import { PageShell } from "@/components/page-shell";
import { listPublicJobs } from "@/lib/queries";
import { seoMetadata, type Crumb } from "@/lib/seo";

export function generateStaticParams() {
  return fiberMarkets().map((location) => ({ city: location.slug }));
}

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await props.params;
  const copy = fiberCities[city];
  const location = getLocation(city);
  if (!location?.isFiberMarket || !copy) return { title: "Fiber sales jobs" };
  return seoMetadata(copy.metaTitle, copy.metaDescription, `/fiber-sales-jobs/${location.slug}`);
}

export const instant = false;

export default async function Page(props: { params: Promise<{ city: string }> }) {
  const { city } = await props.params;
  const location = getLocation(city);
  const industry = getIndustry("fiber");
  const copy = fiberCities[city];
  if (!location?.isFiberMarket || !industry || !copy) notFound();

  const jobs = await listPublicJobs("fiber", location.slug);
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Door-to-Door Sales Jobs", path: "/door-to-door-sales" },
    { name: "Fiber Internet Sales Jobs", path: "/jobs/fiber" },
    { name: copy.h1, path: `/fiber-sales-jobs/${location.slug}` },
  ];
  const nearby = copy.nearby.flatMap((slug) => {
    const item = fiberCities[slug];
    const place = getLocation(slug);
    if (!item || !place) return [];
    return [{ href: `/fiber-sales-jobs/${slug}`, label: `Fiber sales jobs in ${place.city}, ${place.state}` }];
  });

  return (
    <PageShell>
      <CityArticle
        h1={copy.h1}
        paragraphs={copy.paragraphs}
        faqs={copy.faqs}
        crumbs={crumbs}
        industrySlug="fiber"
        industryHref="/jobs/fiber"
        industryLabel="fiber internet sales jobs"
        citySlug={location.slug}
        nearby={nearby}
        jobs={jobs}
      />
    </PageShell>
  );
}
