import { NextResponse } from "next/server";
import { canManageUsers, requireSession } from "@/lib/auth";
import { appendAuditEvent, writeStore } from "@/lib/store";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await context.params;

  if (!canManageUsers(session.role)) {
    return NextResponse.json({ error: "Only Super Admin and Admin can assign roles" }, { status: 403 });
  }

  const form = await request.formData();
  const role = String(form.get("role") ?? "").trim();
  let updatedEmail = "";
  let invalidRole = false;

  await writeStore((store) => {
    invalidRole = !store.roles.some((item) => item.tenantId === session.tenantId && item.name === role);

    if (invalidRole) {
      return store;
    }

    return {
      ...store,
      users: store.users.map((user) => {
        if (user.id !== id || user.tenantId !== session.tenantId) {
          return user;
        }

        updatedEmail = user.email;
        return { ...user, role };
      }),
    };
  });

  if (invalidRole) {
    return NextResponse.redirect(new URL("/settings/users?error=role", request.url), 303);
  }

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Assigned ${updatedEmail || id} to role ${role}`,
    target: updatedEmail || id,
  });

  return NextResponse.redirect(new URL("/settings/users", request.url), 303);
}
