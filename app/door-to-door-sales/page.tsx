import type { Metadata } from "next";
import Link from "next/link";
import { industries } from "@/data/industries";
import { PageShell } from "@/components/page-shell";
import { TodoCallout } from "@/components/todo-callout";

export const metadata: Metadata = {
  title: "Door to Door Sales",
  description:
    "A plain-language guide to door to door sales: the work, the pay, and the industries that hire. The long article is still being written.",
  alternates: { canonical: "/door-to-door-sales" },
};

const sections = [
  {
    title: "What the day actually is",
    body: "TODO: Describe a route, a script, and what “a number” means. Aim this section at the head term door to door sales.",
  },
  {
    title: "How the money is built",
    body: "TODO: Base, commission, hourly plus commission, and pure commission. Use real ranges only when Colin signs off on them.",
  },
  {
    title: "Industries that hire this way",
    body: "TODO: Short sections for fiber, pest control, roofing, windows and doors, window cleaning, exterior cleaning, and exteriors.",
  },
  {
    title: "For people who want the work",
    body: "TODO: How an interview with Alex turns into a profile, and what stays private.",
  },
  {
    title: "For people who hire",
    body: "TODO: Point to the talent desk and the jobs hub without repeating the employers page word for word.",
  },
];

export default function GuidePage() {
  return (
    <PageShell>
      <article className="mx-auto grid max-w-3xl gap-6 px-4 py-10">
        <p className="text-sm font-medium tracking-wide text-clay">Guide</p>
        <h1 className="text-4xl leading-[1.05] sm:text-5xl">Door to door sales</h1>
        <TodoCallout>
          <p>
            This is the pillar page. Replace every section below with the finished article. The outline is here so the
            URL, title, and internal links exist. It is not the article.
          </p>
        </TodoCallout>
        {sections.map((section) => (
          <section key={section.title} className="grid gap-2">
            <h2 className="text-2xl">{section.title}</h2>
            <p className="leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
        <section>
          <h2 className="text-2xl">Where to go next</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link className="underline-offset-4 hover:underline" href="/jobs">
                Door to door sales jobs
              </Link>
            </li>
            {industries.map((industry) => (
              <li key={industry.slug}>
                <Link className="underline-offset-4 hover:underline" href={`/jobs/${industry.slug}`}>
                  {industry.name} sales jobs
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </PageShell>
  );
}
