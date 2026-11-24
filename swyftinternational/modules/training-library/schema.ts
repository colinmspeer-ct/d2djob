export const TRAINING_SCHEMA = `
CREATE TABLE IF NOT EXISTS training_section (
  id TEXT PRIMARY KEY,
  site TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (site, slug)
);

CREATE TABLE IF NOT EXISTS training_asset (
  id TEXT PRIMARY KEY,
  site TEXT NOT NULL,
  section_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL,
  filename TEXT,
  mime TEXT,
  bytes INTEGER,
  storage_key TEXT,
  external_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (section_id) REFERENCES training_section(id) ON DELETE CASCADE,
  CHECK (kind IN ('video', 'pdf', 'doc', 'image', 'link'))
);

CREATE INDEX IF NOT EXISTS idx_training_section_site ON training_section (site, sort_order);
CREATE INDEX IF NOT EXISTS idx_training_asset_section ON training_asset (section_id, sort_order);
`.trim();
