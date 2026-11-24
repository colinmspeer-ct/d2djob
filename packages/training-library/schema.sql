CREATE TABLE IF NOT EXISTS training_sections (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_training_sections_site
  ON training_sections (site_id, sort_order, title);

CREATE TABLE IF NOT EXISTS training_items (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL CHECK (kind IN ('video', 'pdf', 'doc', 'image', 'link')),
  external_url TEXT,
  object_key TEXT,
  file_name TEXT,
  content_type TEXT,
  byte_size INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (
    (kind = 'link' AND external_url IS NOT NULL AND object_key IS NULL)
    OR (kind != 'link' AND object_key IS NOT NULL AND external_url IS NULL)
  ),
  FOREIGN KEY (section_id) REFERENCES training_sections (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_training_items_section
  ON training_items (site_id, section_id, sort_order, title);

CREATE TABLE IF NOT EXISTS training_reps (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (site_id, email)
);

CREATE TABLE IF NOT EXISTS training_invites (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL DEFAULT '',
  expires_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_training_invites_site
  ON training_invites (site_id, created_at);

CREATE TABLE IF NOT EXISTS auth_attempts (
  bucket TEXT PRIMARY KEY,
  failures INTEGER NOT NULL,
  locked_until TEXT
);
