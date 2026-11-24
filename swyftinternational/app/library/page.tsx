import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { logoutLibrary } from "@/lib/actions/auth";
import { getSession } from "@/lib/auth";
import { trainingLibrary } from "@/lib/library";

export const metadata = { title: "Training library", robots: { index: false, follow: false } };

export default async function LibraryPage() {
  await connection();
  const session = await getSession();
  if (!session) redirect("/library/login");
  const sections = await trainingLibrary().listSections();
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-ink/50 uppercase">Private · noindex</p>
          <h1 className="text-5xl">Training library</h1>
        </div>
        <form action={logoutLibrary}>
          <button className="text-sm text-ink/60" type="submit">Log out</button>
        </form>
      </div>
      <p className="mt-3 text-sm text-ink/70">Signed in as {session.email}. Videos, PDFs, and notes for people already placed, and for the recruiters who place them.</p>
      <ul className="mt-8 grid gap-3">
        {sections.map((section) => (
          <li key={section.id}>
            <Link href={`/library/section/${section.slug}`} className="block rounded-[1.4rem] bg-foam p-5 ring-1 ring-ink/10">
              <h2 className="text-2xl">{section.title}</h2>
              <p className="mt-1 text-sm text-ink/70">{section.description}</p>
              <p className="mt-2 text-xs tracking-wide text-ink/50 uppercase">{section.assetCount} items</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
