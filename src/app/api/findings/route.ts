import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { appendAuditEvent, readStore, writeStore } from "@/lib/store";

export async function GET() {
  await requireSession();
  const { findings } = await readStore();
  return NextResponse.json({ data: findings });
}

export async function PATCH(request: Request) {
  const session = await requireSession();
  const body = await request.json().catch(() => ({}));
  const findingId = typeof body.findingId === "string" ? body.findingId : "";
  const status = typeof body.status === "string" ? body.status : "In progress";

  const next = await writeStore((store) => ({
    ...store,
    findings: store.findings.map((finding) => (finding.id === findingId ? { ...finding, status } : finding)),
  }));

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Updated finding ${findingId} to ${status}`,
    target: findingId,
  });

  return NextResponse.json({ data: next.findings.find((finding) => finding.id === findingId) ?? null });
}
