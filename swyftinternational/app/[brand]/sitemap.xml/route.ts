import { getBrandConfig } from "@/lib/brands";
import { absoluteBrandUrl, brandSeoPages } from "@/lib/brand-seo";

export const dynamic = "force-static";

export async function GET(_request: Request, context: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await context.params;
  const brand = getBrandConfig(id);
  if (!brand) return new Response("Not found.", { status: 404 });
  const now = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${brandSeoPages(brand)
  .map(
    (page) =>
      `  <url>\n    <loc>${absoluteBrandUrl(brand, page.path)}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`,
  )
  .join("\n")}
</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
