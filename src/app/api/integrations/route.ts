import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { appendAuditEvent, readStore, writeStore } from "@/lib/store";

export async function GET() {
  await requireSession();
  const { integrations } = await readStore();
  return NextResponse.json({ data: integrations });
}

export async function PATCH(request: Request) {
  const session = await requireSession();
  const body = await request.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug : "";

  const next = await writeStore((store) => ({
    ...store,
    integrations: store.integrations.map((integration) =>
      integration.slug === slug
        ? { ...integration, status: "Connected", freshness: "Connected in Phase 2 demo" }
        : integration,
    ),
  }));

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Marked integration ${slug} connected`,
    target: slug,
  });

  return NextResponse.json({ data: next.integrations.find((integration) => integration.slug === slug) ?? null });
}
