CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS locations (
  slug TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_name TEXT NOT NULL,
  county TEXT NOT NULL,
  filter_group TEXT NOT NULL,
  is_fiber_market INTEGER NOT NULL DEFAULT 0,
  fiber_tier TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS industries (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  geo_prefix TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  real_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  interview_notes TEXT NOT NULL,
  photo_key TEXT,
  pseudonym TEXT NOT NULL,
  headline TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  background TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  personality TEXT NOT NULL DEFAULT '',
  looking_for TEXT NOT NULL DEFAULT '',
  years_experience INTEGER,
  sales_type TEXT NOT NULL DEFAULT '',
  availability TEXT NOT NULL DEFAULT '',
  willing_to_travel INTEGER NOT NULL DEFAULT 0,
  pay_structure TEXT NOT NULL DEFAULT '',
  work_style TEXT NOT NULL DEFAULT '',
  schedule TEXT NOT NULL DEFAULT '',
  location_slug TEXT NOT NULL,
  is_sample INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0,
  generation_source TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (location_slug) REFERENCES locations (slug)
);

CREATE INDEX IF NOT EXISTS idx_candidates_published ON candidates (is_published);
CREATE INDEX IF NOT EXISTS idx_candidates_location ON candidates (location_slug);

CREATE TABLE IF NOT EXISTS candidate_industries (
  candidate_id TEXT NOT NULL,
  industry_slug TEXT NOT NULL,
  PRIMARY KEY (candidate_id, industry_slug),
  FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
  FOREIGN KEY (industry_slug) REFERENCES industries (slug)
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_times TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  email_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_requests_created ON contact_requests (created_at);
CREATE INDEX IF NOT EXISTS idx_requests_status ON contact_requests (status);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_posted TEXT NOT NULL,
  valid_through TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  hiring_organization TEXT NOT NULL,
  industry_slug TEXT NOT NULL,
  location_slug TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_unit TEXT,
  commission_note TEXT NOT NULL DEFAULT '',
  is_sample INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (industry_slug) REFERENCES industries (slug),
  FOREIGN KEY (location_slug) REFERENCES locations (slug)
);

CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs (is_published);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON jobs (industry_slug);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs (location_slug);

-- Training library tables. Kept identical to packages/training-library/schema.sql
-- so swyftinternational.com can apply the same module schema.

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
