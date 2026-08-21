import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { StatusPill } from "@/components/StatusPill";
import { findings } from "@/data/agentShield";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export function generateStaticParams() {
  return findings.map((finding) => ({ id: finding.id }));
}

export async function generateMetadata({ params }: PageProps<"/risk/[id]">) {
  const { id } = await params;
  await requireSession();
  const store = await readStore();
  const finding = store.findings.find((item) => item.id === id) ?? null;

  return {
    title: finding ? `${finding.id} | Risk Finding` : "Risk Finding",
  };
}

export default async function FindingDetailPage({ params }: PageProps<"/risk/[id]">) {
  const { id } = await params;
  await requireSession();
  const store = await readStore();
  const finding = store.findings.find((item) => item.id === id) ?? null;

  if (!finding) {
    notFound();
  }

  const agent = finding.entityId ? store.agents.find((item) => item.id === finding.entityId) ?? null : null;

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link href="/risk" className="text-sm font-bold text-brand hover:text-brand-strong">
          Back to risk center
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.38fr] lg:items-start">
          <div>
            <p className="font-mono text-sm text-brand">{finding.id}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">
              {finding.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{finding.impact}</p>
          </div>
          <Panel title="Response status">
            <div className="grid gap-3 text-sm">
              <StatusPill value={finding.severity} />
              <p className="flex justify-between gap-4 border-b border-line pb-2">
                <span className="text-muted">State</span>
                <span className="font-bold text-white">{finding.status}</span>
              </p>
              <p className="flex justify-between gap-4 border-b border-line pb-2">
                <span className="text-muted">Owner</span>
                <span className="font-bold text-white">{finding.owner}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted">Due</span>
                <span className="font-bold text-white">{finding.due}</span>
              </p>
              <form action={`/api/findings/${finding.id}/status`} method="post" className="grid gap-3 pt-3">
                <input type="hidden" name="status" value="In remediation" />
                <button className="rounded-md bg-brand px-4 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
                  Start remediation
                </button>
              </form>
            </div>
          </Panel>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Panel title="Affected entity">
            <p className="text-xl font-black text-white">{finding.entity}</p>
            {agent ? (
              <Link href={`/agents/${agent.id}`} className="mt-5 inline-flex rounded-md border border-line px-4 py-2 text-sm font-bold text-white hover:border-brand">
                Open Agent Passport
              </Link>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted">This Phase 1 mock record represents an external identity not yet linked to an Agent Passport.</p>
            )}
          </Panel>
          <Panel title="Evidence">
            <ul className="grid gap-3 text-sm font-semibold text-muted">
              {finding.evidence.map((item) => (
                <li key={item} className="rounded-md bg-panel-strong px-3 py-2">{item}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Remediation plan">
            <ul className="grid gap-3 text-sm font-semibold text-muted">
              {finding.remediation.map((item) => (
                <li key={item} className="rounded-md bg-panel-strong px-3 py-2">{item}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
