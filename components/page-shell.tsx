import Link from "next/link"
import { industries } from "@/data/industries"
import { fiberMarkets } from "@/data/locations"
import { SiteNav } from "@/components/site-nav"

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#234237" />
      <path d="M9 7.5h9.2A3.8 3.8 0 0 1 22 11.3V25H13.2A4.2 4.2 0 0 1 9 20.8V7.5Z" fill="#f6f3ec" />
      <path d="M18.2 7.5v5.2H22" fill="none" stroke="#c4501a" strokeWidth="1.6" />
    </svg>
  )
}

export function PageShell({ children }: { children: React.ReactNode }) {
  const fiber = fiberMarkets().slice(0, 8)
  return (
    <>
      <div className="h-1 bg-clay" />
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Mark />
            <span>
              <span className="block font-heading text-lg leading-none tracking-tight">D2D Job</span>
              <span className="mt-1 block text-[0.68rem] tracking-wide text-muted-foreground uppercase">
                Swyft Marketing
              </span>
            </span>
          </Link>
          <SiteNav className="hidden items-center gap-1 md:flex" />
          <details className="relative md:hidden">
            <summary className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm">
              Menu
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl bg-card p-2 shadow-lg ring-1 ring-foreground/10">
              <SiteNav className="flex flex-col gap-1" />
            </div>
          </details>
        </div>
      </header>
      <main id="content" className="flex-1">
        {children}
      </main>
      <footer className="mt-16 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-heading text-xl">D2D Job</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A recruiting desk from Swyft Marketing. Alex interviews the reps. Employers see the work, not the phone number.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Industries</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link className="hover:text-foreground" href={`/jobs/${industry.slug}`}>
                    {industry.name} jobs
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">AT&T Fiber markets</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {fiber.map((location) => (
                <li key={location.slug}>
                  <Link className="hover:text-foreground" href={`/fiber-sales-jobs/${location.slug}`}>
                    {location.city}, {location.state}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="hover:text-foreground" href="/jobs/fiber">
                  All fiber markets
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Desk</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="/jobs">
                  Current job openings
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/employers">
                  For employers
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/door-to-door-sales">
                  Door-to-door sales jobs
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/app">
                  Field app
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/sitemap">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
