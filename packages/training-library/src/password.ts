const PREFIX = "pbkdf2-sha256"
const ITERATIONS = 100_000

function bytesToBase64(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64ToBytes(value: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

export function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  const length = Math.max(left.length, right.length)
  let diff = left.length ^ right.length
  for (let index = 0; index < length; index += 1) {
    diff |= (left[index] ?? 0) ^ (right[index] ?? 0)
  }
  return diff === 0
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    256,
  )
  return new Uint8Array(bits)
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await pbkdf2(password, salt, ITERATIONS)
  return `${PREFIX}$${ITERATIONS}$${bytesToBase64(salt)}$${bytesToBase64(hash)}`
}

export async function verifyPassword(password: string, stored: string) {
  const [prefix, rounds, salt, hash] = stored.split("$")
  const iterations = Number(rounds)
  if (prefix !== PREFIX || !salt || !hash || !Number.isInteger(iterations) || iterations < 100_000 || iterations > 500_000) {
    await pbkdf2(password, new Uint8Array(16), ITERATIONS)
    return false
  }
  const actual = await pbkdf2(password, base64ToBytes(salt), iterations)
  return timingSafeEqual(actual, base64ToBytes(hash))
}
