import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  agents,
  connectorRuns,
  evidenceControls,
  environmentChecks,
  findings,
  integrations,
  metrics,
  policies,
  policySimulationScenarios,
  timeline,
  securityControls,
} from "@/data/agentShield";
import { hashPassword } from "@/lib/auth";

export type Permission =
  | "users:read"
  | "users:write"
  | "roles:read"
  | "roles:write"
  | "agents:read"
  | "agents:write"
  | "risk:read"
  | "risk:write"
  | "policy:read"
  | "policy:write"
  | "security:read"
  | "security:write"
  | "integrations:read"
  | "integrations:write"
  | "evidence:read"
  | "settings:read"
  | "settings:write";

export type RoleDefinition = {
  id: string;
  tenantId: string;
  name: "Super Admin" | "Admin" | "Standard" | "Read-Only" | string;
  type: "system" | "custom";
  description: string;
  permissions: Permission[];
  createdAt: string;
};

export const permissionCatalog: Array<{ id: Permission; label: string; group: string }> = [
  { id: "users:read", label: "View users", group: "Users" },
  { id: "users:write", label: "Manage users", group: "Users" },
  { id: "roles:read", label: "View roles", group: "Roles" },
  { id: "roles:write", label: "Manage roles", group: "Roles" },
  { id: "agents:read", label: "View agents", group: "Agents" },
  { id: "agents:write", label: "Manage agents", group: "Agents" },
  { id: "risk:read", label: "View risk", group: "Risk" },
  { id: "risk:write", label: "Manage remediation", group: "Risk" },
  { id: "policy:read", label: "View policy", group: "Policy" },
  { id: "policy:write", label: "Manage policy", group: "Policy" },
  { id: "security:read", label: "View security engine", group: "Security" },
  { id: "security:write", label: "Run response actions", group: "Security" },
  { id: "integrations:read", label: "View integrations", group: "Integrations" },
  { id: "integrations:write", label: "Run integration sync", group: "Integrations" },
  { id: "evidence:read", label: "View/export evidence", group: "Evidence" },
  { id: "settings:read", label: "View settings", group: "Settings" },
  { id: "settings:write", label: "Manage settings", group: "Settings" },
];

export function requirePermissionList() {
  return permissionCatalog.map((permission) => permission.id);
}

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
  tenants: Array<{ id: string; name: string; plan: "Phase 2 Free Pilot" | "Phase 3 Free SaaS Foundation"; region: string }>;
  users: Array<{ id: string; tenantId: string; name: string; email: string; role: string; passwordHash?: string; createdAt?: string }>;
  roles: RoleDefinition[];
  agents: typeof agents;
  findings: typeof findings;
  policies: typeof policies;
  policySimulationScenarios: typeof policySimulationScenarios;
  integrations: typeof integrations;
  evidenceControls: typeof evidenceControls;
  timeline: typeof timeline;
  metrics: typeof metrics;
  connectorRuns: typeof connectorRuns;
  environmentChecks: typeof environmentChecks;
  securityControls: typeof securityControls;
  auditEvents: AuditEvent[];
  demoRequests: DemoRequest[];
};

const runtimeDir = path.join(process.cwd(), ".agent-shield-data");
const runtimeFile = path.join(runtimeDir, "store.json");
const ownerEmail = process.env.AGENTSHIELD_OWNER_EMAIL?.toLowerCase() ?? "leeokk80@gmail.com";
const ownerBootstrapPassword = process.env.AGENTSHIELD_OWNER_INITIAL_PASSWORD;

let memoryStore: AgentShieldStore | null = null;

