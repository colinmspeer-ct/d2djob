import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { blogMeta } from "@/content/blog";
import { industries } from "@/data/industries";
import { blogIndexJsonLd, postExcerpt, publishedPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd, seoMetadata, type Crumb } from "@/lib/seo";

const base = seoMetadata(blogMeta.title, blogMeta.description, blogMeta.path);
export const metadata = {
  ...base,
  alternates: { ...base.alternates, types: { "application/rss+xml": "/blog/rss.xml" } },
};

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

export default function BlogIndexPage() {
  const posts = publishedPosts();
  return (
    <PageShell>
      <div className="mx-auto grid max-w-3xl gap-8 px-4 py-10">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <JsonLd data={blogIndexJsonLd()} />
        <Breadcrumbs items={crumbs} />
        <header className="grid gap-4">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">{blogMeta.h1}</h1>
          <p className="text-lg leading-relaxed">{blogMeta.intro}</p>
        </header>
        <section className="grid gap-4" aria-label="Posts">
          {posts.length === 0 ? (
            <p className="leading-relaxed">
              No posts yet. The first guides are in review. Until then, the{" "}
              <Link href="/door-to-door-sales" className="font-medium text-clay hover:underline">
                door to door sales jobs guide
              </Link>{" "}
              covers the basics.
            </p>
          ) : (
            <ul className="grid gap-6">
              {posts.map((post) => (
                <li key={post.slug} className="grid gap-1">
                  <h2 className="text-2xl leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </p>
                  <p className="leading-relaxed">{postExcerpt(post)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">Door to door sales jobs by industry</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {industries.map((industry) => (
              <li key={industry.slug}>
                <Link href={`/jobs/${industry.slug}`} className="font-medium text-clay hover:underline">
                  {industry.name} sales jobs
                </Link>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">
            Start with the{" "}
            <Link href="/door-to-door-sales" className="font-medium text-clay hover:underline">
              door to door sales jobs guide
            </Link>
            , browse the{" "}
            <Link href="/jobs" className="font-medium text-clay hover:underline">
              jobs board
            </Link>
            , or read the{" "}
            <Link href="/employers" className="font-medium text-clay hover:underline">
              employers page
            </Link>{" "}
            if you hire.
          </p>
          <p className="text-sm text-muted-foreground">
            <a href="/blog/rss.xml" className="hover:underline">
              RSS feed
            </a>
          </p>
        </section>
      </div>
    </PageShell>
  );
}
