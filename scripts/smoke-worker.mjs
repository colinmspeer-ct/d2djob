import { execFileSync, spawn } from "node:child_process"
import fs from "node:fs"
import assert from "node:assert/strict"

const port = 8791
const base = `http://127.0.0.1:${port}`
const persist = ".wrangler/state"
const varsPath = ".dev.vars"
const previousVars = fs.existsSync(varsPath) ? fs.readFileSync(varsPath) : null

fs.writeFileSync(
  varsPath,
  "ADMIN_PASSWORD=local-desk\nADMIN_SESSION_SECRET=local-session-secret-change-me\nTRAINING_SITE_ID=d2djob\n",
)

fs.rmSync(persist, { recursive: true, force: true })
execFileSync("node", ["scripts/ensure-worker-assets.mjs"], { stdio: "inherit" })
execFileSync(
  "npx",
  ["wrangler", "d1", "migrations", "apply", "d2djob", "--local", "--persist-to", persist],
  { stdio: "inherit" },
)

const child = spawn(
  "npx",
  ["wrangler", "dev", "--persist-to", persist, "--ip", "127.0.0.1", "--port", String(port)],
  { stdio: ["ignore", "pipe", "pipe"], detached: true },
)

let logs = ""
child.stdout.on("data", (chunk) => {
  logs += chunk
})
child.stderr.on("data", (chunk) => {
  logs += chunk
})

function cookieJar() {
  const cookies = new Map()
  return {
    store(response) {
      const list = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : []
      for (const cookie of list) {
        const [pair] = cookie.split(";")
        const eq = pair.indexOf("=")
        cookies.set(pair.slice(0, eq), pair.slice(eq + 1))
      }
    },
    header() {
      return [...cookies].map(([name, value]) => `${name}=${value}`).join("; ")
    },
  }
}

async function request(path, { method = "GET", body, jar, headers = {} } = {}) {
  const next = { ...headers }
  if (jar?.header()) next.cookie = jar.header()
  const response = await fetch(base + path, { method, body, headers: next, redirect: "manual" })
  jar?.store(response)
  return response
}

