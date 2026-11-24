import assert from "node:assert/strict"
import test from "node:test"
import { hashPassword, verifyPassword } from "./password.ts"
import { openSeal, seal } from "./session.ts"
import { escapeHtml } from "./html.ts"

const secret = "local-session-secret-change-me"

test("password hash verifies only the same password", async () => {
  const stored = await hashPassword("local-desk")
  assert.equal(stored.startsWith("pbkdf2-sha256$"), true)
  assert.equal(stored.includes("local-desk"), false)
  assert.equal(await verifyPassword("local-desk", stored), true)
  assert.equal(await verifyPassword("local-desks", stored), false)
  assert.equal(await verifyPassword("local-desk", "pbkdf2-sha256$1$aaaa$bbbb"), false)
})

test("session token expires and rejects tampering", async () => {
  const token = await seal(secret, { role: "admin" }, 60)
  assert.equal((await openSeal(secret, token))?.role, "admin")
  assert.equal(await openSeal(secret, token, Date.now() + 120_000), null)
  const [payload, signature] = token.split(".")
  assert.equal(await openSeal(secret, `${payload}.${signature.slice(0, -2)}aa`), null)
  assert.equal(await openSeal("different-session-secret", token), null)
  assert.equal(await openSeal("short", token), null)
})

test("html escape covers quotes and tags", () => {
  assert.equal(escapeHtml(`<a href="x?a=1&b=2">'ok'</a>`), "&lt;a href=&quot;x?a=1&amp;b=2&quot;&gt;&#39;ok&#39;&lt;/a&gt;")
})
