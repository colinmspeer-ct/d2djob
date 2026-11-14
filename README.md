# D2D Job

Recruiting desk for door-to-door sales, built for D2D Job (Swyft Marketing). Employers browse anonymized rep profiles. The jobs hub publishes door-to-door sales listings with `JobPosting` structured data. Alex’s admin desk turns interview notes into the public profile.

The public site is a static export for GitHub Pages. Canonical origin is `https://d2djob.com`. Admin still runs only on a Node server (`npm run dev` / `npm start`).

## Run it locally

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

The dev server listens on [http://127.0.0.1:43123](http://127.0.0.1:43123).

The local desk password in `.env.example` is `local-desk`. Change `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` before you put this on a public host.

```bash
npm test
npm run build
npm start
```

## What the public site does

- `/` is the talent desk. Filter by industry, city, and whether the rep will travel. Open a profile and send an invite or request a meeting.
- Contact details never render on a public profile. Photos, when uploaded, are stored privately and only a blurred crop is published.
- Profiles marked **Sample** are fictional demo records seeded so the grid is not empty.
- `/jobs` is the jobs hub. Each published job is also at `/job/[slug]` with schema.org `JobPosting` JSON-LD (title, description, dates, employment type, hiring organization, location, and base salary or commission language).

## Locations

Cities live in `data/locations.ts` and are copied into the database by the seed. Add a market there, then run `npm run db:seed`.

Fiber SEO URLs (`/fiber-sales-jobs/[city]`) are generated only for official AT&T Fiber markets:

- Primary 20: Charlotte, Raleigh, Atlanta, Miami, Jacksonville, Orlando, Fort Lauderdale, Durham, Greensboro, Winston-Salem, Charleston, Columbia, Greenville, Savannah, Augusta, West Palm Beach, St. Petersburg, Wilmington, Myrtle Beach, Asheville.
- Optional additions: Scranton and Wilkes-Barre, PA.

South Jersey, the Philadelphia suburbs (Bucks, Montgomery, Delaware County, and Chester County), Lancaster, Chicago, and Boston stay in the candidate filters and can have non-fiber geo pages such as `/roofing-sales-jobs/lancaster-pa` or `/pest-control-sales-jobs/cherry-hill-nj`. A fiber job cannot be saved in those cities. A rep who lives there can still be tagged with fiber experience.

## Admin

`/admin` asks for `ADMIN_PASSWORD`.

- Add a candidate with the private fields, then **Generate profile**.
- If `OPENAI_API_KEY` is set, generation calls that model (`OPENAI_MODEL`, optional `OPENAI_BASE_URL`). Otherwise it fills a deterministic template. A failed model call also falls back to the template.
- Edit the draft and publish or unpublish it.
- Invites and meeting requests are listed under Requests. The email hook uses Resend only when `RESEND_API_KEY`, `NOTIFY_EMAIL`, and `NOTIFY_FROM` are all set. Otherwise it records the request and logs a stub.

## Pages that ship

Finished copy is published for:

- `/door-to-door-sales`
- `/employers`
- all 7 industry pages under `/jobs/[industry]`
- all 22 `/fiber-sales-jobs/[city]` pages, including Scranton and Wilkes-Barre
- the 54 other-trade city pages that have finished copy (Cherry Hill, Voorhees, Mount Laurel, Doylestown, King of Prussia, West Chester, Lancaster, Chicago, and Boston, each for the six non-fiber trades)

City URLs that still had scaffold copy are not generated, not linked, and not listed in the sitemap. The talent desk, jobs hub, sample profiles, and sample job posts ship with those pages so the links resolve. Sample records stay marked Sample.

Reps use the HighLevel form on the homepage and each industry page. Employer invite and meeting forms stay on profile pages and do not send or save anything.

`/sitemap/` is the HTML list of every live page, linked from the footer. `/sitemap-index.xml` points at `/sitemap.xml`. Both include `<lastmod>`. `robots.txt` references them. Scaffold city URLs are omitted.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | SQLite by default (`file:./dev.db`) |
| `ADMIN_PASSWORD` | yes | Desk login |
| `ADMIN_SESSION_SECRET` | yes | Cookie signature, 16+ characters |
| `NEXT_PUBLIC_SITE_URL` | yes for real SEO | Canonical origin |
| `OPENAI_API_KEY` | no | Profile generation |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini` |
| `OPENAI_BASE_URL` | no | OpenAI-compatible endpoint |
| `RESEND_API_KEY` | no | Sends request mail when the other notify vars are set |
| `NOTIFY_EMAIL` | no | Inbox that receives invites |
| `NOTIFY_FROM` | no | From address Resend will accept |

## Deploy

GitHub Actions (`.github/workflows/pages.yml`) exports the site and deploys it to GitHub Pages on every push to `main`. The published root includes `CNAME` with `d2djob.com` and `.nojekyll`.

```bash
npm run build:pages
```

That writes `out/`. `NEXT_PUBLIC_SITE_URL` during the Pages build is `https://d2djob.com`.

DNS for the apex and www (set at the registrar, not in this repo):

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

After GitHub’s domain check succeeds, turn on Enforce HTTPS in the repository Pages settings.

`npm run dev` is the local Node app, including `/admin`. The desk password in `.env.example` is `local-desk`.

## What’s next

1. Turn on Resend with `RESEND_API_KEY`, `NOTIFY_EMAIL`, and `NOTIFY_FROM` on a server that can accept the invite form. The static site cannot send mail.
2. Replace the sample profiles and sample jobs with live records.
