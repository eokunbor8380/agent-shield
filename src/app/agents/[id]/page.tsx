import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { Panel } from "@/components/Panel";
import { StatusPill } from "@/components/StatusPill";
import { agents, getAgentById } from "@/data/agentShield";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }));
}

export async function generateMetadata({ params }: PageProps<"/agents/[id]">) {
  const { id } = await params;
  await requireSession();
  const store = await readStore();
  const agent = store.agents.find((item) => item.id === id) ?? null;

  return {
    title: agent ? `${agent.name} | Agent Passport` : "Agent Passport",
  };
}

export default async function AgentPassportPage({ params }: PageProps<"/agents/[id]">) {
  const { id } = await params;
  const agent = getAgentById(id);

  if (!agent) {
    notFound();
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link href="/agents" className="text-sm font-bold text-brand hover:text-brand-strong">
          Back to inventory
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.36fr] lg:items-start">
          <div>
            <p className="font-mono text-sm text-brand">{agent.id}</p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">
                {agent.name}
              </h1>
              <StatusPill value={agent.status} />
            </div>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              {agent.type} owned by {agent.owner}. This passport summarizes purpose, assurance, credentials,
              tools, data reach, controls, and evidence for the current mock record.
            </p>
          </div>
          <Panel title="Identity context">
            <div className="grid gap-3 text-sm">
              <p className="flex justify-between gap-4 border-b border-line pb-2">
                <span className="text-muted">Environment</span>
                <span className="font-bold text-white">{agent.environment}</span>
              </p>
              <p className="flex justify-between gap-4 border-b border-line pb-2">
                <span className="text-muted">Assurance</span>
                <span className="font-bold text-white">{agent.assurance}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted">Last seen</span>
                <span className="font-bold text-white">{agent.lastSeen}</span>
              </p>
            </div>
          </Panel>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <MetricCard label="AgentTrust" value={String(agent.trustScore)} delta="Explainable trust score" />
          <MetricCard label="Risk score" value={String(agent.riskScore)} delta="Current exposure level" />
          <MetricCard label="Reach" value={String(agent.tools.length)} delta={`${agent.data}`} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Panel title="Business purpose">
            <p className="leading-7 text-muted">{agent.passport.purpose}</p>
          </Panel>
          <Panel title="Credential metadata">
            <ul className="grid gap-3 text-sm font-semibold text-muted">
              {agent.passport.credentials.map((credential) => (
                <li key={credential} className="rounded-md bg-panel-strong px-3 py-2">
                  {credential}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Tools and data">
            <p className="font-bold text-white">{agent.tools.join(", ")}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{agent.data}</p>
          </Panel>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Controls">
            <ul className="grid gap-3 text-sm font-semibold text-muted">
              {agent.passport.controls.map((control) => (
                <li key={control} className="rounded-md bg-panel-strong px-3 py-2">
                  {control}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Evidence">
            <ul className="grid gap-3 text-sm font-semibold text-muted">
              {agent.passport.evidence.map((evidence) => (
                <li key={evidence} className="rounded-md bg-panel-strong px-3 py-2">
                  {evidence}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
