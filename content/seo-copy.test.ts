import assert from "node:assert/strict"
import test from "node:test"
import { fiberCities } from "./fiber-cities.ts"
import { tradePages } from "./trade-pages.ts"
import { industryArticles } from "./industry-pages.ts"
import { pillarFaqs, pillarMeta, pillarSections } from "./pillar.ts"
import { fullTitle, wordCount } from "../lib/seo.ts"
import { fiberMarkets } from "../data/locations.ts"

function checkMeta(title: string, description: string, label: string) {
  assert.ok(fullTitle(title).length < 60, `${label} title ${fullTitle(title).length}: ${fullTitle(title)}`)
  assert.ok(description.length < 155, `${label} description ${description.length}`)
  assert.ok(description.length >= 70, `${label} description short ${description.length}`)
}

test("pillar and industry SEO copy stays inside meta limits", () => {
  checkMeta(pillarMeta.title, pillarMeta.description, "pillar")
  assert.ok(pillarFaqs.length >= 3)
  const pillarWords = wordCount([
    pillarMeta.title,
    ...pillarSections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...pillarFaqs.flatMap((faq) => [faq.question, faq.answer]),
  ])
  assert.ok(pillarWords > 600, `pillar words ${pillarWords}`)

  for (const [slug, article] of Object.entries(industryArticles)) {
    checkMeta(article.metaTitle, article.metaDescription, slug)
    assert.equal(article.h1.length > 0, true)
    assert.ok(article.faqs.length >= 3, slug)
    const words = wordCount([
      article.h1,
      article.lede,
      ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
      ...article.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ])
    assert.ok(words > 350, `${slug} words ${words}`)
  }
})

test("every official fiber market has unique city copy", () => {
  const slugs = fiberMarkets().map((location) => location.slug)
  assert.deepEqual(Object.keys(fiberCities).sort(), [...slugs].sort())
  const bodies = new Set<string>()
  for (const [slug, copy] of Object.entries(fiberCities)) {
    checkMeta(copy.metaTitle, copy.metaDescription, slug)
    assert.match(copy.h1, /Fiber Internet Sales Jobs in /)
    assert.ok(copy.nearby.length >= 3 && copy.nearby.length <= 5, slug)
    assert.ok(!copy.nearby.includes(slug))
    const text = copy.paragraphs.join(" ")
    assert.ok(!bodies.has(text), `duplicate body ${slug}`)
    bodies.add(text)
    assert.equal(text.includes("TODO"), false)
    const words = wordCount([...copy.paragraphs, ...copy.faqs.flatMap((faq) => [faq.question, faq.answer])])
    assert.ok(words > 180, `${slug} words ${words}`)
  }
})

test("finished trade city pages have unique copy and valid meta", () => {
  const bodies = new Set<string>()
  for (const [key, copy] of Object.entries(tradePages)) {
    checkMeta(copy.metaTitle, copy.metaDescription, key)
    assert.equal(copy.paragraphs.join(" ").includes("TODO"), false, key)
    const text = copy.paragraphs.join(" ")
    assert.ok(!bodies.has(text), `duplicate ${key}`)
    bodies.add(text)
    assert.ok(copy.faqs.length >= 2, key)
    assert.ok(copy.nearby.length >= 3, key)
  }
})
