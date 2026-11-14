"use server"

import { updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { getIndustry } from "../../data/industries"
import { getLocation } from "../../data/locations"
import { getSession } from "../auth"
import { prisma } from "../db"
import { generateProfile, pseudonymFromName } from "../profile-generator"
import { removeCandidatePhoto, storeCandidatePhoto } from "../photos"
import { slugify } from "../format"
import { readCandidateForm } from "../validators"

async function requireAdmin() {
  if (!(await getSession())) redirect("/admin/login")
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`)
}

async function uniqueSlug(base: string) {
  const root = base || "rep"
  let slug = root
  let count = 2
  while (await prisma.candidate.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${root}-${count}`
    count += 1
  }
  return slug
}

async function replaceIndustries(candidateId: string, slugs: string[]) {
  await prisma.candidateIndustry.deleteMany({ where: { candidateId } })
  await prisma.candidateIndustry.createMany({
    data: slugs.map((industrySlug) => ({ candidateId, industrySlug })),
  })
}

function refreshCandidate(slug: string) {
  updateTag("candidates")
  updateTag(`candidate:${slug}`)
}

export async function createCandidate(formData: FormData) {
  await requireAdmin()
  const parsed = readCandidateForm(formData)
  if (!parsed.ok) fail("/admin/candidates/new", parsed.error)
  const data = parsed.data
  const pseudonym = pseudonymFromName(data.realName)
  const slug = await uniqueSlug(slugify(pseudonym))
  const created = await prisma.candidate.create({
    data: {
      slug,
      pseudonym,
      realName: data.realName,
      phone: data.phone,
      email: data.email,
      interviewNotes: data.interviewNotes,
      locationSlug: data.locationSlug,
      yearsExperience: data.yearsExperience,
      salesType: data.salesType,
      availability: data.availability,
      willingToTravel: data.willingToTravel,
      payStructure: data.payStructure,
      workStyle: data.workStyle,
      schedule: data.schedule,
      headline: data.headline,
      summary: data.summary,
      background: data.background,
      experience: data.experience,
      personality: data.personality,
      lookingFor: data.lookingFor,
      isPublished: false,
    },
  })
  await replaceIndustries(created.id, data.industries)

  const file = formData.get("photo")
  if (file instanceof File && file.size > 0) {
    const stored = await storeCandidatePhoto(created.id, file)
    if (!stored.ok) fail(`/admin/candidates/${created.id}`, stored.error)
    if (!stored.empty) {
      await prisma.candidate.update({
        where: { id: created.id },
        data: { photoOriginal: stored.photoOriginal, photoPublic: stored.photoPublic },
      })
    }
  }

  refreshCandidate(created.slug)
  redirect(`/admin/candidates/${created.id}?saved=1`)
}

export async function updateCandidate(id: string, formData: FormData) {
  await requireAdmin()
  const path = `/admin/candidates/${id}`
  const existing = await prisma.candidate.findUnique({ where: { id } })
  if (!existing) fail("/admin/candidates", "That candidate is gone.")

  const parsed = readCandidateForm(formData)
  if (!parsed.ok) fail(path, parsed.error)
  const data = parsed.data
  const intent = String(formData.get("intent") ?? "save")
  const location = getLocation(data.locationSlug)
  if (!location) fail(path, "Pick a location from the list.")

  let publicFields = {
    headline: data.headline,
    summary: data.summary,
    background: data.background,
    experience: data.experience,
    personality: data.personality,
    lookingFor: data.lookingFor,
    yearsExperience: data.yearsExperience,
    salesType: data.salesType,
    availability: data.availability,
    willingToTravel: data.willingToTravel,
    payStructure: data.payStructure,
    workStyle: data.workStyle,
    schedule: data.schedule,
  }
  let generationSource = existing.generationSource
  let generated: string | null = null

  if (intent === "generate") {
    const result = await generateProfile({
      pseudonym: existing.isPublished ? existing.pseudonym : pseudonymFromName(data.realName),
      realName: data.realName,
      interviewNotes: data.interviewNotes,
      city: location.city,
      state: location.state,
      county: location.county,
      industryNames: data.industries.map((slug) => getIndustry(slug)?.name ?? slug),
      yearsExperience: data.yearsExperience,
      salesType: data.salesType,
      availability: data.availability,
      willingToTravel: data.willingToTravel,
      payStructure: data.payStructure,
      workStyle: data.workStyle,
      schedule: data.schedule,
    })
    publicFields = {
      ...publicFields,
      headline: result.profile.headline,
      summary: result.profile.summary,
      background: result.profile.background,
      experience: result.profile.experience,
      personality: result.profile.personality,
      lookingFor: result.profile.lookingFor,
      yearsExperience: result.profile.yearsExperience,
      salesType: result.profile.salesType,
      availability: result.profile.availability,
      willingToTravel: result.profile.willingToTravel,
      payStructure: result.profile.payStructure,
      workStyle: result.profile.workStyle,
      schedule: result.profile.schedule,
    }
    generationSource = result.source
    generated = result.source
  }

  const publishing = intent === "publish"
  if (publishing && (publicFields.headline.length < 8 || publicFields.summary.length < 40)) {
    fail(path, "Write a headline and summary before publishing. Generate profile can draft them.")
  }

  let photoOriginal = existing.photoOriginal
  let photoPublic = existing.photoPublic
  if (formData.get("removePhoto") === "on") {
    await removeCandidatePhoto(existing.photoOriginal)
    photoOriginal = null
    photoPublic = null
  }
  const file = formData.get("photo")
  if (file instanceof File && file.size > 0) {
    const stored = await storeCandidatePhoto(existing.id, file)
    if (!stored.ok) fail(path, stored.error)
    if (!stored.empty) {
      photoOriginal = stored.photoOriginal
      photoPublic = stored.photoPublic
    }
  }

  const pseudonym = existing.isPublished ? existing.pseudonym : pseudonymFromName(data.realName)
  const isPublished = publishing ? true : intent === "generate" ? false : intent === "unpublish" ? false : existing.isPublished

  await prisma.candidate.update({
    where: { id },
    data: {
      realName: data.realName,
      phone: data.phone,
      email: data.email,
      interviewNotes: data.interviewNotes,
      locationSlug: data.locationSlug,
      pseudonym,
      ...publicFields,
      photoOriginal,
      photoPublic,
      generationSource,
      isPublished,
      publishedAt: publishing ? existing.publishedAt ?? new Date() : existing.publishedAt,
    },
  })
  await replaceIndustries(id, data.industries)
  refreshCandidate(existing.slug)
  const query = generated ? `generated=${generated}` : "saved=1"
  redirect(`${path}?${query}`)
}
