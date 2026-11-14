import type { CityCopy } from "./city-types"
import { hubCities } from "./hub-cities"
import { moreSouthJersey } from "./more-south-jersey"
import { southJerseyPages } from "./south-jersey"

export const tradePages: Record<string, CityCopy> = {
  ...southJerseyPages,
  ...moreSouthJersey,
  ...hubCities,
}

export function getTradePage(industrySlug: string, citySlug: string) {
  return tradePages[`${industrySlug}:${citySlug}`] ?? null
}
