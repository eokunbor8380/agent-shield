import { AppShell } from "@/components/AppShell";
import { SectionIntro } from "@/components/SectionIntro";

export default function ContactPage() {
  return (
    <AppShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_0.9fr]">
        <SectionIntro
          eyebrow="Demo request"
          title="Start with a focused AgentShield walkthrough."
          description="This no-cost Phase 1 form routes through an AgentShield API endpoint and opens a prepared email. Later, we can add Resend free-tier backend delivery."
        />
        <form action="/api/demo-request" method="post" className="grid gap-5 rounded-md border border-line bg-panel p-6">
          <label className="grid gap-2">
            <span className="font-bold text-white">Name</span>
            <input name="name" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
          </label>
          <label className="grid gap-2">
            <span className="font-bold text-white">Business email</span>
            <input name="email" type="email" required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
          </label>
          <label className="grid gap-2">
            <span className="font-bold text-white">Message</span>
            <textarea name="message" rows={6} required className="rounded-md border border-line bg-background px-4 py-3 text-white" />
          </label>
          <button className="rounded-md bg-brand px-5 py-3 text-sm font-black text-slate-950 hover:bg-brand-strong" type="submit">
            Send demo request
          </button>
        </form>
      </section>
    </AppShell>
  );
}
