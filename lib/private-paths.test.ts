import assert from "node:assert/strict"
import test from "node:test"
import { isPrivatePath, PRIVATE_PREFIXES } from "./private-paths.ts"

test("admin, training, and the library alias are private", () => {
  assert.deepEqual([...PRIVATE_PREFIXES], ["/admin", "/training", "/library"])
  assert.equal(isPrivatePath("/admin"), true)
  assert.equal(isPrivatePath("/admin/training"), true)
  assert.equal(isPrivatePath("/training/files/abc"), true)
  assert.equal(isPrivatePath("/library"), true)
  assert.equal(isPrivatePath("/jobs"), false)
  assert.equal(isPrivatePath("/candidates/marcus-r"), false)
  assert.equal(isPrivatePath("/administrative"), false)
})
