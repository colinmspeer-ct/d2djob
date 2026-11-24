import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { ensureStaff, seedIfEmpty } from "./seed";

test("the seeded desk is six fictional Egypt and Belize profiles", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "swyft-"));
  const previous = process.env.MEDIA_PATH;
  process.env.MEDIA_PATH = path.join(dir, "objects");
  const env = {
    ADMIN_EMAIL: "desk@swyftinternational.example",
    ADMIN_PASSWORD: "local-desk",
    LIBRARY_EMAIL: "library@swyftinternational.example",
    LIBRARY_PASSWORD: "local-library",
    SAMPLE_SHORTLIST_TOKEN: "harbor-demo",
  };
  try {
    const db = new DatabaseSync(path.join(dir, "swyft.db"));
    db.exec("PRAGMA foreign_keys = ON");
    db.exec(readFileSync(path.join(process.cwd(), "d1/0001_init.sql"), "utf8"));
    ensureStaff(db, env);
    seedIfEmpty(db, env);
    const countries = db.prepare(`SELECT country FROM candidate ORDER BY id`).all() as { country: string }[];
    assert.deepEqual(countries.map((row) => row.country).sort(), ["BZ", "BZ", "BZ", "EG", "EG", "EG"]);
    const shortlist = db.prepare(`SELECT token, is_published FROM shortlist`).get() as { token: string; is_published: number };
    assert.equal(shortlist.token, "harbor-demo");
    assert.equal(shortlist.is_published, 1);
    const assets = db.prepare(`SELECT COUNT(*) AS n FROM training_asset WHERE site = 'swyftinternational'`).get() as { n: number };
    assert.equal(Number(assets.n), 2);
    const leaked = db.prepare(`SELECT summary FROM candidate WHERE summary LIKE '%@%'`).all();
    assert.equal(leaked.length, 0);
  } finally {
    if (previous == null) delete process.env.MEDIA_PATH;
    else process.env.MEDIA_PATH = previous;
  }
});
