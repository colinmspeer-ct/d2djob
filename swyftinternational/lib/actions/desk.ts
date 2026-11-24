"use server";

import { redirect } from "next/navigation";
import { TrainingError } from "@/modules/training-library";
import { getSession } from "../auth";
import { siteUrl } from "../format";
import { trainingLibrary } from "../library";
import {
  createShortlist,
  getCandidate,
  getSearch,
  getShortlist,
  insertEmployer,
  insertMeeting,
  insertSearch,
  listCandidates,
  setRequestStatus,
  setSearchCheckout,
  updateShortlist,
} from "../queries";
import { createDepositCheckout, readStripeMode } from "../stripe";
import { readPlacementTerms } from "../terms";
import { readIntakeForm, readRequestForm, readShortlistForm } from "../validators";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function createMeeting(formData: FormData) {
  const back = String(formData.get("back") || "/");
  const parsed = readRequestForm(formData);
  if (!parsed.ok) {
    if (parsed.error === "spam") redirect(`${back}?sent=1`);
    fail(back, parsed.error);
  }
  const candidate = getCandidate(parsed.data.candidateId);
  if (!candidate || !candidate.isPublished) fail(back, "That candidate is not on a public shortlist.");
  const shortlistId = String(formData.get("shortlistId") ?? "") || null;
  insertMeeting({ ...parsed.data, shortlistId });
  redirect(`${back}?sent=1`);
}

export async function reviewRequest(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "");
  if (status !== "new" && status !== "reviewed" && status !== "closed") fail("/admin/requests", "Unknown status.");
  setRequestStatus(String(formData.get("id") ?? ""), status);
  redirect("/admin/requests?saved=1");
}

export async function startSearch(formData: FormData) {
  const parsed = readIntakeForm(formData);
  if (!parsed.ok) {
    if (parsed.error === "spam") redirect("/employers/start?sent=1");
    fail("/employers/start", parsed.error);
  }
  const terms = readPlacementTerms();
  const employerId = insertEmployer({
    company: parsed.data.company,
    contactName: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone,
  });
  const searchId = insertSearch({
    employerId,
    roleTitle: parsed.data.roleTitle,
    firstYearSalaryCents: parsed.data.salary * 100,
    notes: parsed.data.notes,
    feePercent: terms.successFeePercent,
    depositCents: terms.depositCents,
    guaranteeDays: terms.replacementGuaranteeDays,
  });
  redirect(`/employers/checkout?search=${searchId}`);
}

export async function startCheckout(formData: FormData) {
  const id = String(formData.get("searchId") ?? "");
  const path = `/employers/checkout?search=${encodeURIComponent(id)}`;
  const search = getSearch(id);
  if (!search) fail("/employers/start", "That search is gone. Start again.");
  const mode = readStripeMode();
  if (!mode.ok) {
    const message =
      mode.reason === "live"
        ? "Refusing a live Stripe key. This preview only accepts test keys, and no charge was created."
        : "No Stripe test key is set, so Checkout did not open and nothing was charged.";
    fail(path, message);
  }
  const origin = siteUrl();
  try {
    const session = await createDepositCheckout(mode.secretKey, {
      searchId: search.id,
      email: search.email,
      depositCents: search.depositCents,
      successUrl: `${origin}/employers/deposit/success?search=${search.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/employers/deposit/cancel?search=${search.id}`,
    });
    setSearchCheckout(search.id, "checkout_started", session.id);
    redirect(session.url);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    fail(path, error instanceof Error ? error.message : "Stripe did not open.");
  }
}

export async function recordPreviewHold(formData: FormData) {
  const id = String(formData.get("searchId") ?? "");
  const path = `/employers/checkout?search=${encodeURIComponent(id)}`;
  const search = getSearch(id);
  if (!search) fail("/employers/start", "That search is gone. Start again.");
  const mode = readStripeMode();
  if (!mode.ok && mode.reason === "live") fail(path, "Refusing a live Stripe key. Nothing was charged.");
  if (mode.ok) fail(path, "A test key is set. Use Stripe Checkout instead of the preview hold.");
  setSearchCheckout(search.id, "preview_recorded", null);
  redirect(`/employers/deposit/success?search=${search.id}&preview=1`);
}

export async function saveShortlist(id: string | null, formData: FormData) {
  await requireAdmin();
  const path = id ? `/admin/shortlists/${id}` : "/admin/shortlists/new";
  const parsed = readShortlistForm(formData);
  if (!parsed.ok) fail(path, parsed.error);
  const known = new Set(listCandidates().map((candidate) => candidate.id));
  const candidateIds = parsed.data.candidateIds.filter((candidateId) => known.has(candidateId));
  const existing = id ? getShortlist(id) : null;
  if (id && !existing) fail("/admin/shortlists", "That shortlist is gone.");
  const intent = String(formData.get("intent") ?? "save");
  const isPublished = intent === "publish" ? true : intent === "unpublish" ? false : Boolean(existing?.isPublished);
  if (isPublished && candidateIds.length === 0) {
    fail(path, "Add at least one candidate before publishing.");
  }
  const next = { ...parsed.data, isPublished, candidateIds };
  if (id) {
    updateShortlist(id, next);
    redirect(`/admin/shortlists/${id}?saved=1`);
  }
  const created = createShortlist(next);
  redirect(`/admin/shortlists/${created}?saved=1`);
}

export async function createLibrarySection(formData: FormData) {
  await requireAdmin();
  try {
    await (
      await trainingLibrary()
    ).createSection({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
    });
  } catch (error) {
    fail("/admin/library", error instanceof TrainingError ? error.message : "Could not add that section.");
  }
  redirect("/admin/library?saved=1");
}

export async function addLibraryAsset(formData: FormData) {
  await requireAdmin();
  const kind = String(formData.get("kind") ?? "") as "video" | "pdf" | "doc" | "image" | "link";
  const file = formData.get("file");
  try {
    const library = await trainingLibrary();
    await library.addAsset({
      sectionId: String(formData.get("sectionId") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      kind,
      externalUrl: String(formData.get("externalUrl") ?? ""),
      file:
        file instanceof File && file.size > 0
          ? { filename: file.name, mime: file.type, bytes: new Uint8Array(await file.arrayBuffer()) }
          : null,
    });
  } catch (error) {
    fail("/admin/library", error instanceof TrainingError ? error.message : "Could not add that file.");
  }
  redirect("/admin/library?saved=1");
}

export async function deleteLibraryAsset(formData: FormData) {
  await requireAdmin();
  await (await trainingLibrary()).deleteAsset(String(formData.get("id") ?? ""));
  redirect("/admin/library?saved=1");
}
