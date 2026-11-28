import { blogMeta, blogPosts, placeholderPost, type BlogPost } from "@/content/blog"
import { siteName, siteUrl } from "@/lib/site"

export function publishedPosts(): BlogPost[] {
  return blogPosts
    .filter((post) => !post.draft && !post.noindex)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

/** Pages Next must generate. Falls back to the noindex placeholder so the route can build with zero posts. */
export function buildablePosts(): BlogPost[] {
  const posts = publishedPosts()
  return posts.length > 0 ? posts : [placeholderPost]
}

export function findPost(slug: string): BlogPost | undefined {
  return buildablePosts().find((post) => post.slug === slug)
}

export function postExcerpt(post: BlogPost) {
  return post.excerpt ?? post.description
}

export function lastModified(post: BlogPost) {
  return post.updated ?? post.date
}

function organization() {
  const site = siteUrl()
  return { "@type": "Organization", name: siteName, url: `${site}/` }
}

export function blogIndexJsonLd() {
  const site = siteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: blogMeta.h1,
    description: blogMeta.description,
    url: `${site}${blogMeta.path}/`,
    publisher: organization(),
    blogPost: publishedPosts().map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${site}/blog/${post.slug}/`,
      datePublished: post.date,
    })),
  }
}

export function articleJsonLd(post: BlogPost) {
  const site = siteUrl()
  const url = `${site}/blog/${post.slug}/`
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    datePublished: post.date,
    dateModified: lastModified(post),
    author: post.author ? { "@type": "Person", name: post.author } : organization(),
    publisher: organization(),
  }
}
