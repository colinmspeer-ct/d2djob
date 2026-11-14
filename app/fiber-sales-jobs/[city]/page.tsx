import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getIndustry } from "@/data/industries";
import { fiberMarkets, getLocation } from "@/data/locations";
import { GeoScaffold } from "@/components/geo-scaffold";
import { PageShell } from "@/components/page-shell";
import { listPublicJobs } from "@/lib/queries";

export function generateStaticParams() {
  return fiberMarkets().map((location) => ({ city: location.slug }));
}

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await props.params;
  const location = getLocation(city);
  if (!location?.isFiberMarket) return { title: "Fiber sales jobs" };
  return {
    title: `Fiber sales jobs in ${location.city}, ${location.state}`,
    description: `Door-to-door fiber sales jobs in ${location.city}, ${location.stateName}. This page is reserved for an official AT&T Fiber market.`,
    alternates: { canonical: `/fiber-sales-jobs/${location.slug}` },
  };
}

export default function Page(props: { params: Promise<{ city: string }> }) {
  return (
    <PageShell>
      <Suspense fallback={<p className="px-4 py-10 text-sm">Loading market…</p>}>
        <FiberCity params={props.params} />
      </Suspense>
    </PageShell>
  );
}

async function FiberCity({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const location = getLocation(city);
  const industry = getIndustry("fiber");
  if (!location?.isFiberMarket || !industry) notFound();
  const jobs = await listPublicJobs("fiber", location.slug);
  return <GeoScaffold industry={industry} location={location} jobs={jobs} />;
}
