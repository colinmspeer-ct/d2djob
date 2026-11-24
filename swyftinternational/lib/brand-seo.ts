import type { BrandConfig } from "@/lib/brands";

export type BrandSeoPage = {
  path: string;
  title: string;
};

export function brandSeoPages(brand: BrandConfig): BrandSeoPage[] {
  return [
    { path: `/${brand.id}`, title: `${brand.name} homepage` },
    { path: `/${brand.id}/pricing`, title: "Pricing" },
    { path: `/${brand.id}/app`, title: "App view" },
    { path: `/${brand.id}/privacy`, title: "Privacy" },
    { path: `/${brand.id}/terms`, title: "Terms" },
    { path: `/${brand.id}/sitemap`, title: "HTML sitemap" },
    { path: `/${brand.id}/llms.txt`, title: "LLMs policy" },
    { path: `/${brand.id}/robots.txt`, title: "Robots policy" },
  ];
}

export function absoluteBrandUrl(brand: BrandConfig, path: string) {
  return `https://${brand.domain}${path === `/${brand.id}` ? "/" : path.replace(`/${brand.id}`, "")}`;
}
