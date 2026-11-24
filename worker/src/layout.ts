import { getCookie } from "hono/cookie"
import { escapeHtml } from "../../packages/training-library/src/html"
import type { TrainingPage } from "../../packages/training-library/src/types"
import type { AppContext } from "./env"

const css = `
:root { color-scheme: light; --bg:#f3efe6; --fg:#1a1714; --card:#fffdf8; --muted:#5c564c; --line:#e3dcd0; --primary:#234237; --primary-fg:#f6f3ec; --clay:#c4501a; --bad:#8c2f2f; --ok:#234237; --accent:#f6e7da; }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--fg); font:16px/1.5 Outfit, ui-sans-serif, system-ui, sans-serif; }
h1,h2,h3 { font-family: Fraunces, Georgia, serif; font-weight:560; letter-spacing:-0.02em; line-height:1.15; margin:0; }
h1 { font-size:2.4rem; }
h2 { font-size:1.5rem; }
a { color:inherit; }
header.bar { border-bottom:1px solid var(--line); background:var(--card); }
.bar-inner, main { width:min(960px, calc(100% - 2rem)); margin-inline:auto; }
.bar-inner { display:flex; flex-wrap:wrap; gap:0.75rem 1.5rem; align-items:center; justify-content:space-between; padding:0.8rem 0; }
.brand small { display:block; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted); font-size:0.68rem; }
.brand strong { font-family: Fraunces, Georgia, serif; font-size:1.35rem; font-weight:560; }
nav { display:flex; flex-wrap:wrap; gap:0.25rem; align-items:center; }
nav a, nav button { border:0; background:transparent; color:inherit; border-radius:999px; padding:0.35rem 0.75rem; font:inherit; text-decoration:none; }
nav a[aria-current="page"], nav a:hover, nav button:hover { background:var(--accent); }
.badge { margin-left:0.3rem; background:var(--clay); color:white; border-radius:999px; padding:0 0.4rem; font-size:0.75rem; }
main { padding:2rem 0 4rem; display:grid; gap:1rem; }
.lede, .muted, small { color:var(--muted); }
.note { border-left:3px solid var(--clay); padding-left:0.8rem; }
.card, .banner { background:var(--card); border-radius:1.4rem; padding:1.1rem 1.2rem; box-shadow:0 0 0 1px color-mix(in srgb, var(--fg) 8%, transparent); }
.stack { display:grid; gap:0.8rem; }
.row, .actions { display:flex; flex-wrap:wrap; gap:0.5rem; align-items:center; }
.stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(10rem, 1fr)); gap:0.75rem; list-style:none; padding:0; margin:0; }
.stats a { display:block; }
.stats strong { display:block; font-family: Fraunces, Georgia, serif; font-size:2.4rem; font-weight:560; }
label.field, fieldset { display:grid; gap:0.3rem; border:0; padding:0; margin:0; }
.checks, .people, .items { display:grid; gap:0.45rem; }
.checks { grid-template-columns:repeat(auto-fit, minmax(12rem, 1fr)); }
.check { display:flex; gap:0.4rem; align-items:center; }
input, select, textarea, button { font:inherit; color:inherit; }
input, select, textarea { width:100%; background:var(--bg); border:1px solid var(--line); border-radius:0.7rem; padding:0.55rem 0.7rem; }
textarea { min-height:6rem; resize:vertical; }
button, .button { display:inline-flex; align-items:center; justify-content:center; background:var(--primary); color:var(--primary-fg); border:0; border-radius:0.7rem; padding:0.5rem 0.85rem; text-decoration:none; cursor:pointer; }
button.secondary, .button.secondary { background:transparent; color:var(--fg); box-shadow:inset 0 0 0 1px var(--line); }
.banner.bad { color:var(--bad); background:#f8e8e8; }
.banner.ok { background:#e7f0ec; }
.banner.invite { display:grid; gap:0.3rem; background:var(--accent); }
.banner.invite a { overflow-wrap:anywhere; }
.people li, .items li { display:flex; flex-wrap:wrap; gap:0.5rem 1rem; justify-content:space-between; align-items:center; list-style:none; }
ul.people, ul.items { padding:0; margin:0; }
video, img, iframe { max-width:100%; border-radius:0.8rem; background:#111; }
iframe { width:100%; height:24rem; border:0; }
.kicker { letter-spacing:0.12em; text-transform:uppercase; font-size:0.72rem; color:var(--muted); margin:0; }
.copy { white-space:pre-wrap; }
.private { margin:0; color:var(--muted); font-size:0.75rem; }
.grid-2 { display:grid; gap:0.8rem; grid-template-columns:repeat(auto-fit, minmax(14rem, 1fr)); }
`

