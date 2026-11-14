"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { industries } from "@/data/industries"
import {
  AppHeader,
  dangerButton,
  EmptyNote,
  fieldCard,
  fieldInput,
  fieldLabel,
  fieldTabs,
  LogFields,
  primaryButton,
  secondaryButton,
  StatGrid,
  StopCard,
  TabGlyph,
  tabClass,
  screenTitle,
  type FieldTab,
} from "@/components/field/chrome"
import {
  draftFromLead,
  emptyDraft,
  emptyFollowUps,
  emptyLeads,
  emptySearch,
  emptyToday,
  filterLeads,
  formatDay,
  formatWhen,
  gpsHint,
  industryName,
  leadFromDraft,
  leadsOnDay,
  leadsToCsv,
  onDeviceNote,
  splitFollowUps,
  statsToItems,
  statusLabel,
  statuses,
  stopCount,
  todayStats,
  validateDraft,
  type Draft,
  type FieldData,
  type Lead,
} from "@/lib/field/records"
import { clearField, loadField, saveField } from "@/lib/field/store"

function stopTitle(lead: Lead) {
  return lead.name || lead.address || "Stop"
}

function stopMeta(lead: Lead) {
  const parts = [industryName(lead.industry), formatWhen(lead.createdAt)]
  if (lead.address && lead.name) parts.push(lead.address)
  if (lead.followUpOn) parts.push(`Follow-up ${formatDay(lead.followUpOn)}`)
  return parts.filter(Boolean).join(" · ")
}

