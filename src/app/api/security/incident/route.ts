import { NextResponse } from "next/server";
import type { AgentStatus } from "@/data/agentShield";
import { requireSession } from "@/lib/auth";
import { appendAuditEvent, writeStore } from "@/lib/store";
import { updateAgentStatus } from "@/lib/securityEngine";

export async function POST(request: Request) {
  const session = await requireSession();
  const form = await request.formData();
  const agentId = String(form.get("agentId") ?? "");
  const action = String(form.get("action") ?? "quarantine");
  const status: AgentStatus = action === "restore" ? "review" : "quarantined";

  await writeStore((store) => ({
    ...store,
    agents: updateAgentStatus(store.agents, agentId, status),
  }));

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `${status === "quarantined" ? "Quarantined" : "Restored"} agent ${agentId}`,
    target: agentId,
  });

  return NextResponse.redirect(new URL(`/agents/${agentId}`, request.url), 303);
}
