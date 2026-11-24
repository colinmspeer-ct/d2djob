import { notFound } from "next/navigation";
import { PricingPanel } from "@/components/pricing-panel";
import { getBrandConfig } from "@/lib/brands";

export const metadata = { title: "Pricing" };

export default async function BrandPricingPage(props: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await props.params;
  const brand = getBrandConfig(id);
  if (!brand) notFound();
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-sm font-semibold tracking-[0.14em] text-ink/50 uppercase">Pricing model · {brand.name}</p>
      <h1 className="mt-2 max-w-3xl text-5xl">Placement fee settings for {brand.domain}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/75">
        Defaults are {brand.pricingDefaults.successFeePercent}% success fee, ${brand.pricingDefaults.depositCents / 100} search deposit, and{" "}
        {brand.pricingDefaults.replacementDays}-day replacement coverage. Settings are editable per brand in the shared desk configuration.
      </p>
      <div className="mt-10">
        <PricingPanel
          basePath={`/${brand.id}`}
          salaryDollars={60000}
          terms={{
            successFeePercent: brand.pricingDefaults.successFeePercent,
            depositCents: brand.pricingDefaults.depositCents,
            replacementGuaranteeDays: brand.pricingDefaults.replacementDays,
          }}
        />
      </div>
    </section>
  );
}
