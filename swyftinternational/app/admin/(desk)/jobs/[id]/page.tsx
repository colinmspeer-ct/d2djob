import { notFound } from "next/navigation";
import { connection } from "next/server";
import { JobForm } from "@/components/job-form";
import { getJob } from "@/lib/queries";

export default async function EditJobPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const job = getJob((await props.params).id);
  if (!job) notFound();
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">{job.title}</h1>
      <JobForm job={job} flash={await props.searchParams} />
    </div>
  );
}
