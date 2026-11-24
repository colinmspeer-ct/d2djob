import { nextLockout } from "./files"
import type { InviteRow, ItemRow, RepRow, SectionRow, SqlDatabase } from "./types"

function rows<T>(result: { results?: T[] }) {
  return result.results ?? []
}

export function trainingObjectKey(siteId: string, itemId: string, fileName: string) {
  return `sites/${siteId}/training/${itemId}/${fileName}`
}

export function validSiteId(siteId: string) {
  return /^[a-z0-9-]{2,40}$/.test(siteId)
}

export async function listLibrary(db: SqlDatabase, siteId: string) {
  const sections = rows(
    await db
      .prepare(
        "SELECT id, site_id, title, description, sort_order, created_at, updated_at FROM training_sections WHERE site_id = ? ORDER BY sort_order ASC, title ASC",
      )
      .bind(siteId)
      .all<SectionRow>(),
  )
  const items = rows(
    await db
      .prepare(
        "SELECT id, site_id, section_id, title, description, kind, external_url, object_key, file_name, content_type, byte_size, sort_order, created_at, updated_at FROM training_items WHERE site_id = ? ORDER BY sort_order ASC, title ASC",
      )
      .bind(siteId)
      .all<ItemRow>(),
  )
  return sections.map((section) => ({
    ...section,
    items: items.filter((item) => item.section_id === section.id),
  }))
}

