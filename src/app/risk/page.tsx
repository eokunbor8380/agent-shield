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

export default async function RiskPage({ searchParams }: PageProps<"/risk">) {
  await requireSession();
  const params = await searchParams;
  const store = await readStore();
  const { findings } = store;
  const severityOrder = ["critical", "high", "medium", "low"];
  const selectedSeverity = severityOrder.includes(String(params.severity)) ? String(params.severity) : null;
  const groupedFindings = severityOrder.map((severity) => ({
    severity,
    findings: findings.filter((finding) => finding.severity === severity),
  }));
  const selectedGroup = groupedFindings.find((group) => group.severity === selectedSeverity) ?? null;

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
            <Link
              key={group.severity}
              href={`/risk?severity=${group.severity}`}
              className={`rounded-md border p-5 hover:border-brand hover:bg-panel-strong ${selectedSeverity === group.severity ? "border-brand bg-panel-strong" : "border-line bg-panel"}`}
            >
              <StatusPill value={group.severity} />
              <p className="mt-5 text-4xl font-black text-white">{group.findings.length}</p>
              <p className="mt-2 text-sm font-semibold text-muted">View {group.severity} findings</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-8">
          {selectedGroup ? (
            <section id={`${selectedGroup.severity}-risks`} className="scroll-mt-28">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-black capitalize text-white">{selectedGroup.severity} risks</h2>
                <p className="text-sm font-semibold text-muted">{selectedGroup.findings.length} finding(s)</p>
              </div>

              {selectedGroup.findings.length ? (
                <div className="overflow-x-auto rounded-md border border-line bg-panel">
                  <table className="min-w-[1240px] w-full border-collapse text-left text-xs">
                    <thead className="bg-panel-strong text-[10px] font-black uppercase tracking-[0.12em] text-muted">
                      <tr>
                        <th className="px-3 py-2">Severity</th>
                        <th className="px-3 py-2">Risk ID</th>
                        <th className="px-3 py-2">Agent / entity</th>
                        <th className="px-3 py-2">Risk title</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Owner</th>
                        <th className="px-3 py-2">Detected</th>
                        <th className="px-3 py-2">Last seen</th>
                        <th className="px-3 py-2">Due</th>
                        <th className="px-3 py-2">Impact</th>
                        <th className="px-3 py-2">Recommended fix</th>
                        <th className="px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGroup.findings.map((finding, index) => {
                        const agent = finding.entityId ? store.agents.find((item) => item.id === finding.entityId) : null;

                        return (
                          <tr key={finding.id} className="border-t border-line align-top">
                            <td className="px-3 py-3"><StatusPill value={finding.severity} /></td>
                            <td className="px-3 py-3 font-mono text-[11px] text-brand">{finding.id}</td>
                            <td className="px-3 py-3">
                              <p className="font-bold leading-5 text-white">{finding.entity}</p>
                              <p className="mt-1 text-[11px] text-muted">{agent ? agent.type : "External identity"}</p>
                            </td>
                            <td className="max-w-[220px] px-3 py-3 font-bold leading-5 text-white">{finding.title}</td>
                            <td className="px-3 py-3 font-semibold text-muted">{finding.status}</td>
                            <td className="px-3 py-3 font-semibold text-white">{finding.owner}</td>
                            <td className="px-3 py-3 text-muted">{detectedDate(index)}</td>
                            <td className="px-3 py-3 text-muted">{agent?.lastSeen ?? "Unknown"}</td>
                            <td className="px-3 py-3 text-muted">{finding.due}</td>
                            <td className="max-w-[230px] px-3 py-3 leading-5 text-muted">{finding.impact}</td>
                            <td className="max-w-[220px] px-3 py-3 leading-5 text-muted">{finding.remediation[0]}</td>
                            <td className="px-3 py-3">
                              <Link href={`/risk/${finding.id}`} className="whitespace-nowrap rounded-md border border-line px-2 py-1.5 text-[11px] font-black text-white hover:border-brand">
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
                  <p className="font-bold text-white">No {selectedGroup.severity} risks identified.</p>
                  <p className="mt-2 text-sm leading-6 text-muted">Connector sync and policy evaluation will populate this section when matching findings appear.</p>
                </div>
              )}
            </section>
          ) : (
            <div className="rounded-md border border-line bg-panel p-6">
              <p className="text-xl font-black text-white">Select a risk category to view metadata.</p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                Click Critical, High, Medium, or Low above to open the matching risk table with agent metadata, status, owner, detected date, last seen, impact, and recommended fix.
              </p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
