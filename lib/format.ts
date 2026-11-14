const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function formatDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-")
  const monthIndex = Number(month) - 1
  if (!year || !day || monthIndex < 0 || monthIndex > 11) return iso
  return `${MONTHS[monthIndex]} ${Number(day)}, ${year}`
}

export function one(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount < 1000 ? 0 : 0,
  }).format(amount)
}

const UNIT_LABEL: Record<string, string> = {
  YEAR: "year",
  HOUR: "hour",
  WEEK: "week",
  MONTH: "month",
}

export function payLine(job: {
  salaryMin: number | null
  salaryMax: number | null
  salaryUnit: string | null
  commissionNote: string
}) {
  if (job.salaryMin == null) return job.commissionNote
  const unit = job.salaryUnit ? UNIT_LABEL[job.salaryUnit] ?? job.salaryUnit : ""
  const range =
    job.salaryMax != null && job.salaryMax !== job.salaryMin
      ? `${money(job.salaryMin)}–${money(job.salaryMax)}`
      : money(job.salaryMin)
  const base = unit ? `${range} / ${unit}` : range
  return job.commissionNote ? `${base} · ${job.commissionNote}` : base
}
