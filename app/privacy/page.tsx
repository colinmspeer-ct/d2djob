import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { seoMetadata } from "@/lib/seo";

const title = "Privacy Policy";
const description =
  "How D2D Job, a Swyft Solutions LLC recruiting desk, uses form details and text-message consent, and how you can opt out.";

export const metadata: Metadata = seoMetadata(title, description, "/privacy");

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto grid max-w-3xl gap-6 px-4 py-10">
        <header className="grid gap-3">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated November 25, 2026</p>
        </header>
        <p className="leading-relaxed">
          This policy describes how D2D Job handles personal information when you use d2djob.com
          or submit the candidate form. D2D Job is a recruiting desk operated by Swyft Solutions
          LLC, doing business as Swyft Marketing.
        </p>
        <section className="grid gap-3">
          <h2 className="text-2xl">Information we collect</h2>
          <p className="leading-relaxed">
            When you submit a form, we collect the details you provide, which typically include
            your name, phone number, email address, the trade you sell, the cities you can work,
            how you want to be paid, and your text-message consent choices, including the date
            and time you gave them. We also collect basic website usage data used to operate
            the site.
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">How we use it</h2>
          <ul className="list-disc space-y-2 pl-6 leading-relaxed">
            <li>To review your application and contact you about it.</li>
            <li>To schedule and confirm interviews with the recruiting desk.</li>
            <li>To send the text messages you agreed to receive.</li>
            <li>To operate and improve the website.</li>
          </ul>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">Sale of personal information</h2>
          <p className="leading-relaxed">We do not sell personal information.</p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">Mobile information</h2>
          <p className="leading-relaxed">
            No mobile information will be shared with third parties or affiliates for marketing
            or promotional purposes. All the above categories exclude text messaging originator
            opt-in data and consent; this information will not be shared with any third parties.
            We share information only with service providers that help us deliver messages and
            run the desk, such as our CRM and texting platform, and only to provide those
            services to us.
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">Text message opt-out</h2>
          <p className="leading-relaxed">
            You can opt out of text messages by replying STOP. Reply HELP for help. Leaving the
            optional checkbox unchecked does not block your application.
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
          <p className="leading-relaxed">
            See also our{" "}
            <a className="font-medium text-clay hover:underline" href="/terms/">
              Terms of Service
            </a>
            .
          </p>
        </section>
      </article>
    </PageShell>
  );
}
