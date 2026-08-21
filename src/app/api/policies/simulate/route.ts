import { NextResponse } from "next/server";
import { getSimulationById, policySimulationScenarios } from "@/data/agentShield";
import { requireSession } from "@/lib/auth";
import { appendAuditEvent, readStore } from "@/lib/store";

export async function GET() {
  await requireSession();
  const store = await readStore();
  return NextResponse.json({ data: store.policySimulationScenarios });
}

export async function POST(request: Request) {
  const session = await requireSession();
  const body = await request.json().catch(() => ({}));
  const scenarioId = typeof body.scenarioId === "string" ? body.scenarioId : policySimulationScenarios[0].id;
  const store = await readStore();
  const scenario = store.policySimulationScenarios.find((item) => item.id === scenarioId) ?? getSimulationById(scenarioId);

  await appendAuditEvent({
    tenantId: session.tenantId,
    actor: session.email,
    action: `Simulated policy scenario ${scenario.id}`,
    target: scenario.agentId,
  });

  return NextResponse.json({ data: scenario });
}
