import { NextResponse } from "next/server";
import { hashPassword, isPlatformOwner, isStrongEnoughPassword, requireSession } from "@/lib/auth";
import { appendAuditEvent, buildSystemRoles, writeStore } from "@/lib/store";

export async function GET() {
  const session = await requireSession();

  if (!isPlatformOwner(session)) {
    return NextResponse.json({ error: "Only platform owner can view all tenants" }, { status: 403 });
  }

  const store = await writeStore((current) => current);

  return NextResponse.json({
    data: store.tenants.map((tenant) => ({
      ...tenant,
      users: store.users.filter((user) => user.tenantId === tenant.id).length,
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireSession();

  if (!isPlatformOwner(session)) {
    return NextResponse.json({ error: "Only platform owner can create tenants" }, { status: 403 });
  }

  const form = await request.formData();
  const company = String(form.get("company") ?? "").trim();
  const ownerName = String(form.get("ownerName") ?? "").trim();
  const ownerEmail = String(form.get("ownerEmail") ?? "").trim().toLowerCase();
  const temporaryPassword = String(form.get("temporaryPassword") ?? "");
  const region = String(form.get("region") ?? "us-east").trim();

  if (!company || !ownerName || !ownerEmail || !isStrongEnoughPassword(temporaryPassword)) {
    return NextResponse.redirect(new URL("/platform/tenants?error=invalid", request.url), 303);
  }

  const timestamp = Date.now();
  const tenantId = `tenant-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${timestamp}`;
  const userId = `usr-${timestamp}`;
  let exists = false;

  await writeStore((store) => {
    exists = store.tenants.some((tenant) => tenant.name.toLowerCase() === company.toLowerCase()) ||
      store.users.some((user) => user.email.toLowerCase() === ownerEmail);

    if (exists) {
      return store;
    }

    return {
      ...store,
      tenants: [
        ...store.tenants,
        {
          id: tenantId,
          name: company,
          plan: "Phase 3 Free SaaS Foundation",
          region,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
      ],
      roles: [...store.roles, ...buildSystemRoles(tenantId)],
      users: [
        ...store.users,
        {
          id: userId,
          tenantId,
          name: ownerName,
          email: ownerEmail,
          role: "Super Admin",
          platformRole: "Member",
          passwordHash: hashPassword(temporaryPassword),
          createdAt: new Date().toISOString(),
        },
      ],
    };
  });

  if (exists) {
    return NextResponse.redirect(new URL("/platform/tenants?error=exists", request.url), 303);
  }

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Created customer tenant ${company}`,
    target: tenantId,
  });

  return NextResponse.redirect(new URL("/platform/tenants", request.url), 303);
}
