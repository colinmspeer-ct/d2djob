import { redirect } from "next/navigation";
import { connection } from "next/server";
import { LoginForm } from "@/components/login-form";
import { loginAdmin } from "@/lib/actions/auth";
import { getSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  await connection();
  if ((await getSession())?.role === "admin") redirect("/admin");
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <LoginForm
        action={loginAdmin}
        title="Recruiting desk"
        lede="Same job as the D2D Job desk: candidates, profiles, roles, and meeting requests. Phone numbers stay off the public pages."
      />
    </section>
  );
}
