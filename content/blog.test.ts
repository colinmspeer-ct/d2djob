import assert from "node:assert/strict"
import test from "node:test"
import { blogMeta, blogPosts, placeholderPost } from "./blog.ts"
import { fullTitle } from "../lib/seo.ts"

function checkMeta(title: string, description: string, label: string) {
  assert.ok(fullTitle(title).length < 60, `${label} title ${fullTitle(title).length}`)
  assert.ok(description.length < 155, `${label} description ${description.length}`)
  assert.ok(description.length >= 70, `${label} description short ${description.length}`)
}

test("blog index and posts stay inside meta limits", () => {
  checkMeta(blogMeta.title, blogMeta.description, "blog index")
  const slugs = new Set<string>()
  for (const post of [placeholderPost, ...blogPosts]) {
    checkMeta(post.title, post.description, post.slug)
    assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/, post.slug)
    assert.match(post.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, post.slug)
    assert.ok(!slugs.has(post.slug), `duplicate slug ${post.slug}`)
    slugs.add(post.slug)
    assert.ok(post.relatedPages.length >= 1, `${post.slug} needs a related service page`)
    for (const page of post.relatedPages) assert.ok(page.href.startsWith("/"), post.slug)
  }
})

test("the placeholder never publishes", () => {
  assert.equal(placeholderPost.draft, true)
  assert.equal(placeholderPost.noindex, true)
  assert.ok(!blogPosts.includes(placeholderPost))
})
