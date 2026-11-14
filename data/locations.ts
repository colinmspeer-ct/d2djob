export type FiberTier = "primary" | "optional"

export type LocationRecord = {
  slug: string
  city: string
  state: string
  stateName: string
  county: string
  filterGroup: string
  isFiberMarket: boolean
  fiberTier: FiberTier | null
}

type Draft = {
  city: string
  state: string
  stateName: string
  county: string
  filterGroup: string
  fiberTier?: FiberTier
}

function loc(slug: string, draft: Draft): LocationRecord {
  return {
    slug,
    city: draft.city,
    state: draft.state,
    stateName: draft.stateName,
    county: draft.county,
    filterGroup: draft.filterGroup,
    isFiberMarket: Boolean(draft.fiberTier),
    fiberTier: draft.fiberTier ?? null,
  }
}

const nc = "AT&T Fiber — North Carolina"
const sc = "AT&T Fiber — South Carolina"
const ga = "AT&T Fiber — Georgia"
const fl = "AT&T Fiber — Florida"
const nepa = "AT&T Fiber — Northeastern Pennsylvania"

/**
 * Candidate and job locations. `fiberTier` marks official AT&T Fiber markets
 * only. South Jersey, the Philadelphia suburbs, Lancaster, Chicago, and Boston
 * stay in the file for other industries. They are not fiber markets.
 *
 * The first 20 fiber cities are the primary set. Scranton and Wilkes-Barre are
 * optional additions to that set.
 */
