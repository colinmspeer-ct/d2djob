import "server-only"
import { mkdir, rm } from "fs/promises"
import path from "path"
import sharp from "sharp"

export async function storeCandidatePhoto(id: string, file: File) {
  if (file.size === 0) return { ok: true as const, empty: true as const }
  if (file.size > 2_000_000) return { ok: false as const, error: "Photo must be under 2 MB." }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { ok: false as const, error: "Use a JPEG, PNG, or WebP." }
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const relative = `originals/${id}.jpg`
  const originalPath = path.join(process.cwd(), "storage", relative)
  const publicPath = path.join(process.cwd(), "public", "media", `${id}.jpg`)
  await mkdir(path.dirname(originalPath), { recursive: true })
  await mkdir(path.dirname(publicPath), { recursive: true })

  try {
    await sharp(bytes).rotate().jpeg({ quality: 86 }).toFile(originalPath)
    await sharp(bytes)
      .rotate()
      .resize(640, 640, { fit: "cover" })
      .blur(36)
      .jpeg({ quality: 68 })
      .toFile(publicPath)
  } catch {
    return { ok: false as const, error: "That image could not be processed." }
  }

  return {
    ok: true as const,
    empty: false as const,
    photoOriginal: relative,
    photoPublic: `/media/${id}.jpg`,
  }
}

export async function removeCandidatePhoto(photoOriginal: string | null) {
  if (photoOriginal && /^originals\/[a-z0-9]+\.jpg$/i.test(photoOriginal)) {
    await rm(path.join(process.cwd(), "storage", photoOriginal), { force: true })
  }
}
