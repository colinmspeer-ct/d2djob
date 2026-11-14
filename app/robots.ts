import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const crawlers = [
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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: crawlers.map((userAgent) => ({
      userAgent,
      allow: "/",
    })),
    sitemap: [`${siteUrl()}/sitemap-index.xml`, `${siteUrl()}/sitemap.xml`],
    host: siteUrl(),
  };
}
