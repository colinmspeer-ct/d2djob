export type BrandId = "vaccelerating" | "outboundrep" | "inboundrep";

type BrandFaq = {
  question: string;
  answer: string;
};

export type BrandConfig = {
  id: BrandId;
  name: string;
  domain: string;
  parentBrand: string;
  audience: string;
  siteTag: string;
  accentClass: string;
  quote: string;
  h1: string;
  intro: string;
  leadCta: string;
  pricingDefaults: {
    successFeePercent: number;
    depositCents: number;
    replacementDays: number;
  };
  roleTracks: string[];
  keywords: string[];
  serviceSummary: string;
  faq: BrandFaq[];
};

export const brandIds = ["vaccelerating", "outboundrep", "inboundrep"] as const satisfies readonly BrandId[];

export const brandConfigs: Record<BrandId, BrandConfig> = {
  vaccelerating: {
    id: "vaccelerating",
    name: "Vaccelerating",
    domain: "vaccelerating.com",
    parentBrand: "Swyft International",
    audience: "US teams hiring offshore virtual assistants and remote support talent.",
    siteTag: "vaccelerating",
    accentClass: "bg-[#1f5eff] text-white",
    quote: "“Need offshore talent this month? Start with a shortlist instead of a resume flood.”",
    h1: "Offshore virtual assistants and remote talent, shortlisted for your role.",
    intro:
      "Vaccelerating helps US operators hire offshore remote talent through a structured shortlist process. Candidate examples are fictional placeholders until live candidates are approved.",
    leadCta: "Start a Vaccelerating search",
    pricingDefaults: {
      successFeePercent: 33,
      depositCents: 50_000,
      replacementDays: 90,
    },
    roleTracks: [
      "Virtual assistants",
      "Executive assistants",
      "Customer support",
      "Bookkeeping and admin support",
      "Operations support",
    ],
    keywords: [
      "offshore virtual assistant placement",
      "remote talent recruiting",
      "virtual assistant staffing for US companies",
    ],
    serviceSummary:
      "Offshore virtual assistant and remote operations talent placement with shortlist packets, interview coordination, and replacement support.",
    faq: [
      {
        question: "Do we pay Vaccelerating or the hire directly?",
        answer:
          "You pay the hire directly. Vaccelerating invoices a placement fee when the hire starts, using editable fee settings.",
      },
      {
        question: "When is the search deposit required?",
        answer:
          "The deposit applies only when a new search must be opened. If there is already a fit in the database, the search can proceed without a new-search deposit.",
      },
      {
        question: "Are the sample candidates real people?",
        answer:
          "No. Any sample candidate cards shown in preview are fictional placeholders used to demonstrate the shortlist packet format.",
      },
    ],
  },
  outboundrep: {
    id: "outboundrep",
    name: "OutboundRep",
    domain: "outboundrep.com",
    parentBrand: "Swyft International",
    audience: "Home service and pest control operators hiring outbound sales reps.",
    siteTag: "outboundrep",
    accentClass: "bg-[#0f766e] text-white",
    quote: "“Outbound seats fail on speed. OutboundRep is built to shorten time-to-first-call.”",
    h1: "Recruiting and placement for outbound sales reps in home service and pest control.",
    intro:
      "OutboundRep focuses on outbound revenue roles: cold callers, appointment setters, SDRs, and dialers. Preview data and sample profiles are fictional placeholders.",
    leadCta: "Start an OutboundRep search",
    pricingDefaults: {
      successFeePercent: 33,
      depositCents: 50_000,
      replacementDays: 90,
    },
    roleTracks: [
      "Cold callers",
      "Appointment setters",
      "SDRs",
      "Dialers",
      "Outbound sales coordinators",
    ],
    keywords: [
      "outbound sales rep recruiting",
      "appointment setter staffing",
      "SDR placement for home service companies",
    ],
    serviceSummary:
      "Outbound sales recruiting desk with candidate intake, profile generation, shortlist packets, and meeting request workflows.",
    faq: [
      {
        question: "What outbound roles are supported?",
        answer:
          "OutboundRep supports cold callers, appointment setters, SDRs, and dialer-heavy roles for home service and pest control teams.",
      },
      {
        question: "Can fee settings be changed by brand?",
        answer:
          "Yes. Fee percentage, search deposit, and replacement window are editable settings and can be tuned per brand later.",
      },
      {
        question: "Does this preview use live payment keys?",
        answer:
          "No. Stripe remains in test mode only for preview. Live keys are intentionally not used in this branch.",
      },
    ],
  },
  inboundrep: {
    id: "inboundrep",
    name: "InboundRep",
    domain: "inboundrep.com",
    parentBrand: "Swyft International",
    audience: "Teams hiring inbound call, CSR, receptionist, and retention-focused reps.",
    siteTag: "inboundrep",
    accentClass: "bg-[#7c3aed] text-white",
    quote: "“Inbound staffing breaks when calls stack up. InboundRep centers reliability and retention workflows.”",
    h1: "Inbound rep recruiting for CSR, receptionist, and retention-focused call flows.",
    intro:
      "InboundRep is tuned for inbound call handling, customer service, and office support roles, including pest control cancellation saves and reservice scheduling support. Sample records are fictional placeholders.",
    leadCta: "Start an InboundRep search",
    pricingDefaults: {
      successFeePercent: 33,
      depositCents: 50_000,
      replacementDays: 90,
    },
    roleTracks: [
      "Inbound call reps",
      "CSR teams",
      "Receptionists",
      "Cancellation and retention specialists",
      "Reservice schedulers",
    ],
    keywords: [
      "inbound call center staffing",
      "CSR recruitment for pest control",
      "remote receptionist placement",
    ],
    serviceSummary:
      "Inbound recruiting desk for call handling and retention support roles with shortlist packets, role posts, and training-library access controls.",
    faq: [
      {
        question: "Does InboundRep handle retention saves and reservice scheduling?",
        answer:
          "Yes. The brand scope includes cancellation-save and reservice scheduling workflows, especially for pest control teams.",
      },
      {
        question: "Are app logins and training access included?",
        answer:
          "Yes. The shared app pattern includes signed login, admin desk access, and a training library behind login.",
      },
      {
        question: "Is this already deployed to a live domain?",
        answer:
          "No. This is a preview branch only, with no DNS changes and no production deployment in this workstream.",
      },
    ],
  },
};

export function getBrandConfig(brand: string) {
  if (brand in brandConfigs) return brandConfigs[brand as BrandId];
  return null;
}

export function brandStaticParams() {
  return brandIds.map((brand) => ({ brand }));
}
