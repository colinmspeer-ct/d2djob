import Link from "next/link";
import { industries } from "@/data/industries";
import { fiberMarkets } from "@/data/locations";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { pillarFaqs, pillarMeta, pillarSections } from "@/content/pillar";
import { breadcrumbJsonLd, faqJsonLd, seoMetadata, type Crumb } from "@/lib/seo";

export const metadata = seoMetadata(pillarMeta.title, pillarMeta.description, pillarMeta.path);

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Door-to-Door Sales Jobs", path: "/door-to-door-sales" },
];

const regionHubs = [
  { href: "/pest-control-sales-jobs/cherry-hill-nj", label: "Pest control sales jobs in Cherry Hill, South Jersey" },
  { href: "/roofing-sales-jobs/lancaster-pa", label: "Roofing sales jobs in Lancaster, PA" },
  { href: "/windows-doors-sales-jobs/west-chester-pa", label: "Window and door sales jobs in West Chester, PA" },
  { href: "/exterior-cleaning-sales-jobs/chicago-il", label: "Exterior cleaning sales jobs in Chicago" },
  { href: "/window-cleaning-sales-jobs/boston-ma", label: "Window cleaning sales jobs in Boston" },
  { href: "/exteriors-sales-jobs/king-of-prussia-pa", label: "Exterior sales jobs in King of Prussia, PA" },
];

export default function GuidePage() {
  return (
    <PageShell>
      <article className="mx-auto grid max-w-3xl gap-8 px-4 py-10">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <JsonLd data={faqJsonLd(pillarFaqs)} />
        <Breadcrumbs items={crumbs} />
        <header className="grid gap-4">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">Door-to-Door Sales Jobs</h1>
          <p className="text-lg leading-relaxed">
            Door to door sales jobs are route work. You knock, you have a short conversation, and you keep a number.
            D2D sales jobs show up under a lot of names: door knocking jobs, summer sales jobs, and the trade itself,
            fiber, pest, roofing, windows. This page is the map. The industry pages and city pages are the detail.
          </p>
        </header>
        {pillarSections.map((section) => (
          <section key={section.heading} className="grid gap-3">
            <h2 className="text-2xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        <section className="grid gap-3">
          <h2 className="text-2xl">Industries that hire this way</h2>
          <p className="leading-relaxed">
            Pick the product you can say out loud at a door. Each industry page covers the week, the season, and the
            pay structure, then links to cities.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {industries.map((industry) => (
              <li key={industry.slug}>
                <Link href={`/jobs/${industry.slug}`} className="font-medium text-clay hover:underline">
                  {industry.name} sales jobs
                </Link>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">
            Open listings, including sample records marked as samples, are kept on their own page.{" "}
            <Link href="/jobs" className="font-medium text-clay hover:underline">
              Browse current D2D sales job openings
            </Link>
            .
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">Fiber city hubs</h2>
          <p className="leading-relaxed">
            Fiber internet sales jobs on this site are limited to official AT&T Fiber markets. South Jersey, the
            Philadelphia suburbs, Lancaster, Chicago, and Boston are on the desk for other trades. They do not get a
            fiber city page.
          </p>
          <ul className="flex flex-wrap gap-2">
            {fiberMarkets().map((location) => (
              <li key={location.slug}>
                <Link
                  href={`/fiber-sales-jobs/${location.slug}`}
                  className="inline-flex rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-foreground/10"
                >
                  Fiber sales jobs in {location.city}, {location.state}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">Other knocking markets</h2>
          <p className="leading-relaxed">
            These cities are where reps live and sell pest, roofing, windows, cleaning, and other exterior work.
          </p>
          <ul className="grid gap-2">
            {regionHubs.map((hub) => (
              <li key={hub.href}>
                <Link href={hub.href} className="font-medium text-clay hover:underline">
                  {hub.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">If you hire</h2>
          <p className="leading-relaxed">
            Owners and sales managers use the{" "}
            <Link href="/employers" className="font-medium text-clay hover:underline">
              employers page
            </Link>{" "}
            and the talent desk. You see the work history and what the rep wants. You send an invite when you want an
            introduction. The phone number stays with Alex until then.
          </p>
        </section>
        <FaqList faqs={pillarFaqs} />
      </article>
    </PageShell>
  );
}
