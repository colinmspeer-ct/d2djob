import { connection } from "next/server";
import { formatUsd } from "@/lib/terms";
import { listSearches } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export default async function SearchesPage() {
  await connection();
  const searches = listSearches();
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">Searches</h1>
      <ul className="grid gap-3">
        {searches.map((search) => (
          <li key={search.id} className="rounded-2xl bg-foam p-4 text-sm ring-1 ring-ink/10">
            <p className="font-medium">{search.company} · {search.roleTitle}</p>
            <p className="text-ink/70">
              {search.contactName} · {search.email} · salary {formatUsd(search.firstYearSalaryCents)} · fee {search.feePercent}% · deposit {formatUsd(search.depositCents)} · {search.guaranteeDays} days · {search.status.replaceAll("_", " ")} · {formatDate(search.createdAt)}
            </p>
            {search.notes ? <p className="mt-2">{search.notes}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
