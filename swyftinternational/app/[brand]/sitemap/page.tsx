import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandConfig } from "@/lib/brands";
import { brandSeoPages } from "@/lib/brand-seo";

export const metadata = { title: "Sitemap" };

export default async function BrandSitemapPage(props: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await props.params;
  const brand = getBrandConfig(id);
  if (!brand) notFound();
  const pages = brandSeoPages(brand);
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-5xl">{brand.name} HTML sitemap</h1>
      <p className="mt-4 text-sm leading-7 text-ink/75">This index is linked in the footer and mirrored by an XML sitemap at /{brand.id}/sitemap.xml.</p>
      <ul className="mt-8 grid gap-3">
        {pages.map((page) => (
          <li key={page.path}>
            <Link href={page.path} className="block rounded-xl bg-white px-4 py-3 ring-1 ring-ink/10 hover:ring-glacier/50">
              <span className="font-medium">{page.title}</span>
              <span className="mt-1 block text-xs text-ink/60">{page.path}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
