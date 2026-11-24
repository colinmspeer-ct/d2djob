import { Hono } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { contentDisposition, inspectLink, inspectUpload, safeFileName, UPLOAD_LIMITS } from "./files"
import { hashPassword, verifyPassword } from "./password"
import { openSeal, randomToken, seal, sha256Hex } from "./session"
import {
  attemptState,
  clearAttempts,
  createInvite,
  createItem,
  createRep,
  createSection,
  deleteItem,
  deleteRep,
  deleteSection,
  findInvite,
  findRep,
  getItem,
  getSection,
  listInvites,
  listLibrary,
  listReps,
  moveItem,
  moveSection,
  recordFailure,
  revokeInvite,
  trainingObjectKey,
  updateSection,
  validSiteId,
} from "./store"
import type { TrainingConfig, TrainingFlash } from "./types"
import { adminLibrary, inviteInvalid, repLibrary, repLogin } from "./views"

const REP_COOKIE = "d2d_rep"
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function nowOf(config: TrainingConfig) {
  return (config.now ?? (() => new Date()))()
}

function siteOf(config: TrainingConfig, context: Parameters<TrainingConfig["siteId"]>[0]) {
  const siteId = config.siteId(context)
  if (!validSiteId(siteId)) throw new Error("Training site id must be 2 to 40 lowercase letters, numbers, or hyphens.")
  return siteId
}

async function repClaims(config: TrainingConfig, context: Parameters<TrainingConfig["siteId"]>[0], siteId: string) {
  const claims = await openSeal(config.sessionSecret(context), getCookie(context, REP_COOKIE), nowOf(config).getTime())
  if (!claims || claims.role !== "rep" || claims.siteId !== siteId) return null
  return claims
}

function cookieOptions(config: TrainingConfig, context: Parameters<TrainingConfig["secureCookie"]>[0]) {
  return {
    httpOnly: true,
    secure: config.secureCookie(context),
    sameSite: "Lax" as const,
    path: config.repBase,
    maxAge: 60 * 60 * 24 * 14,
  }
}

async function setRepCookie(
  config: TrainingConfig,
  context: Parameters<TrainingConfig["siteId"]>[0],
  siteId: string,
  sub: string,
) {
  const token = await seal(config.sessionSecret(context), { role: "rep", siteId, sub }, 60 * 60 * 24 * 14)
  setCookie(context, REP_COOKIE, token, cookieOptions(config, context))
}

function clearRepCookie(config: TrainingConfig, context: Parameters<TrainingConfig["secureCookie"]>[0]) {
  deleteCookie(context, REP_COOKIE, { path: config.repBase, secure: config.secureCookie(context), sameSite: "Lax" })
}

async function page(
  config: TrainingConfig,
  context: Parameters<TrainingConfig["renderPage"]>[0],
  input: { title: string; body: string; area: "admin" | "rep"; frame?: "app" | "bare"; status?: number },
) {
  const response = await config.renderPage(context, input)
  if (!input.status || input.status === 200) return response
  return new Response(response.body, { status: input.status, headers: response.headers })
}

