import { NextResponse } from "next/server";
import { integrations } from "@/data/agentShield";

export function GET() {
  return NextResponse.json({ data: integrations });
}
