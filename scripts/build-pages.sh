#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

restore_admin() {
  if [[ -d /tmp/d2d-admin-hold && ! -d app/admin ]]; then
    mv /tmp/d2d-admin-hold app/admin
  fi
}
trap restore_admin EXIT

if [[ -d app/admin ]]; then
  rm -rf /tmp/d2d-admin-hold
  mv app/admin /tmp/d2d-admin-hold
fi

hold_route() {
  local file="$1"
  if [[ -f "$file" ]]; then
    mkdir -p /tmp/d2d-route-hold
    mv "$file" "/tmp/d2d-route-hold/$(basename "$file")"
  fi
}
restore_routes() {
  if [[ -d /tmp/d2d-route-hold ]]; then
    mv /tmp/d2d-route-hold/* app/ 2>/dev/null || true
    rmdir /tmp/d2d-route-hold 2>/dev/null || true
  fi
}
trap 'restore_admin; restore_routes' EXIT
hold_route app/robots.ts
hold_route app/sitemap.ts
hold_route app/opengraph-image.tsx

restore_sources() {
  if [[ -d /tmp/d2d-src-hold ]]; then
    cp -a /tmp/d2d-src-hold/. .
    rm -rf /tmp/d2d-src-hold
  fi
}
strip_export_blockers() {
  python3 - <<'PY'
from pathlib import Path
root = Path(".")
backup = Path("/tmp/d2d-src-hold")
targets = list(Path("app").rglob("*.tsx")) + list(Path("lib").rglob("*.ts"))
for path in targets:
    text = path.read_text()
    original = text
    if 'export const instant = false;' in text:
        text = text.replace("export const instant = false;\n", "")
    if path.as_posix() == "lib/queries.ts":
        text = text.replace('import { cacheLife, cacheTag } from "next/cache"\n', "")
        kept = []
        for line in text.splitlines(True):
            stripped = line.strip()
            if stripped in {'"use cache"', "'use cache'"}:
                continue
            if stripped.startswith("cacheTag(") or stripped.startswith("cacheLife("):
                continue
            kept.append(line)
        text = "".join(kept)
    if text != original:
        dest = backup / path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(original)
        path.write_text(text)
print("stripped export blockers")
PY
}
trap 'restore_sources; restore_admin; restore_routes' EXIT
strip_export_blockers

export STATIC_EXPORT=1
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://d2djob.com}"
export DATABASE_URL="${DATABASE_URL:-file:./dev.db}"

npx next build
npx tsx scripts/write-metadata.ts
node scripts/prepare-pages.mjs
npx tsx scripts/check-pages.ts
