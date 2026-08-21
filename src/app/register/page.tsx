import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getSession } from "@/lib/auth";

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const session = await getSession();
  const params = await searchParams;

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AppShell>
      <section className="mx-auto grid min-h-[70vh] max-w-7xl items-center px-6 py-12">
        <div className="max-w-xl rounded-md border border-line bg-panel p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Create workspace</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white">Register for AgentShield.</h1>
          <p className="mt-5 leading-7 text-muted">
            Create your first workspace owner account. Passwords are hashed before storage.
          </p>
          {params.error === "exists" ? (
            <p className="mt-5 rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm font-bold text-warning">
              An account with this email already exists. Sign in instead.
            </p>
          ) : null}
          {params.error === "invalid" ? (
            <p className="mt-5 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
              Enter a name, valid email, and password with at least 8 characters.
            </p>
          ) : null}
          <form action="/api/auth/register" method="post" className="mt-8 grid gap-4">
            <label className="grid gap-2">
              <span className="font-bold text-white">Name</span>
              <input name="name" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
            </label>
            <label className="grid gap-2">
              <span className="font-bold text-white">Company or workspace</span>
              <input name="company" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
            </label>
            <label className="grid gap-2">
              <span className="font-bold text-white">Email</span>
              <input name="email" type="email" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
            </label>
            <label className="grid gap-2">
              <span className="font-bold text-white">Password</span>
              <input name="password" type="password" minLength={8} required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
            </label>
            <button className="rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
              Register and open console
            </button>
          </form>
          <p className="mt-6 text-sm text-muted">
            Already have credentials?{" "}
            <Link href="/sign-in" className="font-bold text-brand hover:text-brand-strong">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
