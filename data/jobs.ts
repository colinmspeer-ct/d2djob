export type SampleJob = {
  slug: string
  title: string
  description: string
  datePosted: string
  validThrough: string
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY"
  hiringOrganization: string
  industrySlug: string
  locationSlug: string
  salaryMin: number | null
  salaryMax: number | null
  salaryUnit: "HOUR" | "WEEK" | "MONTH" | "YEAR" | null
  commissionNote: string
}

const through = "2027-04-30"
const org = "D2D Job"

export const sampleJobs: SampleJob[] = [
  {
    slug: "door-to-door-fiber-sales-raleigh-nc",
    title: "Door-to-Door Fiber Sales Representative — Raleigh, NC",
    description:
      "Sample listing for this preview. This is not a live opening.\n\nD2D Job is showing a door-to-door fiber sales seat in Raleigh, North Carolina. The work is residential fiber: neighborhoods, a route, and a daily number. Reps are out with a team rather than waiting on inbound calls.\n\nThe sample pay is a base of $42,000–$55,000 a year plus commission on installed accounts. The week matters more than a one-day spike. Full-time. Raleigh is an official AT&T Fiber market, which is why this city has a fiber listing.\n\nHiring in this preview runs through the D2D Job desk at Swyft Marketing. Treat the record as a sample of how a posting is structured, not as an active requisition.",
    datePosted: "2026-10-20",
    validThrough: through,
    employmentType: "FULL_TIME",
    hiringOrganization: org,
    industrySlug: "fiber",
    locationSlug: "raleigh-nc",
    salaryMin: 42000,
    salaryMax: 55000,
    salaryUnit: "YEAR",
    commissionNote: "Commission on installed fiber accounts, on top of the base.",
  },
  {
    slug: "d2d-fiber-sales-charlotte-nc",
    title: "D2D Fiber Sales Representative — Charlotte, NC",
    description:
      "Sample listing for this preview. This is not a live opening.\n\nThis d2d sales job is a residential fiber route in Charlotte, North Carolina. The day is doors in assigned neighborhoods, a short explanation of the install, and a clean handoff when the account is sold.\n\nSample pay is $45,000–$70,000 a year plus commission. Full-time, with a team. Charlotte is an official AT&T Fiber market.\n\nThe listing exists so the jobs hub has a real JobPosting record to read. It is demo data owned by the D2D Job desk, not a requisition from a carrier.",
    datePosted: "2026-10-22",
    validThrough: through,
    employmentType: "FULL_TIME",
    hiringOrganization: org,
    industrySlug: "fiber",
    locationSlug: "charlotte-nc",
    salaryMin: 45000,
    salaryMax: 70000,
    salaryUnit: "YEAR",
    commissionNote: "Commission on top of base for installed accounts.",
  },
  {
    slug: "fiber-sales-consultant-atlanta-ga",
    title: "Fiber Sales Consultant — Atlanta, GA",
    description:
      "Sample listing for this preview. This is not a live opening.\n\nDoor-to-door fiber sales in Atlanta, Georgia. The consultant works a set of neighborhoods, explains service in plain language, and is judged on installed accounts rather than conversations started.\n\nSample pay is $48,000–$75,000 a year plus commission. Full-time. Atlanta is an official AT&T Fiber market, so a fiber geo page exists for this city. The same kind of fiber page is not generated for cities AT&T Fiber does not serve.\n\nPosted by the D2D Job desk as sample data.",
    datePosted: "2026-10-28",
    validThrough: through,
    employmentType: "FULL_TIME",
    hiringOrganization: org,
    industrySlug: "fiber",
    locationSlug: "atlanta-ga",
    salaryMin: 48000,
    salaryMax: 75000,
    salaryUnit: "YEAR",
    commissionNote: "Commission on installed accounts in addition to base pay.",
  },
  {
    slug: "door-to-door-pest-control-cherry-hill-nj",
    title: "Door-to-Door Pest Control Sales — Cherry Hill, NJ",
    description:
      "Sample listing for this preview. This is not a live opening.\n\nA seasonal door-to-door pest control sales route based in Cherry Hill, New Jersey, covering nearby South Jersey towns. The conversations are mosquito, ant, and general pest programs, with termite when the house calls for it.\n\nSample pay is $18–$28 an hour plus commission on closed accounts. The season in this sample runs spring through early fall. Temporary employment. This is pest control, not fiber. New Jersey is not an AT&T Fiber market, and this listing does not pretend otherwise.\n\nDemo record from the D2D Job desk.",
    datePosted: "2026-10-18",
    validThrough: through,
    employmentType: "TEMPORARY",
    hiringOrganization: org,
    industrySlug: "pest-control",
    locationSlug: "cherry-hill-nj",
    salaryMin: 18,
    salaryMax: 28,
    salaryUnit: "HOUR",
    commissionNote: "Commission on closed pest accounts, on top of the hourly rate.",
  },
  {
    slug: "roofing-sales-lancaster-pa",
    title: "Roofing Sales Representative — Lancaster, PA",
    description:
      "Sample listing for this preview. This is not a live opening.\n\nDoor-to-door and inspection-based roofing sales in Lancaster County, Pennsylvania. The work mixes retail appointments and storm canvas after hail. The rep sets the inspection, walks the roof, and prices the job.\n\nThis sample is commission-only. There is no base salary on the record. Pay is commission on signed roofs. Full-time, including travel when a storm hits the region. Lancaster is not an AT&T Fiber market. Roofing can still be listed here.\n\nDemo record from the D2D Job desk.",
    datePosted: "2026-11-01",
    validThrough: through,
    employmentType: "FULL_TIME",
    hiringOrganization: org,
    industrySlug: "roofing",
    locationSlug: "lancaster-pa",
    salaryMin: null,
    salaryMax: null,
    salaryUnit: null,
    commissionNote: "Commission on signed roofs. No base salary on this sample listing.",
  },
  {
    slug: "window-and-door-sales-west-chester-pa",
    title: "Window and Door Sales Consultant — West Chester, PA",
    description:
      "Sample listing for this preview. This is not a live opening.\n\nIn-home window and door sales in West Chester, Pennsylvania, and the rest of Chester County. Most days are set appointments. The consultant also knocks to refill cancellations.\n\nSample pay is $45,000–$70,000 a year plus commission on installed projects. Full-time, with a small team and a defined territory. Chester County is a Philadelphia suburb in this data set. It is not an AT&T Fiber market, so this page is windows and doors only.\n\nDemo record from the D2D Job desk.",
    datePosted: "2026-10-25",
    validThrough: through,
    employmentType: "FULL_TIME",
    hiringOrganization: org,
    industrySlug: "windows-doors",
    locationSlug: "west-chester-pa",
    salaryMin: 45000,
    salaryMax: 70000,
    salaryUnit: "YEAR",
    commissionNote: "Commission on installed window and door projects, on top of base.",
  },
  {
    slug: "exterior-cleaning-sales-chicago-il",
    title: "Exterior Cleaning Sales — Chicago, IL",
    description:
      "Sample listing for this preview. This is not a live opening.\n\nDoor-to-door exterior cleaning sales in Chicago. The offer is house washes, concrete, and gutters for residential customers on the north and northwest sides and the close suburbs.\n\nSample pay is $42,000–$65,000 a year plus commission. Full-time. A crew lead who can train a second rep is a fit. Chicago is outside AT&T Fiber's markets. This listing is exterior cleaning only.\n\nDemo record from the D2D Job desk.",
    datePosted: "2026-11-03",
    validThrough: through,
    employmentType: "FULL_TIME",
    hiringOrganization: org,
    industrySlug: "exterior-cleaning",
    locationSlug: "chicago-il",
    salaryMin: 42000,
    salaryMax: 65000,
    salaryUnit: "YEAR",
    commissionNote: "Commission on completed exterior cleaning jobs, on top of base.",
  },
  {
    slug: "window-cleaning-sales-boston-ma",
    title: "Door-to-Door Window Cleaning Sales — Boston, MA",
    description:
      "Sample listing for this preview. This is not a live opening.\n\nSeasonal door-to-door window cleaning sales in Boston. Routes cover residential buildings and small storefronts. The season in this sample is spring and summer.\n\nSample pay is $20–$30 an hour plus a small commission on booked routes. Temporary employment. Boston is in New England, which is not an AT&T Fiber market. This listing stays on window cleaning.\n\nDemo record from the D2D Job desk.",
    datePosted: "2026-11-06",
    validThrough: through,
    employmentType: "TEMPORARY",
    hiringOrganization: org,
    industrySlug: "window-cleaning",
    locationSlug: "boston-ma",
    salaryMin: 20,
    salaryMax: 30,
    salaryUnit: "HOUR",
    commissionNote: "Small commission on booked window cleaning routes, on top of the hourly rate.",
  },
]
