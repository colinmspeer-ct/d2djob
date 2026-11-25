import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { seoMetadata } from "@/lib/seo";

const title = "Terms of Service";
const description =
  "Terms for using d2djob.com, plus SMS terms for optional recruiting texts from the D2D Job desk at Swyft Solutions LLC.";

export const metadata: Metadata = seoMetadata(title, description, "/terms");

export default function TermsPage() {
  return (
    <PageShell>
      <article className="mx-auto grid max-w-3xl gap-6 px-4 py-10">
        <header className="grid gap-3">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated November 25, 2026</p>
        </header>
        <p className="leading-relaxed">
          These terms apply to your use of d2djob.com and to applications you send to D2D Job,
          a recruiting desk operated by Swyft Solutions LLC, doing business as Swyft Marketing.
        </p>
        <section className="grid gap-3">
          <h2 className="text-2xl">The site</h2>
          <p className="leading-relaxed">
            Pages describe door-to-door sales jobs and how the desk matches reps with employers.
            They are information, not a job offer or a promise of placement. Submitting a form
            does not create an employment or contractor agreement.
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">Governing law</h2>
          <p className="leading-relaxed">
            These terms are governed by the laws of the Commonwealth of Pennsylvania.
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">SMS Terms</h2>
          <h3 className="text-xl">Program name</h3>
          <p className="leading-relaxed">D2D Job Recruiting Texts</p>
          <h3 className="text-xl">Program description</h3>
          <p className="leading-relaxed">
            When you submit a form on d2djob.com and check the consent box, D2D Job / Swyft
            Solutions LLC will text you about your sales rep application and interview
            scheduling. Consent to texts is not a condition of applying or of any purchase.
            Leaving the box unchecked still leaves your application intact.
          </p>
          <h3 className="text-xl">Message frequency</h3>
          <p className="leading-relaxed">Message frequency varies.</p>
          <h3 className="text-xl">Message and data rates</h3>
          <p className="leading-relaxed">Message and data rates may apply.</p>
          <h3 className="text-xl">Opt out</h3>
          <p className="leading-relaxed">
            Reply STOP to any message to cancel at any time. You will get one confirmation
            text, and then no more messages.
          </p>
          <h3 className="text-xl">Help</h3>
          <p className="leading-relaxed">
            Reply HELP for help, or contact us at 717-366-6714 or{" "}
            <a className="font-medium text-clay hover:underline" href="mailto:colin@colinmspeer.com">
              colin@colinmspeer.com
            </a>
            .
          </p>
          <h3 className="text-xl">Carrier liability</h3>
          <p className="leading-relaxed">
            Carriers are not liable for any delayed or undelivered messages.
          </p>
          <h3 className="text-xl">Privacy</h3>
          <p className="leading-relaxed">
            See our{" "}
            <a className="font-medium text-clay hover:underline" href="/privacy/">
              Privacy Policy
            </a>
            .
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">Contact</h2>
          <p className="leading-relaxed">
            Swyft Solutions LLC
            <br />
            Media, PA 19063
            <br />
            717-366-6714
            <br />
            <a className="font-medium text-clay hover:underline" href="mailto:colin@colinmspeer.com">
              colin@colinmspeer.com
            </a>
          </p>
        </section>
      </article>
    </PageShell>
  );
}
