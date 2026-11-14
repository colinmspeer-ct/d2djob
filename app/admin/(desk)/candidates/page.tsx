import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/db";

export const instant = false;

export default function CandidatesPage() {
  return (
    <Suspense fallback={<p className="text-sm">Loading candidates…</p>}>
      <CandidateList />
    </Suspense>
  );
}

async function CandidateList() {
  await connection();
  const rows = await prisma.candidate.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      location: true,
      industries: { include: { industry: true } },
    },
  });

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl">Candidates</h1>
        <Link href="/admin/candidates/new" className="inline-flex h-10 items-center rounded-lg bg-primary px-3.5 text-sm text-primary-foreground">
          Add candidate
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-3xl bg-card p-6 text-sm ring-1 ring-foreground/10">No candidates yet.</p>
      ) : (
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={`/admin/candidates/${row.id}`} className="block rounded-3xl bg-card p-4 ring-1 ring-foreground/10">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-heading text-2xl">{row.pseudonym}</p>
                    <p className="text-sm text-muted-foreground">
                      {row.realName} · {row.location.city}, {row.location.state}
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs uppercase tracking-wide">
                    {row.isSample ? <span className="rounded-full bg-[#f3e4c4] px-2 py-1 text-[#6a4b12]">Sample</span> : null}
                    <span className="rounded-full bg-secondary px-2 py-1">{row.isPublished ? "Published" : "Draft"}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {row.industries.map((item) => item.industry.name).join(", ") || "No industry"} · {row.email}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
