-- D1 migration for the Swyft International preview.
-- The training tables match modules/training-library/schema.ts so one database
-- can also serve site = 'd2djob'.

CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staff_user (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL,
  CHECK (role IN ('admin', 'library'))
);

CREATE TABLE IF NOT EXISTS employer (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS candidate (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  real_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  interview_notes TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  role_title TEXT NOT NULL DEFAULT '',
  pseudonym TEXT NOT NULL,
  headline TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  background TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  personality TEXT NOT NULL DEFAULT '',
  looking_for TEXT NOT NULL DEFAULT '',
  highlights_json TEXT NOT NULL DEFAULT '[]',
  skills_json TEXT NOT NULL DEFAULT '[]',
  monthly_pay_cents INTEGER,
  start_date TEXT,
  years_experience INTEGER,
  availability TEXT NOT NULL DEFAULT '',
  willing_to_overlap TEXT NOT NULL DEFAULT '',
  intro_video_key TEXT,
  is_sample INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS job_post (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_posted TEXT NOT NULL,
  valid_through TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  hiring_organization TEXT NOT NULL,
  country TEXT NOT NULL,
  location_label TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_unit TEXT,
  is_sample INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS talent_search (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL,
  role_title TEXT NOT NULL,
  first_year_salary_cents INTEGER NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  fee_percent INTEGER NOT NULL,
  deposit_cents INTEGER NOT NULL,
  guarantee_days INTEGER NOT NULL,
  status TEXT NOT NULL,
  stripe_session_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (employer_id) REFERENCES employer(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shortlist (
  id TEXT PRIMARY KEY,
  employer_id TEXT,
  title TEXT NOT NULL,
  prepared_for TEXT NOT NULL DEFAULT '',
  token TEXT NOT NULL UNIQUE,
  intro TEXT NOT NULL DEFAULT '',
  is_published INTEGER NOT NULL DEFAULT 0,
  is_sample INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (employer_id) REFERENCES employer(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS shortlist_candidate (
  shortlist_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (shortlist_id, candidate_id),
  FOREIGN KEY (shortlist_id) REFERENCES shortlist(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meeting_request (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL,
  shortlist_id TEXT,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_times TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL,
  FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
  FOREIGN KEY (shortlist_id) REFERENCES shortlist(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_candidate_published ON candidate (is_published);
CREATE INDEX IF NOT EXISTS idx_job_published ON job_post (is_published);
CREATE INDEX IF NOT EXISTS idx_meeting_status ON meeting_request (status);
CREATE INDEX IF NOT EXISTS idx_search_status ON talent_search (status);

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
