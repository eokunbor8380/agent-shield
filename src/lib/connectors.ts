import { appendAuditEvent, readStore, writeStore } from "@/lib/store";

type SyncInput = {
  tenantId: string;
  actor: string;
  slug: string;
};

type SyncedRepo = {
  name: string;
  private: boolean;
  permissions?: Record<string, boolean>;
  updated_at?: string;
  html_url?: string;
};

type SyncResult = {
  source: string;
  summary: string;
  repos: SyncedRepo[];
};

async function syncGitHub(owner: string, token: string) {
  const response = await fetch(`https://api.github.com/users/${owner}/repos?per_page=10&sort=updated`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub sync failed with ${response.status}`);
  }

  const repos = (await response.json()) as SyncedRepo[];
  const repoNames = repos.slice(0, 5).map((repo) => repo.name).join(", ") || "no repositories";

  return {
    source: "github-live",
    summary: `Synced ${repos.length} GitHub repositories for ${owner}. Sample: ${repoNames}.`,
    repos,
  };
}

function createDemoSyncSummary(slug: string): SyncResult {
  if (slug === "github") {
    return {
      source: "demo",
      summary: "Demo sync mapped GitHub apps, release bot permissions, repository scope, and workflow evidence.",
      repos: [
        { name: "agent-shield-demo", private: true, updated_at: new Date().toISOString(), html_url: "https://github.com/demo/agent-shield-demo" },
      ],
    };
  }

  if (slug === "microsoft-entra-azure") {
    return {
      source: "demo",
      summary: "Demo sync prepared Microsoft Entra service principal, managed identity, and role inventory mappings.",
      repos: [],
    };
  }

  return {
    source: "demo",
    summary: "Demo sync prepared connector inventory mappings and evidence placeholders.",
    repos: [],
  };
}

export async function runConnectorSync(input: SyncInput) {
  const store = await readStore();
  const integration = store.integrations.find((item) => item.slug === input.slug);

  if (!integration) {
    throw new Error("Integration not found");
  }

  const tenantConfig = store.tenantIntegrationConfigs.find((config) => config.tenantId === input.tenantId && config.integrationSlug === input.slug);
  const credentials = tenantConfig?.credentials ?? {};
  const envStatus = integration.requiredEnv.map((key) => ({
    key,
    configured: Boolean(credentials[key]) || Boolean(process.env[key]),
  }));
  const hasRequiredCredentials = envStatus.every((item) => item.configured);
  let result = createDemoSyncSummary(input.slug);

  if (input.slug === "github" && hasRequiredCredentials) {
    result = await syncGitHub(credentials.GITHUB_OWNER ?? process.env.GITHUB_OWNER!, credentials.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN!);
  }

  const startedAt = new Date();
  const finishedAt = new Date();

  const next = await writeStore((current) => ({
    ...current,
    integrations: current.integrations.map((item) =>
      item.slug === input.slug
        ? { ...item, status: "Connected", freshness: `${result.source} sync completed just now` }
        : item,
    ),
    connectorRuns: [
      {
        id: `RUN-${String(current.connectorRuns.length + 1).padStart(4, "0")}`,
        tenantId: input.tenantId,
        integrationSlug: input.slug,
        status: "Succeeded",
        source: result.source,
        summary: result.summary,
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
      },
      ...current.connectorRuns,
    ],
    tenantIntegrationConfigs: current.tenantIntegrationConfigs.map((config) =>
      config.tenantId === input.tenantId && config.integrationSlug === input.slug
        ? { ...config, status: "Configured", lastSyncAt: finishedAt.toISOString(), updatedAt: finishedAt.toISOString() }
        : config,
    ),
    agents: input.slug === "github"
      ? [
          ...current.agents.filter((agent) => !agent.id.startsWith(`${input.tenantId}-github-repo-`)),
          ...result.repos.slice(0, 10).map((repo, index) => ({
            id: `${input.tenantId}-github-repo-${index}`,
            name: `GitHub Repo: ${repo.name}`,
            type: "Repository automation surface",
            owner: input.tenantId,
            environment: repo.private ? "Private repository" : "Public repository",
            status: "active" as const,
            trustScore: repo.private ? 760 : 690,
            riskScore: repo.private ? 42 : 58,
            tools: ["GitHub"],
            data: repo.html_url ?? "Repository metadata",
            assurance: "Connector discovered",
            lastSeen: repo.updated_at ?? "Just now",
            passport: {
              purpose: "Repository and workflow surface discovered through GitHub connector.",
              credentials: ["GitHub connector token"],
              controls: ["Repository inventory", "Owner review required", "Workflow permission review"],
              evidence: [`Discovered by ${result.source}`, result.summary],
            },
          })),
        ]
      : current.agents,
    reportSnapshots: [
      {
        id: `RPT-${String(current.reportSnapshots.length + 1).padStart(4, "0")}`,
        tenantId: input.tenantId,
        title: `${integration.name} sync report`,
        summary: result.summary,
        source: result.source,
        metrics: [
          { label: "Integration", value: integration.name },
          { label: "Source", value: result.source },
          { label: "Items discovered", value: String(result.repos.length) },
        ],
        createdAt: finishedAt.toISOString(),
      },
      ...current.reportSnapshots,
    ],
  }));

  await appendAuditEvent({
    tenantId: input.tenantId,
    actor: input.actor,
    action: `Ran ${integration.name} connector sync`,
    target: input.slug,
  });

  return {
    integration: next.integrations.find((item) => item.slug === input.slug),
    run: next.connectorRuns[0],
    envStatus,
  };
}
