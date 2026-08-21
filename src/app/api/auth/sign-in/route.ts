import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionValue, getDemoSession, sessionCookieName } from "@/lib/auth";
import { appendAuditEvent } from "@/lib/store";

export async function POST(request: Request) {
  const form = await request.formData();
  const next = String(form.get("next") ?? "/dashboard");
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const session = getDemoSession();
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
    action: "Signed in to demo console",
    target: "AgentShield",
  });

  return NextResponse.redirect(new URL(safeNext, request.url), 303);
}
