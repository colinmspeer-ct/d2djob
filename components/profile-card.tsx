import Link from "next/link"
import { placeLabel } from "@/data/locations"
import type { PublicCandidate } from "@/lib/queries"
import { labelFor, SCHEDULES, WORK_STYLES } from "@/lib/labels"
import { Avatar } from "@/components/avatar"

export function candidateTags(candidate: PublicCandidate) {
  const tags = [candidate.industries.map((industry) => industry.name).join(" · "), placeLabel(candidate)]
  if (candidate.schedule) tags.push(labelFor(SCHEDULES, candidate.schedule))
  if (candidate.workStyle) tags.push(labelFor(WORK_STYLES, candidate.workStyle))
  tags.push(candidate.willingToTravel ? "Will travel" : "Stays local")
  if (candidate.yearsExperience != null) tags.push(`${candidate.yearsExperience} yrs`)
  return tags.filter(Boolean)
}

export function ProfileCard({ candidate }: { candidate: PublicCandidate }) {
  const tags = [
    ...candidate.industries.map((industry) => industry.name),
    candidate.schedule ? labelFor(SCHEDULES, candidate.schedule) : "",
    candidate.workStyle ? labelFor(WORK_STYLES, candidate.workStyle) : "",
    candidate.willingToTravel ? "Will travel" : "Stays local",
  ].filter(Boolean)

  return (
    <Link
      href={`/candidates/${candidate.slug}`}
      className="desk-card flex h-full flex-col rounded-3xl bg-card p-5 ring-1 ring-foreground/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={candidate.pseudonym} photo={candidate.photo} />
          <div>
            <p className="font-heading text-2xl leading-none">{candidate.pseudonym}</p>
            <p className="mt-1 text-sm text-muted-foreground">{placeLabel(candidate)}</p>
          </div>
        </div>
        {candidate.isSample ? (
          <span className="rounded-full bg-[#f3e4c4] px-2 py-1 text-[0.68rem] font-medium tracking-wide text-[#6a4b12] uppercase">
            Sample
          </span>
        ) : null}
      </div>
      <h2 className="mt-4 text-xl leading-snug">{candidate.headline}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{candidate.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
            {tag}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm font-medium text-clay">Open profile</p>
    </Link>
  )
}
