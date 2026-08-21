import { NextResponse } from "next/server";
import { agents } from "@/data/agentShield";

export function GET() {
  return NextResponse.json({ data: agents });
}
