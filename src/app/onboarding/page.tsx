import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export const metadata = {
  title: "Onboarding | AgentShield",
};

export default async function OnboardingPage() {
  const session = await requireSession();
  const store = await readStore();
  const tenant = store.tenants.find((item) => item.id === session.tenantId);
  const integrationConfigs = store.tenantIntegrationConfigs.filter((config) => config.tenantId === session.tenantId);
  const runs = store.connectorRuns.filter((run) => run.tenantId === session.tenantId);
  const reports = store.reportSnapshots.filter((report) => report.tenantId === session.tenantId);

  const steps = [
    {
      title: "Confirm workspace",
      status: tenant ? "Ready" : "Needs setup",
      body: `${tenant?.name ?? "This tenant"} is the customer workspace where users, roles, integrations, agents, and evidence stay separated.`,
      href: "/settings",
      action: "Review settings",
    },
    {
      title: "Add tenant users",
      status: "Ready",
      body: "Create accounts for admins, analysts, auditors, and read-only stakeholders, then assign roles that match their work.",
      href: "/settings/users",
      action: "Manage users",
    },
    {
      title: "Connect first source",
      status: integrationConfigs.length ? "In progress" : "Next",
      body: "Start with GitHub or Microsoft Entra/Azure. Save tenant credentials, then run sync to collect inventory and evidence.",
      href: "/integrations",
      action: "Open integrations",
    },
    {
      title: "Review visibility",
      status: reports.length || runs.length ? "Producing data" : "Waiting for sync",
      body: "After sync, AgentShield feeds the Agents, Risk, Security, Compliance, and Reports screens for that tenant.",
      href: "/reports",
      action: "View reports",
    },
  ];

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Customer onboarding</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black text-white md:text-6xl">
          Bring a tenant from account setup to agent visibility.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Use this workflow for each customer tenant: create users, configure connectors, run sync, then review inventory and reports.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {steps.map((step) => (
            <Panel key={step.title} title={step.title}>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand">{step.status}</p>
              <p className="mt-4 min-h-24 leading-7 text-muted">{step.body}</p>
              <Link
                href={step.href}
                className="mt-5 inline-flex rounded-md border border-line px-4 py-3 text-sm font-black text-white hover:border-brand"
              >
                {step.action}
              </Link>
            </Panel>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Panel title="Configured sources">
            <p className="text-4xl font-black text-white">{integrationConfigs.length}</p>
            <p className="mt-3 text-sm leading-6 text-muted">Tenant integrations with saved credentials.</p>
          </Panel>
          <Panel title="Sync runs">
            <p className="text-4xl font-black text-white">{runs.length}</p>
            <p className="mt-3 text-sm leading-6 text-muted">Connector runs feeding inventory and evidence.</p>
          </Panel>
          <Panel title="Reports">
            <p className="text-4xl font-black text-white">{reports.length}</p>
            <p className="mt-3 text-sm leading-6 text-muted">Snapshots produced from connector activity.</p>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
