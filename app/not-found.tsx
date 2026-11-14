import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 py-20">
        <h1 className="text-4xl">That page is not on the desk.</h1>
        <p className="mt-3 text-muted-foreground">
          The profile may be unpublished, or the city is not in the location list.
        </p>
        <p className="mt-6">
          <Link href="/" className="text-sm font-medium text-clay">
            Back to talent
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
