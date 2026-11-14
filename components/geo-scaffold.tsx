import Link from "next/link"
import type { industries } from "@/data/industries"
import type { LocationRecord } from "@/data/locations"
import { fiberMarkets, locations } from "@/data/locations"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { JsonLd } from "@/components/json-ld"
import { TodoCallout } from "@/components/todo-callout"
import { payLine } from "@/lib/format"
import { labelFor, EMPLOYMENT_TYPES } from "@/lib/labels"
import type { PublicJob } from "@/lib/queries"
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo"

type Industry = (typeof industries)[number]

export function GeoScaffold({
  industry,
  location,
  jobs,
}: {
  industry: Industry
  location: LocationRecord
  jobs: PublicJob[]
}) {
  const siblings =
    industry.slug === "fiber"
      ? fiberMarkets().filter((item) => item.slug !== location.slug && item.state === location.state)
      : locations.filter((item) => item.filterGroup === location.filterGroup && item.slug !== location.slug)

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Door-to-Door Sales Jobs", path: "/door-to-door-sales" },
    { name: `${industry.name} sales jobs`, path: `/jobs/${industry.slug}` },
    { name: `${location.city}, ${location.state}`, path: `/${industry.geoPrefix}/${location.slug}` },
  ]

  return (
    <article className="mx-auto grid max-w-3xl gap-6 px-4 py-10">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="text-4xl leading-[1.05] sm:text-5xl">
        {industry.name} sales jobs in {location.city}, {location.state}
      </h1>
      <TodoCallout>
        <p>
          Replace this scaffold with the full {industry.name.toLowerCase()} sales guide for {location.city}, {location.stateName}
          {location.county ? ` (${location.county})` : ""}. Cover the workweek, how pay is usually built, and who hires.
        </p>
      </TodoCallout>
      {industry.slug === "fiber" ? (
        <p className="text-base leading-relaxed">
          This URL is reserved for an official AT&T Fiber market. Fiber city pages are not generated for New Jersey, the
          Philadelphia suburbs, Lancaster, Chicago, Boston, or the rest of New England.
        </p>
      ) : (
        <p className="text-base leading-relaxed">
          {location.city} can carry {industry.name.toLowerCase()} roles even when it is outside AT&T Fiber’s map. Reps who live
          here are on the talent desk under their own industries.
        </p>
      )}
      <section className="grid gap-3">
        <h2 className="text-2xl">Listings in this city</h2>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published listing for this city and industry yet.</p>
        ) : (
          <ul className="grid gap-3">
            {jobs.map((job) => (
              <li key={job.slug}>
                <Link href={`/job/${job.slug}`} className="block rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
                  <p className="font-medium">{job.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {labelFor(EMPLOYMENT_TYPES, job.employmentType)} · {payLine(job)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/?industry=${industry.slug}&location=${location.slug}`}
          className="text-sm font-medium text-clay"
        >
          Reps tagged {industry.name} in {location.city}
        </Link>
      </section>
      {siblings.length > 0 ? (
        <section>
          <h2 className="text-2xl">Nearby pages</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {siblings.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${industry.geoPrefix}/${item.slug}`}
                  className="inline-flex rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-foreground/10"
                >
                  {item.city}, {item.state}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
