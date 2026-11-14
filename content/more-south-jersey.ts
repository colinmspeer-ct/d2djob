import type { CityCopy } from "./city-types"

const near: Record<string, string[]> = {
  "voorhees-nj": ["cherry-hill-nj", "marlton-nj", "mount-laurel-nj", "deptford-nj"],
  "mount-laurel-nj": ["moorestown-nj", "marlton-nj", "cherry-hill-nj", "voorhees-nj"],
  "moorestown-nj": ["mount-laurel-nj", "cherry-hill-nj", "marlton-nj", "voorhees-nj"],
  "marlton-nj": ["voorhees-nj", "cherry-hill-nj", "mount-laurel-nj", "deptford-nj"],
  "deptford-nj": ["cherry-hill-nj", "voorhees-nj", "marlton-nj", "mount-laurel-nj"],
  "egg-harbor-township-nj": ["vineland-nj", "deptford-nj", "marlton-nj"],
  "vineland-nj": ["egg-harbor-township-nj", "deptford-nj", "marlton-nj"],
}

function row(
  key: string,
  h1: string,
  metaTitle: string,
  metaDescription: string,
  paragraphs: string[],
  faqs: CityCopy["faqs"],
): [string, CityCopy] {
  const slug = key.split(":")[1]!
  return [key, { h1, metaTitle, metaDescription, paragraphs, faqs, nearby: near[slug] ?? [] }]
}

