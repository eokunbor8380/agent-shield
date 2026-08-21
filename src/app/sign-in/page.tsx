import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getSession } from "@/lib/auth";

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const session = await getSession();
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/dashboard";

  if (session) {
    redirect(next);
  }

  return (
    <AppShell>
      <section className="mx-auto grid min-h-[70vh] max-w-7xl items-center px-6 py-12">
        <div className="max-w-xl rounded-md border border-line bg-panel p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Phase 2 sign-in</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white">Access the AgentShield console.</h1>
          <p className="mt-5 leading-7 text-muted">
            This free demo sign-in protects the console with a secure cookie. Production authentication is ready to
            move to Clerk, Supabase Auth, or Auth.js when we add real users.
          </p>
          <form action="/api/auth/sign-in" method="post" className="mt-8 grid gap-4">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2">
              <span className="font-bold text-white">Demo email</span>
              <input
                name="email"
                type="email"
                defaultValue="leeokk80@gmail.com"
                className="rounded-md border border-line bg-background px-4 py-3 text-white"
              />
            </label>
            <button className="rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
              Continue as demo admin
            </button>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
