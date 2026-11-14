"use client"

import { useActionState } from "react"
import { login } from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/submit-button"

export function LoginForm() {
  const [state, action] = useActionState(login, null)
  return (
    <form action={action} className="grid gap-4">
      {state?.error ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" className="h-10 bg-background" />
      </div>
      <SubmitButton pendingLabel="Checking…">Enter the desk</SubmitButton>
    </form>
  )
}
