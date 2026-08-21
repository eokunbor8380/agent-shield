import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  agents,
  evidenceControls,
  findings,
  integrations,
  metrics,
  policies,
  policySimulationScenarios,
  timeline,
} from "@/data/agentShield";

export type AuditEvent = {
  id: string;
  tenantId: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
};

export type DemoRequest = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type AgentShieldStore = {
  tenants: Array<{ id: string; name: string; plan: "Phase 2 Free Pilot" }>;
  users: Array<{ id: string; tenantId: string; name: string; email: string; role: string }>;
  agents: typeof agents;
  findings: typeof findings;
  policies: typeof policies;
  policySimulationScenarios: typeof policySimulationScenarios;
  integrations: typeof integrations;
  evidenceControls: typeof evidenceControls;
  timeline: typeof timeline;
  metrics: typeof metrics;
  auditEvents: AuditEvent[];
  demoRequests: DemoRequest[];
};

const runtimeDir = path.join(process.cwd(), ".agent-shield-data");
const runtimeFile = path.join(runtimeDir, "store.json");

let memoryStore: AgentShieldStore | null = null;

function createSeedStore(): AgentShieldStore {
  return {
    tenants: [{ id: "tenant-demo", name: "AgentShield Demo Workspace", plan: "Phase 2 Free Pilot" }],
    users: [{ id: "usr-demo-owner", tenantId: "tenant-demo", name: "AgentShield Demo Admin", email: "leeokk80@gmail.com", role: "Owner" }],
    agents,
    findings,
    policies,
    policySimulationScenarios,
    integrations,
    evidenceControls,
    timeline,
    metrics,
    auditEvents: [
      {
        id: "AUD-0001",
        tenantId: "tenant-demo",
        actor: "system",
        action: "Seeded Phase 2 workspace",
        target: "tenant-demo",
        createdAt: "2026-08-21T00:00:00.000Z",
      },
    ],
    demoRequests: [],
  };
}

async function persistStore(store: AgentShieldStore) {
  memoryStore = store;

  try {
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(runtimeFile, JSON.stringify(store, null, 2));
  } catch {
    // Serverless deployments may have read-only project filesystems. Memory still works per warm instance.
  }
}

export async function readStore(): Promise<AgentShieldStore> {
  if (memoryStore) {
    return memoryStore;
  }

  try {
    const raw = await readFile(runtimeFile, "utf8");
    memoryStore = JSON.parse(raw) as AgentShieldStore;
    return memoryStore;
  } catch {
    const seed = createSeedStore();
    await persistStore(seed);
    return seed;
  }
}

export async function writeStore(updater: (store: AgentShieldStore) => AgentShieldStore | Promise<AgentShieldStore>) {
  const current = await readStore();
  const next = await updater(current);
  await persistStore(next);
  return next;
}

export async function appendAuditEvent(event: Omit<AuditEvent, "id" | "createdAt">) {
  return writeStore((store) => ({
    ...store,
    auditEvents: [
      {
        ...event,
        id: `AUD-${String(store.auditEvents.length + 1).padStart(4, "0")}`,
        createdAt: new Date().toISOString(),
      },
      ...store.auditEvents,
    ],
  }));
}
