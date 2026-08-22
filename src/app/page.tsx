import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BrandLogo } from "@/components/BrandLogo";
import { SectionIntro } from "@/components/SectionIntro";
import { metrics } from "@/data/agentShield";
import { getSession } from "@/lib/auth";

const promises = [
  "Discover agents and non-human identities across cloud, code, SaaS, and runtime systems.",
  "Explain who authorized an autonomous action and what evidence proves the chain.",
  "Score agent trust, blast radius, and policy risk before risky actions execute.",
];

export default async function Home() {
  const session = await getSession();

  return (
    <AppShell>
      <section className="agent-grid-background border-b border-line">
        <div className="mx-auto grid min-h-[720px] max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <div className="mb-10">
              <BrandLogo large />
            </div>
            <SectionIntro
              eyebrow="Enterprise AI agent security"
              title="Control every agentic action before it becomes business risk."
              description="AgentShield governs AI agents and non-human identities with purpose-bound access, autonomy controls, policy decisions, blast-radius visibility, and audit-ready evidence."
            />
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {session ? (
                <>
                  <Link className="rounded-md bg-brand px-5 py-3 text-center text-sm font-black text-slate-950 hover:bg-brand-strong" href="/dashboard">
                    Open dashboard
                  </Link>
                  <Link className="rounded-md border border-line px-5 py-3 text-center text-sm font-black text-white hover:border-brand" href="/policy">
                    Review policies
                  </Link>
                </>
              ) : (
                <>
                  <Link className="rounded-md bg-brand px-5 py-3 text-center text-sm font-black text-slate-950 hover:bg-brand-strong" href="/register">
                    Register
                  </Link>
                  <Link className="rounded-md border border-line px-5 py-3 text-center text-sm font-black text-white hover:border-brand" href="/sign-in">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="agent-signal-panel agent-orbit-line rounded-md p-5">
            <div className="rounded-md border border-line bg-background/70 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Live decision trace</p>
              <div className="mt-6 grid gap-4">
                {[
                  ["Identity", "Finance Reconciliation Agent"],
                  ["Intent", "Export customer exceptions"],
                  ["Policy", "Sensitive data export approval"],
                  ["Decision", "Challenge"],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-3 rounded-md border border-line bg-panel/80 p-4 sm:grid-cols-[120px_1fr]">
                    <p className="font-mono text-sm text-brand">{label}</p>
                    <p className="font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {["Purpose match", "Blast radius", "Evidence lock"].map((item, index) => (
                  <div key={item} className="rounded-md border border-line bg-panel-strong p-4">
                    <p className="font-mono text-xs text-brand">0{index + 1}</p>
                    <p className="mt-2 font-black text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
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
