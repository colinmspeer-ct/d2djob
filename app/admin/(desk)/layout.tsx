import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const instant = false;

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="p-6 text-sm">Opening the desk…</p>}>
      <Guard>{children}</Guard>
    </Suspense>
  );
}

async function Guard({ children }: { children: React.ReactNode }) {
  await connection();
  if (!(await getSession())) redirect("/admin/login");
  const openRequests = await prisma.contactRequest.count({ where: { status: "new" } });
  return (
    <div className="min-h-screen bg-background">
      <AdminNav openRequests={openRequests} />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
