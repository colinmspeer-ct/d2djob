import { getIndustry } from "../../data/industries"
import { getLocation } from "../../data/locations"
import { slugify } from "../../lib/format"
import { generateProfile, pseudonymFromName } from "../../lib/profile-generator"
import { readCandidateForm, readJobForm, readRequestForm } from "../../lib/validators"
import { inspectUpload } from "../../packages/training-library/src/files"
import { bumpCounter } from "../../packages/training-library/src/store"
import type { SqlDatabase } from "../../packages/training-library/src/types"
import type { AppContext, Env } from "./env"
import { readForm } from "./form"
import { deskPage } from "./layout"
import { sendDeskEmail } from "./mail"
import { clientIp } from "./session"
import { banners, escapeHtml, field, industryChecks, jobChoices, locationField, selectField, workFields } from "./ui"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type CandidateRow = {
  id: string
  slug: string
  real_name: string
  phone: string
  email: string
  interview_notes: string
  photo_key: string | null
  pseudonym: string
  headline: string
  summary: string
  background: string
  experience: string
  personality: string
  looking_for: string
  years_experience: number | null
  sales_type: string
  availability: string
  willing_to_travel: number
  pay_structure: string
  work_style: string
  schedule: string
  location_slug: string
  is_sample: number
  is_published: number
  generation_source: string | null
  published_at: string | null
}

type JobRow = {
  id: string
  slug: string
  title: string
  description: string
  date_posted: string
  valid_through: string
  employment_type: string
  hiring_organization: string
  industry_slug: string
  location_slug: string
  salary_min: number | null
  salary_max: number | null
  salary_unit: string | null
  commission_note: string
  is_sample: number
  is_published: number
}

function go(context: AppContext, path: string, params?: Record<string, string>) {
  const url = new URL(path, context.req.url)
  for (const [key, value] of Object.entries(params ?? {})) url.searchParams.set(key, value)
  return context.redirect(`${url.pathname}${url.search}`, 303)
}

function applyModelEnv(env: Env) {
  const runtime = globalThis as typeof globalThis & { process?: { env: Record<string, string | undefined> } }
  if (!runtime.process) return
  runtime.process.env.OPENAI_API_KEY = env.OPENAI_API_KEY ?? ""
  runtime.process.env.OPENAI_MODEL = env.OPENAI_MODEL || "gpt-4o-mini"
  runtime.process.env.OPENAI_BASE_URL = env.OPENAI_BASE_URL ?? ""
}

async function uniqueSlug(db: D1Database, table: "candidates" | "jobs", base: string, ignoreId?: string) {
  const root = base || (table === "jobs" ? "job" : "rep")
  let slug = root
  let count = 2
  while (true) {
    const existing = await db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).bind(slug).first<{ id: string }>()
    if (!existing || existing.id === ignoreId) return slug
    slug = `${root}-${count}`
    count += 1
  }
}

async function storePhoto(bucket: R2Bucket, id: string, file: File) {
  if (file.size > 2_000_000) return { ok: false as const, error: "Photo must be under 2 MB." }
  const bytes = new Uint8Array(await file.arrayBuffer())
  const inspected = inspectUpload(bytes, file.name || "photo.jpg", "image", { extensions: ["jpg", "jpeg", "png", "webp"] })
  if (!inspected.ok) return inspected
  const key = `private/candidates/${id}/original`
  await bucket.put(key, bytes, { httpMetadata: { contentType: inspected.contentType } })
  return { ok: true as const, key }
}

