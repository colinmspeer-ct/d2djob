# D2D Job

Recruiting desk for door-to-door sales, built for D2D Job (Swyft Marketing). Employers browse anonymized rep profiles. The jobs hub publishes door-to-door sales listings with `JobPosting` structured data. Alex’s admin desk turns interview notes into the public profile.

This repo does not deploy anywhere and does not configure DNS. Set `NEXT_PUBLIC_SITE_URL` to whatever origin is actually serving the app.

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

## SEO scaffolds

These routes have unique titles, descriptions, and canonicals. The long copy is marked TODO:

- `/door-to-door-sales`
- `/jobs/fiber`, `/jobs/pest-control`, and the other industry pages
- `/fiber-sales-jobs/[city]` for AT&T Fiber markets only
- `/[industry]-sales-jobs/[city]` for the other trades, in any seeded city
- `/employers`

`/sitemap.xml` and `/robots.txt` are generated. `/admin` is disallowed.

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

Any Node host works.

1. Set the env vars above. Point `NEXT_PUBLIC_SITE_URL` at the host you are actually publishing.
2. For Postgres, set `provider = "postgresql"` in `prisma/schema.prisma`, set `DATABASE_URL`, then `npx prisma db push && npm run db:seed`.
3. `npm run build` and `npm start` (or the host’s Next.js adapter).
4. Unpublish the sample profiles and sample jobs before the site is public.

Do not change DNS for an existing production domain as part of standing this app up. Hook the domain up only when you mean to serve this build.

## What’s next

1. Replace the TODO copy on the pillar, industry, geo, and employers pages.
2. Turn on Resend (or another sender) with the three notify variables.
3. Choose a host, set `NEXT_PUBLIC_SITE_URL`, and only then attach a domain.
4. Unpublish sample records and add real candidates and jobs.
