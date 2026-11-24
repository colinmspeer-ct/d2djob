import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { mediaPath, sampleShortlistToken } from "./paths";
import { hashPassword, verifyPassword } from "./passwords";
import { readPlacementTerms } from "./terms";
import { sampleCandidates } from "./sample-data";
import { pseudonymFromName } from "./profile";
import { tinyPdf } from "./tiny-pdf";

const SITE = "swyftinternational";

function upsertStaff(db: DatabaseSync, email: string, password: string, role: "admin" | "library") {
  const normalized = email.trim().toLowerCase();
  const existing = db.prepare(`SELECT id, password_hash, role FROM staff_user WHERE email = ?`).get(normalized) as
    | { id: string; password_hash: string; role: string }
    | undefined;
  if (!existing) {
    db.prepare(`INSERT INTO staff_user (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)`).run(
      crypto.randomUUID(),
      normalized,
      hashPassword(password),
      role,
      new Date().toISOString(),
    );
    return;
  }
  const nextHash = verifyPassword(password, existing.password_hash) ? existing.password_hash : hashPassword(password);
  if (nextHash !== existing.password_hash || existing.role !== role) {
    db.prepare(`UPDATE staff_user SET password_hash = ?, role = ? WHERE id = ?`).run(nextHash, role, existing.id);
  }
}

export function ensureStaff(db: DatabaseSync, env: Record<string, string | undefined> = process.env) {
  const adminEmail = env.ADMIN_EMAIL?.trim() ?? "";
  const adminPassword = env.ADMIN_PASSWORD ?? "";
  const libraryEmail = env.LIBRARY_EMAIL?.trim() ?? "";
  const libraryPassword = env.LIBRARY_PASSWORD ?? "";
  if (libraryEmail && libraryPassword && libraryEmail.toLowerCase() !== adminEmail.toLowerCase()) {
    upsertStaff(db, libraryEmail, libraryPassword, "library");
  }
  if (adminEmail && adminPassword) upsertStaff(db, adminEmail, adminPassword, "admin");
}

function putFile(key: string, bytes: Buffer) {
  const dest = path.join(mediaPath(), key);
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, bytes);
}

