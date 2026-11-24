export const UPLOAD_LIMITS = {
  image: 8 * 1024 * 1024,
  pdf: 25 * 1024 * 1024,
  doc: 25 * 1024 * 1024,
  video: 80 * 1024 * 1024,
} as const

export const MAX_BODY_BYTES = 84 * 1024 * 1024

export type UploadKind = keyof typeof UPLOAD_LIMITS

const EXTENSIONS: Record<UploadKind, string[]> = {
  image: ["jpg", "jpeg", "png", "webp", "gif"],
  pdf: ["pdf"],
  doc: ["pdf", "doc", "docx", "txt", "md"],
  video: ["mp4", "webm", "mov"],
}

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
}

export type InspectedFile = {
  ok: true
  contentType: string
  extension: string
  byteSize: number
}

export type InspectFailure = { ok: false; error: string }

export function extensionOf(fileName: string) {
  const base = fileName.split(/[/\\]/).pop() ?? ""
  const dot = base.lastIndexOf(".")
  if (dot <= 0) return ""
  return base.slice(dot + 1).toLowerCase()
}

export function safeFileName(fileName: string, extension: string) {
  const base = (fileName.split(/[/\\]/).pop() ?? "file").replace(/\.[^.]+$/, "")
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file"
  return `${cleaned}.${extension}`
}

function startsWith(bytes: Uint8Array, signature: number[]) {
  if (bytes.length < signature.length) return false
  return signature.every((byte, index) => bytes[index] === byte)
}

function asciiAt(bytes: Uint8Array, offset: number, text: string) {
  if (bytes.length < offset + text.length) return false
  for (let index = 0; index < text.length; index += 1) {
    if (bytes[offset + index] !== text.charCodeAt(index)) return false
  }
  return true
}

function isUtf8Text(bytes: Uint8Array) {
  const sample = bytes.subarray(0, Math.min(bytes.length, 8192))
  if (sample.includes(0)) return false
  try {
    new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(sample)
    return true
  } catch {
    return false
  }
}

function sniffedExtension(bytes: Uint8Array, extension: string): string | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return extension === "jpg" || extension === "jpeg" ? extension : "jpg"
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47])) return "png"
  if (asciiAt(bytes, 0, "GIF87a") || asciiAt(bytes, 0, "GIF89a")) return "gif"
  if (asciiAt(bytes, 0, "RIFF") && asciiAt(bytes, 8, "WEBP")) return "webp"
  if (asciiAt(bytes, 0, "%PDF")) return "pdf"
  if (startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0])) return "doc"
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) || startsWith(bytes, [0x50, 0x4b, 0x05, 0x06])) return "docx"
  if (asciiAt(bytes, 4, "ftyp")) return extension === "mov" ? "mov" : "mp4"
  if (startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3])) return "webm"
  if (isUtf8Text(bytes) && (extension === "txt" || extension === "md")) return extension
  return null
}

export function inspectUpload(
  bytes: Uint8Array,
  fileName: string,
  kind: string,
  options?: { extensions?: readonly string[] },
): InspectedFile | InspectFailure {
  if (!(kind in UPLOAD_LIMITS)) return { ok: false, error: "Choose a file type." }
  const uploadKind = kind as UploadKind
  if (bytes.byteLength === 0) return { ok: false, error: "That file is empty." }
  if (bytes.byteLength > UPLOAD_LIMITS[uploadKind]) {
    const limit = Math.round(UPLOAD_LIMITS[uploadKind] / (1024 * 1024))
    return { ok: false, error: `That ${uploadKind} file is over the ${limit} MB limit.` }
  }
  const extension = extensionOf(fileName)
  const allowed = options?.extensions ?? EXTENSIONS[uploadKind]
  if (!allowed.includes(extension)) {
    return { ok: false, error: `Use a ${allowed.join(", ")} file.` }
  }
  const sniffed = sniffedExtension(bytes, extension)
  if (!sniffed || !allowed.includes(sniffed) || (sniffed !== extension && !(sniffed === "jpg" && extension === "jpeg"))) {
    return { ok: false, error: "The file contents do not match its type." }
  }
  if ((extension === "mp4" || extension === "mov" || extension === "webm") && sniffed !== extension && sniffed !== "mp4") {
    return { ok: false, error: "The file contents do not match its type." }
  }
  if (extension === "mov" && sniffed !== "mov") return { ok: false, error: "The file contents do not match its type." }
  if (extension === "webm" && sniffed !== "webm") return { ok: false, error: "The file contents do not match its type." }
  if (extension === "mp4" && sniffed !== "mp4") return { ok: false, error: "The file contents do not match its type." }
  return {
    ok: true,
    contentType: CONTENT_TYPES[extension] ?? "application/octet-stream",
    extension,
    byteSize: bytes.byteLength,
  }
}

export function inspectLink(value: string): { ok: true; url: string } | InspectFailure {
  let url: URL
  try {
    url = new URL(value.trim())
  } catch {
    return { ok: false, error: "Enter a full link, including https://." }
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, error: "Links need to start with http:// or https://." }
  }
  if (url.username || url.password) return { ok: false, error: "Remove the username and password from that link." }
  if (!url.hostname.includes(".")) return { ok: false, error: "That link needs a full host name." }
  return { ok: true, url: url.toString() }
}

export function contentDisposition(contentType: string, fileName: string) {
  const inline = contentType.startsWith("image/") || contentType.startsWith("video/") || contentType === "application/pdf"
  const safe = fileName.replace(/["\r\n]/g, "")
  return `${inline ? "inline" : "attachment"}; filename="${safe}"`
}

export function nextLockout(failures: number, now: number) {
  const count = failures + 1
  return {
    failures: count,
    lockedUntil: count >= 5 ? new Date(now + 15 * 60 * 1000).toISOString() : null,
  }
}
