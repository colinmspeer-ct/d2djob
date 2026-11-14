import Link from "next/link"
import { logout } from "@/lib/actions/auth"

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/candidates", label: "Candidates" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/jobs", label: "Jobs" },
]

export function AdminNav({ openRequests }: { openRequests: number }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">Recruiting desk</p>
          <p className="font-heading text-xl leading-none">D2D Job</p>
        </div>
        <nav className="flex flex-wrap items-center gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-1.5 text-sm hover:bg-accent">
              {link.label}
              {link.href === "/admin/requests" && openRequests > 0 ? (
                <span className="ml-1 rounded-full bg-clay px-1.5 text-xs text-white">{openRequests}</span>
              ) : null}
            </Link>
          ))}
          <Link href="/" className="rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent">
            View site
          </Link>
          <form action={logout}>
            <button type="submit" className="rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}
