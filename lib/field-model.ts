import { industries } from "../data/industries"

export const fieldStatuses = [
  { value: "not_home", label: "Not home" },
  { value: "not_interested", label: "Not interested" },
  { value: "callback", label: "Callback" },
  { value: "lead", label: "Lead" },
  { value: "sold", label: "Sold" },
] as const

export type FieldStatus = (typeof fieldStatuses)[number]["value"]

export type FieldEntry = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  industry: string
  status: FieldStatus
  notes: string
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
  followUpOn: string | null
}

export type FieldForm = {
  name: string
  address: string
  phone: string
  email: string
  industry: string
  status: FieldStatus | ""
  notes: string
  latitude: number | null
  longitude: number | null
  followUpOn: string
}

export const emptyForm: FieldForm = {
  name: "",
  address: "",
  phone: "",
  email: "",
  industry: "",
  status: "",
  notes: "",
  latitude: null,
  longitude: null,
  followUpOn: "",
}

export function isFieldStatus(value: string): value is FieldStatus {
  return fieldStatuses.some((status) => status.value === value)
}

export function industryLabel(slug: string) {
  return industries.find((industry) => industry.slug === slug)?.name ?? slug
}

export function statusLabel(status: FieldStatus) {
  return fieldStatuses.find((item) => item.value === status)?.label ?? status
}

export function localDay(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function dayOf(iso: string) {
  return localDay(new Date(iso))
}

export type DayStats = {
  doors: number
  leads: number
  sales: number
  followUpsDue: number
}

export function statsForDay(entries: FieldEntry[], day: string): DayStats {
  let doors = 0
  let leads = 0
  let sales = 0
  for (const entry of entries) {
    if (dayOf(entry.createdAt) !== day) continue
    doors += 1
    if (entry.status === "lead") leads += 1
    if (entry.status === "sold") sales += 1
  }
  const followUpsDue = entries.filter((entry) => entry.followUpOn !== null && entry.followUpOn <= day).length
  return { doors, leads, sales, followUpsDue }
}

export function partitionFollowUps(entries: FieldEntry[], day: string) {
  const due: FieldEntry[] = []
  const upcoming: FieldEntry[] = []
  const needsDate: FieldEntry[] = []
  for (const entry of entries) {
    if (entry.followUpOn) {
      if (entry.followUpOn <= day) due.push(entry)
      else upcoming.push(entry)
    } else if (entry.status === "callback" || entry.status === "lead") {
      needsDate.push(entry)
    }
  }
  const byFollowUp = (a: FieldEntry, b: FieldEntry) =>
    (a.followUpOn || "").localeCompare(b.followUpOn || "") || b.updatedAt.localeCompare(a.updatedAt)
  due.sort(byFollowUp)
  upcoming.sort(byFollowUp)
  needsDate.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return { due, upcoming, needsDate }
}

export function filterEntries(entries: FieldEntry[], query: string, status: string, industry: string) {
  const needle = query.trim().toLowerCase()
  return entries
    .filter((entry) => {
      if (status && status !== "all" && entry.status !== status) return false
      if (industry && industry !== "all" && entry.industry !== industry) return false
      if (!needle) return true
      const haystack = [entry.name, entry.address, entry.phone, entry.email, entry.notes, industryLabel(entry.industry)]
        .join(" ")
        .toLowerCase()
      return haystack.includes(needle)
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function entryTitle(entry: Pick<FieldEntry, "name" | "address">) {
  return entry.name.trim() || entry.address.trim() || "Untitled knock"
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso))
}

export function formatDayLabel(day: string) {
  const [year, month, date] = day.split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(year, (month || 1) - 1, date || 1))
}

export function formatCoords(latitude: number, longitude: number) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}

export function validateForm(form: FieldForm) {
  if (!form.name.trim() && !form.address.trim()) return "Add a name or an address."
  if (!form.industry.trim()) return "Choose an industry."
  if (!isFieldStatus(form.status)) return "Choose a status."
  const email = form.email.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "That email looks incomplete."
  if (form.followUpOn && !/^\d{4}-\d{2}-\d{2}$/.test(form.followUpOn)) return "That follow-up date is not valid."
  return null
}

export function formToFields(form: FieldForm): Omit<FieldEntry, "id" | "createdAt" | "updatedAt"> {
  if (!isFieldStatus(form.status)) throw new Error("Choose a status before saving.")
  return {
    name: form.name.trim(),
    address: form.address.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    industry: form.industry,
    status: form.status,
    notes: form.notes.trim(),
    latitude: form.latitude,
    longitude: form.longitude,
    followUpOn: form.followUpOn || null,
  }
}

export function entryToForm(entry: FieldEntry): FieldForm {
  return {
    name: entry.name,
    address: entry.address,
    phone: entry.phone,
    email: entry.email,
    industry: entry.industry,
    status: entry.status,
    notes: entry.notes,
    latitude: entry.latitude,
    longitude: entry.longitude,
    followUpOn: entry.followUpOn ?? "",
  }
}

function csvCell(value: string) {
  let text = value
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export function entriesToCsv(entries: FieldEntry[]) {
  const header = [
    "name",
    "address",
    "phone",
    "email",
    "industry",
    "status",
    "notes",
    "latitude",
    "longitude",
    "createdAt",
    "updatedAt",
    "followUpOn",
  ]
  const lines = entries.map((entry) =>
    [
      entry.name,
      entry.address,
      entry.phone,
      entry.email,
      industryLabel(entry.industry),
      statusLabel(entry.status),
      entry.notes,
      entry.latitude === null ? "" : String(entry.latitude),
      entry.longitude === null ? "" : String(entry.longitude),
      entry.createdAt,
      entry.updatedAt,
      entry.followUpOn ?? "",
    ]
      .map(csvCell)
      .join(","),
  )
  return `\uFEFF${header.join(",")}\n${lines.join("\n")}${lines.length ? "\n" : ""}`
}
