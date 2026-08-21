import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { appendAuditEvent, writeStore } from "@/lib/store";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await context.params;
  const form = await request.formData();
  const status = String(form.get("status") ?? "In progress");

  await writeStore((store) => ({
    ...store,
    findings: store.findings.map((finding) => (finding.id === id ? { ...finding, status } : finding)),
  }));

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Set finding ${id} to ${status}`,
    target: id,
  });

  return NextResponse.redirect(new URL(`/risk/${id}`, request.url), 303);
}
