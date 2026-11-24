import { timingSafeEqual } from "./password"

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

function base64UrlToBytes(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (value.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

async function hmac(secret: string, body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body))
  return new Uint8Array(signature)
}

export async function seal(secret: string, claims: Record<string, string>, ttlSeconds: number) {
  const payload = bytesToBase64Url(
    new TextEncoder().encode(
      JSON.stringify({
        ...claims,
        exp: String(Math.floor(Date.now() / 1000) + ttlSeconds),
      }),
    ),
  )
  const signature = bytesToBase64Url(await hmac(secret, payload))
  return `${payload}.${signature}`
}

export async function openSeal(secret: string, token: string | undefined, now = Date.now()) {
  if (!secret || secret.length < 16 || !token) return null
  const [payload, signature] = token.split(".")
  if (!payload || !signature || token.split(".").length !== 2) return null
  const expected = await hmac(secret, payload)
  let actual: Uint8Array
  try {
    actual = base64UrlToBytes(signature)
  } catch {
    return null
  }
  if (!timingSafeEqual(actual, expected)) return null
  try {
    const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as Record<string, unknown>
    const exp = Number(claims.exp)
    if (!Number.isFinite(exp) || exp * 1000 <= now) return null
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(claims)) {
      if (typeof value === "string") result[key] = value
    }
    return result
  } catch {
    return null
  }
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function randomToken() {
  return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32)))
}
