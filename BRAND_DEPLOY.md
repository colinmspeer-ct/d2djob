# Brand deploy runbook (vaccelerating / outboundrep / inboundrep)

This repository now builds static, domain-root brand sites from the PR #3 brand config (`swyftinternational/lib/brands.ts`).

## Build + check

```bash
npm run build:brands
npm run check:brands
```

Output folders:

- `brand-sites/dist/vaccelerating`
- `brand-sites/dist/outboundrep`
- `brand-sites/dist/inboundrep`

Each output includes:

- `index.html`
- `pricing/index.html`
- `app/index.html`
- `privacy/index.html`
- `terms/index.html`
- `sitemap/index.html` (HTML sitemap)
- `sitemap.xml`
- `sitemap-index.xml`
- `robots.txt` (allows AI search crawlers, blocks `/admin`, `/library`, `/training`)
- `llms.txt`
- `CNAME` (brand domain)

## Temporary live URLs (no account login required)

From this repository:

```bash
npm run build:brands
npm run deploy:brands:temporary
```

That deploys each brand output to a temporary Cloudflare Workers URL and writes:

- `brand-sites/dist/temporary-urls.json`

These URLs are for validation/demo only.

## Production recommendation (simplest stable)

Use **GitHub Pages with one repository per brand** under `colinmspeer-ct`:

- `vaccelerating-site`
- `outboundrep-site`
- `inboundrep-site`

For each repo:

1. Copy the matching folder from `brand-sites/dist/<brand>/`.
2. Commit to default branch.
3. Enable Pages via Actions.
4. Keep the `CNAME` file in repo root.
5. Set custom domain in Pages settings.

This keeps `d2djob.com` untouched in the current `d2djob` Pages workflow.

## IONOS DNS records for GitHub Pages custom domains

Apply the same record pattern for each apex domain:

### `vaccelerating.com`

- `@` A `185.199.108.153`
- `@` A `185.199.109.153`
- `@` A `185.199.110.153`
- `@` A `185.199.111.153`
- `@` AAAA `2606:50c0:8000::153`
- `@` AAAA `2606:50c0:8001::153`
- `@` AAAA `2606:50c0:8002::153`
- `@` AAAA `2606:50c0:8003::153`
- `www` CNAME `colinmspeer-ct.github.io`

### `outboundrep.com`

- `@` A `185.199.108.153`
- `@` A `185.199.109.153`
- `@` A `185.199.110.153`
- `@` A `185.199.111.153`
- `@` AAAA `2606:50c0:8000::153`
- `@` AAAA `2606:50c0:8001::153`
- `@` AAAA `2606:50c0:8002::153`
- `@` AAAA `2606:50c0:8003::153`
- `www` CNAME `colinmspeer-ct.github.io`

### `inboundrep.com`

- `@` A `185.199.108.153`
- `@` A `185.199.109.153`
- `@` A `185.199.110.153`
- `@` A `185.199.111.153`
- `@` AAAA `2606:50c0:8000::153`
- `@` AAAA `2606:50c0:8001::153`
- `@` AAAA `2606:50c0:8002::153`
- `@` AAAA `2606:50c0:8003::153`
- `www` CNAME `colinmspeer-ct.github.io`

After DNS propagates and Pages verifies, enable HTTPS in each repo’s Pages settings.
