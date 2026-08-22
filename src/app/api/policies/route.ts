import { NextResponse } from "next/server";
import { canManageRoles, requireSession } from "@/lib/auth";
import { appendAuditEvent, readStore, writeStore } from "@/lib/store";
import { getPolicyTemplate, policyTemplates } from "@/lib/policyLibrary";

export async function GET() {
  const session = await requireSession();
  const store = await readStore();

  return NextResponse.json({
    data: {
      active: store.policies.filter((policy) => policy.tenantId === session.tenantId),
      library: policyTemplates,
    },
  });
}

export async function POST(request: Request) {
  const session = await requireSession();

  if (!canManageRoles(session.role)) {
    return NextResponse.json({ error: "Only Super Admin and Admin can manage policies" }, { status: 403 });
  }

  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const templateId = String(form.get("templateId") ?? "");
  const policyId = String(form.get("policyId") ?? "");
  const now = new Date().toISOString();

  if (action === "activate") {
    const template = getPolicyTemplate(templateId);

    if (!template) {
      return NextResponse.redirect(new URL("/policy?error=missing-template", request.url), 303);
    }

    await writeStore((store) => {
      const exists = store.policies.some((policy) => policy.tenantId === session.tenantId && policy.name === template.name);

      if (exists) {
        return {
          ...store,
          policies: store.policies.map((policy) =>
            policy.tenantId === session.tenantId && policy.name === template.name
              ? { ...policy, status: "Active", updatedAt: now }
              : policy,
          ),
        };
      }

      return {
        ...store,
        policies: [
          ...store.policies,
          {
            ...template,
            id: `${session.tenantId}-${template.id}`,
            tenantId: session.tenantId,
            status: "Active",
            source: "standard",
            createdAt: now,
            updatedAt: now,
          },
        ],
      };
    });

    await appendAuditEvent({
      tenantId: session.tenantId,
      actor: session.email,
      action: `Activated policy ${template.name}`,
      target: template.id,
    });
  }

  if (action === "clone") {
    const template = getPolicyTemplate(templateId);

    if (!template) {
      return NextResponse.redirect(new URL("/policy?error=missing-template", request.url), 303);
    }

    await writeStore((store) => ({
      ...store,
      policies: [
        ...store.policies,
        {
          ...template,
          id: `${session.tenantId}-custom-${template.id}-${Date.now()}`,
          tenantId: session.tenantId,
          name: `${template.name} Custom`,
          status: "Draft",
          source: "cloned",
          createdAt: now,
          updatedAt: now,
        },
      ],
    }));

    await appendAuditEvent({
      tenantId: session.tenantId,
      actor: session.email,
      action: `Cloned policy ${template.name}`,
      target: template.id,
    });
  }

  if (action === "deactivate") {
    await writeStore((store) => ({
      ...store,
      policies: store.policies.map((policy) =>
        policy.tenantId === session.tenantId && policy.id === policyId
          ? { ...policy, status: "Available", updatedAt: now }
          : policy,
      ),
    }));

    await appendAuditEvent({
      tenantId: session.tenantId,
      actor: session.email,
      action: "Deactivated policy",
      target: policyId,
    });
  }

  return NextResponse.redirect(new URL("/policy", request.url), 303);
}
