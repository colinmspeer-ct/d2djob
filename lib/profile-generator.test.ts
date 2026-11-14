import assert from "node:assert/strict"
import test from "node:test"
import { generateFromTemplate, redactNotes } from "./profile-generator.ts"

test("template profile hides the legal name, phone, and email", () => {
  const profile = generateFromTemplate({
    pseudonym: "Marcus R.",
    realName: "Marcus Reid",
    interviewNotes:
      "Call Marcus Reid at (555) 014-2200 or marcus.reid.sample@example.com. He ran fiber in Raleigh.",
    city: "Raleigh",
    state: "NC",
    county: "Wake",
    industryNames: ["Fiber"],
    yearsExperience: 6,
    salesType: "Residential fiber",
    availability: "Weekdays",
    willingToTravel: true,
    payStructure: "Base plus commission",
    workStyle: "team",
    schedule: "full-time",
  })
  const blob = JSON.stringify(profile)
  assert.doesNotMatch(blob, /Reid/)
  assert.doesNotMatch(blob, /014-2200/)
  assert.doesNotMatch(blob, /example\.com/)
  assert.match(profile.summary, /Marcus R\./)
  assert.match(profile.summary, /Raleigh/)
  assert.match(profile.summary, /fiber/i)
})

test("redactNotes strips contact details before a model sees them", () => {
  const redacted = redactNotes(
    "Elena Vasquez can be reached at elena.vasquez.sample@example.com or (555) 010-1002.",
    "Elena Vasquez",
  )
  assert.doesNotMatch(redacted, /Vasquez/)
  assert.doesNotMatch(redacted, /example\.com/)
  assert.doesNotMatch(redacted, /010-1002/)
  assert.match(redacted, /Elena/)
})
