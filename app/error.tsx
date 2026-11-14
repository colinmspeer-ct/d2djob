"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <h1 className="text-4xl">This page did not load.</h1>
      <p className="mt-3 text-muted-foreground">Try it again. If it keeps failing, the desk log will have the reason.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}
