import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { absoluteLiveUrl, liveGroupLabel, livePages } from "../lib/live-pages"

const out = path.resolve("out")
const site = "https://d2djob.com"
const pages = livePages()
const expected = pages.map((page) => absoluteLiveUrl(site, page)).sort()

const sitemap = fs.readFileSync(path.join(out, "sitemap.xml"), "utf8")
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
assert.deepEqual(listed.slice().sort(), expected)
assert.equal(sitemap.match(/<lastmod>/g)?.length, pages.length)
for (const page of pages) {
  assert.match(sitemap, new RegExp(`<loc>${absoluteLiveUrl(site, page).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc><lastmod>${page.lastmod}</lastmod>`))
}

const held = [
  "moorestown-nj",
  "marlton-nj",
  "deptford-nj",
  "egg-harbor-township-nj",
  "vineland-nj",
  "bensalem-pa",
  "newtown-pa",
  "langhorne-pa",
  "norristown-pa",
  "lansdale-pa",
  "conshohocken-pa",
  "media-pa",
  "wayne-pa",
  "springfield-pa",
  "upper-darby-pa",
  "exton-pa",
  "downingtown-pa",
  "kennett-square-pa",
]
for (const slug of held) assert.equal(sitemap.includes(slug), false, slug)
assert.equal(sitemap.includes("/pest-control-sales-jobs/raleigh-nc"), false)
assert.equal(sitemap.includes("/fiber-sales-jobs/lancaster-pa"), false)

const index = fs.readFileSync(path.join(out, "sitemap-index.xml"), "utf8")
assert.match(index, /<sitemapindex /)
assert.match(index, /<loc>https:\/\/d2djob\.com\/sitemap\.xml<\/loc>/)
assert.match(index, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/)
assert.equal(index.includes("moorestown"), false)

function walk(dir: string, files: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else files.push(full)
  }
  return files
}

const htmlFiles = walk(out).filter((file) => file.endsWith(".html") && !file.endsWith(`${path.sep}404.html`))
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8")
  assert.equal(/TODO|\[COLIN/i.test(html), false, file)
  assert.match(html, /href="[^"]*sitemap\/?"/, file)
}

function fileFor(url: string) {
  const pathname = new URL(url).pathname
  if (pathname === "/") return path.join(out, "index.html")
  return path.join(out, pathname.replace(/^\//, ""), "index.html")
}

for (const url of expected) {
  assert.equal(fs.existsSync(fileFor(url)), true, url)
}

const htmlSitemap = fs.readFileSync(path.join(out, "sitemap", "index.html"), "utf8")
assert.match(htmlSitemap, /<h1[^>]*>Sitemap<\/h1>/)
for (const label of ["Pillar", "Employers", "Industries", "City pages"]) {
  assert.match(htmlSitemap, new RegExp(`<h2[^>]*>${label}`))
}
for (const page of pages) {
  assert.ok(htmlSitemap.includes(page.title), page.title)
}

const robots = fs.readFileSync(path.join(out, "robots.txt"), "utf8")
for (const agent of ["GPTBot", "ClaudeBot", "FacebookBot", "Meta-ExternalAgent", "Google-Extended"]) {
  assert.match(robots, new RegExp(`User-Agent: ${agent}\\s+Allow: /`))
}
assert.equal(/Disallow:\s*\/\s*$/m.test(robots), false)
for (const path of ["/admin", "/training", "/library"]) {
  assert.match(robots, new RegExp(`Disallow: ${path}`))
}
assert.match(robots, /Sitemap: https:\/\/d2djob\.com\/sitemap-index\.xml/)
assert.match(robots, /Sitemap: https:\/\/d2djob\.com\/sitemap\.xml/)
assert.equal(fs.readFileSync(path.join(out, "CNAME"), "utf8").trim(), "d2djob.com")

const rss = fs.readFileSync(path.join(out, "blog", "rss.xml"), "utf8")
assert.match(rss, /<rss version="2\.0"/)
assert.match(rss, /<\/channel><\/rss>\s*$/)
assert.equal(rss.includes("sample-draft-post"), false)
assert.equal(sitemap.includes("sample-draft-post"), false)
assert.ok(sitemap.includes("https://d2djob.com/blog/"))
const blogIndex = fs.readFileSync(path.join(out, "blog", "index.html"), "utf8")
assert.equal((blogIndex.match(/<h1[ >]/g) ?? []).length, 1)
assert.match(blogIndex, /rel="canonical"/)
assert.match(blogIndex, /rss\+xml/)
for (const block of blogIndex.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(block[1])

const counts = pages.reduce<Record<string, number>>((acc, page) => {
  acc[liveGroupLabel[page.group]] = (acc[liveGroupLabel[page.group]] || 0) + 1
  return acc
}, {})
console.log(JSON.stringify({ urls: pages.length, html: htmlFiles.length, counts }, null, 2))
