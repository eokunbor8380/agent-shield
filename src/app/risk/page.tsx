import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SectionIntro } from "@/components/SectionIntro";
import { StatusPill } from "@/components/StatusPill";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

function detectedDate(index: number) {
  const detectedDates = ["2026-08-21", "2026-08-20", "2026-08-16", "2026-08-12"];
  return detectedDates[index] ?? "2026-08-10";
}

export default async function RiskPage() {
  await requireSession();
  const store = await readStore();
  const { findings } = store;
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
                <div className="overflow-x-auto rounded-md border border-line bg-panel">
                  <table className="min-w-[1180px] w-full border-collapse text-left text-sm">
                    <thead className="bg-panel-strong text-xs font-black uppercase tracking-[0.12em] text-muted">
                      <tr>
                        <th className="px-4 py-3">Severity</th>
                        <th className="px-4 py-3">Risk ID</th>
                        <th className="px-4 py-3">Agent / entity</th>
                        <th className="px-4 py-3">Risk title</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Owner</th>
                        <th className="px-4 py-3">Detected</th>
                        <th className="px-4 py-3">Last seen</th>
                        <th className="px-4 py-3">Due</th>
                        <th className="px-4 py-3">Impact</th>
                        <th className="px-4 py-3">Recommended fix</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.findings.map((finding, index) => {
                        const agent = finding.entityId ? store.agents.find((item) => item.id === finding.entityId) : null;

                        return (
                          <tr key={finding.id} className="border-t border-line align-top">
                            <td className="px-4 py-4"><StatusPill value={finding.severity} /></td>
                            <td className="px-4 py-4 font-mono text-xs text-brand">{finding.id}</td>
                            <td className="px-4 py-4">
                              <p className="font-bold text-white">{finding.entity}</p>
                              <p className="mt-1 text-xs text-muted">{agent ? agent.type : "External identity"}</p>
                            </td>
                            <td className="px-4 py-4 font-bold text-white">{finding.title}</td>
                            <td className="px-4 py-4 font-semibold text-muted">{finding.status}</td>
                            <td className="px-4 py-4 font-semibold text-white">{finding.owner}</td>
                            <td className="px-4 py-4 text-muted">{detectedDate(index)}</td>
                            <td className="px-4 py-4 text-muted">{agent?.lastSeen ?? "Unknown"}</td>
                            <td className="px-4 py-4 text-muted">{finding.due}</td>
                            <td className="max-w-[260px] px-4 py-4 leading-6 text-muted">{finding.impact}</td>
                            <td className="max-w-[260px] px-4 py-4 leading-6 text-muted">{finding.remediation[0]}</td>
                            <td className="px-4 py-4">
                              <Link href={`/risk/${finding.id}`} className="whitespace-nowrap rounded-md border border-line px-3 py-2 text-xs font-black text-white hover:border-brand">
                                Open
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
