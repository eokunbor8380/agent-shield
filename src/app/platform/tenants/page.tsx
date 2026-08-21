import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { isPlatformOwner, requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export default async function PlatformTenantsPage({ searchParams }: PageProps<"/platform/tenants">) {
  const session = await requireSession();
  const params = await searchParams;

  if (!isPlatformOwner(session)) {
    return (
      <AppShell>
        <section className="mx-auto max-w-7xl px-6 py-12">
          <SectionIntro
            eyebrow="Customers"
            title="Platform owner access required."
            description="Customer tenant management is only available to the AgentShield application owner."
          />
        </section>
      </AppShell>
    );
  }

  const store = await readStore();
  const tenants = store.tenants.map((tenant) => ({
    ...tenant,
    users: store.users.filter((user) => user.tenantId === tenant.id),
    roles: store.roles.filter((role) => role.tenantId === tenant.id),
  }));
  const errorMessages: Record<string, string> = {
    invalid: "Enter company, owner name, owner email, and a password with at least 8 characters.",
    exists: "A tenant with that company name or owner email already exists.",
  };
  const error = typeof params.error === "string" ? errorMessages[params.error] : null;

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Customer tenants"
          title="Create and manage customer workspaces."
          description="Use this platform owner screen to create tenants for customers such as ABC, ZYX, and Ginger Limited. Each tenant receives its own Super Admin account and role set."
        />
        {error ? (
          <p className="mt-8 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
            {error}
          </p>
        ) : null}
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Panel title="Create customer tenant">
            <form action="/api/platform/tenants" method="post" className="grid gap-4">
              <label className="grid gap-2">
                <span className="font-bold text-white">Company name</span>
                <input name="company" required placeholder="ABC Company" className="rounded-md border border-line bg-background px-4 py-3 text-white" />
              </label>
              <label className="grid gap-2">
                <span className="font-bold text-white">Tenant owner name</span>
                <input name="ownerName" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
              </label>
              <label className="grid gap-2">
                <span className="font-bold text-white">Tenant owner email</span>
                <input name="ownerEmail" type="email" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
              </label>
              <label className="grid gap-2">
                <span className="font-bold text-white">Temporary password</span>
                <input name="temporaryPassword" type="password" minLength={8} required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
              </label>
              <label className="grid gap-2">
                <span className="font-bold text-white">Region</span>
                <select name="region" defaultValue="us-east" className="rounded-md border border-line bg-background px-4 py-3 text-white">
                  <option value="us-east">us-east</option>
                  <option value="us-west">us-west</option>
                  <option value="eu-west">eu-west</option>
                </select>
              </label>
              <button className="rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
                Create tenant
              </button>
            </form>
          </Panel>

          <Panel title="Customers">
            <div className="grid gap-4">
              {tenants.map((tenant) => (
                <article key={tenant.id} className="rounded-md bg-panel-strong p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-bold text-white">{tenant.name}</p>
                      <p className="mt-1 font-mono text-xs text-brand">{tenant.id}</p>
                      <p className="mt-2 text-sm text-muted">{tenant.region} | {tenant.status ?? "Active"} | {tenant.plan}</p>
                    </div>
                    <div className="text-sm text-muted md:text-right">
                      <p><span className="font-bold text-white">{tenant.users.length}</span> users</p>
                      <p><span className="font-bold text-white">{tenant.roles.length}</span> roles</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {tenant.users.slice(0, 3).map((user) => (
                      <p key={user.id} className="text-sm text-muted">
                        {user.name} | {user.email} | {user.role}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
