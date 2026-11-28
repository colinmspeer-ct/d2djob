# D2D Job blog

Draft/preview work from Nov 28, 2026. Nothing here is live until the branch is merged to `main`.

## Where things live
- Posts: `content/blog.ts` (`blogPosts` array, plain objects, newest first is automatic).
- Index: `app/blog/page.tsx` at `/blog/`. Post template: `app/blog/[slug]/page.tsx` at `/blog/<slug>/`.
- Helpers and schema: `lib/blog.ts` (Article + BreadcrumbList on posts, Blog + BreadcrumbList on the index).
- Sitemap: posts are added through `lib/live-pages.ts` (group "Blog"), so `sitemap.xml`, the HTML sitemap and `scripts/check-pages.ts` all pick them up.
- RSS: `scripts/write-metadata.ts` writes `out/blog/rss.xml` during `npm run build:pages`.
- Footer: "Blog" link in `components/page-shell.tsx`.

## Add a post
Add an object to `blogPosts` with: `slug`, `title`, `description` (70-154 chars), `keyword`, `date`, `answer`, `sections`, `relatedPages` (existing site paths, keyword anchors) and optional `excerpt`, `updated`, `author`, `faqs`, `draft`, `noindex`.
- `draft: true` or `noindex: true` keeps a post out of the index, sitemap and RSS and the build. Remove the flag to publish.
- Title plus " · D2D Job" must be under 60 characters; the build throws otherwise.
- Every post links to at least one industry, guide, jobs or employers page. No invented stats, pay numbers, quotes or reviews.

## Placeholder
`placeholderPost` (`/blog/sample-draft-post/`, noindex) exists only so the static export builds while there are zero published posts. It disappears from the build when the first real post is added.

## Check
`npm test` then `npm run build:pages` (build + metadata + `scripts/check-pages.ts`).
