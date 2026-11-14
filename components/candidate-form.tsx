import Image from "next/image"
import { industries } from "@/data/industries"
import { createCandidate, updateCandidate } from "@/lib/actions/candidates"
import { SCHEDULES, WORK_STYLES } from "@/lib/labels"
import { Field } from "@/components/field"
import { LocationSelect, controlClass } from "@/components/location-select"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type EditorCandidate = {
  id: string
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
  yearsExperience: number | null
  salesType: string
  availability: string
  willingToTravel: boolean
  payStructure: string
  workStyle: string
  schedule: string
  locationSlug: string
  industrySlugs: string[]
  isSample: boolean
  isPublished: boolean
  generationSource: string | null
  photoPublic: string | null
  hasOriginal: boolean
}

export function CandidateForm({
  candidate,
  hasModel,
  flash,
}: {
  candidate: EditorCandidate | null
  hasModel: boolean
  flash?: React.ReactNode
}) {
  const action = candidate ? updateCandidate.bind(null, candidate.id) : createCandidate
  const selected = new Set(candidate?.industrySlugs ?? [])

  return (
    <form action={action} className="grid gap-8">
      {flash}
      <section className="grid gap-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
        <div>
          <h2 className="text-2xl">Private record</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Name, phone, and email stay on the desk. They are not rendered on the public profile.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Legal name" htmlFor="realName">
            <Input id="realName" name="realName" required defaultValue={candidate?.realName} className="h-10 bg-background" />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" required defaultValue={candidate?.phone} className="h-10 bg-background" />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" required defaultValue={candidate?.email} className="h-10 bg-background" />
          </Field>
          <Field label="Years in sales" htmlFor="yearsExperience">
            <Input
              id="yearsExperience"
              name="yearsExperience"
              inputMode="numeric"
              defaultValue={candidate?.yearsExperience ?? ""}
              className="h-10 bg-background"
            />
          </Field>
        </div>
        <Field
          label="Interview notes"
          htmlFor="interviewNotes"
          hint="Write what Alex heard. Generate profile strips the legal name, phone, and email before drafting public copy. You still approve the text."
        >
          <Textarea
            id="interviewNotes"
            name="interviewNotes"
            required
            rows={8}
            defaultValue={candidate?.interviewNotes}
            className="min-h-40 bg-background"
          />
        </Field>
        <Field label="Industries" hint="A rep can live outside an AT&T Fiber market and still have fiber experience. Fiber job posts are the pages with the market rule.">
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <label key={industry.slug} className="flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-sm ring-1 ring-foreground/10">
                <input
                  type="checkbox"
                  name="industries"
                  value={industry.slug}
                  defaultChecked={selected.has(industry.slug)}
                  className="accent-[#234237]"
                />
                {industry.name}
              </label>
            ))}
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location" htmlFor="locationSlug">
            <LocationSelect id="locationSlug" name="locationSlug" required defaultValue={candidate?.locationSlug ?? ""} />
          </Field>
          <Field label="Type of sales" htmlFor="salesType">
            <Input id="salesType" name="salesType" defaultValue={candidate?.salesType} placeholder="Residential fiber" className="h-10 bg-background" />
          </Field>
          <Field label="Availability" htmlFor="availability">
            <Input id="availability" name="availability" defaultValue={candidate?.availability} className="h-10 bg-background" />
          </Field>
          <Field label="Pay they will take" htmlFor="payStructure">
            <Input id="payStructure" name="payStructure" defaultValue={candidate?.payStructure} className="h-10 bg-background" />
          </Field>
          <Field label="Team or solo" htmlFor="workStyle">
            <select id="workStyle" name="workStyle" defaultValue={candidate?.workStyle ?? ""} className={controlClass}>
              <option value="">Not specified</option>
              {WORK_STYLES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Schedule" htmlFor="schedule">
            <select id="schedule" name="schedule" defaultValue={candidate?.schedule ?? ""} className={controlClass}>
              <option value="">Not specified</option>
              {SCHEDULES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="willingToTravel" defaultChecked={candidate?.willingToTravel} className="accent-[#234237]" />
          Willing to travel
        </label>
        <Field label="Photo" htmlFor="photo" hint="Optional. The public site gets a blurred crop. The original stays on the desk.">
          <Input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="h-10 bg-background" />
        </Field>
        {candidate?.photoPublic ? (
          <div className="flex items-center gap-4">
            <Image src={candidate.photoPublic} alt="" width={64} height={64} unoptimized className="size-16 rounded-full object-cover" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="removePhoto" className="accent-[#234237]" />
              Remove photo
            </label>
            {candidate.hasOriginal ? (
              <a className="text-sm underline-offset-4 hover:underline" href={`/admin/media/${candidate.id}`}>
                Original, desk only
              </a>
            ) : null}
          </div>
        ) : null}
      </section>

      {candidate ? (
        <section className="grid gap-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
          <div>
            <h2 className="text-2xl">Public profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Shown as {candidate.pseudonym}. {candidate.isPublished ? "Live on the talent page." : "Not published."}
              {candidate.isSample ? " Sample record." : ""}{" "}
              {candidate.generationSource ? `Last draft: ${candidate.generationSource}.` : ""}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {hasModel
                ? "OPENAI_API_KEY is set. Generate profile will call the model, then fall back to the template if the call fails."
                : "No OPENAI_API_KEY is set. Generate profile will use the built-in template."}
            </p>
          </div>
          <Field label="Headline" htmlFor="headline">
            <Input id="headline" name="headline" defaultValue={candidate.headline} className="h-10 bg-background" />
          </Field>
          <Field label="Summary" htmlFor="summary">
            <Textarea id="summary" name="summary" rows={4} defaultValue={candidate.summary} className="min-h-28 bg-background" />
          </Field>
          <Field label="Background" htmlFor="background">
            <Textarea id="background" name="background" rows={3} defaultValue={candidate.background} className="bg-background" />
          </Field>
          <Field label="Sales experience" htmlFor="experience">
            <Textarea id="experience" name="experience" rows={3} defaultValue={candidate.experience} className="bg-background" />
          </Field>
          <Field label="Personality" htmlFor="personality">
            <Textarea id="personality" name="personality" rows={3} defaultValue={candidate.personality} className="bg-background" />
          </Field>
          <Field label="What they want" htmlFor="lookingFor">
            <Textarea id="lookingFor" name="lookingFor" rows={3} defaultValue={candidate.lookingFor} className="bg-background" />
          </Field>
          <div className="flex flex-wrap gap-2">
            <SubmitButton pendingLabel="Saving…" name="intent" value="save">
              Save
            </SubmitButton>
            <SubmitButton pendingLabel="Drafting…" name="intent" value="generate" variant="secondary">
              Generate profile
            </SubmitButton>
            <SubmitButton pendingLabel="Publishing…" name="intent" value="publish">
              Publish
            </SubmitButton>
            <SubmitButton pendingLabel="Updating…" name="intent" value="unpublish" variant="outline">
              Unpublish
            </SubmitButton>
          </div>
          <p className="text-sm text-muted-foreground">
            Public URL: <a className="underline-offset-4 hover:underline" href={`/candidates/${candidate.slug}`}>/candidates/{candidate.slug}</a>
          </p>
        </section>
      ) : (
        <SubmitButton pendingLabel="Saving…">Add candidate</SubmitButton>
      )}
    </form>
  )
}