function textField(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function clip(value: string, max: number) {
  return value.slice(0, max).trim()
}

async function redirectWith(config: TrainingConfig, context: Parameters<TrainingConfig["setFlash"]>[0], path: string, flash?: TrainingFlash) {
  if (flash) await config.setFlash(context, flash)
  return context.redirect(path, 303)
}

export function createTrainingRepRouter(config: TrainingConfig) {
  const app = new Hono()

  app.get("/", async (context) => {
    const siteId = siteOf(config, context)
    const admin = await config.isAdmin(context)
    const rep = await repClaims(config, context, siteId)
    if (!admin && !rep) return context.redirect(`${config.repBase}/login`, 303)
    const sections = await listLibrary(config.getDb(context), siteId)
    const flash = (await config.takeFlash(context)) ?? {}
    return page(config, context, {
      title: "Training",
      area: "rep",
      body: repLibrary({ repBase: config.repBase, sections, flash, adminPreview: admin && !rep }),
    })
  })

  app.get("/login", async (context) => {
    const siteId = siteOf(config, context)
    if ((await config.isAdmin(context)) || (await repClaims(config, context, siteId))) {
      return context.redirect(config.repBase, 303)
    }
    return page(config, context, {
      title: "Training sign in",
      area: "rep",
      frame: "bare",
      body: repLogin({ repBase: config.repBase }),
    })
  })

  app.post("/login", async (context) => {
    const siteId = siteOf(config, context)
    const db = config.getDb(context)
    const form = await context.req.parseBody()
    const email = textField(form.email).toLowerCase()
    const password = textField(form.password)
    const fail = (status: number, error: string) =>
      page(config, context, {
        title: "Training sign in",
        area: "rep",
        frame: "bare",
        status,
        body: repLogin({ repBase: config.repBase, error }),
      })
    if (!email || password.length < 10) return fail(400, "Enter the email and password you were given.")
    const bucket = `rep:${siteId}:${config.clientIp(context)}`
    const now = nowOf(config).getTime()
    if ((await attemptState(db, bucket, new Date(now).toISOString())).locked) {
      return fail(429, "Too many attempts. Wait 15 minutes and try again.")
    }
    const rep = await findRep(db, siteId, email)
    const ok = rep ? await verifyPassword(password, rep.password_hash) : await verifyPassword(password, "missing")
    if (!ok || !rep) {
      await recordFailure(db, bucket, now)
      return fail(401, "That email or password is wrong.")
    }
    await clearAttempts(db, bucket)
    await setRepCookie(config, context, siteId, rep.id)
    return context.redirect(config.repBase, 303)
  })

  app.post("/logout", async (context) => {
    clearRepCookie(config, context)
    return context.redirect(`${config.repBase}/login`, 303)
  })

  app.get("/invite/:token", async (context) => {
    const siteId = siteOf(config, context)
    const invite = await findInvite(config.getDb(context), await sha256Hex(context.req.param("token")))
    const now = nowOf(config).toISOString()
    const valid = invite && invite.site_id === siteId && !invite.revoked_at && (!invite.expires_at || invite.expires_at > now)
    if (!valid || !invite) {
      return page(config, context, { title: "Invite link", area: "rep", frame: "bare", status: 404, body: inviteInvalid() })
    }
    await setRepCookie(config, context, siteId, `invite:${invite.id}`)
    return context.redirect(config.repBase, 303)
  })

  app.get("/files/:id", async (context) => {
    const siteId = siteOf(config, context)
    if (!UUID.test(context.req.param("id"))) return context.text("Not found", 404)
    const item = await getItem(config.getDb(context), siteId, context.req.param("id"))
    if (!item?.object_key || !item.content_type || !item.file_name) return context.text("Not found", 404)
    if (!(await config.isAdmin(context)) && !(await repClaims(config, context, siteId))) {
      return context.text("Unauthorized", 401)
    }
    const header = context.req.header("range")
    if (header) {
      if (!item.byte_size) return context.text("Not found", 404)
      const match = /^bytes=(\d+)-(\d*)$/.exec(header.trim())
      const start = match ? Number(match[1]) : Number.NaN
      const end = match ? (match[2] ? Number(match[2]) : item.byte_size - 1) : Number.NaN
      if (!match || !Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || start >= item.byte_size) {
        return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${item.byte_size}` } })
      }
      const boundedEnd = Math.min(end, item.byte_size - 1)
      const ranged = await config.getBucket(context).get(item.object_key, {
        range: { offset: start, length: boundedEnd - start + 1 },
      })
      if (!ranged?.body) return context.text("Not found", 404)
      return new Response(ranged.body, {
        status: 206,
        headers: {
          ...fileHeaders(item.content_type, item.file_name, boundedEnd - start + 1),
          "Content-Range": `bytes ${start}-${boundedEnd}/${item.byte_size}`,
        },
      })
    }
    const object = await config.getBucket(context).get(item.object_key)
    if (!object?.body) return context.text("Not found", 404)
    return new Response(object.body, {
      headers: fileHeaders(item.content_type, item.file_name, item.byte_size ?? object.size),
    })
  })

  return app
}

function fileHeaders(contentType: string, fileName: string, length: number) {
  return {
    "Content-Type": contentType,
    "Content-Length": String(length),
    "Content-Disposition": contentDisposition(contentType, fileName),
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  }
}

export function createTrainingAdminRouter(config: TrainingConfig) {
  const app = new Hono()

  app.use("*", async (context, next) => {
    if (!(await config.isAdmin(context))) return context.redirect(config.adminLogin, 303)
    return next()
  })

  app.get("/", async (context) => renderAdmin(config, context))

  app.post("/sections", async (context) => {
    const siteId = siteOf(config, context)
    const form = await context.req.parseBody()
    const title = clip(textField(form.title), 120)
    const description = clip(textField(form.description), 2000)
    if (title.length < 2) return renderAdmin(config, context, { error: "Give the section a title." })
    await createSection(config.getDb(context), siteId, title, description, nowOf(config).toISOString())
    return redirectWith(config, context, config.adminBase, { notice: "Section added." })
  })

  app.post("/sections/:id", async (context) => {
    const siteId = siteOf(config, context)
    const id = context.req.param("id")
    if (!UUID.test(id)) return context.text("Not found", 404)
    const form = await context.req.parseBody()
    const title = clip(textField(form.title), 120)
    const description = clip(textField(form.description), 2000)
    if (title.length < 2) return renderAdmin(config, context, { error: "Give the section a title." })
    await updateSection(config.getDb(context), siteId, id, title, description, nowOf(config).toISOString())
    return redirectWith(config, context, config.adminBase, { notice: "Section saved." })
  })

  app.post("/sections/:id/delete", async (context) => {
    const siteId = siteOf(config, context)
    const id = context.req.param("id")
    if (!UUID.test(id)) return context.text("Not found", 404)
    const keys = await deleteSection(config.getDb(context), siteId, id)
    await Promise.all(keys.map((key) => config.getBucket(context).delete(key)))
    return redirectWith(config, context, config.adminBase, { notice: "Section deleted." })
  })

  app.post("/sections/:id/move", async (context) => {
    const id = context.req.param("id")
    const direction = textField((await context.req.parseBody()).direction)
    if (!UUID.test(id) || (direction !== "up" && direction !== "down")) return context.redirect(config.adminBase, 303)
    await moveSection(config.getDb(context), siteOf(config, context), id, direction, nowOf(config).toISOString())
    return context.redirect(config.adminBase, 303)
  })

  app.post("/items", async (context) => {
    const siteId = siteOf(config, context)
    const db = config.getDb(context)
    const form = await context.req.parseBody()
    const sectionId = textField(form.sectionId)
    const title = clip(textField(form.title), 140)
    const description = clip(textField(form.description), 2000)
    const kind = textField(form.kind)
    if (!UUID.test(sectionId) || !(await getSection(db, siteId, sectionId))) {
      return renderAdmin(config, context, { error: "Pick a section first." })
    }
    if (title.length < 2) return renderAdmin(config, context, { error: "Give the item a title." })
    const now = nowOf(config).toISOString()
    if (kind === "link") {
      const link = inspectLink(textField(form.url))
      if (!link.ok) return renderAdmin(config, context, { error: link.error })
      await createItem(db, siteId, {
        sectionId,
        title,
        description,
        kind,
        externalUrl: link.url,
        objectKey: null,
        fileName: null,
        contentType: null,
        byteSize: null,
        now,
      })
      return redirectWith(config, context, config.adminBase, { notice: "Link added." })
    }
    const file = form.file
    if (!(file instanceof File) || file.size === 0) {
      return renderAdmin(config, context, { error: "Choose a file, or switch the type to Link." })
    }
    const limit = UPLOAD_LIMITS[kind as keyof typeof UPLOAD_LIMITS]
    if (!limit || file.size > limit) {
      return renderAdmin(config, context, { error: "That file is over the size limit for its type." })
    }
    const bytes = new Uint8Array(await file.arrayBuffer())
    const inspected = inspectUpload(bytes, file.name || "upload", kind)
    if (!inspected.ok) return renderAdmin(config, context, { error: inspected.error })
    const itemId = crypto.randomUUID()
    const fileName = safeFileName(file.name || "upload", inspected.extension)
    const key = trainingObjectKey(siteId, itemId, fileName)
    const bucket = config.getBucket(context)
    await bucket.put(key, bytes, { httpMetadata: { contentType: inspected.contentType } })
    try {
      await createItem(db, siteId, {
        id: itemId,
        sectionId,
        title,
        description,
        kind,
        externalUrl: null,
        objectKey: key,
        fileName,
        contentType: inspected.contentType,
        byteSize: inspected.byteSize,
        now,
      })
    } catch (error) {
      await bucket.delete(key)
      throw error
    }
    return redirectWith(config, context, config.adminBase, { notice: "File added." })
  })

  app.post("/items/:id/delete", async (context) => {
    const id = context.req.param("id")
    if (!UUID.test(id)) return context.text("Not found", 404)
    const key = await deleteItem(config.getDb(context), siteOf(config, context), id)
    if (key) await config.getBucket(context).delete(key)
    return redirectWith(config, context, config.adminBase, { notice: "Item deleted." })
  })

  app.post("/items/:id/move", async (context) => {
    const id = context.req.param("id")
    const direction = textField((await context.req.parseBody()).direction)
    if (!UUID.test(id) || (direction !== "up" && direction !== "down")) return context.redirect(config.adminBase, 303)
    await moveItem(config.getDb(context), siteOf(config, context), id, direction, nowOf(config).toISOString())
    return context.redirect(config.adminBase, 303)
  })

  app.post("/reps", async (context) => {
    const siteId = siteOf(config, context)
    const db = config.getDb(context)
    const form = await context.req.parseBody()
    const email = textField(form.email).toLowerCase()
    const password = textField(form.password)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return renderAdmin(config, context, { error: "Enter a valid rep email." })
    if (password.length < 10 || password.length > 200) {
      return renderAdmin(config, context, { error: "Rep passwords need at least 10 characters." })
    }
    if (await findRep(db, siteId, email)) return renderAdmin(config, context, { error: "That rep already has a login." })
    await createRep(db, siteId, email, await hashPassword(password), nowOf(config).toISOString())
    return redirectWith(config, context, config.adminBase, { notice: "Rep login created." })
  })

  app.post("/reps/:id/delete", async (context) => {
    const id = context.req.param("id")
    if (!UUID.test(id)) return context.text("Not found", 404)
    await deleteRep(config.getDb(context), siteOf(config, context), id)
    return redirectWith(config, context, config.adminBase, { notice: "Rep login removed." })
  })

  app.post("/invites", async (context) => {
    const siteId = siteOf(config, context)
    const form = await context.req.parseBody()
    const label = clip(textField(form.label), 80)
    const expiry = parseExpiry(textField(form.expiresAt))
    if (typeof expiry === "string") return renderAdmin(config, context, { error: expiry })
    const token = randomToken()
    await createInvite(
      config.getDb(context),
      siteId,
      await sha256Hex(token),
      label,
      expiry,
      nowOf(config).toISOString(),
    )
    const url = `${new URL(context.req.url).origin}${config.repBase}/invite/${token}`
    return redirectWith(config, context, config.adminBase, {
      notice: "Copy this invite link now. It will not be shown again.",
      invite: url,
    })
  })

  app.post("/invites/:id/revoke", async (context) => {
    const id = context.req.param("id")
    if (!UUID.test(id)) return context.text("Not found", 404)
    await revokeInvite(config.getDb(context), siteOf(config, context), id, nowOf(config).toISOString())
    return redirectWith(config, context, config.adminBase, { notice: "Invite revoked." })
  })

  return app
}

async function renderAdmin(config: TrainingConfig, context: Parameters<TrainingConfig["renderPage"]>[0], flash?: TrainingFlash) {
  const siteId = siteOf(config, context)
  const db = config.getDb(context)
  const stored = flash ?? (await config.takeFlash(context)) ?? {}
  return page(config, context, {
    title: "Training library",
    area: "admin",
    body: adminLibrary({
      adminBase: config.adminBase,
      repBase: config.repBase,
      sections: await listLibrary(db, siteId),
      reps: await listReps(db, siteId),
      invites: await listInvites(db, siteId),
      flash: stored,
    }),
  })
}

function parseExpiry(value: string) {
  if (!value) return null
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00Z` : value
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "Use a real expiry time."
  return date.toISOString()
}
