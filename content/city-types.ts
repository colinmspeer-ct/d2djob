import type { Faq } from "@/lib/seo"

export type CityCopy = {
  h1: string
  metaTitle: string
  metaDescription: string
  paragraphs: string[]
  faqs: Faq[]
  nearby: string[]
}
