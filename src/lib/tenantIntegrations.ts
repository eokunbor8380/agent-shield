import { readStore } from "@/lib/store";

export function maskSecret(value: string) {
  if (!value) {
    return "";
  }

  if (value.length <= 6) {
    return "******";
  }

  return `${value.slice(0, 3)}...${value.slice(-3)}`;
}

export async function getTenantIntegrationConfig(tenantId: string, integrationSlug: string) {
  const store = await readStore();
  return store.tenantIntegrationConfigs.find((config) => config.tenantId === tenantId && config.integrationSlug === integrationSlug) ?? null;
}
