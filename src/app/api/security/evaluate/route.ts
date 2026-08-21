import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { appendAuditEvent, readStore } from "@/lib/store";
import { evaluatePolicyScenario } from "@/lib/securityEngine";

export async function POST(request: Request) {
  const session = await requireSession();
  const body = await request.json().catch(() => ({}));
  const scenarioId = typeof body.scenarioId === "string" ? body.scenarioId : "";
  const store = await readStore();
  const scenario = store.policySimulationScenarios.find((item) => item.id === scenarioId) ?? store.policySimulationScenarios[0];
  const evaluation = evaluatePolicyScenario(scenario, store);

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Evaluated policy scenario ${evaluation.scenarioId}: ${evaluation.decision}`,
    target: evaluation.agentId,
  });

  return NextResponse.json({ data: evaluation });
}
