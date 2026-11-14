import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/db";

export const instant = false;

export default function JobsAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm">Loading jobs…</p>}>
      <JobList />
    </Suspense>
  );
}

async function JobList() {
  await connection();
  const rows = await prisma.job.findMany({
    orderBy: { updatedAt: "desc" },
    include: { location: true, industry: true },
  });
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl">Jobs</h1>
        <Link href="/admin/jobs/new" className="inline-flex h-10 items-center rounded-lg bg-primary px-3.5 text-sm text-primary-foreground">
          Add job
        </Link>
      </div>
      <ul className="grid gap-3">
        {rows.map((row) => (
          <li key={row.id}>
            <Link href={`/admin/jobs/${row.id}`} className="block rounded-3xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{row.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {row.industry.name} · {row.location.city}, {row.location.state}
                  </p>
                </div>
                <div className="flex gap-2 text-xs uppercase tracking-wide">
                  {row.isSample ? <span className="rounded-full bg-[#f3e4c4] px-2 py-1 text-[#6a4b12]">Sample</span> : null}
                  <span className="rounded-full bg-secondary px-2 py-1">{row.isPublished ? "Published" : "Draft"}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
