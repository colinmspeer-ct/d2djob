import { connection } from "next/server";
import { Flash } from "@/components/flash";
import { addLibraryAsset, createLibrarySection, deleteLibraryAsset } from "@/lib/actions/desk";
import { trainingLibrary } from "@/lib/library";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLibraryPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  const sections = await trainingLibrary().listSections();
  const detailed = await Promise.all(sections.map(async (section) => trainingLibrary().getSection(section.id)));
  return (
    <div className="grid gap-6">
      <h1 className="text-4xl">Training library</h1>
      <Flash searchParams={await props.searchParams} />
      <form action={createLibrarySection} className="grid gap-3 rounded-2xl bg-foam p-4 ring-1 ring-ink/10">
        <h2 className="text-xl">New section</h2>
        <input className="input" name="title" placeholder="Section title" required />
        <textarea className="area" name="description" placeholder="Who this is for" />
        <button className="h-10 w-fit rounded-full bg-dandelion px-4 text-sm font-semibold" type="submit">Add section</button>
      </form>
      {detailed.map((section) =>
        section ? (
          <section key={section.id} className="rounded-2xl bg-foam p-4 ring-1 ring-ink/10">
            <h2 className="text-2xl">{section.title}</h2>
            <p className="text-sm text-ink/70">{section.description}</p>
            <ul className="mt-3 grid gap-2 text-sm">
              {section.assets.map((asset) => (
                <li key={asset.id} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
                  <span>{asset.title} · {asset.kind}</span>
                  <form action={deleteLibraryAsset}>
                    <input type="hidden" name="id" value={asset.id} />
                    <button className="text-ink/60" type="submit">Remove</button>
                  </form>
                </li>
              ))}
            </ul>
            <form action={addLibraryAsset} className="mt-4 grid gap-2">
              <input type="hidden" name="sectionId" value={section.id} />
              <input className="input" name="title" placeholder="Item title" required />
              <input className="input" name="description" placeholder="Short description" />
              <select className="input" name="kind" defaultValue="pdf">
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="doc">Document</option>
                <option value="image">Image</option>
                <option value="link">Link</option>
              </select>
              <input className="text-sm" name="file" type="file" />
              <input className="input" name="externalUrl" placeholder="https:// link, only for the link type" />
              <button className="h-10 w-fit rounded-full bg-ink px-4 text-sm text-paper" type="submit">Upload</button>
            </form>
          </section>
        ) : null,
      )}
    </div>
  );
}
