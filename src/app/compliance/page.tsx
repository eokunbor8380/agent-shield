import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { SectionIntro } from "@/components/SectionIntro";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export default async function CompliancePage() {
  await requireSession();
  const { evidenceControls } = await readStore();

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionIntro
          eyebrow="Compliance evidence"
          title="Control mappings backed by agent identity and authorization evidence."
          description="Phase 1.2 introduces the evidence model. Later, these rows will connect to immutable events, attestations, export packages, and retention policies."
        />
        <div className="mt-10 grid gap-5">
          {evidenceControls.map((item) => (
            <Link key={`${item.framework}-${item.control}`} href={`/compliance/${item.slug}`}>
            <Panel title={item.framework}>
              <div className="grid gap-4 md:grid-cols-[1fr_160px] md:items-center">
                <p className="text-lg font-semibold leading-8 text-white">{item.control}</p>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-center text-xs font-black uppercase tracking-wide text-brand">
                  {item.status}
                </span>
              </div>
            </Panel>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
