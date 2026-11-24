import assert from "node:assert/strict"
import test from "node:test"
import { inspectLink, inspectUpload, nextLockout, UPLOAD_LIMITS } from "./files.ts"

const png = Uint8Array.from(Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
))

test("accepts a real PNG and rejects a renamed one", () => {
  const ok = inspectUpload(png, "plot.png", "image")
  assert.equal(ok.ok, true)
  if (ok.ok) assert.equal(ok.contentType, "image/png")
  const renamed = inspectUpload(png, "plot.exe", "image")
  assert.equal(renamed.ok, false)
  const lying = inspectUpload(png, "notes.pdf", "pdf")
  assert.equal(lying.ok, false)
})

test("accepts pdf, text, docx, and mp4 signatures", () => {
  const pdf = inspectUpload(new TextEncoder().encode("%PDF-1.4\n1 0 obj<<>>endobj\n%%EOF"), "lesson.pdf", "pdf")
  assert.equal(pdf.ok, true)
  const note = inspectUpload(new TextEncoder().encode("# Week one\nStay on the route.\n"), "week.md", "doc")
  assert.equal(note.ok, true)
  const docx = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0, 0, 0, 0])
  assert.equal(inspectUpload(docx, "script.docx", "doc").ok, true)
  const mp4 = new Uint8Array(16)
  mp4.set([0x66, 0x74, 0x79, 0x70], 4)
  const video = inspectUpload(mp4, "door.mp4", "video")
  assert.equal(video.ok, true)
  if (video.ok) assert.equal(video.contentType, "video/mp4")
})

test("rejects oversized files, html disguised as an image, and unsafe links", () => {
  const huge = new Uint8Array(UPLOAD_LIMITS.image + 1)
  huge.set(png, 0)
  const over = inspectUpload(huge, "big.png", "image")
  assert.equal(over.ok, false)
  if (!over.ok) assert.match(over.error, /8 MB/)
  const html = inspectUpload(new TextEncoder().encode("<html><script>alert(1)</script></html>"), "pic.png", "image")
  assert.equal(html.ok, false)
  assert.equal(inspectLink("javascript:alert(1)").ok, false)
  assert.equal(inspectLink("https://user:pass@example.com/a").ok, false)
  const link = inspectLink("https://training.example.com/week-1")
  assert.equal(link.ok, true)
  if (link.ok) assert.equal(link.url, "https://training.example.com/week-1")
})

test("locks a login after five failures", () => {
  const now = Date.parse("2026-11-24T12:00:00Z")
  assert.equal(nextLockout(3, now).lockedUntil, null)
  const locked = nextLockout(4, now)
  assert.equal(locked.failures, 5)
  assert.equal(locked.lockedUntil, "2026-11-24T12:15:00.000Z")
})
