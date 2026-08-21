import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { appendAuditEvent, writeStore } from "@/lib/store";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const session = await requireSession();
  const { slug } = await context.params;

  await writeStore((store) => ({
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
    action: `Connected ${slug} integration in demo mode`,
    target: slug,
  });

  return NextResponse.redirect(new URL(`/integrations/${slug}`, request.url), 303);
}
