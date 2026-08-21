import { NextResponse } from "next/server";
import { getSimulationById, policySimulationScenarios } from "@/data/agentShield";

export function GET() {
  return NextResponse.json({ data: policySimulationScenarios });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const scenarioId = typeof body.scenarioId === "string" ? body.scenarioId : policySimulationScenarios[0].id;

  return NextResponse.json({ data: getSimulationById(scenarioId) });
}