function createSeedStore(): AgentShieldStore {
  const createdAt = "2026-08-21T00:00:00.000Z";
  const allPermissions: Permission[] = [
    "users:read",
    "users:write",
    "roles:read",
    "roles:write",
    "agents:read",
    "agents:write",
    "risk:read",
    "risk:write",
    "policy:read",
    "policy:write",
    "security:read",
    "security:write",
    "integrations:read",
    "integrations:write",
    "evidence:read",
    "settings:read",
    "settings:write",
  ];

  return {
    tenants: [{ id: "tenant-demo", name: "AgentShield Demo Workspace", plan: "Phase 3 Free SaaS Foundation", region: "us-east" }],
    users: [
      {
        id: "usr-super-admin",
        tenantId: "tenant-demo",
        name: "Efosa Okunbor",
        email: ownerEmail,
        role: "Super Admin",
        passwordHash: ownerBootstrapPassword ? hashPassword(ownerBootstrapPassword) : undefined,
        createdAt,
      },
    ],
    roles: [
      {
        id: "role-super-admin",
        tenantId: "tenant-demo",
        name: "Super Admin",
        type: "system",
        description: "Full platform and workspace owner permissions.",
        permissions: allPermissions,
        createdAt,
      },
      {
        id: "role-admin",
        tenantId: "tenant-demo",
        name: "Admin",
        type: "system",
        description: "Manage users, roles, integrations, policy, risk, and evidence.",
        permissions: allPermissions.filter((permission) => permission !== "settings:write"),
        createdAt,
      },
      {
        id: "role-standard",
        tenantId: "tenant-demo",
        name: "Standard",
        type: "system",
        description: "Operate agent, risk, policy, security, and evidence workflows.",
        permissions: ["agents:read", "agents:write", "risk:read", "risk:write", "policy:read", "security:read", "integrations:read", "evidence:read", "settings:read"],
        createdAt,
      },
      {
        id: "role-read-only",
        tenantId: "tenant-demo",
        name: "Read-Only",
        type: "system",
        description: "View console data and evidence without making changes.",
        permissions: ["users:read", "roles:read", "agents:read", "risk:read", "policy:read", "security:read", "integrations:read", "evidence:read", "settings:read"],
        createdAt,
      },
    ],
    agents,
    findings,
    policies,
    policySimulationScenarios,
    integrations,
    evidenceControls,
    timeline,
    metrics,
    connectorRuns,
    environmentChecks,
    securityControls,
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

function normalizeStore(store: Partial<AgentShieldStore>): AgentShieldStore {
  const seed = createSeedStore();
  const integrationsBySlug = new Map(seed.integrations.map((integration) => [integration.slug, integration]));
  const storedUsers = store.users ?? [];
  const users = storedUsers.length ? storedUsers : seed.users;
  const hasOwner = users.some((user) => user.email.toLowerCase() === ownerEmail);

  return {
    ...seed,
    ...store,
    tenants: (store.tenants ?? seed.tenants).map((tenant) => ({
      ...tenant,
      plan: tenant.plan ?? "Phase 3 Free SaaS Foundation",
      region: "region" in tenant && typeof tenant.region === "string" ? tenant.region : "us-east",
    })) as AgentShieldStore["tenants"],
    integrations: (store.integrations ?? seed.integrations).map((integration) => ({
      ...(integrationsBySlug.get(integration.slug) ?? integration),
      ...integration,
      requiredEnv: "requiredEnv" in integration && Array.isArray(integration.requiredEnv)
        ? integration.requiredEnv
        : integrationsBySlug.get(integration.slug)?.requiredEnv ?? [],
      syncMode: "syncMode" in integration && typeof integration.syncMode === "string"
        ? integration.syncMode
        : integrationsBySlug.get(integration.slug)?.syncMode ?? "Demo sync",
    })) as AgentShieldStore["integrations"],
    connectorRuns: store.connectorRuns ?? seed.connectorRuns,
    environmentChecks: store.environmentChecks ?? seed.environmentChecks,
    securityControls: store.securityControls ?? seed.securityControls,
    roles: store.roles ?? seed.roles,
    users: [
      ...users.map((user) => ({
      ...user,
      name: user.email.toLowerCase() === ownerEmail ? "Efosa Okunbor" : user.name,
      role: user.email.toLowerCase() === ownerEmail || user.role === "Owner" || user.role === "Analyst" ? "Super Admin" : user.role,
      passwordHash: user.email.toLowerCase() === ownerEmail && ownerBootstrapPassword ? seed.users[0].passwordHash : user.passwordHash,
    })),
      ...(hasOwner ? [] : seed.users),
    ],
    auditEvents: store.auditEvents ?? seed.auditEvents,
    demoRequests: store.demoRequests ?? seed.demoRequests,
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
    memoryStore = normalizeStore(memoryStore);
    return memoryStore;
  }

  try {
    const raw = await readFile(runtimeFile, "utf8");
    memoryStore = normalizeStore(JSON.parse(raw) as Partial<AgentShieldStore>);
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
