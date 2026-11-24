import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ShortlistForm } from "@/components/shortlist-form";
import { getShortlist, listCandidates, listEmployers, shortlistMembers } from "@/lib/queries";

export default async function EditShortlistPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const shortlist = getShortlist((await props.params).id);
  if (!shortlist) notFound();
  const selected = shortlistMembers(shortlist.id, false).map((candidate) => candidate.id);
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">{shortlist.title}</h1>
      <ShortlistForm
        shortlist={shortlist}
        candidates={listCandidates()}
        selected={selected}
        employers={listEmployers()}
        flash={await props.searchParams}
      />
    </div>
  );
}
