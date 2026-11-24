import { z } from "zod";

const email = z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email.");

export function zodMessage(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

function numberOrNull(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim().replace(/[$,]/g, "");
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

const candidateFields = z.object({
  realName: z.string().trim().min(2, "Enter the candidate's name.").max(80),
  phone: z.string().trim().min(7, "Enter a phone number.").max(30),
  email: email.max(120),
  interviewNotes: z.string().trim().min(40, "Interview notes need at least a short paragraph.").max(8000),
  country: z.enum(["EG", "BZ", "OTHER"]),
  city: z.string().trim().min(2, "Enter a city.").max(80),
  roleTitle: z.string().trim().min(2, "Enter the role.").max(80),
  monthlyPay: z.number().int().min(0).max(100_000).nullable(),
  startDate: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/, "Use a start date."),
  yearsExperience: z.number().int().min(0).max(60).nullable(),
  availability: z.string().trim().max(160),
  willingToOverlap: z.string().trim().max(160),
  skills: z.array(z.string().trim().min(1).max(40)).max(8),
  highlights: z.array(z.string().trim().max(160)).length(3),
  headline: z.string().trim().max(140),
  summary: z.string().trim().max(1200),
  background: z.string().trim().max(1200),
  experience: z.string().trim().max(1200),
  personality: z.string().trim().max(800),
  lookingFor: z.string().trim().max(1200),
  isSample: z.boolean(),
});

export function readCandidateForm(formData: FormData) {
  const monthly = numberOrNull(formData.get("monthlyPay"));
  const years = numberOrNull(formData.get("yearsExperience"));
  const parsed = candidateFields.safeParse({
    realName: formData.get("realName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    interviewNotes: formData.get("interviewNotes"),
    country: formData.get("country"),
    city: formData.get("city"),
    roleTitle: formData.get("roleTitle"),
    monthlyPay: monthly == null ? null : Math.round(monthly),
    startDate: String(formData.get("startDate") ?? ""),
    yearsExperience: years == null ? null : Math.round(years),
    availability: formData.get("availability") ?? "",
    willingToOverlap: formData.get("willingToOverlap") ?? "",
    skills: String(formData.get("skills") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    highlights: [formData.get("highlight1") ?? "", formData.get("highlight2") ?? "", formData.get("highlight3") ?? ""],
    headline: formData.get("headline") ?? "",
    summary: formData.get("summary") ?? "",
    background: formData.get("background") ?? "",
    experience: formData.get("experience") ?? "",
    personality: formData.get("personality") ?? "",
    lookingFor: formData.get("lookingFor") ?? "",
    isSample: formData.get("isSample") === "on",
  });
  if (!parsed.success) return { ok: false as const, error: zodMessage(parsed.error) };
  if (Number.isNaN(monthly) || Number.isNaN(years)) return { ok: false as const, error: "Pay and years should be numbers." };
  const intent = String(formData.get("intent") ?? "save");
  if (intent === "publish") {
    const filled = parsed.data.highlights.filter(Boolean);
    if (filled.length < 3) return { ok: false as const, error: "Add three checklist lines before publishing." };
    if (!parsed.data.headline || !parsed.data.summary) {
      return { ok: false as const, error: "Add a headline and summary, or generate a draft first." };
    }
  }
  return { ok: true as const, data: { ...parsed.data, intent } };
}

const jobFields = z.object({
  title: z.string().trim().min(8, "Give the role a title.").max(140),
  slug: z.string().trim().max(140),
  description: z.string().trim().min(80, "The description needs a few sentences.").max(8000),
  datePosted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a posted date."),
  validThrough: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid-through date."),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY"]),
  hiringOrganization: z.string().trim().min(2, "Name the hiring company.").max(120),
  country: z.enum(["EG", "BZ", "OTHER"]),
  locationLabel: z.string().trim().min(2, "Name the location.").max(120),
  salaryMin: z.number().int().min(0).nullable(),
  salaryMax: z.number().int().min(0).nullable(),
  salaryUnit: z.enum(["", "YEAR", "HOUR", "MONTH"]),
  isSample: z.boolean(),
});

export function readJobForm(formData: FormData) {
  const salaryMin = numberOrNull(formData.get("salaryMin"));
  const salaryMax = numberOrNull(formData.get("salaryMax"));
  const parsed = jobFields.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") ?? "",
    description: formData.get("description"),
    datePosted: formData.get("datePosted"),
    validThrough: formData.get("validThrough"),
    employmentType: formData.get("employmentType"),
    hiringOrganization: formData.get("hiringOrganization"),
    country: formData.get("country"),
    locationLabel: formData.get("locationLabel"),
    salaryMin: salaryMin == null ? null : Math.round(salaryMin),
    salaryMax: salaryMax == null ? null : Math.round(salaryMax),
    salaryUnit: formData.get("salaryUnit") ?? "",
    isSample: formData.get("isSample") === "on",
  });
  if (!parsed.success) return { ok: false as const, error: zodMessage(parsed.error) };
  if (Number.isNaN(salaryMin) || Number.isNaN(salaryMax)) return { ok: false as const, error: "Pay amounts should be numbers." };
  if (parsed.data.validThrough < parsed.data.datePosted) {
    return { ok: false as const, error: "Valid through should be on or after the posted date." };
  }
  if (parsed.data.salaryMin != null && parsed.data.salaryMax != null && parsed.data.salaryMax < parsed.data.salaryMin) {
    return { ok: false as const, error: "The top of the pay range is below the bottom." };
  }
  return { ok: true as const, data: { ...parsed.data, publish: formData.get("intent") === "publish" } };
}

