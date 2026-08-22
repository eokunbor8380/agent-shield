import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { appendAuditEvent, writeStore } from "@/lib/store";
import { buildCustomReportSnapshot } from "@/lib/reporting";

export async function POST(request: Request) {
  const session = await requireSession();
  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const sections = form.getAll("sections").map(String).filter(Boolean);

  if (!title || sections.length === 0) {
    return NextResponse.redirect(new URL("/reports?error=custom-report", request.url), 303);
  }

  await writeStore((store) => ({
    ...store,
    reportSnapshots: [
      buildCustomReportSnapshot(session.tenantId, title, sections, store),
      ...store.reportSnapshots,
    ],
  }));

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Created custom report ${title}`,
    target: title,
  });

  return NextResponse.redirect(new URL("/reports", request.url), 303);
}
