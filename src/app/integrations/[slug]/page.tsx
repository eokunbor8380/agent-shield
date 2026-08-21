import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { integrations } from "@/data/agentShield";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export function generateStaticParams() {
  return integrations.map((integration) => ({ slug: integration.slug }));
}

export async function generateMetadata({ params }: PageProps<"/integrations/[slug]">) {
  const { slug } = await params;
  await requireSession();
  const store = await readStore();
  const integration = store.integrations.find((item) => item.slug === slug) ?? null;

  return {
    title: integration ? `${integration.name} | Integration` : "Integration",
  };
}

export default async function IntegrationDetailPage({ params }: PageProps<"/integrations/[slug]">) {
  const { slug } = await params;
  const session = await requireSession();
  const store = await readStore();
  const integration = store.integrations.find((item) => item.slug === slug) ?? null;

  if (!integration) {
    notFound();
  }

  const tenantConfig = store.tenantIntegrationConfigs.find((config) => config.tenantId === session.tenantId && config.integrationSlug === integration.slug);
  const envStatus = integration.requiredEnv.map((key) => ({
    key,
    configured: Boolean(tenantConfig?.credentials[key]) || Boolean(process.env[key]),
  }));
  const runs = store.connectorRuns.filter((run) => run.tenantId === session.tenantId && run.integrationSlug === integration.slug);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link href="/integrations" className="text-sm font-bold text-brand hover:text-brand-strong">
          Back to integrations
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.38fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{integration.status}</p>
            <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">{integration.name}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{integration.scope}</p>
          </div>
          <Panel title="Connector state">
            <p className="text-sm text-muted">Freshness</p>
            <p className="mt-2 text-xl font-black text-white">{integration.freshness}</p>
            <form action={`/api/integrations/${integration.slug}/connect`} method="post" className="mt-5">
              <button className="rounded-md bg-brand px-4 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
                Mark connected
              </button>
            </form>
            <form action={`/api/integrations/${integration.slug}/sync`} method="post" className="mt-3">
              <button className="rounded-md border border-line px-4 py-3 text-sm font-black text-white hover:border-brand" type="submit">
                Run sync
              </button>
            </form>
          </Panel>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.7fr_1fr]">
          <Panel title="Phase 4 connector mode">
            <p className="leading-7 text-muted">
              {integration.syncMode}
            </p>
          </Panel>
          <Panel title="Setup checklist">
            <ol className="grid gap-3 text-sm font-semibold text-muted">
              {integration.setup.map((step) => (
                <li key={step} className="rounded-md bg-panel-strong px-3 py-2">{step}</li>
              ))}
            </ol>
          </Panel>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Tenant credentials">
            <div className="grid gap-3">
              {envStatus.map((item) => (
                <div key={item.key} className="grid gap-2 rounded-md bg-panel-strong p-4 md:grid-cols-[1fr_120px]">
                  <p className="font-mono text-sm text-brand">{item.key}</p>
                  <p className={item.configured ? "text-sm font-black text-success" : "text-sm font-black text-warning"}>
                    {item.configured ? "Configured" : "Not set"}
                  </p>
                </div>
              ))}
            </div>
            {tenantConfig ? (
              <div className="mt-5 grid gap-2">
                {Object.entries(tenantConfig.maskedCredentials).map(([key, value]) => (
                  <p key={key} className="font-mono text-xs text-muted">{key}: {value}</p>
                ))}
              </div>
            ) : null}
            <form action={`/api/integrations/${integration.slug}/credentials`} method="post" className="mt-5 grid gap-3">
              {integration.requiredEnv.map((key) => (
                <label key={key} className="grid gap-2">
                  <span className="text-sm font-bold text-white">{key}</span>
                  <input name={key} type={key.includes("SECRET") || key.includes("TOKEN") ? "password" : "text"} className="rounded-md border border-line bg-background px-4 py-3 text-white" />
                </label>
              ))}
              <button className="rounded-md bg-brand px-4 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
                Save tenant credentials
              </button>
            </form>
          </Panel>
          <Panel title="Recent sync runs">
            <div className="grid gap-3">
              {runs.length ? runs.slice(0, 5).map((run) => (
                <div key={run.id} className="rounded-md bg-panel-strong p-4">
                  <p className="font-mono text-xs text-brand">{run.id} | {run.source}</p>
                  <p className="mt-2 font-bold text-white">{run.status}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{run.summary}</p>
                </div>
              )) : (
                <p className="text-sm leading-6 text-muted">No sync runs yet. Use Run sync to create the first one.</p>
              )}
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
