import { createJob, updateJobAction } from "@/lib/actions/jobs";
import type { JobPost } from "@/lib/types";
import { Flash } from "./flash";

export function JobForm({ job, flash }: { job: JobPost | null; flash: Record<string, string | string[] | undefined> }) {
  const action = job ? updateJobAction.bind(null, job.id) : createJob;
  return (
    <form action={action} className="grid gap-4">
      <Flash searchParams={flash} />
      <label className="grid gap-1 text-sm">Title<input className="input" name="title" required defaultValue={job?.title} /></label>
      <label className="grid gap-1 text-sm">Slug<input className="input" name="slug" defaultValue={job?.slug} /></label>
      <label className="grid gap-1 text-sm">Description<textarea className="area" name="description" required defaultValue={job?.description} /></label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">Posted<input className="input" type="date" name="datePosted" required defaultValue={job?.datePosted} /></label>
        <label className="grid gap-1 text-sm">Valid through<input className="input" type="date" name="validThrough" required defaultValue={job?.validThrough} /></label>
        <label className="grid gap-1 text-sm">
          Type
          <select className="input" name="employmentType" defaultValue={job?.employmentType ?? "FULL_TIME"}>
            <option>FULL_TIME</option>
            <option>PART_TIME</option>
            <option>CONTRACTOR</option>
            <option>TEMPORARY</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">Hiring company<input className="input" name="hiringOrganization" required defaultValue={job?.hiringOrganization} /></label>
        <label className="grid gap-1 text-sm">
          Country
          <select className="input" name="country" defaultValue={job?.country ?? "EG"}>
            <option value="EG">Egypt</option>
            <option value="BZ">Belize</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">Location<input className="input" name="locationLabel" required defaultValue={job?.locationLabel} /></label>
        <label className="grid gap-1 text-sm">Pay from<input className="input" name="salaryMin" defaultValue={job?.salaryMin ?? ""} /></label>
        <label className="grid gap-1 text-sm">Pay to<input className="input" name="salaryMax" defaultValue={job?.salaryMax ?? ""} /></label>
        <label className="grid gap-1 text-sm">
          Pay period
          <select className="input" name="salaryUnit" defaultValue={job?.salaryUnit ?? "MONTH"}>
            <option value="">None</option>
            <option value="HOUR">Hour</option>
            <option value="MONTH">Month</option>
            <option value="YEAR">Year</option>
          </select>
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isSample" defaultChecked={job?.isSample ?? false} /> Fictional sample
      </label>
      <div className="flex gap-2">
        <button className="h-10 rounded-full bg-ink px-4 text-sm font-semibold text-paper" name="intent" value="save" type="submit">Save</button>
        <button className="h-10 rounded-full bg-dandelion px-4 text-sm font-semibold" name="intent" value="publish" type="submit">Publish</button>
        {job?.isPublished ? <button className="h-10 rounded-full px-4 text-sm ring-1 ring-ink/15" name="intent" value="unpublish" type="submit">Unpublish</button> : null}
      </div>
    </form>
  );
}
