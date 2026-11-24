function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function pseudonymFromName(realName: string) {
  const parts = realName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Candidate";
  const first = parts[0]!;
  const firstLabel = first.charAt(0).toUpperCase() + first.slice(1);
  if (parts.length === 1) return firstLabel;
  const last = parts[parts.length - 1]!;
  return `${firstLabel} ${last.charAt(0).toUpperCase()}.`;
}

export function redactNotes(notes: string, realName: string) {
  let text = notes;
  const parts = realName.trim().split(/\s+/).filter(Boolean);
  if (realName.trim().length > 2) {
    text = text.replace(new RegExp(escapeRegExp(realName.trim()), "gi"), parts[0] ?? "the candidate");
  }
  for (const part of parts.slice(1)) {
    if (part.length < 3) continue;
    text = text.replace(new RegExp(`\\b${escapeRegExp(part)}\\b`, "gi"), "");
  }
  text = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "");
  text = text.replace(/\b(?:\+?1[-.\s]*)?(?:\(?\d{3}\)?[-.\s]*)\d{3}[-.\s]*\d{4}\b/g, "");
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .trim();
}

const SKILL_WORDS = [
  "Zendesk",
  "QuickBooks",
  "Excel",
  "HubSpot",
  "Notion",
  "Salesforce",
  "Bilingual",
  "Bookkeeping",
  "Calendar",
];

function clip(value: string, max = 110) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const last = cut.lastIndexOf(" ");
  return `${(last > 40 ? cut.slice(0, last) : cut).trim()}…`;
}

export type GeneratedProfile = {
  pseudonym: string;
  headline: string;
  summary: string;
  background: string;
  experience: string;
  personality: string;
  lookingFor: string;
  highlights: [string, string, string];
  skills: string[];
};

export function generateProfile(input: {
  realName: string;
  interviewNotes: string;
  city: string;
  countryName: string;
  roleTitle: string;
  yearsExperience: number | null;
}): GeneratedProfile {
  const notes = redactNotes(input.interviewNotes, input.realName);
  const pseudonym = pseudonymFromName(input.realName);
  const place = [input.city, input.countryName].filter(Boolean).join(", ") || "their home city";
  const role = input.roleTitle.trim() || "operator";
  const years = input.yearsExperience != null ? `${input.yearsExperience} years in the work` : "Hands-on experience";
  const sentences = notes
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 24);
  const fallback = [
    `${years}, working as a ${role.toLowerCase()} from ${place}.`,
    "Writes the note down before moving to the next task.",
    "Wants a clear owner and overlapping hours with the US team.",
  ];
  const highlights = [0, 1, 2].map((index) => clip(sentences[index] || fallback[index]!)) as [string, string, string];
  const found = SKILL_WORDS.filter((word) => notes.toLowerCase().includes(word.toLowerCase()));
  const skills = (found.length >= 2 ? found : [...found, role, input.countryName || "Remote"]).slice(0, 4);
  return {
    pseudonym,
    headline: `${role} in ${place}`,
    summary: `${pseudonym} is a ${role.toLowerCase()} based in ${place}. ${years}. This draft came from the interview notes. Edit it before you publish.`,
    background: notes.slice(0, 700) || `${pseudonym} is based in ${place}.`,
    experience: `${years}. The public profile should name the tools and the kind of seat, not the private contact details.`,
    personality: "Direct in writing. Replace this line after you have heard them talk.",
    lookingFor: `A ${role.toLowerCase()} seat with one owner and hours that overlap the client.`,
    highlights,
    skills,
  };
}
