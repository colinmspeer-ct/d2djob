import Link from "next/link";
import { MarketingShell } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-5xl">That page is not in the preview.</h1>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-dandelion px-5 py-3 text-sm font-semibold">
          Back to the homepage
        </Link>
      </section>
    </MarketingShell>
  );
}
