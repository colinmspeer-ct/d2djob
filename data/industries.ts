export const industries = [
  { slug: "fiber", name: "Fiber", geoPrefix: "fiber-sales-jobs", sortOrder: 0 },
  { slug: "pest-control", name: "Pest control", geoPrefix: "pest-control-sales-jobs", sortOrder: 1 },
  { slug: "roofing", name: "Roofing", geoPrefix: "roofing-sales-jobs", sortOrder: 2 },
  { slug: "windows-doors", name: "Windows & doors", geoPrefix: "windows-doors-sales-jobs", sortOrder: 3 },
  { slug: "window-cleaning", name: "Window cleaning", geoPrefix: "window-cleaning-sales-jobs", sortOrder: 4 },
  { slug: "exterior-cleaning", name: "Exterior cleaning", geoPrefix: "exterior-cleaning-sales-jobs", sortOrder: 5 },
  { slug: "exteriors", name: "Exteriors", geoPrefix: "exteriors-sales-jobs", sortOrder: 6 },
] as const

export type IndustrySlug = (typeof industries)[number]["slug"]

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug) ?? null
}

export function industryByGeoPrefix(prefix: string) {
  return industries.find((industry) => industry.geoPrefix === prefix) ?? null
}
