import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("the D1 migration contains the reusable training schema", () => {
  const schema = fs.readFileSync(new URL("../schema.sql", import.meta.url), "utf8").trim()
  const migration = fs.readFileSync(new URL("../../../worker/migrations/0001_init.sql", import.meta.url), "utf8")
  assert.ok(migration.includes(schema))
  assert.match(schema, /site_id TEXT NOT NULL/)
  assert.match(schema, /training_sections/)
  assert.match(schema, /training_items/)
  assert.match(schema, /training_reps/)
  assert.match(schema, /training_invites/)
})
