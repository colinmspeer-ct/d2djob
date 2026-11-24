export type SampleCandidate = {
  id: string;
  slug: string;
  realName: string;
  phone: string;
  email: string;
  country: "EG" | "BZ";
  city: string;
  roleTitle: string;
  headline: string;
  summary: string;
  background: string;
  experience: string;
  personality: string;
  lookingFor: string;
  highlights: [string, string, string];
  skills: string[];
  monthlyPayCents: number;
  startDate: string;
  yearsExperience: number;
  availability: string;
  willingToOverlap: string;
  interviewNotes: string;
};

export const sampleCandidates: SampleCandidate[] = [
  {
    id: "cand-amira",
    slug: "amira-el-masry",
    realName: "Amira El-Masry",
    phone: "555-0101",
    email: "amira.elmasry@example.com",
    country: "EG",
    city: "Cairo",
    roleTitle: "Bilingual client success",
    headline: "Client success from Cairo, on a US afternoon shift",
    summary:
      "Amira keeps a subscription help desk calm. She writes the ticket note before she closes it, and she is used to US customers who want a straight answer.",
    background:
      "Fictional preview profile. Four years on a subscription desk covering refunds, saves, and the odd angry renewal. Based in Cairo.",
    experience: "Zendesk, macros, and a weekly quality review she actually reads.",
    personality: "Warm on the phone, brief in writing.",
    lookingFor: "A support seat with a clear refund policy and overlap into the US East afternoon.",
    highlights: [
      "Handles US customers in English from a Cairo afternoon shift",
      "Four years on a subscription help desk, including refunds and saves",
      "Writes the ticket note before she closes it",
    ],
    skills: ["Zendesk", "English", "Quality review"],
    monthlyPayCents: 185_000,
    startDate: "2026-12-07",
    yearsExperience: 4,
    availability: "Sunday–Thursday, overlapping US East afternoon",
    willingToOverlap: "1pm–9pm US Eastern",
    interviewNotes:
      "Fictional interview. Amira has spent four years on a subscription help desk in Cairo. She handles refunds and saves, writes the note before closing the ticket, and can overlap a US East afternoon. She wants a team with a written refund policy.",
  },
  {
    id: "cand-youssef",
    slug: "youssef-darwish",
    realName: "Youssef Darwish",
    phone: "555-0102",
    email: "youssef.darwish@example.com",
    country: "EG",
    city: "Alexandria",
    roleTitle: "Bookkeeper",
    headline: "Monthly close from Alexandria",
    summary:
      "Youssef closes a small set of books without being chased. He reconciles two accounts in QuickBooks and flags a sales-tax question instead of guessing.",
    background: "Fictional preview profile. Six years of bookkeeping for a trading office and a clinic, both on QuickBooks.",
    experience: "Operating account, payroll account, and a monthly packet the owner can read.",
    personality: "Quiet, specific, and unwilling to invent a number.",
    lookingFor: "A bookkeeping seat with a US chart of accounts and a person who answers questions the same week.",
    highlights: [
      "Closes a monthly set of books without being chased",
      "Reconciles operating and payroll accounts in QuickBooks",
      "Flags a sales-tax question instead of guessing",
    ],
    skills: ["QuickBooks", "Excel", "Accounts payable"],
    monthlyPayCents: 160_000,
    startDate: "2026-12-14",
    yearsExperience: 6,
    availability: "Sunday–Thursday",
    willingToOverlap: "US East morning standup",
    interviewNotes:
      "Fictional interview. Youssef closes books for a clinic and a small trader in Alexandria. He uses QuickBooks and Excel, reconciles two bank accounts, and will not guess on sales tax.",
  },
  {
    id: "cand-nour",
    slug: "nour-farid",
    realName: "Nour Farid",
    phone: "555-0103",
    email: "nour.farid@example.com",
    country: "EG",
    city: "Giza",
    roleTitle: "Appointment setter",
    headline: "Sets the meeting and leaves the price alone",
    summary:
      "Nour books the calendar and does not negotiate. Every call ends with a CRM note that says why the person agreed to a time.",
    background: "Fictional preview profile. Three years setting appointments for a language school and a home-services reseller.",
    experience: "A dialer, a short script, and a habit of logging the objection.",
    personality: "Even tone. Does not fill silence with a discount.",
    lookingFor: "An appointment-setting seat where someone else owns the close.",
    highlights: [
      "Books the meeting and leaves the price conversation to the closer",
      "Leaves a CRM note with the reason the person said yes",
      "Can work a US morning block, Sunday through Thursday",
    ],
    skills: ["Dialer", "CRM notes", "Bilingual"],
    monthlyPayCents: 140_000,
    startDate: "2027-01-04",
    yearsExperience: 3,
    availability: "US morning block",
    willingToOverlap: "8am–12pm US Eastern",
    interviewNotes:
      "Fictional interview. Nour sets appointments from Giza. She is bilingual, uses a dialer, writes a CRM note every time, and will not quote a price on the call.",
  },
  {
    id: "cand-maya",
    slug: "maya-pollard",
    realName: "Maya Pollard",
    phone: "555-0104",
    email: "maya.pollard@example.com",
    country: "BZ",
    city: "Belize City",
    roleTitle: "Executive assistant",
    headline: "Keeps a founder’s calendar honest",
    summary:
      "Maya runs a calendar across US time zones and drafts email the sender can send unchanged. She has supported a home-services owner before.",
    background: "Fictional preview profile. Five years as an assistant in Belize City, including vendor booking and travel.",
    experience: "Notion, calendar holds, and a weekly list of what actually moved.",
    personality: "Polite and hard to rattle. Will tell you when the day is overbooked.",
    lookingFor: "One founder, not a pool of six people sharing her.",
    highlights: [
      "Keeps a founder’s calendar honest across US time zones",
      "Drafts short email the sender can send unchanged",
      "Has booked travel and vendors for a home-services owner",
    ],
    skills: ["Calendar", "Notion", "Travel"],
    monthlyPayCents: 210_000,
    startDate: "2026-12-09",
    yearsExperience: 5,
    availability: "Weekdays, US Central overlap",
    willingToOverlap: "9am–4pm US Central",
    interviewNotes:
      "Fictional interview. Maya is an assistant in Belize City. She runs calendars in Notion, drafts short email, and has booked travel for a home-services owner. She wants one principal.",
  },
  {
    id: "cand-keisha",
    slug: "keisha-usher",
    realName: "Keisha Usher",
    phone: "555-0105",
    email: "keisha.usher@example.com",
    country: "BZ",
    city: "Belmopan",
    roleTitle: "Customer support lead",
    headline: "A support lead who writes the macros",
    summary:
      "Keisha has coached a team of four. She turns repeated tickets into macros and will not promise a refund she is not allowed to give.",
    background: "Fictional preview profile. Seven years in customer support in Belmopan, the last two as the person the others ask.",
    experience: "Help desk queues, shift notes, and a coaching doc that fits on one page.",
    personality: "Calm in a backlog. Precise about what the policy allows.",
    lookingFor: "A small support team that already has a policy, not a blank page.",
    highlights: [
      "Has coached a team of four on tone and speed",
      "Turns repeated tickets into macros the team uses",
      "Will not promise a refund she is not allowed to give",
    ],
    skills: ["Help desk", "Coaching", "Macros"],
    monthlyPayCents: 190_000,
    startDate: "2026-12-21",
    yearsExperience: 7,
    availability: "Weekdays",
    willingToOverlap: "US Central business hours",
    interviewNotes:
      "Fictional interview. Keisha leads support from Belmopan. She coached four people, writes macros, and refuses refund promises that break policy.",
  },
  {
    id: "cand-luis",
    slug: "luis-caliz",
    realName: "Luis Caliz",
    phone: "555-0106",
    email: "luis.caliz@example.com",
    country: "BZ",
    city: "San Ignacio",
    roleTitle: "Sales development",
    headline: "Outbound that does not inflate the dial count",
    summary:
      "Luis holds a morning of outbound calls, asks who decides before he offers a time, and stops when a prospect is outside the service area.",
    background: "Fictional preview profile. Four years of outbound for a distributor, working from San Ignacio.",
    experience: "HubSpot tasks, a written daily count, and discovery questions he does not skip.",
    personality: "Patient. Not a hype voice.",
    lookingFor: "An SDR seat with a real service area and a closer who takes the meeting.",
    highlights: [
      "Holds a morning of outbound calls without inflating the count",
      "Asks who decides before he offers a time",
      "Stops when a prospect is outside the service area",
    ],
    skills: ["Outbound", "HubSpot", "Discovery"],
    monthlyPayCents: 175_000,
    startDate: "2027-01-11",
    yearsExperience: 4,
    availability: "Weekday mornings",
    willingToOverlap: "US Central morning",
    interviewNotes:
      "Fictional interview. Luis runs outbound from San Ignacio. He uses HubSpot, qualifies before booking, and will not dial outside the stated service area.",
  },
];

export function assertSampleMarkets(list: SampleCandidate[] = sampleCandidates) {
  for (const candidate of list) {
    if (candidate.country !== "EG" && candidate.country !== "BZ") {
      throw new Error(`${candidate.realName} is not an Egypt or Belize example.`);
    }
    if (candidate.highlights.length !== 3) {
      throw new Error(`${candidate.realName} needs three checklist lines.`);
    }
    const blob = `${candidate.summary} ${candidate.headline} ${candidate.highlights.join(" ")}`;
    if (blob.includes("@") || /\d{3}[-.\s]\d{3}[-.\s]\d{4}/.test(blob)) {
      throw new Error(`${candidate.realName} leaks contact details on the public card.`);
    }
  }
}
