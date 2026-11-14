import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { breadcrumbJsonLd, faqJsonLd, seoMetadata, type Crumb, type Faq } from "@/lib/seo";

const title = "Hire Door-to-Door Sales Reps";
const description =
  "Hire door-to-door sales reps after an interview. Browse anonymized profiles, then send an invite or request a meeting.";

export const metadata = seoMetadata(title, description, "/employers");

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Hire Door-to-Door Sales Reps", path: "/employers" },
];

const faqs: Faq[] = [
  {
    question: "What do I see on a rep’s public profile?",
    answer:
      "A pseudonym, the city, the trades, the kind of sales, and what they said they want: pay structure, travel, team or solo, full-time or seasonal. You do not see a legal name, phone number, or email.",
  },
  {
    question: "What is the difference between an invite and a meeting request?",
    answer:
      "An invite says you want an introduction. A meeting request adds times that work. Both go to the desk. Alex still holds the rep’s contact details until there is a reason to connect you.",
  },
  {
    question: "Are the sample profiles people I can hire?",
    answer:
      "No. Profiles marked Sample are fictional demo records so the desk is not empty. Hire from published profiles that are not marked sample.",
  },
];

export default function EmployersPage() {
  return (
    <PageShell>
      <article className="mx-auto grid max-w-3xl gap-8 px-4 py-10">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <JsonLd data={faqJsonLd(faqs)} />
        <Breadcrumbs items={crumbs} />
        <header className="grid gap-4">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">Hire Door-to-Door Sales Reps</h1>
          <p className="text-lg leading-relaxed">
            You hire door-to-door sales reps who have already sat for an interview. The public page is a short account
            of the work and the offer they will take. The phone number stays with Alex until you send an invite or ask
            for a meeting.
          </p>
        </header>
        <section className="grid gap-3">
          <h2 className="text-2xl">What you can read</h2>
          <p className="leading-relaxed">
            Each profile lists the city, the industries, years in the field when we have them, and the preferences that
            decide a fit: base plus commission or commission-only, travel or home at night, a crew or a solo book,
            full-time or a season. Photos, if any, are blurred. The legal name is not on that page.
          </p>
          <p className="leading-relaxed">
            Start on the{" "}
            <Link href="/" className="font-medium text-clay hover:underline">
              talent desk
            </Link>{" "}
            and filter by trade and city. Fiber reps are tied to official AT&T Fiber markets. Pest, roofing, windows,
            and exterior reps also show up in South Jersey, the Philadelphia suburbs, Lancaster, Chicago, and Boston.
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">What you send</h2>
          <p className="leading-relaxed">
            An invite needs your name, company, email, phone, and a note about the offer: the market, the product, and
            the pay structure. A meeting request adds times. Write the pay structure in words the rep already used,
            such as base plus commission or hourly plus commission. Do not invent a number they did not ask for.
          </p>
          <p className="leading-relaxed">
            The form does not reveal the rep. The desk matches your note to the private record and follows up. If email
            sending is not configured, the request is still saved and marked as not sent.
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">Listings versus people</h2>
          <p className="leading-relaxed">
            The{" "}
            <Link href="/jobs" className="font-medium text-clay hover:underline">
              jobs hub
            </Link>{" "}
            is for posted roles. The talent desk is for people. A sample job and a sample profile are labeled. Do not
            treat them as a live req or a person you can call. The{" "}
            <Link href="/door-to-door-sales" className="font-medium text-clay hover:underline">
              door-to-door sales jobs
            </Link>{" "}
            guide explains the work from the rep’s side if you need the language they use.
          </p>
        </section>
        <p>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground"
          >
            Browse the talent desk
          </Link>
        </p>
        <FaqList faqs={faqs} />
      </article>
    </PageShell>
  );
}
