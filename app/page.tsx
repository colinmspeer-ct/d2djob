import type { Metadata } from "next";
import { Suspense } from "react";
import { getIndustry } from "@/data/industries";
import { getLocation } from "@/data/locations";
import { JsonLd } from "@/components/json-ld";
import { ListingFilters } from "@/components/filters";
import { PageShell } from "@/components/page-shell";
import { ProfileCard } from "@/components/profile-card";
import { one } from "@/lib/format";
import { listPublicCandidates } from "@/lib/queries";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "D2D Job — door-to-door sales reps" },
  description:
    "Browse anonymized door-to-door sales reps after they interview with the desk. Filter by industry and city, then send an invite or request a meeting.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "D2D Job — door-to-door sales reps",
    description: "Approved reps, without the phone number. Invite the ones you want to meet.",
    url: "/",
  },
};

export default function Home(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteName,
        url: siteUrl(),
        parentOrganization: { "@type": "Organization", name: "Swyft Marketing" },
      },
      { "@type": "WebSite", name: siteName, url: siteUrl() },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={graph} />
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-2 sm:pt-14">
        <p className="text-sm font-medium tracking-wide text-clay">Candidate desk</p>
        <h1 className="mt-2 max-w-3xl text-4xl leading-[1.02] sm:text-6xl">
          Meet the reps. The name stays off the page.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Alex interviews them first. Approved reps show up here with the work history and the offer they will actually take.
          You send an invite or ask for a meeting. Phone numbers stay at the desk.
        </p>
      </section>
      <Suspense
        fallback={<p className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">Loading the desk…</p>}
      >
        <TalentResults searchParams={props.searchParams} />
      </Suspense>
    </PageShell>
  );
}

async function TalentResults({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const industry = getIndustry(one(params.industry)) ? one(params.industry) : "";
  const location = getLocation(one(params.location)) ? one(params.location) : "";
  const travel = one(params.travel) === "1";
  const candidates = await listPublicCandidates(industry, location, travel);
  const place = location ? getLocation(location) : null;
  const trade = industry ? getIndustry(industry) : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <ListingFilters basePath="/" industry={industry} location={location} travel={travel} showTravel />
      <p className="mt-6 text-sm text-muted-foreground">
        {candidates.length} {candidates.length === 1 ? "profile" : "profiles"}
        {trade ? ` in ${trade.name.toLowerCase()}` : ""}
        {place ? ` · ${place.city}, ${place.state}` : ""}
        {travel ? " · will travel" : ""}. Profiles marked Sample are fictional demo records.
      </p>
      {candidates.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-card px-5 py-10 text-center ring-1 ring-foreground/10">
          Nobody on the desk matches that filter. Clear it, or try another city.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <ProfileCard candidate={candidate} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