function candidateFields(values: {
  realName: string
  phone: string
  email: string
  interviewNotes: string
  yearsExperience: string
  salesType: string
  availability: string
  payStructure: string
  workStyle: string
  schedule: string
  willingToTravel: boolean
  locationSlug: string
  industries: string[]
  headline?: string
  summary?: string
  background?: string
  experience?: string
  personality?: string
  lookingFor?: string
}, editing: { id: string; pseudonym: string; published: boolean; sample: boolean; source: string | null; photo: boolean; model: boolean } | null, error?: string) {
  const travel = values.willingToTravel ? " checked" : ""
  const publicFields = editing
    ? `<section class="card stack">
        <h2>Public profile</h2>
        <p class="muted">Shown as ${escapeHtml(editing.pseudonym)}. ${editing.published ? "Marked published in this desk." : "Draft."}${editing.sample ? " Sample record." : ""}${editing.source ? ` Last draft: ${escapeHtml(editing.source)}.` : ""}</p>
        <p class="muted">${editing.model ? "A model key is set. Generate will call it, then fall back to the template." : "No model key is set. Generate uses the built-in template."} Generating a new draft unpublishes it until you publish again.</p>
        <p class="note">Publish stores the profile in this desk. It does not rewrite the static marketing pages.</p>
        ${field("Headline", "headline", values.headline ?? "")}
        ${field("Summary", "summary", values.summary ?? "", { textarea: true, rows: 4 })}
        ${field("Background", "background", values.background ?? "", { textarea: true, rows: 3 })}
        ${field("Sales experience", "experience", values.experience ?? "", { textarea: true, rows: 3 })}
        ${field("Personality", "personality", values.personality ?? "", { textarea: true, rows: 3 })}
        ${field("What they want", "lookingFor", values.lookingFor ?? "", { textarea: true, rows: 3 })}
        <div class="actions">
          <button name="intent" value="save" type="submit">Save</button>
          <button class="secondary" name="intent" value="generate" type="submit">Generate profile</button>
          <button name="intent" value="publish" type="submit">Publish</button>
          <button class="secondary" name="intent" value="unpublish" type="submit">Unpublish</button>
        </div>
      </section>`
    : `<button type="submit">Add candidate</button>`
  return `${error ? `<p class="banner bad" role="alert">${escapeHtml(error)}</p>` : ""}
    <form class="stack" method="post" action="${editing ? `/admin/candidates/${editing.id}` : "/admin/candidates"}" enctype="multipart/form-data">
      <section class="card stack">
        <h2>Private record</h2>
        <p class="muted">Name, phone, and email stay on the desk.</p>
        <div class="grid-2">
          ${field("Legal name", "realName", values.realName, { required: true })}
          ${field("Phone", "phone", values.phone, { required: true })}
          ${field("Email", "email", values.email, { type: "email", required: true })}
          ${field("Years in sales", "yearsExperience", values.yearsExperience)}
        </div>
        ${field("Interview notes", "interviewNotes", values.interviewNotes, { textarea: true, rows: 8, required: true, hint: "Generate profile strips the legal name, phone, and email before drafting public copy." })}
        ${industryChecks(values.industries)}
        <div class="grid-2">
          ${locationField(values.locationSlug)}
          ${field("Type of sales", "salesType", values.salesType)}
          ${field("Availability", "availability", values.availability)}
          ${field("Pay they will take", "payStructure", values.payStructure)}
          ${workFields(values)}
        </div>
        <label class="check"><input type="checkbox" name="willingToTravel"${travel}> Willing to travel</label>
        ${field("Photo", "photo", "", { type: "file", hint: "Optional JPEG, PNG, or WebP under 2 MB. The original stays private." })}
        ${editing?.photo ? `<label class="check"><input type="checkbox" name="removePhoto"> Remove photo</label><p><a href="/admin/candidates/${editing.id}/photo">View original</a></p>` : ""}
      </section>
      ${publicFields}
    </form>`
}

function valuesFromForm(data: FormData) {
  return {
    realName: String(data.get("realName") ?? ""),
    phone: String(data.get("phone") ?? ""),
    email: String(data.get("email") ?? ""),
    interviewNotes: String(data.get("interviewNotes") ?? ""),
    locationSlug: String(data.get("locationSlug") ?? ""),
    industries: data.getAll("industries").map(String),
    yearsExperience: String(data.get("yearsExperience") ?? ""),
    salesType: String(data.get("salesType") ?? ""),
    availability: String(data.get("availability") ?? ""),
    willingToTravel: data.get("willingToTravel") === "on",
    payStructure: String(data.get("payStructure") ?? ""),
    workStyle: String(data.get("workStyle") ?? ""),
    schedule: String(data.get("schedule") ?? ""),
    headline: String(data.get("headline") ?? ""),
    summary: String(data.get("summary") ?? ""),
    background: String(data.get("background") ?? ""),
    experience: String(data.get("experience") ?? ""),
    personality: String(data.get("personality") ?? ""),
    lookingFor: String(data.get("lookingFor") ?? ""),
  }
}

function valuesFromRow(row: CandidateRow, industrySlugs: string[]) {
  return {
    realName: row.real_name,
    phone: row.phone,
    email: row.email,
    interviewNotes: row.interview_notes,
    locationSlug: row.location_slug,
    industries: industrySlugs,
    yearsExperience: row.years_experience == null ? "" : String(row.years_experience),
    salesType: row.sales_type,
    availability: row.availability,
    willingToTravel: Boolean(row.willing_to_travel),
    payStructure: row.pay_structure,
    workStyle: row.work_style,
    schedule: row.schedule,
    headline: row.headline,
    summary: row.summary,
    background: row.background,
    experience: row.experience,
    personality: row.personality,
    lookingFor: row.looking_for,
  }
}

async function loadCandidate(db: D1Database, id: string) {
  const row = await db
    .prepare(
      `SELECT id, slug, real_name, phone, email, interview_notes, photo_key, pseudonym, headline, summary, background, experience, personality, looking_for, years_experience, sales_type, availability, willing_to_travel, pay_structure, work_style, schedule, location_slug, is_sample, is_published, generation_source, published_at FROM candidates WHERE id = ?`,
    )
    .bind(id)
    .first<CandidateRow>()
  if (!row) return null
  const industries = await db.prepare("SELECT industry_slug FROM candidate_industries WHERE candidate_id = ?").bind(id).all<{ industry_slug: string }>()
  return { row, industries: (industries.results ?? []).map((item) => item.industry_slug) }
}

async function replaceIndustries(db: D1Database, id: string, slugs: string[]) {
  const statements = [db.prepare("DELETE FROM candidate_industries WHERE candidate_id = ?").bind(id)]
  for (const slug of slugs) statements.push(db.prepare("INSERT INTO candidate_industries (candidate_id, industry_slug) VALUES (?, ?)").bind(id, slug))
  await db.batch(statements)
}

