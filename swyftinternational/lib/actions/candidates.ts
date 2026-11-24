"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth";
import { countryLabel } from "../format";
import { storeIntroVideo } from "../media";
import { generateProfile, pseudonymFromName } from "../profile";
import { getCandidate, insertCandidate, setIntroVideo, updateCandidate, type CandidateWrite } from "../queries";
import { readCandidateForm } from "../validators";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function toWrite(
  data: Exclude<ReturnType<typeof readCandidateForm>, { ok: false }>["data"],
  isPublished: boolean,
): CandidateWrite {
  const generated =
    data.intent === "generate"
      ? generateProfile({
          realName: data.realName,
          interviewNotes: data.interviewNotes,
          city: data.city,
          countryName: countryLabel(data.country),
          roleTitle: data.roleTitle,
          yearsExperience: data.yearsExperience,
        })
      : null;
  return {
    realName: data.realName,
    phone: data.phone,
    email: data.email,
    interviewNotes: data.interviewNotes,
    country: data.country,
    city: data.city,
    roleTitle: data.roleTitle,
    pseudonym: generated?.pseudonym ?? pseudonymFromName(data.realName),
    headline: generated?.headline ?? data.headline,
    summary: generated?.summary ?? data.summary,
    background: generated?.background ?? data.background,
    experience: generated?.experience ?? data.experience,
    personality: generated?.personality ?? data.personality,
    lookingFor: generated?.lookingFor ?? data.lookingFor,
    highlights: generated?.highlights ?? data.highlights.map((line) => line.trim()),
    skills: generated?.skills ?? data.skills,
    monthlyPayCents: data.monthlyPay == null ? null : data.monthlyPay * 100,
    startDate: data.startDate || null,
    yearsExperience: data.yearsExperience,
    availability: data.availability,
    willingToOverlap: data.willingToOverlap,
    isSample: data.isSample,
    isPublished,
  };
}

async function maybeVideo(id: string, formData: FormData, path: string) {
  const file = formData.get("introVideo");
  if (!(file instanceof File) || file.size === 0) return;
  const stored = await storeIntroVideo(id, file);
  if (!stored.ok) fail(path, stored.error);
  if (!stored.empty) setIntroVideo(id, stored.key);
}

export async function createCandidate(formData: FormData) {
  await requireAdmin();
  const parsed = readCandidateForm(formData);
  if (!parsed.ok) fail("/admin/candidates/new", parsed.error);
  const published = parsed.data.intent === "publish";
  const id = insertCandidate(toWrite(parsed.data, published));
  await maybeVideo(id, formData, `/admin/candidates/${id}`);
  const flag = parsed.data.intent === "generate" ? "generated=template" : "saved=1";
  redirect(`/admin/candidates/${id}?${flag}`);
}

export async function updateCandidateAction(id: string, formData: FormData) {
  await requireAdmin();
  const path = `/admin/candidates/${id}`;
  const existing = getCandidate(id);
  if (!existing) fail("/admin/candidates", "That candidate is gone.");
  const parsed = readCandidateForm(formData);
  if (!parsed.ok) fail(path, parsed.error);
  const published =
    parsed.data.intent === "publish" ? true : parsed.data.intent === "unpublish" ? false : existing.isPublished;
  updateCandidate(id, toWrite(parsed.data, published));
  await maybeVideo(id, formData, path);
  const flag = parsed.data.intent === "generate" ? "generated=template" : "saved=1";
  redirect(`${path}?${flag}`);
}
