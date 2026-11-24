import { createCandidate, updateCandidateAction } from "@/lib/actions/candidates";
import { countryLabel } from "@/lib/format";
import type { Candidate } from "@/lib/types";
import { Flash } from "./flash";

export function CandidateForm({
  candidate,
  flash,
}: {
  candidate: Candidate | null;
  flash: Record<string, string | string[] | undefined>;
}) {
  const action = candidate ? updateCandidateAction.bind(null, candidate.id) : createCandidate;
  const highlights = candidate?.highlights ?? ["", "", ""];
  return (
    <form action={action} className="grid gap-4">
      <Flash searchParams={flash} />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">Legal name<input className="input" name="realName" required defaultValue={candidate?.realName} /></label>
        <label className="grid gap-1 text-sm">Role<input className="input" name="roleTitle" required defaultValue={candidate?.roleTitle} /></label>
        <label className="grid gap-1 text-sm">Phone<input className="input" name="phone" required defaultValue={candidate?.phone} /></label>
        <label className="grid gap-1 text-sm">Email<input className="input" name="email" type="email" required defaultValue={candidate?.email} /></label>
        <label className="grid gap-1 text-sm">
          Country
          <select className="input" name="country" defaultValue={candidate?.country ?? "EG"}>
            <option value="EG">Egypt</option>
            <option value="BZ">Belize</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">City<input className="input" name="city" required defaultValue={candidate?.city} /></label>
        <label className="grid gap-1 text-sm">
          Monthly pay (USD)
          <input className="input" name="monthlyPay" defaultValue={candidate?.monthlyPayCents != null ? candidate.monthlyPayCents / 100 : ""} />
        </label>
        <label className="grid gap-1 text-sm">Start date<input className="input" name="startDate" type="date" defaultValue={candidate?.startDate ?? ""} /></label>
        <label className="grid gap-1 text-sm">Years<input className="input" name="yearsExperience" defaultValue={candidate?.yearsExperience ?? ""} /></label>
        <label className="grid gap-1 text-sm">Hours overlap<input className="input" name="willingToOverlap" defaultValue={candidate?.willingToOverlap} /></label>
      </div>
      <label className="grid gap-1 text-sm">Availability<input className="input" name="availability" defaultValue={candidate?.availability} /></label>
      <label className="grid gap-1 text-sm">
        Skills, comma separated
        <input className="input" name="skills" defaultValue={candidate?.skills.join(", ") ?? ""} />
      </label>
      {[0, 1, 2].map((index) => (
        <label key={index} className="grid gap-1 text-sm">
          Check {index + 1}
          <input className="input" name={`highlight${index + 1}`} defaultValue={highlights[index] ?? ""} />
        </label>
      ))}
      <label className="grid gap-1 text-sm">
        Interview notes
        <textarea className="area" name="interviewNotes" required defaultValue={candidate?.interviewNotes} />
      </label>
      <label className="grid gap-1 text-sm">Headline<input className="input" name="headline" defaultValue={candidate?.headline} /></label>
      <label className="grid gap-1 text-sm">Summary<textarea className="area" name="summary" defaultValue={candidate?.summary} /></label>
      <label className="grid gap-1 text-sm">Background<textarea className="area" name="background" defaultValue={candidate?.background} /></label>
      <label className="grid gap-1 text-sm">Experience<textarea className="area" name="experience" defaultValue={candidate?.experience} /></label>
      <label className="grid gap-1 text-sm">Personality<textarea className="area" name="personality" defaultValue={candidate?.personality} /></label>
      <label className="grid gap-1 text-sm">Looking for<textarea className="area" name="lookingFor" defaultValue={candidate?.lookingFor} /></label>
      <label className="grid gap-1 text-sm">
        Intro video (optional mp4, webm, or QuickTime)
        <input className="text-sm" name="introVideo" type="file" accept="video/mp4,video/webm,video/quicktime" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isSample" defaultChecked={candidate?.isSample ?? false} />
        Mark as a fictional sample
      </label>
      {candidate ? <p className="text-sm text-ink/60">Public name seed: {candidate.pseudonym}. Country label: {countryLabel(candidate.country)}.</p> : null}
      <div className="flex flex-wrap gap-2">
        <button className="h-10 rounded-full bg-ink px-4 text-sm font-semibold text-paper" name="intent" value="save" type="submit">Save</button>
        <button className="h-10 rounded-full bg-white px-4 text-sm font-semibold ring-1 ring-ink/15" name="intent" value="generate" type="submit">Generate profile</button>
        <button className="h-10 rounded-full bg-dandelion px-4 text-sm font-semibold" name="intent" value="publish" type="submit">Publish</button>
        {candidate?.isPublished ? (
          <button className="h-10 rounded-full px-4 text-sm ring-1 ring-ink/15" name="intent" value="unpublish" type="submit">Unpublish</button>
        ) : null}
      </div>
    </form>
  );
}