export function registerDesk(app: { get: Function; post: Function }) {
  app.get("/admin", overview)
  app.get("/admin/candidates", candidateList)
  app.get("/admin/candidates/new", candidateNew)
  app.post("/admin/candidates", candidateCreate)
  app.get("/admin/candidates/:id/photo", candidatePhoto)
  app.get("/admin/candidates/:id", candidateEdit)
  app.post("/admin/candidates/:id", candidateUpdate)
  app.get("/admin/jobs", jobList)
  app.get("/admin/jobs/new", jobNew)
  app.post("/admin/jobs", jobCreate)
  app.get("/admin/jobs/:id", jobEdit)
  app.post("/admin/jobs/:id", jobUpdate)
  app.get("/admin/requests", requestList)
  app.post("/admin/requests", requestCreate)
  app.post("/admin/requests/:id", requestStatus)
  app.post("/api/requests", requestApi)
}

async function overview(context: AppContext) {
  const db = context.env.DB
  const [published, drafts, requests, jobs] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS n FROM candidates WHERE is_published = 1").first<{ n: number }>(),
    db.prepare("SELECT COUNT(*) AS n FROM candidates WHERE is_published = 0").first<{ n: number }>(),
    db.prepare("SELECT COUNT(*) AS n FROM contact_requests WHERE status = 'new'").first<{ n: number }>(),
    db.prepare("SELECT COUNT(*) AS n FROM jobs WHERE is_published = 1").first<{ n: number }>(),
  ])
  const cards = [
    ["/admin/candidates", "Published profiles", published?.n ?? 0],
    ["/admin/candidates", "Unpublished candidates", drafts?.n ?? 0],
    ["/admin/requests", "New requests", requests?.n ?? 0],
    ["/admin/jobs", "Published jobs", jobs?.n ?? 0],
  ]
  return deskPage(context, {
    title: "Desk",
    active: "home",
    body: `${banners(context.req.url)}
      <h1>Desk</h1>
      <p class="lede">Add a candidate after the interview, generate the public profile, and publish it when the copy is right. Invites and meeting requests land here.</p>
      <p class="note">Publishing stores the record in this desk. The live marketing pages stay the static site, so Publish does not change d2djob.com until a later deploy reads this database.</p>
      <ul class="stats">${cards
        .map(([href, label, value]) => `<li class="card"><a href="${href}"><span class="muted">${label}</span><strong>${value}</strong></a></li>`)
        .join("")}</ul>
      <div class="actions">
        <a class="button" href="/admin/candidates/new">Add candidate</a>
        <a class="button secondary" href="/admin/jobs/new">Add job</a>
        <a class="button secondary" href="/admin/training">Training library</a>
      </div>`,
  })
}

async function candidateList(context: AppContext) {
  const rows = await context.env.DB
    .prepare(
      `SELECT c.id, c.real_name, c.email, c.pseudonym, c.is_published, c.is_sample, l.city, l.state
       FROM candidates c JOIN locations l ON l.slug = c.location_slug ORDER BY c.updated_at DESC`,
    )
    .all<{ id: string; real_name: string; email: string; pseudonym: string; is_published: number; is_sample: number; city: string; state: string }>()
  const links = await context.env.DB.prepare("SELECT candidate_id, industry_slug FROM candidate_industries").all<{ candidate_id: string; industry_slug: string }>()
  const byCandidate = new Map<string, string[]>()
  for (const link of links.results ?? []) {
    const list = byCandidate.get(link.candidate_id) ?? []
    list.push(getIndustry(link.industry_slug)?.name ?? link.industry_slug)
    byCandidate.set(link.candidate_id, list)
  }
  const items = (rows.results ?? [])
    .map(
      (row) => `<li class="card"><a href="/admin/candidates/${row.id}">
        <strong>${escapeHtml(row.pseudonym)}</strong>
        <span class="muted">${escapeHtml(row.real_name)} · ${escapeHtml(row.city)}, ${escapeHtml(row.state)} · ${row.is_published ? "Published" : "Draft"}${row.is_sample ? " · Sample" : ""}</span>
        <span class="muted">${escapeHtml((byCandidate.get(row.id) ?? []).join(", ") || "No industry")} · ${escapeHtml(row.email)}</span>
      </a></li>`,
    )
    .join("")
  return deskPage(context, {
    title: "Candidates",
    active: "candidates",
    body: `<div class="row"><h1>Candidates</h1><a class="button" href="/admin/candidates/new">Add candidate</a></div>
      ${items ? `<ul class="items">${items}</ul>` : `<p class="card">No candidates yet.</p>`}`,
  })
}

async function candidateNew(context: AppContext) {
  return deskPage(context, {
    title: "New candidate",
    active: "candidates",
    body: `<h1>New candidate</h1>${banners(context.req.url)}${candidateFields(blankCandidate(), null)}`,
  })
}

function blankCandidate() {
  return valuesFromForm(new FormData())
}

