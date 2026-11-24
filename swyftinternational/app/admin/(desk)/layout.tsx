import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { DeskNav } from "@/components/desk-nav";
import { getSession } from "@/lib/auth";
import { countOpenRequests } from "@/lib/queries";

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="p-6 text-sm">Opening the desk…</p>}>
      <Guard>{children}</Guard>
    </Suspense>
  );
}

async function Guard({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");
  return (
    <div>
      <DeskNav openRequests={countOpenRequests()} />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
