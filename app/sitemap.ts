import type { MetadataRoute } from "next";
import { absoluteLiveUrl, livePages } from "@/lib/live-pages";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return livePages().map((page) => ({
    url: absoluteLiveUrl(siteUrl(), page),
    lastModified: page.lastmod,
  }));
}
