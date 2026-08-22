import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { getSession, isPlatformOwner } from "@/lib/auth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Onboarding", href: "/onboarding" },
  { label: "Agents", href: "/agents" },
  { label: "Risk", href: "/risk" },
  { label: "Policy", href: "/policy" },
  { label: "Security", href: "/security" },
  { label: "Compliance", href: "/compliance" },
  { label: "Reports", href: "/reports" },
  { label: "Integrations", href: "/integrations" },
  { label: "Settings", href: "/settings" },
  { label: "Contact", href: "/contact" },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <main className="app-background min-h-screen text-foreground">
      <header className="border-b border-line bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <BrandLogo />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} className="hover:text-brand" href={item.href}>
                {item.label}
              </Link>
            ))}
            {isPlatformOwner(session) ? (
              <Link className="hover:text-brand" href="/platform/tenants">
                Customers
              </Link>
            ) : null}
          </nav>
          {session ? (
            <form action="/api/auth/sign-out" method="post" className="hidden sm:block">
              <button className="rounded-md border border-line px-4 py-2 text-sm font-black text-white hover:border-brand" type="submit">
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/register"
              className="hidden rounded-md bg-brand px-4 py-2 text-sm font-black text-slate-950 hover:bg-brand-strong sm:inline-block"
            >
              Register
            </Link>
          )}
        </div>
      </header>
      {children}
      <footer className="border-t border-line bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>AgentShield protects autonomous identities, policy decisions, and evidence trails.</p>
          <div className="flex flex-wrap gap-4 font-semibold">
            <Link href="/security" className="hover:text-brand">Security</Link>
            <Link href="/compliance" className="hover:text-brand">Evidence</Link>
            <Link href="/contact" className="hover:text-brand">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
