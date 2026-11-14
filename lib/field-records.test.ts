import assert from "node:assert/strict"
import test from "node:test"
import {
  dayKey,
  emptyDraft,
  filterLeads,
  leadFromDraft,
  leadsToCsv,
  normalizeField,
  splitFollowUps,
  todayStats,
  validateDraft,
  type Lead,
} from "./field/records"

function lead(partial: Partial<Lead> & Pick<Lead, "id" | "createdAt">): Lead {
  return {
    name: "Ada",
    address: "1 Main",
    phone: "",
    email: "",
    industry: "fiber",
    status: "not_home",
    notes: "",
    latitude: null,
    longitude: null,
    updatedAt: partial.createdAt,
    followUpOn: null,
    ...partial,
  }
}

test("day key uses the local calendar date", () => {
  assert.equal(dayKey(new Date(2026, 10, 14, 9, 30)), "2026-11-14")
})

test("today stats count logged stops and overdue follow-ups", () => {
  const now = new Date(2026, 10, 14, 18, 0)
  const leads = [
    lead({ id: "1", createdAt: new Date(2026, 10, 14, 9).toISOString(), status: "sold" }),
    lead({ id: "2", createdAt: new Date(2026, 10, 14, 11).toISOString(), status: "lead" }),
    lead({ id: "3", createdAt: new Date(2026, 10, 13, 11).toISOString(), status: "sold", followUpOn: "2026-11-13" }),
    lead({ id: "4", createdAt: new Date(2026, 10, 14, 12).toISOString(), status: "callback", followUpOn: "2026-11-16" }),
  ]
  assert.deepEqual(todayStats(leads, now), { knocked: 3, leads: 1, sold: 1, followUpsDue: 1 })
})

test("search matches notes and filters stack", () => {
  const leads = [
    lead({ id: "1", createdAt: "2026-11-14T15:00:00.000Z", name: "Mina", notes: "Ask about fiber", status: "lead" }),
    lead({ id: "2", createdAt: "2026-11-14T16:00:00.000Z", name: "Owen", address: "9 Oak", industry: "roofing" }),
  ]
  assert.deepEqual(
    filterLeads(leads, "FIBER", "", "").map((item) => item.id),
    ["1"],
  )
  assert.deepEqual(
    filterLeads(leads, "", "not_home", "roofing").map((item) => item.id),
    ["2"],
  )
})

test("follow-ups split on the local day", () => {
  const now = new Date(2026, 10, 14, 8)
  const leads = [
    lead({ id: "due", createdAt: "2026-11-01T12:00:00.000Z", followUpOn: "2026-11-14" }),
    lead({ id: "later", createdAt: "2026-11-01T12:00:00.000Z", followUpOn: "2026-11-20" }),
    lead({ id: "none", createdAt: "2026-11-01T12:00:00.000Z" }),
  ]
  const split = splitFollowUps(leads, now)
  assert.deepEqual(split.due.map((item) => item.id), ["due"])
  assert.deepEqual(split.later.map((item) => item.id), ["later"])
})

test("validation requires a name or address, a real industry, and a real email", () => {
  assert.equal(validateDraft(emptyDraft()), "Add a name or an address.")
  assert.equal(validateDraft({ ...emptyDraft(), address: "1 Main" }), "Choose a product.")
  assert.equal(
    validateDraft({ ...emptyDraft(), address: "1 Main", industry: "fiber", email: "not-an-email" }),
    "That email does not look complete.",
  )
  assert.equal(validateDraft({ ...emptyDraft(), name: "Ada", industry: "pest-control" }), null)
})

test("csv quotes commas and keeps the industry name", () => {
  const saved = leadFromDraft(
    { ...emptyDraft(), name: 'Ada "A"', address: "1 Main, Unit 2", industry: "windows-doors", notes: "line\n2" },
    "id-1",
    "2026-11-14T15:04:00.000Z",
    null,
  )
  const csv = leadsToCsv([saved])
  assert.equal(csv.charCodeAt(0), 0xfeff)
  assert.match(csv, /Windows & doors/)
  assert.match(csv, /"Ada ""A"""/)
  assert.match(csv, /"1 Main, Unit 2"/)
  assert.match(csv, /"line\n2"/)
})

test("normalize drops broken rows and unknown industries", () => {
  const data = normalizeField({
    repName: "  Colin  ",
    leads: [{ id: "", createdAt: "2026-11-14T00:00:00.000Z" }, { id: "ok", createdAt: "2026-11-14T00:00:00.000Z", industry: "nope", name: "Ada" }, "bad"],
  })
  assert.equal(data.repName, "Colin")
  assert.equal(data.leads.length, 1)
  assert.equal(data.leads[0]?.industry, "")
  assert.equal(data.leads[0]?.name, "Ada")
})
