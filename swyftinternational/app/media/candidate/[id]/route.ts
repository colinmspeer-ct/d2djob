import { objects } from "@/lib/media";
import { getCandidate } from "@/lib/queries";

function mimeFromKey(key: string) {
  if (key.endsWith(".webm")) return "video/webm";
  if (key.endsWith(".mov")) return "video/quicktime";
  return "video/mp4";
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const candidate = getCandidate((await context.params).id);
  if (!candidate?.isPublished || !candidate.introVideoKey) return new Response("Not found.", { status: 404 });
  const bytes = await objects().get(candidate.introVideoKey);
  if (!bytes) return new Response("Not found.", { status: 404 });
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": mimeFromKey(candidate.introVideoKey),
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  });
}
