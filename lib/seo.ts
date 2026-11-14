import type { Metadata } from "next"
import { siteUrl } from "./site"

export type Faq = { question: string; answer: string }
export type Crumb = { name: string; path: string }

const SUFFIX = " · D2D Job"

export function fullTitle(title: string) {
  return `${title}${SUFFIX}`
}

export function clipDescription(text: string, max = 154) {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  const sliced = clean.slice(0, max)
  const space = sliced.lastIndexOf(" ")
  return (space > 90 ? sliced.slice(0, space) : sliced).trim()
}

export function assertSeo(title: string, description: string) {
  const rendered = fullTitle(title)
  if (rendered.length >= 60) {
    throw new Error(`Meta title is ${rendered.length} characters: ${rendered}`)
  }
  if (description.length >= 155) {
    throw new Error(`Meta description is ${description.length} characters: ${description}`)
  }
  if (description.length < 70) {
    throw new Error(`Meta description is only ${description.length} characters: ${description}`)
  }
}

export function seoMetadata(title: string, description: string, path: string): Metadata {
  assertSeo(title, description)
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      siteName: "D2D Job",
    },
  }
}

export function breadcrumbJsonLd(items: Crumb[]) {
  const site = siteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site}${item.path}`,
    })),
  }
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
}

export function wordCount(parts: string[]) {
  return parts
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}
