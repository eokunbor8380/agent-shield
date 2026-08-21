import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export type UserSession = {
  userId: string;
  name: string;
  email: string;
  tenantId: string;
  role: string;
  platformRole?: "Owner" | "Member";
};

export const sessionCookieName = "agentshield_session";

export function shouldUseSecureCookies() {
  const appBaseUrl = process.env.APP_BASE_URL ?? "";
  return process.env.NODE_ENV === "production" && appBaseUrl.startsWith("https://");
}

export function createSessionValue(session: UserSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function readSessionValue(value: string | undefined): UserSession | null {
  if (!value) {
    return null;
  }

  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const session = JSON.parse(decoded) as UserSession;

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

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string | undefined) {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, hash] = storedHash.split(":");
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");

  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}

export function isStrongEnoughPassword(password: string) {
  return password.length >= 8;
}

export function canManageRoles(role: string) {
  return role === "Super Admin" || role === "Admin";
}

export function canManageUsers(role: string) {
  return role === "Super Admin" || role === "Admin";
}

export function isPlatformOwner(session: UserSession | null) {
  return session?.platformRole === "Owner";
}
