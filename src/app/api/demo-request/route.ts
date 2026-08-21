import { NextResponse } from "next/server";
import { appendAuditEvent, writeStore } from "@/lib/store";

const recipient = "leeokk80@gmail.com";

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  const subject = encodeURIComponent(`AgentShield demo request from ${name || "website visitor"}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  await writeStore((store) => ({
    ...store,
    demoRequests: [
      {
        id: `REQ-${String(store.demoRequests.length + 1).padStart(4, "0")}`,
        tenantId: "tenant-demo",
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      },
      ...store.demoRequests,
    ],
  }));

  await appendAuditEvent({
    tenantId: "tenant-demo",
    actor: email || "website visitor",
    action: "Submitted demo request",
    target: "contact",
  });

  return NextResponse.redirect(`mailto:${recipient}?subject=${subject}&body=${body}`, 303);
}
