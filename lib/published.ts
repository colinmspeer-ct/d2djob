import { fiberCities } from "@/content/fiber-cities"
import { tradePages } from "@/content/trade-pages"
import { getIndustry, industries } from "@/data/industries"
import { fiberMarkets, locations, type LocationRecord } from "@/data/locations"

export function publishedCities(industrySlug: string): LocationRecord[] {
  if (industrySlug === "fiber") {
    return fiberMarkets().filter((location) => fiberCities[location.slug])
  }
  return locations.filter((location) => tradePages[`${industrySlug}:${location.slug}`])
}

export function publishedGeoRoutes() {
  return industries.flatMap((industry) =>
    publishedCities(industry.slug).map((location) => ({
      path: `/${industry.geoPrefix}/${location.slug}`,
      industrySlug: industry.slug,
      citySlug: location.slug,
    })),
  )
}

export function isPublishedGeo(industrySlug: string, citySlug: string) {
  if (industrySlug === "fiber") return Boolean(fiberCities[citySlug])
  return Boolean(tradePages[`${industrySlug}:${citySlug}`])
}

export function publishedIndustry(slug: string) {
  return getIndustry(slug)
}
