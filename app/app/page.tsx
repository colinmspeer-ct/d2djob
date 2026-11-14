import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { PageShell } from "@/components/page-shell"
import { FieldMockups } from "@/components/field/mockups"
import { industries } from "@/data/industries"
import { onDeviceNote, statuses } from "@/lib/field/records"
import { seoMetadata } from "@/lib/seo"
import { siteUrl } from "@/lib/site"

const title = "Field app for reps"
const description =
  "Log knocks, leads, and sold jobs from the route. Daily counts and follow-ups stay on this phone, with no app store install."

export const metadata: Metadata = seoMetadata(title, description, "/app")

const features = [
  "Log knocks, leads, and jobs with a name, address, phone, email, product, status, notes, and the time",
  "Daily counts of doors, leads, and sales from stops saved on this phone",
  "Follow-up dates",
  "Search, filter, and edit stops",
  "Optional browser location",
  "Export stops to CSV or clear them on the phone",
  "Install from the browser, including offline after the first load",
]

export default function FieldAppLanding() {
  const origin = siteUrl()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "D2D Job Field",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${origin}/app/`,
    installUrl: `${origin}/app/field/`,
    description,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: features,
    publisher: {
      "@type": "Organization",
      name: "D2D Job",
      url: `${origin}/`,
      parentOrganization: { "@type": "Organization", name: "Swyft Marketing" },
    },
  }

  return (
    <PageShell>
      <JsonLd data={jsonLd} />
      <article className="mx-auto grid max-w-6xl gap-12 px-4 py-10">
        <header className="grid max-w-3xl gap-4">
          <p className="text-sm font-medium tracking-wide text-clay">Field app</p>
          <h1 className="text-4xl leading-[1.05] sm:text-6xl">Log the doors. Keep the day on your phone.</h1>
          <p className="text-lg leading-relaxed">
            The field app is for reps on a route. Log the knock, the lead, or the job while you are still at the door.
            Doors, leads, sales, and follow-ups are counted from the stops saved on this phone. A new install starts at
            zero.
          </p>
          <p>
            <Link
              href="/app/field"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground"
            >
              Open the app
            </Link>
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Installable from the browser. It is not in the App Store or Google Play.
          </p>
        </header>

        <section className="grid max-w-3xl gap-3">
          <h2 className="text-2xl">What you log</h2>
          <p className="leading-relaxed">
            Each stop stores a name, an address, a phone, an email, a product, a status, notes, and the time you saved
            it. Phone, email, notes, and location can be left blank. A name or an address is enough to keep the door.
          </p>
          <p className="leading-relaxed">
            Location is optional. The browser asks before it shares a position, and the coordinates stay with that stop
            on this phone.
          </p>
          <p className="leading-relaxed">The product list is the seven industries on this site:</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {industries.map((industry) => (
              <li key={industry.slug}>
                <Link className="font-medium text-clay hover:underline" href={`/jobs/${industry.slug}`}>
                  {industry.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">Status choices:</p>
          <ul className="grid gap-1">
            {statuses.map((status) => (
              <li key={status.id}>{status.label}</li>
            ))}
          </ul>
        </section>

        <section className="grid max-w-3xl gap-3">
          <h2 className="text-2xl">What the home screen counts</h2>
          <ul className="grid gap-2">
            <li>Doors: stops logged today, every status.</li>
            <li>Leads: stops logged today with status Lead.</li>
            <li>Sales: stops logged today with status Sold. That is the job count for the day.</li>
            <li>Follow-ups: stops with a follow-up date of today or earlier, including older stops.</li>
          </ul>
          <p className="leading-relaxed">
            A sold stop is also a door. The numbers overlap on purpose. They are not a score from anywhere else.
          </p>
        </section>

        <section className="grid gap-4">
          <div className="grid max-w-3xl gap-3">
            <h2 className="text-2xl">The screens</h2>
            <p className="leading-relaxed">
              These are the app screens, empty, the way they look before the first knock. Search, edit, the follow-up
              list, the CSV export, and clear data are the same screens with your stops on them.
            </p>
          </div>
          <FieldMockups />
        </section>

        <section className="grid max-w-3xl gap-3">
          <h2 className="text-2xl">Add to Home Screen</h2>
          <p className="leading-relaxed">
            Add it from the browser you already have. There is no store listing. After the app has opened once online,
            it can open again offline. Stops are saved on the phone either way.
          </p>
          <h3 className="text-xl">iPhone</h3>
          <ol className="grid list-decimal gap-2 pl-5 leading-relaxed">
            <li>Open the field app in Safari. Add to Home Screen is a Safari step.</li>
            <li>Tap the Share button, the square with the arrow.</li>
            <li>Scroll the share sheet and tap Add to Home Screen.</li>
            <li>Tap Add. The D2D Field icon then opens the app from your Home Screen.</li>
          </ol>
          <h3 className="text-xl">Android</h3>
          <ol className="grid list-decimal gap-2 pl-5 leading-relaxed">
            <li>Open the field app in Chrome.</li>
            <li>Tap the three-dot menu.</li>
            <li>Tap Install app, or Add to Home screen.</li>
            <li>Confirm. Chrome can also show its own install banner for this app.</li>
          </ol>
          <p>
            <Link className="font-medium text-clay hover:underline" href="/app/field">
              Open the app
            </Link>
          </p>
        </section>

        <section className="grid max-w-3xl gap-3">
          <h2 className="text-2xl">Where the stops stay</h2>
          <p className="leading-relaxed">{onDeviceNote}</p>
          <p className="leading-relaxed">
            Settings on the app can export a CSV or clear the phone. There is no shared login and no manager view in
            this version. The recruiting form on the desk is separate.
          </p>
          <ul className="grid gap-2">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      </article>
    </PageShell>
  )
}
