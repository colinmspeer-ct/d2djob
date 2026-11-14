import { emptyForm } from "@/lib/field-model"
import { LogFields, StatGrid, TabStrip, type FieldTab } from "@/components/field-app/views"

function Phone({
  tab,
  caption,
  children,
}: {
  tab: FieldTab
  caption: string
  children: React.ReactNode
}) {
  return (
    <figure className="mx-auto w-full max-w-[340px]">
      <div className="overflow-hidden rounded-[2rem] bg-background shadow-xl ring-1 ring-foreground/10">
        <div className="h-1 bg-clay" />
        <div className="bg-background px-4 pt-4 pb-3">
          <p className="text-sm font-medium tracking-wide text-clay">D2D Field</p>
          <p className="mt-1 font-heading text-2xl leading-none">
            {tab === "home" ? "Today" : tab === "log" ? "Log a knock" : tab === "leads" ? "Leads" : "Follow-ups"}
          </p>
        </div>
        <div className="px-4 pb-4">{children}</div>
        <div className="border-t border-border bg-card">
          <TabStrip active={tab} />
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">{caption}</figcaption>
    </figure>
  )
}

export function FieldPreview() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Phone tab="home" caption="Home, before any knocks are logged. Counts stay at zero until a rep saves a door on that phone.">
        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">Counted from knocks logged today on this phone.</p>
          <StatGrid doors={0} leads={0} sales={0} followUpsDue={0} />
          <div>
            <p className="font-heading text-xl">Follow-ups due</p>
            <p className="mt-1 text-sm text-muted-foreground">None due.</p>
          </div>
          <p className="flex h-12 items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground">
            Log a door
          </p>
        </div>
      </Phone>
      <Phone tab="log" caption="Log screen. The same fields the app saves: contact, industry, status, notes, follow-up date, and optional location.">
        <LogFields value={emptyForm} radioName="preview-status" readOnly />
        <p className="mt-4 flex h-12 items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground">
          Save knock
        </p>
      </Phone>
      <Phone tab="leads" caption="Leads list. Search and status or industry filters run on the knocks stored on the phone.">
        <div className="grid gap-3">
          <p className="text-sm font-medium">Search</p>
          <p className="flex h-11 items-center rounded-lg border border-input bg-card px-3 text-base text-muted-foreground">
            Name, address, phone, notes
          </p>
          <p className="text-sm font-medium">Status</p>
          <p className="flex h-11 items-center rounded-lg border border-input bg-card px-3 text-sm">All statuses</p>
          <p className="text-sm font-medium">Industry</p>
          <p className="flex h-11 items-center rounded-lg border border-input bg-card px-3 text-sm">All industries</p>
          <p className="text-sm text-muted-foreground">No knocks saved on this phone yet.</p>
        </div>
      </Phone>
    </div>
  )
}
