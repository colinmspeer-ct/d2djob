import { getSession } from "@/lib/auth";
import { trainingLibrary } from "@/lib/library";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new Response("Login required.", { status: 401, headers: { "X-Robots-Tag": "noindex" } });
  const file = await trainingLibrary().readAsset((await context.params).id);
  if (!file?.bytes || !file.asset.mime) return new Response("Not found.", { status: 404 });
  return new Response(Buffer.from(file.bytes), {
    headers: {
      "Content-Type": file.asset.mime,
      "Content-Disposition": `inline; filename="${file.asset.filename ?? "file"}"`,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  });
}
