import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandShell } from "@/components/brand-shell";
import { brandStaticParams, getBrandConfig } from "@/lib/brands";

export const dynamicParams = false;

export function generateStaticParams() {
  return brandStaticParams();
}

export async function generateMetadata(props: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand: id } = await props.params;
  const brand = getBrandConfig(id);
  if (!brand) return {};
  return {
    title: {
      default: `${brand.name} recruiting desk preview`,
      template: `%s · ${brand.name}`,
    },
    description: brand.intro,
    keywords: brand.keywords,
    alternates: { canonical: `https://${brand.domain}/` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title: `${brand.name} recruiting desk`,
      description: brand.intro,
      url: `https://${brand.domain}/`,
      siteName: brand.name,
    },
  };
}

export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ brand: string }>;
}) {
  const { brand: id } = await params;
  const brand = getBrandConfig(id);
  if (!brand) notFound();
  return <BrandShell brand={brand}>{children}</BrandShell>;
}
