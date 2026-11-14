import type { CityCopy } from "./city-types"

const near: Record<string, string[]> = {
  "doylestown-pa": ["newtown-pa", "langhorne-pa", "lansdale-pa", "bensalem-pa"],
  "king-of-prussia-pa": ["norristown-pa", "conshohocken-pa", "lansdale-pa", "exton-pa"],
  "west-chester-pa": ["exton-pa", "downingtown-pa", "kennett-square-pa", "media-pa"],
  "lancaster-pa": ["west-chester-pa", "downingtown-pa", "exton-pa", "kennett-square-pa"],
  "chicago-il": ["boston-ma", "lancaster-pa", "cherry-hill-nj"],
  "boston-ma": ["chicago-il", "cherry-hill-nj", "west-chester-pa"],
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

export const hubCities: Record<string, CityCopy> = Object.fromEntries([
  row(
    "pest-control:doylestown-pa",
    "Pest Control Sales Jobs in Doylestown, PA",
    "Pest Control Jobs in Doylestown, PA",
    "Pest control sales jobs in Doylestown, PA: borough streets, larger lots toward the township, and a Bucks County summer.",
    [
      "Pest control sales jobs in Doylestown split between the borough grid and the township lots outside it. Borough houses sit close, with porches on a walkable street. Farther out the lanes get longer and the yards hold more standing water. Mosquitoes and ticks are the summer conversation. Ants show up when the weather breaks.",
      "You can be home at night. The season is late spring through early fall. Do not treat a downtown shop block as a residential route. The owner of a house on a shaded lot is the door.",
    ],
    [
      { question: "Is Doylestown a summer pest route?", answer: "Yes. Bucks County winters are a thin book. The yards matter from late spring until the first hard cold." },
      { question: "Is this an AT&T Fiber page?", answer: "No. Doylestown is a Philadelphia-suburb pest page. Fiber URLs are a separate list of markets." },
    ],
  ),
  row(
    "roofing:doylestown-pa",
    "Roofing Sales Jobs in Doylestown, PA",
    "Roofing Sales Jobs in Doylestown",
    "Roofing sales jobs in Doylestown, PA: older borough roofs, township houses on larger lots, and retail inspections in Bucks County.",
    [
      "Roofing sales jobs in Doylestown are old roofs in the borough and newer ones on township lots where the wind has a longer run. You are setting inspections, not importing a hail script from another state. Trees over slate and asphalt are the ordinary damage.",
      "Parking in the borough is the hassle. Township lanes are a drive between doors. Ask for the spouse’s time while you are there. A one-call close on a roof this size is rare.",
    ],
    [
      { question: "Is this storm canvas?", answer: "Storms happen. The steadier day is a retail inspection. Do not expect a prairie hail week." },
      { question: "Can the territory stay in Bucks County?", answer: "It can. Ask. A Doylestown book and a statewide storm crew are different lives." },
    ],
  ),
  row(
    "windows-doors:doylestown-pa",
    "Window and Door Sales Jobs in Doylestown, PA",
    "Window Sales Jobs in Doylestown, PA",
    "Window and door sales jobs in Doylestown, PA: drafty borough houses, newer township builds, and appointments both owners can attend.",
    [
      "Window and door sales jobs in Doylestown sit in old borough houses with drafts and in newer township homes with a wall of glass that fogs. The close is inside. Knocking the same street fills a cancellation.",
      "Borough appointments mean tight parking and a neighbor who can hear you. Be short. Township appointments mean a lane and a longer look at the outside before you sit down.",
    ],
    [
      { question: "Is the work all door knocking?", answer: "No. Plan on a table and a price. The knock keeps the day full." },
      { question: "Winter or summer?", answer: "Both. Drafts are a winter conversation. Stuck windows show up when people want them open." },
    ],
  ),
  row(
    "window-cleaning:doylestown-pa",
    "Window Cleaning Sales Jobs in Doylestown, PA",
    "Window Cleaning Jobs, Doylestown",
    "Window cleaning sales jobs in Doylestown, PA: borough second stories, pollen on township glass, and a spring-to-fall route.",
    [
      "Window cleaning sales jobs in Doylestown are second-story borough houses and larger township homes where the glass is high enough to need a crew. Spring pollen makes the sale visible from the sidewalk.",
      "Shops on the main streets are a maybe, houses are the book. Come back to the same blocks next spring. A one-time blitz does not fit this town.",
    ],
    [
      { question: "What months work?", answer: "Spring through early fall. A frozen porch in January is a poor pitch for exterior glass." },
      { question: "Is this replacement windows?", answer: "No. This is cleaning. Replacement is the window and door page." },
    ],
  ),
  row(
    "exterior-cleaning:doylestown-pa",
    "Exterior Cleaning Sales Jobs in Doylestown, PA",
    "Exterior Cleaning Jobs, Doylestown",
    "Exterior cleaning sales jobs in Doylestown, PA: stone and siding on borough houses, shaded north walls, and a warm-month truck route.",
    [
      "Exterior cleaning sales jobs in Doylestown point at stone that has gone dark and siding under trees. Borough streets may not love a loud truck at 8 a.m. Township lots give you room to work. Sell the wash, not a new wall.",
      "The season ends at a freeze. Book only what the crew can reach without blocking a narrow borough street.",
    ],
    [
      { question: "What are you not selling?", answer: "A new roof or new siding. If the wood is soft, say so and stop. That is a different trade." },
      { question: "Is winter a washing season here?", answer: "No. Bucks County freezes. Plan the book on the warm months." },
    ],
  ),
  row(
    "exteriors:doylestown-pa",
    "Exterior Sales Jobs in Doylestown, PA",
    "Exterior Sales Jobs in Doylestown",
    "Exterior sales jobs in Doylestown, PA: siding and trim on older borough houses, a slower yes, and a Bucks County territory.",
    [
      "Exterior sales jobs in Doylestown are older walls. Borough houses have trim and siding that owners have painted instead of replaced. Township houses may still be on the original panels. Either way the yes takes a second visit.",
      "If you will not be back in Doylestown next week, do not start the conversation. These are not one-knock mosquito sales.",
    ],
    [
      { question: "Is this a house wash?", answer: "No. Exterior sales here means a product on the house, usually siding. Cleaning is separate." },
      { question: "Do owners decide the same day?", answer: "Sometimes they set the next appointment the same day. A full project signed on the first knock is the exception." },
    ],
  ),
  row(
    "pest-control:king-of-prussia-pa",
    "Pest Control Sales Jobs in King of Prussia, PA",
    "Pest Control Jobs, King of Prussia",
    "Pest control sales jobs in King of Prussia, PA: subdivision yards off the mall traffic, evening doors, and a Montgomery County summer.",
    [
      "Pest control sales jobs in King of Prussia are not the mall. The doors are the subdivisions around it, where people get home after sitting on the Schuylkill. Midday is empty houses. Evening is the route. Mosquitoes in a small backyard are the summer pitch.",
      "You will waste the day if you treat the commercial corridor as residences. Cluster a neighborhood and stay. The season matches the rest of the Philadelphia suburbs: late spring until it gets cold.",
    ],
    [
      { question: "When do you knock?", answer: "After the commute. A late morning loop of houses near the mall is mostly nobody home." },
      { question: "Is King of Prussia a fiber city page?", answer: "No. Fiber pages are AT&T markets. This is pest control in Montgomery County." },
    ],
  ),
  row(
    "roofing:king-of-prussia-pa",
    "Roofing Sales Jobs in King of Prussia, PA",
    "Roofing Sales Jobs, King of Prussia",
    "Roofing sales jobs in King of Prussia, PA: subdivision roofs, retail inspections after work, and tree debris more than hail chases.",
    [
      "Roofing sales jobs in King of Prussia are subdivision roofs that have aged together. You set the inspection for after work. Hail is not the weekly story. Worn boots, shaded slopes, and overhanging trees are.",
      "Traffic on 202 and the turnpike will eat a sloppy map. Pick one side of the mall sprawl for the day. A spouse who is still on the road is not a close. Book them both.",
    ],
    [
      { question: "Retail or storm?", answer: "Retail inspections are the spine. Storm canvas is extra, not the reason the town is on the list." },
      { question: "Overnight travel?", answer: "Not required for a Montgomery County book. Ask if the company means that, or a moving storm crew." },
    ],
  ),
  row(
    "windows-doors:king-of-prussia-pa",
    "Window and Door Sales Jobs in King of Prussia, PA",
    "Window Sales Jobs, King of Prussia",
    "Window and door sales jobs in King of Prussia, PA: builder windows in subdivisions and evening appointments after the King of Prussia commute.",
    [
      "Window and door sales jobs in King of Prussia are fogged builder windows in houses that look maintained from the curb. The appointment has to be early evening. Both people are often coming from offices, not from a farm lane.",
      "Knock the same subdivision when one appointment dies. Do not roam the mall parking lot. Price one opening, then the house, and write the next time down.",
    ],
    [
      { question: "Is this mostly in-home?", answer: "Yes. The knock fills cancellations. The decision happens inside." },
      { question: "How is this different from West Chester?", answer: "King of Prussia is more subdivision and commute. West Chester’s borough and Chester County lanes are another page." },
    ],
  ),
  row(
    "window-cleaning:king-of-prussia-pa",
    "Window Cleaning Sales Jobs in King of Prussia, PA",
    "Window Cleaning Jobs, King of Prussia",
    "Window cleaning sales jobs in King of Prussia, PA: two-story subdivision glass, spring film, and a crew route that avoids mall traffic.",
    [
      "Window cleaning sales jobs in King of Prussia are subdivision two-stories, not the mall’s glass. Spring film on the outside is the picture from the driveway. Book several houses on one morning so the crew is not crossing 202 between stops.",
      "Commercial glass is a different sale. If you only have houses, ignore the office parks. The season is warm months.",
    ],
    [
      { question: "What ruins the day?", answer: "Driving between random sections at rush hour. Cluster the streets or the crew loses the margin." },
      { question: "Winter work?", answer: "Thin. Exterior glass is a spring-to-fall conversation here." },
    ],
  ),
  row(
    "exterior-cleaning:king-of-prussia-pa",
    "Exterior Cleaning Sales Jobs in King of Prussia, PA",
    "Exterior Cleaning Jobs, King of Prussia",
    "Exterior cleaning sales jobs in King of Prussia, PA: dull vinyl in subdivisions, driveway stains, and washes booked around rush hour.",
    [
      "Exterior cleaning sales jobs in King of Prussia show dull vinyl and concrete that faces the weather on open subdivision lots. There is less deep shade than in an old borough. The north wall still tells the truth.",
      "Sell a day the truck can be there without sitting in mall traffic. Evening is when the owner can walk outside with you. Freeze ends the season.",
    ],
    [
      { question: "What is the offer?", answer: "A wash of siding, concrete, or gutters. Not a new roof and not new panels." },
      { question: "Can you knock the mall?", answer: "No. The houses around it are the book. The mall is parking." },
    ],
  ),
  row(
    "exteriors:king-of-prussia-pa",
    "Exterior Sales Jobs in King of Prussia, PA",
    "Exterior Sales Jobs, King of Prussia",
    "Exterior sales jobs in King of Prussia, PA: original subdivision siding, a second visit, and a Montgomery County territory.",
    [
      "Exterior sales jobs in King of Prussia are original siding on houses people bought as a commute. The wall looks fine from the car and tired up close. They will not replace it because you raised your voice. They might look at a sample next week if you are still local.",
      "Ask whose territory this is. A rep who is in Delaware on Tuesday cannot close a King of Prussia siding lead that needs a second evening.",
    ],
    [
      { question: "Is this cleaning?", answer: "No. Cleaning washes what is there. This page is a product, usually siding." },
      { question: "When do owners decide?", answer: "After they have seen a sample and talked to each other. Set that time before you leave." },
    ],
  ),
  row(
    "pest-control:west-chester-pa",
    "Pest Control Sales Jobs in West Chester, PA",
    "Pest Control Jobs in West Chester, PA",
    "Pest control sales jobs in West Chester, PA: borough blocks, Chester County lots outside town, ticks and mosquitoes, and a local summer.",
    [
      "Pest control sales jobs in West Chester are the borough streets plus the township roads where lots open up. Borough blocks are walkable brick and frame houses. Outside town you drive between doors and the tick conversation gets easier because people are in the grass. Mosquitoes follow the shade and the low spots.",
      "College rentals near campus are a weak account. You want the owner who will still be there in August. The season is the warm months. Lancaster is a different county and a different page.",
    ],
    [
      { question: "Borough or township?", answer: "Both, and they do not knock the same. Walk the borough. Drive the township lanes. Do not mix them in one careless loop." },
      { question: "Is West Chester a fiber market?", answer: "No. This is Chester County pest work. Fiber pages are the AT&T list." },
    ],
  ),
  row(
    "roofing:west-chester-pa",
    "Roofing Sales Jobs in West Chester, PA",
    "Roofing Sales Jobs in West Chester",
    "Roofing sales jobs in West Chester, PA: borough roofs with tight access, township houses, and inspections instead of hail tours.",
    [
      "Roofing sales jobs in West Chester deal with older borough roofs you can barely ladder without being in the neighbor’s hedge, and with township houses where the wind has more yard. Inspections are the job. Tree limbs and worn valleys are the reason.",
      "Parking downtown is annoying. Schedule it. A storm chase that starts here and ends in another state is a question to ask, not an assumption.",
    ],
    [
      { question: "What opens the door?", answer: "Age, leaks, and trees. A hail narrative copied from another region sounds false on these streets." },
      { question: "Home at night?", answer: "A Chester County inspection book can be. Confirm it." },
    ],
  ),
  row(
    "windows-doors:west-chester-pa",
    "Window and Door Sales Jobs in West Chester, PA",
    "Window Sales Jobs in West Chester",
    "Window and door sales jobs in West Chester, PA: in-home prices in borough houses and township homes, with knocks that refill the day.",
    [
      "Window and door sales jobs in West Chester are a Chester County in-home day. Borough houses have odd openings and old trim. Township homes have more standard glass and a longer driveway. You sit down, you price the opening they care about, and you stop talking.",
      "Use the knock to stay in the neighborhood when someone cancels. Main Street is not a canvas. The side streets are.",
    ],
    [
      { question: "Is this cleaning?", answer: "No. This is replacement. Cleaning has its own page." },
      { question: "Who has to be home?", answer: "Whoever pays. If that is two people, book both before you drive away." },
    ],
  ),
  row(
    "window-cleaning:west-chester-pa",
    "Window Cleaning Sales Jobs in West Chester, PA",
    "Window Cleaning Jobs, West Chester",
    "Window cleaning sales jobs in West Chester, PA: tall borough windows, pollen, and a spring route into the townships.",
    [
      "Window cleaning sales jobs in West Chester start when pollen sticks to tall borough windows and people notice from the sidewalk. Township houses add second-story glass and a longer set of ladders. Book a crew that can do a cluster, not one house across the county.",
      "Campus rentals are a maybe. Owners are the repeat route. Spring through fall is the season.",
    ],
    [
      { question: "Storefronts?", answer: "A few downtown. Most of the book is houses. Ask which one the company staffs." },
      { question: "Come back next year?", answer: "Yes. A West Chester route that returns in spring is worth more than a blitz that never does." },
    ],
  ),
  row(
    "exterior-cleaning:west-chester-pa",
    "Exterior Cleaning Sales Jobs in West Chester, PA",
    "Exterior Cleaning Jobs, West Chester",
    "Exterior cleaning sales jobs in West Chester, PA: brick and siding, shaded borough walls, and township houses with room for a truck.",
    [
      "Exterior cleaning sales jobs in West Chester show dark brick on shaded borough walls and siding on township houses. The borough may not want a generator running at breakfast. Time the truck. Sell the wash you can see, not a renovation.",
      "Freeze stops the work. Chester County has a real winter. Do not promise December washes.",
    ],
    [
      { question: "What do you point at?", answer: "The green film, the walk, the gutter line. If the wood is soft, say that is not a wash." },
      { question: "Is Lancaster the same day?", answer: "No. Lancaster County houses and lanes are their own page, even if a company lumps eastern Pennsylvania together." },
    ],
  ),
  row(
    "exteriors:west-chester-pa",
    "Exterior Sales Jobs in West Chester, PA",
    "Exterior Sales Jobs in West Chester",
    "Exterior sales jobs in West Chester, PA: siding and trim on borough and township houses, with a second visit in Chester County.",
    [
      "Exterior sales jobs in West Chester are trim and siding on houses people intend to stay in. Borough jobs are fussy about look and access. Township jobs have more wall and a longer lead time. Neither is a one-knock close.",
      "You need to be back. A territory that includes West Chester in name and sends you to another state in practice will not close this work.",
    ],
    [
      { question: "Wash or siding?", answer: "Siding and the outside product. A wash is the exterior cleaning page." },
      { question: "How long is the decision?", answer: "Long enough to need a second appointment. Set it while you are there." },
    ],
  ),
  row(
    "pest-control:lancaster-pa",
    "Pest Control Sales Jobs in Lancaster, PA",
    "Pest Control Jobs in Lancaster, PA",
    "Pest control sales jobs in Lancaster, PA: city blocks, township lanes, farms at the edge, and a longer drive between doors.",
    [
      "Pest control sales jobs in Lancaster are not a South Jersey township grid. In the city you can walk blocks of row homes and twins where the yard is a stamp of grass. Outside it, lanes stretch and the next door is a drive. Bugs are still the summer product. The count per hour will not match Cherry Hill if you pretend every stop is next door.",
      "Farms at the edge are a different permission and a different pest. Do not wander up a lane because the map looks empty. Ask the company where the book stops. The season runs warm months. Winter is thin.",
    ],
    [
      { question: "Why is the door count lower outside the city?", answer: "Distance. Township and edge roads put minutes of driving between porches. Plan clusters or accept a smaller number." },
      { question: "Is Lancaster fiber?", answer: "No. There is no fiber city page for Lancaster on this desk. This is pest control." },
    ],
  ),
  row(
    "roofing:lancaster-pa",
    "Roofing Sales Jobs in Lancaster, PA",
    "Roofing Sales Jobs in Lancaster, PA",
    "Roofing sales jobs in Lancaster, PA: storm canvas and retail inspections, county lanes, and roofs you do not reach in a tight borough hour.",
    [
      "Roofing sales jobs in Lancaster County are where storm canvas and retail inspections actually share a week. Wind and hail show up often enough that knocking after weather is a real day. So is a booked inspection on a house with a long lane. You will not cover that county like a row of Cherry Hill splits.",
      "Travel within the county is normal. Overnight travel is a separate question if the hail is somewhere else. Get the pay event straight: signed, approved, or installed. This page does not print a percentage.",
    ],
    [
      { question: "Is Lancaster a storm market?", answer: "More than the close Philadelphia suburbs. Weather is part of the week. Retail inspections are still on the calendar. Read the listing for which one you were hired to do." },
      { question: "Can I stay local?", answer: "Inside the county, often yes, with a lot of driving. A multi-state storm crew is something else. Ask." },
    ],
  ),
  row(
    "windows-doors:lancaster-pa",
    "Window and Door Sales Jobs in Lancaster, PA",
    "Window Sales Jobs in Lancaster, PA",
    "Window and door sales jobs in Lancaster, PA: in-home appointments in town and on county lanes, with knocks that have to be worth the drive.",
    [
      "Window and door sales jobs in Lancaster mix town appointments with houses you drive to. The opening you are there to price might be a drafty farmhouse window or a standard suburban slider. Do not use the same five minutes for both, and do not drive twenty minutes to knock one neighbor unless the company wants that.",
      "Both decision makers matter more when the drive was long. Book them. The close is inside. Canvas is how you fill a hole near the appointment, not how you cover the whole county in a day.",
    ],
    [
      { question: "Is the county one neighborhood?", answer: "No. Town blocks and outlying houses are different trips. Cluster or you will spend the commission on gasoline." },
      { question: "Summer only?", answer: "No. Drafts and failed doors are not a mosquito calendar." },
    ],
  ),
  row(
    "window-cleaning:lancaster-pa",
    "Window Cleaning Sales Jobs in Lancaster, PA",
    "Window Cleaning Jobs in Lancaster",
    "Window cleaning sales jobs in Lancaster, PA: town glass you can cluster, country houses that need a reason to drive, and a warm season.",
    [
      "Window cleaning sales jobs in Lancaster make sense in town, where you can book several houses in a morning. A single country house is a drive. Sell it only if the crew day can hold more than one stop in that direction.",
      "Spring is when people see the film. The season fades when it freezes. Repeat the town streets next year.",
    ],
    [
      { question: "Where is the route efficient?", answer: "In town and in close suburbs. Isolated lanes are a poor default unless several jobs sit together." },
      { question: "Replacement or cleaning?", answer: "Cleaning. Replacement is the window and door page." },
    ],
  ),
  row(
    "exterior-cleaning:lancaster-pa",
    "Exterior Cleaning Sales Jobs in Lancaster, PA",
    "Exterior Cleaning Jobs in Lancaster",
    "Exterior cleaning sales jobs in Lancaster, PA: town houses you can stack, farm lanes that may not want a truck, and a freeze that ends the year.",
    [
      "Exterior cleaning sales jobs in Lancaster work on houses in town and close suburbs where a truck can wash two or three in a day. A lane with one house and a long gravel drive is a maybe. Ask if they want the truck up that lane before you sell it.",
      "Siding film and concrete are the picture. Winter stops you. Do not talk like this is coastal Florida.",
    ],
    [
      { question: "What do you refuse to promise?", answer: "That a wash fixes rot or a bad roof. Point at what water and soap can do." },
      { question: "Season?", answer: "Warm months. Lancaster freezes." },
    ],
  ),
  row(
    "exteriors:lancaster-pa",
    "Exterior Sales Jobs in Lancaster, PA",
    "Exterior Sales Jobs in Lancaster, PA",
    "Exterior sales jobs in Lancaster, PA: siding on town houses and country homes, longer drives, and a second visit you must plan.",
    [
      "Exterior sales jobs in Lancaster are siding decisions with a windshield between them. Town houses can be walked. Country houses are appointments. The second visit has to be on purpose or the lead dies while you are on the other side of the county.",
      "Owners here can spot a pitch that was written for a subdivision in another state. Talk about the wall in front of you. Ask if the territory is Lancaster County or a moving crew.",
    ],
    [
      { question: "Is the yes fast?", answer: "No. Siding is a project. Set the next time before you leave the property." },
      { question: "Cleaning or product?", answer: "Product. Usually siding. A wash is a different page." },
    ],
  ),
  row(
    "pest-control:chicago-il",
    "Pest Control Sales Jobs in Chicago, IL",
    "Pest Control Jobs in Chicago, IL",
    "Pest control sales jobs in Chicago, IL: bungalows, two-flats, gangways, and a summer that is not a Florida calendar.",
    [
      "Pest control sales jobs in Chicago are gangways and front doors on bungalows and two-flats. You may be talking to the owner of the whole building or to a tenant who cannot start the account. Ask. Alleys and tight walks change how many doors an hour you get versus a South Jersey colonial street.",
      "The season is late spring through early fall. Winter is not a porch job. Rats and ants are city conversations. Mosquitoes show up where there is a yard, which is not every block. Pick a side of the city for the day. Crossing it at 4 p.m. is not a route.",
    ],
    [
      { question: "Two-flat or bungalow?", answer: "Both are on the map. The two-flat needs the right person. The bungalow is more often one household. Ask either way." },
      { question: "Is Chicago a fiber page?", answer: "No. There is no AT&T Fiber city page for Chicago here. This is pest control." },
    ],
  ),
  row(
    "roofing:chicago-il",
    "Roofing Sales Jobs in Chicago, IL",
    "Roofing Sales Jobs in Chicago, IL",
    "Roofing sales jobs in Chicago, IL: flat roofs, bungalow asphalt, wind and ice, and inspections that respect access.",
    [
      "Roofing sales jobs in Chicago are not a shingle-only suburb story. Bungalows have asphalt you can see from the walk. Two-flats and older blocks may have flat roofs, ice, and access that a speech about hail does not solve. Wind and winter are part of why people open the door. So is a leak they have patched themselves.",
      "You need permission and a safe way to look. Do not promise a climb you should not make. Suburbs on the desk are not automatically included. Ask which neighborhoods are tomorrow.",
    ],
    [
      { question: "Is it all storm canvas?", answer: "Storms and wind matter. So do old roofs and ice. The listing should say whether you are knocking cold or running booked inspections." },
      { question: "Winter?", answer: "Looking and knocking get harder. Ice is a reason people call and a reason the day is short. Plan for that." },
    ],
  ),
  row(
    "windows-doors:chicago-il",
    "Window and Door Sales Jobs in Chicago, IL",
    "Window Sales Jobs in Chicago, IL",
    "Window and door sales jobs in Chicago, IL: bungalow openings, two-flat entries, drafts, and appointments that respect who owns the frame.",
    [
      "Window and door sales jobs in Chicago run into bungalow window weights, drafty fronts, and two-flats where the entry door is a building decision. Know if you are pricing one unit or the shell. A tenant who likes the idea is not a contract.",
      "The close is inside, often with more than one adult. Winter drafts are a real reason to book. Summer is when people will stand in the gangway and talk. Knock near the appointment. Do not cross the city to stay busy.",
    ],
    [
      { question: "Who signs?", answer: "The owner of the opening. In a two-flat that may be one person for the whole building. Ask before the presentation." },
      { question: "Is this window cleaning?", answer: "No. This is replacement. Cleaning is a separate, more seasonal knock." },
    ],
  ),
  row(
    "window-cleaning:chicago-il",
    "Window Cleaning Sales Jobs in Chicago, IL",
    "Window Cleaning Jobs in Chicago",
    "Window cleaning sales jobs in Chicago, IL: bungalow glass, two-flat access, spring grime, and a season that ends when it freezes.",
    [
      "Window cleaning sales jobs in Chicago are spring grime on bungalow glass and the question of who lets you wash a two-flat. Alleys and gangways are how you see the back of the house. If you cannot get a ladder where it needs to go, do not sell the back elevation.",
      "The season stops when it freezes. Cluster a few blocks. A North Side morning and a South Side afternoon is a drive, not a route.",
    ],
    [
      { question: "When does the route run?", answer: "After winter grime, through early fall. January is the wrong month to build a book." },
      { question: "Storefronts?", answer: "Possible on neighborhood commercial streets. High-rise curtain wall is not this job." },
    ],
  ),
  row(
    "exterior-cleaning:chicago-il",
    "Exterior Cleaning Sales Jobs in Chicago, IL",
    "Exterior Cleaning Jobs in Chicago",
    "Exterior cleaning sales jobs in Chicago, IL: bungalow brick and siding, winter film, and washes that wait until it will not freeze.",
    [
      "Exterior cleaning sales jobs in Chicago sell the film winter leaves on brick bungalows and on siding in the neighborhoods. You cannot wash it while it will freeze overnight. The selling can start as the weather turns. The work cannot.",
      "Access is the objection. Gangways, alleys, and parked cars decide whether the crew can do what you sold. Look before you book. Stay in one part of the city.",
    ],
    [
      { question: "What season is the wash?", answer: "Warm months after the freeze risk drops. Selling in March for an April crew is normal. Washing in January is not." },
      { question: "What are you pointing at?", answer: "Salt film, mildew, and concrete. Not a new roof and not new siding." },
    ],
  ),
  row(
    "exteriors:chicago-il",
    "Exterior Sales Jobs in Chicago, IL",
    "Exterior Sales Jobs in Chicago, IL",
    "Exterior sales jobs in Chicago, IL: siding and exterior projects on bungalows and two-flats, with a second visit in the same neighborhood.",
    [
      "Exterior sales jobs in Chicago are siding and exterior projects on bungalows and on two-flats where one owner may control the shell. Brick that stays brick is not a siding lead. Vinyl and wood that have failed are. You need a second visit on a street you will actually return to.",
      "A city this large is several territories. Ask which one is yours. A rep covering every side of Chicago will not close a project that needs a follow-up evening.",
    ],
    [
      { question: "Is every bungalow a siding lead?", answer: "No. Many are brick on purpose. Sell the wall that is actually failing, not the house style." },
      { question: "Wash or replacement?", answer: "Replacement and similar exterior products. A wash is the cleaning page." },
    ],
  ),
  row(
    "pest-control:boston-ma",
    "Pest Control Sales Jobs in Boston, MA",
    "Pest Control Jobs in Boston, MA",
    "Pest control sales jobs in Boston, MA: triple-deckers, landlords, short porches, and a New England summer that ends early.",
    [
      "Pest control sales jobs in Boston are triple-deckers and tight streets. The person on the first floor may not own the building. You need the landlord or you do not have an account. Parking is part of the job. A suburban count from New Jersey will not happen on a Dorchester block if you spend ten minutes finding the car.",
      "The season is shorter than the South. Late spring to early fall is the porch. Winter is inside-only talk, and this product is not an inside-only sale. Mice come up in conversation more than mosquitoes on streets without yards. Where there is a pocket yard, mosquitoes still matter.",
    ],
    [
      { question: "Who do you need at the door?", answer: "Whoever can start service for the building. A tenant alone is often not that person. Ask in the first minute." },
      { question: "Is Boston an AT&T Fiber market here?", answer: "No. New England is outside that list. This page is pest control." },
    ],
  ),
  row(
    "roofing:boston-ma",
    "Roofing Sales Jobs in Boston, MA",
    "Roofing Sales Jobs in Boston, MA",
    "Roofing sales jobs in Boston, MA: triple-decker roofs, ice dams, tight access, and inspections that need the owner.",
    [
      "Roofing sales jobs in Boston mean ice, old layers, and roofs you cannot casually walk because the building is tall and the street is tight. Triple-deckers need the owner. A top-floor tenant with a stain on the ceiling is a lead only if you can reach the person who hires the roofer.",
      "Nor’easters are a reason people talk. They are also a reason you cannot pretend this is a July suburb route. Access and parking decide whether an inspection is real.",
    ],
    [
      { question: "Is access the hard part?", answer: "Often yes. Tight streets, height, and ownership. Do not sell an inspection nobody can safely do." },
      { question: "Season?", answer: "Storms are not only summer. Ice season creates leaks and also short, cold days. Read the listing for canvas versus booked inspections." },
    ],
  ),
  row(
    "windows-doors:boston-ma",
    "Window and Door Sales Jobs in Boston, MA",
    "Window Sales Jobs in Boston, MA",
    "Window and door sales jobs in Boston, MA: drafty triple-deckers, historic-district limits, and appointments with the owner.",
    [
      "Window and door sales jobs in Boston are drafts, failed ropes, and entries that stick. In some neighborhoods you also have rules about what the street-facing window can look like. Do not promise a vinyl unit the block will not allow. Get the owner, not only the tenant, in the room.",
      "The close is inside. Knocking is how you fill time on the same block, where parking already cost you the first ten minutes. Winter is a reason they care. Summer is when the stairwell is bearable.",
    ],
    [
      { question: "Can you replace any window you see?", answer: "Not if the street face is restricted. Ask what is allowed before you price a front elevation." },
      { question: "Who signs?", answer: "The owner. Triple-decker tenants can point at the problem and still be unable to buy." },
    ],
  ),
  row(
    "window-cleaning:boston-ma",
    "Window Cleaning Sales Jobs in Boston, MA",
    "Window Cleaning Jobs in Boston, MA",
    "Window cleaning sales jobs in Boston, MA: triple-decker glass, spring grime, landlord permission, and a short New England season.",
    [
      "Window cleaning sales jobs in Boston are spring grime on triple-decker glass and the question of ladders on a tight street. If you cannot stage the crew without blocking the block, do not sell every elevation. Landlords decide more often than tenants.",
      "The season is shorter than the Carolinas. You want the same streets next April. A summer-only blitz with no return is a weak way to sell glass people see every year.",
    ],
    [
      { question: "When does it start?", answer: "When winter film is obvious and it is warm enough to work outside. It fades in the fall." },
      { question: "High-rises?", answer: "Not this page. Neighborhood buildings you can access are the job." },
    ],
  ),
  row(
    "exterior-cleaning:boston-ma",
    "Exterior Cleaning Sales Jobs in Boston, MA",
    "Exterior Cleaning Jobs in Boston",
    "Exterior cleaning sales jobs in Boston, MA: winter film on siding and brick, tight access, and washes after the freeze risk drops.",
    [
      "Exterior cleaning sales jobs in Boston sell the film a winter leaves on siding and on brick you are actually allowed to wash. Triple-decker access and parked cars decide the job. Look at the gangway or the side yard before you name a date.",
      "You cannot wash through a freeze. Sell for the warm window. Stay in one neighborhood so the truck is not crossing the city between two houses.",
    ],
    [
      { question: "What season is the work?", answer: "After freezing nights are done, through early fall. March can be a selling month and a bad washing month." },
      { question: "Is this siding replacement?", answer: "No. It is a wash. Replacement is the exterior sales page." },
    ],
  ),
  row(
    "exteriors:boston-ma",
    "Exterior Sales Jobs in Boston, MA",
    "Exterior Sales Jobs in Boston, MA",
    "Exterior sales jobs in Boston, MA: siding on triple-deckers and houses, street-facing rules, and a second visit with the owner.",
    [
      "Exterior sales jobs in Boston run into buildings where the street face matters and the owner is not on the first floor. Siding that fails in the back is a different conversation from a front wall the neighborhood will judge. You need the owner and a second visit.",
      "A Boston territory is a few neighborhoods, not the whole map. If you will not be back on that street, do not open a project sale.",
    ],
    [
      { question: "Can you change the front wall?", answer: "Sometimes no. Ask about limits before you price a street-facing elevation you cannot install." },
      { question: "How fast is the yes?", answer: "Slow. It is a project with an owner and, in some places, a rule about appearance. Set the next meeting." },
    ],
  ),
])
