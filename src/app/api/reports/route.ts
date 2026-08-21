import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export async function GET() {
  const session = await requireSession();
  const store = await readStore();
  const agents = store.agents.filter((agent) => agent.id.startsWith(`${session.tenantId}-`) || session.tenantId === "tenant-demo");
  const reports = store.reportSnapshots.filter((report) => report.tenantId === session.tenantId);
  const runs = store.connectorRuns.filter((run) => run.tenantId === session.tenantId);

  return NextResponse.json({
    reports,
    metrics: {
      agents: agents.length,
      highRiskAgents: agents.filter((agent) => agent.riskScore >= 70).length,
      connectorRuns: runs.length,
      reports: reports.length,
    },
  });
}
