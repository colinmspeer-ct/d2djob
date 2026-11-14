import type { CityCopy } from "./city-types"

const near = {
  "cherry-hill-nj": ["voorhees-nj", "moorestown-nj", "mount-laurel-nj", "marlton-nj"],
  "voorhees-nj": ["cherry-hill-nj", "marlton-nj", "mount-laurel-nj", "deptford-nj"],
  "mount-laurel-nj": ["moorestown-nj", "marlton-nj", "cherry-hill-nj", "voorhees-nj"],
  "moorestown-nj": ["mount-laurel-nj", "cherry-hill-nj", "marlton-nj", "voorhees-nj"],
  "marlton-nj": ["voorhees-nj", "cherry-hill-nj", "mount-laurel-nj", "deptford-nj"],
  "deptford-nj": ["cherry-hill-nj", "voorhees-nj", "marlton-nj", "mount-laurel-nj"],
  "egg-harbor-township-nj": ["vineland-nj", "deptford-nj", "marlton-nj", "cherry-hill-nj"],
  "vineland-nj": ["egg-harbor-township-nj", "deptford-nj", "marlton-nj", "cherry-hill-nj"],
}

function page(
  key: string,
  city: string,
  h1: string,
  metaTitle: string,
  metaDescription: string,
  paragraphs: string[],
  faqs: CityCopy["faqs"],
): [string, CityCopy] {
  const slug = key.split(":")[1]!
  return [
    key,
    { h1, metaTitle, metaDescription, paragraphs, faqs, nearby: near[slug as keyof typeof near] },
  ]
}

