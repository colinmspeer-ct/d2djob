import { escapeHtml, flashBanners } from "./html"
import type { ItemRow, TrainingFlash } from "./types"

const KINDS = [
  ["video", "Video"],
  ["pdf", "PDF"],
  ["doc", "Document"],
  ["image", "Image"],
  ["link", "Link"],
] as const

function text(value: string | null | undefined) {
  return escapeHtml(value ?? "")
}

function itemBody(item: ItemRow, repBase: string) {
  const description = item.description ? `<p class="copy">${text(item.description)}</p>` : ""
  if (item.kind === "link" && item.external_url) {
    return `${description}<p><a class="button" href="${text(item.external_url)}" target="_blank" rel="noopener noreferrer">Open link</a></p>`
  }
  const href = `${repBase}/files/${text(item.id)}`
  if (item.kind === "video") {
    return `${description}<video controls preload="metadata" src="${href}">Video</video>`
  }
  if (item.kind === "image") {
    return `${description}<img src="${href}" alt="${text(item.title)}">`
  }
  if (item.kind === "pdf") {
    return `${description}<p><a class="button" href="${href}">Open PDF</a></p><iframe src="${href}" title="${text(item.title)}"></iframe>`
  }
  return `${description}<p><a class="button" href="${href}">Download ${text(item.file_name || "file")}</a></p>`
}

export function repLibrary(input: {
  repBase: string
  sections: { id: string; title: string; description: string; items: ItemRow[] }[]
  flash: TrainingFlash
  adminPreview: boolean
}) {
  const sections = input.sections
    .map((section) => {
      const items = section.items
        .map(
          (item) => `<article class="item">
            <p class="kicker">${text(item.kind)}</p>
            <h3>${text(item.title)}</h3>
            ${itemBody(item, input.repBase)}
          </article>`,
        )
        .join("")
      return `<section class="card">
        <h2>${text(section.title)}</h2>
        ${section.description ? `<p class="copy">${text(section.description)}</p>` : ""}
        ${items || `<p class="muted">Nothing in this section yet.</p>`}
      </section>`
    })
    .join("")
  return `<h1>Training</h1>
    ${input.adminPreview ? `<p class="banner ok" role="status">You are previewing this as an admin.</p>` : ""}
    ${flashBanners(input.flash)}
    ${sections || `<section class="card"><p>Nothing has been published here yet.</p></section>`}`
}

export function repLogin(input: { repBase: string; error?: string }) {
  return `<h1>Training library</h1>
    <p class="lede">Sign in with the email your manager set up, or open the invite link they sent you.</p>
    ${input.error ? `<p class="banner bad" role="alert">${text(input.error)}</p>` : ""}
    <form class="card stack" method="post" action="${text(input.repBase)}/login">
      <label>Email <input name="email" type="email" autocomplete="username" required></label>
      <label>Password <input name="password" type="password" autocomplete="current-password" required></label>
      <button type="submit">Enter the library</button>
    </form>`
}

export function inviteInvalid() {
  return `<h1>Invite link</h1><p class="banner bad" role="alert">This invite link is not valid.</p>`
}

