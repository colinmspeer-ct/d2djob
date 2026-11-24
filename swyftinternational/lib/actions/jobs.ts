"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth";
import { slugify } from "../format";
import { getJob, insertJob, updateJob } from "../queries";
import { readJobForm } from "../validators";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function toJob(data: Exclude<ReturnType<typeof readJobForm>, { ok: false }>["data"], existingPublished: boolean) {
  return {
    slug: data.slug ? slugify(data.slug) : undefined,
    title: data.title,
    description: data.description,
    datePosted: data.datePosted,
    validThrough: data.validThrough,
    employmentType: data.employmentType,
    hiringOrganization: data.hiringOrganization,
    country: data.country,
    locationLabel: data.locationLabel,
    salaryMin: data.salaryMin,
    salaryMax: data.salaryMax,
    salaryUnit: data.salaryUnit || null,
    isSample: data.isSample,
    isPublished: data.publish ? true : existingPublished,
  };
}

export async function createJob(formData: FormData) {
  await requireAdmin();
  const parsed = readJobForm(formData);
  if (!parsed.ok) fail("/admin/jobs/new", parsed.error);
  const id = insertJob(toJob(parsed.data, false));
  redirect(`/admin/jobs/${id}?saved=1`);
}

export async function updateJobAction(id: string, formData: FormData) {
  await requireAdmin();
  const path = `/admin/jobs/${id}`;
  const existing = getJob(id);
  if (!existing) fail("/admin/jobs", "That role is gone.");
  const parsed = readJobForm(formData);
  if (!parsed.ok) fail(path, parsed.error);
  const next = toJob(parsed.data, parsed.data.publish ? true : formData.get("intent") === "unpublish" ? false : existing.isPublished);
  updateJob(id, next);
  redirect(`${path}?saved=1`);
}
