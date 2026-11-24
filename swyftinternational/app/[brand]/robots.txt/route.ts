import { getBrandConfig } from "@/lib/brands";

export const dynamic = "force-static";

export async function GET(_request: Request, context: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await context.params;
  const brand = getBrandConfig(id);
  if (!brand) return new Response("Not found.", { status: 404 });

  const host = `https://${brand.domain}`;
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /library",
    "Disallow: /training",
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "User-agent: Claude-SearchBot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    `Sitemap: ${host}/sitemap.xml`,
    `Sitemap: ${host}/sitemap-index.xml`,
    `Host: ${host}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
