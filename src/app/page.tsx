import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SectionIntro } from "@/components/SectionIntro";
import { metrics } from "@/data/agentShield";

const promises = [
  "Discover agents and non-human identities across cloud, code, SaaS, and runtime systems.",
  "Explain who authorized an autonomous action and what evidence proves the chain.",
  "Score agent trust, blast radius, and policy risk before risky actions execute.",
];

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto grid min-h-[720px] max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <SectionIntro
            eyebrow="Enterprise AI agent security"
            title="Identity, authorization, and runtime control for autonomous software."
            description="AgentShield is a security control plane for AI agents and non-human identities. Phase 1 starts with a deployable console foundation, mock inventory, risk views, policies, and integrations."
          />
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-md bg-brand px-5 py-3 text-center text-sm font-black text-slate-950 hover:bg-brand-strong" href="/dashboard">
              Open dashboard
            </Link>
            <Link className="rounded-md border border-line px-5 py-3 text-center text-sm font-black text-white hover:border-brand" href="/agents">
              View agents
            </Link>
          </div>
        </div>
        <div className="rounded-md border border-line bg-panel p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Control questions</p>
          <div className="mt-6 grid gap-5">
            {["Who or what acted?", "Who authorized it?", "What could it reach?", "Was it safe in context?", "What evidence proves it?"].map((item) => (
              <div key={item} className="border-b border-line pb-4 text-xl font-bold text-white">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-panel/70 py-14">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-md border border-line bg-background p-5">
              <p className="text-sm font-semibold text-muted">{metric.label}</p>
              <p className="mt-3 text-3xl font-black text-white">{metric.value}</p>
              <p className="mt-2 text-sm text-brand">{metric.delta}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
          {promises.map((promise) => (
            <article key={promise} className="bg-panel p-8">
              <p className="text-lg font-bold leading-8 text-white">{promise}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
