import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { integrations, getIntegrationBySlug } from "@/data/agentShield";
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
  const integration = getIntegrationBySlug(slug);

  if (!integration) {
    notFound();
  }

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
          </Panel>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.7fr_1fr]">
          <Panel title="Free Phase 1 approach">
            <p className="leading-7 text-muted">
              This connector is represented with mock data now. In Phase 2, we add OAuth or read-only credentials,
              store tenant-scoped inventory, and run scheduled sync jobs.
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
      </section>
    </AppShell>
  );
}
