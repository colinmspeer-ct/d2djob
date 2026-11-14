import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { TodoCallout } from "@/components/todo-callout";

export const metadata: Metadata = {
  title: "Hire door-to-door reps",
  description:
    "Employers browse anonymized door-to-door sales reps, then send an invite or request a meeting. Contact details stay with the desk.",
  alternates: { canonical: "/employers" },
};

export default function EmployersPage() {
  return (
    <PageShell>
      <article className="mx-auto grid max-w-3xl gap-6 px-4 py-10">
        <p className="text-sm font-medium tracking-wide text-clay">For owners and sales managers</p>
        <h1 className="text-4xl leading-[1.05] sm:text-5xl">Hire reps who already sat for an interview</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          The desk is the candidate marketplace. You browse an anonymized profile, then send an invite or ask for a
          meeting. Alex keeps the phone number until there is a reason to make an introduction.
        </p>
        <p>
          <Link href="/" className="inline-flex h-10 items-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground">
            Browse the talent desk
          </Link>
        </p>
        <TodoCallout>
          <p>
            Full employer pitch still to write: who Swyft Marketing places, which industries, what an introduction
            costs, and how fast a meeting gets set. Do not treat this page as finished sales copy.
          </p>
        </TodoCallout>
        <section className="grid gap-3">
          <h2 className="text-2xl">What you can see</h2>
          <p className="leading-relaxed">
            TODO: Spell out the public fields (background, years, industries, city, pay preference, travel) and the
            private fields that never leave the desk.
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="text-2xl">What happens after you write</h2>
          <p className="leading-relaxed">
            TODO: Walk through an invite versus a meeting request, who gets the email, and how Alex replies.
          </p>
        </section>
      </article>
    </PageShell>
  );
}
