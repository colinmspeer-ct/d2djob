import Link from "next/link"
import { FieldApp } from "@/components/field-app/field-app"

export default function FieldPage() {
  return (
    <>
      <noscript>
        <p className="mx-auto max-w-md px-4 py-6 leading-relaxed">
          D2D Field saves knocks in this browser and needs JavaScript to do that. Read what the app does on the{" "}
          <Link href="/app">field app page</Link>.
        </p>
      </noscript>
      <FieldApp />
    </>
  )
}
