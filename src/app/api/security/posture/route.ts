import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { buildSecurityPosture } from "@/lib/securityEngine";
import { readStore } from "@/lib/store";

export async function GET() {
  await requireSession();
  const store = await readStore();

  return NextResponse.json({ data: buildSecurityPosture(store) });
}
