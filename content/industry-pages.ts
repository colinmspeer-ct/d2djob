import type { Faq } from "@/lib/seo"
import type { IndustrySlug } from "@/data/industries"

export type IndustryArticle = {
  h1: string
  metaTitle: string
  metaDescription: string
  lede: string
  sections: { heading: string; paragraphs: string[] }[]
  faqs: Faq[]
}

export const industryArticles: Record<IndustrySlug, IndustryArticle> = {
  fiber: {
    h1: "Fiber Internet Sales Jobs",
    metaTitle: "Fiber Internet Sales Jobs",
    metaDescription:
      "Fiber internet sales jobs and fiber sales jobs in official AT&T Fiber markets: the route, the install, the season, and how pay is structured.",
    lede:
      "Fiber sales jobs are door-to-door work about an internet install. You knock a neighborhood, explain the drop and the monthly bill in plain language, and try to leave with a start date. The city pages on this site exist only where AT&T Fiber is an official market.",
    sections: [
      {
        heading: "What you do on a fiber route",
        paragraphs: [
          "You work a set of streets, not a call queue. The house either can take a drop or it cannot. Apartment lobbies, gated entries you cannot get through, and streets with no access are marks on the map, then you move. Single-family lots with a clear path to the door are the working hours.",
          "The conversation is short. What they have now, what the install looks like, what the first bill looks like, and whether someone needs to be home. Reps who last can say the price and stop. A long speech about speed does not help a person who is late for work.",
          "You are judged on accounts that actually install, not on conversations started. Ask the company what has to happen before commission counts. A signature on the porch and an install two weeks later are different events.",
        ],
      },
      {
        heading: "Where these fiber sales jobs are",
        paragraphs: [
          "The fiber city pages cover the official AT&T Fiber markets on this desk: the Carolinas, Georgia, Florida, plus Scranton and Wilkes-Barre. Raleigh, Charlotte, Atlanta, Miami, Jacksonville, and the rest of that list each have their own page because the housing and the heat are not the same.",
          "South Jersey, the Philadelphia suburbs, Chester County, Lancaster, Chicago, and Boston are not fiber pages here. Reps who live in those cities still belong on the talent desk for pest, roofing, windows, and exterior work. They do not get a fiber URL.",
        ],
      },
      {
        heading: "Season and the street",
        paragraphs: [
          "In the Southeast the route runs most of the year. July shortens it. You start earlier, you carry water, and afternoon storms wipe out a block. Spring pollen in the Carolinas coats the porch and makes people less interested in standing in the doorway. Coastal cities add humidity and, in season, a hurricane week when nobody wants a contractor in the yard.",
          "Scranton and Wilkes-Barre are the cold end of this list. The outdoor day shrinks in January. Older doubles and hills change the walking. Read those city pages before you assume a Carolina summer route.",
        ],
      },
      {
        heading: "How fiber pay is structured",
        paragraphs: [
          "Fiber seats are often a base plus commission, or commission on installed accounts. Some offers say the commission is uncapped. That is a plan detail, not a promise of a paycheck. Get the written plan: when it pays, what voids it, and whether a clawback follows a cancelled install.",
          "This page does not publish a dollar amount. If a sample listing lower on the site shows a figure, that record is marked Sample and is not a live offer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are fiber sales jobs the same as door knocking jobs?",
        answer:
          "Yes. You are on foot in a neighborhood, knocking, and keeping a count. The product is a fiber internet install, not pest control or a roof.",
      },
      {
        question: "Which cities have fiber sales job pages?",
        answer:
          "Only official AT&T Fiber markets, including Charlotte, Raleigh, Atlanta, Miami, Jacksonville, Orlando, and the rest of the city list on this page, plus Scranton and Wilkes-Barre. New Jersey, the Philadelphia suburbs, Lancaster, Chicago, and Boston are not on that list.",
      },
      {
        question: "Do fiber routes stop in the winter?",
        answer:
          "In the Southeast they usually keep going, with heat and storms as the constraint. In northeastern Pennsylvania the cold cuts the outdoor day. The city page is the place to read which one you are walking into.",
      },
    ],
  },
  "pest-control": {
    h1: "Pest Control Sales Jobs",
    metaTitle: "Pest Control Sales Jobs",
    metaDescription:
      "Pest control sales jobs and summer door knocking routes: mosquito, ant, and termite conversations, the season, and how the pay is structured.",
    lede:
      "Pest control sales jobs are warm-weather door knocking. You walk a block, talk about mosquitoes, ants, or termites, and try to start a service. In South Jersey and the Philadelphia suburbs the season is the job. Farther south the bugs last longer and so does the heat.",
    sections: [
      {
        heading: "The summer route",
        paragraphs: [
          "Most of the money in this trade is made while people are outside and the bugs are obvious. In New Jersey and eastern Pennsylvania that often means late spring through early fall, then a thin winter. In the Carolinas and Florida the calendar is longer, and July can be too hot for a long porch talk in the middle of the day.",
          "You learn the housing. Tight township lots in Cherry Hill are a different walk from a Lancaster County house with a long lane, or a Chicago bungalow with a gangway. Condos and apartment lobbies are usually a skip unless the building lets you through.",
        ],
      },
      {
        heading: "What you say at the door",
        paragraphs: [
          "The useful pitch is specific. Mosquito programs, general pest, and termite are different conversations and different start dates. A homeowner who already has a company wants to know why they would switch, not a speech about bugs in general.",
          "Leave a card or a follow-up time if they are not the decision maker. A lot of summer sales jobs die because the person at the door cannot say yes and you did not set the next step.",
        ],
      },
      {
        heading: "Where the routes are",
        paragraphs: [
          "South Jersey towns, the Philadelphia suburbs, Lancaster, Chicago, and Boston are all fair territory for pest routes on this desk. So are the fiber-market cities, if the seat is pest and not fiber. A pest page in Raleigh is about bugs. It is not an AT&T Fiber page.",
        ],
      },
      {
        heading: "How pest pay is structured",
        paragraphs: [
          "Seasonal seats often pay an hourly rate plus commission on accounts that start. Some pay commission only. Ask when commission counts: the signature, the first treatment, or a kept account after a cancel window. A short season with a weak hourly rate is a different offer than a long season with a clear start bonus.",
          "No pay figure on this page. The company’s written plan is the number.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are pest control sales jobs summer sales jobs?",
        answer:
          "In the Northeast and Midwest, mostly yes. The route is built around the months when people will talk about mosquitoes and ants. Southern cities keep a longer calendar, with heat as the limit instead of frost.",
      },
      {
        question: "Is a pest route the same as a fiber route?",
        answer:
          "No. The walk can look similar. The product, the season, and the reason the door opens are different. Do not take a pest seat if you only want fiber, or the other way around.",
      },
      {
        question: "Can I sell pest control in a city that is not an AT&T Fiber market?",
        answer:
          "Yes. South Jersey, the Philadelphia suburbs, Lancaster, Chicago, and Boston are on this desk for pest control sales jobs. Fiber city URLs are a separate list.",
      },
    ],
  },
  roofing: {
    h1: "Roofing Sales Jobs",
    metaTitle: "Roofing Sales Jobs",
    metaDescription:
      "Roofing sales jobs for door-to-door and inspection work: storm canvas, retail appointments, the season, and how commission is structured.",
    lede:
      "Roofing sales jobs split into two days that get blended on a lot of desks. One is retail: a set time, a walk of the roof, a price. The other is storm canvas: you knock after hail or wind and try to set the inspection before you leave. Both are sales. Neither is a call-center shift.",
    sections: [
      {
        heading: "Retail days and storm days",
        paragraphs: [
          "On a retail day you are expected at the house. You look at the roof, you talk about layers, ventilation, and what the next leak will cost, and you write a number. On a storm day you are hunting. The map is wherever the hail went. You knock, you ask about the storm, and you book the inspection.",
          "Lancaster County reps know both. A Philadelphia suburb can be quieter on hail and heavier on older roofs, tree debris, and retail. Chicago wind and ice are their own calendar. Do not assume a Florida shingle route feels like a Pennsylvania one.",
        ],
      },
      {
        heading: "What makes the day long",
        paragraphs: [
          "Roofs are hot. You are up and down ladders or waiting on someone who is. The homeowner often needs a spouse, an insurance conversation, or a second visit. Reps who press a one-call close on every door burn the lead. Reps who never ask for the inspection waste the knock.",
          "Travel shows up in this trade more than in a township pest route. Storm work can mean a hotel. Ask before you say yes if you need to be home at night.",
        ],
      },
      {
        heading: "How roofing pay is structured",
        paragraphs: [
          "Roofing is often commission-heavy. Some seats have a base. Many do not. Commission may sit on the signed job, the insurance approval, or the completed roof. Those are three different paydays. Ask about chargebacks if the job cancels after you have been paid.",
          "This page does not quote a percentage or a dollar amount. If you see a figure on a sample listing, the listing is marked Sample.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are roofing sales jobs door knocking jobs?",
        answer:
          "Storm canvas is door knocking. Retail roofing is often a set appointment that still starts with a knock or a booked time. Read the listing so you know which day you are walking into.",
      },
      {
        question: "Do I have to travel for roofing sales jobs?",
        answer:
          "Some books are local. Storm seats often are not. Say out loud whether you will drive for hail or you need a territory you can sleep in.",
      },
      {
        question: "Is roofing a summer-only job?",
        answer:
          "Storms are not only a summer event, and retail inspections run outside beach season. Winter still slows the outdoor day in Pennsylvania and around Chicago. The South has a longer install calendar and a hotter roof.",
      },
    ],
  },
  "windows-doors": {
    h1: "Window and Door Sales Jobs",
    metaTitle: "Window and Door Sales Jobs",
    metaDescription:
      "Window and door sales jobs for in-home and door-to-door reps: appointments, cancellation fills, and how base plus commission usually works.",
    lede:
      "Window and door sales jobs are mostly in the house. You sit at a table, measure the opening in the conversation if not with a tape, and put a price on paper. Knocking is how a lot of reps fill a cancellation or warm up a street around a booked stop. If you only want raw canvas and no kitchen table, say so before you take the seat.",
    sections: [
      {
        heading: "The appointment and the fill-in knock",
        paragraphs: [
          "A set appointment is the core. Someone expects you. They have a draft, a rotten sill, or a door that does not lock. You need a clean way to show the price and a next step if they will not decide that night.",
          "Between appointments you knock nearby houses. That is still door-to-door work, with a shorter pitch: you are already on the block, you can look at one window, and you can book a real time. Chester County and the close Philadelphia suburbs are full of this mix. So are older Chicago bungalows and Boston triple-deckers, where the stair and the landlord question show up fast.",
        ],
      },
      {
        heading: "Who can say yes",
        paragraphs: [
          "Windows are a household decision. The person who answers may not be the person who writes the check. Ask. If you need both people, set the time while you are standing there. A card on the counter with no time is how these leads die.",
        ],
      },
      {
        heading: "How window pay is structured",
        paragraphs: [
          "A common structure is a base plus commission on installed projects. Some seats are commission only, with a draw. Ask whether you are paid on the sold price, the installed price, or a margin the office calculates later. Installed means the job has to happen. Sold means the paperwork.",
          "No dollar figure on this page. The offer letter is the place for the number.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are window and door sales jobs door to door?",
        answer:
          "The close is usually inside, at a set time. Knocking is how reps fill holes in the day and find the next appointment. A listing should say which part is the actual job.",
      },
      {
        question: "Do I need to travel overnight?",
        answer:
          "Many of these books are local: Chester County, the Philadelphia suburbs, a defined city territory. Ask. A one-call-close crew that moves states every month is a different life.",
      },
      {
        question: "Is this a summer sales job?",
        answer:
          "Installs run most of the year. Homeowners book more when they can open the house and see the work. Winter appointments still happen. It is not the same short season as mosquito knocking.",
      },
    ],
  },
  "window-cleaning": {
    h1: "Window Cleaning Sales Jobs",
    metaTitle: "Window Cleaning Sales Jobs",
    metaDescription:
      "Window cleaning sales jobs and seasonal door knocking: residential routes, small storefronts, spring and summer, and how hourly plus commission works.",
    lede:
      "Window cleaning sales jobs are seasonal door knocking with a simple offer. You sell a cleaning, usually residential, sometimes a small storefront. The route is repeat business as much as a one-time close. Boston triple-deckers, Chicago two-flats, and coastal houses with salt on the glass are not the same walk.",
    sections: [
      {
        heading: "Spring, summer, and the route",
        paragraphs: [
          "In Boston and the Philadelphia suburbs the selling season is spring into early fall. People notice the glass when the light changes and when pollen or salt builds up. In Florida the glass gets dirty all year, and the midday heat still cuts the hours you should be on a porch.",
          "You want a defined territory. A rep who knocks the same streets can come back next season and not start from zero. A blitz that never returns is a harder way to make this product work.",
        ],
      },
      {
        heading: "Houses versus storefronts",
        paragraphs: [
          "Residential is the bulk: two-story colonials, bungalows, triple-deckers, condos where you cannot get past the desk. Small storefronts are a different pitch and a different time of day, before they open or after the lunch rush. Know which one the company actually wants.",
          "Ladders and crew size matter. Some seats sell the job and a crew does the glass. Some seats are closer to the work. Ask.",
        ],
      },
      {
        heading: "How window cleaning pay is structured",
        paragraphs: [
          "Seasonal window cleaning often pays an hourly rate plus a smaller commission on booked routes. Some pay per house sold. Ask whether a cancel before the crew shows up pulls the commission back.",
          "No rate is printed here. Seasonal work with a weak hourly and no repeat territory is a thin summer. Read the offer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are window cleaning sales jobs summer sales jobs?",
        answer:
          "In the North, yes. The route lives in the months when people will book exterior glass. Southern coasts keep a longer year and a hotter afternoon.",
      },
      {
        question: "Is this the same as window and door replacement?",
        answer:
          "No. Window cleaning sells a service on glass that is already there. Window and door sales sell a replacement. The kitchen-table close and the ladder route are different jobs.",
      },
      {
        question: "Do I need a truck?",
        answer:
          "Some companies want you to sell only. Some want you near the crew. Ask whether a vehicle is required before you count on an hourly rate covering it.",
      },
    ],
  },
  "exterior-cleaning": {
    h1: "Exterior Cleaning Sales Jobs",
    metaTitle: "Exterior Cleaning Sales Jobs",
    metaDescription:
      "Exterior cleaning sales jobs for house washes, concrete, and gutters: the truck, the season, and how base plus commission is usually built.",
    lede:
      "Exterior cleaning sales jobs sell a wash: house siding, concrete, gutters, sometimes a roof soft-wash if the company does that work. You are usually tied to a truck and a small crew. Chicago bungalows, Carolina vinyl, and South Jersey colonials show different dirt and different reasons to say yes.",
    sections: [
      {
        heading: "What you are actually selling",
        paragraphs: [
          "The door conversation is about what the house looks like from the curb and what a wash does and does not do. It does not replace rotten wood or a failed roof. Reps who promise a new house lose the callback. Reps who point at the north-side mildew and the driveway oil get a yes they can keep.",
          "You need a posted number and a schedule the crew can hit. Selling a Tuesday the truck cannot make is how this trade burns referrals.",
        ],
      },
      {
        heading: "Season, pollen, and salt",
        paragraphs: [
          "Spring pollen in the Carolinas and North Georgia coats siding and decks. Coastal salt and humidity keep a longer wash season. Chicago and Boston pile the work into the months after winter grime and before the first hard freeze. South Jersey sits in between: a real summer, a real winter, and maple shade that keeps mildew on the north wall.",
        ],
      },
      {
        heading: "How exterior cleaning pay is structured",
        paragraphs: [
          "Full-time seats are often a base plus commission on completed jobs. Seasonal seats may add an hourly rate. Ask whether you are paid when the customer signs or when the crew finishes, and what happens if it rains out the day.",
          "No dollar amount on this page. The company’s plan is the source.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is exterior cleaning a door to door sales job?",
        answer:
          "Yes, when the offer is a route and a truck, not a shop that waits for the phone. You knock, you price a wash, and you book the crew.",
      },
      {
        question: "Do I need to run the crew?",
        answer:
          "Some reps sell and a lead tech washes. Some seats want you to train a second person and keep the schedule. Those are different jobs. Ask which one the listing is.",
      },
      {
        question: "Can this route run in winter?",
        answer:
          "In the North, exterior washing mostly stops when it freezes. In the coastal South it slows but does not disappear. Read the city page for the season you would actually work.",
      },
    ],
  },
  exteriors: {
    h1: "Exterior Sales Jobs",
    metaTitle: "Exterior Sales Jobs",
    metaDescription:
      "Exterior sales jobs for siding and the outside of the house: door-to-door and in-home routes, territories, and how pay is structured.",
    lede:
      "Exterior sales jobs, in the way this desk uses the word, are the outside of the house: siding, and sometimes a window or roof lead you hand to a partner. It is not a fiber install and it is not a one-hour pest spray. You are asking a homeowner to look at a wall they have lived with for years.",
    sections: [
      {
        heading: "Siding, and the leads you do not keep",
        paragraphs: [
          "The main conversation is the wall: faded panels, soft wood at the bottom course, paint that has given up. You either price that work or you set a longer appointment with a sample board. Some companies want you to hand window leads and roof leads to another rep. Know what you are paid on if you make that handoff, and what you are not.",
          "King of Prussia and the Montgomery County suburbs are a common version of this book: a mix of set appointments and doors, home at night, a defined drive. Older mill towns and newer subdivisions on the same desk are different housing. Vinyl on a 1970s split is not fiber-cement on a five-year-old house.",
        ],
      },
      {
        heading: "Territory beats a random blitz",
        paragraphs: [
          "Homeowners take longer to decide on siding than on a mosquito spray. A rep who is in a different state every Monday does not get the second visit. Ask if the territory is yours for the season or if the office reshuffles the map every week.",
        ],
      },
      {
        heading: "How exterior pay is structured",
        paragraphs: [
          "A base plus commission on installed work is common. Commission-only exists. Ask whether the pay is on the contract price or on what remains after the office prices materials. Installed means the crew has to finish. If you only set the lead, ask what that lead is worth.",
          "No figure is printed here.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does exterior sales mean on this desk?",
        answer:
          "Siding and the other outside-the-house products that are not a separate pest, roofing, window-cleaning, or fiber seat. If the company also sells windows or roofs, ask which product is yours.",
      },
      {
        question: "Are exterior sales jobs door knocking jobs?",
        answer:
          "Often yes, mixed with in-home appointments. The listing should say how much of the week is canvas and how much is a booked kitchen table.",
      },
      {
        question: "Is this the same page as exterior cleaning?",
        answer:
          "No. Exterior cleaning is a wash. Exterior sales here is a product on the house, usually siding. The truck, the season, and the size of the yes are different.",
      },
    ],
  },
}
