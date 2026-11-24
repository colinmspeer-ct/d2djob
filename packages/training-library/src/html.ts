export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function flashBanners(flash: { error?: string; notice?: string; invite?: string }) {
  const blocks: string[] = []
  if (flash.error) blocks.push(`<p class="banner bad" role="alert">${escapeHtml(flash.error)}</p>`)
  if (flash.notice) blocks.push(`<p class="banner ok" role="status">${escapeHtml(flash.notice)}</p>`)
  if (flash.invite) {
    blocks.push(
      `<p class="banner invite" role="status"><span>Invite link</span><a href="${escapeHtml(flash.invite)}">${escapeHtml(flash.invite)}</a></p>`,
    )
  }
  return blocks.join("")
}
