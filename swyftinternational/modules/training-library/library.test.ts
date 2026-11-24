import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { TrainingError, applyTrainingSchema, createTrainingLibrary, memoryStorage, prepareAsset } from "./index";
import { TRAINING_SCHEMA } from "./schema";
import { openMemoryDatabase, sqliteSql } from "./sqlite";

test("sections stay inside their site", async () => {
  const db = sqliteSql(openMemoryDatabase());
  await applyTrainingSchema(db);
  const swyft = createTrainingLibrary(db, memoryStorage(), { site: "swyftinternational" });
  const d2d = createTrainingLibrary(db, memoryStorage(), { site: "d2djob" });
  await swyft.createSection({ title: "First week", description: "Preview" });
  assert.equal((await swyft.listSections()).length, 1);
  assert.equal((await d2d.listSections()).length, 0);
  assert.equal((await d2d.getSectionBySlug("first-week")), null);
});

test("uploads reject the wrong type, http links, and oversized files", async () => {
  const db = sqliteSql(openMemoryDatabase());
  await applyTrainingSchema(db);
  const files = memoryStorage();
  const library = createTrainingLibrary(db, files, { site: "swyftinternational", limits: { video: 4 } });
  const section = await library.createSection({ title: "Desk" });
  await assert.rejects(
    () =>
      library.addAsset({
        sectionId: section.id,
        title: "Clip",
        kind: "video",
        file: { filename: "notes.txt", mime: "text/plain", bytes: new Uint8Array([1, 2, 3]) },
      }),
    TrainingError,
  );
  await assert.rejects(
    () =>
      library.addAsset({
        sectionId: section.id,
        title: "Too big",
        kind: "video",
        file: { filename: "clip.mp4", mime: "video/mp4", bytes: new Uint8Array([1, 2, 3, 4, 5]) },
      }),
    TrainingError,
  );
  assert.throws(() => prepareAsset({ sectionId: "x", title: "Off site", kind: "link", externalUrl: "http://example.com" }), TrainingError);
  const asset = await library.addAsset({
    sectionId: section.id,
    title: "Notes",
    kind: "doc",
    file: { filename: "../../etc/passwd.txt", mime: "text/plain", bytes: new Uint8Array([65]) },
  });
  assert.equal(asset.filename, "passwd.txt");
  assert.equal(asset.storageKey?.includes(".."), false);
  const stored = await library.readAsset(asset.id);
  assert.equal(stored?.bytes?.[0], 65);
});

test("the D1 migration contains the shared training tables", () => {
  const file = readFileSync(path.join(process.cwd(), "d1/0001_init.sql"), "utf8");
  const compact = (sql: string) => sql.replace(/\s+/g, " ").trim();
  assert.equal(compact(file).includes(compact(TRAINING_SCHEMA)), true);
  assert.equal(file.includes("CREATE TABLE IF NOT EXISTS candidate"), true);
});
