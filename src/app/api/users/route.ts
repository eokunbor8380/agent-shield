import { NextResponse } from "next/server";
import { canManageUsers, hashPassword, isStrongEnoughPassword, requireSession } from "@/lib/auth";
import { appendAuditEvent, writeStore } from "@/lib/store";

export async function GET() {
  const session = await requireSession();
  const store = await writeStore((current) => current);

  return NextResponse.json({
    data: store.users
      .filter((user) => user.tenantId === session.tenantId)
      .map((user) => ({
        id: user.id,
        tenantId: user.tenantId,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
  });
}

export async function POST(request: Request) {
  const session = await requireSession();

  if (!canManageUsers(session.role)) {
    return NextResponse.json({ error: "Only Super Admin and Admin can create users" }, { status: 403 });
  }

  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const role = String(form.get("role") ?? "Read-Only").trim();

  if (!name || !email || !role || !isStrongEnoughPassword(password)) {
    return NextResponse.redirect(new URL("/settings/users?error=invalid", request.url), 303);
  }

  let exists = false;
  let invalidRole = false;

  await writeStore((store) => {
    exists = store.users.some((user) => user.email.toLowerCase() === email);
    invalidRole = !store.roles.some((item) => item.tenantId === session.tenantId && item.name === role);

    if (exists || invalidRole) {
      return store;
    }

    return {
      ...store,
      users: [
        ...store.users,
        {
          id: `usr-${Date.now()}`,
          tenantId: session.tenantId,
          name,
          email,
          role,
          passwordHash: hashPassword(password),
          createdAt: new Date().toISOString(),
        },
      ],
    };
  });

  if (exists) {
    return NextResponse.redirect(new URL("/settings/users?error=exists", request.url), 303);
  }

  if (invalidRole) {
    return NextResponse.redirect(new URL("/settings/users?error=role", request.url), 303);
  }

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Created user ${email} with role ${role}`,
    target: email,
  });

  return NextResponse.redirect(new URL("/settings/users", request.url), 303);
}
