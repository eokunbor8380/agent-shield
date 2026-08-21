import { NextResponse } from "next/server";
import { canManageRoles, requireSession } from "@/lib/auth";
import { appendAuditEvent, readStore, type Permission, requirePermissionList, writeStore } from "@/lib/store";

export async function GET() {
  const session = await requireSession();
  const store = await readStore();

  return NextResponse.json({
    data: store.roles.filter((role) => role.tenantId === session.tenantId),
  });
}

export async function POST(request: Request) {
  const session = await requireSession();

  if (!canManageRoles(session.role)) {
    return NextResponse.json({ error: "Only Super Admin and Admin can create custom roles" }, { status: 403 });
  }

  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const selectedPermissions = form.getAll("permissions").map(String).filter((permission): permission is Permission =>
    requirePermissionList().includes(permission as Permission),
  );

  if (!name || selectedPermissions.length === 0) {
    return NextResponse.redirect(new URL("/settings/roles?error=invalid", request.url), 303);
  }

  await writeStore((store) => ({
    ...store,
    roles: [
      ...store.roles,
      {
        id: `role-custom-${Date.now()}`,
        tenantId: session.tenantId,
        name,
        type: "custom",
        description: description || "Custom role",
        permissions: selectedPermissions,
        createdAt: new Date().toISOString(),
      },
    ],
  }));

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Created custom role ${name}`,
    target: name,
  });

  return NextResponse.redirect(new URL("/settings/roles", request.url), 303);
}