export const locations: LocationRecord[] = [
  loc("charlotte-nc", { city: "Charlotte", state: "NC", stateName: "North Carolina", county: "Mecklenburg", filterGroup: nc, fiberTier: "primary" }),
  loc("raleigh-nc", { city: "Raleigh", state: "NC", stateName: "North Carolina", county: "Wake", filterGroup: nc, fiberTier: "primary" }),
  loc("durham-nc", { city: "Durham", state: "NC", stateName: "North Carolina", county: "Durham", filterGroup: nc, fiberTier: "primary" }),
  loc("greensboro-nc", { city: "Greensboro", state: "NC", stateName: "North Carolina", county: "Guilford", filterGroup: nc, fiberTier: "primary" }),
  loc("winston-salem-nc", { city: "Winston-Salem", state: "NC", stateName: "North Carolina", county: "Forsyth", filterGroup: nc, fiberTier: "primary" }),
  loc("wilmington-nc", { city: "Wilmington", state: "NC", stateName: "North Carolina", county: "New Hanover", filterGroup: nc, fiberTier: "primary" }),
  loc("asheville-nc", { city: "Asheville", state: "NC", stateName: "North Carolina", county: "Buncombe", filterGroup: nc, fiberTier: "primary" }),
  loc("charleston-sc", { city: "Charleston", state: "SC", stateName: "South Carolina", county: "Charleston", filterGroup: sc, fiberTier: "primary" }),
  loc("columbia-sc", { city: "Columbia", state: "SC", stateName: "South Carolina", county: "Richland", filterGroup: sc, fiberTier: "primary" }),
  loc("greenville-sc", { city: "Greenville", state: "SC", stateName: "South Carolina", county: "Greenville", filterGroup: sc, fiberTier: "primary" }),
  loc("myrtle-beach-sc", { city: "Myrtle Beach", state: "SC", stateName: "South Carolina", county: "Horry", filterGroup: sc, fiberTier: "primary" }),
  loc("atlanta-ga", { city: "Atlanta", state: "GA", stateName: "Georgia", county: "Fulton", filterGroup: ga, fiberTier: "primary" }),
  loc("savannah-ga", { city: "Savannah", state: "GA", stateName: "Georgia", county: "Chatham", filterGroup: ga, fiberTier: "primary" }),
  loc("augusta-ga", { city: "Augusta", state: "GA", stateName: "Georgia", county: "Richmond", filterGroup: ga, fiberTier: "primary" }),
  loc("miami-fl", { city: "Miami", state: "FL", stateName: "Florida", county: "Miami-Dade", filterGroup: fl, fiberTier: "primary" }),
  loc("jacksonville-fl", { city: "Jacksonville", state: "FL", stateName: "Florida", county: "Duval", filterGroup: fl, fiberTier: "primary" }),
  loc("orlando-fl", { city: "Orlando", state: "FL", stateName: "Florida", county: "Orange", filterGroup: fl, fiberTier: "primary" }),
  loc("fort-lauderdale-fl", { city: "Fort Lauderdale", state: "FL", stateName: "Florida", county: "Broward", filterGroup: fl, fiberTier: "primary" }),
  loc("west-palm-beach-fl", { city: "West Palm Beach", state: "FL", stateName: "Florida", county: "Palm Beach", filterGroup: fl, fiberTier: "primary" }),
  loc("st-petersburg-fl", { city: "St. Petersburg", state: "FL", stateName: "Florida", county: "Pinellas", filterGroup: fl, fiberTier: "primary" }),
  loc("scranton-pa", { city: "Scranton", state: "PA", stateName: "Pennsylvania", county: "Lackawanna County", filterGroup: nepa, fiberTier: "optional" }),
  loc("wilkes-barre-pa", { city: "Wilkes-Barre", state: "PA", stateName: "Pennsylvania", county: "Luzerne County", filterGroup: nepa, fiberTier: "optional" }),

  loc("cherry-hill-nj", { city: "Cherry Hill", state: "NJ", stateName: "New Jersey", county: "Camden County", filterGroup: "South Jersey" }),
  loc("voorhees-nj", { city: "Voorhees", state: "NJ", stateName: "New Jersey", county: "Camden County", filterGroup: "South Jersey" }),
  loc("mount-laurel-nj", { city: "Mount Laurel", state: "NJ", stateName: "New Jersey", county: "Burlington County", filterGroup: "South Jersey" }),
  loc("moorestown-nj", { city: "Moorestown", state: "NJ", stateName: "New Jersey", county: "Burlington County", filterGroup: "South Jersey" }),
  loc("marlton-nj", { city: "Marlton", state: "NJ", stateName: "New Jersey", county: "Burlington County", filterGroup: "South Jersey" }),
  loc("deptford-nj", { city: "Deptford", state: "NJ", stateName: "New Jersey", county: "Gloucester County", filterGroup: "South Jersey" }),
  loc("egg-harbor-township-nj", { city: "Egg Harbor Township", state: "NJ", stateName: "New Jersey", county: "Atlantic County", filterGroup: "South Jersey" }),
  loc("vineland-nj", { city: "Vineland", state: "NJ", stateName: "New Jersey", county: "Cumberland County", filterGroup: "South Jersey" }),

  loc("doylestown-pa", { city: "Doylestown", state: "PA", stateName: "Pennsylvania", county: "Bucks County", filterGroup: "Philadelphia suburbs" }),
  loc("bensalem-pa", { city: "Bensalem", state: "PA", stateName: "Pennsylvania", county: "Bucks County", filterGroup: "Philadelphia suburbs" }),
  loc("newtown-pa", { city: "Newtown", state: "PA", stateName: "Pennsylvania", county: "Bucks County", filterGroup: "Philadelphia suburbs" }),
  loc("langhorne-pa", { city: "Langhorne", state: "PA", stateName: "Pennsylvania", county: "Bucks County", filterGroup: "Philadelphia suburbs" }),
  loc("king-of-prussia-pa", { city: "King of Prussia", state: "PA", stateName: "Pennsylvania", county: "Montgomery County", filterGroup: "Philadelphia suburbs" }),
  loc("norristown-pa", { city: "Norristown", state: "PA", stateName: "Pennsylvania", county: "Montgomery County", filterGroup: "Philadelphia suburbs" }),
  loc("lansdale-pa", { city: "Lansdale", state: "PA", stateName: "Pennsylvania", county: "Montgomery County", filterGroup: "Philadelphia suburbs" }),
  loc("conshohocken-pa", { city: "Conshohocken", state: "PA", stateName: "Pennsylvania", county: "Montgomery County", filterGroup: "Philadelphia suburbs" }),
  loc("media-pa", { city: "Media", state: "PA", stateName: "Pennsylvania", county: "Delaware County", filterGroup: "Philadelphia suburbs" }),
  loc("wayne-pa", { city: "Wayne", state: "PA", stateName: "Pennsylvania", county: "Delaware County", filterGroup: "Philadelphia suburbs" }),
  loc("springfield-pa", { city: "Springfield", state: "PA", stateName: "Pennsylvania", county: "Delaware County", filterGroup: "Philadelphia suburbs" }),
  loc("upper-darby-pa", { city: "Upper Darby", state: "PA", stateName: "Pennsylvania", county: "Delaware County", filterGroup: "Philadelphia suburbs" }),
  loc("west-chester-pa", { city: "West Chester", state: "PA", stateName: "Pennsylvania", county: "Chester County", filterGroup: "Philadelphia suburbs" }),
  loc("exton-pa", { city: "Exton", state: "PA", stateName: "Pennsylvania", county: "Chester County", filterGroup: "Philadelphia suburbs" }),
  loc("downingtown-pa", { city: "Downingtown", state: "PA", stateName: "Pennsylvania", county: "Chester County", filterGroup: "Philadelphia suburbs" }),
  loc("kennett-square-pa", { city: "Kennett Square", state: "PA", stateName: "Pennsylvania", county: "Chester County", filterGroup: "Philadelphia suburbs" }),

  loc("lancaster-pa", { city: "Lancaster", state: "PA", stateName: "Pennsylvania", county: "Lancaster County", filterGroup: "Lancaster" }),
  loc("chicago-il", { city: "Chicago", state: "IL", stateName: "Illinois", county: "Cook County", filterGroup: "Chicago" }),
  loc("boston-ma", { city: "Boston", state: "MA", stateName: "Massachusetts", county: "Suffolk County", filterGroup: "Boston" }),
]

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug) ?? null
}

export function fiberMarkets() {
  return locations.filter((location) => location.isFiberMarket)
}

export function isFiberMarketSlug(slug: string) {
  return getLocation(slug)?.isFiberMarket === true
}

export function locationsByGroup() {
  const groups = new Map<string, LocationRecord[]>()
  for (const location of locations) {
    const list = groups.get(location.filterGroup) ?? []
    list.push(location)
    groups.set(location.filterGroup, list)
  }
  return [...groups.entries()]
}

export function placeLabel(location: Pick<LocationRecord, "city" | "state" | "county">) {
  if (location.state === "PA" || location.state === "NJ") {
    return `${location.city}, ${location.state} · ${location.county}`
  }
  return `${location.city}, ${location.state}`
}
