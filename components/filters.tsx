import Link from "next/link"
import { industries } from "@/data/industries"
import { Button } from "@/components/ui/button"
import { LocationSelect } from "@/components/location-select"
import { cn } from "cn"

export function ListingFilters({
  basePath,
  industry,
  location,
  travel,
  showTravel = false,
}: {
  basePath: string
  industry: string
  location: string
  travel?: boolean
  showTravel?: boolean
}) {
  function href(next: { industry?: string; location?: string; travel?: boolean }) {
    const params = new URLSearchParams()
    const nextIndustry = next.industry ?? industry
    const nextLocation = next.location ?? location
    const nextTravel = next.travel ?? Boolean(travel)
    if (nextIndustry) params.set("industry", nextIndustry)
    if (nextLocation) params.set("location", nextLocation)
    if (showTravel && nextTravel) params.set("travel", "1")
    const query = params.toString()
    return query ? `${basePath}?${query}` : basePath
  }

  const active = "bg-primary text-primary-foreground"
  const idle = "bg-card text-foreground ring-1 ring-foreground/10 hover:bg-accent"

  return (
    <div className="grid gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link href={href({ industry: "" })} className={cn("shrink-0 rounded-full px-3 py-1.5 text-sm", industry === "" ? active : idle)}>
          All industries
        </Link>
        {industries.map((item) => (
          <Link
            key={item.slug}
            href={href({ industry: item.slug === industry ? "" : item.slug })}
            className={cn("shrink-0 rounded-full px-3 py-1.5 text-sm", industry === item.slug ? active : idle)}
            aria-current={industry === item.slug ? "true" : undefined}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form action={basePath} method="get" className="flex flex-1 flex-col gap-2 sm:flex-row">
          {industry ? <input type="hidden" name="industry" value={industry} /> : null}
          {showTravel && travel ? <input type="hidden" name="travel" value="1" /> : null}
          <div className="min-w-0 flex-1">
            <LocationSelect defaultValue={location} allowEmpty />
          </div>
          <Button type="submit" variant="outline" className="h-10 px-3.5">
            Apply city
          </Button>
        </form>
        {showTravel ? (
          <Link
            href={href({ travel: !travel })}
            className={cn("inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm", travel ? active : idle)}
          >
            Will travel
          </Link>
        ) : null}
        {industry || location || travel ? (
          <Link href={basePath} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Clear
          </Link>
        ) : null}
      </div>
    </div>
  )
}
