import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export async function GET() {
  await requireSession();
  const { evidenceControls } = await readStore();
  return NextResponse.json({ data: evidenceControls });
}
