import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { StatusPill } from "@/components/StatusPill";
import { agents } from "@/data/agentShield";

export default function AgentsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Agent inventory"
          title="Canonical records for agents and non-human identities."
          description="Every entity will eventually carry provenance, ownership, data reach, tools, credentials metadata, and a signed Agent Passport."
        />
        <div className="mt-10 grid gap-5">
          {agents.map((agent) => (
            <article key={agent.id} className="rounded-md border border-line bg-panel p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-mono text-sm text-brand">{agent.id}</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{agent.name}</h2>
                  <p className="mt-2 text-muted">{agent.type} | {agent.owner} | {agent.environment} | {agent.assurance}</p>
                </div>
                <StatusPill value={agent.status} />
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-md bg-panel-strong p-4">
                  <p className="text-sm text-muted">AgentTrust</p>
                  <p className="mt-2 text-2xl font-black text-white">{agent.trustScore}</p>
                </div>
                <div className="rounded-md bg-panel-strong p-4">
                  <p className="text-sm text-muted">Risk score</p>
                  <p className="mt-2 text-2xl font-black text-white">{agent.riskScore}</p>
                </div>
                <div className="rounded-md bg-panel-strong p-4">
                  <p className="text-sm text-muted">Last seen</p>
                  <p className="mt-2 text-lg font-black text-white">{agent.lastSeen}</p>
                </div>
                <div className="rounded-md bg-panel-strong p-4 md:col-span-2">
                  <p className="text-sm text-muted">Tools and data reach</p>
                  <p className="mt-2 font-semibold text-white">{agent.tools.join(", ")}</p>
                  <p className="mt-1 text-sm text-muted">{agent.data}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <Panel title="Passport purpose">
                  <p className="leading-7 text-muted">{agent.passport.purpose}</p>
                </Panel>
                <Panel title="Credential metadata">
                  <ul className="grid gap-2 text-sm font-semibold text-muted">
                    {agent.passport.credentials.map((credential) => <li key={credential}>{credential}</li>)}
                  </ul>
                </Panel>
                <Panel title="Controls and evidence">
                  <ul className="grid gap-2 text-sm font-semibold text-muted">
                    {[...agent.passport.controls, ...agent.passport.evidence].slice(0, 5).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </Panel>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
