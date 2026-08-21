import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { getEnvironmentStatus, getRuntimeMode } from "@/lib/config";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export default async function SettingsPage() {
  const session = await requireSession();
  const store = await readStore();
  const tenant = store.tenants.find((item) => item.id === session.tenantId);
  const envStatus = getEnvironmentStatus();

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Settings"
          title="Production foundation and tenant readiness."
          description="Phase 3 tracks the free SaaS foundation: tenant, users, runtime mode, environment variables, and audit activity."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Panel title="Workspace">
            <div className="grid gap-3 text-sm">
              <p className="flex justify-between gap-4 border-b border-line pb-2">
                <span className="text-muted">Tenant</span>
                <span className="font-bold text-white">{tenant?.name}</span>
              </p>
              <p className="flex justify-between gap-4 border-b border-line pb-2">
                <span className="text-muted">Plan</span>
                <span className="font-bold text-white">{tenant?.plan}</span>
              </p>
              <p className="flex justify-between gap-4 border-b border-line pb-2">
                <span className="text-muted">Region</span>
                <span className="font-bold text-white">{tenant?.region}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted">Runtime</span>
                <span className="font-bold text-white">{getRuntimeMode()}</span>
              </p>
            </div>
          </Panel>
          <Panel title="Environment readiness">
            <div className="grid gap-3">
              {envStatus.map((item) => (
                <div key={item.key} className="grid gap-2 rounded-md bg-panel-strong p-4 md:grid-cols-[180px_120px_1fr] md:items-center">
                  <p className="font-mono text-sm text-brand">{item.key}</p>
                  <p className={item.configured ? "text-sm font-black text-success" : "text-sm font-black text-warning"}>
                    {item.configured ? "Configured" : "Not set"}
                  </p>
                  <p className="text-sm text-muted">{item.purpose}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Users">
            <Link href="/settings/roles" className="mb-4 inline-flex rounded-md border border-line px-4 py-2 text-sm font-bold text-white hover:border-brand">
              Manage roles
            </Link>
            <div className="grid gap-3">
              {store.users.map((user) => (
                <div key={user.id} className="rounded-md bg-panel-strong p-4">
                  <p className="font-bold text-white">{user.name}</p>
                  <p className="mt-1 text-sm text-muted">{user.email} | {user.role}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Audit trail">
            <div className="grid gap-3">
              {store.auditEvents.slice(0, 6).map((event) => (
                <div key={event.id} className="rounded-md bg-panel-strong p-4">
                  <p className="font-mono text-xs text-brand">{event.id}</p>
                  <p className="mt-2 font-bold text-white">{event.action}</p>
                  <p className="mt-1 text-sm text-muted">{event.actor}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
