import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function NotFound() {
  return (
    <AppShell>
      <section className="mx-auto grid min-h-[60vh] max-w-7xl items-center px-6 py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">404</p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Page not found.</h1>
          <p className="mt-5 leading-7 text-muted">
            The page may have moved, or the console route may require a fresh sign-in.
          </p>
          <Link href="/" className="mt-8 inline-flex rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong">
            Go home
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
