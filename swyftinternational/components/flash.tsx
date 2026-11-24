import { one } from "@/lib/format";

export function Flash({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const error = one(searchParams.error);
  if (error) return <p className="rounded-xl bg-[#fde8e6] px-3 py-2 text-sm">{error}</p>;
  if (one(searchParams.generated) === "template") {
    return <p className="rounded-xl bg-[#e7f3ff] px-3 py-2 text-sm">Drafted from the interview notes. Read it, then publish.</p>;
  }
  if (one(searchParams.saved)) return <p className="rounded-xl bg-[#e7f6ee] px-3 py-2 text-sm">Saved.</p>;
  return null;
}
