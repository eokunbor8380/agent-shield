import type { AgentShieldStore, ReportSnapshot } from "@/lib/store";

export type ReportFormat = "csv" | "xls" | "pdf";

export type ReportDefinition = {
  id: string;
  title: string;
  category: string;
  cadence: string;
  description: string;
  sections: string[];
};

export const reportDefinitions: ReportDefinition[] = [
  {
    id: "executive-risk-summary",
    title: "Executive Risk Summary",
    category: "Leadership",
    cadence: "Weekly or monthly",
    description: "Summarizes agent inventory, high-risk exposure, open findings, connector activity, and governance posture for executives.",
    sections: ["Metrics", "High-risk agents", "Open findings", "Recent connector runs"],
  },
  {
    id: "agent-inventory",
    title: "Agent And Non-Human Identity Inventory",
    category: "Identity",
    cadence: "Daily or weekly",
    description: "Lists discovered AI agents, bots, service principals, repositories, owners, environments, trust scores, and risk scores.",
    sections: ["Agents", "Owners", "Tools", "Trust and risk scores"],
  },
  {
    id: "policy-decision-trace",
    title: "Policy Decision Trace",
    category: "Governance",
    cadence: "Weekly or audit-driven",
    description: "Shows active policies, enforcement modes, risk tiers, evidence expectations, and recent decision/audit activity.",
    sections: ["Active policies", "Audit events", "Evidence requirements"],
  },
  {
    id: "compliance-evidence",
    title: "Compliance Evidence Package",
    category: "Compliance",
    cadence: "Monthly or quarterly",
    description: "Maps agent governance evidence to frameworks such as NIST CSF, ISO 27001, SOC 2, GDPR, CIS, and COBIT.",
    sections: ["Controls", "Framework mappings", "Evidence records", "Audit trail"],
  },
  {
    id: "connector-sync-health",
    title: "Connector Sync Health",
    category: "Operations",
    cadence: "Daily",
    description: "Tracks configured integrations, sync freshness, latest runs, source systems, and connector-generated report snapshots.",
    sections: ["Integrations", "Connector runs", "Report snapshots"],
  },
  {
    id: "privileged-agent-access",
    title: "Privileged Agent Access Review",
    category: "Security",
    cadence: "Monthly",
    description: "Highlights high-risk access patterns, broad tool reach, critical findings, and agents that need owner or permission review.",
    sections: ["High-risk agents", "Critical findings", "Owner review"],
  },
];

function tenantAgents(store: AgentShieldStore, tenantId: string) {
  return store.agents.filter((agent) => agent.id.startsWith(`${tenantId}-`) || tenantId === "tenant-demo");
}

function tenantRuns(store: AgentShieldStore, tenantId: string) {
  return store.connectorRuns.filter((run) => run.tenantId === tenantId);
}

function tenantReports(store: AgentShieldStore, tenantId: string) {
  return store.reportSnapshots.filter((report) => report.tenantId === tenantId);
}

export function getReportDefinition(reportId: string) {
  return reportDefinitions.find((report) => report.id === reportId) ?? reportDefinitions[0];
}

