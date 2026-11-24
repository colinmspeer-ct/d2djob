# Deploy the D2D Job desk

The public marketing site stays the static export from `npm run build:pages`. The recruiting desk and training library run on a Cloudflare Worker with D1 and R2. This file is the cutover. Do not change DNS until the workers.dev preview looks right.

Nothing from the earlier Astro preview is in this repo. `main` and the other branches have no Worker, D1, or Astro app, and that preview could not be read from here. This Worker is the production desk.

## Why this is not Next.js on Workers

The live pages are a static export. `scripts/build-pages.sh` removes `/admin` and writes the HTML that GitHub Pages serves today. The Next app also uses Next 16 cache components, Prisma, SQLite, and `sharp`. Putting that server on Workers would re-render the marketing pages and can change URLs, HTML, and SEO. A Worker in front of the same `out/` directory keeps those files as they are and adds the routes that are 404 on GitHub Pages.

`npm run dev` is still the local Next desk on SQLite. It does not share a database with the Worker. The desk that goes live is `npm run worker:dev`.

## What you create

| Name | Binding | Purpose |
| --- | --- | --- |
| D1 database `d2djob` | `DB` | Candidates, jobs, requests, admins, training rows |
| R2 bucket `d2djob-files` | `FILES` | Candidate photos and training files |
| Assets directory `out/` | `ASSETS` | The existing Pages export |
| Var `TRAINING_SITE_ID` | `d2djob` | Already in `wrangler.jsonc` |

Training rows are keyed by `site_id`, so the same module can serve swyftinternational.com. See `packages/training-library/README.md`.

## Secrets

Set these with `npx wrangler secret put`. Wrangler prompts for the value. Do not commit them and do not pass them as shell arguments.

| Secret | Required | Notes |
| --- | --- | --- |
| `ADMIN_PASSWORD` | yes | At least 10 characters. Hashed into D1 the first time the desk boots. The plaintext stays only in the secret. |
| `ADMIN_SESSION_SECRET` | yes | At least 16 characters. Signs the admin and rep cookies. |
| `OPENAI_API_KEY` | no | Profile generation. Without it, Generate uses the built-in template. |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini`. Can be a var instead of a secret. |
| `OPENAI_BASE_URL` | no | OpenAI-compatible base URL. |
| `RESEND_API_KEY` | no | Sends request mail only when all three notify values are set. |
| `NOTIFY_EMAIL` | no | Inbox for invites and meeting requests. |
| `NOTIFY_FROM` | no | From address Resend will accept. |

Local copies go in `.dev.vars`, from `.dev.vars.example`. `.dev.vars` is gitignored.

## First deploy

```bash
npx wrangler login
npx wrangler d1 create d2djob
npx wrangler r2 bucket create d2djob-files
```

Copy the database id from `wrangler d1 create` into `database_id` in `wrangler.jsonc`. The committed id is a placeholder.

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npx wrangler d1 migrations apply d2djob --remote
npm ci
npx prisma generate && npx prisma db push && npx tsx prisma/seed.ts
npm run build:pages
npx wrangler deploy
```

`build:pages` needs `DATABASE_URL=file:./dev.db` and `NEXT_PUBLIC_SITE_URL=https://d2djob.com`. That is the same export GitHub Pages already publishes. `wrangler deploy` uploads `out/` as static assets and the Worker for `/admin`, `/training`, `/library`, and `/api/*`.

This deploy publishes `https://d2djob.<account>.workers.dev`. It does not attach d2djob.com. Check these before any DNS change:

- `/`, `/jobs/`, `/door-to-door-sales/`, and a city page match the current site.
- `/robots.txt` still allows `/` and now also has `Disallow: /admin`, `Disallow: /training`, and `Disallow: /library`.
- `/admin/login` answers, and the response has `X-Robots-Tag: noindex`.
- Sign in, add a training file, open the invite link in a private window.

The first successful login hashes `ADMIN_PASSWORD` into the `admins` table. Later deploys do not overwrite that hash.

To rotate the password:

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler d1 execute d2djob --remote --command "DELETE FROM admins WHERE id = 'primary';"
```

Open `/admin/login` once after that. The desk hashes the new secret and stores only the hash.

## DNS, when the preview is right

Today the domain points at GitHub Pages:

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153` |
| `@` | AAAA | `2606:50c0:8001::153` |
| `@` | AAAA | `2606:50c0:8002::153` |
| `@` | AAAA | `2606:50c0:8003::153` |
| `www` | CNAME | `colinmspeer-ct.github.io` |

1. Add `d2djob.com` to Cloudflare and set the registrar to the two Cloudflare nameservers. Until the next step, recreate the table above in the Cloudflare zone so GitHub Pages keeps serving the site.
2. In the Worker settings, add custom domains `d2djob.com` and `www.d2djob.com`. You can also uncomment the `routes` block in `wrangler.jsonc` and deploy again. Cloudflare replaces the apex records with the Worker.
3. Hit `/`, `/jobs/`, `/sitemap.xml`, and `/robots.txt` on the apex. The HTML is the `out/` export from the deploy, not a new render.
4. Leave the GitHub Pages workflow in place until you are satisfied. After the custom domain is attached, a push to `main` updates GitHub Pages only. The live site changes when you run `npm run build:pages && npx wrangler deploy` again.

Rollback: remove the Worker custom domains and put the GitHub A, AAAA, and www records back.

### Path-only alternative

If the marketing HTML must keep coming from GitHub Pages itself, do not attach the apex. Proxy the zone, leave the GitHub records as the origin, set SSL to Full, and add Worker routes for only:

- `d2djob.com/admin*`
- `d2djob.com/training*`
- `d2djob.com/library*`
- `d2djob.com/api/*`
- the same four routes on `www`

`/admin` and `/training` then hit this Worker. Every other path stays on GitHub Pages byte for byte. The assets uploaded with the Worker are unused in this setup.

## Limits and private pages

Training uploads: images 8 MB, PDFs and documents 25 MB, videos 80 MB. The type is checked from the file bytes, not the browser's label. Larger videos should be saved as links. Rep passwords are hashed the same way as the admin password. Invite links are shown once; only a SHA-256 hash is stored.

`/admin`, `/training`, and `/library` send `noindex` and are disallowed in `robots.txt`. `/library` redirects to `/training`.

Public profile and job pages do not change when you click Publish. The static export does not read D1 yet. The public invite and meeting forms are also unchanged and still do not submit. The desk can log a request by hand, and `POST /api/requests` accepts JSON (`slug`, `type`, `name`, `company`, `email`, `phone`, `message`, `preferredTimes`) for a later form change.

## Local check

```bash
cp .dev.vars.example .dev.vars
npx wrangler d1 migrations apply d2djob --local --persist-to .wrangler/state
npm run worker:dev
npm run worker:smoke
```

`worker:smoke` logs in, creates a candidate, generates a profile, logs a meeting request, uploads a training image, rejects a fake image, and opens the library with an invite link.
