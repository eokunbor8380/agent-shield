import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { requireSession } from "@/lib/auth";
import { customPolicyLibrary, policyTemplates, requiredBaselinePolicies, signaturePolicies, type PolicyTemplate } from "@/lib/policyLibrary";
import { readStore } from "@/lib/store";

function PolicyCard({ policy, activeNames }: { policy: PolicyTemplate; activeNames: Set<string> }) {
  const isActive = activeNames.has(policy.name);

  return (
    <article className="rounded-md border border-line bg-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-brand">{policy.category}</p>
          <h3 className="mt-3 text-xl font-black text-white">{policy.name}</h3>
        </div>
        <span className={`rounded-md px-3 py-1 text-xs font-black ${isActive ? "bg-brand text-slate-950" : "bg-panel-strong text-warning"}`}>
          {isActive ? "Active" : "Available"}
        </span>
      </div>
      <p className="mt-4 min-h-24 leading-7 text-muted">{policy.rule}</p>
      <div className="mt-5 grid gap-3 text-sm">
        <div className="rounded-md bg-panel-strong p-3">
          <p className="font-bold text-white">Why customers use it</p>
          <p className="mt-2 leading-6 text-muted">{policy.businessValue}</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <p className="rounded-md border border-line p-3 font-semibold text-muted">Mode: {policy.enforcementMode}</p>
          <p className="rounded-md border border-line p-3 font-semibold text-muted">Risk: {policy.riskTier}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <form action="/api/policies" method="post">
          <input type="hidden" name="action" value="activate" />
          <input type="hidden" name="templateId" value={policy.id} />
          <button className="rounded-md bg-brand px-4 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
            {isActive ? "Re-apply" : "Activate"}
          </button>
        </form>
        <form action="/api/policies" method="post">
          <input type="hidden" name="action" value="clone" />
          <input type="hidden" name="templateId" value={policy.id} />
          <button className="rounded-md border border-line px-4 py-3 text-sm font-black text-white hover:border-brand" type="submit">
            Clone custom
          </button>
        </form>
      </div>
    </article>
  );
}

export default async function PolicyPage() {
  const session = await requireSession();
  const store = await readStore();
  const tenantPolicies = store.policies.filter((policy) => policy.tenantId === session.tenantId);
  const activePolicies = tenantPolicies.filter((policy) => policy.status === "Active");
  const draftPolicies = tenantPolicies.filter((policy) => policy.status === "Draft");
  const activeNames = new Set(activePolicies.map((policy) => policy.name.replace(/ Custom$/, "")));

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Policy center"
          title="Agent governance policies customers can apply by use case."
          description="AgentShield ships baseline controls, signature runtime policies, and custom policy packs that tenants can activate or clone for their own business needs."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/policy/simulate" className="inline-flex rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong">
            Open policy simulator
          </Link>
          <Link href="/reports" className="inline-flex rounded-md border border-line px-5 py-3 text-sm font-black text-white hover:border-brand">
            View policy evidence
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <Panel title="Active">
            <p className="text-4xl font-black text-white">{activePolicies.length}</p>
            <p className="mt-2 text-sm text-muted">Tenant policies enforced or monitored.</p>
          </Panel>
          <Panel title="Drafts">
            <p className="text-4xl font-black text-white">{draftPolicies.length}</p>
            <p className="mt-2 text-sm text-muted">Cloned custom policies ready to tune.</p>
          </Panel>
          <Panel title="Library">
            <p className="text-4xl font-black text-white">{policyTemplates.length}</p>
            <p className="mt-2 text-sm text-muted">Reusable policy templates.</p>
          </Panel>
          <Panel title="Signature">
            <p className="text-4xl font-black text-white">{signaturePolicies.length}</p>
            <p className="mt-2 text-sm text-muted">AgentShield differentiators.</p>
          </Panel>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black text-white">Active tenant policies</h2>
          <div className="mt-5 grid gap-4">
            {tenantPolicies.map((policy) => (
              <article key={policy.id} className="rounded-md border border-line bg-panel p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_160px_140px] lg:items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-brand">{policy.pack} | {policy.source}</p>
                    <h3 className="mt-2 text-xl font-black text-white">{policy.name}</h3>
                    <p className="mt-3 leading-7 text-muted">{policy.rule}</p>
                    <p className="mt-3 text-sm font-semibold text-muted">Evidence: {policy.evidence.join(", ") || "Decision trace"}</p>
                  </div>
                  <div className="grid gap-2 text-sm font-semibold text-muted">
                    <span className="rounded-md bg-panel-strong p-3">Mode: {policy.enforcementMode}</span>
                    <span className="rounded-md bg-panel-strong p-3">Risk: {policy.riskTier}</span>
                  </div>
                  <form action="/api/policies" method="post">
                    <input type="hidden" name="action" value="deactivate" />
                    <input type="hidden" name="policyId" value={policy.id} />
                    <button className="w-full rounded-md border border-line px-4 py-3 text-sm font-black text-white hover:border-brand" type="submit">
                      Deactivate
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-black text-white">Required baseline policies</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {requiredBaselinePolicies.map((policy) => <PolicyCard key={policy.id} policy={policy} activeNames={activeNames} />)}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-black text-white">AgentShield signature policies</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {signaturePolicies.map((policy) => <PolicyCard key={policy.id} policy={policy} activeNames={activeNames} />)}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-black text-white">Custom policy library</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {customPolicyLibrary.map((policy) => <PolicyCard key={policy.id} policy={policy} activeNames={activeNames} />)}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
