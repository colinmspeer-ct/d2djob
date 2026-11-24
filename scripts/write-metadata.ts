import fs from "node:fs"
import path from "node:path"
import { absoluteLiveUrl, livePages } from "../lib/live-pages"
import { PRIVATE_PREFIXES } from "../lib/private-paths"

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
