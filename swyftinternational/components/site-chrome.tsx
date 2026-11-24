import Link from "next/link";

const links = [
  { href: "/#method", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#database", label: "Database" },
  { href: "/s/harbor-demo", label: "Shortlist" },
  { href: "/library", label: "Library" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-xs text-dandelion">SI</span>
          Swyft International
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 hover:bg-white">
              {link.label}
            </Link>
          ))}
          <Link href="/employers/start" className="rounded-full bg-dandelion px-4 py-2 font-semibold text-ink">
            Start a search
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink/10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold">Swyft International</p>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            A branch of Swyft Marketing, led by Colin Speer. Offshore placement for US companies, with talent in Egypt and Belize.
          </p>
        </div>
        <div className="text-sm leading-7">
          <Link className="block hover:text-glacier" href="/pricing">Pricing</Link>
          <Link className="block hover:text-glacier" href="/s/harbor-demo">Sample shortlist</Link>
          <Link className="block hover:text-glacier" href="/roles">Sample roles</Link>
          <Link className="block hover:text-glacier" href="/library">Training library</Link>
        </div>
        <div className="text-sm leading-7">
          <Link className="block hover:text-glacier" href="/admin">Desk</Link>
          <Link className="block hover:text-glacier" href="/employers/start">Employer intake</Link>
          <p className="mt-3 text-ink/60">Intended home: swyftinternational.com. DNS is unchanged.</p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
