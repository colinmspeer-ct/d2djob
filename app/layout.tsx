import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "D2D Job — door-to-door sales reps",
    template: "%s · D2D Job",
  },
  description:
    "D2D Job is the Swyft Marketing desk for door-to-door sales reps. Browse anonymized profiles or open job listings.",
  applicationName: "D2D Job",
  openGraph: {
    type: "website",
    siteName: "D2D Job",
    title: "D2D Job — door-to-door sales reps",
    description: "Approved reps, without the phone number.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
