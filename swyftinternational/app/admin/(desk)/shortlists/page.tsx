import Link from "next/link";
import { connection } from "next/server";
import { listShortlists } from "@/lib/queries";

export default async function ShortlistsPage() {
  await connection();
  const rows = listShortlists();
  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <h1 className="text-4xl">Shortlists</h1>
        <Link href="/admin/shortlists/new" className="rounded-full bg-dandelion px-4 py-2 text-sm font-semibold">New shortlist</Link>
      </div>
      <ul className="grid gap-2">
        {rows.map((row) => (
          <li key={row.id}>
            <Link href={`/admin/shortlists/${row.id}`} className="block rounded-2xl bg-foam px-4 py-3 ring-1 ring-ink/10">
              {row.title} <span className="text-sm text-ink/60">· {row.preparedFor} · {row.isPublished ? "Published" : "Draft"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