export async function createSection(db: SqlDatabase, siteId: string, title: string, description: string, now: string) {
  const id = crypto.randomUUID()
  const max = await db
    .prepare("SELECT COALESCE(MAX(sort_order), -1) AS n FROM training_sections WHERE site_id = ?")
    .bind(siteId)
    .first<{ n: number }>()
  await db
    .prepare(
      "INSERT INTO training_sections (id, site_id, title, description, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(id, siteId, title, description, (max?.n ?? -1) + 1, now, now)
    .run()
  return id
}

export async function updateSection(db: SqlDatabase, siteId: string, id: string, title: string, description: string, now: string) {
  await db
    .prepare("UPDATE training_sections SET title = ?, description = ?, updated_at = ? WHERE site_id = ? AND id = ?")
    .bind(title, description, now, siteId, id)
    .run()
}

export async function deleteSection(db: SqlDatabase, siteId: string, id: string) {
  const items = rows(
    await db
      .prepare("SELECT object_key FROM training_items WHERE site_id = ? AND section_id = ?")
      .bind(siteId, id)
      .all<{ object_key: string | null }>(),
  )
  await db.batch([
    db.prepare("DELETE FROM training_items WHERE site_id = ? AND section_id = ?").bind(siteId, id),
    db.prepare("DELETE FROM training_sections WHERE site_id = ? AND id = ?").bind(siteId, id),
  ])
  return items.map((item) => item.object_key).filter((key): key is string => Boolean(key))
}

async function reorder(db: SqlDatabase, siteId: string, ids: string[], table: "training_sections" | "training_items", now: string) {
  await db.batch(
    ids.map((id, index) =>
      db
        .prepare(`UPDATE ${table} SET sort_order = ?, updated_at = ? WHERE site_id = ? AND id = ?`)
        .bind(index, now, siteId, id),
    ),
  )
}

export async function moveSection(db: SqlDatabase, siteId: string, id: string, direction: "up" | "down", now: string) {
  const current = rows(
    await db
      .prepare("SELECT id FROM training_sections WHERE site_id = ? ORDER BY sort_order ASC, title ASC")
      .bind(siteId)
      .all<{ id: string }>(),
  ).map((row) => row.id)
  await moveId(db, siteId, current, id, direction, "training_sections", now)
}

export async function moveItem(db: SqlDatabase, siteId: string, id: string, direction: "up" | "down", now: string) {
  const item = await getItem(db, siteId, id)
  if (!item) return
  const current = rows(
    await db
      .prepare("SELECT id FROM training_items WHERE site_id = ? AND section_id = ? ORDER BY sort_order ASC, title ASC")
      .bind(siteId, item.section_id)
      .all<{ id: string }>(),
  ).map((row) => row.id)
  await moveId(db, siteId, current, id, direction, "training_items", now)
}

async function moveId(
  db: SqlDatabase,
  siteId: string,
  current: string[],
  id: string,
  direction: "up" | "down",
  table: "training_sections" | "training_items",
  now: string,
) {
  const index = current.indexOf(id)
  const target = direction === "up" ? index - 1 : index + 1
  if (index < 0 || target < 0 || target >= current.length) return
  const next = current.slice()
  const [row] = next.splice(index, 1)
  next.splice(target, 0, row!)
  await reorder(db, siteId, next, table, now)
}

export async function getSection(db: SqlDatabase, siteId: string, id: string) {
  return db
    .prepare("SELECT id FROM training_sections WHERE site_id = ? AND id = ?")
    .bind(siteId, id)
    .first<{ id: string }>()
}

export async function getItem(db: SqlDatabase, siteId: string, id: string) {
  return db
    .prepare(
      "SELECT id, site_id, section_id, title, description, kind, external_url, object_key, file_name, content_type, byte_size, sort_order, created_at, updated_at FROM training_items WHERE site_id = ? AND id = ?",
    )
    .bind(siteId, id)
    .first<ItemRow>()
}

export async function createItem(
  db: SqlDatabase,
  siteId: string,
  input: {
    id?: string
    sectionId: string
    title: string
    description: string
    kind: string
    externalUrl: string | null
    objectKey: string | null
    fileName: string | null
    contentType: string | null
    byteSize: number | null
    now: string
  },
) {
  const id = input.id ?? crypto.randomUUID()
  const max = await db
    .prepare("SELECT COALESCE(MAX(sort_order), -1) AS n FROM training_items WHERE site_id = ? AND section_id = ?")
    .bind(siteId, input.sectionId)
    .first<{ n: number }>()
  await db
    .prepare(
      `INSERT INTO training_items (
        id, site_id, section_id, title, description, kind, external_url, object_key, file_name, content_type, byte_size, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      siteId,
      input.sectionId,
      input.title,
      input.description,
      input.kind,
      input.externalUrl,
      input.objectKey,
      input.fileName,
      input.contentType,
      input.byteSize,
      (max?.n ?? -1) + 1,
      input.now,
      input.now,
    )
    .run()
  return id
}

export async function deleteItem(db: SqlDatabase, siteId: string, id: string) {
  const item = await getItem(db, siteId, id)
  if (!item) return null
  await db.prepare("DELETE FROM training_items WHERE site_id = ? AND id = ?").bind(siteId, id).run()
  return item.object_key
}

export async function listReps(db: SqlDatabase, siteId: string) {
  return rows(
    await db
      .prepare("SELECT id, email, created_at FROM training_reps WHERE site_id = ? ORDER BY email ASC")
      .bind(siteId)
      .all<{ id: string; email: string; created_at: string }>(),
  )
}

export async function findRep(db: SqlDatabase, siteId: string, email: string) {
  return db
    .prepare("SELECT id, site_id, email, password_hash, created_at FROM training_reps WHERE site_id = ? AND email = ?")
    .bind(siteId, email)
    .first<RepRow>()
}

export async function createRep(db: SqlDatabase, siteId: string, email: string, passwordHash: string, now: string) {
  const id = crypto.randomUUID()
  await db
    .prepare("INSERT INTO training_reps (id, site_id, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(id, siteId, email, passwordHash, now)
    .run()
  return id
}

export async function deleteRep(db: SqlDatabase, siteId: string, id: string) {
  await db.prepare("DELETE FROM training_reps WHERE site_id = ? AND id = ?").bind(siteId, id).run()
}

export async function listInvites(db: SqlDatabase, siteId: string) {
  return rows(
    await db
      .prepare(
        "SELECT id, label, expires_at, revoked_at, created_at FROM training_invites WHERE site_id = ? ORDER BY created_at DESC",
      )
      .bind(siteId)
      .all<{ id: string; label: string; expires_at: string | null; revoked_at: string | null; created_at: string }>(),
  )
}

export async function createInvite(db: SqlDatabase, siteId: string, tokenHash: string, label: string, expiresAt: string | null, now: string) {
  const id = crypto.randomUUID()
  await db
    .prepare(
      "INSERT INTO training_invites (id, site_id, token_hash, label, expires_at, revoked_at, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?)",
    )
    .bind(id, siteId, tokenHash, label, expiresAt, now)
    .run()
  return id
}

export async function findInvite(db: SqlDatabase, tokenHash: string) {
  return db
    .prepare(
      "SELECT id, site_id, token_hash, label, expires_at, revoked_at, created_at FROM training_invites WHERE token_hash = ?",
    )
    .bind(tokenHash)
    .first<InviteRow>()
}

export async function revokeInvite(db: SqlDatabase, siteId: string, id: string, now: string) {
  await db
    .prepare("UPDATE training_invites SET revoked_at = ? WHERE site_id = ? AND id = ? AND revoked_at IS NULL")
    .bind(now, siteId, id)
    .run()
}

export async function attemptState(db: SqlDatabase, bucket: string, nowIso: string) {
  const row = await db
    .prepare("SELECT failures, locked_until FROM auth_attempts WHERE bucket = ?")
    .bind(bucket)
    .first<{ failures: number; locked_until: string | null }>()
  if (!row) return { failures: 0, locked: false }
  if (row.locked_until && row.locked_until > nowIso) return { failures: row.failures, locked: true }
  if (row.locked_until) return { failures: 0, locked: false }
  return { failures: row.failures, locked: false }
}

export async function recordFailure(db: SqlDatabase, bucket: string, now: number) {
  const state = await attemptState(db, bucket, new Date(now).toISOString())
  const next = nextLockout(state.failures, now)
  await db
    .prepare(
      "INSERT INTO auth_attempts (bucket, failures, locked_until) VALUES (?, ?, ?) ON CONFLICT(bucket) DO UPDATE SET failures = excluded.failures, locked_until = excluded.locked_until",
    )
    .bind(bucket, next.failures, next.lockedUntil)
    .run()
  return next
}

export async function clearAttempts(db: SqlDatabase, bucket: string) {
  await db.prepare("DELETE FROM auth_attempts WHERE bucket = ?").bind(bucket).run()
}

export async function bumpCounter(db: SqlDatabase, bucket: string, max: number) {
  const row = await db.prepare("SELECT failures FROM auth_attempts WHERE bucket = ?").bind(bucket).first<{ failures: number }>()
  const count = (row?.failures ?? 0) + 1
  await db
    .prepare(
      "INSERT INTO auth_attempts (bucket, failures, locked_until) VALUES (?, ?, NULL) ON CONFLICT(bucket) DO UPDATE SET failures = excluded.failures",
    )
    .bind(bucket, count)
    .run()
  return count <= max
}
