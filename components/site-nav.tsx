"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

const links = [
  {
    href: "/",
    label: "Talent",
    match: (path: string) => path === "/" || path.startsWith("/candidates"),
  },
  {
    href: "/jobs",
    label: "Jobs",
    match: (path: string) =>
      path.startsWith("/jobs") || path.startsWith("/job/") || path.includes("-sales-jobs"),
  },
  { href: "/employers", label: "Employers", match: (path: string) => path.startsWith("/employers") },
  {
    href: "/door-to-door-sales",
    label: "Guide",
    match: (path: string) => path.startsWith("/door-to-door-sales"),
  },
  {
    href: "/app",
    label: "Field",
    match: (path: string) => path === "/app" || path.startsWith("/app/"),
  },
]

export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname()
  return (
    <nav className={className}>
      {links.map((link) => {
        const active = link.match(pathname)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-accent hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
