import Link from "next/link";
import { connection } from "next/server";
import { listJobs } from "@/lib/queries";

export default async function JobsPage() {
  await connection();
  const jobs = listJobs();
  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-4xl">Roles</h1>
        <Link href="/admin/jobs/new" className="rounded-full bg-dandelion px-4 py-2 text-sm font-semibold">Add role</Link>
      </div>
      <ul className="grid gap-2">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link href={`/admin/jobs/${job.id}`} className="block rounded-2xl bg-foam px-4 py-3 ring-1 ring-ink/10">
              {job.title} <span className="text-sm text-ink/60">· {job.hiringOrganization} · {job.isPublished ? "Published" : "Draft"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
