import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { articleJsonLd, buildablePosts, findPost, lastModified } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd, faqJsonLd, seoMetadata, type Crumb } from "@/lib/seo";

export function generateStaticParams() {
  return buildablePosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = findPost(slug);
  if (!post) return { title: "Blog" };
  const base = seoMetadata(post.title, post.description, `/blog/${post.slug}`);
  return {
    ...base,
    alternates: { ...base.alternates, types: { "application/rss+xml": "/blog/rss.xml" } },
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: lastModified(post),
    },
    robots: post.noindex || post.draft ? { index: false, follow: false } : undefined,
  };
}

export const instant = false;

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = findPost(slug);
  if (!post) notFound();
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];
  return (
    <PageShell>
      <article className="mx-auto grid max-w-3xl gap-8 px-4 py-10">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <JsonLd data={articleJsonLd(post)} />
        {post.faqs && post.faqs.length > 0 ? <JsonLd data={faqJsonLd(post.faqs)} /> : null}
        <Breadcrumbs items={crumbs} />
        <header className="grid gap-4">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">{post.title}</h1>
          <p className="text-sm text-muted-foreground">
            By {post.author ?? "D2D Job"} · Published <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updated ? (
              <>
                {" "}
                · Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
              </>
            ) : null}
          </p>
          <p className="text-lg leading-relaxed">{post.answer}</p>
        </header>
        {post.sections.map((section) => (
          <section key={section.heading} className="grid gap-3">
            <h2 className="text-2xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        {post.faqs && post.faqs.length > 0 ? <FaqList faqs={post.faqs} /> : null}
        <section className="grid gap-3">
          <h2 className="text-2xl">Related pages</h2>
          <ul className="grid gap-2">
            {post.relatedPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="font-medium text-clay hover:underline">
                  {page.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/blog" className="font-medium text-clay hover:underline">
                All D2D Job guides
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </PageShell>
  );
}
