export const ASSET_KINDS = ["video", "pdf", "doc", "image", "link"] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

export type TrainingSection = {
  id: string;
  site: string;
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type TrainingAsset = {
  id: string;
  site: string;
  sectionId: string;
  title: string;
  description: string;
  kind: AssetKind;
  filename: string | null;
  mime: string | null;
  bytes: number | null;
  storageKey: string | null;
  externalUrl: string | null;
  sortOrder: number;
  createdAt: string;
};

export type SectionWithAssets = TrainingSection & { assets: TrainingAsset[] };

export type Sql = {
  exec(sql: string): Promise<void>;
  all<T>(sql: string, params?: unknown[]): Promise<T[]>;
  get<T>(sql: string, params?: unknown[]): Promise<T | undefined>;
  run(sql: string, params?: unknown[]): Promise<void>;
  transaction<T>(fn: () => Promise<T>): Promise<T>;
};

export type ObjectStorage = {
  put(key: string, bytes: Uint8Array, mime: string): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
  delete(key: string): Promise<void>;
};

export type AssetFile = {
  filename: string;
  mime: string;
  bytes: Uint8Array;
};

export type NewAsset = {
  sectionId: string;
  title: string;
  description?: string;
  kind: AssetKind;
  file?: AssetFile | null;
  externalUrl?: string | null;
};

export type Limits = Record<Exclude<AssetKind, "link">, number>;

export const DEFAULT_LIMITS: Limits = {
  video: 32 * 1024 * 1024,
  pdf: 15 * 1024 * 1024,
  doc: 15 * 1024 * 1024,
  image: 8 * 1024 * 1024,
};
