export const WORK_STYLES = [
  { value: "team", label: "Team" },
  { value: "solo", label: "Solo" },
  { value: "either", label: "Team or solo" },
] as const

export const SCHEDULES = [
  { value: "full-time", label: "Full-time" },
  { value: "seasonal", label: "Seasonal" },
  { value: "either", label: "Full-time or seasonal" },
] as const

export const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACTOR", label: "Contract" },
  { value: "TEMPORARY", label: "Seasonal / temporary" },
] as const

export const SALARY_UNITS = [
  { value: "YEAR", label: "Per year" },
  { value: "HOUR", label: "Per hour" },
  { value: "WEEK", label: "Per week" },
  { value: "MONTH", label: "Per month" },
] as const

export function labelFor(list: readonly { value: string; label: string }[], value: string) {
  return list.find((item) => item.value === value)?.label ?? value
}
