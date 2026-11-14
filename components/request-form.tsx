"use client"

import { useActionState } from "react"
import { submitRequest } from "@/lib/actions/requests"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormStatus } from "react-dom"

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="h-10 px-3.5" disabled={pending}>
      {pending ? "Sending…" : label}
    </Button>
  )
}

export function RequestForm({
  slug,
  type,
  sent,
}: {
  slug: string
  type: "invite" | "meeting"
  sent: boolean
}) {
  const [state, action] = useActionState(submitRequest.bind(null, slug, type), null)
  const meeting = type === "meeting"

  return (
    <form id={type} action={action} className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
      <h2 className="text-2xl">{meeting ? "Request a meeting" : "Send an invite"}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        This goes to the desk. The rep’s phone and email are not on this page.
      </p>
      {sent ? (
        <p className="mt-3 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary" role="status">
          Saved. The desk has your request.
        </p>
      ) : null}
      {state?.error ? (
        <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {state.error}
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
        <Submit label={meeting ? "Request a meeting" : "Send invite"} />
      </div>
    </form>
  )
}
