import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { placeLabel } from "@/data/locations";
import { Avatar } from "@/components/avatar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { candidateTags } from "@/components/profile-card";
import { RequestForm } from "@/components/request-form";
import { one } from "@/lib/format";
import { labelFor, SCHEDULES, WORK_STYLES } from "@/lib/labels";
import { getPublicCandidate } from "@/lib/queries";
import { sampleCandidates } from "@/data/samples";
import { breadcrumbJsonLd, clipDescription, seoMetadata, type Crumb } from "@/lib/seo";

export function generateStaticParams() {
  return sampleCandidates.map((candidate) => ({ slug: candidate.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const candidate = await getPublicCandidate(slug);
  if (!candidate) return { title: "Profile" };
  const title = `${candidate.pseudonym}, ${candidate.city} ${candidate.state}`;
  return seoMetadata(
    title,
    clipDescription(candidate.summary),
    `/candidates/${candidate.slug}`,
  );
}

export const instant = false;

export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await props.params;
  const query = await props.searchParams;
  const candidate = await getPublicCandidate(slug);
  if (!candidate) notFound();
  return (
    <PageShell>
      <Profile candidate={candidate} sent={one(query.sent)} />
    </PageShell>
  );
}

async function Profile({
  candidate,
  sent,
}: {
  candidate: NonNullable<Awaited<ReturnType<typeof getPublicCandidate>>>;
  sent: string;
}) {
  const tags = candidateTags(candidate);
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: `${candidate.pseudonym}, ${candidate.city}`, path: `/candidates/${candidate.slug}` },
  ];

  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="lg:col-span-2">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <Breadcrumbs items={crumbs} />
      </div>
      <div>
        {candidate.isSample ? (
          <p className="mb-4 rounded-2xl bg-[#fbf6ea] px-4 py-3 text-sm text-[#5c4a1d]">
            Sample profile. This rep is fictional demo data, not someone you can hire.
          </p>
        ) : null}
        <div className="flex items-center gap-4">
          <Avatar name={candidate.pseudonym} photo={candidate.photo} size={84} />
          <div>
            <h1 className="text-4xl leading-none sm:text-5xl">{candidate.pseudonym}</h1>
            <p className="mt-2 text-muted-foreground">{placeLabel(candidate)}</p>
          </div>
        </div>
        <p className="mt-6 text-2xl leading-snug">{candidate.headline}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full bg-secondary px-3 py-1 text-sm">
              {tag}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">{candidate.summary}</p>
        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          <Fact label="Experience" value={candidate.yearsExperience != null ? `${candidate.yearsExperience} years` : "Not listed"} />
          <Fact label="Sells" value={candidate.salesType || candidate.industries.map((item) => item.name).join(", ")} />
          <Fact label="Pay" value={candidate.payStructure || "Ask the desk"} />
          <Fact label="Schedule" value={candidate.schedule ? labelFor(SCHEDULES, candidate.schedule) : "Not listed"} />
          <Fact label="Seat" value={candidate.workStyle ? labelFor(WORK_STYLES, candidate.workStyle) : "Not listed"} />
          <Fact label="Travel" value={candidate.willingToTravel ? "Will travel" : "Stays local"} />
          <Fact label="Availability" value={candidate.availability || "Ask the desk"} />
        </dl>
        <Section title="Background" body={candidate.background} />
        <Section title="Sales experience" body={candidate.experience} />
        <Section title="On the door" body={candidate.personality} />
        <Section title="What they want" body={candidate.lookingFor} />
        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to the desk
          </Link>
        </p>
      </div>
      <aside className="grid content-start gap-4 lg:sticky lg:top-20">
        <RequestForm slug={candidate.slug} type="invite" sent={sent === "invite"} />
        <RequestForm slug={candidate.slug} type="meeting" sent={sent === "meeting"} />
      </aside>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card px-4 py-3 ring-1 ring-foreground/10">
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <section className="mt-8 max-w-2xl">
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-2 leading-relaxed">{body}</p>
    </section>
  );
}
