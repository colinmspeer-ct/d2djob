"use server";

import { redirect } from "next/navigation";
import { authenticate, clearSessionCookie, sessionConfigured, setSessionCookie } from "../auth";

export async function loginAdmin(_prev: { error: string } | null, formData: FormData) {
  if (!sessionConfigured()) return { error: "Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET before using the desk." };
  const user = authenticate(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""), "admin");
  if (!user) return { error: "That email and password did not match an admin." };
  await setSessionCookie(user);
  redirect("/admin");
}

export async function loginLibrary(_prev: { error: string } | null, formData: FormData) {
  if (!sessionConfigured()) return { error: "Set the desk secret before using the library." };
  const user = authenticate(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""), "library");
  if (!user) return { error: "That email and password did not match a library login." };
  await setSessionCookie(user);
  redirect("/library");
}

export async function logoutAdmin() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function logoutLibrary() {
  await clearSessionCookie();
  redirect("/library/login");
}
