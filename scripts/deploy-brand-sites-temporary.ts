import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { brandIds } from "../swyftinternational/lib/brands";

const repoRoot = process.cwd();
const outputRoot = path.join(repoRoot, "brand-sites", "dist");
const tmpRoot = path.join(repoRoot, ".tmp", "brand-workers");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeFile(file: string, body: string) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, body, "utf8");
}

function deployOne(brand: string, cwd: string) {
  const result = spawnSync(
    "npx",
    ["wrangler", "deploy", "--temporary", "--config", "wrangler.jsonc"],
    {
      cwd,
      encoding: "utf8",
    },
  );
  const combined = `${result.stdout}\n${result.stderr}`;
  if (result.status !== 0) {
    throw new Error(`Temporary deploy failed for ${brand}\n${combined}`);
  }
  const match = combined.match(/https:\/\/[a-z0-9.-]+\.workers\.dev/gi);
  if (!match || !match.length) {
    throw new Error(`Could not find workers.dev URL in deploy output for ${brand}\n${combined}`);
  }
  return match[match.length - 1];
}

async function run() {
  const urls: Record<string, string> = {};
  await fs.rm(tmpRoot, { recursive: true, force: true });
  await ensureDir(tmpRoot);

  for (const brand of brandIds) {
    const siteDir = path.join(outputRoot, brand);
    const workerDir = path.join(tmpRoot, brand);
    await ensureDir(workerDir);
    await writeFile(
      path.join(workerDir, "worker.mjs"),
      `export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };`,
    );
    await writeFile(
      path.join(workerDir, "wrangler.jsonc"),
      JSON.stringify(
        {
          name: `${brand}-site`,
          main: "worker.mjs",
          compatibility_date: "2026-11-26",
          workers_dev: true,
          assets: {
            directory: siteDir,
            binding: "ASSETS",
            html_handling: "auto-trailing-slash",
            not_found_handling: "404-page",
            run_worker_first: true,
          },
        },
        null,
        2,
      ),
    );
    urls[brand] = deployOne(brand, workerDir);
  }

  const reportPath = path.join(outputRoot, "temporary-urls.json");
  await writeFile(reportPath, `${JSON.stringify(urls, null, 2)}\n`);
  console.log(`Temporary deploy URLs:\n${JSON.stringify(urls, null, 2)}`);
  console.log(`Saved ${reportPath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
