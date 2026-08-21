import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { canManageRoles } from "@/lib/auth";
import { permissionCatalog, readStore } from "@/lib/store";
import { requireSession } from "@/lib/auth";

export default async function RolesPage({ searchParams }: PageProps<"/settings/roles">) {
  const session = await requireSession();
  const params = await searchParams;
  const store = await readStore();
  const roles = store.roles.filter((role) => role.tenantId === session.tenantId);
  const canCreate = canManageRoles(session.role);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link href="/settings" className="text-sm font-bold text-brand hover:text-brand-strong">
          Back to settings
        </Link>
        <SectionIntro
          eyebrow="Roles and permissions"
          title="Control who can administer, operate, or only view AgentShield."
          description="Super Admin and Admin users can create custom roles with the exact permissions their organization needs."
        />
        {params.error === "invalid" ? (
          <p className="mt-8 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
            Custom roles need a name and at least one permission.
          </p>
        ) : null}
        <div className="mt-10 grid gap-5">
          {roles.map((role) => (
            <Panel key={role.id} title={role.name}>
              <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{role.type}</p>
                  <p className="mt-3 leading-7 text-muted">{role.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span key={permission} className="rounded-full bg-panel-strong px-3 py-1 text-xs font-bold text-muted">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </Panel>
          ))}
        </div>

        <div className="mt-8">
          <Panel title="Create custom role">
            {canCreate ? (
              <form action="/api/roles" method="post" className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="font-bold text-white">Role name</span>
                    <input name="name" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
                  </label>
                  <label className="grid gap-2">
                    <span className="font-bold text-white">Description</span>
                    <input name="description" className="rounded-md border border-line bg-background px-4 py-3 text-white" />
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {permissionCatalog.map((permission) => (
                    <label key={permission.id} className="flex gap-3 rounded-md bg-panel-strong p-3 text-sm">
                      <input name="permissions" value={permission.id} type="checkbox" className="mt-1 h-4 w-4" />
                      <span>
                        <span className="block font-bold text-white">{permission.label}</span>
                        <span className="block text-muted">{permission.group}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <button className="w-fit rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
                  Create custom role
                </button>
              </form>
            ) : (
              <p className="leading-7 text-muted">Only Super Admin and Admin users can create custom roles.</p>
            )}
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
