import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ObjectStorage } from "./types";

export function nodeFileStorage(root: string): ObjectStorage {
  const base = path.resolve(root);
  function full(key: string) {
    if (!key || key.includes("..") || path.isAbsolute(key)) throw new Error("Bad storage key.");
    const dest = path.resolve(base, key);
    if (dest !== base && !dest.startsWith(base + path.sep)) throw new Error("Bad storage key.");
    return dest;
  }
  return {
    async put(key, bytes) {
      const dest = full(key);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, bytes);
    },
    async get(key) {
      try {
        return new Uint8Array(await readFile(full(key)));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
      }
    },
    async delete(key) {
      await rm(full(key), { force: true });
    },
  };
}