export function adminLibrary(input: {
  adminBase: string
  repBase: string
  sections: { id: string; title: string; description: string; items: ItemRow[] }[]
  reps: { id: string; email: string; created_at: string }[]
  invites: { id: string; label: string; expires_at: string | null; revoked_at: string | null; created_at: string }[]
  flash: TrainingFlash
}) {
  const kindOptions = KINDS.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")
  const sections = input.sections
    .map((section) => {
      const items = section.items
        .map(
          (item) => `<li>
            <div>
              <strong>${text(item.title)}</strong>
              <span class="muted">${text(item.kind)}${item.file_name ? ` · ${text(item.file_name)}` : ""}</span>
              ${item.description ? `<p class="copy">${text(item.description)}</p>` : ""}
              ${item.external_url ? `<p><a href="${text(item.external_url)}">${text(item.external_url)}</a></p>` : `<p><a href="${text(input.repBase)}/files/${text(item.id)}">Preview file</a></p>`}
            </div>
            <form method="post" action="${text(input.adminBase)}/items/${text(item.id)}/move">
              <button name="direction" value="up" type="submit">Up</button>
              <button name="direction" value="down" type="submit">Down</button>
            </form>
            <form method="post" action="${text(input.adminBase)}/items/${text(item.id)}/delete">
              <button type="submit">Delete</button>
            </form>
          </li>`,
        )
        .join("")
      return `<section class="card">
        <form class="stack" method="post" action="${text(input.adminBase)}/sections/${text(section.id)}">
          <label>Section title <input name="title" required maxlength="120" value="${text(section.title)}"></label>
          <label>Description <textarea name="description" maxlength="2000">${text(section.description)}</textarea></label>
          <div class="row">
            <button type="submit">Save section</button>
          </div>
        </form>
        <div class="row">
          <form method="post" action="${text(input.adminBase)}/sections/${text(section.id)}/move">
            <button name="direction" value="up" type="submit">Move section up</button>
            <button name="direction" value="down" type="submit">Move section down</button>
          </form>
          <form method="post" action="${text(input.adminBase)}/sections/${text(section.id)}/delete">
            <button type="submit">Delete section</button>
          </form>
        </div>
        <ul class="items">${items || `<li class="muted">No items yet.</li>`}</ul>
        <form class="stack" method="post" action="${text(input.adminBase)}/items" enctype="multipart/form-data">
          <input type="hidden" name="sectionId" value="${text(section.id)}">
          <h3>Add an item</h3>
          <label>Title <input name="title" required maxlength="140"></label>
          <label>Description <textarea name="description" maxlength="2000"></textarea></label>
          <label>Type <select name="kind">${kindOptions}</select></label>
          <label>File <input name="file" type="file" accept="video/mp4,video/webm,video/quicktime,application/pdf,.doc,.docx,.txt,.md,image/jpeg,image/png,image/webp,image/gif"></label>
          <label>Link <input name="url" type="url" placeholder="https://example.com/lesson"></label>
          <button type="submit">Add item</button>
        </form>
      </section>`
    })
    .join("")

  const reps = input.reps
    .map(
      (rep) => `<li><span>${text(rep.email)}</span>
        <form method="post" action="${text(input.adminBase)}/reps/${text(rep.id)}/delete"><button type="submit">Remove</button></form></li>`,
    )
    .join("")
  const invites = input.invites
    .map((invite) => {
      const state = invite.revoked_at ? "Revoked" : invite.expires_at ? `Expires ${text(invite.expires_at.slice(0, 16).replace("T", " "))} UTC` : "No expiry"
      return `<li><span>${text(invite.label || "Invite")} · ${state}</span>
        ${invite.revoked_at ? "" : `<form method="post" action="${text(input.adminBase)}/invites/${text(invite.id)}/revoke"><button type="submit">Revoke</button></form>`}
      </li>`
    })
    .join("")

  return `<h1>Training library</h1>
    <p class="lede">Add sections, then put videos, PDFs, documents, images, or links in them. Reps use ${text(input.repBase)}. These pages stay off the public site and out of search indexes.</p>
    ${flashBanners(input.flash)}
    <form class="card stack" method="post" action="${text(input.adminBase)}/sections">
      <h2>New section</h2>
      <label>Title <input name="title" required maxlength="120"></label>
      <label>Description <textarea name="description" maxlength="2000"></textarea></label>
      <button type="submit">Add section</button>
    </form>
    ${sections}
    <section class="card stack">
      <h2>Rep logins</h2>
      <ul class="people">${reps || `<li class="muted">No rep logins yet.</li>`}</ul>
      <form class="stack" method="post" action="${text(input.adminBase)}/reps">
        <label>Email <input name="email" type="email" required></label>
        <label>Password <input name="password" type="text" minlength="10" required autocomplete="new-password"></label>
        <button type="submit">Create rep login</button>
      </form>
    </section>
    <section class="card stack">
      <h2>Invite links</h2>
      <ul class="people">${invites || `<li class="muted">No invite links yet.</li>`}</ul>
      <form class="stack" method="post" action="${text(input.adminBase)}/invites">
        <label>Label <input name="label" maxlength="80" placeholder="Summer class"></label>
        <label>Expires (optional, UTC) <input name="expiresAt" type="datetime-local"></label>
        <button type="submit">Create invite link</button>
      </form>
    </section>`
}
