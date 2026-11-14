import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { setRequestStatus } from "@/lib/actions/requests";
import { Flash } from "@/components/flash";
import { prisma } from "@/lib/db";

export const instant = false;

export default function RequestsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="text-sm">Loading requests…</p>}>
      <Requests searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Requests({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const query = await searchParams;
  const rows = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { candidate: { select: { id: true, pseudonym: true, realName: true, slug: true, isSample: true } } },
  });

  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">Requests</h1>
      <Flash searchParams={query} />
      {rows.length === 0 ? (
        <p className="rounded-3xl bg-card p-6 text-sm ring-1 ring-foreground/10">
          No invites or meeting requests yet.
        </p>
      ) : (
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    {row.type === "meeting" ? "Meeting" : "Invite"} · {row.status} · email {row.emailStatus}
                  </p>
                  <p className="mt-1 font-heading text-2xl">{row.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {row.name} · {row.email} · {row.phone}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{row.createdAt.toISOString().replace("T", " ").slice(0, 16)} UTC</p>
              </div>
              <p className="mt-3 text-sm">
                For{" "}
                <Link href={`/admin/candidates/${row.candidate.id}`} className="underline-offset-4 hover:underline">
                  {row.candidate.pseudonym}
                </Link>{" "}
                ({row.candidate.realName}
                {row.candidate.isSample ? ", sample" : ""})
              </p>
              {row.preferredTimes ? <p className="mt-2 text-sm">Times: {row.preferredTimes}</p> : null}
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{row.message}</p>
              <form action={setRequestStatus.bind(null, row.id)} className="mt-3 flex flex-wrap gap-2">
                {["new", "reviewed", "closed"].map((status) => (
                  <button
                    key={status}
                    type="submit"
                    name="status"
                    value={status}
                    className="rounded-full bg-secondary px-3 py-1 text-xs capitalize"
                  >
                    Mark {status}
                  </button>
                ))}
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
