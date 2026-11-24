import Link from "next/link";
import { logoutAdmin } from "@/lib/actions/auth";

const links = [
  ["/admin", "Overview"],
  ["/admin/candidates", "Candidates"],
  ["/admin/jobs", "Jobs"],
  ["/admin/requests", "Requests"],
  ["/admin/shortlists", "Shortlists"],
  ["/admin/searches", "Searches"],
  ["/admin/library", "Library"],
];

export function DeskNav({ openRequests }: { openRequests: number }) {
  return (
    <header className="border-b border-ink/10 bg-foam">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-[0.68rem] tracking-[0.14em] text-ink/50 uppercase">Desk</p>
          <p className="font-heading text-xl">Swyft International</p>
        </div>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-full px-3 py-1.5 hover:bg-paper">
              {label}
              {href === "/admin/requests" && openRequests > 0 ? (
                <span className="ml-1 rounded-full bg-dandelion px-1.5 text-xs">{openRequests}</span>
              ) : null}
            </Link>
          ))}
          <Link href="/" className="rounded-full px-3 py-1.5 text-ink/60 hover:bg-paper">View site</Link>
          <form action={logoutAdmin}>
            <button className="rounded-full px-3 py-1.5 text-ink/60" type="submit">Log out</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
