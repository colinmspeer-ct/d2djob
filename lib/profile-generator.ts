import { hashString } from "./hash"

export type GenerateInput = {
  pseudonym: string
  realName: string
  interviewNotes: string
  city: string
  state: string
  county: string
  industryNames: string[]
  yearsExperience: number | null
  salesType: string
  availability: string
  willingToTravel: boolean
  payStructure: string
  workStyle: string
  schedule: string
}

export type GeneratedProfile = {
  headline: string
  summary: string
  background: string
  experience: string
  personality: string
  lookingFor: string
  yearsExperience: number | null
  salesType: string
  availability: string
  willingToTravel: boolean
  payStructure: string
  workStyle: "" | "team" | "solo" | "either"
  schedule: "" | "full-time" | "seasonal" | "either"
}

const WORK: Record<string, string> = {
  team: "a team",
  solo: "a solo book",
  either: "a team or a solo book",
}

const SCHEDULE: Record<string, string> = {
  "full-time": "full-time",
  seasonal: "seasonal",
  either: "full-time or seasonal",
}

export function pseudonymFromName(realName: string) {
  const parts = realName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "Rep"
  const first = parts[0]!
  const firstLabel = first.charAt(0).toUpperCase() + first.slice(1)
  if (parts.length === 1) return firstLabel
  const last = parts[parts.length - 1]!
  return `${firstLabel} ${last.charAt(0).toUpperCase()}.`
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function redactNotes(notes: string, realName: string) {
  let text = notes
  const parts = realName.trim().split(/\s+/).filter(Boolean)
  if (realName.trim().length > 2) {
    text = text.replace(new RegExp(escapeRegExp(realName.trim()), "gi"), parts[0] ?? "the rep")
  }
  for (const part of parts.slice(1)) {
    if (part.length < 3) continue
    text = text.replace(new RegExp(`\\b${escapeRegExp(part)}\\b`, "gi"), "")
  }
  text = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "")
  text = text.replace(/\b(?:\+?1[-.\s]*)?(?:\(?\d{3}\)?[-.\s]*)\d{3}[-.\s]*\d{4}\b/g, "")
  return text.replace(/\s{2,}/g, " ").replace(/\s+([,.])/g, "$1").trim()
}

export function scrubPublicText(text: string, realName: string) {
  return redactNotes(text, realName)
}

function joinList(items: string[]) {
  if (items.length === 0) return "field sales"
  if (items.length === 1) return items[0]!
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
}

function scrubProfile(profile: GeneratedProfile, realName: string): GeneratedProfile {
  return {
    ...profile,
    headline: scrubPublicText(profile.headline, realName),
    summary: scrubPublicText(profile.summary, realName),
    background: scrubPublicText(profile.background, realName),
    experience: scrubPublicText(profile.experience, realName),
    personality: scrubPublicText(profile.personality, realName),
    lookingFor: scrubPublicText(profile.lookingFor, realName),
    salesType: scrubPublicText(profile.salesType, realName),
    availability: scrubPublicText(profile.availability, realName),
    payStructure: scrubPublicText(profile.payStructure, realName),
  }
}

export function generateFromTemplate(input: GenerateInput): GeneratedProfile {
  const name = input.pseudonym
  const place = `${input.city}, ${input.state}`
  const industries = joinList(input.industryNames.map((item) => item.toLowerCase()))
  const years = input.yearsExperience
  const yearText = years == null ? "field experience" : `${years} year${years === 1 ? "" : "s"}`
  const variant = hashString(`${name}:${place}`) % 3
  const openers = [
    `${name} has ${yearText} selling ${industries} around ${place}.`,
    `Most of ${name}'s recent work is ${industries}, based in ${place}.`,
    `${place} is home base for ${name}, who has ${yearText} in ${industries}.`,
  ]
  const travel = input.willingToTravel
    ? `${name.split(" ")[0]} will travel for the right territory.`
    : `${name.split(" ")[0]} wants to stay local.`
  const schedule = SCHEDULE[input.schedule] ?? "a set schedule"
  const style = WORK[input.workStyle] ?? "a clear seat"
  const pay = input.payStructure || "a pay plan that is spelled out before the start date"
  const sales = input.salesType || input.industryNames.join(", ") || "door-to-door sales"
  const availability = input.availability || "a regular week"
  const personalities = [
    "Short script, and done with the stop once someone says no.",
    "Keeps a written route log and starts early.",
    "Patient on the door, and direct about the price.",
  ]

  const profile: GeneratedProfile = {
    headline: `${yearText[0]!.toUpperCase()}${yearText.slice(1)} in ${industries}, based in ${input.city}`.slice(0, 140),
    summary: `${openers[variant]} The ask is ${schedule} work with ${style}, paid as ${pay}. ${travel}`,
    background: `Sells ${sales} out of ${place}${input.county ? ` (${input.county})` : ""}. Available ${availability}.`,
    experience: `${yearText[0]!.toUpperCase()}${yearText.slice(1)} of ${sales}. The public profile sticks to the kind of work and the market, not a contact sheet.`,
    personality: personalities[variant]!,
    lookingFor: `${schedule[0]!.toUpperCase()}${schedule.slice(1)} ${style}, ${pay}. ${travel} ${input.willingToTravel ? "Relocation only if it was already part of the ask." : "Not looking to relocate."}`,
    yearsExperience: input.yearsExperience,
    salesType: input.salesType,
    availability: input.availability,
    willingToTravel: input.willingToTravel,
    payStructure: input.payStructure,
    workStyle: asWorkStyle(input.workStyle),
    schedule: asSchedule(input.schedule),
  }

  return scrubProfile(profile, input.realName)
}

