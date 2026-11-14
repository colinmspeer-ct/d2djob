import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { Flash } from "@/components/flash";
import { JobForm } from "@/components/job-form";
import { prisma } from "@/lib/db";

export const instant = false;

export default function EditJobPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="text-sm">Loading job…</p>}>
      <EditJob params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function EditJob({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { id } = await params;
  const query = await searchParams;
  const row = await prisma.job.findUnique({ where: { id } });
  if (!row) notFound();
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">Edit job</h1>
      <JobForm
        flash={<Flash searchParams={query} />}
        job={{
          id: row.id,
          slug: row.slug,
          title: row.title,
          description: row.description,
          datePosted: row.datePosted,
          validThrough: row.validThrough,
          employmentType: row.employmentType,
          hiringOrganization: row.hiringOrganization,
          industrySlug: row.industrySlug,
          locationSlug: row.locationSlug,
          salaryMin: row.salaryMin,
          salaryMax: row.salaryMax,
          salaryUnit: row.salaryUnit,
          commissionNote: row.commissionNote,
          isSample: row.isSample,
          isPublished: row.isPublished,
        }}
      />
    </div>
  );
}