async function candidateCreate(context: AppContext) {
  const data = await readForm(context)
  const parsed = readCandidateForm(data)
  if (!parsed.ok) {
    return deskPage(context, {
      title: "New candidate",
      active: "candidates",
      status: 400,
      body: `<h1>New candidate</h1>${candidateFields(valuesFromForm(data), null, parsed.error)}`,
    })
  }
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const pseudonym = pseudonymFromName(parsed.data.realName)
  const slug = await uniqueSlug(context.env.DB, "candidates", slugify(pseudonym))
  await context.env.DB
    .prepare(
      `INSERT INTO candidates (
        id, slug, real_name, phone, email, interview_notes, photo_key, pseudonym, headline, summary, background, experience, personality, looking_for,
        years_experience, sales_type, availability, willing_to_travel, pay_structure, work_style, schedule, location_slug, is_sample, is_published,
        generation_source, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NULL, NULL, ?, ?)`,
    )
    .bind(
      id,
      slug,
      parsed.data.realName,
      parsed.data.phone,
      parsed.data.email,
      parsed.data.interviewNotes,
      pseudonym,
      parsed.data.headline,
      parsed.data.summary,
      parsed.data.background,
      parsed.data.experience,
      parsed.data.personality,
      parsed.data.lookingFor,
      parsed.data.yearsExperience,
      parsed.data.salesType,
      parsed.data.availability,
      parsed.data.willingToTravel ? 1 : 0,
      parsed.data.payStructure,
      parsed.data.workStyle,
      parsed.data.schedule,
      parsed.data.locationSlug,
      now,
      now,
    )
    .run()
  await replaceIndustries(context.env.DB, id, parsed.data.industries)
  const file = data.get("photo")
  if (file instanceof File && file.size > 0) {
    const stored = await storePhoto(context.env.FILES, id, file)
    if (!stored.ok) return go(context, `/admin/candidates/${id}`, { error: stored.error })
    await context.env.DB.prepare("UPDATE candidates SET photo_key = ? WHERE id = ?").bind(stored.key, id).run()
  }
  return go(context, `/admin/candidates/${id}`, { notice: "saved" })
}

async function candidateEdit(context: AppContext) {
  const id = context.req.param("id") ?? ""
  if (!UUID.test(id)) return context.text("Not found", 404)
  const loaded = await loadCandidate(context.env.DB, id)
  if (!loaded) return context.text("Not found", 404)
  return deskPage(context, {
    title: loaded.row.pseudonym,
    active: "candidates",
    body: `<h1>${escapeHtml(loaded.row.pseudonym)}</h1>${banners(context.req.url)}${candidateFields(valuesFromRow(loaded.row, loaded.industries), {
      id,
      pseudonym: loaded.row.pseudonym,
      published: Boolean(loaded.row.is_published),
      sample: Boolean(loaded.row.is_sample),
      source: loaded.row.generation_source,
      photo: Boolean(loaded.row.photo_key),
      model: Boolean(context.env.OPENAI_API_KEY),
    })}`,
  })
}

async function candidatePhoto(context: AppContext) {
  const id = context.req.param("id") ?? ""
  if (!UUID.test(id)) return context.text("Not found", 404)
  const row = await context.env.DB.prepare("SELECT photo_key FROM candidates WHERE id = ?").bind(id).first<{ photo_key: string | null }>()
  if (!row?.photo_key) return context.text("Not found", 404)
  const object = await context.env.FILES.get(row.photo_key)
  if (!object?.body) return context.text("Not found", 404)
  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}

