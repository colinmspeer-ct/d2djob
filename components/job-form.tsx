import { industries } from "@/data/industries"
import { createJob, updateJob } from "@/lib/actions/jobs"
import { EMPLOYMENT_TYPES, SALARY_UNITS } from "@/lib/labels"
import { Field } from "@/components/field"
import { LocationSelect, controlClass } from "@/components/location-select"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type EditorJob = {
  id: string
  slug: string
  title: string
  description: string
  datePosted: string
  validThrough: string
  employmentType: string
  hiringOrganization: string
  industrySlug: string
  locationSlug: string
  salaryMin: number | null
  salaryMax: number | null
  salaryUnit: string | null
  commissionNote: string
  isSample: boolean
  isPublished: boolean
}

export function JobForm({ job, flash }: { job: EditorJob | null; flash?: React.ReactNode }) {
  const action = job ? updateJob.bind(null, job.id) : createJob
  return (
    <form action={action} className="grid gap-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
      {flash}
      <Field label="Title" htmlFor="title">
        <Input id="title" name="title" required defaultValue={job?.title} className="h-10 bg-background" />
      </Field>
      <Field label="Slug" htmlFor="slug" hint="Leave blank on a new listing and one will be made from the title.">
        <Input id="slug" name="slug" defaultValue={job?.slug} className="h-10 bg-background" />
      </Field>
      <Field label="Description" htmlFor="description" hint="This text is the JobPosting description. Say whether pay is base, commission, or both.">
        <Textarea id="description" name="description" required rows={10} defaultValue={job?.description} className="min-h-48 bg-background" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Industry" htmlFor="industrySlug">
          <select id="industrySlug" name="industrySlug" required defaultValue={job?.industrySlug ?? ""} className={controlClass}>
            <option value="">Select</option>
            {industries.map((industry) => (
              <option key={industry.slug} value={industry.slug}>
                {industry.name}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Location"
          htmlFor="locationSlug"
          hint="Fiber listings only save for official AT&T Fiber markets."
        >
          <LocationSelect id="locationSlug" name="locationSlug" required defaultValue={job?.locationSlug ?? ""} />
        </Field>
        <Field label="Employment type" htmlFor="employmentType">
          <select
            id="employmentType"
            name="employmentType"
            required
            defaultValue={job?.employmentType ?? "FULL_TIME"}
            className={controlClass}
          >
            {EMPLOYMENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Hiring organization" htmlFor="hiringOrganization">
          <Input
            id="hiringOrganization"
            name="hiringOrganization"
            required
            defaultValue={job?.hiringOrganization ?? "D2D Job"}
            className="h-10 bg-background"
          />
        </Field>
        <Field label="Date posted" htmlFor="datePosted">
          <Input id="datePosted" name="datePosted" type="date" required defaultValue={job?.datePosted} className="h-10 bg-background" />
        </Field>
        <Field label="Valid through" htmlFor="validThrough">
          <Input id="validThrough" name="validThrough" type="date" required defaultValue={job?.validThrough} className="h-10 bg-background" />
        </Field>
        <Field label="Base pay from" htmlFor="salaryMin">
          <Input id="salaryMin" name="salaryMin" inputMode="numeric" defaultValue={job?.salaryMin ?? ""} className="h-10 bg-background" />
        </Field>
        <Field label="Base pay to" htmlFor="salaryMax">
          <Input id="salaryMax" name="salaryMax" inputMode="numeric" defaultValue={job?.salaryMax ?? ""} className="h-10 bg-background" />
        </Field>
        <Field label="Pay period" htmlFor="salaryUnit">
          <select id="salaryUnit" name="salaryUnit" defaultValue={job?.salaryUnit ?? ""} className={controlClass}>
            <option value="">No base</option>
            {SALARY_UNITS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Commission language" htmlFor="commissionNote">
          <Input id="commissionNote" name="commissionNote" defaultValue={job?.commissionNote} className="h-10 bg-background" />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isSample" defaultChecked={job?.isSample ?? false} className="accent-[#234237]" />
        Mark as a sample listing
      </label>
      {job ? (
        <div className="flex flex-wrap gap-2">
          <SubmitButton pendingLabel="Saving…" name="intent" value="save">
            Save
          </SubmitButton>
          <SubmitButton pendingLabel="Publishing…" name="intent" value="publish">
            Publish
          </SubmitButton>
          <SubmitButton pendingLabel="Updating…" name="intent" value="unpublish" variant="outline">
            Unpublish
          </SubmitButton>
        </div>
      ) : (
        <SubmitButton pendingLabel="Saving…">Create job</SubmitButton>
      )}
      {job ? (
        <p className="text-sm text-muted-foreground">
          {job.isPublished ? "Published." : "Not published."}{" "}
          <a className="underline-offset-4 hover:underline" href={`/job/${job.slug}`}>
            View public page
          </a>
        </p>
      ) : null}
    </form>
  )
}
