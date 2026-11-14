import { z } from "zod"
import { canPostJob } from "../data/geo"
import { getIndustry } from "../data/industries"
import { getLocation } from "../data/locations"

const email = z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email.")

export function zodMessage(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ")
}

const candidateFields = z.object({
  realName: z.string().trim().min(2, "Enter the legal name.").max(80),
  phone: z.string().trim().min(7, "Enter a phone number.").max(30),
  email: email.max(120),
  interviewNotes: z
    .string()
    .trim()
    .min(40, "Interview notes need at least a short paragraph.")
    .max(8000),
  locationSlug: z.string().min(1, "Pick a location."),
  industries: z.array(z.string()).min(1, "Pick at least one industry."),
  yearsExperience: z.number().int().min(0).max(40).nullable(),
  salesType: z.string().trim().max(80),
  availability: z.string().trim().max(160),
  willingToTravel: z.boolean(),
  payStructure: z.string().trim().max(160),
  workStyle: z.enum(["", "team", "solo", "either"]),
  schedule: z.enum(["", "full-time", "seasonal", "either"]),
  headline: z.string().trim().max(140),
  summary: z.string().trim().max(1200),
  background: z.string().trim().max(1200),
  experience: z.string().trim().max(1200),
  personality: z.string().trim().max(800),
  lookingFor: z.string().trim().max(1200),
})

function numberOrNull(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim()
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? Math.round(parsed) : Number.NaN
}

export function readCandidateForm(formData: FormData) {
  const years = numberOrNull(formData.get("yearsExperience"))
  const parsed = candidateFields.safeParse({
    realName: formData.get("realName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    interviewNotes: formData.get("interviewNotes"),
    locationSlug: formData.get("locationSlug"),
    industries: formData.getAll("industries").map(String),
    yearsExperience: years,
    salesType: formData.get("salesType") ?? "",
    availability: formData.get("availability") ?? "",
    willingToTravel: formData.get("willingToTravel") === "on",
    payStructure: formData.get("payStructure") ?? "",
    workStyle: formData.get("workStyle") ?? "",
    schedule: formData.get("schedule") ?? "",
    headline: formData.get("headline") ?? "",
    summary: formData.get("summary") ?? "",
    background: formData.get("background") ?? "",
    experience: formData.get("experience") ?? "",
    personality: formData.get("personality") ?? "",
    lookingFor: formData.get("lookingFor") ?? "",
  })
  if (!parsed.success) return { ok: false as const, error: zodMessage(parsed.error) }
  if (Number.isNaN(years)) return { ok: false as const, error: "Years of experience should be a number." }
  if (!getLocation(parsed.data.locationSlug)) return { ok: false as const, error: "Pick a location from the list." }
  if (parsed.data.industries.some((slug) => !getIndustry(slug))) {
    return { ok: false as const, error: "One of those industries is not in the list." }
  }
  return { ok: true as const, data: parsed.data }
}

const jobFields = z.object({
  title: z.string().trim().min(8, "Give the job a title.").max(140),
  slug: z.string().trim().max(140),
  description: z.string().trim().min(80, "The description needs a few sentences.").max(8000),
  datePosted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a posted date."),
  validThrough: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid-through date."),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY"]),
  hiringOrganization: z.string().trim().min(2, "Name the hiring organization.").max(120),
  industrySlug: z.string().min(1, "Pick an industry."),
  locationSlug: z.string().min(1, "Pick a location."),
  salaryMin: z.number().int().min(0).nullable(),
  salaryMax: z.number().int().min(0).nullable(),
  salaryUnit: z.enum(["", "YEAR", "HOUR", "WEEK", "MONTH"]),
  commissionNote: z.string().trim().max(300),
  isSample: z.boolean(),
})

export function readJobForm(formData: FormData) {
  const salaryMin = numberOrNull(formData.get("salaryMin"))
  const salaryMax = numberOrNull(formData.get("salaryMax"))
  const parsed = jobFields.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") ?? "",
    description: formData.get("description"),
    datePosted: formData.get("datePosted"),
    validThrough: formData.get("validThrough"),
    employmentType: formData.get("employmentType"),
    hiringOrganization: formData.get("hiringOrganization"),
    industrySlug: formData.get("industrySlug"),
    locationSlug: formData.get("locationSlug"),
    salaryMin,
    salaryMax,
    salaryUnit: formData.get("salaryUnit") ?? "",
    commissionNote: formData.get("commissionNote") ?? "",
    isSample: formData.get("isSample") === "on",
  })
  if (!parsed.success) return { ok: false as const, error: zodMessage(parsed.error) }
  if (Number.isNaN(salaryMin) || Number.isNaN(salaryMax)) {
    return { ok: false as const, error: "Pay amounts should be numbers." }
  }
  const data = parsed.data
  if (data.validThrough < data.datePosted) {
    return { ok: false as const, error: "Valid through should be on or after the posted date." }
  }
  if ((data.salaryMin != null || data.salaryMax != null) && !data.salaryUnit) {
    return { ok: false as const, error: "Pick a pay period for the base salary." }
  }
  if (data.salaryMin != null && data.salaryMax != null && data.salaryMax < data.salaryMin) {
    return { ok: false as const, error: "The top of the pay range is below the bottom." }
  }
  if (data.salaryMin == null && !data.commissionNote) {
    return { ok: false as const, error: "Add a base pay range or commission language." }
  }
  if (!canPostJob(data.industrySlug, data.locationSlug)) {
    return {
      ok: false as const,
      error:
        "Fiber listings can only be placed in official AT&T Fiber markets. South Jersey, the Philadelphia suburbs, Lancaster, Chicago, and Boston are not on that list.",
    }
  }
  return { ok: true as const, data }
}

const requestFields = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  company: z.string().trim().min(2, "Enter your company.").max(120),
  email: email.max(120),
  phone: z.string().trim().min(7, "Enter a phone number.").max(30),
  message: z.string().trim().min(10, "Add a short note about the offer.").max(2000),
  preferredTimes: z.string().trim().max(500),
})

export function readRequestForm(formData: FormData, type: "invite" | "meeting") {
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true as const, spam: true as const, data: null }
  }
  const parsed = requestFields.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    preferredTimes: formData.get("preferredTimes") ?? "",
  })
  if (!parsed.success) return { ok: false as const, error: zodMessage(parsed.error) }
  if (type === "meeting" && parsed.data.preferredTimes.length < 3) {
    return { ok: false as const, error: "Add a couple of times that work for a meeting." }
  }
  return { ok: true as const, spam: false as const, data: parsed.data }
}