async function candidateUpdate(context: AppContext) {
  const id = context.req.param("id") ?? ""
  const path = `/admin/candidates/${id}`
  if (!UUID.test(id)) return context.text("Not found", 404)
  const loaded = await loadCandidate(context.env.DB, id)
  if (!loaded) return go(context, "/admin/candidates", { error: "That candidate is gone." })
  const data = await readForm(context)
  const parsed = readCandidateForm(data)
  if (!parsed.ok) return go(context, path, { error: parsed.error })
  const location = getLocation(parsed.data.locationSlug)
  if (!location) return go(context, path, { error: "Pick a location from the list." })
  const intent = String(data.get("intent") ?? "save")
  let publicFields = {
    headline: parsed.data.headline,
    summary: parsed.data.summary,
    background: parsed.data.background,
    experience: parsed.data.experience,
    personality: parsed.data.personality,
    lookingFor: parsed.data.lookingFor,
    yearsExperience: parsed.data.yearsExperience,
    salesType: parsed.data.salesType,
    availability: parsed.data.availability,
    willingToTravel: parsed.data.willingToTravel,
    payStructure: parsed.data.payStructure,
    workStyle: parsed.data.workStyle,
    schedule: parsed.data.schedule,
  }
  let generationSource = loaded.row.generation_source
  let notice = "saved"
  if (intent === "generate") {
    applyModelEnv(context.env)
    const result = await generateProfile({
      pseudonym: loaded.row.is_published ? loaded.row.pseudonym : pseudonymFromName(parsed.data.realName),
      realName: parsed.data.realName,
      interviewNotes: parsed.data.interviewNotes,
      city: location.city,
      state: location.state,
      county: location.county,
      industryNames: parsed.data.industries.map((slug) => getIndustry(slug)?.name ?? slug),
      yearsExperience: parsed.data.yearsExperience,
      salesType: parsed.data.salesType,
      availability: parsed.data.availability,
      willingToTravel: parsed.data.willingToTravel,
      payStructure: parsed.data.payStructure,
      workStyle: parsed.data.workStyle,
      schedule: parsed.data.schedule,
    })
    publicFields = { ...publicFields, ...result.profile }
    generationSource = result.source
    notice = result.source === "template-fallback" ? "fallback" : result.source
  }
  const publishing = intent === "publish"
  if (publishing && (publicFields.headline.length < 8 || publicFields.summary.length < 40)) {
    return go(context, path, { error: "Write a headline and summary before publishing. Generate profile can draft them." })
  }
  let photoKey = loaded.row.photo_key
  if (data.get("removePhoto") === "on" && photoKey) {
    await context.env.FILES.delete(photoKey)
    photoKey = null
  }
  const file = data.get("photo")
  if (file instanceof File && file.size > 0) {
    const stored = await storePhoto(context.env.FILES, id, file)
    if (!stored.ok) return go(context, path, { error: stored.error })
    photoKey = stored.key
  }
  const pseudonym = loaded.row.is_published ? loaded.row.pseudonym : pseudonymFromName(parsed.data.realName)
  const isPublished = publishing ? 1 : intent === "generate" || intent === "unpublish" ? 0 : loaded.row.is_published
  const publishedAt = publishing ? loaded.row.published_at ?? new Date().toISOString() : loaded.row.published_at
  await context.env.DB
    .prepare(
      `UPDATE candidates SET real_name = ?, phone = ?, email = ?, interview_notes = ?, location_slug = ?, pseudonym = ?, headline = ?, summary = ?,
        background = ?, experience = ?, personality = ?, looking_for = ?, years_experience = ?, sales_type = ?, availability = ?, willing_to_travel = ?,
        pay_structure = ?, work_style = ?, schedule = ?, photo_key = ?, generation_source = ?, is_published = ?, published_at = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      parsed.data.realName,
      parsed.data.phone,
      parsed.data.email,
      parsed.data.interviewNotes,
      parsed.data.locationSlug,
      pseudonym,
      publicFields.headline,
      publicFields.summary,
      publicFields.background,
      publicFields.experience,
      publicFields.personality,
      publicFields.lookingFor,
      publicFields.yearsExperience,
      publicFields.salesType,
      publicFields.availability,
      publicFields.willingToTravel ? 1 : 0,
      publicFields.payStructure,
      publicFields.workStyle,
      publicFields.schedule,
      photoKey,
      generationSource,
      isPublished,
      publishedAt,
      new Date().toISOString(),
      id,
    )
    .run()
  await replaceIndustries(context.env.DB, id, parsed.data.industries)
  return go(context, path, { notice })
}

function jobFields(values: Record<string, string>, editing: boolean, error?: string) {
  const choices = jobChoices()
  return `${error ? `<p class="banner bad" role="alert">${escapeHtml(error)}</p>` : ""}
    <form class="card stack" method="post" action="${editing ? "" : "/admin/jobs"}">
      ${field("Title", "title", values.title, { required: true })}
      ${field("Slug", "slug", values.slug, { hint: "Leave blank to build it from the title." })}
      ${field("Description", "description", values.description, { textarea: true, rows: 8, required: true })}
      <div class="grid-2">
        ${field("Date posted", "datePosted", values.datePosted, { type: "date", required: true })}
        ${field("Valid through", "validThrough", values.validThrough, { type: "date", required: true })}
        ${selectField("Employment type", "employmentType", values.employmentType, choices.employment, { required: true })}
        ${field("Hiring organization", "hiringOrganization", values.hiringOrganization, { required: true })}
        ${selectField("Industry", "industrySlug", values.industrySlug, choicesFromIndustries(), { required: true, blank: "Pick an industry" })}
        ${locationField(values.locationSlug)}
        ${field("Pay from", "salaryMin", values.salaryMin)}
        ${field("Pay to", "salaryMax", values.salaryMax)}
        ${selectField("Pay period", "salaryUnit", values.salaryUnit, choices.salary, { blank: "No base pay" })}
      </div>
      ${field("Commission language", "commissionNote", values.commissionNote, { hint: "Required when there is no base pay." })}
      <label class="check"><input type="checkbox" name="isSample"${values.isSample === "on" ? " checked" : ""}> Mark as a sample listing</label>
      <div class="actions">
        ${editing
          ? `<button name="intent" value="save" type="submit">Save</button>
             <button name="intent" value="publish" type="submit">Publish</button>
             <button class="secondary" name="intent" value="unpublish" type="submit">Unpublish</button>`
          : `<button type="submit">Add job</button>`}
      </div>
      <p class="note">Fiber listings can only be saved in official AT&T Fiber markets. Publish stores the job here and does not rewrite the static pages.</p>
    </form>`
}

function choicesFromIndustries() {
  return ["fiber", "pest-control", "roofing", "windows-doors", "window-cleaning", "exterior-cleaning", "exteriors"].map((slug) => ({
    value: slug,
    label: getIndustry(slug)?.name ?? slug,
  }))
}

function blankJob() {
  const today = new Date().toISOString().slice(0, 10)
  const later = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().slice(0, 10)
  return {
    title: "",
    slug: "",
    description: "",
    datePosted: today,
    validThrough: later,
    employmentType: "FULL_TIME",
    hiringOrganization: "Swyft Marketing",
    industrySlug: "",
    locationSlug: "",
    salaryMin: "",
    salaryMax: "",
    salaryUnit: "",
    commissionNote: "",
    isSample: "",
  }
}

async function jobList(context: AppContext) {
  const rows = await context.env.DB
    .prepare(
      `SELECT j.id, j.title, j.is_published, j.is_sample, l.city, l.state, i.name AS industry
       FROM jobs j JOIN locations l ON l.slug = j.location_slug JOIN industries i ON i.slug = j.industry_slug
       ORDER BY j.updated_at DESC`,
    )
    .all<{ id: string; title: string; is_published: number; is_sample: number; city: string; state: string; industry: string }>()
  const items = (rows.results ?? [])
    .map(
      (row) => `<li class="card"><a href="/admin/jobs/${row.id}"><strong>${escapeHtml(row.title)}</strong>
        <span class="muted">${escapeHtml(row.industry)} · ${escapeHtml(row.city)}, ${escapeHtml(row.state)} · ${row.is_published ? "Published" : "Draft"}${row.is_sample ? " · Sample" : ""}</span></a></li>`,
    )
    .join("")
  return deskPage(context, {
    title: "Jobs",
    active: "jobs",
    body: `<div class="row"><h1>Jobs</h1><a class="button" href="/admin/jobs/new">Add job</a></div>${items ? `<ul class="items">${items}</ul>` : `<p class="card">No jobs yet.</p>`}`,
  })
}

async function jobNew(context: AppContext) {
  return deskPage(context, { title: "New job", active: "jobs", body: `<h1>New job</h1>${banners(context.req.url)}${jobFields(blankJob(), false)}` })
}

function jobValues(data: FormData) {
  return {
    title: String(data.get("title") ?? ""),
    slug: String(data.get("slug") ?? ""),
    description: String(data.get("description") ?? ""),
    datePosted: String(data.get("datePosted") ?? ""),
    validThrough: String(data.get("validThrough") ?? ""),
    employmentType: String(data.get("employmentType") ?? ""),
    hiringOrganization: String(data.get("hiringOrganization") ?? ""),
    industrySlug: String(data.get("industrySlug") ?? ""),
    locationSlug: String(data.get("locationSlug") ?? ""),
    salaryMin: String(data.get("salaryMin") ?? ""),
    salaryMax: String(data.get("salaryMax") ?? ""),
    salaryUnit: String(data.get("salaryUnit") ?? ""),
    commissionNote: String(data.get("commissionNote") ?? ""),
    isSample: data.get("isSample") === "on" ? "on" : "",
  }
}

async function jobCreate(context: AppContext) {
  const data = await readForm(context)
  const parsed = readJobForm(data)
  if (!parsed.ok) {
    return deskPage(context, { title: "New job", active: "jobs", status: 400, body: `<h1>New job</h1>${jobFields(jobValues(data), false, parsed.error)}` })
  }
  const now = new Date().toISOString()
  const slug = await uniqueSlug(context.env.DB, "jobs", slugify(parsed.data.slug || parsed.data.title))
  const id = crypto.randomUUID()
  await insertJob(context.env.DB, id, slug, parsed.data, now, false)
  return go(context, `/admin/jobs/${id}`, { notice: "saved" })
}

async function jobEdit(context: AppContext) {
  const id = context.req.param("id") ?? ""
  if (!UUID.test(id)) return context.text("Not found", 404)
  const row = await context.env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first<JobRow>()
  if (!row) return context.text("Not found", 404)
  return deskPage(context, {
    title: row.title,
    active: "jobs",
    body: `<h1>${escapeHtml(row.title)}</h1>${banners(context.req.url)}${jobFields(jobFromRow(row), true).replace(`action=""`, `action="/admin/jobs/${id}"`)}`,
  })
}

function jobFromRow(row: JobRow): Record<string, string> {
  return {
    title: row.title,
    slug: row.slug,
    description: row.description,
    datePosted: row.date_posted,
    validThrough: row.valid_through,
    employmentType: row.employment_type,
    hiringOrganization: row.hiring_organization,
    industrySlug: row.industry_slug,
    locationSlug: row.location_slug,
    salaryMin: row.salary_min == null ? "" : String(row.salary_min),
    salaryMax: row.salary_max == null ? "" : String(row.salary_max),
    salaryUnit: row.salary_unit ?? "",
    commissionNote: row.commission_note,
    isSample: row.is_sample ? "on" : "",
  }
}

async function jobUpdate(context: AppContext) {
  const id = context.req.param("id") ?? ""
  const path = `/admin/jobs/${id}`
  if (!UUID.test(id)) return context.text("Not found", 404)
  const existing = await context.env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first<JobRow>()
  if (!existing) return go(context, "/admin/jobs", { error: "That job is gone." })
  const data = await readForm(context)
  const parsed = readJobForm(data)
  if (!parsed.ok) return go(context, path, { error: parsed.error })
  const intent = String(data.get("intent") ?? "save")
  const slug = await uniqueSlug(context.env.DB, "jobs", slugify(parsed.data.slug || parsed.data.title), id)
  const isPublished = intent === "publish" ? 1 : intent === "unpublish" ? 0 : existing.is_published
  await context.env.DB
    .prepare(
      `UPDATE jobs SET slug = ?, title = ?, description = ?, date_posted = ?, valid_through = ?, employment_type = ?, hiring_organization = ?,
        industry_slug = ?, location_slug = ?, salary_min = ?, salary_max = ?, salary_unit = ?, commission_note = ?, is_sample = ?, is_published = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      slug,
      parsed.data.title,
      parsed.data.description,
      parsed.data.datePosted,
      parsed.data.validThrough,
      parsed.data.employmentType,
      parsed.data.hiringOrganization,
      parsed.data.industrySlug,
      parsed.data.locationSlug,
      parsed.data.salaryMin,
      parsed.data.salaryMax,
      parsed.data.salaryUnit || null,
      parsed.data.commissionNote,
      parsed.data.isSample ? 1 : 0,
      isPublished,
      new Date().toISOString(),
      id,
    )
    .run()
  return go(context, path, { notice: "saved" })
}

