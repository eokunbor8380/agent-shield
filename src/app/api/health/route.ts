import { NextResponse } from "next/server";
import { getRuntimeMode } from "@/lib/config";
import { readStore } from "@/lib/store";

export async function GET() {
  const store = await readStore();

  return NextResponse.json({
    status: "ok",
    app: "AgentShield",
    runtimeMode: getRuntimeMode(),
    checks: {
      tenants: store.tenants.length,
      agents: store.agents.length,
      integrations: store.integrations.length,
      auditEvents: store.auditEvents.length,
    },
  });
}
