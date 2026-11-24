import Link from "next/link";
import { connection } from "next/server";
import { countryLabel } from "@/lib/format";
import { listCandidates } from "@/lib/queries";

export default async function CandidatesPage() {
  await connection();
  const rows = listCandidates();
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl">Candidates</h1>
        <Link href="/admin/candidates/new" className="rounded-full bg-dandelion px-4 py-2 text-sm font-semibold">Add candidate</Link>
      </div>
      <ul className="grid gap-2">
        {rows.map((row) => (
          <li key={row.id}>
            <Link href={`/admin/candidates/${row.id}`} className="block rounded-2xl bg-foam px-4 py-3 ring-1 ring-ink/10">
              <span className="font-medium">{row.realName}</span>
              <span className="text-sm text-ink/60"> · {row.roleTitle} · {countryLabel(row.country)} · {row.isPublished ? "Published" : "Draft"}{row.isSample ? " · Sample" : ""}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
