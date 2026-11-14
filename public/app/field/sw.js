/* D2D Field service worker. Caches only this app and the Next.js files it needs. */
const CACHE = "d2d-field-v1"

self.addEventListener("install", (event) => {
  event.waitUntil(
    precacheShell()
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith("d2d-field-") && key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const request = event.request
  if (request.method !== "GET") return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  const path = url.pathname
  const appNavigation = request.mode === "navigate" && (path === "/app/field" || path.startsWith("/app/field/"))
  const appAsset = path.startsWith("/app/field/") || path.startsWith("/_next/")
  if (!appNavigation && !appAsset) return

  event.respondWith(appNavigation ? networkFirst(request) : cacheFirst(request))
})

self.addEventListener("message", (event) => {
  const urls = event.data && event.data.type === "cache-urls" ? event.data.urls : null
  if (!Array.isArray(urls)) return
  event.waitUntil(cacheUrls(urls))
})

async function precacheShell() {
  const cache = await caches.open(CACHE)
  const response = await fetch(new Request("/app/field/", { cache: "reload" }))
  if (!response.ok) throw new Error("field shell unavailable")
  const html = await response.clone().text()
  await cache.put("/app/field/", response)
  await cache.put(
    "/app/field/index.html",
    new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } }),
  )
  const base = new URL("/app/field/", self.location.origin)
  await cacheUrls([...extractAssetUrls(html, base), ...shellUrls()])
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const fresh = await fetch(request)
    if (fresh.ok) {
      await cache.put("/app/field/", fresh.clone())
      await cache.put(request, fresh.clone())
    }
    return fresh
  } catch {
    return (await cache.match(request)) || (await cache.match("/app/field/")) || (await cache.match("/app/field/index.html")) || Response.error()
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const fresh = await fetch(request)
  if (fresh.ok) await cache.put(request, fresh.clone())
  return fresh
}

async function cacheUrls(urls) {
  const cache = await caches.open(CACHE)
  await Promise.all(
    urls.map(async (href) => {
      try {
        const url = new URL(href, self.location.origin)
        if (url.origin !== self.location.origin) return
        if (!url.pathname.startsWith("/_next/") && !url.pathname.startsWith("/app/field")) return
        if (await cache.match(url.href)) return
        const response = await fetch(url.href)
        if (response.ok) await cache.put(url.href, response)
      } catch {
        /* A missing asset should not block the rest of the cache. */
      }
    }),
  )
}

function extractAssetUrls(html, base) {
  const found = new Set()
  const pattern = /(?:src|href)=["']([^"']+)["']/g
  for (const match of html.matchAll(pattern)) {
    const raw = match[1]
    if (!raw || raw.startsWith("data:") || raw.startsWith("mailto:") || raw.startsWith("#")) continue
    const absolute = new URL(raw, base)
    if (absolute.origin !== base.origin) continue
    if (absolute.pathname.startsWith("/_next/") || absolute.pathname.startsWith("/app/field/")) found.add(absolute.href)
  }
  return [...found]
}

function shellUrls() {
  return [
    "/app/field/manifest.webmanifest",
    "/app/field/icon-192.png",
    "/app/field/icon-512.png",
    "/app/field/icon-maskable-512.png",
    "/app/field/apple-touch-icon.png",
  ]
}
