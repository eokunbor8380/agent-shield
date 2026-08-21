import { NextResponse } from "next/server";

const recipient = "leeokk80@gmail.com";

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  const subject = encodeURIComponent(`AgentShield demo request from ${name || "website visitor"}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  return NextResponse.redirect(`mailto:${recipient}?subject=${subject}&body=${body}`, 303);
}
