import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { StatusPill } from "@/components/StatusPill";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export default async function PolicySimulatorPage() {
  await requireSession();
  const { agents, policySimulationScenarios } = await readStore();

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Policy simulator"
          title="Preview access decisions before agents act."
          description="Phase 1 uses deterministic scenarios. Later this becomes the safety test bench for policy bundles, approvals, and runtime gateway enforcement."
        />
        <div className="mt-10 grid gap-5">
          {policySimulationScenarios.map((scenario) => {
            const agent = agents.find((item) => item.id === scenario.agentId) ?? null;

            return (
              <Panel key={scenario.id} title={scenario.action}>
                <div className="grid gap-5 lg:grid-cols-[140px_1fr_220px] lg:items-start">
                  <StatusPill value={scenario.decision.toLowerCase()} />
                  <div>
                    <p className="leading-7 text-muted">{scenario.reason}</p>
                    <p className="mt-4 text-sm font-semibold text-white">
                      Matched policies: {scenario.matchedPolicies.join(", ")}
                    </p>
                  </div>
                  {agent ? (
                    <Link href={`/agents/${agent.id}`} className="rounded-md border border-line px-4 py-3 text-center text-sm font-bold text-white hover:border-brand">
                      Open {agent.name}
                    </Link>
                  ) : null}
                </div>
              </Panel>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