export function buildReportRows(store: AgentShieldStore, tenantId: string, reportId: string) {
  const definition = getReportDefinition(reportId);
  const agents = tenantAgents(store, tenantId);
  const runs = tenantRuns(store, tenantId);
  const reports = tenantReports(store, tenantId);
  const highRiskAgents = agents.filter((agent) => agent.riskScore >= 70);

  if (reportId === "agent-inventory") {
    return agents.map((agent) => ({
      report: definition.title,
      type: "Agent",
      name: agent.name,
      owner: agent.owner,
      environment: agent.environment,
      status: agent.status,
      trustScore: String(agent.trustScore),
      riskScore: String(agent.riskScore),
      detail: agent.tools.join(", "),
    }));
  }

  if (reportId === "policy-decision-trace") {
    return store.policies.filter((policy) => policy.tenantId === tenantId).map((policy) => ({
      report: definition.title,
      type: "Policy",
      name: policy.name,
      owner: policy.pack,
      environment: policy.category,
      status: policy.status,
      trustScore: policy.enforcementMode,
      riskScore: policy.riskTier,
      detail: policy.rule,
    }));
  }

  if (reportId === "connector-sync-health") {
    return runs.map((run) => ({
      report: definition.title,
      type: "Connector run",
      name: run.integrationSlug,
      owner: run.source,
      environment: "Tenant",
      status: run.status,
      trustScore: run.startedAt,
      riskScore: run.finishedAt ?? "Running",
      detail: run.summary,
    }));
  }

  if (reportId === "compliance-evidence") {
    return store.evidenceControls.map((control) => ({
      report: definition.title,
      type: "Evidence control",
      name: control.framework,
      owner: control.control,
      environment: "Compliance",
      status: control.status,
      trustScore: String(control.evidence.length),
      riskScore: "Evidence",
      detail: control.evidence.join(", "),
    }));
  }

  if (reportId === "privileged-agent-access") {
    return highRiskAgents.map((agent) => ({
      report: definition.title,
      type: "High-risk agent",
      name: agent.name,
      owner: agent.owner,
      environment: agent.environment,
      status: agent.status,
      trustScore: String(agent.trustScore),
      riskScore: String(agent.riskScore),
      detail: agent.passport.controls.join(", "),
    }));
  }

  return [
    { report: definition.title, type: "Metric", name: "Agents", owner: "AgentShield", environment: "Tenant", status: "Current", trustScore: String(agents.length), riskScore: "-", detail: "Inventory records" },
    { report: definition.title, type: "Metric", name: "High-risk agents", owner: "AgentShield", environment: "Tenant", status: "Current", trustScore: String(highRiskAgents.length), riskScore: "-", detail: "Agents needing review" },
    { report: definition.title, type: "Metric", name: "Findings", owner: "AgentShield", environment: "Tenant", status: "Current", trustScore: String(store.findings.length), riskScore: "-", detail: "Open risk items" },
    { report: definition.title, type: "Metric", name: "Connector runs", owner: "AgentShield", environment: "Tenant", status: "Current", trustScore: String(runs.length), riskScore: "-", detail: "Data refresh activity" },
    { report: definition.title, type: "Metric", name: "Generated reports", owner: "AgentShield", environment: "Tenant", status: "Current", trustScore: String(reports.length), riskScore: "-", detail: "Report snapshots" },
  ];
}

function escapeCsv(value: string) {
  return `"${value.replaceAll("\"", "\"\"")}"`;
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}

function escapePdf(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

export function buildCsv(rows: Array<Record<string, string>>) {
  const headers = ["report", "type", "name", "owner", "environment", "status", "trustScore", "riskScore", "detail"];
  return [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header] ?? "")).join(",")),
  ].join("\n");
}

export function buildExcelHtml(rows: Array<Record<string, string>>) {
  const headers = ["Report", "Type", "Name", "Owner", "Environment", "Status", "Trust Score / Value", "Risk Score / Value", "Detail"];
  const keys = ["report", "type", "name", "owner", "environment", "status", "trustScore", "riskScore", "detail"];

  return `<!doctype html><html><head><meta charset="utf-8"></head><body><table border="1"><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${keys.map((key) => `<td>${escapeHtml(row[key] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`;
}

export function buildSimplePdf(title: string, rows: Array<Record<string, string>>) {
  const lines = [title, `Generated: ${new Date().toISOString()}`, "", ...rows.slice(0, 28).map((row) => `${row.type}: ${row.name} | ${row.status} | ${row.detail}`)];
  const content = lines.map((line, index) => `BT /F1 10 Tf 48 ${760 - index * 22} Td (${escapePdf(line.slice(0, 110))}) Tj ET`).join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
  ];
  const body = objects.join("\n");
  return `%PDF-1.4\n${body}\ntrailer << /Root 1 0 R >>\n%%EOF`;
}

export function buildCustomReportSnapshot(
  tenantId: string,
  title: string,
  selectedSections: string[],
  store: AgentShieldStore,
): ReportSnapshot {
  const agents = tenantAgents(store, tenantId);
  const runs = tenantRuns(store, tenantId);
  const highRiskAgents = agents.filter((agent) => agent.riskScore >= 70);

  return {
    id: `RPT-${String(store.reportSnapshots.length + 1).padStart(4, "0")}`,
    tenantId,
    title,
    summary: `Custom report covering ${selectedSections.join(", ")}.`,
    source: "custom-builder",
    metrics: [
      { label: "Sections", value: String(selectedSections.length) },
      { label: "Agents", value: String(agents.length) },
      { label: "High risk", value: String(highRiskAgents.length) },
      { label: "Connector runs", value: String(runs.length) },
    ],
    createdAt: new Date().toISOString(),
  };
}
