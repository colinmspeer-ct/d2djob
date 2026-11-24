import "server-only";
import { randomBytes } from "node:crypto";
import { jsonStrings, slugify } from "./format";
import { getDb } from "./db";
import type { Candidate, Employer, JobPost, MeetingRequest, Shortlist, StaffUser, TalentSearch } from "./types";

type Row = Record<string, unknown>;

function str(row: Row, key: string) {
  const value = row[key];
  return value == null ? "" : String(value);
}
function strOrNull(row: Row, key: string) {
  const value = row[key];
  if (value == null || value === "") return null;
  return String(value);
}
function intOrNull(row: Row, key: string) {
  const value = row[key];
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
function flag(row: Row, key: string) {
  return Number(row[key]) === 1;
}

function mapCandidate(row: Row): Candidate {
  return {
    id: str(row, "id"),
    slug: str(row, "slug"),
    realName: str(row, "real_name"),
    phone: str(row, "phone"),
    email: str(row, "email"),
    interviewNotes: str(row, "interview_notes"),
    country: str(row, "country"),
    city: str(row, "city"),
    roleTitle: str(row, "role_title"),
    pseudonym: str(row, "pseudonym"),
    headline: str(row, "headline"),
    summary: str(row, "summary"),
    background: str(row, "background"),
    experience: str(row, "experience"),
    personality: str(row, "personality"),
    lookingFor: str(row, "looking_for"),
    highlights: jsonStrings(row.highlights_json),
    skills: jsonStrings(row.skills_json),
    monthlyPayCents: intOrNull(row, "monthly_pay_cents"),
    startDate: strOrNull(row, "start_date"),
    yearsExperience: intOrNull(row, "years_experience"),
    availability: str(row, "availability"),
    willingToOverlap: str(row, "willing_to_overlap"),
    introVideoKey: strOrNull(row, "intro_video_key"),
    isSample: flag(row, "is_sample"),
    isPublished: flag(row, "is_published"),
    createdAt: str(row, "created_at"),
    updatedAt: str(row, "updated_at"),
  };
}

function mapJob(row: Row): JobPost {
  return {
    id: str(row, "id"),
    slug: str(row, "slug"),
    title: str(row, "title"),
    description: str(row, "description"),
    datePosted: str(row, "date_posted"),
    validThrough: str(row, "valid_through"),
    employmentType: str(row, "employment_type"),
    hiringOrganization: str(row, "hiring_organization"),
    country: str(row, "country"),
    locationLabel: str(row, "location_label"),
    salaryMin: intOrNull(row, "salary_min"),
    salaryMax: intOrNull(row, "salary_max"),
    salaryUnit: strOrNull(row, "salary_unit"),
    isSample: flag(row, "is_sample"),
    isPublished: flag(row, "is_published"),
    createdAt: str(row, "created_at"),
    updatedAt: str(row, "updated_at"),
  };
}

export function uniqueSlug(table: "candidate" | "job_post" | "shortlist", column: "slug" | "token", base: string) {
  const root = base || "item";
  let value = root;
  let count = 2;
  while (getDb().prepare(`SELECT id FROM ${table} WHERE ${column} = ?`).get(value)) {
    value = `${root}-${count}`;
    count += 1;
  }
  return value;
}

export type CandidateWrite = Omit<Candidate, "id" | "slug" | "introVideoKey" | "createdAt" | "updatedAt"> & {
  slug?: string;
};

export function listCandidates() {
  return (getDb().prepare(`SELECT * FROM candidate ORDER BY updated_at DESC`).all() as Row[]).map(mapCandidate);
}

export function getCandidate(id: string) {
  const row = getDb().prepare(`SELECT * FROM candidate WHERE id = ?`).get(id) as Row | undefined;
  return row ? mapCandidate(row) : null;
}

export function getPublishedCandidateBySlug(slug: string) {
  const row = getDb().prepare(`SELECT * FROM candidate WHERE slug = ? AND is_published = 1`).get(slug) as Row | undefined;
  return row ? mapCandidate(row) : null;
}

export function insertCandidate(input: CandidateWrite) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const slug = uniqueSlug("candidate", "slug", input.slug || slugify(input.pseudonym));
  getDb()
    .prepare(
      `INSERT INTO candidate (
        id, slug, real_name, phone, email, interview_notes, country, city, role_title, pseudonym,
        headline, summary, background, experience, personality, looking_for, highlights_json, skills_json,
        monthly_pay_cents, start_date, years_experience, availability, willing_to_overlap, intro_video_key,
        is_sample, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?)`,
    )
    .run(
      id,
      slug,
      input.realName,
      input.phone,
      input.email,
      input.interviewNotes,
      input.country,
      input.city,
      input.roleTitle,
      input.pseudonym,
      input.headline,
      input.summary,
      input.background,
      input.experience,
      input.personality,
      input.lookingFor,
      JSON.stringify(input.highlights),
      JSON.stringify(input.skills),
      input.monthlyPayCents,
      input.startDate,
      input.yearsExperience,
      input.availability,
      input.willingToOverlap,
      input.isSample ? 1 : 0,
      input.isPublished ? 1 : 0,
      now,
      now,
    );
  return id;
}

