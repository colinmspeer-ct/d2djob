import assert from "node:assert/strict"
import test from "node:test"
import { getLocation } from "../data/locations.ts"
import { sampleJobs } from "../data/jobs.ts"
import { buildJobPosting, buildJobPostingGraph, validateJobPosting } from "./job-posting.ts"

test("sample jobs build valid JobPosting nodes", () => {
  const nodes = sampleJobs.map((job) => {
    const location = getLocation(job.locationSlug)
    assert.ok(location)
    return buildJobPosting({
      ...job,
      city: location.city,
      state: location.state,
      siteUrl: "http://127.0.0.1:43123",
    })
  })

  for (const node of nodes) {
    assert.deepEqual(validateJobPosting(node), [])
  }

  const graph = buildJobPostingGraph(
    sampleJobs.map((job) => {
      const location = getLocation(job.locationSlug)!
      return { ...job, city: location.city, state: location.state, siteUrl: "http://127.0.0.1:43123" }
    }),
  )
  assert.equal(graph["@context"], "https://schema.org")
  assert.equal(graph["@graph"].length, sampleJobs.length)

  const roofing = nodes.find((node) => String(node.title).includes("Lancaster"))
  assert.ok(roofing)
  assert.equal("baseSalary" in roofing, false)
  assert.equal(typeof roofing.incentiveCompensation, "string")

  const fiber = nodes.find((node) => String(node.title).includes("Raleigh"))
  assert.ok(fiber)
  const salary = fiber.baseSalary as { currency: string; value: { minValue: number; unitText: string } }
  assert.equal(salary.currency, "USD")
  assert.equal(salary.value.unitText, "YEAR")
  assert.equal(salary.value.minValue, 42000)
  assert.equal(fiber.employmentType, "FULL_TIME")
})
