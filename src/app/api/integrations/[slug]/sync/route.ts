import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { runConnectorSync } from "@/lib/connectors";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const session = await requireSession();
  const { slug } = await context.params;
  const result = await runConnectorSync({ tenantId: session.tenantId, actor: session.email, slug });

  const acceptsJson = request.headers.get("accept")?.includes("application/json");

  if (acceptsJson) {
    return NextResponse.json({ data: result });
  }

  return NextResponse.redirect(new URL(`/integrations/${slug}`, request.url), 303);
}
