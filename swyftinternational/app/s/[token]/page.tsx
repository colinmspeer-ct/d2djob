import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CandidateCard } from "@/components/candidate-card";
import { MeetingForm } from "@/components/meeting-form";
import { MarketingShell } from "@/components/site-chrome";
import { one } from "@/lib/format";
import { getShortlistByToken, shortlistMembers } from "@/lib/queries";

export const metadata = { title: "Shortlist", robots: { index: false, follow: false } };

export default async function ShortlistPage(props: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { token } = await props.params;
  const query = await props.searchParams;
  const shortlist = getShortlistByToken(token);
  if (!shortlist || !shortlist.isPublished) notFound();
  const people = shortlistMembers(shortlist.id, true);
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold tracking-[0.14em] text-ink/50 uppercase">Private shortlist</p>
        <h1 className="mt-2 text-5xl">Prepared for {shortlist.preparedFor}</h1>
        <p className="mt-4 max-w-2xl text-ink/75 leading-7">{shortlist.intro}</p>
        {shortlist.isSample ? (
          <p className="mt-4 w-fit rounded-full bg-dandelion px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            Fictional preview. Not real candidates.
          </p>
        ) : null}
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
            <CandidateCard key={person.id} candidate={person} href={`/candidates/${person.slug}`} />
          ))}
        </div>
        <div className="mt-10">
          <MeetingForm candidates={people} shortlistId={shortlist.id} back={`/s/${token}`} sent={one(query.sent) === "1"} />
        </div>
      </section>
    </MarketingShell>
  );
}
