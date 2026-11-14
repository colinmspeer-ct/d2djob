import { getIndustry, industries, industryByGeoPrefix } from "./industries"
import { getLocation, isFiberMarketSlug, locations } from "./locations"
import { sampleJobs } from "./jobs"
import { sampleCandidates } from "./samples"

export function resolveIndustryGeo(prefix: string, citySlug: string) {
  const industry = industryByGeoPrefix(prefix)
  const location = getLocation(citySlug)
  if (!industry || !location) return null
  if (industry.slug === "fiber" && !location.isFiberMarket) return null
  return { industry, location }
}

export function canPostJob(industrySlug: string, locationSlug: string) {
  if (!getIndustry(industrySlug) || !getLocation(locationSlug)) return false
  if (industrySlug === "fiber" && !isFiberMarketSlug(locationSlug)) return false
  return true
}

export function catalogProblems() {
  const problems: string[] = []
  const slugs = locations.map((location) => location.slug)
  if (new Set(slugs).size !== slugs.length) problems.push("duplicate location slugs")

  const primary = locations.filter((location) => location.fiberTier === "primary")
  const optional = locations.filter((location) => location.fiberTier === "optional")
  if (primary.length !== 20) problems.push(`expected 20 primary fiber markets, found ${primary.length}`)
  if (optional.length !== 2) problems.push(`expected 2 optional fiber markets, found ${optional.length}`)

  for (const location of locations) {
    if (location.isFiberMarket !== Boolean(location.fiberTier)) {
      problems.push(`${location.slug} fiber flags disagree`)
    }
    if (["NJ", "DE", "MD", "VA", "NY", "MA", "IL"].includes(location.state) && location.isFiberMarket) {
      problems.push(`${location.slug} is marked fiber in a state AT&T Fiber does not serve`)
    }
  }

  for (const job of sampleJobs) {
    if (!canPostJob(job.industrySlug, job.locationSlug)) {
      problems.push(`job ${job.slug} is not a legal industry/location pair`)
    }
  }

  for (const candidate of sampleCandidates) {
    if (!getLocation(candidate.locationSlug)) problems.push(`candidate ${candidate.slug} has no location`)
    for (const industrySlug of candidate.industries) {
      if (!getIndustry(industrySlug)) problems.push(`candidate ${candidate.slug} has unknown industry ${industrySlug}`)
    }
  }

  if (industries.length !== 7) problems.push("industry count")
  return problems
}

/** Cities prerendered for non-fiber geo scaffolds. Every location still resolves on request. */
export const featuredNonFiberCities = [
  "cherry-hill-nj",
  "lancaster-pa",
  "west-chester-pa",
  "king-of-prussia-pa",
  "boston-ma",
  "chicago-il",
  "wilmington-nc",
  "doylestown-pa",
]
