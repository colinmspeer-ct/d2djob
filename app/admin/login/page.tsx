import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/auth";

export const instant = false;

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm">Loading…</p>}>
      <Login />
    </Suspense>
  );
}

async function Login() {
  await connection();
  if (await getSession()) redirect("/admin");
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">D2D Job</p>
      <h1 className="mt-2 text-4xl">Recruiting desk</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Alex’s side of the desk. Candidate phone numbers never render on the public profiles.
      </p>
      <div className="mt-6 rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
        <LoginForm />
      </div>
    </div>
  );
}
