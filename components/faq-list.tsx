import type { Faq } from "@/lib/seo"

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <section>
      <h2 className="text-2xl">Questions from the route</h2>
      <div className="mt-4 grid gap-5">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-lg leading-snug">{faq.question}</h3>
            <p className="mt-2 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
