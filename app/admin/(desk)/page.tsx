import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/db";

export const instant = false;

export default function AdminHome() {
  return (
    <Suspense fallback={<p className="text-sm">Loading overview…</p>}>
      <Overview />
    </Suspense>
  );
}

async function Overview() {
  await connection();
  const [published, drafts, requests, jobs] = await Promise.all([
    prisma.candidate.count({ where: { isPublished: true } }),
    prisma.candidate.count({ where: { isPublished: false } }),
    prisma.contactRequest.count({ where: { status: "new" } }),
    prisma.job.count({ where: { isPublished: true } }),
  ]);
  const cards = [
    { href: "/admin/candidates", label: "Published profiles", value: published },
    { href: "/admin/candidates", label: "Unpublished candidates", value: drafts },
    { href: "/admin/requests", label: "New requests", value: requests },
    { href: "/admin/jobs", label: "Published jobs", value: jobs },
  ];
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-4xl">Desk</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Add a candidate after the interview, generate the public profile, and publish it when the copy is right.
          Invites and meeting requests land here.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.label}>
            <Link href={card.href} className="block rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-2 font-heading text-4xl">{card.value}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/candidates/new" className="inline-flex h-10 items-center rounded-lg bg-primary px-3.5 text-sm text-primary-foreground">
          Add candidate
        </Link>
        <Link href="/admin/jobs/new" className="inline-flex h-10 items-center rounded-lg border border-border px-3.5 text-sm">
          Add job
        </Link>
      </div>
    </div>
  );
}
