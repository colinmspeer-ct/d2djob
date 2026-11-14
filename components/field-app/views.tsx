import { CalendarClock, House, List, Settings, SquarePen } from "lucide-react"
import { industries } from "@/data/industries"
import {
  fieldStatuses,
  formatCoords,
  industryLabel,
  statusLabel,
  type FieldForm,
  type FieldStatus,
} from "@/lib/field-model"

export const tabs = [
  { id: "home", label: "Home", icon: House },
  { id: "log", label: "Log", icon: SquarePen },
  { id: "leads", label: "Leads", icon: List },
  { id: "followups", label: "Follow-ups", short: "Follow", icon: CalendarClock },
  { id: "settings", label: "Settings", icon: Settings },
] as const

export type FieldTab = (typeof tabs)[number]["id"]

export const controlClass =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-70"

const statusTone: Record<FieldStatus, string> = {
  not_home: "bg-secondary text-foreground",
  not_interested: "bg-muted text-muted-foreground",
  callback: "bg-accent text-foreground",
  lead: "bg-primary text-primary-foreground",
  sold: "bg-clay text-[#fffdf8]",
}

export function StatusBadge({ status }: { status: FieldStatus }) {
  return (
    <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusTone[status]}`}>
      {statusLabel(status)}
    </span>
  )
}

export function TabStrip({ active, onSelect }: { active: FieldTab; onSelect?: (tab: FieldTab) => void }) {
  return (
    <div className="grid grid-cols-5" role="tablist" aria-label="Field app">
      {tabs.map((tab) => {
        const selected = tab.id === active
        const Icon = tab.icon
        const className = `flex flex-col items-center gap-0.5 px-1 py-2 text-[0.65rem] leading-none ${
          selected ? "text-primary" : "text-muted-foreground"
        }`
        const label = "short" in tab ? tab.short : tab.label
        const inner = (
          <>
            <Icon aria-hidden="true" className="size-5" strokeWidth={selected ? 2.4 : 2} />
            <span>{label}</span>
          </>
        )
        if (!onSelect) {
          return (
            <div key={tab.id} role="tab" aria-selected={selected} aria-label={tab.label} className={className}>
              {inner}
            </div>
          )
        }
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={tab.label}
            className={className}
            onClick={() => onSelect(tab.id)}
          >
            {inner}
          </button>
        )
      })}
    </div>
  )
}

export function StatGrid({
  doors,
  leads,
  sales,
  followUpsDue,
}: {
  doors: number
  leads: number
  sales: number
  followUpsDue: number
}) {
  const tiles = [
    { label: "Doors", value: doors, hint: "Knocks logged today" },
    { label: "Leads", value: leads, hint: "Logged today as lead" },
    { label: "Jobs", value: sales, hint: "Logged today as sold" },
    { label: "Due", value: followUpsDue, hint: "Follow-ups due" },
  ]
  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-2xl bg-card px-3 py-3 ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">{tile.label}</p>
          <p className="mt-1 font-heading text-3xl leading-none">{tile.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{tile.hint}</p>
        </div>
      ))}
    </div>
  )
}

function Labeled({
  id,
  label,
  hint,
  children,
}: {
  id?: string
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function LogFields({
  value,
  radioName,
  readOnly = false,
  locating = false,
  geoMessage = "",
  onChange,
  onLocate,
  onClearLocation,
}: {
  value: FieldForm
  radioName: string
  readOnly?: boolean
  locating?: boolean
  geoMessage?: string
  onChange?: (next: FieldForm) => void
  onLocate?: () => void
  onClearLocation?: () => void
}) {
  function set<K extends keyof FieldForm>(key: K, next: FieldForm[K]) {
    onChange?.({ ...value, [key]: next })
  }

  const text = (key: "name" | "address" | "phone" | "email" | "notes") =>
    readOnly
      ? { defaultValue: value[key], disabled: true, readOnly: true }
      : { value: value[key], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, event.target.value) }

  return (
    <div className="grid gap-4">
      <Labeled id={`${radioName}-name`} label="Name" hint="Leave blank if nobody answered.">
        <input id={`${radioName}-name`} className={controlClass} autoComplete="off" {...text("name")} />
      </Labeled>
      <Labeled id={`${radioName}-address`} label="Address">
        <input id={`${radioName}-address`} className={controlClass} autoComplete="off" {...text("address")} />
      </Labeled>
      <Labeled id={`${radioName}-phone`} label="Phone">
        <input id={`${radioName}-phone`} className={controlClass} type="tel" inputMode="tel" autoComplete="off" {...text("phone")} />
      </Labeled>
      <Labeled id={`${radioName}-email`} label="Email">
        <input id={`${radioName}-email`} className={controlClass} type="email" inputMode="email" autoComplete="off" {...text("email")} />
      </Labeled>
      <Labeled id={`${radioName}-industry`} label="Industry">
        <select
          id={`${radioName}-industry`}
          className={controlClass}
          disabled={readOnly}
          {...(readOnly
            ? { defaultValue: value.industry }
            : {
                value: value.industry,
                onChange: (event: React.ChangeEvent<HTMLSelectElement>) => set("industry", event.target.value),
              })}
        >
          <option value="">Choose an industry</option>
          {industries.map((industry) => (
            <option key={industry.slug} value={industry.slug}>
              {industry.name}
            </option>
          ))}
        </select>
      </Labeled>
      <fieldset className="grid gap-1.5">
        <legend className="text-sm font-medium">Status</legend>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Status">
          {fieldStatuses.map((status) => {
            const selected = value.status === status.value
            return (
              <label
                key={status.value}
                className={`flex h-11 items-center justify-center rounded-full px-2 text-sm font-medium ring-1 ring-foreground/10 ${
                  selected ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name={radioName}
                  value={status.value}
                  disabled={readOnly}
                  {...(readOnly
                    ? { defaultChecked: selected }
                    : { checked: selected, onChange: () => set("status", status.value) })}
                />
                {status.label}
              </label>
            )
          })}
        </div>
      </fieldset>
      <Labeled id={`${radioName}-follow`} label="Follow-up date" hint="Optional. Due and upcoming lists use this date.">
        <input
          id={`${radioName}-follow`}
          className={controlClass}
          type="date"
          {...(readOnly
            ? { defaultValue: value.followUpOn, disabled: true, readOnly: true }
            : { value: value.followUpOn, onChange: (event: React.ChangeEvent<HTMLInputElement>) => set("followUpOn", event.target.value) })}
        />
      </Labeled>
      <Labeled id={`${radioName}-notes`} label="Notes">
        <textarea id={`${radioName}-notes`} className={`${controlClass} h-24 py-2`} {...text("notes")} />
      </Labeled>
      <div className="grid gap-1.5">
        <p className="text-sm font-medium">Location</p>
        <button
          type="button"
          className="h-11 rounded-full border border-border bg-card px-4 text-sm font-medium disabled:opacity-60"
          disabled={readOnly || !onLocate || locating}
          onClick={onLocate}
        >
          {locating ? "Finding location…" : value.latitude !== null ? "Update location" : "Save this door's location"}
        </button>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {value.latitude !== null && value.longitude !== null
            ? `Saved ${formatCoords(value.latitude, value.longitude)}.`
            : "Optional. The phone asks before it shares a location."}
        </p>
        {value.latitude !== null && onClearLocation ? (
          <button type="button" className="text-left text-sm font-medium text-clay" onClick={onClearLocation}>
            Remove location
          </button>
        ) : null}
        {geoMessage ? <p className="text-sm text-destructive">{geoMessage}</p> : null}
      </div>
      <p className="text-sm text-muted-foreground">The time is saved when the knock is saved. It is not edited later.</p>
    </div>
  )
}

export function LeadSummary({
  title,
  address,
  industry,
  status,
  when,
}: {
  title: string
  address: string
  industry: string
  status: FieldStatus
  when: string
}) {
  return (
    <span className="block rounded-2xl bg-card px-3 py-3 text-left ring-1 ring-foreground/10">
      <span className="flex items-start justify-between gap-2">
        <span className="font-medium">{title}</span>
        <StatusBadge status={status} />
      </span>
      {address && address !== title ? <span className="mt-1 block text-sm text-muted-foreground">{address}</span> : null}
      <span className="mt-1 block text-xs text-muted-foreground">
        {industryLabel(industry)} · {when}
      </span>
    </span>
  )
}
