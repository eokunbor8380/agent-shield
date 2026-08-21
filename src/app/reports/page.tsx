import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export const metadata = {
  title: "Reports | AgentShield",
};

export default async function ReportsPage() {
  const session = await requireSession();
  const store = await readStore();
  const tenantAgents = store.agents.filter((agent) => agent.id.startsWith(`${session.tenantId}-`) || session.tenantId === "tenant-demo");
  const reports = store.reportSnapshots.filter((report) => report.tenantId === session.tenantId);
  const runs = store.connectorRuns.filter((run) => run.tenantId === session.tenantId);
  const findings = store.findings;
  const highRiskAgents = tenantAgents.filter((agent) => agent.riskScore >= 70);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Reports</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black text-white md:text-6xl">
          Tenant visibility and evidence reporting.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Reports are generated when tenant connectors run. They summarize discovered agents, identity surfaces, risk signals, and audit evidence.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <Panel title="Agents">
            <p className="text-4xl font-black text-white">{tenantAgents.length}</p>
            <p className="mt-2 text-sm text-muted">Inventory records</p>
          </Panel>
          <Panel title="High risk">
            <p className="text-4xl font-black text-white">{highRiskAgents.length}</p>
            <p className="mt-2 text-sm text-muted">Need review</p>
          </Panel>
          <Panel title="Findings">
            <p className="text-4xl font-black text-white">{findings.length}</p>
            <p className="mt-2 text-sm text-muted">Open risk items</p>
          </Panel>
          <Panel title="Connector runs">
            <p className="text-4xl font-black text-white">{runs.length}</p>
            <p className="mt-2 text-sm text-muted">Data refreshes</p>
          </Panel>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.42fr]">
          <Panel title="Generated reports">
            <div className="grid gap-4">
              {reports.length ? reports.map((report) => (
                <article key={report.id} className="rounded-md bg-panel-strong p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-brand">{report.id} | {report.source}</p>
                      <h2 className="mt-2 text-xl font-black text-white">{report.title}</h2>
                    </div>
                    <p className="text-sm font-semibold text-muted">{new Date(report.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="mt-4 leading-7 text-muted">{report.summary}</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {report.metrics.map((metric) => (
                      <div key={`${report.id}-${metric.label}`} className="rounded-md border border-line p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{metric.label}</p>
                        <p className="mt-2 font-black text-white">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </article>
              )) : (
                <div className="rounded-md bg-panel-strong p-6">
                  <p className="font-bold text-white">No reports yet.</p>
                  <p className="mt-2 leading-7 text-muted">
                    Open an integration, save tenant credentials if available, then run sync. Demo sync also creates a starter report without paid tools.
                  </p>
                  <Link
                    href="/integrations"
                    className="mt-5 inline-flex rounded-md bg-brand px-4 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong"
                  >
                    Configure integrations
                  </Link>
                </div>
              )}
            </div>
          </Panel>

          <Panel title="Evidence exports">
            <div className="grid gap-3">
              <Link href="/api/evidence/export/nist-csf" className="rounded-md border border-line px-4 py-3 text-sm font-black text-white hover:border-brand">
                Export NIST CSF package
              </Link>
              <Link href="/compliance" className="rounded-md border border-line px-4 py-3 text-sm font-black text-white hover:border-brand">
                Review compliance evidence
              </Link>
              <Link href="/security" className="rounded-md border border-line px-4 py-3 text-sm font-black text-white hover:border-brand">
                Review security posture
              </Link>
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
