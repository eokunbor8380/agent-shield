import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { getEnvironmentStatus, getRuntimeMode } from "@/lib/config";
import { readStore } from "@/lib/store";

export async function GET() {
  const session = await requireSession();
  const store = await readStore();
  const tenant = store.tenants.find((item) => item.id === session.tenantId);

  return NextResponse.json({
    data: {
      tenant,
      runtimeMode: getRuntimeMode(),
      environment: getEnvironmentStatus(),
      users: store.users.filter((user) => user.tenantId === session.tenantId),
      auditEvents: store.auditEvents.filter((event) => event.tenantId === session.tenantId).slice(0, 20),
    },
  });
}
