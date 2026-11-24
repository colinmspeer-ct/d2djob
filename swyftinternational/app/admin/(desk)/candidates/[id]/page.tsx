import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CandidateForm } from "@/components/candidate-form";
import { getCandidate } from "@/lib/queries";

export default async function EditCandidatePage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { id } = await props.params;
  const candidate = getCandidate(id);
  if (!candidate) notFound();
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">{candidate.realName}</h1>
      <CandidateForm candidate={candidate} flash={await props.searchParams} />
    </div>
  );
}
