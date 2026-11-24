import Link from "next/link";
import { countryLabel, formatDate } from "@/lib/format";
import { formatUsd } from "@/lib/terms";
import type { Candidate } from "@/lib/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function Avatar({ name }: { name: string }) {
  const label = initials(name) || "SI";
  const palette = [
    ["#093A3E", "#F5B800"],
    ["#0E5C66", "#F5F2ED"],
    ["#12507A", "#F5B800"],
  ] as const;
  const index = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
  const [ground, mark] = palette[index]!;
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 shrink-0" role="img" aria-label={`Placeholder avatar for ${name}`}>
      <rect width="64" height="64" rx="32" fill={ground} />
      <circle cx="16" cy="18" r="9" fill={mark} opacity="0.45" />
      <circle cx="50" cy="48" r="14" fill={mark} opacity="0.22" />
      <text x="32" y="39" textAnchor="middle" fontSize="18" fontFamily="Space Grotesk, Inter, sans-serif" fill={mark}>
        {label}
      </text>
    </svg>
  );
}

function Play() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

export function CandidateCard({ candidate, href }: { candidate: Candidate; href?: string }) {
  const body = (
    <article className="flex h-full flex-col rounded-[1.6rem] bg-foam p-4 shadow-[0_16px_40px_rgb(9_58_62_/_0.06)] ring-1 ring-ink/10">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#072e32]" aria-label="Intro video placeholder. No recording is attached.">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,#2197FF_0,transparent_46%),radial-gradient(circle_at_80%_85%,#F5B800_0,transparent_42%)] opacity-70" />
        <div className="relative flex h-full flex-col items-center justify-center gap-2 text-paper">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-dandelion text-ink">
            <Play />
          </span>
          <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase">Intro video</span>
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-paper px-2 py-1 text-[0.65rem] font-semibold tracking-wide text-ink uppercase">
          Fictional
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Avatar name={candidate.realName} />
        <div>
          <h3 className="text-xl leading-tight">{candidate.realName}</h3>
          <p className="text-sm text-ink/70">{candidate.roleTitle}</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 text-sm leading-5">
        {candidate.highlights.slice(0, 3).map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#e5f4ec] text-[#1f7a4d]" aria-hidden>
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                <path d="M3 8.2 6.2 11.4 13 4.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <ul className="mt-4 flex flex-wrap gap-2">
        {candidate.skills.map((skill) => (
          <li key={skill} className="rounded-full bg-dandelion px-2.5 py-1 text-xs font-semibold text-ink">
            {skill}
          </li>
        ))}
      </ul>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-ink/10 pt-3 text-sm">
        <div>
          <dt className="text-[0.65rem] tracking-[0.14em] text-ink/50 uppercase">Country</dt>
          <dd className="font-medium">{countryLabel(candidate.country)}</dd>
        </div>
        <div>
          <dt className="text-[0.65rem] tracking-[0.14em] text-ink/50 uppercase">Monthly</dt>
          <dd className="font-medium">{candidate.monthlyPayCents == null ? "TBD" : formatUsd(candidate.monthlyPayCents)}</dd>
        </div>
        <div>
          <dt className="text-[0.65rem] tracking-[0.14em] text-ink/50 uppercase">Start</dt>
          <dd className="font-medium">{formatDate(candidate.startDate)}</dd>
        </div>
      </dl>
    </article>
  );
  if (!href) return body;
  return (
    <Link href={href} className="block h-full rounded-[1.6rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glacier">
      {body}
    </Link>
  );
}
