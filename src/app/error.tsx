"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-2xl rounded-md border border-line bg-panel p-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-danger">Application error</p>
        <h1 className="mt-4 text-4xl font-black text-white">Something failed.</h1>
        <p className="mt-5 leading-7 text-muted">
          Try the action again. If it repeats, check the latest deployment logs in Vercel.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={reset} className="rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="button">
            Try again
          </button>
          <Link href="/" className="rounded-md border border-line px-5 py-3 text-sm font-black text-white hover:border-brand">
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
