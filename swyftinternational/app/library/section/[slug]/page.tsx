import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth";
import { trainingLibrary } from "@/lib/library";

export const metadata = { robots: { index: false, follow: false } };

export default async function LibrarySectionPage(props: { params: Promise<{ slug: string }> }) {
  await connection();
  if (!(await getSession())) redirect("/library/login");
  const section = await trainingLibrary().getSectionBySlug((await props.params).slug);
  if (!section) notFound();
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/library" className="text-sm text-glacier">All sections</Link>
      <h1 className="mt-3 text-5xl">{section.title}</h1>
      <p className="mt-3 text-sm leading-6 text-ink/70">{section.description}</p>
      <ul className="mt-8 grid gap-4">
        {section.assets.map((asset) => (
          <li key={asset.id} className="rounded-[1.4rem] bg-foam p-5 ring-1 ring-ink/10">
            <p className="text-xs font-semibold tracking-[0.14em] text-ink/50 uppercase">{asset.kind}</p>
            <h2 className="text-2xl">{asset.title}</h2>
            {asset.description ? <p className="mt-2 text-sm leading-6">{asset.description}</p> : null}
            {asset.kind === "link" && asset.externalUrl ? (
              <a className="mt-3 inline-flex text-sm font-semibold text-glacier" href={asset.externalUrl}>Open link</a>
            ) : null}
            {asset.kind === "video" && asset.storageKey ? (
              <video className="mt-3 w-full rounded-xl" controls src={`/media/training/${asset.id}`} />
            ) : null}
            {asset.storageKey && asset.kind !== "video" ? (
              <a className="mt-3 inline-flex rounded-full bg-dandelion px-4 py-2 text-sm font-semibold" href={`/media/training/${asset.id}`}>
                Open {asset.filename}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
