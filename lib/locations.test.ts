import assert from "node:assert/strict"
import test from "node:test"
import { catalogProblems, resolveIndustryGeo } from "../data/geo.ts"
import { getLocation, locations } from "../data/locations.ts"

const primary = [
  "charlotte-nc",
  "raleigh-nc",
  "atlanta-ga",
  "miami-fl",
  "jacksonville-fl",
  "orlando-fl",
  "fort-lauderdale-fl",
  "durham-nc",
  "greensboro-nc",
  "winston-salem-nc",
  "charleston-sc",
  "columbia-sc",
  "greenville-sc",
  "savannah-ga",
  "augusta-ga",
  "west-palm-beach-fl",
  "st-petersburg-fl",
  "wilmington-nc",
  "myrtle-beach-sc",
  "asheville-nc",
]

test("catalog matches the AT&T Fiber market rule", () => {
  assert.deepEqual(catalogProblems(), [])
  assert.deepEqual(
    locations.filter((location) => location.fiberTier === "primary").map((location) => location.slug).sort(),
    [...primary].sort(),
  )
  assert.deepEqual(
    locations.filter((location) => location.fiberTier === "optional").map((location) => location.slug).sort(),
    ["scranton-pa", "wilkes-barre-pa"],
  )
})

test("non-fiber markets stay available for other industries", () => {
  for (const slug of ["cherry-hill-nj", "lancaster-pa", "west-chester-pa", "king-of-prussia-pa", "boston-ma", "chicago-il", "doylestown-pa"]) {
    const location = getLocation(slug)
    assert.ok(location)
    assert.equal(location.isFiberMarket, false)
    assert.equal(resolveIndustryGeo("fiber-sales-jobs", slug), null)
    assert.ok(resolveIndustryGeo("roofing-sales-jobs", slug))
    assert.ok(resolveIndustryGeo("pest-control-sales-jobs", slug))
  }
  assert.ok(resolveIndustryGeo("fiber-sales-jobs", "raleigh-nc"))
  assert.ok(resolveIndustryGeo("fiber-sales-jobs", "scranton-pa"))
  assert.ok(resolveIndustryGeo("pest-control-sales-jobs", "raleigh-nc"))
})
