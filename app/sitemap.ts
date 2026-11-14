import type { MetadataRoute } from "next";
import { industries } from "@/data/industries";
import { fiberMarkets, locations } from "@/data/locations";
import { listPublicCandidates, listPublicJobs } from "@/lib/queries";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = siteUrl();
  const [candidates, jobs] = await Promise.all([
    listPublicCandidates("", "", false),
    listPublicJobs("", ""),
  ]);

  const staticRoutes = ["", "/jobs", "/employers", "/door-to-door-sales"].map((path) => ({
    url: `${site}${path || "/"}`,
    lastModified: "2026-11-14",
  }));

  const industryRoutes = industries.map((industry) => ({
    url: `${site}/jobs/${industry.slug}`,
    lastModified: "2026-11-14",
  }));

  const geoRoutes = industries.flatMap((industry) => {
    const cities = industry.slug === "fiber" ? fiberMarkets() : locations;
    return cities.map((location) => ({
      url: `${site}/${industry.geoPrefix}/${location.slug}`,
      lastModified: "2026-11-14",
    }));
  });

  return [
    ...staticRoutes,
    ...industryRoutes,
    ...geoRoutes,
    ...candidates.map((candidate) => ({
      url: `${site}/candidates/${candidate.slug}`,
      lastModified: "2026-11-14",
    })),
    ...jobs.map((job) => ({
      url: `${site}/job/${job.slug}`,
      lastModified: job.datePosted,
    })),
  ];
}
