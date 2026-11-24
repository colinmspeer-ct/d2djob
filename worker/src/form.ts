import type { Context } from "hono"

type BodyValue = string | File | (string | File)[]

export async function readForm(context: Context) {
  const body = await context.req.parseBody({ all: true })
  const data = new FormData()
  for (const [key, value] of Object.entries(body as Record<string, BodyValue>)) {
    const list = Array.isArray(value) ? value : [value]
    for (const item of list) data.append(key, item)
  }
  return data
}

export function text(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim()
}
