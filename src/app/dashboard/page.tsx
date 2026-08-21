import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SectionIntro } from "@/components/SectionIntro";
import { StatusPill } from "@/components/StatusPill";
import { agents, findings, metrics } from "@/data/agentShield";

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
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-md border border-line bg-panel p-5">
              <p className="text-sm font-semibold text-muted">{metric.label}</p>
              <p className="mt-3 text-3xl font-black text-white">{metric.value}</p>
              <p className="mt-2 text-sm text-brand">{metric.delta}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-md border border-line bg-panel p-6">
            <h2 className="text-xl font-black text-white">High-reach agents</h2>
            <div className="mt-5 grid gap-4">
              {agents.slice(0, 3).map((agent) => (
                <Link key={agent.id} href="/agents" className="grid gap-3 rounded-md bg-panel-strong p-4 hover:outline hover:outline-1 hover:outline-brand md:grid-cols-[1fr_auto]">
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
          </section>
          <section className="rounded-md border border-line bg-panel p-6">
            <h2 className="text-xl font-black text-white">Top findings</h2>
            <div className="mt-5 grid gap-4">
              {findings.map((finding) => (
                <div key={finding.id} className="rounded-md bg-panel-strong p-4">
                  <StatusPill value={finding.severity} />
                  <p className="mt-3 font-bold text-white">{finding.title}</p>
                  <p className="mt-1 text-sm text-muted">{finding.entity}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
