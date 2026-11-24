import { createMeeting } from "@/lib/actions/desk";
import type { Candidate } from "@/lib/types";

export function MeetingForm({
  candidates,
  shortlistId,
  back,
  sent,
}: {
  candidates: Candidate[];
  shortlistId?: string;
  back: string;
  sent?: boolean;
}) {
  if (candidates.length === 0) return null;
  return (
    <form action={createMeeting} className="grid gap-4 rounded-[1.6rem] bg-foam p-5 ring-1 ring-ink/10">
      <div>
        <h2 className="text-2xl">Request a meeting</h2>
        <p className="mt-1 text-sm text-ink/70">We send this to the desk. The candidate’s phone and email stay off this page.</p>
      </div>
      {sent ? <p className="rounded-xl bg-[#e7f6ee] px-3 py-2 text-sm">Request received. The desk will follow up.</p> : null}
      <input type="hidden" name="back" value={back} />
      {shortlistId ? <input type="hidden" name="shortlistId" value={shortlistId} /> : null}
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="grid gap-1 text-sm">
        Candidate
        <select name="candidateId" className="input" defaultValue={candidates[0]?.id}>
          {candidates.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.realName} · {candidate.roleTitle}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">Name<input className="input" name="name" required /></label>
        <label className="grid gap-1 text-sm">Company<input className="input" name="company" required /></label>
        <label className="grid gap-1 text-sm">Email<input className="input" name="email" type="email" required /></label>
        <label className="grid gap-1 text-sm">Phone<input className="input" name="phone" required /></label>
      </div>
      <label className="grid gap-1 text-sm">
        Note
        <textarea className="area" name="message" required placeholder="What the meeting is for." />
      </label>
      <label className="grid gap-1 text-sm">
        Times that work
        <input className="input" name="preferredTimes" />
      </label>
      <button className="h-11 w-fit rounded-full bg-dandelion px-5 text-sm font-semibold" type="submit">
        Send the request
      </button>
    </form>
  );
}
