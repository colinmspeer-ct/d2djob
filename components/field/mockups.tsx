import {
  AppHeader,
  EmptyNote,
  fieldCard,
  FilterFields,
  GpsIdle,
  LogFields,
  primaryButton,
  StatGrid,
  TabBarView,
  type FieldTab,
} from "@/components/field/chrome"
import { emptyDraft, emptyFollowUps, emptyLeads, emptyToday, onDeviceNote, statsToItems, todayStats } from "@/lib/field/records"

const zeroStats = statsToItems(todayStats([]))

function Phone({ tab, title, children }: { tab: FieldTab; title: string; children: React.ReactNode }) {
  return (
    <figure className="grid gap-3">
      <figcaption>
        <h3 className="text-2xl">{title}</h3>
      </figcaption>
      <div className="flex h-[36rem] flex-col overflow-hidden rounded-[1.6rem] bg-background shadow-xl ring-1 ring-foreground/10">
        <div className="h-1.5 shrink-0 bg-clay" />
        <div className="flex-1 overflow-auto px-4 py-4">
          <AppHeader heading="p" title={title === "Home" ? "Today" : title} />
          <div className="mt-4">{children}</div>
        </div>
        <TabBarView current={tab} />
      </div>
    </figure>
  )
}

export function FieldMockups() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Phone tab="home" title="Home">
        <p className="text-sm leading-relaxed text-muted-foreground">A new phone, before the first knock.</p>
        <div className="mt-4">
          <StatGrid stats={zeroStats} />
        </div>
        <div className="mt-4">
          <EmptyNote>{emptyToday}</EmptyNote>
        </div>
      </Phone>
      <Phone tab="log" title="Log a stop">
        <div className="grid gap-4">
          <p className="text-sm leading-relaxed">
            Name or address, the product, and a status are enough. The time is saved with the stop.
          </p>
          <div className={`${fieldCard} grid gap-4 p-4`} inert>
            <LogFields draft={emptyDraft()} />
            <GpsIdle />
            <div className={primaryButton}>Save stop</div>
          </div>
        </div>
      </Phone>
      <Phone tab="leads" title="Leads">
        <div className="grid gap-4">
          <div inert>
            <FilterFields />
          </div>
          <p className="text-sm text-muted-foreground">0 stops</p>
          <EmptyNote>{emptyLeads}</EmptyNote>
        </div>
      </Phone>
      <Phone tab="follow" title="Follow-ups">
        <EmptyNote>{emptyFollowUps}</EmptyNote>
      </Phone>
      <Phone tab="settings" title="Settings">
        <div className={`${fieldCard} grid gap-4 p-4`}>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Your name</span>
            <input className="h-12 w-full rounded-lg border border-input bg-card px-3 text-base" placeholder="Name on this phone" readOnly />
          </label>
          <p className="text-sm leading-relaxed">{onDeviceNote}</p>
          <div className={primaryButton}>Export CSV</div>
          <div className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-destructive/10 px-4 text-sm font-medium text-destructive">
            Clear data
          </div>
        </div>
      </Phone>
    </div>
  )
}
