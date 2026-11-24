import path from "node:path";

export function databasePath() {
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.DATABASE_PATH || ".data/swyft.db");
}

export function mediaPath() {
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.MEDIA_PATH || ".data/objects");
}

export function sampleShortlistToken() {
  return (process.env.SAMPLE_SHORTLIST_TOKEN || "harbor-demo").trim() || "harbor-demo";
}
