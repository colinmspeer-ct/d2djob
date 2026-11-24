import "server-only";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { databasePath } from "./paths";
import { ensureStaff, seedIfEmpty } from "./seed";

const globalForDb = globalThis as unknown as { swyftDb?: DatabaseSync };

function openDatabase() {
  const file = databasePath();
  mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA foreign_keys = ON");
  db.exec("PRAGMA journal_mode = WAL");
  db.exec(readFileSync(path.join(process.cwd(), "d1/0001_init.sql"), "utf8"));
  ensureStaff(db);
  seedIfEmpty(db);
  return db;
}

export function getDb() {
  if (!globalForDb.swyftDb) globalForDb.swyftDb = openDatabase();
  return globalForDb.swyftDb;
}
