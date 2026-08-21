import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { canManageUsers, requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export default async function UsersPage({ searchParams }: PageProps<"/settings/users">) {
  const session = await requireSession();
  const params = await searchParams;
  const store = await readStore();
  const users = store.users.filter((user) => user.tenantId === session.tenantId);
  const roles = store.roles.filter((role) => role.tenantId === session.tenantId);
  const canManage = canManageUsers(session.role);

  const errorMessages: Record<string, string> = {
    invalid: "Enter a name, valid email, role, and password with at least 8 characters.",
    exists: "A user with that email already exists.",
    role: "Choose a valid role.",
    password: "Password must be at least 8 characters.",
  };
  const error = typeof params.error === "string" ? errorMessages[params.error] : null;

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link href="/settings" className="text-sm font-bold text-brand hover:text-brand-strong">
          Back to settings
        </Link>
        <SectionIntro
          eyebrow="User management"
          title="Create users, assign roles, and reset passwords."
          description="Super Admin and Admin users can manage user accounts for this AgentShield workspace."
        />
        {error ? (
          <p className="mt-8 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
            {error}
          </p>
        ) : null}

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Panel title="Create new user">
            {canManage ? (
              <form action="/api/users" method="post" className="grid gap-4">
                <label className="grid gap-2">
                  <span className="font-bold text-white">Name</span>
                  <input name="name" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
                </label>
                <label className="grid gap-2">
                  <span className="font-bold text-white">Email</span>
                  <input name="email" type="email" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
                </label>
                <label className="grid gap-2">
                  <span className="font-bold text-white">Role</span>
                  <select name="role" required className="rounded-md border border-line bg-background px-4 py-3 text-white">
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="font-bold text-white">Temporary password</span>
                  <input name="password" type="password" minLength={8} required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
                </label>
                <button className="rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
                  Create user
                </button>
              </form>
            ) : (
              <p className="leading-7 text-muted">Only Super Admin and Admin users can create accounts.</p>
            )}
          </Panel>

          <Panel title="Workspace users">
            <div className="grid gap-4">
              {users.map((user) => (
                <article key={user.id} className="rounded-md bg-panel-strong p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="mt-1 text-sm text-muted">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand">
                      {user.role}
                    </span>
                  </div>
                  {canManage ? (
                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <form action={`/api/users/${user.id}/role`} method="post" className="grid gap-3">
                        <label className="grid gap-2">
                          <span className="text-sm font-bold text-white">Assign role</span>
                          <select name="role" defaultValue={user.role} className="rounded-md border border-line bg-background px-4 py-3 text-white">
                            {roles.map((role) => (
                              <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                          </select>
                        </label>
                        <button className="rounded-md border border-line px-4 py-3 text-sm font-black text-white hover:border-brand" type="submit">
                          Update role
                        </button>
                      </form>
                      <form action={`/api/users/${user.id}/reset-password`} method="post" className="grid gap-3">
                        <label className="grid gap-2">
                          <span className="text-sm font-bold text-white">New temporary password</span>
                          <input name="password" type="password" minLength={8} required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
                        </label>
                        <button className="rounded-md border border-danger/50 px-4 py-3 text-sm font-black text-danger hover:bg-danger/10" type="submit">
                          Reset password
                        </button>
                      </form>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
