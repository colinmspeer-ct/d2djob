"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { industries } from "@/data/industries"
import {
  emptyForm,
  entriesToCsv,
  entryTitle,
  entryToForm,
  fieldStatuses,
  filterEntries,
  formToFields,
  formatDayLabel,
  formatWhen,
  localDay,
  partitionFollowUps,
  statsForDay,
  validateForm,
  type FieldEntry,
  type FieldForm,
} from "@/lib/field-model"
import { clearAll, deleteEntry, loadState, saveEntry, saveMeta } from "@/lib/field-store"
import { LeadSummary, LogFields, StatGrid, TabStrip, type FieldTab } from "@/components/field-app/views"

type Screen = { kind: "tab"; tab: FieldTab } | { kind: "edit"; id: string; from: FieldTab }

const titles: Record<FieldTab | "edit", string> = {
  home: "Today",
  log: "Log a knock",
  leads: "Leads",
  followups: "Follow-ups",
  settings: "Settings",
  edit: "Edit knock",
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `knock-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function FieldApp() {
  const [screen, setScreen] = useState<Screen>({ kind: "tab", tab: "home" })
  const [entries, setEntries] = useState<FieldEntry[]>([])
  const [ready, setReady] = useState(false)
  const [today, setToday] = useState<string | null>(null)
  const [repName, setRepName] = useState("")
  const [repDraft, setRepDraft] = useState("")
  const [lastIndustry, setLastIndustry] = useState("")
  const [form, setForm] = useState<FieldForm>(emptyForm)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [storageError, setStorageError] = useState("")
  const [geoMessage, setGeoMessage] = useState("")
  const [locating, setLocating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [offline, setOffline] = useState(false)
  const [clearArmed, setClearArmed] = useState(false)
  const [deleteArmed, setDeleteArmed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const day = localDay(new Date())
    loadState()
      .then((state) => {
        if (cancelled) return
        setToday(day)
        setEntries(state.entries)
        setRepName(state.repName)
        setRepDraft(state.repName)
        setLastIndustry(state.lastIndustry)
        setForm({ ...emptyForm, industry: state.lastIndustry })
        setReady(true)
      })
      .catch(() => {
        if (cancelled) return
        setToday(day)
        setStorageError("This browser did not open on-device storage, so knocks cannot be saved here.")
        setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return
    let cancelled = false
    const sendUrls = (worker: ServiceWorker | null) => {
      if (!worker) return
      const urls = performance.getEntriesByType("resource").map((entry) => entry.name)
      urls.push(window.location.href)
      worker.postMessage({ type: "cache-urls", urls })
    }
    navigator.serviceWorker
      .register("/app/field/sw.js", { scope: "/app/field/", updateViaCache: "none" })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        if (cancelled) return
        sendUrls(registration.active)
        window.setTimeout(() => sendUrls(registration.active), 1200)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine)
    sync()
    window.addEventListener("online", sync)
    window.addEventListener("offline", sync)
    return () => {
      window.removeEventListener("online", sync)
      window.removeEventListener("offline", sync)
    }
  }, [])

  const activeTab: FieldTab = screen.kind === "edit" ? screen.from : screen.tab
  const heading = screen.kind === "edit" ? titles.edit : titles[screen.tab]
  const stats = today ? statsForDay(entries, today) : null
  const followUps = today ? partitionFollowUps(entries, today) : null
  const visibleLeads = filterEntries(entries, query, statusFilter, industryFilter)

  function go(tab: FieldTab) {
    setScreen({ kind: "tab", tab })
    setError("")
    setNotice("")
    setDeleteArmed(false)
    setClearArmed(false)
    if (tab === "log") {
      setForm({ ...emptyForm, industry: lastIndustry })
      setGeoMessage("")
    }
  }

  function openEntry(id: string, from: FieldTab) {
    const entry = entries.find((item) => item.id === id)
    if (!entry) return
    setForm(entryToForm(entry))
    setScreen({ kind: "edit", id, from })
    setError("")
    setNotice("")
    setGeoMessage("")
    setDeleteArmed(false)
  }

  function locate() {
    if (!navigator.geolocation) {
      setGeoMessage("This browser does not share location. You can save the knock without it.")
      return
    }
    setLocating(true)
    setGeoMessage("")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
        setLocating(false)
      },
      (geoError) => {
        setLocating(false)
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setGeoMessage("Location stayed off. You can save the knock without it.")
          return
        }
        if (geoError.code === geoError.TIMEOUT) {
          setGeoMessage("Location timed out. You can try again or save without it.")
          return
        }
        setGeoMessage("Location is unavailable. You can save the knock without it.")
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  async function saveForm() {
    const problem = validateForm(form)
    if (problem) {
      setError(problem)
      setNotice("")
      return
    }
    setSaving(true)
    setError("")
    const now = new Date().toISOString()
    const fields = formToFields(form)
    const existing = screen.kind === "edit" ? entries.find((item) => item.id === screen.id) : undefined
    const entry: FieldEntry = {
      ...fields,
      id: existing?.id ?? newId(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }
    try {
      await saveEntry(entry)
      if (form.industry) {
        await saveMeta("lastIndustry", form.industry)
        setLastIndustry(form.industry)
      }
      setEntries((current) => [entry, ...current.filter((item) => item.id !== entry.id)])
      setNotice("Saved on this phone.")
      setGeoMessage("")
      if (screen.kind === "edit") setScreen({ kind: "tab", tab: screen.from === "log" ? "leads" : screen.from })
      else setForm({ ...emptyForm, industry: form.industry })
    } catch {
      setError("Could not save on this phone.")
    } finally {
      setSaving(false)
    }
  }

  async function removeEntry() {
    if (screen.kind !== "edit") return
    try {
      await deleteEntry(screen.id)
      setEntries((current) => current.filter((item) => item.id !== screen.id))
      setNotice("Deleted from this phone.")
      setDeleteArmed(false)
      setScreen({ kind: "tab", tab: screen.from === "log" ? "leads" : screen.from })
    } catch {
      setError("Could not delete that knock.")
    }
  }

  async function saveName() {
    const next = repDraft.trim()
    try {
      await saveMeta("repName", next)
      setRepName(next)
      setRepDraft(next)
      setNotice("Name saved on this phone.")
      setError("")
    } catch {
      setError("Could not save the name on this phone.")
    }
  }

  async function wipe() {
    try {
      await clearAll()
      setEntries([])
      setRepName("")
      setRepDraft("")
      setLastIndustry("")
      setForm(emptyForm)
      setClearArmed(false)
      setNotice("Cleared the knocks and name stored on this phone.")
    } catch {
      setError("Could not clear storage on this phone.")
    }
  }

  const editing = screen.kind === "edit" ? entries.find((item) => item.id === screen.id) : undefined

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur">
          <div className="h-1 bg-clay" />
          <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
            <p className="text-sm font-medium tracking-wide text-clay">D2D Field</p>
            <h1 className="mt-1 text-3xl leading-none">{heading}</h1>
          </header>
        </div>
        <main id="content" className="flex-1 px-4 py-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          {offline ? (
            <p className="mb-3 rounded-2xl bg-accent px-3 py-2 text-sm">You are offline. Knocks already saved on this phone still open.</p>
          ) : null}
          {storageError ? <p className="mb-3 rounded-2xl bg-accent px-3 py-2 text-sm">{storageError}</p> : null}
          {notice ? (
            <p className="mb-3 rounded-2xl bg-secondary px-3 py-2 text-sm" role="status">
              {notice}
            </p>
          ) : null}
          {error ? (
            <p className="mb-3 rounded-2xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          {!ready || !stats || !followUps ? (
            <p className="text-sm text-muted-foreground">Loading knocks saved on this phone.</p>
          ) : screen.kind === "tab" && screen.tab === "home" ? (
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{repName ? repName : "This phone"}</p>
                <p className="mt-1 font-heading text-2xl">{today ? formatDayLabel(today) : "Today"}</p>
                <p className="mt-1 text-sm text-muted-foreground">Counted from knocks logged today on this phone.</p>
              </div>
              <StatGrid doors={stats.doors} leads={stats.leads} sales={stats.sales} followUpsDue={stats.followUpsDue} />
              <section className="grid gap-2">
                <h2 className="text-xl">Follow-ups due</h2>
                {followUps.due.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None due.</p>
                ) : (
                  followUps.due.map((entry) => (
                    <button key={entry.id} type="button" className="block w-full" onClick={() => openEntry(entry.id, "home")}>
                      <LeadSummary
                        title={entryTitle(entry)}
                        address={entry.address}
                        industry={entry.industry}
                        status={entry.status}
                        when={entry.followUpOn || formatWhen(entry.createdAt)}
                      />
                    </button>
                  ))
                )}
              </section>
              <button type="button" className="h-12 rounded-full bg-primary text-base font-medium text-primary-foreground" onClick={() => go("log")}>
                Log a door
              </button>
            </div>
          ) : screen.kind === "tab" && screen.tab === "leads" ? (
            <LeadsScreen
              query={query}
              statusFilter={statusFilter}
              industryFilter={industryFilter}
              entries={visibleLeads}
              total={entries.length}
              onQuery={setQuery}
              onStatus={setStatusFilter}
              onIndustry={setIndustryFilter}
              onOpen={(id) => openEntry(id, "leads")}
            />
          ) : screen.kind === "tab" && screen.tab === "followups" ? (
            <FollowScreen groups={followUps} onOpen={(id) => openEntry(id, "followups")} />
          ) : screen.kind === "tab" && screen.tab === "settings" ? (
            <SettingsScreen
              repDraft={repDraft}
              knockCount={entries.length}
              clearArmed={clearArmed}
              onDraft={setRepDraft}
              onSaveName={() => void saveName()}
              onExport={() => downloadCsv(entriesToCsv(entries), `d2d-field-${today}.csv`)}
              onArmClear={() => setClearArmed(true)}
              onCancelClear={() => setClearArmed(false)}
              onClear={() => void wipe()}
            />
          ) : (
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                void saveForm()
              }}
            >
              {editing ? (
                <p className="text-sm text-muted-foreground">Logged {formatWhen(editing.createdAt)}.</p>
              ) : (
                <p className="text-sm text-muted-foreground">Name or address is enough for a knock. The other fields can wait.</p>
              )}
              <LogFields
                value={form}
                radioName="knock-status"
                locating={locating}
                geoMessage={geoMessage}
                onChange={setForm}
                onLocate={locate}
                onClearLocation={() => setForm((current) => ({ ...current, latitude: null, longitude: null }))}
              />
              <button type="submit" className="h-12 rounded-full bg-primary text-base font-medium text-primary-foreground disabled:opacity-60" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Save knock"}
              </button>
              {editing ? (
                deleteArmed ? (
                  <div className="grid gap-2 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
                    <p className="text-sm">Delete this knock from this phone? This cannot be undone.</p>
                    <button type="button" className="h-11 rounded-full bg-destructive text-sm font-medium text-white" onClick={() => void removeEntry()}>
                      Delete this knock
                    </button>
                    <button type="button" className="h-11 rounded-full text-sm font-medium" onClick={() => setDeleteArmed(false)}>
                      Keep it
                    </button>
                  </div>
                ) : (
                  <button type="button" className="h-11 text-sm font-medium text-destructive" onClick={() => setDeleteArmed(true)}>
                    Delete this knock
                  </button>
                )
              ) : null}
            </form>
          )}
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <TabStrip active={activeTab} onSelect={go} />
        </nav>
      </div>
    </div>
  )
}

function LeadsScreen({
  query,
  statusFilter,
  industryFilter,
  entries,
  total,
  onQuery,
  onStatus,
  onIndustry,
  onOpen,
}: {
  query: string
  statusFilter: string
  industryFilter: string
  entries: FieldEntry[]
  total: number
  onQuery: (value: string) => void
  onStatus: (value: string) => void
  onIndustry: (value: string) => void
  onOpen: (id: string) => void
}) {
  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Search</span>
        <input
          className="h-11 w-full rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Name, address, phone, notes"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Status</span>
        <select
          className="h-11 w-full rounded-lg border border-input bg-card px-3 text-base"
          value={statusFilter}
          onChange={(event) => onStatus(event.target.value)}
        >
          <option value="all">All statuses</option>
          {fieldStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Industry</span>
        <select
          className="h-11 w-full rounded-lg border border-input bg-card px-3 text-base"
          value={industryFilter}
          onChange={(event) => onIndustry(event.target.value)}
        >
          <option value="all">All industries</option>
          {industries.map((industry) => (
            <option key={industry.slug} value={industry.slug}>
              {industry.name}
            </option>
          ))}
        </select>
      </label>
      <p className="text-sm text-muted-foreground">
        {total === 0 ? "No knocks saved on this phone yet." : `${entries.length} of ${total} shown.`}
      </p>
      {total > 0 && entries.length === 0 ? <p className="text-sm text-muted-foreground">Nothing matches that search.</p> : null}
      <ul className="grid gap-2">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button type="button" className="block w-full" onClick={() => onOpen(entry.id)}>
              <LeadSummary
                title={entryTitle(entry)}
                address={entry.address}
                industry={entry.industry}
                status={entry.status}
                when={formatWhen(entry.updatedAt)}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FollowScreen({
  groups,
  onOpen,
}: {
  groups: ReturnType<typeof partitionFollowUps>
  onOpen: (id: string) => void
}) {
  const sections = [
    { title: "Due", empty: "Nothing is due.", items: groups.due },
    { title: "Upcoming", empty: "No later dates saved.", items: groups.upcoming },
    { title: "Needs a date", empty: "Callbacks and leads without a date will show here.", items: groups.needsDate },
  ]
  return (
    <div className="grid gap-5">
      {sections.map((section) => (
        <section key={section.title} className="grid gap-2">
          <h2 className="text-xl">{section.title}</h2>
          {section.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{section.empty}</p>
          ) : (
            section.items.map((entry) => (
              <button key={entry.id} type="button" className="block w-full" onClick={() => onOpen(entry.id)}>
                <LeadSummary
                  title={entryTitle(entry)}
                  address={entry.address}
                  industry={entry.industry}
                  status={entry.status}
                  when={entry.followUpOn || formatWhen(entry.updatedAt)}
                />
              </button>
            ))
          )}
        </section>
      ))}
    </div>
  )
}

function SettingsScreen({
  repDraft,
  knockCount,
  clearArmed,
  onDraft,
  onSaveName,
  onExport,
  onArmClear,
  onCancelClear,
  onClear,
}: {
  repDraft: string
  knockCount: number
  clearArmed: boolean
  onDraft: (value: string) => void
  onSaveName: () => void
  onExport: () => void
  onArmClear: () => void
  onCancelClear: () => void
  onClear: () => void
}) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
        <h2 className="text-xl">On this phone</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Knocks, notes, locations, and your name stay in this browser on this phone. D2D Job does not upload them.
          There is no account, no cloud sync, and no connection to HighLevel. Export a CSV if you want a copy off this phone.
        </p>
        <p className="text-sm text-muted-foreground">{knockCount === 1 ? "1 knock saved here." : `${knockCount} knocks saved here.`}</p>
      </section>
      <section className="grid gap-2">
        <label className="grid gap-1.5" htmlFor="rep-name">
          <span className="text-sm font-medium">Rep name</span>
          <input
            id="rep-name"
            className="h-11 w-full rounded-lg border border-input bg-card px-3 text-base"
            value={repDraft}
            autoComplete="name"
            onChange={(event) => onDraft(event.target.value)}
          />
        </label>
        <button type="button" className="h-11 rounded-full bg-primary text-sm font-medium text-primary-foreground" onClick={onSaveName}>
          Save name
        </button>
      </section>
      <section className="grid gap-2">
        <h2 className="text-xl">Export</h2>
        <button
          type="button"
          className="h-11 rounded-full border border-border bg-card text-sm font-medium disabled:opacity-60"
          disabled={knockCount === 0}
          onClick={onExport}
        >
          Export leads to CSV
        </button>
        {knockCount === 0 ? <p className="text-sm text-muted-foreground">Nothing to export yet.</p> : null}
      </section>
      <section className="grid gap-2">
        <h2 className="text-xl">Clear data</h2>
        {clearArmed ? (
          <div className="grid gap-2 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
            <p className="text-sm leading-relaxed">
              This deletes every knock and the rep name stored in this browser. It does not change the D2D Job website.
            </p>
            <button type="button" className="h-11 rounded-full bg-destructive text-sm font-medium text-white" onClick={onClear}>
              Delete everything on this phone
            </button>
            <button type="button" className="h-11 rounded-full text-sm font-medium" onClick={onCancelClear}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="h-11 rounded-full text-sm font-medium text-destructive" onClick={onArmClear}>
            Clear all data on this phone
          </button>
        )}
      </section>
      <section className="grid gap-2 text-sm leading-relaxed">
        <h2 className="text-xl">Install</h2>
        <p className="text-muted-foreground">
          On iPhone, open this page in Safari, tap Share, then Add to Home Screen. On Android, open it in Chrome, tap the menu, then Install app or Add to Home screen.
        </p>
        <p>
          <Link className="font-medium text-clay" href="/app">
            What this app does
          </Link>
        </p>
        <p>
          <Link className="font-medium text-clay" href="/">
            D2D Job site
          </Link>
        </p>
      </section>
    </div>
  )
}
