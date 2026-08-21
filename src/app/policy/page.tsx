import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SectionIntro } from "@/components/SectionIntro";
import { policies } from "@/data/agentShield";

export default function PolicyPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Policy center"
          title="Deny-by-default decisions with explainable outcomes."
          description="The production policy platform will support versioning, simulation, approval gates, rollback, and signed bundles. Phase 1 shows the operating model."
        />
        <div className="mt-8">
          <Link href="/policy/simulate" className="inline-flex rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong">
            Open policy simulator
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {policies.map((policy) => (
            <article key={policy.name} className="rounded-md border border-line bg-panel p-6">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{policy.decision}</p>
              <h2 className="mt-4 text-2xl font-black text-white">{policy.name}</h2>
              <p className="mt-4 leading-7 text-muted">{policy.rule}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
