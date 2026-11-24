import Link from "next/link";
import type { BrandConfig } from "@/lib/brands";

function brandHref(brand: BrandConfig, path = "") {
  if (!path) return `/${brand.id}`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${brand.id}${clean}`;
}

export function BrandHeader({ brand }: { brand: BrandConfig }) {
  return (
    <header className="border-b border-ink/10 bg-white/85">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href={brandHref(brand)} className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
          <span className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold ${brand.accentClass}`}>{brand.name.slice(0, 2).toUpperCase()}</span>
          {brand.name}
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm" aria-label={`${brand.name} main`}>
          <Link href={brandHref(brand, "/pricing")} className="rounded-full px-3 py-2 hover:bg-foam">
            Pricing
          </Link>
          <Link href={brandHref(brand, "/app")} className="rounded-full px-3 py-2 hover:bg-foam">
            App
          </Link>
          <Link href={brandHref(brand, "/sitemap")} className="rounded-full px-3 py-2 hover:bg-foam">
            Sitemap
          </Link>
          <Link href={brandHref(brand, "/app")} className="rounded-full bg-ink px-4 py-2 font-semibold text-paper">
            Lead form
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function BrandFooter({ brand }: { brand: BrandConfig }) {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold">{brand.name}</p>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            {brand.audience} Parent brand: {brand.parentBrand}. Preview only.
          </p>
        </div>
        <div className="text-sm leading-7">
          <Link className="block hover:text-glacier" href={brandHref(brand, "/pricing")}>
            Pricing
          </Link>
          <Link className="block hover:text-glacier" href={brandHref(brand, "/app")}>
            App view
          </Link>
          <Link className="block hover:text-glacier" href={brandHref(brand, "/sitemap")}>
            HTML sitemap
          </Link>
        </div>
        <div className="text-sm leading-7">
          <Link className="block hover:text-glacier" href={brandHref(brand, "/privacy")}>
            Privacy
          </Link>
          <Link className="block hover:text-glacier" href={brandHref(brand, "/terms")}>
            Terms
          </Link>
          <p className="mt-3 text-ink/60">Intended domain: {brand.domain} (not deployed in this preview).</p>
        </div>
      </div>
    </footer>
  );
}

export function BrandShell({ brand, children }: { brand: BrandConfig; children: React.ReactNode }) {
  return (
    <>
      <BrandHeader brand={brand} />
      <main>{children}</main>
      <BrandFooter brand={brand} />
    </>
  );
}

export { brandHref };