export function seedIfEmpty(db: DatabaseSync, env: Record<string, string | undefined> = process.env) {
  const seeded = db.prepare(`SELECT value FROM app_meta WHERE key = 'seed_version'`).get() as { value: string } | undefined;
  if (seeded?.value === "1") return;
  db.exec("BEGIN");
  try {
  const now = new Date().toISOString();
  const terms = readPlacementTerms(env);
  const token = sampleShortlistToken();

  const insertCandidate = db.prepare(`
    INSERT INTO candidate (
      id, slug, real_name, phone, email, interview_notes, country, city, role_title, pseudonym,
      headline, summary, background, experience, personality, looking_for, highlights_json, skills_json,
      monthly_pay_cents, start_date, years_experience, availability, willing_to_overlap, intro_video_key,
      is_sample, is_published, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 1, 1, ?, ?)
  `);
  for (const candidate of sampleCandidates) {
    insertCandidate.run(
      candidate.id,
      candidate.slug,
      candidate.realName,
      candidate.phone,
      candidate.email,
      candidate.interviewNotes,
      candidate.country,
      candidate.city,
      candidate.roleTitle,
      pseudonymFromName(candidate.realName),
      candidate.headline,
      candidate.summary,
      candidate.background,
      candidate.experience,
      candidate.personality,
      candidate.lookingFor,
      JSON.stringify(candidate.highlights),
      JSON.stringify(candidate.skills),
      candidate.monthlyPayCents,
      candidate.startDate,
      candidate.yearsExperience,
      candidate.availability,
      candidate.willingToOverlap,
      now,
      now,
    );
  }

  db.prepare(
    `INSERT INTO employer (id, company, contact_name, email, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
  ).run("employer-harbor", "Harbor Lane Home Services", "Rowan Hale", "rowan@harbor-lane.example", "555-0100", now);

  db.prepare(
    `INSERT INTO job_post (
      id, slug, title, description, date_posted, valid_through, employment_type, hiring_organization,
      country, location_label, salary_min, salary_max, salary_unit, is_sample, is_published, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)`,
  ).run(
    "job-harbor-support",
    "bilingual-client-support",
    "Bilingual client support",
    "Fictional sample role for the preview. Harbor Lane Home Services wants a client-support seat that can overlap a US afternoon. The hire is paid by Harbor Lane. Swyft International is not the employer. Egypt or Belize.",
    "2026-11-24",
    "2027-02-28",
    "FULL_TIME",
    "Harbor Lane Home Services",
    "EG",
    "Cairo or remote from Belize",
    1400,
    2100,
    "MONTH",
    now,
    now,
  );

  db.prepare(
    `INSERT INTO talent_search (
      id, employer_id, role_title, first_year_salary_cents, notes, fee_percent, deposit_cents, guarantee_days,
      status, stripe_session_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'preview_recorded', NULL, ?, ?)`,
  ).run(
    "search-harbor",
    "employer-harbor",
    "Bilingual client success",
    6_000_000,
    "Seeded example so the desk is not empty. No card was charged and Stripe was not called.",
    terms.successFeePercent,
    terms.depositCents,
    terms.replacementGuaranteeDays,
    now,
    now,
  );

  db.prepare(
    `INSERT INTO shortlist (
      id, employer_id, title, prepared_for, token, intro, is_published, is_sample, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 1, 1, ?, ?)`,
  ).run(
    "shortlist-harbor",
    "employer-harbor",
    "Sample shortlist",
    "Harbor Lane Home Services",
    token,
    "Six fictional people, three from Egypt and three from Belize, so you can see the packet an employer would open. Nobody on this page is a real candidate.",
    now,
    now,
  );

  const link = db.prepare(
    `INSERT INTO shortlist_candidate (shortlist_id, candidate_id, sort_order) VALUES ('shortlist-harbor', ?, ?)`,
  );
  sampleCandidates.forEach((candidate, index) => link.run(candidate.id, index));

  db.prepare(
    `INSERT INTO meeting_request (
      id, candidate_id, shortlist_id, type, name, company, email, phone, message, preferred_times, status, created_at
    ) VALUES (?, ?, ?, 'meeting', ?, ?, ?, ?, ?, ?, 'new', ?)`,
  ).run(
    "request-harbor",
    "cand-amira",
    "shortlist-harbor",
    "Rowan Hale",
    "Harbor Lane Home Services",
    "rowan@harbor-lane.example",
    "555-0100",
    "Fictional request. Rowan wants a 20-minute intro with Amira about the support seat.",
    "Tue or Wed, 2pm US Eastern",
    now,
  );

  const pdfKey = `${SITE}/library/asset-call-pdf/shortlist-call.pdf`;
  const notesKey = `${SITE}/library/asset-fee-notes/fee-notes.txt`;
  putFile(pdfKey, tinyPdf("How a shortlist call works"));
  putFile(
    notesKey,
    Buffer.from(
      "Swyft International preview\n\nThe hire's salary is paid by the client. The success fee, deposit, and replacement window are configuration, not a hardcoded contract.\n",
      "utf8",
    ),
  );
  db.prepare(
    `INSERT INTO training_section (id, site, slug, title, description, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    "section-week-one",
    SITE,
    "first-week",
    "First week",
    "For someone who just started. Preview material only.",
    0,
    now,
    now,
  );
  db.prepare(
    `INSERT INTO training_section (id, site, slug, title, description, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    "section-recruiters",
    SITE,
    "for-recruiters",
    "For recruiters",
    "How the desk explains the fee. Preview material only.",
    1,
    now,
    now,
  );
  db.prepare(
    `INSERT INTO training_asset (
      id, site, section_id, title, description, kind, filename, mime, bytes, storage_key, external_url, sort_order, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
  ).run(
    "asset-call-pdf",
    SITE,
    "section-week-one",
    "How a shortlist call works",
    "One-page preview PDF. There is no recording of a real person.",
    "pdf",
    "shortlist-call.pdf",
    "application/pdf",
    tinyPdf("How a shortlist call works").byteLength,
    pdfKey,
    0,
    now,
  );
  db.prepare(
    `INSERT INTO training_asset (
      id, site, section_id, title, description, kind, filename, mime, bytes, storage_key, external_url, sort_order, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
  ).run(
    "asset-fee-notes",
    SITE,
    "section-recruiters",
    "What we tell an employer about the fee",
    "Plain-text note. The numbers on the site come from configuration.",
    "doc",
    "fee-notes.txt",
    "text/plain",
    Buffer.byteLength("Swyft International preview\n\nThe hire's salary is paid by the client. The success fee, deposit, and replacement window are configuration, not a hardcoded contract.\n"),
    notesKey,
    0,
    now,
  );

  db.prepare(`INSERT INTO app_meta (key, value) VALUES ('seed_version', '1')`).run();
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
