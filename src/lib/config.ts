import { environmentChecks } from "@/data/agentShield";

export type RuntimeMode = "demo-local" | "production-ready";

export function getRuntimeMode(): RuntimeMode {
  return process.env.DATABASE_URL ? "production-ready" : "demo-local";
}

export function getEnvironmentStatus() {
  return environmentChecks.map((check) => ({
    ...check,
    configured: Boolean(process.env[check.key]),
  }));
}

export function getConnectorEnvironmentStatus(keys: string[]) {
  return keys.map((key) => ({
    key,
    configured: Boolean(process.env[key]),
  }));
}
