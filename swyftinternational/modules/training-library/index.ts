import { TRAINING_SCHEMA } from "./schema";
import {
  ASSET_KINDS,
  DEFAULT_LIMITS,
  type AssetFile,
  type AssetKind,
  type Limits,
  type NewAsset,
  type ObjectStorage,
  type SectionWithAssets,
  type Sql,
  type TrainingAsset,
  type TrainingSection,
} from "./types";

export { TRAINING_SCHEMA } from "./schema";
export { DEFAULT_LIMITS, ASSET_KINDS };
export type {
  AssetFile,
  AssetKind,
  Limits,
  NewAsset,
  ObjectStorage,
  SectionWithAssets,
  Sql,
  TrainingAsset,
  TrainingSection,
};

export class TrainingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TrainingError";
  }
}

const MIME_BY_KIND: Record<Exclude<AssetKind, "link">, string[]> = {
  video: ["video/mp4", "video/webm", "video/quicktime"],
  pdf: ["application/pdf"],
  doc: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
  ],
  image: ["image/png", "image/jpeg", "image/webp"],
};

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

type SectionRow = {
  id: string;
  site: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type AssetRow = {
  id: string;
  site: string;
  section_id: string;
  title: string;
  description: string;
  kind: string;
  filename: string | null;
  mime: string | null;
  bytes: number | null;
  storage_key: string | null;
  external_url: string | null;
  sort_order: number;
  created_at: string;
};

export type D1Like = {
  prepare(sql: string): {
    bind(...values: unknown[]): {
      all(): Promise<{ results?: unknown[] }>;
      first<T>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
  exec(sql: string): Promise<unknown>;
};

export type R2Like = {
  put(key: string, value: Uint8Array, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
  delete(key: string): Promise<unknown>;
};

export function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "section";
}

export function safeFilename(name: string) {
  const base = name.split(/[/\\]/).pop() ?? "file";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return (cleaned || "file").slice(0, 80);
}

export function memoryStorage(): ObjectStorage {
  const files = new Map<string, Uint8Array>();
  return {
    async put(key, bytes) {
      files.set(key, bytes);
    },
    async get(key) {
      return files.get(key) ?? null;
    },
    async delete(key) {
      files.delete(key);
    },
  };
}

export function d1Sql(database: D1Like): Sql {
  return {
    async exec(sql) {
      await database.exec(sql);
    },
    async all<T>(sql: string, params: unknown[] = []) {
      const result = await database.prepare(sql).bind(...params).all();
      return (result.results ?? []) as T[];
    },
    async get<T>(sql: string, params: unknown[] = []) {
      const row = await database.prepare(sql).bind(...params).first<T>();
      return row ?? undefined;
    },
    async run(sql, params = []) {
      await database.prepare(sql).bind(...params).run();
    },
    async transaction(fn) {
      return fn();
    },
  };
}

export function r2Storage(bucket: R2Like): ObjectStorage {
  return {
    async put(key, bytes, mime) {
      await bucket.put(key, bytes, { httpMetadata: { contentType: mime } });
    },
    async get(key) {
      const object = await bucket.get(key);
      if (!object) return null;
      return new Uint8Array(await object.arrayBuffer());
    },
    async delete(key) {
      await bucket.delete(key);
    },
  };
}

function mapSection(row: SectionRow): TrainingSection {
  return {
    id: row.id,
    site: row.site,
    slug: row.slug,
    title: row.title,
    description: row.description,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAsset(row: AssetRow): TrainingAsset {
  return {
    id: row.id,
    site: row.site,
    sectionId: row.section_id,
    title: row.title,
    description: row.description,
    kind: row.kind as AssetKind,
    filename: row.filename,
    mime: row.mime,
    bytes: row.bytes,
    storageKey: row.storage_key,
    externalUrl: row.external_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function resolveMime(file: AssetFile) {
  const given = file.mime.trim().toLowerCase();
  if (given && given !== "application/octet-stream") return given;
  const ext = file.filename.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
  return MIME_BY_EXT[ext] ?? given;
}

export function prepareAsset(input: NewAsset, limits: Limits = DEFAULT_LIMITS) {
  const title = input.title.trim();
  if (title.length < 2 || title.length > 140) {
    throw new TrainingError("Give the item a title.");
  }
  if (!ASSET_KINDS.includes(input.kind)) {
    throw new TrainingError("That file type is not in the library.");
  }
  const description = (input.description ?? "").trim().slice(0, 2000);
  if (input.kind === "link") {
    const externalUrl = httpsUrl(input.externalUrl ?? "");
    return {
      title,
      description,
      kind: input.kind,
      filename: null as string | null,
      mime: null as string | null,
      bytes: null as number | null,
      externalUrl,
      body: null as Uint8Array | null,
    };
  }
  const file = input.file;
  if (!file || file.bytes.byteLength === 0) {
    throw new TrainingError("Choose a file to upload.");
  }
  const mime = resolveMime(file);
  const allowed = MIME_BY_KIND[input.kind];
  if (!allowed.includes(mime)) {
    throw new TrainingError("That file is not an allowed type for this item.");
  }
  if (file.bytes.byteLength > limits[input.kind]) {
    throw new TrainingError("That file is over the size limit.");
  }
  return {
    title,
    description,
    kind: input.kind,
    filename: safeFilename(file.filename),
    mime,
    bytes: file.bytes.byteLength,
    externalUrl: null as string | null,
    body: file.bytes,
  };
}

function httpsUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new TrainingError("Enter a full https link.");
  }
  if (url.protocol !== "https:") throw new TrainingError("Links have to start with https.");
  return url.toString();
}

function storageKey(site: string, assetId: string, filename: string) {
  const key = `${site}/library/${assetId}/${filename}`;
  if (key.includes("..")) throw new TrainingError("Bad file name.");
  return key;
}

export async function applyTrainingSchema(db: Sql) {
  await db.exec(TRAINING_SCHEMA);
}

export function createTrainingLibrary(db: Sql, files: ObjectStorage, options: { site: string; limits?: Partial<Limits> }) {
  const site = options.site.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site)) {
    throw new TrainingError("Site slug must be lowercase letters, numbers, and dashes.");
  }
  const limits: Limits = { ...DEFAULT_LIMITS, ...options.limits };

  async function uniqueSlug(base: string) {
    let slug = base;
    let count = 2;
    while (await db.get(`SELECT id FROM training_section WHERE site = ? AND slug = ?`, [site, slug])) {
      slug = `${base}-${count}`;
      count += 1;
    }
    return slug;
  }

  return {
    site,
    limits,
    async listSections(): Promise<Array<TrainingSection & { assetCount: number }>> {
      const rows = await db.all<SectionRow & { asset_count: number }>(
        `SELECT s.*, (SELECT COUNT(*) FROM training_asset a WHERE a.section_id = s.id) AS asset_count
         FROM training_section s WHERE s.site = ? ORDER BY s.sort_order, s.title`,
        [site],
      );
      return rows.map((row) => ({ ...mapSection(row), assetCount: Number(row.asset_count) }));
    },
    async getSectionBySlug(slug: string): Promise<SectionWithAssets | null> {
      const row = await db.get<SectionRow>(`SELECT * FROM training_section WHERE site = ? AND slug = ?`, [site, slug]);
      if (!row) return null;
      const assets = await db.all<AssetRow>(
        `SELECT * FROM training_asset WHERE site = ? AND section_id = ? ORDER BY sort_order, title`,
        [site, row.id],
      );
      return { ...mapSection(row), assets: assets.map(mapAsset) };
    },
    async getSection(id: string): Promise<SectionWithAssets | null> {
      const row = await db.get<SectionRow>(`SELECT * FROM training_section WHERE site = ? AND id = ?`, [site, id]);
      if (!row) return null;
      const assets = await db.all<AssetRow>(
        `SELECT * FROM training_asset WHERE site = ? AND section_id = ? ORDER BY sort_order, title`,
        [site, row.id],
      );
      return { ...mapSection(row), assets: assets.map(mapAsset) };
    },
    async createSection(input: { title: string; description?: string; slug?: string }): Promise<TrainingSection> {
      const title = input.title.trim();
      if (title.length < 2 || title.length > 120) throw new TrainingError("Give the section a title.");
      const description = (input.description ?? "").trim().slice(0, 2000);
      const slug = await uniqueSlug(slugify(input.slug?.trim() || title));
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const orderRow = await db.get<{ next: number }>(
        `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM training_section WHERE site = ?`,
        [site],
      );
      await db.run(
        `INSERT INTO training_section (id, site, slug, title, description, sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, site, slug, title, description, orderRow?.next ?? 0, now, now],
      );
      const created = await db.get<SectionRow>(`SELECT * FROM training_section WHERE id = ?`, [id]);
      if (!created) throw new TrainingError("The section did not save.");
      return mapSection(created);
    },
    async deleteSection(id: string) {
      const assets = await db.all<AssetRow>(`SELECT * FROM training_asset WHERE site = ? AND section_id = ?`, [site, id]);
      await db.run(`DELETE FROM training_section WHERE site = ? AND id = ?`, [site, id]);
      for (const asset of assets) {
        if (asset.storage_key) await files.delete(asset.storage_key);
      }
    },
    async addAsset(input: NewAsset): Promise<TrainingAsset> {
      const section = await db.get<{ id: string }>(`SELECT id FROM training_section WHERE site = ? AND id = ?`, [
        site,
        input.sectionId,
      ]);
      if (!section) throw new TrainingError("That section is not on this site.");
      const prepared = prepareAsset(input, limits);
      const id = crypto.randomUUID();
      const key = prepared.body && prepared.filename ? storageKey(site, id, prepared.filename) : null;
      if (prepared.body && key && prepared.mime) await files.put(key, prepared.body, prepared.mime);
      const now = new Date().toISOString();
      const orderRow = await db.get<{ next: number }>(
        `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM training_asset WHERE section_id = ?`,
        [section.id],
      );
      try {
        await db.run(
          `INSERT INTO training_asset
            (id, site, section_id, title, description, kind, filename, mime, bytes, storage_key, external_url, sort_order, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            site,
            section.id,
            prepared.title,
            prepared.description,
            prepared.kind,
            prepared.filename,
            prepared.mime,
            prepared.bytes,
            key,
            prepared.externalUrl,
            orderRow?.next ?? 0,
            now,
          ],
        );
      } catch (error) {
        if (key) await files.delete(key);
        throw error;
      }
      const row = await db.get<AssetRow>(`SELECT * FROM training_asset WHERE id = ?`, [id]);
      if (!row) throw new TrainingError("The item did not save.");
      return mapAsset(row);
    },
    async deleteAsset(id: string) {
      const row = await db.get<AssetRow>(`SELECT * FROM training_asset WHERE site = ? AND id = ?`, [site, id]);
      if (!row) return;
      await db.run(`DELETE FROM training_asset WHERE site = ? AND id = ?`, [site, id]);
      if (row.storage_key) await files.delete(row.storage_key);
    },
    async readAsset(id: string) {
      const row = await db.get<AssetRow>(`SELECT * FROM training_asset WHERE site = ? AND id = ?`, [site, id]);
      if (!row) return null;
      const asset = mapAsset(row);
      if (!asset.storageKey) return { asset, bytes: null as Uint8Array | null };
      const bytes = await files.get(asset.storageKey);
      return { asset, bytes };
    },
    async reorderAssets(sectionId: string, orderedIds: string[]) {
      const rows = await db.all<{ id: string }>(
        `SELECT id FROM training_asset WHERE site = ? AND section_id = ?`,
        [site, sectionId],
      );
      const known = new Set(rows.map((row) => row.id));
      if (orderedIds.length !== known.size || new Set(orderedIds).size !== orderedIds.length || orderedIds.some((id) => !known.has(id))) {
        throw new TrainingError("Reorder must include every item in the section once.");
      }
      await db.transaction(async () => {
        for (let index = 0; index < orderedIds.length; index += 1) {
          await db.run(`UPDATE training_asset SET sort_order = ? WHERE site = ? AND section_id = ? AND id = ?`, [
            index,
            site,
            sectionId,
            orderedIds[index],
          ]);
        }
      });
    },
  };
}

export type TrainingLibrary = ReturnType<typeof createTrainingLibrary>;
