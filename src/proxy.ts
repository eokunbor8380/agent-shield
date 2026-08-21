import { NextRequest, NextResponse } from "next/server";
import { readSessionValue, sessionCookieName } from "@/lib/auth";

const protectedPrefixes = ["/dashboard", "/agents", "/risk", "/policy", "/security", "/compliance", "/integrations", "/settings"];
const protectedApiPrefixes = ["/api/agents", "/api/findings", "/api/integrations", "/api/evidence", "/api/policies", "/api/settings", "/api/security"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected =
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = readSessionValue(request.cookies.get(sessionCookieName)?.value);

  if (session) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signInUrl = request.nextUrl.clone();
  signInUrl.pathname = "/sign-in";
  signInUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
