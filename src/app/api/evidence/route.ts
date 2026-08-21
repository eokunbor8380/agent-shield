import { NextResponse } from "next/server";
import { evidenceControls } from "@/data/agentShield";

export function GET() {
  return NextResponse.json({ data: evidenceControls });
}
