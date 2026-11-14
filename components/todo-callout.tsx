export function TodoCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#c4a15a] bg-[#fbf6ea] px-4 py-3 text-sm leading-relaxed text-[#5c4a1d]">
      <p className="text-[0.7rem] font-medium tracking-[0.14em] uppercase">TODO</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}
