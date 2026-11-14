"use server"

import { updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "../auth"
import { prisma } from "../db"
import { slugify } from "../format"
import { readJobForm } from "../validators"

async function requireAdmin() {
  if (!(await getSession())) redirect("/admin/login")
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`)
}

async function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "job"
  let slug = root
  let count = 2
  while (true) {
    const existing = await prisma.job.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === ignoreId) return slug
    slug = `${root}-${count}`
    count += 1
  }
}

function refreshJob(slug: string) {
  updateTag("jobs")
  updateTag(`job:${slug}`)
}

export async function createJob(formData: FormData) {
  await requireAdmin()
  const parsed = readJobForm(formData)
  if (!parsed.ok) fail("/admin/jobs/new", parsed.error)
  const data = parsed.data
  const slug = await uniqueSlug(data.slug || data.title)
  const created = await prisma.job.create({
    data: {
      slug,
      title: data.title,
      description: data.description,
      datePosted: data.datePosted,
      validThrough: data.validThrough,
      employmentType: data.employmentType,
      hiringOrganization: data.hiringOrganization,
      industrySlug: data.industrySlug,
      locationSlug: data.locationSlug,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      salaryUnit: data.salaryUnit || null,
      commissionNote: data.commissionNote,
      isSample: data.isSample,
      isPublished: false,
    },
  })
  refreshJob(created.slug)
  redirect(`/admin/jobs/${created.id}?saved=1`)
}

export async function updateJob(id: string, formData: FormData) {
  await requireAdmin()
  const path = `/admin/jobs/${id}`
  const existing = await prisma.job.findUnique({ where: { id } })
  if (!existing) fail("/admin/jobs", "That job is gone.")
  const parsed = readJobForm(formData)
  if (!parsed.ok) fail(path, parsed.error)
  const data = parsed.data
  const intent = String(formData.get("intent") ?? "save")
  const slug = await uniqueSlug(data.slug || data.title, id)
  const isPublished = intent === "publish" ? true : intent === "unpublish" ? false : existing.isPublished

  await prisma.job.update({
    where: { id },
    data: {
      slug,
      title: data.title,
      description: data.description,
      datePosted: data.datePosted,
      validThrough: data.validThrough,
      employmentType: data.employmentType,
      hiringOrganization: data.hiringOrganization,
      industrySlug: data.industrySlug,
      locationSlug: data.locationSlug,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      salaryUnit: data.salaryUnit || null,
      commissionNote: data.commissionNote,
      isSample: data.isSample,
      isPublished,
    },
  })
  refreshJob(existing.slug)
  if (slug !== existing.slug) refreshJob(slug)
  redirect(`${path}?saved=1`)
}
