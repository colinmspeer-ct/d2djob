import fs from "node:fs/promises";
import path from "node:path";
import { brandConfigs, brandIds } from "../swyftinternational/lib/brands";

const root = path.resolve(process.cwd(), "brand-sites", "dist");

async function exists(file: string) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function read(file: string) {
  return fs.readFile(file, "utf8");
}

async function run() {
  const missing: string[] = [];
  for (const id of brandIds) {
    const brand = brandConfigs[id];
    const base = path.join(root, id);
    const required = [
      "index.html",
      "pricing/index.html",
      "app/index.html",
      "privacy/index.html",
      "terms/index.html",
      "sitemap/index.html",
      "robots.txt",
      "llms.txt",
      "sitemap.xml",
      "sitemap-index.xml",
      "CNAME",
    ];
    for (const rel of required) {
      const file = path.join(base, rel);
      if (!(await exists(file))) missing.push(file);
    }
    const cname = await read(path.join(base, "CNAME"));
    if (cname.trim() !== brand.domain) throw new Error(`${id}: CNAME expected ${brand.domain}, got ${cname.trim()}`);
    const home = await read(path.join(base, "index.html"));
    if (!home.includes(`https://${brand.domain}/`)) throw new Error(`${id}: canonical domain missing from home page`);
    const robots = await read(path.join(base, "robots.txt"));
    if (!robots.includes("User-agent: GPTBot") || !robots.includes("User-agent: ClaudeBot")) {
      throw new Error(`${id}: AI crawler directives missing from robots.txt`);
    }
  }

  if (missing.length) {
    throw new Error(`Missing generated files:\n${missing.join("\n")}`);
  }
  console.log("Brand static outputs look complete.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
