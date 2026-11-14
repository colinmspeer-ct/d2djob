"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const heldMessage =
  "Nothing was sent. This site is published as static files, and email delivery is not configured. A server with RESEND_API_KEY, NOTIFY_EMAIL, and NOTIFY_FROM would be required before the desk can receive this. Your message stayed in this browser."

export function RequestForm({ slug, type }: { slug: string; type: "invite" | "meeting" }) {
  const meeting = type === "meeting"
  const [notice, setNotice] = useState<string | null>(null)
  const [problem, setProblem] = useState<string | null>(null)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email") || "")
    const name = String(data.get("name") || "").trim()
    const company = String(data.get("company") || "").trim()
    const phone = String(data.get("phone") || "").trim()
    const message = String(data.get("message") || "").trim()
    const times = String(data.get("preferredTimes") || "").trim()
    if (String(data.get("website") || "").trim()) {
      setProblem(null)
      setNotice(heldMessage)
      return
    }
    if (!name || !company || !phone || !message || (meeting && !times) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotice(null)
      setProblem("Fill in every required field, including a valid email, before submitting.")
      return
    }
    setProblem(null)
    setNotice(heldMessage)
  }

  return (
    <form id={type} onSubmit={onSubmit} noValidate className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
      <h2 className="text-2xl">{meeting ? "Request a meeting" : "Send an invite"}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Profile {slug} stays anonymous. This form does not email the desk from the published site.
      </p>
      {notice ? (
        <p className="mt-3 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary" role="status">
          {notice}
        </p>
      ) : null}
      {problem ? (
        <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {problem}
        </p>
      ) : null}
      <div className="mt-4 grid gap-3">
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${type}-name`}>Your name</Label>
          <Input id={`${type}-name`} name="name" required autoComplete="name" className="h-10 bg-background" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${type}-company`}>Company</Label>
          <Input id={`${type}-company`} name="company" required autoComplete="organization" className="h-10 bg-background" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${type}-email`}>Email</Label>
          <Input id={`${type}-email`} name="email" type="email" required autoComplete="email" className="h-10 bg-background" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${type}-phone`}>Phone</Label>
          <Input id={`${type}-phone`} name="phone" type="tel" required autoComplete="tel" className="h-10 bg-background" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${type}-message`}>Message</Label>
          <Textarea
            id={`${type}-message`}
            name="message"
            required
            rows={4}
            placeholder="Market, pay structure, and whether this is a team or a solo book."
            className="min-h-24 bg-background"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${type}-times`}>{meeting ? "Preferred times" : "Times that work (optional)"}</Label>
          <Textarea
            id={`${type}-times`}
            name="preferredTimes"
            required={meeting}
            rows={2}
            placeholder="Tue or Thu after 2, or a Saturday morning."
            className="min-h-16 bg-background"
          />
        </div>
        <Button type="submit" className="h-10 px-3.5">
          {meeting ? "Request a meeting" : "Send invite"}
        </Button>
      </div>
    </form>
  )
}
