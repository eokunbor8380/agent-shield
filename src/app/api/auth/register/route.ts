import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionValue, hashPassword, isStrongEnoughPassword, sessionCookieName, shouldUseSecureCookies } from "@/lib/auth";
import { appendAuditEvent, buildSystemRoles, writeStore } from "@/lib/store";

type RegisteredUser = { id: string; tenantId: string; name: string; email: string; role: "Super Admin" };

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const company = String(form.get("company") ?? "AgentShield Workspace").trim();

  if (!name || !email || !isStrongEnoughPassword(password)) {
    return NextResponse.redirect(new URL("/register?error=invalid", request.url), 303);
  }

  const tenantId = `tenant-${Date.now()}`;
  const userId = `usr-${Date.now()}`;
  const createdUser: RegisteredUser = { id: userId, tenantId, name, email, role: "Super Admin" };
  let alreadyExists = false;

  await writeStore((store) => {
    alreadyExists = store.users.some((user) => user.email.toLowerCase() === email);

    if (alreadyExists) {
      return store;
    }

    return {
      ...store,
      tenants: [
        ...store.tenants,
        { id: tenantId, name: company || `${name}'s Workspace`, plan: "Phase 3 Free SaaS Foundation", region: "us-east", status: "Active", createdAt: new Date().toISOString() },
      ],
      roles: [...store.roles, ...buildSystemRoles(tenantId)],
      users: [
        ...store.users,
        {
          ...createdUser,
          platformRole: "Member",
          passwordHash: hashPassword(password),
          createdAt: new Date().toISOString(),
        },
      ],
    };
  });

  if (alreadyExists) {
    return NextResponse.redirect(new URL("/register?error=exists", request.url), 303);
  }

  const session = {
    userId: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    tenantId: createdUser.tenantId,
    role: createdUser.role,
    platformRole: "Member" as const,
  };
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, createSessionValue(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: "Registered new workspace owner",
    target: session.tenantId,
  });

  return NextResponse.redirect(new URL("/dashboard", request.url), 303);
}