async function waitUntilReady() {
  const started = Date.now()
  while (Date.now() - started < 90_000) {
    if (child.exitCode != null) throw new Error(`wrangler exited ${child.exitCode}\n${logs}`)
    try {
      const response = await fetch(`${base}/admin/login`)
      if (response.status === 200) return
    } catch {
      // Worker is still booting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`worker did not start\n${logs}`)
}

function stop() {
  if (child.pid) {
    try {
      process.kill(-child.pid, "SIGTERM")
    } catch {
      if (child.exitCode == null) child.kill("SIGTERM")
    }
  }
  if (previousVars) fs.writeFileSync(varsPath, previousVars)
  else fs.rmSync(varsPath, { force: true })
}

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
)

try {
  await waitUntilReady()
  const admin = cookieJar()

  const home = await request("/")
  assert.equal(home.status, 200)
  assert.equal(home.headers.get("x-robots-tag"), null)
  const homeHtml = await home.text()
  assert.match(homeHtml, /data-site="marketing"|d2djob/i)
  assert.equal(homeHtml.includes("Private. Not indexed."), false)

  const login = await request("/admin/login")
  assert.equal(login.status, 200)
  assert.match(login.headers.get("x-robots-tag") ?? "", /noindex/)
  assert.match(await login.text(), /Recruiting desk/)

  const wrong = await request("/admin/login", {
    method: "POST",
    jar: admin,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ password: "not-the-password" }),
  })
  assert.equal(wrong.status, 401)

  const signedIn = await request("/admin/login", {
    method: "POST",
    jar: admin,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ password: "local-desk" }),
  })
  assert.equal(signedIn.status, 303)
  assert.match(signedIn.headers.get("location") ?? "", /\/admin$/)

  const desk = await request("/admin", { jar: admin })
  assert.equal(desk.status, 200)
  assert.match(await desk.text(), /<h1>Desk<\/h1>/)

  const candidate = new FormData()
  candidate.set("realName", "Casey Morgan")
  candidate.set("phone", "555-010-2211")
  candidate.set("email", "casey.morgan@example.com")
  candidate.set("interviewNotes", "Casey Morgan has six years of residential fiber around Raleigh and wants a posted daily number.")
  candidate.set("industries", "fiber")
  candidate.set("locationSlug", "raleigh-nc")
  candidate.set("yearsExperience", "6")
  candidate.set("salesType", "Residential fiber")
  candidate.set("availability", "Weekdays")
  candidate.set("payStructure", "Base plus commission")
  candidate.set("workStyle", "team")
  candidate.set("schedule", "full-time")
  candidate.set("willingToTravel", "on")
  const created = await request("/admin/candidates", { method: "POST", jar: admin, body: candidate })
  assert.equal(created.status, 303)
  const candidatePath = new URL(created.headers.get("location") ?? "", base).pathname
  assert.match(candidatePath, /^\/admin\/candidates\/[0-9a-f-]+$/)

  const draft = new FormData()
  for (const [key, value] of candidate.entries()) draft.set(key, value)
  draft.set("intent", "generate")
  const generated = await request(candidatePath, { method: "POST", jar: admin, body: draft })
  assert.equal(generated.status, 303)
  const editor = await request(candidatePath, { jar: admin })
  const editorHtml = await editor.text()
  assert.match(editorHtml, /Casey M\./)
  assert.match(editorHtml, /name="headline"[^>]*value="[^"]+/)
  assert.equal(editorHtml.includes("casey.morgan@example.com"), true)
  assert.equal(/casey\.morgan@example\.com/.test(editorHtml.split("Public profile")[1] ?? ""), false)

  draft.set("intent", "publish")
  const headline = /name="headline"[^>]*value="([^"]*)"/.exec(editorHtml)?.[1] ?? ""
  const summary = /name="summary"[^>]*>([^<]*)</.exec(editorHtml)?.[1] ?? ""
  draft.set("headline", headline)
  draft.set("summary", summary)
  draft.set("background", /name="background"[^>]*>([^<]*)</.exec(editorHtml)?.[1] ?? "Background")
  draft.set("experience", /name="experience"[^>]*>([^<]*)</.exec(editorHtml)?.[1] ?? "Experience")
  draft.set("personality", /name="personality"[^>]*>([^<]*)</.exec(editorHtml)?.[1] ?? "Personality")
  draft.set("lookingFor", /name="lookingFor"[^>]*>([^<]*)</.exec(editorHtml)?.[1] ?? "Looking for a team.")
  const published = await request(candidatePath, { method: "POST", jar: admin, body: draft })
  assert.equal(published.status, 303)
  const publishedPage = await request(candidatePath, { jar: admin })
  assert.equal((await publishedPage.text()).includes("Write a headline"), false)

  const job = new FormData()
  job.set("title", "Fiber sales rep in Raleigh")
  job.set("description", "Knock residential fiber in north Raleigh. The team meets at 9, works a written route, and reviews numbers every evening before the last door.")
  job.set("datePosted", "2026-11-24")
  job.set("validThrough", "2027-01-24")
  job.set("employmentType", "FULL_TIME")
  job.set("hiringOrganization", "Swyft Marketing")
  job.set("industrySlug", "fiber")
  job.set("locationSlug", "raleigh-nc")
  job.set("salaryMin", "700")
  job.set("salaryMax", "900")
  job.set("salaryUnit", "WEEK")
  const jobResponse = await request("/admin/jobs", { method: "POST", jar: admin, body: job })
  assert.equal(jobResponse.status, 303)

  const candidateId = candidatePath.split("/").pop()
  const logged = await request("/admin/requests", {
    method: "POST",
    jar: admin,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      candidateId,
      type: "meeting",
      name: "Riley Chen",
      company: "North Line Roofing",
      email: "riley@example.com",
      phone: "555-010-7788",
      message: "We need a rep for north Raleigh next month.",
      preferredTimes: "Tuesday after 2",
    }),
  })
  assert.equal(logged.status, 303)
  const requests = await request("/admin/requests", { jar: admin })
  assert.match(await requests.text(), /North Line Roofing/)

  const api = await request("/api/requests", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      slug: "casey-m",
      type: "invite",
      name: "Avery Cole",
      company: "Harbor Pest",
      email: "avery@example.com",
      phone: "555-010-9900",
      message: "Looking for a fiber rep who will travel the Carolinas.",
      preferredTimes: "",
    }),
  })
  assert.equal(api.status, 200)
  assert.equal((await api.json()).ok, true)

  const section = await request("/admin/training/sections", {
    method: "POST",
    jar: admin,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ title: "First week", description: "Learn the route before you knock." }),
  })
  assert.equal(section.status, 303)
  const library = await request("/admin/training", { jar: admin })
  const libraryHtml = await library.text()
  assert.match(libraryHtml, /<h1>Training library<\/h1>/)
  const sectionId = /name="sectionId" value="([^"]+)"/.exec(libraryHtml)?.[1]
  assert.ok(sectionId)

  const upload = new FormData()
  upload.set("sectionId", sectionId)
  upload.set("title", "Door photo")
  upload.set("description", "What a clean approach looks like.")
  upload.set("kind", "image")
  upload.set("file", new Blob([png], { type: "image/png" }), "door.png")
  const uploaded = await request("/admin/training/items", { method: "POST", jar: admin, body: upload })
  assert.equal(uploaded.status, 303)

  const fake = new FormData()
  fake.set("sectionId", sectionId)
  fake.set("title", "Not a photo")
  fake.set("kind", "image")
  fake.set("file", new Blob(["not an image"], { type: "image/png" }), "door.png")
  const rejected = await request("/admin/training/items", { method: "POST", jar: admin, body: fake })
  assert.match(await rejected.text(), /do not match/)

  const link = new FormData()
  link.set("sectionId", sectionId)
  link.set("title", "Route video")
  link.set("description", "Hosted outside the desk.")
  link.set("kind", "link")
  link.set("url", "https://example.com/training-week")
  assert.equal((await request("/admin/training/items", { method: "POST", jar: admin, body: link })).status, 303)

  const repPassword = await request("/admin/training/reps", {
    method: "POST",
    jar: admin,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: "rep@example.com", password: "training-pass" }),
  })
  assert.equal(repPassword.status, 303)

  const invite = await request("/admin/training/invites", {
    method: "POST",
    jar: admin,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ label: "Summer class" }),
  })
  assert.equal(invite.status, 303)
  const revealed = await request("/admin/training", { jar: admin })
  const revealedHtml = await revealed.text()
  const inviteUrl = /href="(http:\/\/127\.0\.0\.1:\d+\/training\/invite\/[^"]+)"/.exec(revealedHtml)?.[1]
  assert.ok(inviteUrl, revealedHtml)

  const rep = cookieJar()
  const opened = await request(new URL(inviteUrl).pathname, { jar: rep })
  assert.equal(opened.status, 303)
  const libraryView = await request("/training", { jar: rep })
  const libraryViewHtml = await libraryView.text()
  assert.equal(libraryView.status, 200)
  assert.match(libraryView.headers.get("x-robots-tag") ?? "", /noindex/)
  assert.match(libraryViewHtml, /<h1>Training<\/h1>/)
  assert.match(libraryViewHtml, /First week/)
  assert.match(libraryViewHtml, /Door photo/)
  assert.match(libraryViewHtml, /https:\/\/example\.com\/training-week/)
  const filePath = /src="(\/training\/files\/[^"]+)"/.exec(libraryViewHtml)?.[1]
  assert.ok(filePath)
  const file = await request(filePath, { jar: rep })
  assert.equal(file.status, 200)
  assert.equal(file.headers.get("content-type"), "image/png")
  assert.equal(Buffer.from(await file.arrayBuffer()).subarray(0, 4).toString("hex"), "89504e47")
  const hidden = await request(filePath)
  assert.equal(hidden.status, 401)

  const loggedOut = cookieJar()
  const repLogin = await request("/training/login", {
    method: "POST",
    jar: loggedOut,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: "rep@example.com", password: "training-pass" }),
  })
  assert.equal(repLogin.status, 303)
  assert.match(await (await request("/training", { jar: loggedOut })).text(), /First week/)

  const alias = await request("/library")
  assert.equal(alias.status, 301)
  assert.match(alias.headers.get("location") ?? "", /^\/training/)

  console.log("worker smoke test passed")
} catch (error) {
  console.error(logs.slice(-4000))
  throw error
} finally {
  stop()
}
