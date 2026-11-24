import { redirect } from "next/navigation";
import { connection } from "next/server";
import { LoginForm } from "@/components/login-form";
import { loginLibrary } from "@/lib/actions/auth";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Library login", robots: { index: false, follow: false } };

export default async function LibraryLoginPage() {
  await connection();
  const session = await getSession();
  if (session?.role === "admin" || session?.role === "library") redirect("/library");
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <LoginForm
        action={loginLibrary}
        title="Training library"
        lede="For placed hires and recruiters. This area is not indexed."
      />
    </section>
  );
}
