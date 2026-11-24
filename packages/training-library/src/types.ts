import type { Context } from "hono"

export type SqlBind = string | number | null | ArrayBuffer

export type SqlStatement = {
  bind: (...values: SqlBind[]) => SqlStatement
  first: <T>() => Promise<T | null>
  all: <T>() => Promise<{ results?: T[] }>
  run: () => Promise<unknown>
}

export type SqlDatabase = {
  prepare: (query: string) => SqlStatement
  batch: (statements: SqlStatement[]) => Promise<unknown>
}

export type StoredObject = {
  body: ReadableStream | null
  size: number
  httpMetadata?: { contentType?: string }
}

export type ObjectBucket = {
  put: (key: string, value: Uint8Array, options?: { httpMetadata?: { contentType?: string } }) => Promise<unknown>
  get: (key: string, options?: { range?: { offset: number; length: number } }) => Promise<StoredObject | null>
  delete: (key: string) => Promise<unknown>
}

export type TrainingFlash = {
  error?: string
  notice?: string
  invite?: string
}

export type TrainingPage = {
  title: string
  body: string
  area: "admin" | "rep"
  frame?: "app" | "bare"
}

export type TrainingConfig = {
  siteId: (context: Context) => string
  repBase: string
  adminBase: string
  adminLogin: string
  sessionSecret: (context: Context) => string
  getDb: (context: Context) => SqlDatabase
  getBucket: (context: Context) => ObjectBucket
  isAdmin: (context: Context) => Promise<boolean>
  setFlash: (context: Context, flash: TrainingFlash) => Promise<void> | void
  takeFlash: (context: Context) => Promise<TrainingFlash | null>
  renderPage: (context: Context, page: TrainingPage) => Promise<Response> | Response
  secureCookie: (context: Context) => boolean
  clientIp: (context: Context) => string
  now?: () => Date
}

export type SectionRow = {
  id: string
  site_id: string
  title: string
  description: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type ItemRow = {
  id: string
  site_id: string
  section_id: string
  title: string
  description: string
  kind: string
  external_url: string | null
  object_key: string | null
  file_name: string | null
  content_type: string | null
  byte_size: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type RepRow = {
  id: string
  site_id: string
  email: string
  password_hash: string
  created_at: string
}

export type InviteRow = {
  id: string
  site_id: string
  token_hash: string
  label: string
  expires_at: string | null
  revoked_at: string | null
  created_at: string
}
