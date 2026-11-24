import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { openSeal, seal } from "../../packages/training-library/src/session"
import type { TrainingFlash } from "../../packages/training-library/src/types"
import type { AppContext } from "./env"
import { secureRequest, sessionSecret } from "./env"

const ADMIN_COOKIE = "d2d_admin"
const FLASH_COOKIE = "d2d_flash"

function cookieBase(context: AppContext, path: string, maxAge: number) {
  return {
    httpOnly: true,
    secure: secureRequest(context.req.url),
    sameSite: "Lax" as const,
    path,
    maxAge,
  }
}

export async function readAdmin(context: AppContext) {
  const secret = sessionSecret(context.env)
  const claims = await openSeal(secret, getCookie(context, ADMIN_COOKIE))
  return claims?.role === "admin"
}

export async function setAdminCookie(context: AppContext) {
  const token = await seal(sessionSecret(context.env), { role: "admin" }, 60 * 60 * 24 * 7)
  setCookie(context, ADMIN_COOKIE, token, cookieBase(context, "/", 60 * 60 * 24 * 7))
}

export function clearAdminCookie(context: AppContext) {
  deleteCookie(context, ADMIN_COOKIE, { path: "/", secure: secureRequest(context.req.url), sameSite: "Lax" })
}

export async function setFlash(context: AppContext, flash: TrainingFlash) {
  const token = await seal(sessionSecret(context.env), { data: JSON.stringify(flash) }, 120)
  setCookie(context, FLASH_COOKIE, token, cookieBase(context, "/admin", 120))
}

export async function takeFlash(context: AppContext) {
  const token = getCookie(context, FLASH_COOKIE)
  if (!token) return null
  deleteCookie(context, FLASH_COOKIE, { path: "/admin", secure: secureRequest(context.req.url), sameSite: "Lax" })
  const claims = await openSeal(sessionSecret(context.env), token)
  if (!claims?.data) return null
  try {
    const parsed = JSON.parse(claims.data) as TrainingFlash
    if (!parsed || typeof parsed !== "object") return null
    return parsed
  } catch {
    return null
  }
}

export function clientIp(context: AppContext) {
  return context.req.header("cf-connecting-ip") || context.req.header("x-forwarded-for")?.split(",")[0]?.trim() || "local"
}
