"use server"

import { redirect } from "next/navigation"
import { clearSessionCookie, passwordsMatch, sessionConfigured, setSessionCookie } from "../auth"

export async function login(_prev: { error: string } | null, formData: FormData) {
  if (!sessionConfigured()) {
    return { error: "Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET before using the desk." }
  }
  const password = String(formData.get("password") ?? "")
  if (!passwordsMatch(password)) return { error: "Wrong password." }
  await setSessionCookie()
  redirect("/admin")
}

export async function logout() {
  await clearSessionCookie()
  redirect("/admin/login")
}
