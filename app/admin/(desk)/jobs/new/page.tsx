import { Suspense } from "react";
import { connection } from "next/server";
import { Flash } from "@/components/flash";
import { JobForm } from "@/components/job-form";

export const instant = false;

export default function NewJobPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="text-sm">Loading form…</p>}>
      <NewJob searchParams={props.searchParams} />
    </Suspense>
  );
}

async function NewJob({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const query = await searchParams;
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">Add a job</h1>
      <JobForm job={null} flash={<Flash searchParams={query} />} />
    </div>
  );
}
