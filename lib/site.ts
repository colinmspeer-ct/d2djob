export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:43123"
  return raw.replace(/\/$/, "")
}

export const siteName = "D2D Job"
