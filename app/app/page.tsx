import type { Metadata } from "next"
import Link from "next/link"
import { FieldPreview } from "@/components/field-preview"
import { JsonLd } from "@/components/json-ld"
import { PageShell } from "@/components/page-shell"
import { industries } from "@/data/industries"
import { fieldStatuses } from "@/lib/field-model"
import { siteName, siteUrl } from "@/lib/site"

const title = "D2D Job Field — log knocks, leads, and jobs"
const description =
  "Phone app for door-to-door reps to log knocks, leads, and jobs, see today's counts, and track follow-ups. Installs from the browser."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/app/" },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: "/app/",
    type: "website",
    siteName,
  },
}

export default function FieldLandingPage() {
  const origin = siteUrl()
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "D2D Job Field",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    url: `${origin}/app/`,
    installUrl: `${origin}/app/field/`,
    description,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList:
      "Log knocks, leads, and jobs; daily door, lead, and sale counts; follow-ups; optional GPS; CSV export; on-device storage",
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: origin,
    },
  }

  return (
    <PageShell>
      <JsonLd data={schema} />
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-2 sm:pt-14">
        <p className="text-sm font-medium tracking-wide text-clay">Field app</p>
        <h1 className="mt-2 max-w-3xl text-4xl leading-[1.02] sm:text-6xl">Log knocks, leads, and jobs from the door.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          D2D Job Field is the phone app for door-to-door reps. Log a knock while you are still on the porch, check
          today&apos;s counts, and see which follow-ups are due. It installs from the browser. There is no app store.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/app/field"
            className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Open the app
          </Link>
          <a
            href="#add-to-home-screen"
            className="inline-flex h-11 items-center rounded-full bg-card px-5 text-sm font-medium ring-1 ring-foreground/10"
          >
            Add to your home screen
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-3xl">What reps use it for</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          <li className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <h3 className="text-2xl">Log the door</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Save a name, address, phone, email, industry, status, notes, and the time. A name or an address is enough
              when nobody answers. Statuses are {fieldStatuses.map((status) => status.label.toLowerCase()).join(", ")}.
              Industries are {industries.map((industry) => industry.name.toLowerCase()).join(", ")}.
            </p>
          </li>
          <li className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <h3 className="text-2xl">See the day</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Home shows doors knocked, leads, jobs sold, and follow-ups due. Those counts come from knocks logged today
              on that phone.
            </p>
          </li>
          <li className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <h3 className="text-2xl">Work follow-ups</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A follow-up date is optional. The follow-ups screen splits them into due, upcoming, and callbacks or leads
              that still need a date.
            </p>
          </li>
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4">
        <h2 className="text-3xl">The screens</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
          These are the app screens, shown empty. They are not company results, and there are no sample customers. The
          numbers stay at zero until a rep logs a knock on their own phone. Location is optional and only saved if the
          rep allows it.
        </p>
        <div className="mt-8">
          <FieldPreview />
        </div>
      </section>

      <section id="add-to-home-screen" className="mx-auto grid max-w-3xl scroll-mt-20 gap-4 px-4 py-10">
        <h2 className="text-2xl">Add to your home screen</h2>
        <p className="leading-relaxed">
          D2D Job Field is an installable PWA. iPhone and Android can put it on the home screen from the browser. It is
          not listed in the App Store or Google Play. You can also leave it open as a browser tab.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-card p-5 ring-1 ring-foreground/10">
            <h3 className="text-xl">iPhone</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
              <li>
                Open <Link className="font-medium text-clay hover:underline" href="/app/field">the app</Link> in Safari.
              </li>
              <li>Tap the Share button.</li>
              <li>Tap Add to Home Screen.</li>
              <li>Tap Add. The icon opens the field app.</li>
            </ol>
          </div>
          <div className="rounded-lg bg-card p-5 ring-1 ring-foreground/10">
            <h3 className="text-xl">Android</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
              <li>
                Open <Link className="font-medium text-clay hover:underline" href="/app/field">the app</Link> in Chrome.
              </li>
              <li>Tap the three-dot menu.</li>
              <li>Tap Install app or Add to Home screen.</li>
              <li>Confirm. The icon opens the field app.</li>
            </ol>
          </div>
        </div>
        <p className="leading-relaxed">
          After the app has loaded once on that phone, the home-screen icon can open it without a connection. New
          visits still need a connection the first time.
        </p>
      </section>

      <section className="mx-auto grid max-w-3xl gap-4 px-4 pb-4">
        <h2 className="text-2xl">Data stays on the phone</h2>
        <p className="leading-relaxed">
          Leads are saved in this browser on this device. D2D Job does not upload them, and the field app is not
          connected to an account or to HighLevel. Settings has Export leads to CSV and Clear all data on this phone.
          Open the app, then Settings, to use either one.
        </p>
        <p className="leading-relaxed">
          Looking for a route instead of a field log?{" "}
          <Link className="font-medium text-clay hover:underline" href="/#get-matched">
            Get matched with a door-to-door sales job
          </Link>
          . Employers can browse the <Link className="font-medium text-clay hover:underline" href="/jobs">jobs desk</Link> or
          read the <Link className="font-medium text-clay hover:underline" href="/door-to-door-sales">door-to-door sales guide</Link>.
        </p>
      </section>
    </PageShell>
  )
}
