import { saveShortlist } from "@/lib/actions/desk";
import { countryLabel, siteUrl } from "@/lib/format";
import type { Candidate, Employer, Shortlist } from "@/lib/types";
import { Flash } from "./flash";

export function ShortlistForm({
  shortlist,
  candidates,
  selected,
  employers,
  flash,
}: {
  shortlist: Shortlist | null;
  candidates: Candidate[];
  selected: string[];
  employers: Employer[];
  flash: Record<string, string | string[] | undefined>;
}) {
  const action = saveShortlist.bind(null, shortlist?.id ?? null);
  const chosen = new Set(selected);
  return (
    <form action={action} className="grid gap-4">
      <Flash searchParams={flash} />
      {shortlist?.isPublished ? (
        <p className="rounded-xl bg-[#fff4d4] px-3 py-2 text-sm">
          Share link: {siteUrl()}/s/{shortlist.token}
        </p>
      ) : null}
      <label className="grid gap-1 text-sm">Title<input className="input" name="title" required defaultValue={shortlist?.title} /></label>
      <label className="grid gap-1 text-sm">Prepared for<input className="input" name="preparedFor" required defaultValue={shortlist?.preparedFor} /></label>
      <label className="grid gap-1 text-sm">
        Employer record
        <select className="input" name="employerId" defaultValue={shortlist?.employerId ?? ""}>
          <option value="">None</option>
          {employers.map((employer) => (
            <option key={employer.id} value={employer.id}>{employer.company}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">Intro<textarea className="area" name="intro" defaultValue={shortlist?.intro} /></label>
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium">Candidates from the database</legend>
        {candidates.map((candidate) => (
          <label key={candidate.id} className="flex items-start gap-2 rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-ink/10">
            <input type="checkbox" name="candidateId" value={candidate.id} defaultChecked={chosen.has(candidate.id)} />
            <span>
              {candidate.realName} · {candidate.roleTitle} · {countryLabel(candidate.country)}
              {candidate.isPublished ? "" : " · draft"}
              {candidate.isSample ? " · fictional" : ""}
            </span>
          </label>
        ))}
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isSample" defaultChecked={shortlist?.isSample ?? false} /> Fictional sample packet
      </label>
      <div className="flex gap-2">
        <button className="h-10 rounded-full bg-ink px-4 text-sm font-semibold text-paper" name="intent" value="save" type="submit">Save</button>
        <button className="h-10 rounded-full bg-dandelion px-4 text-sm font-semibold" name="intent" value="publish" type="submit">Publish link</button>
        {shortlist?.isPublished ? (
          <button className="h-10 rounded-full px-4 text-sm ring-1 ring-ink/15" name="intent" value="unpublish" type="submit">Unpublish</button>
        ) : null}
      </div>
    </form>
  );
}
