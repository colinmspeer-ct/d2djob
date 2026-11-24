# Swyft International (preview)

A separate Next.js app for the Swyft International placement desk. It is a preview of what would live at swyftinternational.com. It does not deploy, and it does not change DNS.

Swyft Marketing’s public site is [swyft-hq](https://github.com/colinmspeer-ct/swyft-hq), which is not in this repository. The nav item and service page to paste there are in `integration/swyft-hq-snippet.md`.

## Run it

```bash
cd swyftinternational
npm install
cp .env.example .env
npm run dev
```

The preview listens on http://127.0.0.1:43124.

Desk login from `.env.example`: `desk@swyftinternational.example` / `local-desk`.

Library login: `library@swyftinternational.example` / `local-library`.

The fictional sample shortlist is http://127.0.0.1:43124/s/harbor-demo.

```bash
npm test
npm run build
```

## What it reuses from the D2D Job desk

Candidate intake, generated profiles, job posts, meeting requests, and the signed desk cookie follow the D2D Job admin. Contact details stay off public pages. Passwords are hashed (scrypt) and the admin is seeded from the environment, which is the shape the Cloudflare desk is moving to.

The data file is SQLite, with the same statements in `d1/0001_init.sql` for Cloudflare D1. Uploads go to a local folder that stands in for the R2 bucket `swyft-international-media` (`wrangler.toml`). Nothing here calls `wrangler deploy`.

## Training library

`modules/training-library` is the reusable module. The other agent had not landed one when this preview was written. Every row is tagged `site = swyftinternational`, so the same tables can serve `d2djob` without mixing files. See `modules/training-library/README.md`.

The library and the desk send `noindex`. The whole preview does too.

## Money

Employers pay the hire directly. Swyft invoices a success fee of `SUCCESS_FEE_PERCENT` (default 33) of year-one salary. A new search, when the database has no fit, starts with `SEARCH_DEPOSIT_CENTS` (default 50000, which is $500), credited toward the fee. `REPLACEMENT_GUARANTEE_DAYS` (default 90) is the free replacement window.

Stripe Checkout runs only with an `sk_test_` secret. `sk_live_` and `rk_live_` are refused. With no key, the intake can record a preview hold that does not call Stripe and does not charge a card.

## Sample people

The six seeded profiles are invented. Three are in Egypt and three are in Belize. Avatars are generated initials, not photographs. Intro videos are empty frames until a file is attached on the desk.
