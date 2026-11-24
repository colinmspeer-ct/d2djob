import type { Context } from "hono"

declare global {
  type FormDataEntryValue = string | File
}

export type Env = {
  DB: D1Database
  FILES: R2Bucket
  ASSETS: Fetcher
  TRAINING_SITE_ID?: string
  ADMIN_PASSWORD?: string
  ADMIN_SESSION_SECRET?: string
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
  OPENAI_BASE_URL?: string
  RESEND_API_KEY?: string
  NOTIFY_EMAIL?: string
  NOTIFY_FROM?: string
}

export type AppContext = Context<{ Bindings: Env; Variables: { bootError: string | null } }>

export function siteId(env: Env) {
  return env.TRAINING_SITE_ID || "d2djob"
}

export function sessionSecret(env: Env) {
  return env.ADMIN_SESSION_SECRET ?? ""
}

export function secureRequest(requestUrl: string) {
  return requestUrl.startsWith("https:")
}
