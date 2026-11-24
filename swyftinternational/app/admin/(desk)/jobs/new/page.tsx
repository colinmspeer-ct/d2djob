import { connection } from "next/server";
import { JobForm } from "@/components/job-form";

export default async function NewJobPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">New role</h1>
      <JobForm job={null} flash={await props.searchParams} />
    </div>
  );
}
