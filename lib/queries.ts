import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import type { Prisma } from "@prisma/client"
import { prisma } from "./db"

const publicCandidateSelect = {
  id: true,
  slug: true,
  pseudonym: true,
  headline: true,
  summary: true,
  background: true,
  experience: true,
  personality: true,
  lookingFor: true,
  yearsExperience: true,
  salesType: true,
  availability: true,
  willingToTravel: true,
  payStructure: true,
  workStyle: true,
  schedule: true,
  isSample: true,
  photoPublic: true,
  updatedAt: true,
  location: {
    select: {
      slug: true,
      city: true,
      state: true,
      stateName: true,
      county: true,
      filterGroup: true,
      isFiberMarket: true,
    },
  },
  industries: {
    select: {
      industry: { select: { slug: true, name: true } },
    },
  },
} satisfies Prisma.CandidateSelect

type PublicRow = Prisma.CandidateGetPayload<{ select: typeof publicCandidateSelect }>

export type PublicCandidate = {
  id: string
  slug: string
  pseudonym: string
  headline: string
  summary: string
  background: string
  experience: string
  personality: string
  lookingFor: string
  yearsExperience: number | null
  salesType: string
  availability: string
  willingToTravel: boolean
  payStructure: string
  workStyle: string
  schedule: string
  isSample: boolean
  photo: string | null
  city: string
  state: string
  stateName: string
  county: string
  locationSlug: string
  filterGroup: string
  isFiberMarket: boolean
  industries: { slug: string; name: string }[]
}

function toPublic(row: PublicRow): PublicCandidate {
  const version = row.updatedAt.toISOString().slice(0, 19)
  return {
    id: row.id,
    slug: row.slug,
    pseudonym: row.pseudonym,
    headline: row.headline,
    summary: row.summary,
    background: row.background,
    experience: row.experience,
    personality: row.personality,
    lookingFor: row.lookingFor,
    yearsExperience: row.yearsExperience,
    salesType: row.salesType,
    availability: row.availability,
    willingToTravel: row.willingToTravel,
    payStructure: row.payStructure,
    workStyle: row.workStyle,
    schedule: row.schedule,
    isSample: row.isSample,
    photo: row.photoPublic ? `${row.photoPublic}?v=${version}` : null,
    city: row.location.city,
    state: row.location.state,
    stateName: row.location.stateName,
    county: row.location.county,
    locationSlug: row.location.slug,
    filterGroup: row.location.filterGroup,
    isFiberMarket: row.location.isFiberMarket,
    industries: row.industries
      .map((item) => item.industry)
      .sort((a, b) => a.name.localeCompare(b.name)),
  }
}

export async function listPublicCandidates(industry: string, location: string, travel: boolean) {
  "use cache"
  cacheTag("candidates")
  cacheLife("hours")

  const rows = await prisma.candidate.findMany({
    where: {
      isPublished: true,
      ...(industry ? { industries: { some: { industrySlug: industry } } } : {}),
      ...(location ? { locationSlug: location } : {}),
      ...(travel ? { willingToTravel: true } : {}),
    },
    select: publicCandidateSelect,
    orderBy: [{ publishedAt: "desc" }, { pseudonym: "asc" }],
  })
  return rows.map(toPublic)
}

export async function getPublicCandidate(slug: string) {
  "use cache"
  cacheTag("candidates", `candidate:${slug}`)
  cacheLife("hours")

  const row = await prisma.candidate.findFirst({
    where: { slug, isPublished: true },
    select: publicCandidateSelect,
  })
  return row ? toPublic(row) : null
}

const publicJobSelect = {
  slug: true,
  title: true,
  description: true,
  datePosted: true,
  validThrough: true,
  employmentType: true,
  hiringOrganization: true,
  salaryMin: true,
  salaryMax: true,
  salaryUnit: true,
  commissionNote: true,
  isSample: true,
  industry: { select: { slug: true, name: true } },
  location: {
    select: {
      slug: true,
      city: true,
      state: true,
      stateName: true,
      county: true,
      isFiberMarket: true,
    },
  },
} satisfies Prisma.JobSelect

type JobRow = Prisma.JobGetPayload<{ select: typeof publicJobSelect }>

export type PublicJob = {
  slug: string
  title: string
  description: string
  datePosted: string
  validThrough: string
  employmentType: string
  hiringOrganization: string
  salaryMin: number | null
  salaryMax: number | null
  salaryUnit: string | null
  commissionNote: string
  isSample: boolean
  industrySlug: string
  industryName: string
  locationSlug: string
  city: string
  state: string
  stateName: string
  county: string
  isFiberMarket: boolean
}

function toJob(row: JobRow): PublicJob {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    datePosted: row.datePosted,
    validThrough: row.validThrough,
    employmentType: row.employmentType,
    hiringOrganization: row.hiringOrganization,
    salaryMin: row.salaryMin,
    salaryMax: row.salaryMax,
    salaryUnit: row.salaryUnit,
    commissionNote: row.commissionNote,
    isSample: row.isSample,
    industrySlug: row.industry.slug,
    industryName: row.industry.name,
    locationSlug: row.location.slug,
    city: row.location.city,
    state: row.location.state,
    stateName: row.location.stateName,
    county: row.location.county,
    isFiberMarket: row.location.isFiberMarket,
  }
}

export async function listPublicJobs(industry: string, location: string) {
  "use cache"
  cacheTag("jobs")
  cacheLife("hours")

  const rows = await prisma.job.findMany({
    where: {
      isPublished: true,
      ...(industry ? { industrySlug: industry } : {}),
      ...(location ? { locationSlug: location } : {}),
    },
    select: publicJobSelect,
    orderBy: [{ datePosted: "desc" }, { title: "asc" }],
  })
  return rows.map(toJob)
}

export async function getPublicJob(slug: string) {
  "use cache"
  cacheTag("jobs", `job:${slug}`)
  cacheLife("hours")

  const row = await prisma.job.findFirst({
    where: { slug, isPublished: true },
    select: publicJobSelect,
  })
  return row ? toJob(row) : null
}
