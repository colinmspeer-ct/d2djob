import { fiberCities } from "@/content/fiber-cities"
import { industryArticles } from "@/content/industry-pages"
import { tradePages } from "@/content/trade-pages"
import { industries, type IndustrySlug } from "@/data/industries"
import { getLocation } from "@/data/locations"
import { sampleJobs } from "@/data/jobs"
import { sampleCandidates } from "@/data/samples"

export const contentDate = "2026-11-14"

export const liveGroups = ["pillar", "employers", "industries", "cities", "jobs", "profiles", "site"] as const

export type LiveGroup = (typeof liveGroups)[number]

export type LivePage = {
  group: LiveGroup
  title: string
  path: string
  lastmod: string
}

export const liveGroupLabel: Record<LiveGroup, string> = {
  pillar: "Pillar",
  employers: "Employers",
  industries: "Industries",
  cities: "City pages",
  jobs: "Jobs",
  profiles: "Profiles",
  site: "Site",
}

function slash(path: string) {
  if (path === "/") return "/"
  return path.endsWith("/") ? path : `${path}/`
}

export function livePages(): LivePage[] {
  const pages: LivePage[] = [
    { group: "pillar", title: "Door-to-Door Sales Jobs", path: slash("/door-to-door-sales"), lastmod: contentDate },
    { group: "employers", title: "Hire Door-to-Door Sales Reps", path: slash("/employers"), lastmod: contentDate },
  ]

  for (const industry of industries) {
    pages.push({
      group: "industries",
      title: industryArticles[industry.slug as IndustrySlug].h1,
      path: slash(`/jobs/${industry.slug}`),
      lastmod: contentDate,
    })
  }

  for (const [slug, copy] of Object.entries(fiberCities)) {
    pages.push({
      group: "cities",
      title: copy.h1,
      path: slash(`/fiber-sales-jobs/${slug}`),
      lastmod: contentDate,
    })
  }

  for (const [key, copy] of Object.entries(tradePages)) {
    const [industrySlug, city] = key.split(":")
    const industry = industries.find((item) => item.slug === industrySlug)
    if (!industry) continue
    pages.push({
      group: "cities",
      title: copy.h1,
      path: slash(`/${industry.geoPrefix}/${city}`),
      lastmod: contentDate,
    })
  }

  pages.push({
    group: "jobs",
    title: "Door-to-Door Sales Jobs",
    path: slash("/jobs"),
    lastmod: contentDate,
  })

  for (const job of sampleJobs) {
    pages.push({
      group: "jobs",
      title: job.title,
      path: slash(`/job/${job.slug}`),
      lastmod: job.datePosted,
    })
  }

  for (const candidate of sampleCandidates) {
    const place = getLocation(candidate.locationSlug)
    const where = place ? `${place.city}, ${place.state}` : candidate.locationSlug
    pages.push({
      group: "profiles",
      title: `${candidate.pseudonym}, ${where}`,
      path: slash(`/candidates/${candidate.slug}`),
      lastmod: candidate.publishedAt.slice(0, 10),
    })
  }

  pages.push(
    { group: "site", title: "Field app for reps", path: slash("/app"), lastmod: contentDate },
    { group: "site", title: "Home", path: "/", lastmod: contentDate },
    { group: "site", title: "Sitemap", path: slash("/sitemap"), lastmod: contentDate },
  )

  return pages
}

export function absoluteLiveUrl(origin: string, page: LivePage) {
  const site = origin.replace(/\/$/, "")
  return page.path === "/" ? `${site}/` : `${site}${page.path}`
}
