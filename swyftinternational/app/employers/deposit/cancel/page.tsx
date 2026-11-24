import Link from "next/link";
import { MarketingShell } from "@/components/site-chrome";

export const metadata = { title: "Checkout canceled", robots: { index: false, follow: false } };

export default function CancelPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-5xl">Checkout canceled</h1>
        <p className="mt-4 text-sm leading-7">No payment was taken. The search is still on the desk.</p>
        <Link href="/employers/start" className="mt-6 inline-flex text-glacier">Start over</Link>
      </section>
    </MarketingShell>
  );
}
