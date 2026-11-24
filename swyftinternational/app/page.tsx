import Link from "next/link";
import { connection } from "next/server";
import { CandidateCard } from "@/components/candidate-card";
import { PricingPanel } from "@/components/pricing-panel";
import { MarketingShell } from "@/components/site-chrome";
import { getShortlistByToken, shortlistMembers } from "@/lib/queries";
import { sampleShortlistToken } from "@/lib/paths";
import { formatUsd, readPlacementTerms } from "@/lib/terms";

export default async function HomePage() {
  await connection();
  const terms = readPlacementTerms();
  const shortlist = getShortlistByToken(sampleShortlistToken());
  const people = shortlist?.isPublished ? shortlistMembers(shortlist.id, true).slice(0, 3) : [];
  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:py-24">
        <p className="w-fit rounded-full bg-dandelion px-3 py-1 text-xs font-semibold tracking-[0.14em] text-ink uppercase">
          A branch of Swyft Marketing
        </p>
        <div className="max-w-3xl">
          <h1 className="text-5xl leading-[0.95] md:text-7xl">Hire from a shortlist, not a stack of resumes.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/80">
            Swyft International places talent in Egypt and Belize with US companies. You pay the hire directly. We earn a success fee when they start. If the database already has a fit, you do not open a new search.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/employers/start" className="rounded-full bg-dandelion px-5 py-3 text-sm font-semibold">
            Start a search
          </Link>
          <Link href="/s/harbor-demo" className="rounded-full px-5 py-3 text-sm font-semibold ring-1 ring-ink/20">
            See a sample shortlist
          </Link>
        </div>
      </section>

      <section id="method" className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-4xl">How a search actually goes</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ["01", "Tell us the seat", "Role, first-year salary, and the hours you need covered."],
            ["02", "We check the database", "A fit goes on a shortlist. That path has no search deposit."],
            ["03", "Or we open a search", `A ${formatUsd(terms.depositCents)} deposit starts a new search and is credited toward the fee.`],
            ["04", "You hire and pay them", `We invoice ${terms.successFeePercent}% of year-one salary. ${terms.replacementGuaranteeDays} days to replace them free.`],
          ].map(([step, title, body]) => (
            <li key={step} className="rounded-[1.4rem] bg-foam p-5 ring-1 ring-ink/10">
              <p className="font-heading text-sm text-dandelion">{step}</p>
              <h3 className="mt-3 text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/75">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl">What you pay</h2>
        <p className="mt-3 max-w-2xl text-ink/75">
          The salary never runs through us. The fee is for the placement. The figures below are the current settings.
        </p>
        <div className="mt-8">
          <PricingPanel terms={terms} salaryDollars={60000} />
        </div>
      </section>

      <section id="database" className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-dandelion uppercase">We already have a database</p>
            <h2 className="mt-3 text-4xl md:text-5xl">If someone fits, that is the placement.</h2>
            <p className="mt-4 max-w-xl text-paper/80 leading-7">
              The cards below are fictional, so you can see the packet. The live desk holds real profiles. The deposit is only for a search we have to start from scratch, and it comes off the fee.
            </p>
          </div>
          <div className="rounded-[1.6rem] bg-paper p-6 text-ink">
            <p className="font-heading text-5xl">{terms.successFeePercent}%</p>
            <p className="mt-2 text-sm leading-6">Success fee. Deposit credited. {terms.replacementGuaranteeDays}-day replacement search included.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-4xl">Sample shortlist</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
              Invented profiles from Egypt and Belize. Placeholder avatars, not photographs. Intro videos are empty frames until a real file is attached on the desk.
            </p>
          </div>
          <Link href="/s/harbor-demo" className="text-sm font-semibold text-glacier">
            Open the full packet
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
            <CandidateCard key={person.id} candidate={person} href={`/candidates/${person.slug}`} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-4xl">Some seats are easy. Some we will not take.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.6rem] bg-[#e7f6ee] p-6">
            <p className="text-sm font-semibold tracking-[0.14em] text-[#1f7a4d] uppercase">Green</p>
            <h3 className="mt-2 text-2xl">In the database most weeks</h3>
            <ul className="mt-4 grid gap-2 text-sm leading-6">
              <li>Customer support and success</li>
              <li>Appointment setting</li>
              <li>Bookkeeping and admin</li>
              <li>Virtual assistants</li>
            </ul>
          </article>
          <article className="rounded-[1.6rem] bg-[#fff4d4] p-6">
            <p className="text-sm font-semibold tracking-[0.14em] text-[#8a6200] uppercase">Yellow</p>
            <h3 className="mt-2 text-2xl">A search, not a same-week list</h3>
            <ul className="mt-4 grid gap-2 text-sm leading-6">
              <li>SDRs who can run a real discovery</li>
              <li>Recruiting coordinators</li>
              <li>Executive assistants with a complex calendar</li>
              <li>Junior marketers who can write</li>
            </ul>
          </article>
          <article className="rounded-[1.6rem] bg-[#fde8e6] p-6">
            <p className="text-sm font-semibold tracking-[0.14em] text-[#9f2b22] uppercase">Red</p>
            <h3 className="mt-2 text-2xl">We will tell you no</h3>
            <ul className="mt-4 grid gap-2 text-sm leading-6">
              <li>Work that needs a US license to sign</li>
              <li>In-person field sales</li>
              <li>Roles that require US work authorization</li>
              <li>Senior engineers on a rare stack and a deadline</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-[2rem] bg-dandelion px-6 py-10 md:px-10">
          <h2 className="max-w-xl text-4xl">If the seat is green or yellow, send it over.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6">
            Tell us the role and the salary. We will say whether the database can cover it or whether the deposit starts a search.
          </p>
          <Link href="/employers/start" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper">
            Start a search
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
