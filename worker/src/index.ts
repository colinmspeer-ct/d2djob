import { Hono } from "hono"
import { isPrivatePath } from "../../lib/private-paths"
import { MAX_BODY_BYTES } from "../../packages/training-library/src/files"
import { createTrainingAdminRouter, createTrainingRepRouter } from "../../packages/training-library/src/index"
import { verifyPassword } from "../../packages/training-library/src/password"
import { attemptState, clearAttempts, recordFailure } from "../../packages/training-library/src/store"
import type { ObjectBucket, SqlDatabase, TrainingConfig } from "../../packages/training-library/src/types"
import { registerDesk } from "./desk"
import type { AppContext, Env } from "./env"
import { secureRequest, sessionSecret, siteId } from "./env"
import { readForm } from "./form"
import { deskPage, loginPage, repPage } from "./layout"
import { ensureReady } from "./ready"
import { clearAdminCookie, clientIp, readAdmin, setAdminCookie, setFlash, takeFlash } from "./session"

const CSP = [
  "default-src 'self'",
  "img-src 'self' data:",
  "media-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "frame-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "script-src 'none'",
].join("; ")

const app = new Hono<{ Bindings: Env; Variables: { bootError: string | null } }>()

app.use("*", async (context, next) => {
  if (context.req.method === "POST") {
    const length = Number(context.req.header("content-length") || "0")
    if (Number.isFinite(length) && length > MAX_BODY_BYTES) return context.text("Upload is over the 80 MB limit.", 413)
    if ((isPrivatePath(context.req.path) || context.req.path.startsWith("/api")) && !sameOrigin(context)) {
      return context.text("Cross-site request blocked.", 403)
    }
  }
  await next()
  if (isPrivatePath(context.req.path) || context.req.path.startsWith("/api")) {
    context.res.headers.set("X-Robots-Tag", "noindex, nofollow")
    context.res.headers.set("Cache-Control", "private, no-store")
    context.res.headers.set("X-Content-Type-Options", "nosniff")
    context.res.headers.set("Referrer-Policy", "same-origin")
    context.res.headers.set("X-Frame-Options", "SAMEORIGIN")
    if ((context.res.headers.get("content-type") || "").includes("text/html")) {
      context.res.headers.set("Content-Security-Policy", CSP)
    }
  }
})

app.use("*", async (context, next) => {
  if (!isPrivatePath(context.req.path) && !context.req.path.startsWith("/api")) return next()
  context.set("bootError", await ensureReady(context.env))
  return next()
})

app.use("*", async (context, next) => {
  const path = context.req.path
  if (path === "/admin/login" || !path.startsWith("/admin")) return next()
  if (!(await readAdmin(context))) return context.redirect("/admin/login", 303)
  return next()
})

app.get("/admin/login", async (context) => {
  if (!context.get("bootError") && (await readAdmin(context))) return context.redirect("/admin", 303)
  return loginPage(context)
})

app.post("/admin/login", async (context) => {
  if (context.get("bootError")) return loginPage(context)
  const password = String((await readForm(context)).get("password") ?? "")
  const row = await context.env.DB.prepare("SELECT password_hash FROM admins WHERE id = 'primary'").first<{ password_hash: string }>()
  if (!row) return loginPage(context, "The desk password has not been set.")
  const bucket = `admin:${clientIp(context)}`
  const db = context.env.DB as unknown as SqlDatabase
  if ((await attemptState(db, bucket, new Date().toISOString())).locked) {
    return loginPage(context, "Too many attempts. Wait 15 minutes and try again.")
  }
  if (!(await verifyPassword(password, row.password_hash))) {
    await recordFailure(db, bucket, Date.now())
    return loginPage(context, "Wrong password.")
  }
  await clearAttempts(db, bucket)
  await setAdminCookie(context)
  return context.redirect("/admin", 303)
})

app.post("/admin/logout", async (context) => {
  clearAdminCookie(context)
  return context.redirect("/admin/login", 303)
})

const training: TrainingConfig = {
  siteId: (context) => siteId((context as AppContext).env),
  repBase: "/training",
  adminBase: "/admin/training",
  adminLogin: "/admin/login",
  sessionSecret: (context) => sessionSecret((context as AppContext).env),
  getDb: (context) => (context as AppContext).env.DB as unknown as SqlDatabase,
  getBucket: (context) => (context as AppContext).env.FILES as unknown as ObjectBucket,
  isAdmin: (context) => readAdmin(context as AppContext),
  setFlash: (context, flash) => setFlash(context as AppContext, flash),
  takeFlash: (context) => takeFlash(context as AppContext),
  renderPage: (context, page) => {
    const appContext = context as AppContext
    if (page.area === "admin") return deskPage(appContext, { title: page.title, active: "library", body: page.body })
    return repPage(appContext, page)
  },
  secureCookie: (context) => secureRequest(context.req.url),
  clientIp: (context) => clientIp(context as AppContext),
}

app.route("/training", createTrainingRepRouter(training))
app.route("/admin/training", createTrainingAdminRouter(training))
registerDesk(app)

app.all("/library", (context) => relocate(context))
app.all("/library/*", (context) => relocate(context))

app.notFound((context) => {
  if (context.req.path.startsWith("/api")) return context.json({ error: "Not found." }, 404)
  if (isPrivatePath(context.req.path)) {
    return deskPage(context, { title: "Not found", active: "", body: `<h1>Not found</h1><p>That desk page does not exist.</p>`, status: 404 })
  }
  return context.env.ASSETS.fetch(context.req.raw)
})

app.onError((error, context) => {
  console.error(error)
  if (context.req.path.startsWith("/api")) return context.json({ error: "Something went wrong." }, 500)
  if (isPrivatePath(context.req.path)) {
    return deskPage(context, { title: "Desk error", active: "", body: `<h1>Something went wrong</h1><p>Try that again.</p>`, status: 500 })
  }
  return context.text("Something went wrong.", 500)
})

function relocate(context: AppContext) {
  const url = new URL(context.req.url)
  url.pathname = url.pathname.replace(/^\/library/, "/training") || "/training"
  return context.redirect(`${url.pathname}${url.search}`, 301)
}

function sameOrigin(context: AppContext) {
  const origin = context.req.header("origin")
  if (!origin || origin === "null") {
    const site = context.req.header("sec-fetch-site")
    if (!site) return true
    return site === "same-origin" || site === "none"
  }
  try {
    return new URL(origin).host === new URL(context.req.url).host
  } catch {
    return false
  }
}

export default app
