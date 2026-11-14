import assert from "node:assert/strict"
import test from "node:test"
import { industries } from "../data/industries.ts"
import {
  emptyForm,
  entriesToCsv,
  filterEntries,
  formToFields,
  industryLabel,
  localDay,
  partitionFollowUps,
  statsForDay,
  validateForm,
  type FieldEntry,
  type FieldForm,
} from "./field-model.ts"

function entry(overrides: Partial<FieldEntry> & Pick<FieldEntry, "id" | "createdAt" | "status">): FieldEntry {
  return {
    name: "",
    address: "1 Oak St",
    phone: "",
    email: "",
    industry: "fiber",
    notes: "",
    latitude: null,
    longitude: null,
    updatedAt: overrides.createdAt,
    followUpOn: null,
    ...overrides,
  }
}

test("the field app uses the seven site industries", () => {
  assert.equal(industries.length, 7)
  assert.deepEqual(
    industries.map((industry) => industry.slug),
    ["fiber", "pest-control", "roofing", "windows-doors", "window-cleaning", "exterior-cleaning", "exteriors"],
  )
  assert.equal(industryLabel("windows-doors"), "Windows & doors")
})

test("today's stats count knocks logged that local day", () => {
  const when = new Date(2026, 10, 14, 9, 30)
  const day = localDay(when)
  const yesterday = new Date(when)
  yesterday.setDate(yesterday.getDate() - 1)
  const entries = [
    entry({ id: "1", createdAt: when.toISOString(), status: "not_home" }),
    entry({ id: "2", createdAt: when.toISOString(), status: "lead" }),
    entry({ id: "3", createdAt: when.toISOString(), status: "sold" }),
    entry({ id: "4", createdAt: yesterday.toISOString(), status: "sold" }),
    entry({ id: "5", createdAt: yesterday.toISOString(), status: "callback", followUpOn: day }),
    entry({ id: "6", createdAt: when.toISOString(), status: "lead", followUpOn: "2099-01-01" }),
  ]
  assert.deepEqual(statsForDay(entries, day), { doors: 4, leads: 2, sales: 1, followUpsDue: 1 })
})

test("follow-ups split into due, upcoming, and needs a date", () => {
  const day = "2026-11-14"
  const groups = partitionFollowUps(
    [
      entry({ id: "due", createdAt: "2026-11-13T15:00:00.000Z", status: "callback", followUpOn: "2026-11-10" }),
      entry({ id: "today", createdAt: "2026-11-14T15:00:00.000Z", status: "lead", followUpOn: day }),
      entry({ id: "later", createdAt: "2026-11-14T15:00:00.000Z", status: "lead", followUpOn: "2026-12-01" }),
      entry({ id: "open", createdAt: "2026-11-14T15:00:00.000Z", status: "callback" }),
      entry({ id: "sold", createdAt: "2026-11-14T15:00:00.000Z", status: "sold" }),
    ],
    day,
  )
  assert.deepEqual(
    groups.due.map((item) => item.id),
    ["due", "today"],
  )
  assert.deepEqual(
    groups.upcoming.map((item) => item.id),
    ["later"],
  )
  assert.deepEqual(
    groups.needsDate.map((item) => item.id),
    ["open"],
  )
})

test("search and filters match the saved fields", () => {
  const entries = [
    entry({ id: "1", createdAt: "2026-11-14T15:00:00.000Z", status: "lead", name: "Ada Moss", address: "9 Pine" }),
    entry({
      id: "2",
      createdAt: "2026-11-14T16:00:00.000Z",
      status: "not_home",
      industry: "roofing",
      address: "4 Elm",
      notes: "dog in the yard",
    }),
  ]
  assert.equal(filterEntries(entries, "pine", "all", "all")[0]?.id, "1")
  assert.equal(filterEntries(entries, "dog", "not_home", "roofing")[0]?.id, "2")
  assert.equal(filterEntries(entries, "ada", "sold", "all").length, 0)
})

test("validation and csv export", () => {
  const missing = validateForm(emptyForm)
  assert.equal(missing, "Add a name or an address.")
  const form: FieldForm = {
    ...emptyForm,
    name: '=Ada "Moss"',
    address: "9 Pine, Unit 2",
    industry: "pest-control",
    status: "lead",
    email: "not-an-email",
  }
  assert.equal(validateForm(form), "That email looks incomplete.")
  form.email = "ada@example.com"
  assert.equal(validateForm(form), null)
  const saved = formToFields(form)
  const csv = entriesToCsv([
    {
      ...saved,
      id: "1",
      createdAt: "2026-11-14T15:00:00.000Z",
      updatedAt: "2026-11-14T15:00:00.000Z",
    },
  ])
  assert.match(csv, /Pest control/)
  assert.match(csv, /Lead/)
  assert.match(csv, /"'=Ada ""Moss"""/)
  assert.match(csv, /"9 Pine, Unit 2"/)
})
