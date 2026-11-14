import { one } from "@/lib/format"

export function Flash({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const error = one(searchParams.error)
  const saved = one(searchParams.saved)
  const generated = one(searchParams.generated)
  if (error) {
    return (
      <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
        {error}
      </p>
    )
  }
  if (generated === "openai") {
    return (
      <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary" role="status">
        Drafted with the model. Read it, then publish.
      </p>
    )
  }
  if (generated === "template") {
    return (
      <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary" role="status">
        Drafted with the built-in template. No API key is set. Edit the text, then publish.
      </p>
    )
  }
  if (generated === "template-fallback") {
    return (
      <p className="rounded-xl bg-[#fbf6ea] px-3 py-2 text-sm text-[#5c4a1d]" role="status">
        The model request failed, so the template draft was used. Edit it before you publish.
      </p>
    )
  }
  if (saved) {
    return (
      <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary" role="status">
        Saved.
      </p>
    )
  }
  return null
}
