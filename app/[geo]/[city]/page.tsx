import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { featuredNonFiberCities, resolveIndustryGeo } from "@/data/geo";
import { industries } from "@/data/industries";
import { GeoScaffold } from "@/components/geo-scaffold";
import { PageShell } from "@/components/page-shell";
import { listPublicJobs } from "@/lib/queries";

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
  return {
    title: `${match.industry.name} sales jobs in ${match.location.city}, ${match.location.state}`,
    description: `Door-to-door ${match.industry.name.toLowerCase()} sales jobs in ${match.location.city}, ${match.location.stateName}.`,
    alternates: { canonical: `/${match.industry.geoPrefix}/${match.location.slug}` },
  };
}

export default function Page(props: { params: Promise<{ geo: string; city: string }> }) {
  return (
    <PageShell>
      <Suspense fallback={<p className="px-4 py-10 text-sm">Loading market…</p>}>
        <GeoPage params={props.params} />
      </Suspense>
    </PageShell>
  );
}

async function GeoPage({ params }: { params: Promise<{ geo: string; city: string }> }) {
  const { geo, city } = await params;
  const match = resolveIndustryGeo(geo, city);
  if (!match || match.industry.slug === "fiber") notFound();
  const jobs = await listPublicJobs(match.industry.slug, match.location.slug);
  return <GeoScaffold industry={match.industry} location={match.location} jobs={jobs} />;
}
