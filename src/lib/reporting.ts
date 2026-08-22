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
    title: "Board And Executive Agentic Risk Summary",
    category: "Leadership",
    cadence: "Weekly or monthly",
    description: "A board-ready view of governed agents, high-risk exposure, open findings, policy coverage, connector activity, and evidence readiness.",
    sections: ["Executive metrics", "High-risk agents", "Open findings", "Policy coverage", "Evidence readiness"],
  },
  {
    id: "agent-inventory",
    title: "Agent Registry And Non-Human Identity Inventory",
    category: "Identity",
    cadence: "Daily or weekly",
    description: "The system-of-record report for AI agents, bots, service principals, automation identities, owners, environments, tools, trust scores, and risk scores.",
    sections: ["Agents", "Owners", "Tools", "Credentials", "Trust and risk scores"],
  },
  {
    id: "shadow-agent-discovery",
    title: "Shadow Agent Discovery And Registration Gaps",
    category: "Discovery",
    cadence: "Daily",
    description: "Identifies discovered or connector-created agents that need registration, ownership, passport completion, or approval before production use.",
    sections: ["Discovered agents", "Registration gaps", "Passport gaps", "Recommended action"],
  },
  {
    id: "ownership-accountability",
    title: "Owner Accountability And Succession",
    category: "Governance",
    cadence: "Monthly",
    description: "Shows accountable owners, missing or weak ownership, technical ownership, and backup ownership gaps for agent lifecycle governance.",
    sections: ["Business owners", "Technical owners", "Backup owners", "Ownership gaps"],
  },
  {
    id: "least-privilege-access-review",
    title: "Least Privilege And Access Certification",
    category: "Access Review",
    cadence: "Monthly or quarterly",
    description: "Supports access certification by highlighting broad tool reach, privileged controls, owner review needs, and permission-risk indicators.",
    sections: ["Agent access", "Tool reach", "Privileged controls", "Certification evidence"],
  },
  {
    id: "human-overpermissioned-by-agents",
    title: "Humans Overpermissioned Through Agents",
    category: "Identity Risk",
    cadence: "Monthly",
    description: "Highlights where users or teams may inherit excessive reach through agents, bots, delegated workflows, or automation identities.",
    sections: ["Delegated access", "Agent-to-human exposure", "Over-permissioning indicators", "Review owner"],
  },
  {
    id: "autonomy-lifecycle",
    title: "Agent Autonomy And Lifecycle Governance",
    category: "Lifecycle",
    cadence: "Monthly",
    description: "Tracks agent operating mode, lifecycle state, review status, dormant or quarantined agents, and retirement candidates.",
    sections: ["Autonomy level", "Lifecycle state", "Dormant agents", "Quarantine and retirement"],
  },
  {
    id: "policy-decision-trace",
    title: "Policy Decision Trace And Enforcement",
    category: "Governance",
    cadence: "Weekly or audit-driven",
    description: "Shows active policies, enforcement modes, risk tiers, decision outcomes, audit events, and the evidence needed to prove control.",
    sections: ["Active policies", "Decision trace", "Audit events", "Evidence requirements"],
  },
  {
    id: "runtime-session-evidence",
    title: "Runtime Session And Decision Evidence",
    category: "Runtime Security",
    cadence: "Daily or incident-driven",
    description: "Reconstructs agent activity from available audit events, connector runs, policy decisions, findings, and evidence snapshots.",
    sections: ["Runtime actions", "Connector runs", "Policy decisions", "Findings ledger"],
  },
  {
    id: "compliance-evidence",
    title: "Audit-Ready Compliance Evidence Package",
    category: "Compliance",
    cadence: "Monthly or quarterly",
    description: "Maps agent governance evidence to frameworks such as NIST CSF, NIST AI RMF, ISO 27001, ISO 42001, SOC 2, GDPR, CIS, COBIT, HIPAA, PCI DSS, and EU AI Act.",
    sections: ["Controls", "Framework mappings", "Evidence records", "Audit trail", "Export readiness"],
  },
  {
    id: "connector-sync-health",
    title: "Connector Coverage And Sync Health",
    category: "Operations",
    cadence: "Daily",
    description: "Tracks configured integrations, sync freshness, latest runs, source systems, failed data feeds, and connector-generated report snapshots.",
    sections: ["Integrations", "Connector runs", "Coverage gaps", "Report snapshots"],
  },
  {
    id: "privileged-agent-access",
    title: "Privileged Agent Access And Blast Radius",
    category: "Security",
    cadence: "Monthly",
    description: "Highlights high-risk access patterns, broad tool reach, critical findings, toxic permission combinations, and agents needing owner or permission review.",
    sections: ["High-risk agents", "Critical findings", "Blast radius", "Owner review"],
  },
  {
    id: "release-readiness-gates",
    title: "Agent Release Readiness And Approval Gates",
    category: "Assurance",
    cadence: "Before release",
    description: "Shows whether agents are ready for production based on ownership, passport completeness, risk score, policy controls, and evidence.",
    sections: ["Release gate", "Risk score", "Policy controls", "Approval evidence"],
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

  if (reportId === "shadow-agent-discovery") {
    return agents.map((agent) => ({
      report: definition.title,
      type: agent.id.startsWith(`${tenantId}-`) ? "Connector-discovered agent" : "Seeded agent",
      name: agent.name,
      owner: agent.owner || "Owner required",
      environment: agent.environment,
      status: agent.passport?.purpose ? "Passport present" : "Passport required",
      trustScore: String(agent.trustScore),
      riskScore: String(agent.riskScore),
      detail: agent.id.startsWith(`${tenantId}-`) ? "Review registration, ownership, and production approval." : "Known inventory record.",
    }));
  }

  if (reportId === "ownership-accountability") {
    return agents.map((agent) => ({
      report: definition.title,
      type: "Ownership record",
      name: agent.name,
      owner: agent.owner,
      environment: agent.environment,
      status: agent.owner ? "Owner assigned" : "Owner missing",
      trustScore: String(agent.trustScore),
      riskScore: String(agent.riskScore),
      detail: "Business owner, technical owner, and backup owner should be reviewed before production approval.",
    }));
  }

  if (reportId === "least-privilege-access-review") {
    return agents.map((agent) => ({
      report: definition.title,
      type: "Access certification",
      name: agent.name,
      owner: agent.owner,
      environment: agent.environment,
      status: agent.tools.length > 2 || agent.riskScore >= 65 ? "Review required" : "Within baseline",
      trustScore: String(agent.tools.length),
      riskScore: String(agent.riskScore),
      detail: `Tools: ${agent.tools.join(", ")}. Controls: ${agent.passport.controls.join(", ")}`,
    }));
  }

  if (reportId === "human-overpermissioned-by-agents") {
    return agents.map((agent) => ({
      report: definition.title,
      type: "Delegated exposure",
      name: agent.owner,
      owner: agent.name,
      environment: agent.environment,
      status: agent.riskScore >= 65 ? "Potential over-permissioning" : "Monitor",
      trustScore: String(agent.trustScore),
      riskScore: String(agent.riskScore),
      detail: `${agent.owner} may gain operational reach through ${agent.name}: ${agent.tools.join(", ")}`,
    }));
  }

  if (reportId === "autonomy-lifecycle") {
    return agents.map((agent) => ({
      report: definition.title,
      type: "Lifecycle status",
      name: agent.name,
      owner: agent.owner,
      environment: agent.environment,
      status: agent.status,
      trustScore: agent.status === "active" ? "Supervised/Semi-autonomous" : "Restricted",
      riskScore: String(agent.riskScore),
      detail: agent.status === "quarantined" ? "Retain evidence and require restore approval." : "Confirm autonomy level, review cadence, and retirement criteria.",
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

  if (reportId === "runtime-session-evidence") {
    const auditRows = store.auditEvents.filter((event) => event.tenantId === tenantId).map((event) => ({
      report: definition.title,
      type: "Audit event",
      name: event.action,
      owner: event.actor,
      environment: "Tenant",
      status: "Recorded",
      trustScore: event.createdAt,
      riskScore: "Evidence",
      detail: event.target,
    }));
    const runRows = runs.map((run) => ({
      report: definition.title,
      type: "Connector run",
      name: run.integrationSlug,
      owner: run.source,
      environment: "Integration",
      status: run.status,
      trustScore: run.startedAt,
      riskScore: run.finishedAt ?? "Running",
      detail: run.summary,
    }));

    return [...auditRows, ...runRows];
  }

  if (reportId === "connector-sync-health") {
    const runRows = runs.map((run) => ({
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
    const integrationRows = store.integrations.map((integration) => ({
      report: definition.title,
      type: "Integration coverage",
      name: integration.name,
      owner: integration.kind,
      environment: "Connector",
      status: integration.status,
      trustScore: integration.freshness,
      riskScore: integration.requiredEnv.length ? "Credentialed" : "No credentials required",
      detail: integration.scope,
    }));

    return [...integrationRows, ...runRows];
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

  if (reportId === "release-readiness-gates") {
    return agents.map((agent) => {
      const ready = agent.owner && agent.passport?.purpose && agent.riskScore < 70 && agent.status !== "quarantined";

      return {
        report: definition.title,
        type: "Release gate",
        name: agent.name,
        owner: agent.owner,
        environment: agent.environment,
        status: ready ? "Pass" : "Review required",
        trustScore: String(agent.trustScore),
        riskScore: String(agent.riskScore),
        detail: ready ? "Owner, passport, and risk posture support release." : "Review owner, passport, risk, quarantine, or policy evidence before release.",
      };
    });
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
