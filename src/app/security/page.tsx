import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { StatusPill } from "@/components/StatusPill";
import { requireSession } from "@/lib/auth";
import { buildSecurityPosture } from "@/lib/securityEngine";
import { readStore } from "@/lib/store";

export default async function SecurityPage() {
  await requireSession();
  const store = await readStore();
  const posture = buildSecurityPosture(store);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Security engine"
          title="Policy, risk, and evidence in one control loop."
          description="Phase 5 adds deterministic risk scoring, policy evaluation, control checks, incident response actions, and evidence packages."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <MetricCard label="Average risk" value={String(posture.averageRisk)} delta="Computed by engine" />
          <MetricCard label="High-risk agents" value={String(posture.highRiskAgents)} delta="Critical or high bands" />
          <MetricCard label="Open findings" value={String(posture.openFindings)} delta="Not resolved" />
          <MetricCard label="Deny/challenge" value={String(posture.deniedOrChallenged)} delta="Policy evaluations" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Panel title="Agent risk scoring" description="Scores combine current risk, tool reach, findings, trust, and response state.">
            <div className="grid gap-3">
              {posture.agentScores.map((score) => (
                <Link key={score.agentId} href={`/agents/${score.agentId}`} className="grid gap-3 rounded-md bg-panel-strong p-4 hover:outline hover:outline-1 hover:outline-brand md:grid-cols-[1fr_120px_120px]">
                  <div>
                    <p className="font-bold text-white">{score.name}</p>
                    <p className="mt-1 text-sm text-muted">{score.drivers.join(" | ")}</p>
                  </div>
                  <p className="font-mono text-2xl font-black text-white">{score.score}</p>
                  <StatusPill value={score.band.toLowerCase()} />
                </Link>
              ))}
            </div>
          </Panel>
          <Panel title="Control checks" description="Framework-oriented control status from the same evidence model.">
            <div className="grid gap-3">
              {posture.controlEvaluations.map((control) => (
                <div key={control.id} className="rounded-md bg-panel-strong p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-bold text-white">{control.name}</p>
                    <StatusPill value={control.status.toLowerCase()} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{control.framework}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">{control.evidence}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="mt-6">
          <Panel title="Policy evaluations" description="Runtime decisions evaluated with current agent and finding state.">
            <div className="grid gap-3">
              {posture.policyEvaluations.map((evaluation) => (
                <div key={evaluation.scenarioId} className="grid gap-3 rounded-md bg-panel-strong p-4 md:grid-cols-[150px_1fr_180px]">
                  <StatusPill value={evaluation.decision.toLowerCase()} />
                  <div>
                    <p className="font-bold text-white">{evaluation.action}</p>
                    <p className="mt-1 text-sm text-muted">{evaluation.reasons.join(" ")}</p>
                  </div>
                  <Link href={`/agents/${evaluation.agentId}`} className="text-sm font-bold text-brand hover:text-brand-strong">
                    Open agent
                  </Link>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
