import { AppShell } from "@/components/AppShell";
import { SectionIntro } from "@/components/SectionIntro";
import { StatusPill } from "@/components/StatusPill";
import { findings } from "@/data/agentShield";

export default function RiskPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Risk center"
          title="Findings, exposure, and remediation priorities."
          description="Phase 1 models the findings queue. Later stages add scoring formulas, graph blast-radius paths, and remediation workflows."
        />
        <div className="mt-10 overflow-hidden rounded-md border border-line">
          {findings.map((finding) => (
            <div key={finding.id} className="grid gap-4 border-b border-line bg-panel p-5 last:border-b-0 md:grid-cols-[140px_1fr_160px_120px] md:items-center">
              <StatusPill value={finding.severity} />
              <div>
                <p className="font-mono text-xs text-brand">{finding.id}</p>
                <h2 className="mt-1 font-bold text-white">{finding.title}</h2>
                <p className="mt-1 text-sm text-muted">{finding.entity}</p>
              </div>
              <p className="text-sm font-semibold text-muted">{finding.status}</p>
              <div className="text-sm">
                <p className="font-bold text-white">{finding.owner}</p>
                <p className="text-muted">{finding.due}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
