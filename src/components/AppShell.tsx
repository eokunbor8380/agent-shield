import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Agents", href: "/agents" },
  { label: "Risk", href: "/risk" },
  { label: "Policy", href: "/policy" },
  { label: "Integrations", href: "/integrations" },
  { label: "Contact", href: "/contact" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
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
        </div>
      </header>
      {children}
    </main>
  );
}