export const moreSouthJersey: Record<string, CityCopy> = Object.fromEntries([
  row(
    "pest-control:voorhees-nj",
    "Pest Control Sales Jobs in Voorhees, NJ",
    "Pest Control Jobs in Voorhees, NJ",
    "Pest control sales jobs in Voorhees, NJ: townhouses and single-family streets off Main, summer mosquitoes, and a walkable South Jersey book.",
    [
      "Pest control sales jobs in Voorhees mix townhouses near the old Echelon area with single-family streets farther out. You can walk a cluster, then move the car once. Mosquito talk lands in June when the backyards are in use. The person in a townhouse may need a association rule before a treatment. Ask.",
      "It is not the shore. You are not selling to a weekly rental. Winter is quiet. Stay off the highway commercial and you will have a normal township count.",
    ],
    [
      { question: "How is Voorhees different from Cherry Hill?", answer: "More of a townhouse mix in places, and a smaller map. You can cover a section without crossing the whole Camden County sprawl." },
      { question: "Is this a summer sales job?", answer: "Yes. The useful months are late spring through early fall. A January blitz is a thin day." },
    ],
  ),
  row(
    "roofing:voorhees-nj",
    "Roofing Sales Jobs in Voorhees, NJ",
    "Roofing Sales Jobs in Voorhees, NJ",
    "Roofing sales jobs in Voorhees, NJ: townhouse rows and detached houses, retail inspections, and roofs under mature trees.",
    [
      "Roofing sales jobs in Voorhees are inspections more than hail stories. Detached houses on the outer streets have their own roofs. Townhouse rows share decisions and sometimes a association. Know which one you are allowed to price before you put a ladder up.",
      "Tree debris and worn pipe flashing are the ordinary reasons a door opens. Book the time with the owner, not with a guest. You can sleep at home if the company keeps the book in Camden and Burlington Counties.",
    ],
    [
      { question: "Can I price a Voorhees townhouse roof?", answer: "Only if the owner or the association is who you are actually talking to. A shared roof is not a single porch decision." },
      { question: "Is storm canvas the main day?", answer: "No. Expect retail inspections. Wind damage happens, but it is not a prairie hail route." },
    ],
  ),
  row(
    "windows-doors:voorhees-nj",
    "Window and Door Sales Jobs in Voorhees, NJ",
    "Window Sales Jobs in Voorhees, NJ",
    "Window and door sales jobs in Voorhees, NJ: in-home appointments in detached houses and a shorter knock between townhouse rows.",
    [
      "Window and door sales jobs in Voorhees work when the appointment is in a detached house with a drafty slider or a front door that has pulled away from the weatherstrip. Townhouse appointments need the right person and sometimes a board rule about exterior changes.",
      "Fill cancellations on the same street. The map is small enough to do that. Do not drive to a mall to ‘stay busy.’ Put the price on paper and set the second visit if both names are not home.",
    ],
    [
      { question: "Is the close at the kitchen table?", answer: "Usually yes. The knock is the filler, not the whole job, unless the listing says otherwise." },
      { question: "Does Voorhees require overnight travel?", answer: "A local book does not. Ask if the territory stays in South Jersey." },
    ],
  ),
  row(
    "window-cleaning:voorhees-nj",
    "Window Cleaning Sales Jobs in Voorhees, NJ",
    "Window Cleaning Jobs in Voorhees, NJ",
    "Window cleaning sales jobs in Voorhees, NJ: two-story detached houses, townhouse glass you may not be allowed to sell, and a spring route.",
    [
      "Window cleaning sales jobs in Voorhees are a spring route on detached houses with second-story glass. Townhouse rows can be off limits if the association handles the outside. Ask before you quote a row you cannot service.",
      "Pollen season is when the glass looks worse from the curb. Book a crew date you can keep. A small map means you can return next spring and be remembered.",
    ],
    [
      { question: "Are storefronts part of Voorhees?", answer: "Only if the company wants them. Most of the useful glass is residential and off the main commercial road." },
      { question: "What months matter?", answer: "Spring through early fall. Winter porches are a slow sell." },
    ],
  ),
  row(
    "exterior-cleaning:voorhees-nj",
    "Exterior Cleaning Sales Jobs in Voorhees, NJ",
    "Exterior Cleaning Jobs in Voorhees",
    "Exterior cleaning sales jobs in Voorhees, NJ: shaded siding, green north walls, and a truck that has to fit a townhouse lane.",
    [
      "Exterior cleaning sales jobs in Voorhees show up on the north wall where the shade never dries. Detached houses are a straightforward wash. Townhouse lanes can be too tight for the truck, which means you sold a job the crew will hate.",
      "Point at the mildew and the walkway. Do not call it new siding. Summer is the season. A freeze ends the work.",
    ],
    [
      { question: "What do you say at the door?", answer: "What the wash covers and what it will not repair. Soft wood is a different salesperson." },
      { question: "Is the route local?", answer: "It can be. Voorhees is a small map next to Cherry Hill. Confirm you are not being sent to the shore the same afternoon." },
    ],
  ),
  row(
    "exteriors:voorhees-nj",
    "Exterior Sales Jobs in Voorhees, NJ",
    "Exterior Sales Jobs in Voorhees, NJ",
    "Exterior sales jobs in Voorhees, NJ: siding decisions on detached houses, association limits on townhouses, and a territory you can revisit.",
    [
      "Exterior sales jobs in Voorhees stall when the house is a townhouse and the association owns the look of the wall. Detached houses on the outer streets can still talk about faded panels and a soft bottom course. Know which stock you are in before you open the sample board.",
      "These owners expect you to come back. A one-day blitz that never returns does not match a siding decision. Ask if Voorhees is the book for the month or a dot on a statewide tour.",
    ],
    [
      { question: "Is this a house wash?", answer: "No. This is a product on the house, usually siding. Cleaning is a separate page." },
      { question: "Who can approve the work?", answer: "The owner, and sometimes an association if the exterior appearance is shared. Ask before you price a wall you cannot change." },
    ],
  ),
  row(
    "pest-control:mount-laurel-nj",
    "Pest Control Sales Jobs in Mount Laurel, NJ",
    "Pest Control Jobs in Mount Laurel",
    "Pest control sales jobs in Mount Laurel, NJ: evening doors after the office parks empty, subdivision yards, and a Burlington County summer.",
    [
      "Pest control sales jobs in Mount Laurel are an evening residential book next to daytime office parks. The parks are not doors. The subdivisions off the ramps are. People get home later. If you knock at 11 a.m. you will count empty houses and call it a bad town.",
      "Yards are ordinary South Jersey lots, open enough for mosquitoes and close enough to walk. The season matches Cherry Hill. Do not add the Turnpike as a shortcut between sections or you will lose the hour.",
    ],
    [
      { question: "When are people home in Mount Laurel?", answer: "After work. A midday route through the houses near the offices is a lot of nobody answering." },
      { question: "Is this the shore?", answer: "No. Mount Laurel is inland Burlington County. Egg Harbor Township is the shore-adjacent page." },
    ],
  ),
  row(
    "roofing:mount-laurel-nj",
    "Roofing Sales Jobs in Mount Laurel, NJ",
    "Roofing Sales Jobs, Mount Laurel",
    "Roofing sales jobs in Mount Laurel, NJ: subdivision roofs from the 1980s and 1990s, retail inspections, and evenings when owners are back.",
    [
      "Roofing sales jobs in Mount Laurel sit on subdivision roofs that went on in the same decade as the house. You are looking at age, pipe boots, and the side that takes the weather, not a hail swath. Set the inspection for when the owner is home from the office park.",
      "The streets repeat. Learn one section and stay. A retail appointment is the clean close. Canvas between them works if you are not crossing the township at random.",
    ],
    [
      { question: "Is hail the lead?", answer: "Not as a habit. Age and worn details are the more common reason to look. Storms happen. Do not build the week on them." },
      { question: "Can the book stay local?", answer: "Yes, if the company means Mount Laurel and the next Burlington towns, not a statewide storm chase." },
    ],
  ),
  row(
    "windows-doors:mount-laurel-nj",
    "Window and Door Sales Jobs in Mount Laurel, NJ",
    "Window Sales Jobs, Mount Laurel",
    "Window and door sales jobs in Mount Laurel, NJ: builder-grade windows in subdivision houses and appointments after the commute.",
    [
      "Window and door sales jobs in Mount Laurel are builder-grade windows that have reached the age where they fog or stick. The houses look similar from the curb. Inside, one has been updated and the next has not. The appointment is where you find out.",
      "Book the time for early evening if both people work down the road. A noon knock finds the dog. Put the price down and do not narrate the whole catalog.",
    ],
    [
      { question: "Is the day all canvas?", answer: "No. Expect set appointments, with knocking used to fill a hole on the same streets." },
      { question: "Are these custom older homes?", answer: "Mostly subdivision houses. Moorestown’s main street is a different age of house and a different page." },
    ],
  ),
  row(
    "window-cleaning:mount-laurel-nj",
    "Window Cleaning Sales Jobs in Mount Laurel, NJ",
    "Window Cleaning Jobs, Mount Laurel",
    "Window cleaning sales jobs in Mount Laurel, NJ: two-story subdivision glass, spring pollen, and a crew date you can actually keep.",
    [
      "Window cleaning sales jobs in Mount Laurel are two-story subdivision houses with a lot of the same glass package. Spring shows the pollen. You can sell a row of similar homes if the crew can hit them on one morning.",
      "Office parks are not glass accounts for this page. Stay in the residential sections. Winter is a weak porch. Come back to the same streets next April.",
    ],
    [
      { question: "What time of year?", answer: "Spring through early fall. The houses are ordinary family streets, not a boardwalk." },
      { question: "Who does the washing?", answer: "Ask. Some seats only sell. Some stay with the crew. The hourly rate means different things in those two jobs." },
    ],
  ),
  row(
    "exterior-cleaning:mount-laurel-nj",
    "Exterior Cleaning Sales Jobs in Mount Laurel, NJ",
    "Exterior Cleaning Jobs, Mount Laurel",
    "Exterior cleaning sales jobs in Mount Laurel, NJ: vinyl subdivision siding, driveway washes, and a truck route after commute hours.",
    [
      "Exterior cleaning sales jobs in Mount Laurel point at vinyl that has gone dull and driveways in subdivisions built in a rush. The north side still grows a film. You are selling a wash the crew can finish, not a new facade.",
      "Evening is when the owner can look at the wall with you. Do not book a wash the same hour you need to be across the Turnpike. Cluster the streets.",
    ],
    [
      { question: "What ends the season?", answer: "A freeze. This is not a year-round wash market." },
      { question: "Is siding replacement this page?", answer: "No. Replacement is exterior sales. This is cleaning." },
    ],
  ),
  row(
    "exteriors:mount-laurel-nj",
    "Exterior Sales Jobs in Mount Laurel, NJ",
    "Exterior Sales Jobs, Mount Laurel",
    "Exterior sales jobs in Mount Laurel, NJ: original siding on subdivision houses, a slower yes, and a territory you revisit.",
    [
      "Exterior sales jobs in Mount Laurel are original siding on houses that still look ‘new’ from the road until you stand at the bottom course. The yes takes a second visit. Owners work days in the parks and decide at night.",
      "If your company resets the map every Monday, you will not get that second visit. Ask whether Mount Laurel is yours for the season.",
    ],
    [
      { question: "How is this different from a wash?", answer: "A wash is a service visit. Siding is a project. The decision is slower and the ticket is larger." },
      { question: "Are HOAs a problem?", answer: "Some sections have them. Ask about color and material rules before you promise a wall the board will reject." },
    ],
  ),
])
