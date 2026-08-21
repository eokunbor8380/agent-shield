import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SectionIntro } from "@/components/SectionIntro";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export default async function IntegrationsPage() {
  await requireSession();
  const { integrations } = await readStore();

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Integrations"
          title="Connectors will turn external systems into AgentShield evidence."
          description="We start with a free mock catalog. Real connectors arrive after auth, tenant boundaries, and database foundations are in place."
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
          {integrations.map((integration) => (
            <Link key={integration.name} href={`/integrations/${integration.slug}`} className="bg-panel p-7 hover:bg-panel-strong">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{integration.status}</p>
              <h2 className="mt-4 text-2xl font-black text-white">{integration.name}</h2>
              <p className="mt-4 leading-7 text-muted">{integration.scope}</p>
              <p className="mt-5 rounded-md bg-panel-strong px-3 py-2 text-sm font-semibold text-muted">
                Freshness: {integration.freshness}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
