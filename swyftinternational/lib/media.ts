import "server-only";
import { nodeFileStorage } from "@/modules/training-library/node-file-storage";
import { safeFilename } from "@/modules/training-library";
import { mediaPath } from "./paths";

const VIDEO = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export function objects() {
  return nodeFileStorage(mediaPath());
}

export async function storeIntroVideo(candidateId: string, file: File) {
  if (file.size === 0) return { ok: true as const, empty: true as const };
  if (file.size > 32 * 1024 * 1024) return { ok: false as const, error: "Intro videos in this preview are limited to 32 MB." };
  if (!VIDEO.has(file.type)) return { ok: false as const, error: "Use an mp4, webm, or QuickTime video." };
  const filename = safeFilename(file.name || "intro.mp4");
  const key = `swyftinternational/candidates/${candidateId}/${filename}`;
  await objects().put(key, new Uint8Array(await file.arrayBuffer()), file.type);
  return { ok: true as const, empty: false as const, key };
}
