import "server-only"

export type EmailStatus = "sent" | "stubbed" | "failed"

type Notice = {
  subject: string
  text: string
}

export async function sendDeskEmail(notice: Notice): Promise<EmailStatus> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL
  const from = process.env.NOTIFY_FROM

  if (!apiKey || !to || !from) {
    console.info(`[email stub] ${notice.subject}. Set RESEND_API_KEY, NOTIFY_EMAIL, and NOTIFY_FROM to send.`)
    return "stubbed"
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: notice.subject,
        text: notice.text,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) {
      console.error(`[email] Resend responded ${response.status}`)
      return "failed"
    }
    return "sent"
  } catch (error) {
    console.error("[email] send failed", error)
    return "failed"
  }
}
