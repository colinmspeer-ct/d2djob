import { locationsByGroup } from "@/data/locations"

export const controlClass =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function LocationSelect({
  name = "location",
  id,
  defaultValue = "",
  allowEmpty = false,
  required = false,
}: {
  name?: string
  id?: string
  defaultValue?: string
  allowEmpty?: boolean
  required?: boolean
}) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      required={required}
      className={controlClass}
    >
      {allowEmpty ? <option value="">Any location</option> : <option value="">Select a city</option>}
      {locationsByGroup().map(([group, items]) => (
        <optgroup key={group} label={group}>
          {items.map((location) => (
            <option key={location.slug} value={location.slug}>
              {location.state === "PA" || location.state === "NJ"
                ? `${location.city}, ${location.state} — ${location.county}`
                : `${location.city}, ${location.state}`}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}
