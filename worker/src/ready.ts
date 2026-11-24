import { industries } from "../../data/industries"
import { locations } from "../../data/locations"
import { hashPassword } from "../../packages/training-library/src/password"
import type { Env } from "./env"

function catalogToken() {
  return `${locations.map((location) => location.slug).join(".")}|${industries.map((industry) => industry.slug).join(".")}`
}

async function seedCatalog(db: D1Database) {
  const token = catalogToken()
  const current = await db.prepare("SELECT value FROM app_meta WHERE key = 'catalog'").first<{ value: string }>()
  if (current?.value === token) return
  const statements: D1PreparedStatement[] = []
  locations.forEach((location, index) => {
    statements.push(
      db
        .prepare(
          `INSERT INTO locations (slug, city, state, state_name, county, filter_group, is_fiber_market, fiber_tier, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(slug) DO UPDATE SET city = excluded.city, state = excluded.state, state_name = excluded.state_name,
             county = excluded.county, filter_group = excluded.filter_group, is_fiber_market = excluded.is_fiber_market,
             fiber_tier = excluded.fiber_tier, sort_order = excluded.sort_order`,
        )
        .bind(
          location.slug,
          location.city,
          location.state,
          location.stateName,
          location.county,
          location.filterGroup,
          location.isFiberMarket ? 1 : 0,
          location.fiberTier,
          index,
        ),
    )
  })
  industries.forEach((industry, index) => {
    statements.push(
      db
        .prepare(
          `INSERT INTO industries (slug, name, geo_prefix, sort_order) VALUES (?, ?, ?, ?)
           ON CONFLICT(slug) DO UPDATE SET name = excluded.name, geo_prefix = excluded.geo_prefix, sort_order = excluded.sort_order`,
        )
        .bind(industry.slug, industry.name, industry.geoPrefix, index),
    )
  })
  statements.push(
    db.prepare("INSERT INTO app_meta (key, value) VALUES ('catalog', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(token),
  )
  for (let index = 0; index < statements.length; index += 40) {
    await db.batch(statements.slice(index, index + 40))
  }
}

async function seedAdmin(env: Env) {
  if ((env.ADMIN_SESSION_SECRET ?? "").length < 16) return "Set ADMIN_SESSION_SECRET to at least 16 characters."
  const existing = await env.DB.prepare("SELECT id FROM admins WHERE id = 'primary'").first()
  if (existing) return null
  const password = env.ADMIN_PASSWORD ?? ""
  if (password.length < 10) return "Set ADMIN_PASSWORD to at least 10 characters. It is hashed into D1 on first boot."
  await env.DB
    .prepare("INSERT INTO admins (id, password_hash, created_at) VALUES ('primary', ?, ?) ON CONFLICT(id) DO NOTHING")
    .bind(await hashPassword(password), new Date().toISOString())
    .run()
  return null
}

export async function ensureReady(env: Env) {
  try {
    await seedCatalog(env.DB)
    return await seedAdmin(env)
  } catch (error) {
    console.error(error)
    return "Database tables are missing. Apply the D1 migrations."
  }
}
