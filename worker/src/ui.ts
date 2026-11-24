import { locationsByGroup } from "../../data/locations"
import { industries } from "../../data/industries"
import { EMPLOYMENT_TYPES, SALARY_UNITS, SCHEDULES, WORK_STYLES } from "../../lib/labels"
import { escapeHtml } from "../../packages/training-library/src/html"

export function banners(requestUrl: string) {
  const query = new URL(requestUrl).searchParams
  const blocks: string[] = []
  const error = query.get("error")
  const notice = query.get("notice")
  const notices: Record<string, string> = {
    saved: "Saved.",
    template: "Drafted from the built-in template. No model key is set.",
    openai: "Drafted with the model.",
    fallback: "The model failed, so this draft used the template.",
    logged: "Request logged.",
  }
  if (error) blocks.push(`<p class="banner bad" role="alert">${escapeHtml(error)}</p>`)
  if (notice && notices[notice]) blocks.push(`<p class="banner ok" role="status">${notices[notice]}</p>`)
  return blocks.join("")
}

export function field(
  label: string,
  name: string,
  value = "",
  options?: { type?: string; required?: boolean; textarea?: boolean; hint?: string; rows?: number },
) {
  const required = options?.required ? " required" : ""
  const hint = options?.hint ? `<small>${escapeHtml(options.hint)}</small>` : ""
  const control = options?.textarea
    ? `<textarea name="${name}" rows="${options.rows ?? 5}"${required}>${escapeHtml(value)}</textarea>`
    : options?.type === "file"
      ? `<input name="${name}" type="file" accept="image/jpeg,image/png,image/webp"${required}>`
      : `<input name="${name}" type="${options?.type ?? "text"}" value="${escapeHtml(value)}"${required}>`
  return `<label class="field"><span>${escapeHtml(label)}</span>${control}${hint}</label>`
}

export function selectField(
  label: string,
  name: string,
  value: string,
  options: readonly { value: string; label: string }[],
  extra?: { required?: boolean; blank?: string },
) {
  const blank = extra?.blank ? `<option value="">${escapeHtml(extra.blank)}</option>` : ""
  const choices = options
    .map((option) => `<option value="${escapeHtml(option.value)}"${option.value === value ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("")
  return `<label class="field"><span>${escapeHtml(label)}</span><select name="${name}"${extra?.required ? " required" : ""}>${blank}${choices}</select></label>`
}

export function locationField(value: string) {
  const groups = locationsByGroup()
    .map(([group, places]) => {
      const options = places
        .map(
          (place) =>
            `<option value="${escapeHtml(place.slug)}"${place.slug === value ? " selected" : ""}>${escapeHtml(place.city)}, ${escapeHtml(place.state)}</option>`,
        )
        .join("")
      return `<optgroup label="${escapeHtml(group)}">${options}</optgroup>`
    })
    .join("")
  return `<label class="field"><span>Location</span><select name="locationSlug" required><option value="">Pick a city</option>${groups}</select></label>`
}

export function industryChecks(selected: string[]) {
  const chosen = new Set(selected)
  const boxes = industries
    .map(
      (industry) => `<label class="check"><input type="checkbox" name="industries" value="${industry.slug}"${chosen.has(industry.slug) ? " checked" : ""}> ${escapeHtml(industry.name)}</label>`,
    )
    .join("")
  return `<fieldset><legend>Industries</legend><div class="checks">${boxes}</div></fieldset>`
}

export function workFields(values: { workStyle: string; schedule: string }) {
  return [
    selectField("Team or solo", "workStyle", values.workStyle, WORK_STYLES, { blank: "Not specified" }),
    selectField("Schedule", "schedule", values.schedule, SCHEDULES, { blank: "Not specified" }),
  ].join("")
}

export function jobChoices() {
  return {
    employment: EMPLOYMENT_TYPES,
    salary: SALARY_UNITS,
  }
}

export { escapeHtml }
