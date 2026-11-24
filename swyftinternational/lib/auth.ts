import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { findStaff, findStaffById } from "./queries";
import { hashPassword, verifyPassword } from "./passwords";
import type { StaffUser } from "./types";

const COOKIE = "si_session";

export function sessionConfigured() {
  return (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 16 && Boolean(process.env.ADMIN_PASSWORD);
}

function sign(payload: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(payload).digest("base64url");
}

let dummyHash: string | null = null;
function dummy() {
  dummyHash ??= hashPassword("not-a-real-password");
  return dummyHash;
}

export type Session = { userId: string; role: "admin" | "library"; email: string };

export async function getSession(): Promise<Session | null> {
  if (!sessionConfigured()) return null;
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 5 || parts[0] !== "v1") return null;
  const [version, role, userId, exp, signature] = parts;
  if (!version || !role || !userId || !exp || !signature) return null;
  const payload = `${version}.${role}.${userId}.${exp}`;
  const expected = sign(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return null;
  if (role !== "admin" && role !== "library") return null;
  const user = findStaffById(userId);
  if (!user || user.role !== role) return null;
  return { userId: user.id, role: user.role, email: user.email };
}

export async function setSessionCookie(user: StaffUser) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const payload = `v1.${user.role}.${user.id}.${exp}`;
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https"),
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function authenticate(email: string, password: string, gate: "admin" | "library") {
  const user = findStaff(email);
  const allowed = user && (gate === "admin" ? user.role === "admin" : user.role === "admin" || user.role === "library");
  if (!user || !allowed || !verifyPassword(password, user.passwordHash)) {
    verifyPassword(password, user?.passwordHash ?? dummy());
    return null;
  }
  return user;
}
