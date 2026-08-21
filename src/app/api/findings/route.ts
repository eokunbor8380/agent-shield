import { NextResponse } from "next/server";
import { findings } from "@/data/agentShield";

export function GET() {
  return NextResponse.json({ data: findings });
}