const generatedSchemaKeys = [
  "headline",
  "summary",
  "background",
  "experience",
  "personality",
  "lookingFor",
] as const

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function asWorkStyle(value: string): GeneratedProfile["workStyle"] {
  if (value === "team" || value === "solo" || value === "either") return value
  return ""
}

function asSchedule(value: string): GeneratedProfile["schedule"] {
  if (value === "full-time" || value === "seasonal" || value === "either") return value
  return ""
}

function parseModelJson(raw: string) {
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim()
  return JSON.parse(cleaned) as Record<string, unknown>
}

function profileFromModel(data: Record<string, unknown>, input: GenerateInput): GeneratedProfile {
  const workStyle = asString(data.workStyle)
  const schedule = asString(data.schedule)
  const years = data.yearsExperience
  const profile: GeneratedProfile = {
    headline: asString(data.headline).slice(0, 140),
    summary: asString(data.summary).slice(0, 800),
    background: asString(data.background).slice(0, 800),
    experience: asString(data.experience).slice(0, 800),
    personality: asString(data.personality).slice(0, 500),
    lookingFor: asString(data.lookingFor).slice(0, 800),
    yearsExperience: typeof years === "number" && Number.isFinite(years) ? Math.round(years) : input.yearsExperience,
    salesType: asString(data.salesType).slice(0, 80) || input.salesType,
    availability: asString(data.availability).slice(0, 160) || input.availability,
    willingToTravel: typeof data.willingToTravel === "boolean" ? data.willingToTravel : input.willingToTravel,
    payStructure: asString(data.payStructure).slice(0, 160) || input.payStructure,
    workStyle: asWorkStyle(workStyle || input.workStyle),
    schedule: asSchedule(schedule || input.schedule),
  }
  for (const key of generatedSchemaKeys) {
    if (profile[key].length < 8) {
      throw new Error(`Model left ${key} empty`)
    }
  }
  return scrubProfile(profile, input.realName)
}

async function generateWithOpenAI(input: GenerateInput, apiKey: string): Promise<GeneratedProfile> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "")
  const notes = redactNotes(input.interviewNotes, input.realName)
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write anonymized recruiting profiles for door-to-door sales reps. Never include a legal name, last name, phone number, email, street address, or other contact detail. Refer to the rep only by the pseudonym provided. Write plain, specific sentences a sales manager would trust. No hype, no clichés, no emoji. Return JSON only.",
        },
        {
          role: "user",
          content: JSON.stringify({
            pseudonym: input.pseudonym,
            city: input.city,
            state: input.state,
            county: input.county,
            industries: input.industryNames,
            yearsExperience: input.yearsExperience,
            salesType: input.salesType,
            availability: input.availability,
            willingToTravel: input.willingToTravel,
            payStructure: input.payStructure,
            workStyle: input.workStyle,
            schedule: input.schedule,
            redactedInterviewNotes: notes,
            jsonShape: {
              headline: "under 90 characters",
              summary: "2 or 3 sentences",
              background: "where they learned the work",
              experience: "years and type of sales",
              personality: "one or two concrete observations",
              lookingFor: "pay, travel, team or solo, full-time or seasonal",
              yearsExperience: "number or null",
              salesType: "short string",
              availability: "short string",
              willingToTravel: "boolean",
              payStructure: "short string",
              workStyle: "team | solo | either",
              schedule: "full-time | seasonal | either",
            },
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(20000),
  })

  if (!response.ok) {
    throw new Error(`Model request failed (${response.status})`)
  }
  const body = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const content = body.choices?.[0]?.message?.content
  if (!content) throw new Error("Model returned an empty profile")
  return profileFromModel(parseModelJson(content), input)
}

export async function generateProfile(input: GenerateInput): Promise<{
  profile: GeneratedProfile
  source: "openai" | "template" | "template-fallback"
}> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { profile: generateFromTemplate(input), source: "template" }
  }
  try {
    const profile = await generateWithOpenAI(input, apiKey)
    return { profile, source: "openai" }
  } catch (error) {
    console.error("Profile generation used the template after a model error.", error)
    return { profile: generateFromTemplate(input), source: "template-fallback" }
  }
}
