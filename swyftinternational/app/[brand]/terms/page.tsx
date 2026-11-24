import { notFound } from "next/navigation";
import { getBrandConfig } from "@/lib/brands";

export const metadata = { title: "Terms" };

export default async function BrandTermsPage(props: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await props.params;
  const brand = getBrandConfig(id);
  if (!brand) notFound();
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-5xl">Terms of use ({brand.name} preview)</h1>
      <p className="mt-5 text-sm leading-7 text-ink/75">
        These terms apply to this review-only preview environment. Production launch terms can be finalized before deployment.
      </p>

      <h2 className="mt-8 text-3xl">Service scope</h2>
      <p className="mt-3 text-sm leading-7 text-ink/75">{brand.serviceSummary}</p>

      <h2 className="mt-8 text-3xl">Preview restrictions</h2>
      <ul className="mt-4 grid gap-2 text-sm leading-7 text-ink/75">
        <li>This branch is not a live production site and is not represented as such.</li>
        <li>Any references to candidate records marked sample are fictional placeholders.</li>
        <li>Payment processing, when demonstrated, is limited to Stripe test mode.</li>
      </ul>

      <h2 className="mt-8 text-3xl">Placement terms defaults</h2>
      <p className="mt-3 text-sm leading-7 text-ink/75">
        Default fee settings in this preview are {brand.pricingDefaults.successFeePercent}% success fee, ${brand.pricingDefaults.depositCents / 100}{" "}
        new-search deposit, and {brand.pricingDefaults.replacementDays} days for replacement coverage. These values are editable.
      </p>
    </section>
  );
}
