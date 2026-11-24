"use client";

import { useActionState } from "react";

export function LoginForm({
  action,
  title,
  lede,
}: {
  action: (prev: { error: string } | null, formData: FormData) => Promise<{ error: string } | null>;
  title: string;
  lede: string;
}) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction} className="grid gap-4 rounded-[1.6rem] bg-foam p-5 ring-1 ring-ink/10">
      <div>
        <h1 className="text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">{lede}</p>
      </div>
      {state?.error ? <p className="rounded-xl bg-[#fde8e6] px-3 py-2 text-sm">{state.error}</p> : null}
      <label className="grid gap-1 text-sm">
        Email
        <input className="input" name="email" type="email" autoComplete="username" required />
      </label>
      <label className="grid gap-1 text-sm">
        Password
        <input className="input" name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="h-11 rounded-full bg-dandelion px-5 text-sm font-semibold" type="submit">
        Continue
      </button>
    </form>
  );
}
