import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type DemoSession = {
  userId: string;
  name: string;
  email: string;
  tenantId: string;
  role: "Owner" | "Admin" | "Analyst";
};

export const sessionCookieName = "agentshield_demo_session";

const demoSession: DemoSession = {
  userId: "usr-demo-owner",
  name: "AgentShield Demo Admin",
  email: "leeokk80@gmail.com",
  tenantId: "tenant-demo",
  role: "Owner",
};

export function createSessionValue(session: DemoSession = demoSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function readSessionValue(value: string | undefined): DemoSession | null {
  if (!value) {
    return null;
  }

  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const session = JSON.parse(decoded) as DemoSession;

    if (!session.userId || !session.tenantId || !session.email) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  return readSessionValue(cookieStore.get(sessionCookieName)?.value);
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export function getDemoSession() {
  return demoSession;
}
