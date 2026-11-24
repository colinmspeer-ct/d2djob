import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CandidateCard } from "@/components/candidate-card";
import { MeetingForm } from "@/components/meeting-form";
import { MarketingShell } from "@/components/site-chrome";
import { one } from "@/lib/format";
import { getPublishedCandidateBySlug } from "@/lib/queries";

export const metadata = { robots: { index: false, follow: false } };

export default async function CandidatePage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { slug } = await props.params;
  const query = await props.searchParams;
  const candidate = getPublishedCandidateBySlug(slug);
  if (!candidate) notFound();
  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <CandidateCard candidate={candidate} />
          <div className="mt-6 grid gap-4 text-sm leading-7">
            <p>{candidate.summary}</p>
            <p>{candidate.background}</p>
            <p>{candidate.experience}</p>
            <p>{candidate.lookingFor}</p>
            {candidate.isSample ? <p className="text-ink/60">This profile was invented for the preview. It is not a real person.</p> : null}
          </div>
        </div>
        <MeetingForm candidates={[candidate]} back={`/candidates/${slug}`} sent={one(query.sent) === "1"} />
      </section>
    </MarketingShell>
  );
}