function shell(title: string, body: string, nav = "") {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)} · D2D Job</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,560&family=Outfit:wght@400;500;600&display=swap">
<style>${css}</style>
</head>
<body>
${nav}
<main>${body}</main>
</body>
</html>`
}

const links = [
  ["/admin", "Overview", "home"],
  ["/admin/candidates", "Candidates", "candidates"],
  ["/admin/requests", "Requests", "requests"],
  ["/admin/jobs", "Jobs", "jobs"],
  ["/admin/training", "Library", "library"],
] as const

async function openRequests(context: AppContext) {
  const row = await context.env.DB.prepare("SELECT COUNT(*) AS n FROM contact_requests WHERE status = 'new'").first<{ n: number }>()
  return row?.n ?? 0
}

export async function deskPage(context: AppContext, options: { title: string; active: string; body: string; status?: 200 | 400 | 401 | 404 | 500 | 503 }) {
  const count = await openRequests(context).catch(() => 0)
  const navLinks = links
    .map(([href, label, id]) => {
      const badge = id === "requests" && count > 0 ? `<span class="badge">${count}</span>` : ""
      const current = id === options.active ? ` aria-current="page"` : ""
      return `<a href="${href}"${current}>${label}${badge}</a>`
    })
    .join("")
  const nav = `<header class="bar"><div class="bar-inner">
      <div class="brand"><small>Recruiting desk</small><strong>D2D Job</strong><p class="private">Private. Not indexed.</p></div>
      <nav>${navLinks}<a href="/">View site</a>
        <form method="post" action="/admin/logout"><button type="submit">Log out</button></form>
      </nav>
    </div></header>`
  return context.html(shell(options.title, options.body, nav), options.status ?? 200)
}

export function loginPage(context: AppContext, error?: string) {
  const boot = context.get("bootError")
  const message = boot || error
  return context.html(
    shell(
      "Recruiting desk",
      `<p class="kicker">D2D Job</p>
      <h1>Recruiting desk</h1>
      <p class="lede">Private desk for candidate intake, profiles, jobs, requests, and the training library.</p>
      <p class="private">Private. Not indexed.</p>
      ${message ? `<p class="banner bad" role="alert">${escapeHtml(message)}</p>` : ""}
      <form class="card stack" method="post" action="/admin/login">
        <label class="field"><span>Password</span><input name="password" type="password" autocomplete="current-password" required></label>
        <button type="submit">Enter the desk</button>
      </form>`,
    ),
    boot ? 503 : error ? 401 : 200,
  )
}

export function repPage(context: AppContext, page: TrainingPage) {
  const repCookie = Boolean(getCookie(context, "d2d_rep"))
  const nav =
    page.frame === "bare"
      ? ""
      : `<header class="bar"><div class="bar-inner">
          <div class="brand"><small>Rep library</small><strong>D2D Job</strong><p class="private">Private. Not indexed.</p></div>
          <nav>
            ${repCookie ? `<form method="post" action="/training/logout"><button type="submit">Log out</button></form>` : `<a href="/admin/training">Back to desk</a>`}
          </nav>
        </div></header>`
  return context.html(shell(page.title, page.body, nav))
}
