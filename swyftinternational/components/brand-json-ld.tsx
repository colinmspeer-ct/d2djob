import type { BrandConfig } from "@/lib/brands";

export function BrandJsonLd({ brand }: { brand: BrandConfig }) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    parentOrganization: {
      "@type": "Organization",
      name: brand.parentBrand,
    },
    url: `https://${brand.domain}`,
    description: brand.audience,
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${brand.name} recruiting desk`,
    provider: {
      "@type": "Organization",
      name: brand.name,
      url: `https://${brand.domain}`,
    },
    serviceType: brand.serviceSummary,
    areaServed: "US",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: brand.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
