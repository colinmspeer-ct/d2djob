import { Suspense } from "react";
import { connection } from "next/server";
import { CandidateForm } from "@/components/candidate-form";
import { Flash } from "@/components/flash";

export const instant = false;

export default function NewCandidatePage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="text-sm">Loading form…</p>}>
      <NewCandidate searchParams={props.searchParams} />
    </Suspense>
  );
}

async function NewCandidate({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const query = await searchParams;
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">Add a candidate</h1>
      <CandidateForm candidate={null} hasModel={Boolean(process.env.OPENAI_API_KEY)} flash={<Flash searchParams={query} />} />
    </div>
  );
}
