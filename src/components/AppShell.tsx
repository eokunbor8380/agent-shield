import Link from "next/link";
import { getSession } from "@/lib/auth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Agents", href: "/agents" },
  { label: "Risk", href: "/risk" },
  { label: "Policy", href: "/policy" },
  { label: "Security", href: "/security" },
  { label: "Compliance", href: "/compliance" },
  { label: "Integrations", href: "/integrations" },
  { label: "Settings", href: "/settings" },
  { label: "Contact", href: "/contact" },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-line bg-background/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-brand/50 bg-brand/10 font-black text-brand">
              AS
            </span>
            <span>
              <span className="block text-lg font-black">AgentShield</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Agent security control plane
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} className="hover:text-brand" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          {session ? (
            <form action="/api/auth/sign-out" method="post" className="hidden sm:block">
              <button className="rounded-md border border-line px-4 py-2 text-sm font-black text-white hover:border-brand" type="submit">
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/sign-in"
              className="hidden rounded-md bg-brand px-4 py-2 text-sm font-black text-slate-950 hover:bg-brand-strong sm:inline-block"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>
      {children}
    </main>
  );
}
