import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { liveGroupLabel, liveGroups, livePages } from "@/lib/live-pages";
import { seoMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const title = "Sitemap";
const description =
  "Every live D2D Job page, grouped into the sales guide, employers, industries, city pages, jobs, profiles, and the field app.";

export const metadata: Metadata = seoMetadata(title, description, "/sitemap");

export default function HtmlSitemapPage() {
  const pages = livePages();
  const origin = siteUrl();

  return (
    <PageShell>
      <article className="mx-auto grid max-w-3xl gap-8 px-4 py-10">
        <header className="grid gap-3">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">Sitemap</h1>
          <p className="text-lg leading-relaxed">
            {pages.length} live pages. Placeholder city URLs are not listed. The XML index is{" "}
            <a className="font-medium text-clay hover:underline" href="/sitemap-index.xml">
              sitemap-index.xml
            </a>{" "}
            and the URL list is{" "}
            <a className="font-medium text-clay hover:underline" href="/sitemap.xml">
              sitemap.xml
            </a>
            .
          </p>
        </header>
        {liveGroups.map((group) => {
          const items = pages.filter((page) => page.group === group);
          if (items.length === 0) return null;
          return (
            <section key={group} className="grid gap-3">
              <h2 className="text-2xl">
                {liveGroupLabel[group]}{" "}
                <span className="text-base font-normal text-muted-foreground">({items.length})</span>
              </h2>
              <ul className="grid gap-2">
                {items.map((page) => (
                  <li key={page.path}>
                    <a className="font-medium text-clay hover:underline" href={page.path}>
                      {page.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <p className="text-sm text-muted-foreground">Canonical origin {origin}. {pages.length} URLs.</p>
      </article>
    </PageShell>
  );
}
