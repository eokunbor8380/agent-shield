import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { StatusPill } from "@/components/StatusPill";
import { requireSession } from "@/lib/auth";
import { evaluatePolicyScenario } from "@/lib/securityEngine";
import { readStore } from "@/lib/store";

export default async function PolicySimulatorPage() {
  await requireSession();
  const store = await readStore();

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Policy simulator"
          title="Preview access decisions before agents act."
          description="Phase 5 evaluates deterministic scenarios against current agent state, findings, quarantine controls, and policy matches."
        />
        <div className="mt-10 grid gap-5">
          {store.policySimulationScenarios.map((scenario) => {
            const evaluation = evaluatePolicyScenario(scenario, store);
            const agent = store.agents.find((item) => item.id === scenario.agentId) ?? null;

            return (
              <Panel key={scenario.id} title={scenario.action}>
                <div className="grid gap-5 lg:grid-cols-[140px_1fr_220px] lg:items-start">
                  <StatusPill value={evaluation.decision.toLowerCase()} />
                  <div>
                    <p className="leading-7 text-muted">{evaluation.reasons.join(" ")}</p>
                    <p className="mt-4 text-sm font-semibold text-white">
                      Matched policies: {evaluation.matchedPolicies.join(", ")}
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
