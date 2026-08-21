import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await requireSession();
  const { agents } = await readStore();
  const agent = agents.find((item) => item.id === id) ?? null;

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({ data: agent });
}
