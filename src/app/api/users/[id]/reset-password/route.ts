import { NextResponse } from "next/server";
import { canManageUsers, hashPassword, isStrongEnoughPassword, requireSession } from "@/lib/auth";
import { appendAuditEvent, writeStore } from "@/lib/store";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await context.params;

  if (!canManageUsers(session.role)) {
    return NextResponse.json({ error: "Only Super Admin and Admin can reset passwords" }, { status: 403 });
  }

  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (!isStrongEnoughPassword(password)) {
    return NextResponse.redirect(new URL("/settings/users?error=password", request.url), 303);
  }

  let updatedEmail = "";

  await writeStore((store) => ({
    ...store,
    users: store.users.map((user) => {
      if (user.id !== id || user.tenantId !== session.tenantId) {
        return user;
      }

      updatedEmail = user.email;
      return { ...user, passwordHash: hashPassword(password) };
    }),
  }));

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Reset password for ${updatedEmail || id}`,
    target: updatedEmail || id,
  });

  return NextResponse.redirect(new URL("/settings/users", request.url), 303);
}
