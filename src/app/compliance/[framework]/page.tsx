import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { evidenceControls } from "@/data/agentShield";
import { requireSession } from "@/lib/auth";
import { buildEvidenceExport } from "@/lib/securityEngine";
import { readStore } from "@/lib/store";

export function generateStaticParams() {
  return evidenceControls.map((control) => ({ framework: control.slug }));
}

export async function generateMetadata({ params }: PageProps<"/compliance/[framework]">) {
  const { framework } = await params;
  await requireSession();
  const store = await readStore();
  const control = store.evidenceControls.find((item) => item.slug === framework) ?? null;

  return {
    title: control ? `${control.framework} | Evidence` : "Compliance Evidence",
  };
}

export default async function ComplianceDetailPage({ params }: PageProps<"/compliance/[framework]">) {
  const { framework } = await params;
  await requireSession();
  const store = await readStore();
  const control = store.evidenceControls.find((item) => item.slug === framework) ?? null;

  if (!control) {
    notFound();
  }
  const evidencePackage = buildEvidenceExport(store, framework);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link href="/compliance" className="text-sm font-bold text-brand hover:text-brand-strong">
          Back to compliance
        </Link>
        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{control.status}</p>
          <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">{control.framework}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{control.control}</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.7fr]">
          <Panel title="Evidence package">
            <ul className="grid gap-3 text-sm font-semibold text-muted">
              {control.evidence.map((item) => (
                <li key={item} className="rounded-md bg-panel-strong px-3 py-2">{item}</li>
              ))}
            </ul>
            <a
              href={`/api/evidence/export/${control.slug}`}
              className="mt-5 inline-flex rounded-md bg-brand px-4 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong"
            >
              Export JSON evidence
            </a>
          </Panel>
          <Panel title="Package summary">
            <p className="leading-7 text-muted">
              This export includes {evidencePackage.auditEvents.length} audit events, {evidencePackage.connectorRuns.length} connector runs,
              {evidencePackage.findings.length} findings, and current posture metrics.
            </p>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
