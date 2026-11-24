import { notFound } from "next/navigation";
import { getBrandConfig } from "@/lib/brands";

export const metadata = { title: "Privacy" };

export default async function BrandPrivacyPage(props: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await props.params;
  const brand = getBrandConfig(id);
  if (!brand) notFound();
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-5xl">Privacy policy ({brand.name} preview)</h1>
      <p className="mt-5 text-sm leading-7 text-ink/75">
        This branch preview does not process live customer deployments or production traffic. Any sample profiles are fictional placeholders. No real
        Stripe live keys are used in this preview.
      </p>
      <h2 className="mt-8 text-3xl">What this preview stores</h2>
      <ul className="mt-4 grid gap-2 text-sm leading-7 text-ink/75">
        <li>Demo intake fields entered during local preview testing.</li>
        <li>Brand configuration values used to render pages and app views.</li>
        <li>Local development cookies used for signed desk and library login previews.</li>
      </ul>
      <h2 className="mt-8 text-3xl">What it does not do</h2>
      <ul className="mt-4 grid gap-2 text-sm leading-7 text-ink/75">
        <li>No DNS changes or production deployment.</li>
        <li>No live-payment processing.</li>
        <li>No intentional use of real candidate personal data in seeded examples.</li>
      </ul>
    </section>
  );
}