async function insertJob(db: D1Database, id: string, slug: string, data: ReturnType<typeof readJobForm> extends infer T ? T extends { ok: true; data: infer D } ? D : never : never, now: string, published: boolean) {
  await db
    .prepare(
      `INSERT INTO jobs (
        id, slug, title, description, date_posted, valid_through, employment_type, hiring_organization, industry_slug, location_slug,
        salary_min, salary_max, salary_unit, commission_note, is_sample, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      slug,
      data.title,
      data.description,
      data.datePosted,
      data.validThrough,
      data.employmentType,
      data.hiringOrganization,
      data.industrySlug,
      data.locationSlug,
      data.salaryMin,
      data.salaryMax,
      data.salaryUnit || null,
      data.commissionNote,
      data.isSample ? 1 : 0,
      published ? 1 : 0,
      now,
      now,
    )
    .run()
}

async function requestList(context: AppContext) {
  const rows = await context.env.DB
    .prepare(
      `SELECT r.id, r.type, r.status, r.email_status, r.name, r.company, r.email, r.phone, r.message, r.preferred_times, r.created_at,
              c.id AS candidate_id, c.pseudonym, c.real_name, c.is_sample
       FROM contact_requests r JOIN candidates c ON c.id = r.candidate_id ORDER BY r.created_at DESC`,
    )
    .all<{
      id: string
      type: string
      status: string
      email_status: string
      name: string
      company: string
      email: string
      phone: string
      message: string
      preferred_times: string
      created_at: string
      candidate_id: string
      pseudonym: string
      real_name: string
      is_sample: number
    }>()
  const candidates = await context.env.DB.prepare("SELECT id, pseudonym, real_name FROM candidates ORDER BY pseudonym").all<{ id: string; pseudonym: string; real_name: string }>()
  const options = (candidates.results ?? [])
    .map((row) => `<option value="${row.id}">${escapeHtml(row.pseudonym)} (${escapeHtml(row.real_name)})</option>`)
    .join("")
  const items = (rows.results ?? [])
    .map(
      (row) => `<li class="card stack">
        <p class="kicker">${row.type === "meeting" ? "Meeting" : "Invite"} · ${escapeHtml(row.status)} · email ${escapeHtml(row.email_status)}</p>
        <h2>${escapeHtml(row.company)}</h2>
        <p class="muted">${escapeHtml(row.name)} · ${escapeHtml(row.email)} · ${escapeHtml(row.phone)} · ${escapeHtml(row.created_at.slice(0, 16).replace("T", " "))} UTC</p>
        <p>For <a href="/admin/candidates/${row.candidate_id}">${escapeHtml(row.pseudonym)}</a> (${escapeHtml(row.real_name)}${row.is_sample ? ", sample" : ""})</p>
        ${row.preferred_times ? `<p>Times: ${escapeHtml(row.preferred_times)}</p>` : ""}
        <p class="copy">${escapeHtml(row.message)}</p>
        <form method="post" action="/admin/requests/${row.id}" class="actions">
          <button name="status" value="new" type="submit">Mark new</button>
          <button class="secondary" name="status" value="reviewed" type="submit">Mark reviewed</button>
          <button class="secondary" name="status" value="closed" type="submit">Mark closed</button>
        </form>
      </li>`,
    )
    .join("")
  return deskPage(context, {
    title: "Requests",
    active: "requests",
    body: `<h1>Requests</h1>${banners(context.req.url)}
      ${items ? `<ul class="items">${items}</ul>` : `<p class="card">No invites or meeting requests yet.</p>`}
      <form class="card stack" method="post" action="/admin/requests">
        <h2>Log a request</h2>
        <p class="muted">The public profile forms still do not submit, so a request that arrives another way can be logged here. POST /api/requests accepts the same fields once a form is pointed at it.</p>
        <label class="field"><span>Candidate</span><select name="candidateId" required><option value="">Pick a candidate</option>${options}</select></label>
        <label class="field"><span>Type</span><select name="type"><option value="invite">Invite</option><option value="meeting">Meeting</option></select></label>
        ${field("Name", "name", "", { required: true })}
        ${field("Company", "company", "", { required: true })}
        ${field("Email", "email", "", { type: "email", required: true })}
        ${field("Phone", "phone", "", { required: true })}
        ${field("Message", "message", "", { textarea: true, required: true })}
        ${field("Preferred times", "preferredTimes", "", { textarea: true, rows: 2 })}
        <button type="submit">Log request</button>
      </form>`,
  })
}

async function requestStatus(context: AppContext) {
  const id = context.req.param("id") ?? ""
  if (!UUID.test(id)) return context.text("Not found", 404)
  const status = String((await readForm(context)).get("status") ?? "")
  if (!["new", "reviewed", "closed"].includes(status)) return go(context, "/admin/requests", { error: "Unknown status." })
  await context.env.DB.prepare("UPDATE contact_requests SET status = ? WHERE id = ?").bind(status, id).run()
  return go(context, "/admin/requests", { notice: "saved" })
}

async function requestCreate(context: AppContext) {
  const data = await readForm(context)
  const candidateId = String(data.get("candidateId") ?? "")
  const type = String(data.get("type") ?? "")
  if (!UUID.test(candidateId) || (type !== "invite" && type !== "meeting")) {
    return go(context, "/admin/requests", { error: "Pick a candidate and a request type." })
  }
  const parsed = readRequestForm(data, type)
  if (!parsed.ok) return go(context, "/admin/requests", { error: parsed.error })
  if (parsed.spam) return go(context, "/admin/requests", { notice: "logged" })
  const saved = await saveRequest(context.env, candidateId, type, parsed.data, false)
  if (!saved.ok) return go(context, "/admin/requests", { error: saved.error })
  return go(context, "/admin/requests", { notice: "logged" })
}

async function requestApi(context: AppContext) {
  const hour = new Date().toISOString().slice(0, 13)
  const allowed = await bumpCounter(context.env.DB as unknown as SqlDatabase, `api:${clientIp(context)}:${hour}`, 60)
  if (!allowed) return context.json({ error: "Too many requests." }, 429)
  const data = await requestPayload(context)
  const type = String(data.get("type") ?? "")
  const slug = String(data.get("slug") ?? "")
  if (type !== "invite" && type !== "meeting") return context.json({ error: "Type must be invite or meeting." }, 400)
  const parsed = readRequestForm(data, type)
  if (!parsed.ok) return context.json({ error: parsed.error }, 400)
  if (parsed.spam) return context.json({ ok: true })
  const candidate = await context.env.DB
    .prepare("SELECT id FROM candidates WHERE slug = ? AND is_published = 1")
    .bind(slug)
    .first<{ id: string }>()
  if (!candidate) return context.json({ error: "That profile is not available." }, 404)
  const saved = await saveRequest(context.env, candidate.id, type, parsed.data, true)
  if (!saved.ok) return context.json({ error: saved.error }, 404)
  return context.json({ ok: true, id: saved.id })
}

async function requestPayload(context: AppContext) {
  const type = context.req.header("content-type") || ""
  if (!type.includes("application/json")) return readForm(context)
  const body = await context.req.json<Record<string, unknown>>()
  const data = new FormData()
  for (const [key, value] of Object.entries(body)) data.set(key, String(value ?? ""))
  return data
}

async function saveRequest(
  env: Env,
  candidateId: string,
  type: "invite" | "meeting",
  data: { name: string; company: string; email: string; phone: string; message: string; preferredTimes: string },
  publishedOnly: boolean,
) {
  const candidate = await env.DB
    .prepare(
      `SELECT c.id, c.pseudonym, c.real_name, c.is_sample, c.is_published, l.city, l.state
       FROM candidates c JOIN locations l ON l.slug = c.location_slug WHERE c.id = ?`,
    )
    .bind(candidateId)
    .first<{ id: string; pseudonym: string; real_name: string; is_sample: number; is_published: number; city: string; state: string }>()
  if (!candidate || (publishedOnly && !candidate.is_published)) return { ok: false as const, error: "That profile is not available." }
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  await env.DB
    .prepare(
      `INSERT INTO contact_requests (id, candidate_id, type, name, company, email, phone, message, preferred_times, status, email_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'pending', ?)`,
    )
    .bind(id, candidate.id, type, data.name, data.company, data.email, data.phone, data.message, data.preferredTimes, createdAt)
    .run()
  const label = type === "meeting" ? "Meeting request" : "Invite"
  const emailStatus = await sendDeskEmail(env, {
    subject: `${label}: ${candidate.pseudonym} — ${data.company}`,
    text: [
      `${label} for ${candidate.pseudonym}${candidate.is_sample ? " (sample profile)" : ""}.`,
      `Legal name on file: ${candidate.real_name}`,
      `Market: ${candidate.city}, ${candidate.state}`,
      "",
      `From: ${data.name}`,
      `Company: ${data.company}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      data.preferredTimes ? `Times: ${data.preferredTimes}` : "",
      "",
      data.message,
      "",
      `Request id: ${id}`,
    ]
      .filter(Boolean)
      .join("\n"),
  })
  await env.DB.prepare("UPDATE contact_requests SET email_status = ? WHERE id = ?").bind(emailStatus, id).run()
  return { ok: true as const, id }
}
