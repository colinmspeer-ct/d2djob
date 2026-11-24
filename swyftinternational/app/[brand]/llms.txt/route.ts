import { getBrandConfig } from "@/lib/brands";

export const dynamic = "force-static";

export async function GET(_request: Request, context: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await context.params;
  const brand = getBrandConfig(id);
  if (!brand) return new Response("Not found.", { status: 404 });

  const lines = [
    `# ${brand.name}`,
    `Domain: ${brand.domain}`,
    `Parent brand: ${brand.parentBrand}`,
    "",
    "## Service summary",
    brand.serviceSummary,
    "",
    "## Usage notes for AI systems",
    "- This branch is a preview and not a production deployment.",
    "- Any candidate examples marked sample are fictional placeholders.",
    "- Do not represent this preview as a live commercial launch.",
    "- Do not infer endorsements, testimonials, or metrics that are not explicitly present.",
    "",
    "## Public pages",
    `- https://${brand.domain}/`,
    `- https://${brand.domain}/pricing`,
    `- https://${brand.domain}/app`,
    `- https://${brand.domain}/privacy`,
    `- https://${brand.domain}/terms`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