const requestFields = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  company: z.string().trim().min(2, "Enter your company.").max(120),
  email: email.max(120),
  phone: z.string().trim().min(7, "Enter a phone number.").max(30),
  message: z.string().trim().min(10, "Add a short note.").max(2000),
  preferredTimes: z.string().trim().max(500),
  candidateId: z.string().min(1, "Choose a candidate."),
});

export function readRequestForm(formData: FormData) {
  if (String(formData.get("website") ?? "").trim()) return { ok: false as const, error: "spam" as const };
  const parsed = requestFields.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    preferredTimes: formData.get("preferredTimes") ?? "",
    candidateId: formData.get("candidateId"),
  });
  if (!parsed.success) return { ok: false as const, error: zodMessage(parsed.error) };
  return { ok: true as const, data: parsed.data };
}

const intakeFields = z.object({
  contactName: z.string().trim().min(2, "Enter your name.").max(80),
  company: z.string().trim().min(2, "Enter the company.").max(120),
  email: email.max(120),
  phone: z.string().trim().min(7, "Enter a phone number.").max(30),
  roleTitle: z.string().trim().min(2, "Name the seat you want to fill.").max(120),
  salary: z.number().int().min(18_000, "Enter a first-year salary of at least $18,000.").max(500_000),
  notes: z.string().trim().max(4000),
});

export function readIntakeForm(formData: FormData) {
  if (String(formData.get("website") ?? "").trim()) return { ok: false as const, error: "spam" as const };
  const salary = numberOrNull(formData.get("salary"));
  const parsed = intakeFields.safeParse({
    contactName: formData.get("contactName"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    roleTitle: formData.get("roleTitle"),
    salary: salary == null ? Number.NaN : Math.round(salary),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { ok: false as const, error: zodMessage(parsed.error) };
  if (Number.isNaN(salary)) return { ok: false as const, error: "Enter the first-year salary as a number." };
  return { ok: true as const, data: parsed.data };
}

const shortlistFields = z.object({
  title: z.string().trim().min(2, "Name the shortlist.").max(120),
  preparedFor: z.string().trim().min(2, "Say who it is for.").max(120),
  intro: z.string().trim().max(2000),
  employerId: z.string(),
  isSample: z.boolean(),
});

export function readShortlistForm(formData: FormData) {
  const parsed = shortlistFields.safeParse({
    title: formData.get("title"),
    preparedFor: formData.get("preparedFor"),
    intro: formData.get("intro") ?? "",
    employerId: String(formData.get("employerId") ?? ""),
    isSample: formData.get("isSample") === "on",
  });
  if (!parsed.success) return { ok: false as const, error: zodMessage(parsed.error) };
  const candidateIds = formData.getAll("candidateId").map(String).filter(Boolean);
  return {
    ok: true as const,
    data: {
      ...parsed.data,
      employerId: parsed.data.employerId || null,
      isPublished: formData.get("intent") === "publish",
      candidateIds,
    },
  };
}
