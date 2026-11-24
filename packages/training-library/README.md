# Training library

Site-scoped training content for a Cloudflare Worker. D2D Job mounts it at `/training` with `site_id = d2djob`. Swyft International can mount the same module with `site_id = swyftinternational`.

Rows are separated by `site_id`. Files go to R2 under `sites/<site id>/training/<item id>/<file>`. The same D1 database and R2 bucket can serve both sites, or each site can have its own Worker, database, and bucket. Copy `schema.sql` into that Worker's D1 migrations either way.

```ts
import { Hono } from "hono"
import { createTrainingAdminRouter, createTrainingRepRouter } from "@swyft/training-library"

const app = new Hono()
const training = {
  siteId: () => "swyftinternational",
  repBase: "/training",
  adminBase: "/admin/training",
  adminLogin: "/admin/login",
  sessionSecret: (c) => c.env.ADMIN_SESSION_SECRET,
  getDb: (c) => c.env.DB,
  getBucket: (c) => c.env.FILES,
  isAdmin: (c) => hasAdminSession(c),
  setFlash: (c, flash) => rememberFlash(c, flash),
  takeFlash: (c) => readFlash(c),
  renderPage: (c, page) => c.html(swyftPage(page)),
  secureCookie: (c) => new URL(c.req.url).protocol === "https:",
  clientIp: (c) => c.req.header("cf-connecting-ip") || "local",
}

app.route("/training", createTrainingRepRouter(training))
app.route("/admin/training", createTrainingAdminRouter(training))
```

Admins create sections and items. Items are a video, PDF, document, image, or https link. Uploads are checked for size, extension, and file signature. Reps either sign in with a password stored as PBKDF2, or open an invite link. The raw invite token is shown once and only its SHA-256 hash is stored.

Limits: images 8 MB, PDFs and documents 25 MB, videos 80 MB. Larger videos should be added as links.

The host app should send `X-Robots-Tag: noindex` on `/training` and `/admin`, and disallow those paths in `robots.txt`.
