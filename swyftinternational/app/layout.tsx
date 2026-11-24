import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { siteUrl } from "@/lib/format";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Swyft International", template: "%s · Swyft International" },
  description:
    "Preview of Swyft International, an offshore talent placement desk for Swyft Marketing. Nothing on this site is live.",
  robots: { index: false, follow: false },
  applicationName: "Swyft International",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="min-h-screen antialiased">
        <div className="bg-ink px-4 py-2 text-center text-xs text-paper">
          Preview only. This build is not live, does not change DNS, and will not take a live payment.
        </div>
        {children}
      </body>
    </html>
  );
}
