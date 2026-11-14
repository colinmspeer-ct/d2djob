import { readFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const { id } = await context.params;
  if (!/^[a-z0-9]+$/i.test(id)) return new Response("Not found", { status: 404 });

  const candidate = await prisma.candidate.findUnique({
    where: { id },
    select: { photoOriginal: true },
  });
  if (!candidate?.photoOriginal || !/^originals\/[a-z0-9]+\.jpg$/i.test(candidate.photoOriginal)) {
    return new Response("Not found", { status: 404 });
  }

  const root = path.resolve(process.cwd(), "storage");
  const full = path.resolve(root, candidate.photoOriginal);
  if (!full.startsWith(`${root}${path.sep}`)) return new Response("Not found", { status: 404 });

  const bytes = await readFile(full);
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, no-store",
    },
  });
}
