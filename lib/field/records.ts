import { industries, type IndustrySlug } from "@/data/industries"

export const statuses = [
  { id: "not_home", label: "Not home" },
  { id: "not_interested", label: "Not interested" },
  { id: "callback", label: "Callback" },
  { id: "lead", label: "Lead" },
  { id: "sold", label: "Sold" },
] as const

export type StatusId = (typeof statuses)[number]["id"]

export const statDefs = [
  { key: "knocked", label: "Doors", hint: "Stops logged today" },
  { key: "leads", label: "Leads", hint: "Status Lead, logged today" },
  { key: "sold", label: "Sales", hint: "Status Sold, logged today" },
  { key: "followUpsDue", label: "Follow-ups", hint: "Dated today or earlier" },
] as const

export const onDeviceNote =
  "Stops stay in this browser on this phone. They are not uploaded to D2D Job or HighLevel."

export const gpsHint =
  "Optional. The browser asks before it shares a location. Coordinates stay on this phone."

export const emptyToday = "No stops logged today."

export const emptyLeads = "No stops yet. Log the next door and it will show up here."

export const emptyFollowUps = "No follow-ups yet. Add a date on a stop and it will show up here."

export const emptySearch = "No stops match that search."

export type Lead = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  industry: IndustrySlug | ""
  status: StatusId
  notes: string
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
  followUpOn: string | null
}

export type FieldData = {
  repName: string
  leads: Lead[]
}

export type Draft = {
  name: string
  address: string
  phone: string
  email: string
  industry: string
  status: StatusId
  notes: string
  followUpOn: string
  latitude: number | null
  longitude: number | null
}

export type TodayStats = {
  knocked: number
  leads: number
  sold: number
  followUpsDue: number
}

const statusIds = new Set<string>(statuses.map((status) => status.id))
const industrySlugs = new Set<string>(industries.map((industry) => industry.slug))

export function emptyField(): FieldData {
  return { repName: "", leads: [] }
}

export function emptyDraft(): Draft {
  return {
    name: "",
    address: "",
    phone: "",
    email: "",
    industry: "",
    status: "not_home",
    notes: "",
    followUpOn: "",
    latitude: null,
    longitude: null,
  }
}

export function dayKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function industryName(slug: string) {
  return industries.find((industry) => industry.slug === slug)?.name ?? slug
}

export function statusLabel(id: string) {
  return statuses.find((status) => status.id === id)?.label ?? id
}

export function formatDay(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number)
  if (!year || !month || !day) return isoDate
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(year, month - 1, day))
}

