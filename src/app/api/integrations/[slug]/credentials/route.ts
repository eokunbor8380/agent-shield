import { NextResponse } from "next/server";
import { canManageUsers, requireSession } from "@/lib/auth";
import { appendAuditEvent, writeStore } from "@/lib/store";
import { maskSecret } from "@/lib/tenantIntegrations";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const session = await requireSession();
  const { slug } = await context.params;

  if (!canManageUsers(session.role)) {
    return NextResponse.json({ error: "Only Super Admin and Admin can configure integrations" }, { status: 403 });
  }

  const form = await request.formData();
  const entries = Array.from(form.entries())
    .filter(([key]) => key !== "note")
    .map(([key, value]) => [key, String(value).trim()] as const)
    .filter(([, value]) => value.length > 0);

  const credentials = Object.fromEntries(entries);
  const maskedCredentials = Object.fromEntries(entries.map(([key, value]) => [key, maskSecret(value)]));
  const now = new Date().toISOString();

  await writeStore((store) => {
    const existing = store.tenantIntegrationConfigs.find((config) => config.tenantId === session.tenantId && config.integrationSlug === slug);
    const nextConfig = {
      id: existing?.id ?? `tic-${Date.now()}`,
      tenantId: session.tenantId,
      integrationSlug: slug,
      status: "Configured" as const,
      credentials: { ...(existing?.credentials ?? {}), ...credentials },
      maskedCredentials: { ...(existing?.maskedCredentials ?? {}), ...maskedCredentials },
      lastSyncAt: existing?.lastSyncAt,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    return {
      ...store,
      tenantIntegrationConfigs: [
        ...store.tenantIntegrationConfigs.filter((config) => !(config.tenantId === session.tenantId && config.integrationSlug === slug)),
        nextConfig,
      ],
    };
  });

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Configured ${slug} integration credentials`,
    target: slug,
  });

  return NextResponse.redirect(new URL(`/integrations/${slug}`, request.url), 303);
}
