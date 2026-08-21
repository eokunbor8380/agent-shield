import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionValue, sessionCookieName, verifyPassword } from "@/lib/auth";
import { appendAuditEvent, readStore } from "@/lib/store";

export async function POST(request: Request) {
  const form = await request.formData();
  const next = String(form.get("next") ?? "/dashboard");
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const store = await readStore();
  const user = store.users.find((item) => item.email.toLowerCase() === email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.redirect(new URL(`/sign-in?error=invalid&next=${encodeURIComponent(safeNext)}`, request.url), 303);
  }

  const session = {
    userId: user.id,
    name: user.name,
    email: user.email,
    tenantId: user.tenantId,
    role: user.role,
  };
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, createSessionValue(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: "Signed in with credentials",
    target: "AgentShield",
  });

  return NextResponse.redirect(new URL(safeNext, request.url), 303);
}
