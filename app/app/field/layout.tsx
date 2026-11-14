import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: { absolute: "D2D Field" },
  description: "On-device log for door-to-door knocks, leads, and jobs.",
  robots: { index: false, follow: false },
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

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return children
}
