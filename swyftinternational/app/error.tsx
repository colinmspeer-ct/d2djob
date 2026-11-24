"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-24">
      <h1 className="font-heading text-4xl">The preview hit an error.</h1>
      <p className="mt-3 text-sm leading-6">{error.message}</p>
      <button className="mt-6 rounded-full bg-dandelion px-5 py-3 text-sm font-semibold" type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
