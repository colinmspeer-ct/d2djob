import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { CandidateForm } from "@/components/candidate-form";
import { Flash } from "@/components/flash";
import { prisma } from "@/lib/db";

export const instant = false;

export default function EditCandidatePage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="text-sm">Loading candidate…</p>}>
      <EditCandidate params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function EditCandidate({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { id } = await params;
  const query = await searchParams;
  const row = await prisma.candidate.findUnique({
    where: { id },
    include: { industries: true },
  });
  if (!row) notFound();

  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">{row.pseudonym}</h1>
      <CandidateForm
        hasModel={Boolean(process.env.OPENAI_API_KEY)}
        flash={<Flash searchParams={query} />}
        candidate={{
          id: row.id,
          slug: row.slug,
          realName: row.realName,
          phone: row.phone,
          email: row.email,
          interviewNotes: row.interviewNotes,
          pseudonym: row.pseudonym,
          headline: row.headline,
          summary: row.summary,
          background: row.background,
          experience: row.experience,
          personality: row.personality,
          lookingFor: row.lookingFor,
          yearsExperience: row.yearsExperience,
          salesType: row.salesType,
          availability: row.availability,
          willingToTravel: row.willingToTravel,
          payStructure: row.payStructure,
          workStyle: row.workStyle,
          schedule: row.schedule,
          locationSlug: row.locationSlug,
          industrySlugs: row.industries.map((item) => item.industrySlug),
          isSample: row.isSample,
          isPublished: row.isPublished,
          generationSource: row.generationSource,
          photoPublic: row.photoPublic,
          hasOriginal: Boolean(row.photoOriginal),
        }}
      />
    </div>
  );
}
