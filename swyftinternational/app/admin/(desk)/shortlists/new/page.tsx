import { connection } from "next/server";
import { ShortlistForm } from "@/components/shortlist-form";
import { listCandidates, listEmployers } from "@/lib/queries";

export default async function NewShortlistPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">New shortlist</h1>
      <ShortlistForm shortlist={null} candidates={listCandidates()} selected={[]} employers={listEmployers()} flash={await props.searchParams} />
    </div>
  );
}