export function formatWhen(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function stopCount(count: number) {
  return `${count} ${count === 1 ? "stop" : "stops"}`
}

function clip(value: string, max: number) {
  return value.trim().slice(0, max)
}

function asStatus(value: unknown): StatusId {
  return typeof value === "string" && statusIds.has(value) ? (value as StatusId) : "not_home"
}

function asIndustry(value: unknown): IndustrySlug | "" {
  return typeof value === "string" && industrySlugs.has(value) ? (value as IndustrySlug) : ""
}

function asCoord(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function asDay(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null
}

export function normalizeLead(input: unknown): Lead | null {
  if (!input || typeof input !== "object") return null
  const raw = input as Partial<Lead>
  if (typeof raw.id !== "string" || raw.id.length === 0) return null
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : ""
  if (!createdAt) return null
  return {
    id: raw.id.slice(0, 80),
    name: typeof raw.name === "string" ? clip(raw.name, 120) : "",
    address: typeof raw.address === "string" ? clip(raw.address, 200) : "",
    phone: typeof raw.phone === "string" ? clip(raw.phone, 40) : "",
    email: typeof raw.email === "string" ? clip(raw.email, 120) : "",
    industry: asIndustry(raw.industry),
    status: asStatus(raw.status),
    notes: typeof raw.notes === "string" ? clip(raw.notes, 2000) : "",
    latitude: asCoord(raw.latitude),
    longitude: asCoord(raw.longitude),
    createdAt,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : createdAt,
    followUpOn: asDay(raw.followUpOn),
  }
}

export function normalizeField(input: unknown): FieldData {
  if (!input || typeof input !== "object") return emptyField()
  const raw = input as Partial<FieldData>
  const leads = Array.isArray(raw.leads)
    ? raw.leads.map(normalizeLead).filter((lead): lead is Lead => lead !== null)
    : []
  return {
    repName: typeof raw.repName === "string" ? clip(raw.repName, 80) : "",
    leads,
  }
}

export function validateDraft(draft: Draft) {
  if (!draft.name.trim() && !draft.address.trim()) return "Add a name or an address."
  if (!industrySlugs.has(draft.industry)) return "Choose a product."
  if (!statusIds.has(draft.status)) return "Choose a status."
  if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
    return "That email does not look complete."
  }
  if (draft.followUpOn && !/^\d{4}-\d{2}-\d{2}$/.test(draft.followUpOn)) return "Use a follow-up date."
  if (draft.notes.trim().length > 2000) return "Notes need to be under 2000 characters."
  return null
}

export function leadFromDraft(draft: Draft, id: string | null, nowIso: string, createdAt: string | null): Lead {
  const latitude = asCoord(draft.latitude)
  const longitude = asCoord(draft.longitude)
  return {
    id: id ?? crypto.randomUUID(),
    name: clip(draft.name, 120),
    address: clip(draft.address, 200),
    phone: clip(draft.phone, 40),
    email: clip(draft.email, 120),
    industry: asIndustry(draft.industry),
    status: asStatus(draft.status),
    notes: clip(draft.notes, 2000),
    latitude: latitude !== null && longitude !== null ? latitude : null,
    longitude: latitude !== null && longitude !== null ? longitude : null,
    createdAt: createdAt ?? nowIso,
    updatedAt: nowIso,
    followUpOn: asDay(draft.followUpOn),
  }
}

export function draftFromLead(lead: Lead): Draft {
  return {
    name: lead.name,
    address: lead.address,
    phone: lead.phone,
    email: lead.email,
    industry: lead.industry,
    status: lead.status,
    notes: lead.notes,
    followUpOn: lead.followUpOn ?? "",
    latitude: lead.latitude,
    longitude: lead.longitude,
  }
}

export function leadsOnDay(leads: Lead[], now = new Date()) {
  const today = dayKey(now)
  return leads
    .filter((lead) => dayKey(new Date(lead.createdAt)) === today)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function todayStats(leads: Lead[], now = new Date()): TodayStats {
  const today = dayKey(now)
  const loggedToday = leadsOnDay(leads, now)
  return {
    knocked: loggedToday.length,
    leads: loggedToday.filter((lead) => lead.status === "lead").length,
    sold: loggedToday.filter((lead) => lead.status === "sold").length,
    followUpsDue: leads.filter((lead) => lead.followUpOn !== null && lead.followUpOn <= today).length,
  }
}

export function filterLeads(leads: Lead[], query: string, status: string, industry: string) {
  const needle = query.trim().toLowerCase()
  return leads
    .filter((lead) => {
      if (status && lead.status !== status) return false
      if (industry && lead.industry !== industry) return false
      if (!needle) return true
      const haystack = [lead.name, lead.address, lead.phone, lead.email, lead.notes].join(" ").toLowerCase()
      return haystack.includes(needle)
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function splitFollowUps(leads: Lead[], now = new Date()) {
  const today = dayKey(now)
  const dated = leads
    .filter((lead) => lead.followUpOn)
    .sort((a, b) => (a.followUpOn ?? "").localeCompare(b.followUpOn ?? "") || b.createdAt.localeCompare(a.createdAt))
  return {
    due: dated.filter((lead) => (lead.followUpOn ?? "") <= today),
    later: dated.filter((lead) => (lead.followUpOn ?? "") > today),
  }
}

function csvCell(value: string) {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function leadsToCsv(leads: Lead[]) {
  const header = [
    "Created",
    "Updated",
    "Name",
    "Address",
    "Phone",
    "Email",
    "Industry",
    "Status",
    "Notes",
    "Latitude",
    "Longitude",
    "Follow-up",
  ]
  const lines = leads.map((lead) =>
    [
      lead.createdAt,
      lead.updatedAt,
      lead.name,
      lead.address,
      lead.phone,
      lead.email,
      industryName(lead.industry),
      statusLabel(lead.status),
      lead.notes,
      lead.latitude === null ? "" : String(lead.latitude),
      lead.longitude === null ? "" : String(lead.longitude),
      lead.followUpOn ?? "",
    ]
      .map(csvCell)
      .join(","),
  )
  return `\uFEFF${header.join(",")}\n${lines.join("\n")}${lines.length ? "\n" : ""}`
}

export function statsToItems(stats: TodayStats) {
  return statDefs.map((item) => ({
    label: item.label,
    hint: item.hint,
    value: stats[item.key],
  }))
}
