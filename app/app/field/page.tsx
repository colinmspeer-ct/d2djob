import type { Metadata, Viewport } from "next"
import Link from "next/link"
import { FieldApp } from "@/components/field/field-app"

export const metadata: Metadata = {
  title: "Field",
  description: "Log knocks, leads, and jobs on this phone.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  manifest: "/app/field/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "D2D Field",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/app/field/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/app/field/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/app/field/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#234237",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function FieldPage() {
  return (
    <>
      <FieldApp />
      <noscript>
        <div className="mx-auto max-w-md px-4 py-6">
          <p className="leading-relaxed">
            The field app saves stops on this phone and needs JavaScript for that. Read{" "}
            <Link className="font-medium text-clay hover:underline" href="/app">
              what the field app does
            </Link>{" "}
            or open the{" "}
            <Link className="font-medium text-clay hover:underline" href="/sitemap">
              sitemap
            </Link>
            .
          </p>
        </div>
      </noscript>
    </>
  )
}
