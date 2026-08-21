import { getConnectorEnvironmentStatus } from "@/lib/config";
import { appendAuditEvent, readStore, writeStore } from "@/lib/store";

type SyncInput = {
  tenantId: string;
  actor: string;
  slug: string;
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

  const repos = (await response.json()) as Array<{ name: string; private: boolean; permissions?: Record<string, boolean> }>;
  const repoNames = repos.slice(0, 5).map((repo) => repo.name).join(", ") || "no repositories";

  return {
    source: "github-live",
    summary: `Synced ${repos.length} GitHub repositories for ${owner}. Sample: ${repoNames}.`,
  };
}

function createDemoSyncSummary(slug: string) {
  if (slug === "github") {
    return {
      source: "demo",
      summary: "Demo sync mapped GitHub apps, release bot permissions, repository scope, and workflow evidence.",
    };
  }

  if (slug === "microsoft-entra-azure") {
    return {
      source: "demo",
      summary: "Demo sync prepared Microsoft Entra service principal, managed identity, and role inventory mappings.",
    };
  }

  return {
    source: "demo",
    summary: "Demo sync prepared connector inventory mappings and evidence placeholders.",
  };
}

export async function runConnectorSync(input: SyncInput) {
  const store = await readStore();
  const integration = store.integrations.find((item) => item.slug === input.slug);

  if (!integration) {
    throw new Error("Integration not found");
  }

  const envStatus = getConnectorEnvironmentStatus(integration.requiredEnv);
  const hasRequiredEnv = envStatus.every((item) => item.configured);
  let result = createDemoSyncSummary(input.slug);

  if (input.slug === "github" && hasRequiredEnv) {
    result = await syncGitHub(process.env.GITHUB_OWNER!, process.env.GITHUB_TOKEN!);
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
