import fs from "node:fs"
import path from "node:path"
import { absoluteLiveUrl, livePages } from "../lib/live-pages"
import { PRIVATE_PREFIXES } from "../lib/private-paths"
import { blogMeta } from "../content/blog"
import { lastModified, publishedPosts } from "../lib/blog"

const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://d2djob.com").replace(/\/$/, "")
const out = path.resolve("out")
const pages = livePages()
const newest = pages.map((page) => page.lastmod).sort().at(-1) || "2026-11-14"

const urls = pages
  .map(
    (page) =>
      `<url><loc>${absoluteLiveUrl(site, page)}</loc><lastmod>${page.lastmod}</lastmod></url>`,
  )
  .join("")

fs.writeFileSync(
  path.join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`,
)

fs.writeFileSync(
  path.join(out, "sitemap-index.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${site}/sitemap.xml</loc><lastmod>${newest}</lastmod></sitemap></sitemapindex>\n`,
)

const agents = [
  "*",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended",
  "Googlebot",
  "FacebookBot",
  "Meta-ExternalAgent",
  "PerplexityBot",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
]

const robots = [
  ...agents.map((agent) => `User-Agent: ${agent}\nAllow: /\n${PRIVATE_PREFIXES.map((path) => `Disallow: ${path}`).join("\n")}`),
  "",
  `Sitemap: ${site}/sitemap-index.xml`,
  `Sitemap: ${site}/sitemap.xml`,
  `Host: ${site}`,
  "",
].join("\n")

fs.writeFileSync(path.join(out, "robots.txt"), robots)

const counts = pages.reduce<Record<string, number>>((acc, page) => {
  acc[page.group] = (acc[page.group] || 0) + 1
  return acc
}, {})
console.log(JSON.stringify({ urls: pages.length, newest, counts }, null, 2))

function xml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

const posts = publishedPosts()
const rssItems = posts
  .map((post) => {
    const link = `${site}/blog/${post.slug}/`
    const pubDate = new Date(`${post.date}T12:00:00Z`).toUTCString()
    return `<item><title>${xml(post.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${pubDate}</pubDate><description>${xml(post.excerpt ?? post.description)}</description></item>`
  })
  .join("")
const rssBuilt = posts.length ? new Date(`${lastModified(posts[0])}T12:00:00Z`).toUTCString() : new Date(`${newest}T12:00:00Z`).toUTCString()
fs.mkdirSync(path.join(out, "blog"), { recursive: true })
fs.writeFileSync(
  path.join(out, "blog", "rss.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(blogMeta.h1)} | D2D Job</title><link>${site}/blog/</link><description>${xml(blogMeta.description)}</description><language>en-us</language><lastBuildDate>${rssBuilt}</lastBuildDate><atom:link href="${site}/blog/rss.xml" rel="self" type="application/rss+xml"/>${rssItems}</channel></rss>\n`,
)
console.log(JSON.stringify({ rssItems: posts.length }))
