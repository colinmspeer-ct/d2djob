import type { Env } from "./env"

export async function sendDeskEmail(env: Env, notice: { subject: string; text: string }) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL || !env.NOTIFY_FROM) {
    console.info(`[email stub] ${notice.subject}. Set RESEND_API_KEY, NOTIFY_EMAIL, and NOTIFY_FROM to send.`)
    return "stubbed"
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.NOTIFY_FROM,
        to: [env.NOTIFY_EMAIL],
        subject: notice.subject,
        text: notice.text,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) return "failed"
    return "sent"
  } catch (error) {
    console.error("[email] send failed", error)
    return "failed"
  }
}
