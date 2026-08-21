import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { buildEvidenceExport } from "@/lib/securityEngine";
import { appendAuditEvent, readStore } from "@/lib/store";

export async function GET(_request: Request, context: { params: Promise<{ framework: string }> }) {
  const session = await requireSession();
  const { framework } = await context.params;
  const store = await readStore();
  const data = buildEvidenceExport(store, framework);

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Exported evidence package for ${data.framework}`,
    target: framework,
  });

  return NextResponse.json({ data });
}
