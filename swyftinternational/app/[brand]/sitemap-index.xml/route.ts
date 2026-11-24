import { getBrandConfig } from "@/lib/brands";

export const dynamic = "force-static";

export async function GET(_request: Request, context: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await context.params;
  const brand = getBrandConfig(id);
  if (!brand) return new Response("Not found.", { status: 404 });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://${brand.domain}/sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
