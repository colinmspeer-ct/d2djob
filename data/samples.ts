export type SampleCandidate = {
  slug: string
  realName: string
  phone: string
  email: string
  interviewNotes: string
  pseudonym: string
  headline: string
  summary: string
  background: string
  experience: string
  personality: string
  lookingFor: string
  yearsExperience: number
  salesType: string
  availability: string
  willingToTravel: boolean
  payStructure: string
  workStyle: "team" | "solo" | "either"
  schedule: "full-time" | "seasonal" | "either"
  locationSlug: string
  industries: string[]
  publishedAt: string
}

export const sampleCandidates: SampleCandidate[] = [
  {
    slug: "marcus-r",
    realName: "Marcus Reid",
    phone: "(555) 010-1001",
    email: "sample.marcus.reid@example.com",
    interviewNotes:
      "Alex interviewed Marcus Reid on Nov 2. Phone (555) 010-1001, sample.marcus.reid@example.com. Six years of residential fiber around Raleigh, including two years running a three-person crew in the north of the city. Wants a posted daily number, a base plus commission, paid weekly. Will drive the Carolinas. Will not take a pure commission seat and does not want pest. Has a truck. Short script, done when someone says no.",
    pseudonym: "Marcus R.",
    headline: "Six years on fiber routes, and he wants a crew again",
    summary:
      "Marcus R. has knocked residential fiber around Raleigh for six years, including two years running a three-person crew. He wants a full-time seat with a base plus commission, paid weekly, and he will drive the Carolinas. He will not take a pure commission plan.",
    background:
      "Started on summer fiber blitzes and stayed for a full-time book. He is used to a paper route log, a Saturday morning, and a short door script.",
    experience:
      "Residential fiber only. He has trained new reps and kept a crew on a posted daily number. No pest and no roofing.",
    personality: "Direct, early, and finished with the stop once someone says no.",
    lookingFor:
      "Full-time team role, base plus commission, travel inside the Carolinas, no relocation.",
    yearsExperience: 6,
    salesType: "Residential fiber",
    availability: "Weekdays and Saturday mornings",
    willingToTravel: true,
    payStructure: "Base plus commission, paid weekly",
    workStyle: "team",
    schedule: "full-time",
    locationSlug: "raleigh-nc",
    industries: ["fiber"],
    publishedAt: "2026-11-02T15:00:00.000Z",
  },
  {
    slug: "elena-v",
    realName: "Elena Vasquez",
    phone: "(555) 010-1002",
    email: "sample.elena.vasquez@example.com",
    interviewNotes:
      "Elena Vasquez, (555) 010-1002, sample.elena.vasquez@example.com. Three years of residential fiber in Charlotte and the close-in suburbs. Will relocate inside the Southeast for a real territory. Fine on a crew or with a solo book. Wants a base. Not interested in a 1099 summer blitz.",
    pseudonym: "Elena V.",
    headline: "Charlotte fiber rep, open to a move in the Southeast",
    summary:
      "Elena V. has three years of residential fiber in Charlotte and the close-in suburbs. She wants full-time work with a base plus commission and will relocate inside the Southeast for a territory that is actually assigned.",
    background:
      "Came up on neighborhood fiber, not inbound leads. Comfortable explaining the install and the monthly bill in plain language.",
    experience:
      "Three years, residential fiber, mostly single-family routes. She has covered for a lead when the crew was short.",
    personality: "Steady on the door, and specific about what she will not sell.",
    lookingFor:
      "Full-time, base plus commission, open to relocation in the Southeast, team or solo.",
    yearsExperience: 3,
    salesType: "Residential fiber",
    availability: "Weekdays",
    willingToTravel: true,
    payStructure: "Base plus commission",
    workStyle: "either",
    schedule: "full-time",
    locationSlug: "charlotte-nc",
    industries: ["fiber"],
    publishedAt: "2026-11-03T15:00:00.000Z",
  },
  {
    slug: "andre-p",
    realName: "Andre Pell",
    phone: "(555) 010-1003",
    email: "sample.andre.pell@example.com",
    interviewNotes:
      "Andre Pell, (555) 010-1003, sample.andre.pell@example.com. Five summers of pest control out of Cherry Hill. Mosquito, ant, and termite conversations across Camden and Burlington County. Wants April through October, home at night. Not fiber. Hourly plus commission is fine if the season is long.",
    pseudonym: "Andre P.",
    headline: "South Jersey pest routes, and he wants the long season",
    summary:
      "Andre P. has spent five summers knocking pest control out of Cherry Hill, mostly mosquito, ant, and termite stops. He wants April through October with a team, home at night, and he is not looking for a winter book.",
    background:
      "Knows the Camden and Burlington County towns and which blocks are worth a second pass. This is a South Jersey route, not a fiber market.",
    experience:
      "Five seasons of residential pest. Comfortable with a short pitch and a follow-up card. Not a closer for roofs or windows.",
    personality: "Even-tempered. Keeps the day moving and does not argue a no.",
    lookingFor:
      "Seasonal team seat, local only. Hourly plus commission is fine if the season is long enough to matter.",
    yearsExperience: 5,
    salesType: "Residential pest",
    availability: "April through October, days",
    willingToTravel: false,
    payStructure: "Hourly plus commission",
    workStyle: "team",
    schedule: "seasonal",
    locationSlug: "cherry-hill-nj",
    industries: ["pest-control"],
    publishedAt: "2026-11-04T15:00:00.000Z",
  },
  {
    slug: "jordan-h",
    realName: "Jordan Hale",
    phone: "(555) 010-1004",
    email: "sample.jordan.hale@example.com",
    interviewNotes:
      "Jordan Hale, (555) 010-1004, sample.jordan.hale@example.com. Eight years of roofs in Lancaster County, retail appointments and storm canvas. Wants commission-heavy work and will travel for hail. Prefers a solo route or a two-person crew. Not interested in a salary-only office job.",
    pseudonym: "Jordan H.",
    headline: "Lancaster roofing closer who will chase the storm work",
    summary:
      "Jordan H. has eight years selling roofs in Lancaster County, both retail appointments and storm canvas. He wants a commission-heavy book, full-time, and he will travel when hail hits. A solo route or a two-person crew is the fit.",
    background:
      "Learned on retail appointments, then spent several seasons knocking after storms. Sets the inspection before he leaves the step.",
    experience:
      "Residential roofing. Runs his own daily count and does not need a ride-along after the first week.",
    personality:
      "Blunt about price. Patient with a homeowner who needs a spouse, not with a vague offer.",
    lookingFor:
      "Full-time roofing, commission-heavy, will travel for storms, solo or a two-person crew. No relocation for a salary-only seat.",
    yearsExperience: 8,
    salesType: "Residential roofing",
    availability: "Full weeks in storm season, lighter in January",
    willingToTravel: true,
    payStructure: "Commission-heavy",
    workStyle: "solo",
    schedule: "full-time",
    locationSlug: "lancaster-pa",
    industries: ["roofing"],
    publishedAt: "2026-11-05T15:00:00.000Z",
  },
  {
    slug: "sam-t",
    realName: "Sam Tanner",
    phone: "(555) 010-1005",
    email: "sample.sam.tanner@example.com",
    interviewNotes:
      "Sam Tanner, (555) 010-1005, sample.sam.tanner@example.com. Four years of in-home windows and doors in Chester County. Mostly set appointments, will knock to fill a cancellation. Wants a small team, a base, and no out-of-state travel. Lives near West Chester.",
    pseudonym: "Sam T.",
    headline: "In-home window closer in Chester County",
    summary:
      "Sam T. has four years selling windows and doors in Chester County, mostly set appointments with some knocking to fill the day. He wants full-time work with a small team, a base plus commission, and no relocation.",
    background:
      "Knows the difference between a Chester County stop and a Main Line drive. Prefers a defined territory over a random blitz.",
    experience:
      "In-home window and door presentations. Can knock a neighborhood to refill cancellations. Not a roofing canvasser.",
    personality: "Calm at the kitchen table. Writes the price down and stops talking.",
    lookingFor:
      "Full-time, small team, base plus commission, Chester County and the close suburbs. No out-of-state travel.",
    yearsExperience: 4,
    salesType: "In-home windows and doors",
    availability: "Weekdays, one evening a week",
    willingToTravel: false,
    payStructure: "Base plus commission",
    workStyle: "team",
    schedule: "full-time",
    locationSlug: "west-chester-pa",
    industries: ["windows-doors"],
    publishedAt: "2026-11-06T15:00:00.000Z",
  },
  {
    slug: "riley-k",
    realName: "Riley Kim",
    phone: "(555) 010-1006",
    email: "sample.riley.kim@example.com",
    interviewNotes:
      "Riley Kim, (555) 010-1006, sample.riley.kim@example.com. Two seasons of window cleaning sales in Boston, residential triple-deckers and small storefronts. Wants another spring and summer with a team. Will not move. Not fiber, not restoration.",
    pseudonym: "Riley K.",
    headline: "Boston window routes, seasonal, and local only",
    summary:
      "Riley K. has two seasons of window cleaning sales in Boston, mostly residential buildings and small storefronts. He wants another seasonal seat with a team and he is not moving for a job.",
    background:
      "Learned a short route and is more comfortable with repeat business than a one-call close.",
    experience:
      "Two seasons, residential and small storefront window cleaning. Not exterior restoration and not fiber.",
    personality: "Polite, quick, and done with the stop if the person is busy.",
    lookingFor:
      "Seasonal team work in Boston. Hourly plus a small commission. No travel and no winter canvas.",
    yearsExperience: 2,
    salesType: "Residential and small storefront",
    availability: "Spring and summer, weekdays",
    willingToTravel: false,
    payStructure: "Hourly plus a small commission",
    workStyle: "team",
    schedule: "seasonal",
    locationSlug: "boston-ma",
    industries: ["window-cleaning"],
    publishedAt: "2026-11-07T15:00:00.000Z",
  },
  {
    slug: "casey-m",
    realName: "Casey Morgan",
    phone: "(555) 010-1007",
    email: "sample.casey.morgan@example.com",
    interviewNotes:
      "Casey Morgan, (555) 010-1007, sample.casey.morgan@example.com. Seven years of exterior cleaning in Chicago, two of those leading a two-person crew. Wants full-time, base plus commission, and will travel the Midwest. Not interested in a summer-only seat. Not a roofing closer.",
    pseudonym: "Casey M.",
    headline: "Chicago exterior cleaning, seven years, will cover the Midwest",
    summary:
      "Casey M. has seven years selling exterior cleaning in Chicago, including two years leading a two-person crew. She wants full-time work with a base plus commission and will travel the Midwest. A summer-only seat is not the ask.",
    background:
      "House washes, concrete, and gutter conversations on the Northwest Side and the close suburbs. Used to a posted number and a truck.",
    experience:
      "Residential exterior cleaning. Has trained two new reps. Not a roofing closer.",
    personality: "Organized, a little dry, and serious about the schedule.",
    lookingFor:
      "Full-time team lead or senior rep, base plus commission. Midwest travel is fine. Relocation is a conversation, not a requirement.",
    yearsExperience: 7,
    salesType: "Residential exterior cleaning",
    availability: "Weekdays and some Saturdays",
    willingToTravel: true,
    payStructure: "Base plus commission",
    workStyle: "team",
    schedule: "full-time",
    locationSlug: "chicago-il",
    industries: ["exterior-cleaning"],
    publishedAt: "2026-11-08T15:00:00.000Z",
  },
  {
    slug: "devon-l",
    realName: "Devon Lang",
    phone: "(555) 010-1008",
    email: "sample.devon.lang@example.com",
    interviewNotes:
      "Devon Lang, (555) 010-1008, sample.devon.lang@example.com. Three years of siding and exterior products out of King of Prussia, covering Montgomery County and the close suburbs. Wants a full-time team, a base, and to be home every night. Not pest and not fiber. Knows the drive between Montgomery and Bucks.",
    pseudonym: "Devon L.",
    headline: "Siding rep for the Philly suburbs, team, full-time",
    summary:
      "Devon L. has three years selling siding and other exterior products out of King of Prussia, covering Montgomery County and the close suburbs. He wants a full-time team seat with a base plus commission and he will not relocate.",
    background:
      "A mix of set appointments and doors. Knows the difference between a Montgomery County stop and a Bucks County drive.",
    experience:
      "Exteriors, mostly siding. Some window leads handed to a partner. Not pest and not fiber.",
    personality: "Friendly without dragging the stop out. Asks for the next appointment before the close.",
    lookingFor:
      "Full-time team, base plus commission, Philadelphia suburbs only, home every night.",
    yearsExperience: 3,
    salesType: "Residential exteriors",
    availability: "Weekdays, two evenings",
    willingToTravel: false,
    payStructure: "Base plus commission",
    workStyle: "team",
    schedule: "full-time",
    locationSlug: "king-of-prussia-pa",
    industries: ["exteriors"],
    publishedAt: "2026-11-09T15:00:00.000Z",
  },
]
