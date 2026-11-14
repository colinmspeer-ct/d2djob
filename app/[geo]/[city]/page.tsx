import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { featuredNonFiberCities, resolveIndustryGeo } from "@/data/geo";
import { industries } from "@/data/industries";
import { getLocation } from "@/data/locations";
import { getTradePage } from "@/content/trade-pages";
import { CityArticle } from "@/components/city-article";
import { GeoScaffold } from "@/components/geo-scaffold";
import { PageShell } from "@/components/page-shell";
import { listPublicJobs } from "@/lib/queries";
import { seoMetadata, type Crumb } from "@/lib/seo";

export function generateStaticParams() {
  const params: { geo: string; city: string }[] = [];
  for (const industry of industries) {
    if (industry.slug === "fiber") continue;
    for (const city of featuredNonFiberCities) {
      params.push({ geo: industry.geoPrefix, city });
    }
  }
  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ geo: string; city: string }>;
}): Promise<Metadata> {
  const { geo, city } = await props.params;
  const match = resolveIndustryGeo(geo, city);
  if (!match || match.industry.slug === "fiber") return { title: "Sales jobs" };
  const copy = getTradePage(match.industry.slug, match.location.slug);
  if (!copy) {
    return {
      title: `${match.industry.name} jobs`,
      description: `Door-to-door ${match.industry.name.toLowerCase()} sales jobs in ${match.location.city}, ${match.location.stateName}. City notes for this page are still being written.`,
    };
  }
  return seoMetadata(copy.metaTitle, copy.metaDescription, `/${match.industry.geoPrefix}/${match.location.slug}`);
}

export const instant = false;

export default async function Page(props: { params: Promise<{ geo: string; city: string }> }) {
  const { geo, city } = await props.params;
  const match = resolveIndustryGeo(geo, city);
  if (!match || match.industry.slug === "fiber") notFound();
  const jobs = await listPublicJobs(match.industry.slug, match.location.slug);
  const copy = getTradePage(match.industry.slug, match.location.slug);
  if (!copy) {
    return (
      <PageShell>
        <GeoScaffold industry={match.industry} location={match.location} jobs={jobs} />
      </PageShell>
    );
  }
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Door-to-Door Sales Jobs", path: "/door-to-door-sales" },
    { name: `${match.industry.name} sales jobs`, path: `/jobs/${match.industry.slug}` },
    { name: copy.h1, path: `/${match.industry.geoPrefix}/${match.location.slug}` },
  ];
  const nearby = copy.nearby.flatMap((slug) => {
    const place = getLocation(slug);
    const sibling = getTradePage(match.industry.slug, slug);
    if (!place || !sibling) return [];
    return [
      {
        href: `/${match.industry.geoPrefix}/${slug}`,
        label: `${match.industry.name} sales jobs in ${place.city}, ${place.state}`,
      },
    ];
  });

  return (
    <PageShell>
      <CityArticle
        h1={copy.h1}
        paragraphs={copy.paragraphs}
        faqs={copy.faqs}
        crumbs={crumbs}
        industrySlug={match.industry.slug}
        industryHref={`/jobs/${match.industry.slug}`}
        industryLabel={`${match.industry.name.toLowerCase()} sales jobs`}
        citySlug={match.location.slug}
        nearby={nearby}
        jobs={jobs}
      />
    </PageShell>
  );
}