export const southJerseyPages: Record<string, CityCopy> = Object.fromEntries([
  page(
    "pest-control:cherry-hill-nj",
    "Cherry Hill",
    "Pest Control Sales Jobs in Cherry Hill, NJ",
    "Pest Control Jobs in Cherry Hill, NJ",
    "Pest control sales jobs in Cherry Hill, NJ: colonials and split-levels under maple shade, summer mosquitoes, and a South Jersey season.",
    [
      "Pest control sales jobs in Cherry Hill are a township walk, not a beach blitz. Barclay, the Kings Highway side streets, and the older splits toward Erlton are colonials and split-levels with shade, toys in the yard, and mosquitoes by June. Lots are close. You can hit a real count if you stay in one section instead of crossing Route 70 all afternoon.",
      "The person at the door often already has a company. Your job is the reason to switch or to add mosquitoes, not a lecture on bugs. Summer humidity lasts into September. Winter is a thin book. Apartment clusters off the highway are a skip unless someone is standing outside who can start an account.",
    ],
    [
      {
        question: "When is pest knocking worth it in Cherry Hill?",
        answer: "Late spring through early fall, when people will talk about mosquitoes in a shady yard. January is a different, smaller job.",
      },
      {
        question: "Is Cherry Hill a fiber market?",
        answer: "No. This is a pest control page for a South Jersey township. Fiber city pages on this site are the AT&T markets, not Camden County.",
      },
    ],
  ),
  page(
    "roofing:cherry-hill-nj",
    "Cherry Hill",
    "Roofing Sales Jobs in Cherry Hill, NJ",
    "Roofing Sales Jobs in Cherry Hill, NJ",
    "Roofing sales jobs in Cherry Hill, NJ: older splits and colonials, tree debris, retail inspections, and less hail than Lancaster County.",
    [
      "Roofing sales jobs in Cherry Hill are mostly aging asphalt on 1960s and 1970s houses, not a hail chase across open county. Colonials and splits under mature maples drop branches on ridges. The conversation is the soft spots, the flashing at the chimney, and whether they want an inspection, not a storm story imported from the Midwest.",
      "You can set retail inspections on streets where people have lived for decades. They will talk to a spouse. Write the time down. A pure storm blitz is the wrong expectation for this township. If the company wants you in a hotel after every wind event, that is a different book than Cherry Hill.",
    ],
    [
      {
        question: "Is Cherry Hill a storm-canvas roofing town?",
        answer: "Hail is not the daily engine the way it can be farther west. Tree debris and old shingles are the more honest door.",
      },
      {
        question: "Can I knock and be home at night?",
        answer: "A Cherry Hill retail book can be local. Ask before you assume overnight travel. South Jersey traffic is the commute, not a hotel.",
      },
    ],
  ),
  page(
    "windows-doors:cherry-hill-nj",
    "Cherry Hill",
    "Window and Door Sales Jobs in Cherry Hill, NJ",
    "Window Sales Jobs in Cherry Hill, NJ",
    "Window and door sales jobs in Cherry Hill, NJ: kitchen-table appointments in colonials, drafty splits, and knocks that fill a cancellation.",
    [
      "Window and door sales jobs in Cherry Hill are appointments inside houses that have been remodeled in pieces. A colonial on a side street may have a new kitchen and the original single-pane bay. The pitch is that one opening, the price on paper, and a time both decision makers can sit down.",
      "Knocking fills the hole when an appointment cancels. Stay on the same few streets. Jumping to a mall corridor wastes the hour. People here are used to solicitors. Be short. If they cannot decide alone, book the second visit before you reach the sidewalk.",
    ],
    [
      {
        question: "Is this door knocking or in-home?",
        answer: "Both, with the close usually at a table. The knock is how you replace a cancellation and find the next booked hour.",
      },
      {
        question: "Are Cherry Hill windows a summer-only sale?",
        answer: "No. Drafts sell in winter and stuck sashes sell in summer. It is not a mosquito season.",
      },
    ],
  ),
  page(
    "window-cleaning:cherry-hill-nj",
    "Cherry Hill",
    "Window Cleaning Sales Jobs in Cherry Hill, NJ",
    "Window Cleaning Jobs, Cherry Hill",
    "Window cleaning sales jobs in Cherry Hill, NJ: two-story colonials, pollen on the glass, and a spring-to-fall residential route.",
    [
      "Window cleaning sales jobs in Cherry Hill are two-story colonials and splits, not boardwalk storefronts. Pollen and shade grime show up on the north side first. Spring is when people notice. You can walk a block of similar houses and book a crew without a highway jump.",
      "Storefront glass on a commercial strip is a different clock, before they open. If the company only wants houses, stay there. Condos with a lobby will not let you price a stack of sliders from the parking lot.",
    ],
    [
      {
        question: "What season matters in Cherry Hill?",
        answer: "Spring through early fall. Winter glass is a harder sell on a frozen porch. Build the route so you can come back to the same streets next year.",
      },
      {
        question: "Is this window replacement?",
        answer: "No. This page is cleaning the glass that is already in the wall. Replacement sits on the window and door jobs page.",
      },
    ],
  ),
  page(
    "exterior-cleaning:cherry-hill-nj",
    "Cherry Hill",
    "Exterior Cleaning Sales Jobs in Cherry Hill, NJ",
    "Exterior Cleaning Jobs, Cherry Hill",
    "Exterior cleaning sales jobs in Cherry Hill, NJ: shaded vinyl and brick, mildew on the north wall, and a truck route through township streets.",
    [
      "Exterior cleaning sales jobs in Cherry Hill point at mildew on the north wall of a shaded colonial and at a driveway that has not been washed since the kids learned to drive. Maple cover keeps siding damp. That is the picture. You are not promising new siding.",
      "The truck has to fit the street and the appointment has to match the crew. Selling a wash the truck cannot reach until next month burns the block. Summer is the comfortable season. A freeze ends it.",
    ],
    [
      {
        question: "What are you selling at the door?",
        answer: "A house wash, concrete, or gutters. Say what the wash will not fix. Soft wood and a failed roof are a different trade.",
      },
      {
        question: "Can this route run all year in Cherry Hill?",
        answer: "No. Freezing weather stops exterior washing. Plan on the warm months.",
      },
    ],
  ),
  page(
    "exteriors:cherry-hill-nj",
    "Cherry Hill",
    "Exterior Sales Jobs in Cherry Hill, NJ",
    "Exterior Sales Jobs in Cherry Hill, NJ",
    "Exterior sales jobs in Cherry Hill, NJ: faded siding on older splits, homeowners who have been in the house for years, and a local territory.",
    [
      "Exterior sales jobs in Cherry Hill are often siding on houses people bought decades ago. The panels are faded, the bottom course is soft, and they have looked at it every time they cut the grass. You are asking them to decide on a wall, not a spray.",
      "They will not sign because you were loud. They might set a time to see a sample if you are still going to be in the township next week. A crew that leaves for another state on Monday does not fit these streets. Ask whose book Cherry Hill is.",
    ],
    [
      {
        question: "Is exterior sales the same as a house wash?",
        answer: "No. A wash is a service. This page is a product on the wall, usually siding. The yes is bigger and slower.",
      },
      {
        question: "Do I need to travel overnight?",
        answer: "A Cherry Hill siding book can be home at night. If the company moves you every week, that is a different offer. Ask.",
      },
    ],
  ),
])
