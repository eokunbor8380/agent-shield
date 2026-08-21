import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { StatusPill } from "@/components/StatusPill";
import { agents, findings, metrics, timeline } from "@/data/agentShield";

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Dashboard"
          title="Autonomous identity posture at a glance."
          description="This Phase 1 dashboard uses mock data shaped like the production model from the design documents."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel title="High-reach agents" description="Entities with meaningful tool, data, or credential reach.">
            <div className="mt-5 grid gap-4">
              {agents.slice(0, 3).map((agent) => (
                <Link key={agent.id} href={`/agents/${agent.id}`} className="grid gap-3 rounded-md bg-panel-strong p-4 hover:outline hover:outline-1 hover:outline-brand md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-bold text-white">{agent.name}</p>
                    <p className="mt-1 text-sm text-muted">{agent.owner} | {agent.environment}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill value={agent.status} />
                    <p className="font-mono text-sm text-brand">Trust {agent.trustScore}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Panel>
          <Panel title="Top findings" description="Risk items that need ownership, approval, or remediation.">
            <div className="mt-5 grid gap-4">
              {findings.map((finding) => (
                <Link key={finding.id} href={`/risk/${finding.id}`} className="rounded-md bg-panel-strong p-4 hover:outline hover:outline-1 hover:outline-brand">
                  <StatusPill value={finding.severity} />
                  <p className="mt-3 font-bold text-white">{finding.title}</p>
                  <p className="mt-1 text-sm text-muted">{finding.entity}</p>
                </Link>
              ))}
            </div>
          </Panel>
        </div>
        <div className="mt-6">
          <Panel title="Authorization timeline" description="Early forensic chain model across policy, gateway, and connector events.">
            <div className="grid gap-3">
              {timeline.map((item) => (
                <div key={`${item.time}-${item.event}`} className="grid gap-3 rounded-md bg-panel-strong p-4 md:grid-cols-[80px_1fr_160px]">
                  <p className="font-mono text-sm text-brand">{item.time}</p>
                  <p className="font-semibold text-white">{item.event}</p>
                  <p className="text-sm font-bold text-muted">{item.decision}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
