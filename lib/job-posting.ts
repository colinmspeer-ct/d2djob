export const EMPLOYMENT_TYPES = new Set([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACTOR",
  "TEMPORARY",
  "INTERN",
  "VOLUNTEER",
  "PER_DIEM",
  "OTHER",
])

export const SALARY_UNITS = new Set(["HOUR", "DAY", "WEEK", "MONTH", "YEAR"])

export type JobPostingInput = {
  slug: string
  title: string
  description: string
  datePosted: string
  validThrough: string
  employmentType: string
  hiringOrganization: string
  city: string
  state: string
  salaryMin: number | null
  salaryMax: number | null
  salaryUnit: string | null
  commissionNote: string
  siteUrl: string
}

export function buildJobPosting(job: JobPostingInput) {
  const posting: Record<string, unknown> = {
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.hiringOrganization,
      sameAs: job.siteUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressRegion: job.state,
        addressCountry: "US",
      },
    },
    identifier: {
      "@type": "PropertyValue",
      name: "D2D Job",
      value: job.slug,
    },
    url: `${job.siteUrl}/job/${job.slug}`,
    directApply: false,
  }

  if (job.commissionNote.trim()) {
    posting.incentiveCompensation = job.commissionNote.trim()
  }

  if (
    job.salaryMin != null &&
    job.salaryUnit &&
    SALARY_UNITS.has(job.salaryUnit)
  ) {
    const value: Record<string, unknown> = {
      "@type": "QuantitativeValue",
      minValue: job.salaryMin,
      unitText: job.salaryUnit,
    }
    if (job.salaryMax != null) value.maxValue = job.salaryMax
    posting.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "USD",
      value,
    }
  }

  return posting
}

export function buildJobPostingGraph(jobs: JobPostingInput[]) {
  return {
    "@context": "https://schema.org",
    "@graph": jobs.map(buildJobPosting),
  }
}

export function validateJobPosting(posting: Record<string, unknown>) {
  const errors: string[] = []
  if (posting["@type"] !== "JobPosting") errors.push("@type")

  for (const key of ["title", "description", "datePosted", "validThrough", "employmentType"]) {
    if (typeof posting[key] !== "string" || !(posting[key] as string).trim()) errors.push(key)
  }
  if (!EMPLOYMENT_TYPES.has(String(posting.employmentType))) errors.push("employmentType")
  if (typeof posting.description === "string" && posting.description.length < 80) {
    errors.push("description length")
  }
  if (!/^\d{4}-\d{2}-\d{2}/.test(String(posting.datePosted))) errors.push("datePosted format")
  if (!/^\d{4}-\d{2}-\d{2}/.test(String(posting.validThrough))) errors.push("validThrough format")

  const org = posting.hiringOrganization as { "@type"?: string; name?: string } | undefined
  if (!org || org["@type"] !== "Organization" || !org.name) errors.push("hiringOrganization")

  const location = posting.jobLocation as
    | {
        "@type"?: string
        address?: {
          "@type"?: string
          addressLocality?: string
          addressRegion?: string
          addressCountry?: string
        }
      }
    | undefined
  if (!location || location["@type"] !== "Place" || location.address?.["@type"] !== "PostalAddress") {
    errors.push("jobLocation")
  } else {
    if (location.address.addressCountry !== "US") errors.push("addressCountry")
    if (!location.address.addressLocality || !location.address.addressRegion) errors.push("address")
  }

  if (posting.baseSalary) {
    const salary = posting.baseSalary as {
      "@type"?: string
      currency?: string
      value?: { "@type"?: string; minValue?: number; maxValue?: number; unitText?: string }
    }
    if (salary["@type"] !== "MonetaryAmount" || salary.currency !== "USD") errors.push("baseSalary")
    if (
      salary.value?.["@type"] !== "QuantitativeValue" ||
      typeof salary.value.minValue !== "number" ||
      !SALARY_UNITS.has(salary.value.unitText ?? "")
    ) {
      errors.push("baseSalary.value")
    }
    if (
      typeof salary.value?.maxValue === "number" &&
      typeof salary.value.minValue === "number" &&
      salary.value.maxValue < salary.value.minValue
    ) {
      errors.push("baseSalary range")
    }
  }

  if (posting.incentiveCompensation != null && typeof posting.incentiveCompensation !== "string") {
    errors.push("incentiveCompensation")
  }

  return errors
}
