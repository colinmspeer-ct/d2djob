import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import type { Sql } from "./types";

function args(params: unknown[] = []): SQLInputValue[] {
  return params.map((value) => {
    if (value == null) return null;
    if (typeof value === "number" || typeof value === "string" || typeof value === "bigint") return value;
    if (value instanceof Uint8Array) return value;
    throw new Error("Unsupported SQL parameter.");
  });
}

export function sqliteSql(db: DatabaseSync): Sql {
  return {
    async exec(sql) {
      db.exec(sql);
    },
    async all<T>(sql: string, params: unknown[] = []) {
      return db.prepare(sql).all(...args(params)) as T[];
    },
    async get<T>(sql: string, params: unknown[] = []) {
      return db.prepare(sql).get(...args(params)) as T | undefined;
    },
    async run(sql, params = []) {
      db.prepare(sql).run(...args(params));
    },
    async transaction(fn) {
      db.exec("BEGIN");
      try {
        const result = await fn();
        db.exec("COMMIT");
        return result;
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    },
  };
}

export function openMemoryDatabase() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  return db;
}
