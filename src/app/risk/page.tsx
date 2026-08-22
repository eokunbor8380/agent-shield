import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { StatusPill } from "@/components/StatusPill";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export default async function RiskPage() {
  await requireSession();
  const { findings } = await readStore();
  const severityOrder = ["critical", "high", "medium", "low"];
  const groupedFindings = severityOrder.map((severity) => ({
    severity,
    findings: findings.filter((finding) => finding.severity === severity),
  }));

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Risk center"
          title="Findings, exposure, and remediation priorities."
          description="Phase 1 models the findings queue. Later stages add scoring formulas, graph blast-radius paths, and remediation workflows."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {groupedFindings.map((group) => (
            <a key={group.severity} href={`#${group.severity}-risks`} className="rounded-md border border-line bg-panel p-5 hover:border-brand hover:bg-panel-strong">
              <StatusPill value={group.severity} />
              <p className="mt-5 text-4xl font-black text-white">{group.findings.length}</p>
              <p className="mt-2 text-sm font-semibold text-muted">View {group.severity} findings</p>
            </a>
          ))}
        </div>

        <div className="mt-10 grid gap-8">
          {groupedFindings.map((group) => (
            <section key={group.severity} id={`${group.severity}-risks`} className="scroll-mt-28">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-black capitalize text-white">{group.severity} risks</h2>
                <p className="text-sm font-semibold text-muted">{group.findings.length} finding(s)</p>
              </div>

              {group.findings.length ? (
                <div className="grid gap-5">
                  {group.findings.map((finding) => (
                    <article key={finding.id} className="rounded-md border border-line bg-panel p-5">
                      <div className="grid gap-5 lg:grid-cols-[150px_1fr_220px] lg:items-start">
                        <StatusPill value={finding.severity} />
                        <div>
                          <p className="font-mono text-xs text-brand">{finding.id}</p>
                          <h3 className="mt-1 text-xl font-black text-white">{finding.title}</h3>
                          <p className="mt-2 text-sm font-semibold text-muted">{finding.entity}</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-white">{finding.owner}</p>
                          <p className="text-muted">Due: {finding.due}</p>
                          <p className="mt-2 font-semibold text-muted">{finding.status}</p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 lg:grid-cols-3">
                        <Panel title="Risk metadata">
                          <div className="grid gap-2 text-sm font-semibold text-muted">
                            <p>Entity: <span className="text-white">{finding.entity}</span></p>
                            <p>Status: <span className="text-white">{finding.status}</span></p>
                            <p>Owner: <span className="text-white">{finding.owner}</span></p>
                            <p>Due: <span className="text-white">{finding.due}</span></p>
                          </div>
                        </Panel>
                        <Panel title="Impact and evidence">
                          <p className="text-sm leading-6 text-muted">{finding.impact}</p>
                          <ul className="mt-4 grid gap-2 text-sm font-semibold text-muted">
                            {finding.evidence.map((item) => (
                              <li key={item} className="rounded-md bg-panel-strong px-3 py-2">{item}</li>
                            ))}
                          </ul>
                        </Panel>
                        <Panel title="Recommended fix">
                          <ul className="grid gap-2 text-sm font-semibold text-muted">
                            {finding.remediation.map((item) => (
                              <li key={item} className="rounded-md bg-panel-strong px-3 py-2">{item}</li>
                            ))}
                          </ul>
                          <Link href={`/risk/${finding.id}`} className="mt-5 inline-flex rounded-md border border-line px-4 py-3 text-sm font-black text-white hover:border-brand">
                            Open full finding
                          </Link>
                        </Panel>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-line bg-panel p-5">
                  <p className="font-bold text-white">No {group.severity} risks identified.</p>
                  <p className="mt-2 text-sm leading-6 text-muted">Connector sync and policy evaluation will populate this section when matching findings appear.</p>
                </div>
              )}
            </section>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
