import type { ReactNode } from "react"
import { industries } from "@/data/industries"
import { gpsHint, statuses, type Draft, type StatusId } from "@/lib/field/records"

export const fieldCard = "overflow-hidden rounded-lg bg-card text-card-foreground ring-1 ring-foreground/10"
export const fieldInput =
  "h-12 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
export const fieldTextarea =
  "min-h-28 w-full rounded-lg border border-input bg-card px-3 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
export const fieldLabel = "text-sm font-medium"
export const primaryButton =
  "inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/80"
export const secondaryButton =
  "inline-flex h-12 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
export const dangerButton =
  "inline-flex h-12 w-full items-center justify-center rounded-lg bg-destructive/10 px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"

export const fieldTabs = [
  { id: "home", label: "Home" },
  { id: "log", label: "Log" },
  { id: "leads", label: "Leads" },
  { id: "follow", label: "Follow-ups" },
  { id: "settings", label: "Settings" },
] as const

export type FieldTab = (typeof fieldTabs)[number]["id"]

const statusTone: Record<StatusId, string> = {
  not_home: "bg-secondary text-foreground",
  not_interested: "bg-muted text-muted-foreground",
  callback: "bg-accent text-foreground",
  lead: "bg-clay/15 text-clay",
  sold: "bg-primary text-primary-foreground",
}

export function tabClass(active: boolean) {
  return [
    "flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] leading-tight",
    active ? "font-medium text-primary" : "text-muted-foreground",
  ].join(" ")
}

export function TabGlyph({ name }: { name: FieldTab }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true as const }
  if (name === "home") {
    return (
      <svg {...common}>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    )
  }
  if (name === "log") {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === "leads") {
    return (
      <svg {...common}>
        <path d="M8 7h12M8 12h12M8 17h12" strokeLinecap="round" />
        <path d="M4 7h.01M4 12h.01M4 17h.01" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === "follow") {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 19.5c1.4-3 3.8-4.5 7-4.5s5.6 1.5 7 4.5" strokeLinecap="round" />
    </svg>
  )
}

export function TabBarView({ current }: { current: FieldTab }) {
  return (
    <div className="grid grid-cols-5 border-t border-border bg-card">
      {fieldTabs.map((tab) => (
        <div key={tab.id} className={tabClass(tab.id === current)} aria-current={tab.id === current ? "page" : undefined}>
          <TabGlyph name={tab.id} />
          <span>{tab.label}</span>
        </div>
      ))}
    </div>
  )
}

export function AppHeader({ title, heading, aside }: { title: string; heading: "h1" | "p"; aside?: ReactNode }) {
  const Title = heading
  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium tracking-wide text-clay">D2D Field</p>
        <Title className="font-heading text-3xl tracking-[-0.03em]">{title}</Title>
      </div>
      {aside}
    </header>
  )
}

export function StatGrid({ stats }: { stats: { label: string; value: number; hint: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <li key={stat.label} className="rounded-lg bg-card px-4 py-3 ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="mt-1 font-heading text-4xl tabular-nums tracking-[-0.03em]">{stat.value}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.hint}</p>
        </li>
      ))}
    </ul>
  )
}

export function StatusBadge({ status }: { status: StatusId }) {
  const label = statuses.find((item) => item.id === status)?.label ?? status
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[status]}`}>{label}</span>
}

export function StopCard({
  title,
  meta,
  status,
  action,
}: {
  title: string
  meta: string
  status: StatusId
  action?: ReactNode
}) {
  return (
    <article className={`${fieldCard} flex items-start justify-between gap-3 p-4`}>
      <div className="grid min-w-0 gap-1">
        <h3 className="truncate text-lg">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{meta}</p>
        <StatusBadge status={status} />
      </div>
      {action}
    </article>
  )
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className={`${fieldCard} px-4 py-8 text-center text-sm leading-relaxed`}>{children}</p>
}

export function FilterFields() {
  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Search</span>
        <input className={fieldInput} type="search" name="q" placeholder="Name, address, phone, notes" defaultValue="" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5">
          <span className={fieldLabel}>Status</span>
          <select className={fieldInput} name="status" defaultValue="">
            <option value="">Any status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className={fieldLabel}>Product</span>
          <select className={fieldInput} name="industry" defaultValue="">
            <option value="">Any product</option>
            {industries.map((industry) => (
              <option key={industry.slug} value={industry.slug}>
                {industry.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

export function LogFields({ draft }: { draft: Draft }) {
  return (
    <div className="grid gap-4">
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Name</span>
        <input className={fieldInput} name="name" autoComplete="name" placeholder="Who answered" defaultValue={draft.name} />
      </label>
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Address</span>
        <input
          className={fieldInput}
          name="address"
          autoComplete="street-address"
          placeholder="Street and city"
          defaultValue={draft.address}
        />
      </label>
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Phone</span>
        <input className={fieldInput} name="phone" type="tel" autoComplete="tel" placeholder="Optional" defaultValue={draft.phone} />
      </label>
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Email</span>
        <input
          className={fieldInput}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Optional"
          defaultValue={draft.email}
        />
      </label>
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Product / industry</span>
        <select className={fieldInput} name="industry" defaultValue={draft.industry}>
          <option value="">Choose an industry</option>
          {industries.map((industry) => (
            <option key={industry.slug} value={industry.slug}>
              {industry.name}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="grid gap-2">
        <legend className={fieldLabel}>Status</legend>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <label
              key={status.id}
              className="field-status cursor-pointer rounded-full bg-secondary px-3 py-2 text-sm text-foreground"
            >
              <input className="sr-only" type="radio" name="status" value={status.id} defaultChecked={draft.status === status.id} />
              {status.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Notes</span>
        <textarea className={fieldTextarea} name="notes" placeholder="What happened at the door" defaultValue={draft.notes} />
      </label>
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Follow-up date</span>
        <input className={fieldInput} type="date" name="followUpOn" defaultValue={draft.followUpOn} />
        <span className="text-sm leading-relaxed text-muted-foreground">
          Shows on Follow-ups. Leave it blank if you do not need to go back.
        </span>
      </label>
    </div>
  )
}

export function GpsIdle() {
  return (
    <div className="grid gap-1.5">
      <span className={fieldLabel}>Location</span>
      <div className={secondaryButton}>Use this location</div>
      <p className="text-sm leading-relaxed text-muted-foreground">{gpsHint}</p>
    </div>
  )
}

export function screenTitle(tab: FieldTab, editing: boolean) {
  if (tab === "log") return editing ? "Edit stop" : "Log a stop"
  if (tab === "home") return "Today"
  if (tab === "leads") return "Leads"
  if (tab === "follow") return "Follow-ups"
  return "Settings"
}
