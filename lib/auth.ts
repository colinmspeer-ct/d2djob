import "server-only"
import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

const COOKIE = "d2d_desk"

export function sessionConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 16)
}

function sign(payload: string) {
  const secret = process.env.ADMIN_SESSION_SECRET ?? ""
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

export function passwordsMatch(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? ""
  const left = Buffer.from(input)
  const right = Buffer.from(expected)
  if (left.length === 0 || left.length !== right.length) {
    const filler = Buffer.alloc(32)
    timingSafeEqual(filler, filler)
    return false
  }
  return timingSafeEqual(left, right)
}

export async function getSession() {
  if (!sessionConfigured()) return false
  const jar = await cookies()
  const raw = jar.get(COOKIE)?.value
  if (!raw) return false
  const [payload, signature] = raw.split(".")
  if (payload !== "admin" || !signature) return false
  const expected = sign(payload)
  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export async function setSessionCookie() {
  const payload = "admin"
  const token = `${payload}.${sign(payload)}`
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https"),
  })
}

export async function clearSessionCookie() {
  const jar = await cookies()
  jar.delete(COOKIE)
}