export function updateCandidate(id: string, input: CandidateWrite) {
  getDb()
    .prepare(
      `UPDATE candidate SET
        real_name = ?, phone = ?, email = ?, interview_notes = ?, country = ?, city = ?, role_title = ?, pseudonym = ?,
        headline = ?, summary = ?, background = ?, experience = ?, personality = ?, looking_for = ?,
        highlights_json = ?, skills_json = ?, monthly_pay_cents = ?, start_date = ?, years_experience = ?,
        availability = ?, willing_to_overlap = ?, is_sample = ?, is_published = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(
      input.realName,
      input.phone,
      input.email,
      input.interviewNotes,
      input.country,
      input.city,
      input.roleTitle,
      input.pseudonym,
      input.headline,
      input.summary,
      input.background,
      input.experience,
      input.personality,
      input.lookingFor,
      JSON.stringify(input.highlights),
      JSON.stringify(input.skills),
      input.monthlyPayCents,
      input.startDate,
      input.yearsExperience,
      input.availability,
      input.willingToOverlap,
      input.isSample ? 1 : 0,
      input.isPublished ? 1 : 0,
      new Date().toISOString(),
      id,
    );
}

export function setIntroVideo(id: string, key: string | null) {
  getDb().prepare(`UPDATE candidate SET intro_video_key = ?, updated_at = ? WHERE id = ?`).run(key, new Date().toISOString(), id);
}

export function listJobs() {
  return (getDb().prepare(`SELECT * FROM job_post ORDER BY updated_at DESC`).all() as Row[]).map(mapJob);
}

export function listPublishedJobs() {
  return (getDb().prepare(`SELECT * FROM job_post WHERE is_published = 1 ORDER BY date_posted DESC`).all() as Row[]).map(mapJob);
}

export function getJob(id: string) {
  const row = getDb().prepare(`SELECT * FROM job_post WHERE id = ?`).get(id) as Row | undefined;
  return row ? mapJob(row) : null;
}

export function getPublishedJobBySlug(slug: string) {
  const row = getDb().prepare(`SELECT * FROM job_post WHERE slug = ? AND is_published = 1`).get(slug) as Row | undefined;
  return row ? mapJob(row) : null;
}

export type JobWrite = Omit<JobPost, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };

export function insertJob(input: JobWrite) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const slug = uniqueSlug("job_post", "slug", input.slug || slugify(input.title));
  getDb()
    .prepare(
      `INSERT INTO job_post (
        id, slug, title, description, date_posted, valid_through, employment_type, hiring_organization,
        country, location_label, salary_min, salary_max, salary_unit, is_sample, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      slug,
      input.title,
      input.description,
      input.datePosted,
      input.validThrough,
      input.employmentType,
      input.hiringOrganization,
      input.country,
      input.locationLabel,
      input.salaryMin,
      input.salaryMax,
      input.salaryUnit,
      input.isSample ? 1 : 0,
      input.isPublished ? 1 : 0,
      now,
      now,
    );
  return id;
}

export function updateJob(id: string, input: JobWrite) {
  getDb()
    .prepare(
      `UPDATE job_post SET
        title = ?, description = ?, date_posted = ?, valid_through = ?, employment_type = ?, hiring_organization = ?,
        country = ?, location_label = ?, salary_min = ?, salary_max = ?, salary_unit = ?, is_sample = ?, is_published = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(
      input.title,
      input.description,
      input.datePosted,
      input.validThrough,
      input.employmentType,
      input.hiringOrganization,
      input.country,
      input.locationLabel,
      input.salaryMin,
      input.salaryMax,
      input.salaryUnit,
      input.isSample ? 1 : 0,
      input.isPublished ? 1 : 0,
      new Date().toISOString(),
      id,
    );
}

export function listRequests() {
  return (
    getDb()
      .prepare(
        `SELECT r.*, c.real_name AS candidate_name FROM meeting_request r
         JOIN candidate c ON c.id = r.candidate_id ORDER BY r.created_at DESC`,
      )
      .all() as Row[]
  ).map(
    (row): MeetingRequest => ({
      id: str(row, "id"),
      candidateId: str(row, "candidate_id"),
      shortlistId: strOrNull(row, "shortlist_id"),
      type: str(row, "type"),
      name: str(row, "name"),
      company: str(row, "company"),
      email: str(row, "email"),
      phone: str(row, "phone"),
      message: str(row, "message"),
      preferredTimes: str(row, "preferred_times"),
      status: str(row, "status"),
      createdAt: str(row, "created_at"),
      candidateName: str(row, "candidate_name"),
    }),
  );
}

export function countOpenRequests() {
  const row = getDb().prepare(`SELECT COUNT(*) AS n FROM meeting_request WHERE status = 'new'`).get() as { n: number };
  return Number(row.n);
}

export function insertMeeting(input: {
  candidateId: string;
  shortlistId: string | null;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  preferredTimes: string;
}) {
  getDb()
    .prepare(
      `INSERT INTO meeting_request (
        id, candidate_id, shortlist_id, type, name, company, email, phone, message, preferred_times, status, created_at
      ) VALUES (?, ?, ?, 'meeting', ?, ?, ?, ?, ?, ?, 'new', ?)`,
    )
    .run(
      crypto.randomUUID(),
      input.candidateId,
      input.shortlistId,
      input.name,
      input.company,
      input.email,
      input.phone,
      input.message,
      input.preferredTimes,
      new Date().toISOString(),
    );
}

export function setRequestStatus(id: string, status: "new" | "reviewed" | "closed") {
  getDb().prepare(`UPDATE meeting_request SET status = ? WHERE id = ?`).run(status, id);
}

export function listEmployers() {
  return (getDb().prepare(`SELECT * FROM employer ORDER BY company`).all() as Row[]).map(
    (row): Employer => ({
      id: str(row, "id"),
      company: str(row, "company"),
      contactName: str(row, "contact_name"),
      email: str(row, "email"),
      phone: str(row, "phone"),
      createdAt: str(row, "created_at"),
    }),
  );
}

export function insertEmployer(input: { company: string; contactName: string; email: string; phone: string }) {
  const id = crypto.randomUUID();
  getDb()
    .prepare(`INSERT INTO employer (id, company, contact_name, email, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(id, input.company, input.contactName, input.email, input.phone, new Date().toISOString());
  return id;
}

export function listSearches() {
  return (
    getDb()
      .prepare(
        `SELECT s.*, e.company, e.contact_name, e.email FROM talent_search s
         JOIN employer e ON e.id = s.employer_id ORDER BY s.created_at DESC`,
      )
      .all() as Row[]
  ).map(mapSearch);
}

export function getSearch(id: string) {
  const row = getDb()
    .prepare(
      `SELECT s.*, e.company, e.contact_name, e.email FROM talent_search s
       JOIN employer e ON e.id = s.employer_id WHERE s.id = ?`,
    )
    .get(id) as Row | undefined;
  return row ? mapSearch(row) : null;
}

function mapSearch(row: Row): TalentSearch {
  return {
    id: str(row, "id"),
    employerId: str(row, "employer_id"),
    roleTitle: str(row, "role_title"),
    firstYearSalaryCents: Number(row.first_year_salary_cents),
    notes: str(row, "notes"),
    feePercent: Number(row.fee_percent),
    depositCents: Number(row.deposit_cents),
    guaranteeDays: Number(row.guarantee_days),
    status: str(row, "status"),
    stripeSessionId: strOrNull(row, "stripe_session_id"),
    createdAt: str(row, "created_at"),
    updatedAt: str(row, "updated_at"),
    company: str(row, "company"),
    contactName: str(row, "contact_name"),
    email: str(row, "email"),
  };
}

export function insertSearch(input: {
  employerId: string;
  roleTitle: string;
  firstYearSalaryCents: number;
  notes: string;
  feePercent: number;
  depositCents: number;
  guaranteeDays: number;
}) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO talent_search (
        id, employer_id, role_title, first_year_salary_cents, notes, fee_percent, deposit_cents, guarantee_days,
        status, stripe_session_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'intake', NULL, ?, ?)`,
    )
    .run(
      id,
      input.employerId,
      input.roleTitle,
      input.firstYearSalaryCents,
      input.notes,
      input.feePercent,
      input.depositCents,
      input.guaranteeDays,
      now,
      now,
    );
  return id;
}

export function setSearchCheckout(id: string, status: string, sessionId: string | null) {
  getDb()
    .prepare(`UPDATE talent_search SET status = ?, stripe_session_id = ?, updated_at = ? WHERE id = ?`)
    .run(status, sessionId, new Date().toISOString(), id);
}

export function markDepositPaid(searchId: string, sessionId: string) {
  const current = getSearch(searchId);
  if (!current) return false;
  if (current.stripeSessionId && current.stripeSessionId !== sessionId) return false;
  getDb()
    .prepare(
      `UPDATE talent_search SET status = 'deposit_paid', stripe_session_id = ?, updated_at = ? WHERE id = ?`,
    )
    .run(sessionId, new Date().toISOString(), searchId);
  return true;
}

export function listShortlists() {
  return (getDb().prepare(`SELECT * FROM shortlist ORDER BY updated_at DESC`).all() as Row[]).map(mapShortlist);
}

export function getShortlist(id: string) {
  const row = getDb().prepare(`SELECT * FROM shortlist WHERE id = ?`).get(id) as Row | undefined;
  return row ? mapShortlist(row) : null;
}

export function getShortlistByToken(token: string) {
  const row = getDb().prepare(`SELECT * FROM shortlist WHERE token = ?`).get(token) as Row | undefined;
  return row ? mapShortlist(row) : null;
}

function mapShortlist(row: Row): Shortlist {
  return {
    id: str(row, "id"),
    employerId: strOrNull(row, "employer_id"),
    title: str(row, "title"),
    preparedFor: str(row, "prepared_for"),
    token: str(row, "token"),
    intro: str(row, "intro"),
    isPublished: flag(row, "is_published"),
    isSample: flag(row, "is_sample"),
    createdAt: str(row, "created_at"),
    updatedAt: str(row, "updated_at"),
  };
}

export function shortlistMembers(shortlistId: string, publishedOnly: boolean) {
  const rows = getDb()
    .prepare(
      `SELECT c.* FROM shortlist_candidate sc
       JOIN candidate c ON c.id = sc.candidate_id
       WHERE sc.shortlist_id = ? ${publishedOnly ? "AND c.is_published = 1" : ""}
       ORDER BY sc.sort_order, c.real_name`,
    )
    .all(shortlistId) as Row[];
  return rows.map(mapCandidate);
}

export function createShortlist(input: {
  title: string;
  preparedFor: string;
  intro: string;
  employerId: string | null;
  isPublished: boolean;
  isSample: boolean;
  candidateIds: string[];
}) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const token = uniqueSlug("shortlist", "token", randomBytes(9).toString("base64url").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12));
  const db = getDb();
  db.prepare(
    `INSERT INTO shortlist (id, employer_id, title, prepared_for, token, intro, is_published, is_sample, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.employerId,
    input.title,
    input.preparedFor,
    token,
    input.intro,
    input.isPublished ? 1 : 0,
    input.isSample ? 1 : 0,
    now,
    now,
  );
  replaceMembers(id, input.candidateIds);
  return id;
}

export function updateShortlist(
  id: string,
  input: {
    title: string;
    preparedFor: string;
    intro: string;
    employerId: string | null;
    isPublished: boolean;
    isSample: boolean;
    candidateIds: string[];
  },
) {
  getDb()
    .prepare(
      `UPDATE shortlist SET title = ?, prepared_for = ?, intro = ?, employer_id = ?, is_published = ?, is_sample = ?, updated_at = ? WHERE id = ?`,
    )
    .run(
      input.title,
      input.preparedFor,
      input.intro,
      input.employerId,
      input.isPublished ? 1 : 0,
      input.isSample ? 1 : 0,
      new Date().toISOString(),
      id,
    );
  replaceMembers(id, input.candidateIds);
}

function replaceMembers(shortlistId: string, candidateIds: string[]) {
  const db = getDb();
  db.prepare(`DELETE FROM shortlist_candidate WHERE shortlist_id = ?`).run(shortlistId);
  const insert = db.prepare(`INSERT INTO shortlist_candidate (shortlist_id, candidate_id, sort_order) VALUES (?, ?, ?)`);
  candidateIds.forEach((candidateId, index) => insert.run(shortlistId, candidateId, index));
}

export function findStaff(email: string): StaffUser | null {
  const row = getDb().prepare(`SELECT * FROM staff_user WHERE email = ?`).get(email.trim().toLowerCase()) as Row | undefined;
  if (!row) return null;
  const role = str(row, "role");
  if (role !== "admin" && role !== "library") return null;
  return { id: str(row, "id"), email: str(row, "email"), passwordHash: str(row, "password_hash"), role };
}

export function findStaffById(id: string): StaffUser | null {
  const row = getDb().prepare(`SELECT * FROM staff_user WHERE id = ?`).get(id) as Row | undefined;
  if (!row) return null;
  const role = str(row, "role");
  if (role !== "admin" && role !== "library") return null;
  return { id: str(row, "id"), email: str(row, "email"), passwordHash: str(row, "password_hash"), role };
}

export function counts() {
  const db = getDb();
  const count = (sql: string) => Number((db.prepare(sql).get() as { n: number }).n);
  return {
    candidates: count(`SELECT COUNT(*) AS n FROM candidate`),
    published: count(`SELECT COUNT(*) AS n FROM candidate WHERE is_published = 1`),
    jobs: count(`SELECT COUNT(*) AS n FROM job_post`),
    requests: count(`SELECT COUNT(*) AS n FROM meeting_request WHERE status = 'new'`),
    searches: count(`SELECT COUNT(*) AS n FROM talent_search`),
    shortlists: count(`SELECT COUNT(*) AS n FROM shortlist`),
  };
}