export function FieldApp() {
  const [data, setData] = useState<FieldData | null>(null)
  const [screen, setScreen] = useState<FieldTab>("home")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [industryFilter, setIndustryFilter] = useState("")
  const [seed, setSeed] = useState<Draft>(emptyDraft())
  const [formKey, setFormKey] = useState("new")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [gps, setGps] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null })
  const [locating, setLocating] = useState(false)
  const [gpsMessage, setGpsMessage] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const snapshot = useRef("")
  const offline = !useSyncExternalStore(subscribeOnline, onlineSnapshot, onlineServerSnapshot)
  const dayLabel = useSyncExternalStore(subscribeClock, daySnapshot, dayServerSnapshot)

  useEffect(() => {
    let cancel = false
    loadField().then((loaded) => {
      if (cancel) return
      snapshot.current = JSON.stringify(loaded)
      setData(loaded)
    })
    return () => {
      cancel = true
    }
  }, [])

  useEffect(() => {
    if (!data) return
    const next = JSON.stringify(data)
    if (next === snapshot.current) return
    snapshot.current = next
    saveField(data).catch(() => setNotice("Could not save on this phone."))
  }, [data])

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return
    const worker = new URL("sw.js", window.location.href)
    navigator.serviceWorker.register(worker, { scope: "./", updateViaCache: "none" }).catch(() => undefined)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  function openScreen(next: FieldTab) {
    setNotice("")
    setError("")
    setConfirmDelete(false)
    setScreen(next)
  }

  function resetForm() {
    setEditingId(null)
    setCreatedAt(null)
    setSeed(emptyDraft())
    setFormKey(crypto.randomUUID())
    setGps({ latitude: null, longitude: null })
    setGpsMessage("")
    setError("")
    setConfirmDelete(false)
  }

  function editLead(lead: Lead) {
    setEditingId(lead.id)
    setCreatedAt(lead.createdAt)
    setSeed(draftFromLead(lead))
    setFormKey(lead.id)
    setGps({ latitude: lead.latitude, longitude: lead.longitude })
    setGpsMessage("")
    setError("")
    setConfirmDelete(false)
    setNotice("")
    setScreen("log")
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      setGpsMessage("This browser does not share a location.")
      return
    }
    setLocating(true)
    setGpsMessage("")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGps({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        setLocating(false)
      },
      (failure) => {
        setLocating(false)
        if (failure.code === failure.PERMISSION_DENIED) setGpsMessage("Location stayed off. You can still log the stop.")
        else if (failure.code === failure.TIMEOUT) setGpsMessage("Location timed out. You can still log the stop.")
        else setGpsMessage("Location is not available on this phone. You can still log the stop.")
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!data) return
    const form = new FormData(event.currentTarget)
    const draft: Draft = {
      name: String(form.get("name") ?? ""),
      address: String(form.get("address") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      industry: String(form.get("industry") ?? ""),
      status: String(form.get("status") ?? "not_home") as Draft["status"],
      notes: String(form.get("notes") ?? ""),
      followUpOn: String(form.get("followUpOn") ?? ""),
      latitude: gps.latitude,
      longitude: gps.longitude,
    }
    const problem = validateDraft(draft)
    if (problem) {
      setError(problem)
      return
    }
    const now = new Date().toISOString()
    const lead = leadFromDraft(draft, editingId, now, createdAt)
    const leads = editingId ? data.leads.map((item) => (item.id === editingId ? lead : item)) : [lead, ...data.leads]
    setData({ ...data, leads })
    resetForm()
    setNotice("Saved on this phone.")
    setScreen("home")
  }

  function removeLead() {
    if (!data || !editingId) return
    setData({ ...data, leads: data.leads.filter((lead) => lead.id !== editingId) })
    resetForm()
    setNotice("Deleted on this phone.")
    setScreen("leads")
  }

  function exportCsv() {
    if (!data || data.leads.length === 0) {
      setNotice("No stops to export yet.")
      return
    }
    const ordered = [...data.leads].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    const blob = new Blob([leadsToCsv(ordered)], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "d2d-field-leads.csv"
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setNotice("CSV downloaded to this phone.")
  }

  async function wipe() {
    const empty = { repName: "", leads: [] }
    snapshot.current = JSON.stringify(empty)
    setData(empty)
    resetForm()
    setQuery("")
    setStatusFilter("")
    setIndustryFilter("")
    setConfirmClear(false)
    await clearField()
    setNotice("Cleared on this phone.")
    setScreen("home")
  }

  const ready = data !== null
  const stats = data ? statsToItems(todayStats(data.leads)) : statsToItems(todayStats([]))
  const todayStops = data ? leadsOnDay(data.leads) : []
  const filtered = data ? filterLeads(data.leads, query, statusFilter, industryFilter) : []
  const follow = data ? splitFollowUps(data.leads) : { due: [], later: [] }
  const leadsMessage = !data || data.leads.length === 0 ? emptyLeads : filtered.length === 0 ? emptySearch : ""

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <div className="h-1.5 bg-clay" />
      <div className="flex-1 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-28">
        <AppHeader
          heading="h1"
          title={screenTitle(screen, editingId !== null)}
          aside={
            <div className="flex flex-col items-end gap-1 pt-1 text-xs">
              <Link className="text-muted-foreground hover:text-foreground" href="/app">
                About
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/sitemap">
                Sitemap
              </Link>
            </div>
          }
        />
        {offline ? (
          <p className="mt-3 rounded-lg bg-accent px-3 py-2 text-sm leading-relaxed">
            You are offline. Stops still save on this phone.
          </p>
        ) : null}
        {notice ? <p className="mt-3 text-sm text-primary">{notice}</p> : null}
        <div className="mt-4">
          {!ready ? (
            <p className="text-sm leading-relaxed text-muted-foreground">Loading stops saved on this phone.</p>
          ) : screen === "home" ? (
            <div className="grid gap-4">
              {data.repName ? <p className="text-sm text-muted-foreground">{data.repName}</p> : null}
              <p className="text-sm text-muted-foreground">{dayLabel}</p>
              <StatGrid stats={stats} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                A sold stop is also a door. The counts come from stops saved on this phone.
              </p>
              {todayStops.length === 0 ? (
                <EmptyNote>{emptyToday}</EmptyNote>
              ) : (
                <ul className="grid gap-3">
                  {todayStops.map((lead) => (
                    <li key={lead.id}>
                      <StopCard
                        title={stopTitle(lead)}
                        meta={stopMeta(lead)}
                        status={lead.status}
                        action={
                          <button type="button" className="shrink-0 text-sm font-medium text-clay" onClick={() => editLead(lead)}>
                            Edit
                          </button>
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : screen === "log" ? (
            <form key={formKey} onSubmit={onSubmit} className="grid gap-4">
              <p className="leading-relaxed">
                Name or address, the product, and a status are enough. The time is saved with the stop.
              </p>
              {createdAt ? <p className="text-sm text-muted-foreground">Logged {formatWhen(createdAt)}.</p> : null}
              <div className={`${fieldCard} grid gap-4 p-4`}>
                <LogFields draft={seed} />
                <div className="grid gap-1.5">
                  <span className={fieldLabel}>Location</span>
                  <button type="button" className={secondaryButton} onClick={locate} disabled={locating}>
                    {locating ? "Finding location…" : "Use this location"}
                  </button>
                  {gps.latitude !== null && gps.longitude !== null ? (
                    <p className="text-sm leading-relaxed">
                      {gps.latitude.toFixed(5)}, {gps.longitude.toFixed(5)}{" "}
                      <a
                        className="font-medium text-clay hover:underline"
                        href={`https://maps.google.com/?q=${gps.latitude},${gps.longitude}`}
                      >
                        Map
                      </a>
                      <button type="button" className="ml-3 text-sm text-muted-foreground" onClick={() => setGps({ latitude: null, longitude: null })}>
                        Clear
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed text-muted-foreground">{gpsMessage || gpsHint}</p>
                  )}
                </div>
                {error ? (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                ) : null}
                <button type="submit" className={primaryButton}>
                  {editingId ? "Save changes" : "Save stop"}
                </button>
                {editingId ? (
                  confirmDelete ? (
                    <div className="grid gap-2">
                      <p className="text-sm leading-relaxed">Delete this stop from the phone?</p>
                      <button type="button" className={dangerButton} onClick={removeLead}>
                        Delete stop
                      </button>
                      <button type="button" className={secondaryButton} onClick={() => setConfirmDelete(false)}>
                        Keep it
                      </button>
                    </div>
                  ) : (
                    <button type="button" className={dangerButton} onClick={() => setConfirmDelete(true)}>
                      Delete stop
                    </button>
                  )
                ) : null}
              </div>
              {editingId ? (
                <button type="button" className="text-sm font-medium text-clay" onClick={resetForm}>
                  Start a new stop
                </button>
              ) : null}
            </form>
          ) : screen === "leads" ? (
            <div className="grid gap-4">
              <div className="grid gap-3">
                <label className="grid gap-1.5">
                  <span className={fieldLabel}>Search</span>
                  <input
                    className={fieldInput}
                    type="search"
                    value={query}
                    placeholder="Name, address, phone, notes"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1.5">
                    <span className={fieldLabel}>Status</span>
                    <select className={fieldInput} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
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
                    <select className={fieldInput} value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)}>
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
              <p className="text-sm text-muted-foreground">{stopCount(filtered.length)}</p>
              {leadsMessage ? (
                <EmptyNote>{leadsMessage}</EmptyNote>
              ) : (
                <ul className="grid gap-3">
                  {filtered.map((lead) => (
                    <li key={lead.id}>
                      <StopCard
                        title={stopTitle(lead)}
                        meta={stopMeta(lead)}
                        status={lead.status}
                        action={
                          <button type="button" className="shrink-0 text-sm font-medium text-clay" onClick={() => editLead(lead)}>
                            Edit
                          </button>
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : screen === "follow" ? (
            <div className="grid gap-4">
              {follow.due.length === 0 && follow.later.length === 0 ? (
                <EmptyNote>{emptyFollowUps}</EmptyNote>
              ) : (
                <>
                  <FollowGroup label="Due" leads={follow.due} onEdit={editLead} />
                  <FollowGroup label="Later" leads={follow.later} onEdit={editLead} />
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              <div className={`${fieldCard} grid gap-4 p-4`}>
                <label className="grid gap-1.5">
                  <span className={fieldLabel}>Your name</span>
                  <input
                    className={fieldInput}
                    value={data.repName}
                    autoComplete="name"
                    placeholder="Name on this phone"
                    onChange={(event) => setData({ ...data, repName: event.target.value.slice(0, 80) })}
                  />
                </label>
                <p className="text-sm leading-relaxed text-muted-foreground">Saved on this phone as you type.</p>
              </div>
              <p className="leading-relaxed">{onDeviceNote}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                After this app has loaded once with a connection, the pages can open offline. There is no shared login
                in this version.
              </p>
              <button type="button" className={primaryButton} onClick={exportCsv}>
                Export CSV
              </button>
              {confirmClear ? (
                <div className={`${fieldCard} grid gap-3 p-4`}>
                  <p className="text-sm leading-relaxed">This deletes every stop and the name on this phone.</p>
                  <button type="button" className={dangerButton} onClick={() => void wipe()}>
                    Delete everything
                  </button>
                  <button type="button" className={secondaryButton} onClick={() => setConfirmClear(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" className={dangerButton} onClick={() => setConfirmClear(true)}>
                  Clear data
                </button>
              )}
              <ul className="grid gap-2 text-sm">
                <li>
                  <Link className="font-medium text-clay hover:underline" href="/app">
                    About the field app
                  </Link>
                </li>
                <li>
                  <Link className="font-medium text-clay hover:underline" href="/">
                    D2D Job desk
                  </Link>
                </li>
                <li>
                  <Link className="font-medium text-clay hover:underline" href="/sitemap">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <nav
        aria-label="Field app"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur pb-[max(0.25rem,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          {fieldTabs.map((tab) => {
            const active = screen === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                className={tabClass(active)}
                aria-current={active ? "page" : undefined}
                disabled={!ready}
                onClick={() => openScreen(tab.id)}
              >
                <TabGlyph name={tab.id} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function subscribeOnline(onChange: () => void) {
  window.addEventListener("online", onChange)
  window.addEventListener("offline", onChange)
  return () => {
    window.removeEventListener("online", onChange)
    window.removeEventListener("offline", onChange)
  }
}

function onlineSnapshot() {
  return navigator.onLine
}

function onlineServerSnapshot() {
  return true
}

function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000)
  return () => window.clearInterval(id)
}

function daySnapshot() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date())
}

function dayServerSnapshot() {
  return "Today"
}

function FollowGroup({ label, leads, onEdit }: { label: string; leads: Lead[]; onEdit: (lead: Lead) => void }) {
  if (leads.length === 0) return null
  return (
    <section className="grid gap-3">
      <h2 className="text-xl">
        {label} <span className="text-base font-normal text-muted-foreground">({leads.length})</span>
      </h2>
      <ul className="grid gap-3">
        {leads.map((lead) => (
          <li key={lead.id}>
            <StopCard
              title={stopTitle(lead)}
              meta={`${lead.followUpOn ? formatDay(lead.followUpOn) : ""} · ${statusLabel(lead.status)}${lead.address ? ` · ${lead.address}` : ""}`}
              status={lead.status}
              action={
                <button type="button" className="shrink-0 text-sm font-medium text-clay" onClick={() => onEdit(lead)}>
                  Edit
                </button>
              }
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
