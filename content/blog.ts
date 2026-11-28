import type { Faq } from "@/lib/seo"

/**
 * Blog posts live in this file as plain objects (same pattern as pillar.ts and industry-pages.ts).
 * See BLOG.md for the fields and the publish checklist.
 */
export type BlogSection = { heading: string; paragraphs: string[] }

export type BlogPost = {
  slug: string
  /** H1 and schema headline. The rendered <title> adds " · D2D Job", keep it under 60 characters in total. */
  title: string
  /** Meta description, 70 to 154 characters. Also used as the excerpt unless `excerpt` is set. */
  description: string
  excerpt?: string
  /** Target keyword, for the keyword log only. Not rendered. */
  keyword: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  updated?: string
  /** Defaults to the D2D Job organization. Set a person's name only when that person wrote it. */
  author?: string
  /** Short answer block shown first, plain fact sentences only. */
  answer: string
  sections: BlogSection[]
  faqs?: Faq[]
  /** Existing site paths that this post supports, with the anchor text to use. */
  relatedPages: { href: string; label: string }[]
  /** Hidden from the index, sitemap, RSS and the production build. */
  draft?: boolean
  /** Renders <meta name="robots" content="noindex,nofollow"> and stays out of the index, sitemap and RSS. */
  noindex?: boolean
}

export const blogMeta = {
  title: "D2D Sales Job Guides and Hiring Notes",
  description:
    "Guides for door to door sales reps and the owners who hire them: how the work runs, how it pays, and how to pick a trade.",
  path: "/blog",
  h1: "Door to Door Sales Job Guides",
  intro:
    "Plain guides for reps who knock doors and owners who hire them. Each post links to the industry and city pages it supports.",
}

/** Published posts. Newest first is handled by lib/blog.ts. */
export const blogPosts: BlogPost[] = []

/**
 * Static export needs at least one /blog/[slug] page to build. While there are no published posts,
 * this placeholder is the only page generated. It is noindex, and it is never listed, in the
 * sitemap, or in the RSS feed. It stops being generated as soon as one real post is published.
 */
export const placeholderPost: BlogPost = {
  slug: "sample-draft-post",
  title: "Sample draft post",
  description: "Placeholder page so the blog template builds before the first post is approved. It is not published.",
  keyword: "placeholder",
  date: "2026-11-28",
  answer: "This is a placeholder page for the blog template. It makes no claims and is not part of the public site.",
  sections: [
    {
      heading: "Placeholder",
      paragraphs: ["This page exists only so the blog template builds. The first approved post replaces it."],
    },
  ],
  relatedPages: [
    { href: "/door-to-door-sales", label: "door to door sales jobs" },
    { href: "/jobs", label: "door to door sales jobs board" },
  ],
  draft: true,
  noindex: true,
}
