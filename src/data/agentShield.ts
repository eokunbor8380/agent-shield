export type AgentStatus = "active" | "review" | "quarantined";
export type Severity = "critical" | "high" | "medium" | "low";
export type IntegrationStatus = "Connected" | "Demo-ready" | "Planned" | "Needs setup";
export type SimulationDecision = "Allow" | "Challenge" | "Deny";
export type ConnectorKind = "github" | "microsoft-entra" | "aws-iam" | "kubernetes";
export type ControlStatus = "Passing" | "Needs review" | "Failing";

export const metrics = [
  { label: "Agents discovered", value: "1,248", delta: "+18 this week" },
  { label: "Non-human identities", value: "4,892", delta: "72 overprivileged" },
  { label: "Critical findings", value: "23", delta: "6 need owner action" },
  { label: "Avg AgentTrust", value: "782", delta: "+31 in 30 days" },
];

export const agents = [
  {
    id: "as-agent-fin-0184",
    name: "Finance Reconciliation Agent",
    type: "LLM workflow agent",
    owner: "Finance Operations",
    environment: "Production",
    status: "review" as AgentStatus,
    trustScore: 812,
    riskScore: 68,
    tools: ["Salesforce", "SharePoint", "Snowflake"],
    data: "Customer records, invoices",
    assurance: "Platform attested",
    lastSeen: "4 minutes ago",
    passport: {
      purpose: "Reconcile invoice exceptions and generate finance operations summaries.",
      credentials: ["Salesforce OAuth app", "Snowflake read role"],
      controls: ["Export approval threshold", "Customer-data purpose binding", "10-minute JIT grant"],
      evidence: ["Owner attested", "Policy simulation passed", "Recent access review"],
    },
  },
  {
    id: "as-agent-sec-0042",
    name: "SOC Triage Copilot",
    type: "Security analyst assistant",
    owner: "Security Operations",
    environment: "Production",
    status: "active" as AgentStatus,
    trustScore: 884,
    riskScore: 41,
    tools: ["SIEM", "EDR", "Ticketing"],
    data: "Alerts, host telemetry",
    assurance: "Verified workload",
    lastSeen: "1 minute ago",
    passport: {
      purpose: "Summarize security alerts and recommend triage steps for analysts.",
      credentials: ["SIEM reader", "Ticket creator"],
      controls: ["No destructive action", "SOC analyst approval for containment", "Telemetry-only content mode"],
      evidence: ["Owner attested", "Baseline stable", "No critical findings"],
    },
  },
  {
    id: "as-nhi-dev-0971",
    name: "GitHub Release Bot",
    type: "OAuth app / bot",
    owner: "Platform Engineering",
    environment: "Production",
    status: "active" as AgentStatus,
    trustScore: 731,
    riskScore: 55,
    tools: ["GitHub", "Vercel", "Container Registry"],
    data: "Source metadata, deployments",
    assurance: "OAuth verified",
    lastSeen: "22 minutes ago",
    passport: {
      purpose: "Coordinate release metadata and deployment handoff events.",
      credentials: ["GitHub app installation", "Vercel deployment token metadata"],
      controls: ["Repo allowlist", "Signed release provenance", "Branch protection required"],
      evidence: ["Code owner mapped", "Deployment scope reviewed", "Token rotation due in 21 days"],
    },
  },
  {
    id: "as-agent-mcp-0028",
    name: "Customer Data MCP Client",
    type: "MCP client",
    owner: "Data Platform",
    environment: "Test",
    status: "quarantined" as AgentStatus,
    trustScore: 438,
    riskScore: 91,
    tools: ["MCP Gateway", "PostgreSQL", "Object Storage"],
    data: "PII-classified test exports",
    assurance: "Unverified MCP client",
    lastSeen: "Suspended",
    passport: {
      purpose: "Prototype customer-data query assistant in test environment.",
      credentials: ["Test database role", "Object storage temporary grant"],
      controls: ["Quarantined", "No production route", "Manual approval required"],
      evidence: ["Schema drift detected", "Sensitive export finding", "Kill switch exercised"],
    },
  },
];

export const findings = [
  {
    id: "AS-FND-1007",
    title: "Owner missing for high-reach service principal",
    severity: "critical" as Severity,
    entity: "Legacy Data Export Principal",
    status: "Open",
    owner: "IAM Engineering",
    due: "Today",
    entityId: null,
    impact: "A service principal with broad data access has no accountable business or technical owner.",
    evidence: ["No owner in identity metadata", "Privileged data export role attached", "No access review in 90 days"],
    remediation: ["Assign business owner", "Reduce permissions to approved scopes", "Schedule quarterly access review"],
  },
  {
    id: "AS-FND-1009",
    title: "Unverified MCP client can reach PII-classified export path",
    severity: "critical" as Severity,
    entity: "Customer Data MCP Client",
    status: "Contained",
    owner: "Data Platform",
    due: "Today",
    entityId: "as-agent-mcp-0028",
    impact: "An unverified MCP client has access to sensitive test exports and object storage paths that could expose regulated customer data.",
    evidence: ["PII export path detected", "MCP client assurance missing", "Kill switch exercised"],
    remediation: ["Keep client quarantined", "Remove object storage grant", "Require purpose-bound approval before restore"],
  },
  {
    id: "AS-FND-1014",
    title: "Agent can export records above approved policy threshold",
    severity: "high" as Severity,
    entity: "Finance Reconciliation Agent",
    status: "Approval required",
    owner: "Finance Operations",
    due: "2 days",
    entityId: "as-agent-fin-0184",
    impact: "The agent can export sensitive customer records beyond the approved threshold without a human challenge.",
    evidence: ["Salesforce export scope present", "Sensitive record threshold exceeded in simulation", "Policy bundle returned Challenge"],
    remediation: ["Enable human approval gate", "Lower export scope", "Attach data-purpose binding to passport"],
  },
  {
    id: "AS-FND-1018",
    title: "Production triage agent can create external tickets without review",
    severity: "high" as Severity,
    entity: "SOC Triage Copilot",
    status: "Review required",
    owner: "Security Operations",
    due: "3 days",
    entityId: "as-agent-sec-0042",
    impact: "The agent can create downstream tickets that may expose investigation details to external workflows without approval.",
    evidence: ["Ticket creator scope present", "External workflow route enabled", "No approval checkpoint found"],
    remediation: ["Add SOC analyst approval", "Restrict external ticket fields", "Log decision trace for ticket creation"],
  },
  {
    id: "AS-FND-1022",
    title: "Dormant OAuth app retains production repository access",
    severity: "medium" as Severity,
    entity: "GitHub Release Bot",
    status: "Review scheduled",
    owner: "Platform Engineering",
    due: "7 days",
    entityId: "as-nhi-dev-0971",
    impact: "A release bot keeps production repository access even when recent activity does not justify the scope.",
    evidence: ["Dormant permission path detected", "Repository write scope still attached", "Token rotation due in 21 days"],
    remediation: ["Confirm current release ownership", "Remove unused repository grants", "Rotate deployment token"],
  },
  {
    id: "AS-FND-1027",
    title: "Agent passport missing backup owner evidence",
    severity: "medium" as Severity,
    entity: "Finance Reconciliation Agent",
    status: "Owner follow-up",
    owner: "Finance Operations",
    due: "10 days",
    entityId: "as-agent-fin-0184",
    impact: "The agent has a business owner, but backup ownership evidence is incomplete for continuity and audit review.",
    evidence: ["Primary owner present", "Backup owner missing", "Review cadence not documented"],
    remediation: ["Assign backup owner", "Document review cadence", "Attach owner attestation evidence"],
  },
  {
    id: "AS-FND-1031",
    title: "Telemetry-only agent lacks recent evidence refresh",
    severity: "low" as Severity,
    entity: "SOC Triage Copilot",
    status: "Monitor",
    owner: "Security Operations",
    due: "30 days",
    entityId: "as-agent-sec-0042",
    impact: "The agent is operating within approved scope, but evidence should be refreshed for audit readiness.",
    evidence: ["Baseline stable", "No critical findings", "Evidence older than target cadence"],
    remediation: ["Refresh owner attestation", "Attach latest control evidence", "Keep telemetry-only mode"],
  },
  {
    id: "AS-FND-1035",
    title: "Repository automation token rotation reminder due",
    severity: "low" as Severity,
    entity: "GitHub Release Bot",
    status: "Scheduled",
    owner: "Platform Engineering",
    due: "21 days",
    entityId: "as-nhi-dev-0971",
    impact: "The release bot is currently within policy, but scheduled token rotation is approaching.",
    evidence: ["Token rotation due in 21 days", "Repo allowlist present", "Signed release provenance enabled"],
    remediation: ["Rotate token by due date", "Confirm repo allowlist", "Retain rotation evidence"],
  },
];

export const policies = [
  {
    id: "sensitive-export-approval",
    name: "Sensitive export approval",
    decision: "Challenge",
    rule: "Require human approval when agent export exceeds 500 sensitive records.",
  },
  {
    id: "unverified-agent-denial",
    name: "Unverified agent denial",
    decision: "Deny",
    rule: "Block privileged actions when identity assurance is below required tier.",
  },
  {
    id: "production-jit-grant",
    name: "Production JIT grant",
    decision: "Allow with TTL",
    rule: "Issue scoped 10-minute grant only after policy and owner checks pass.",
  },
];

export const integrations = [
  {
    slug: "microsoft-entra-azure",
    kind: "microsoft-entra" as ConnectorKind,
    name: "Microsoft Entra / Azure",
    status: "Planned" as IntegrationStatus,
    scope: "Service principals, managed identities, roles",
    freshness: "Not connected",
    setup: ["Register read-only enterprise app", "Grant directory and role inventory permissions", "Map service principals to Agent Passport records"],
    requiredEnv: ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET"],
    syncMode: "Credential-ready placeholder",
  },
  {
    slug: "aws-iam",
    kind: "aws-iam" as ConnectorKind,
    name: "AWS IAM",
    status: "Planned" as IntegrationStatus,
    scope: "Roles, policies, access keys, workload identities",
    freshness: "Not connected",
    setup: ["Create read-only cross-account role", "Sync IAM roles and policy documents", "Detect stale keys and overbroad trust policies"],
    requiredEnv: ["AWS_ROLE_ARN", "AWS_EXTERNAL_ID"],
    syncMode: "Credential-ready placeholder",
  },
  {
    slug: "github",
    kind: "github" as ConnectorKind,
    name: "GitHub",
    status: "Demo-ready" as IntegrationStatus,
    scope: "Apps, bots, repos, actions permissions",
    freshness: "Mock sync: 9 minutes ago",
    setup: ["Install GitHub App in selected org", "Sync apps, bots, and workflow permissions", "Map release automation to owners and repos"],
    requiredEnv: ["GITHUB_TOKEN", "GITHUB_OWNER"],
    syncMode: "Live when GitHub env vars are configured; demo fallback otherwise",
  },
  {
    slug: "kubernetes",
    kind: "kubernetes" as ConnectorKind,
    name: "Kubernetes",
    status: "Planned" as IntegrationStatus,
    scope: "Service accounts, workloads, namespaces",
    freshness: "Not connected",
    setup: ["Install read-only cluster collector", "Sync service accounts and workloads", "Associate runtime workloads with agent identities"],
    requiredEnv: ["KUBERNETES_API_URL", "KUBERNETES_SERVICE_ACCOUNT_TOKEN"],
    syncMode: "Credential-ready placeholder",
  },
];

export const connectorRuns = [
  {
    id: "RUN-0001",
    tenantId: "tenant-demo",
    integrationSlug: "github",
    status: "Succeeded",
    source: "demo",
    summary: "Seeded GitHub release bot, repository scope, and workflow permission evidence.",
    startedAt: "2026-08-21T00:00:00.000Z",
    finishedAt: "2026-08-21T00:00:02.000Z",
  },
];

export const environmentChecks = [
  { key: "APP_BASE_URL", purpose: "Public app URL for redirects and email links", requiredFor: "Phase 3 production" },
  { key: "AUTH_PROVIDER", purpose: "Future provider switch: demo, clerk, supabase, or authjs", requiredFor: "Phase 3 production" },
  { key: "DATABASE_URL", purpose: "Future Neon or Supabase Postgres connection string", requiredFor: "Phase 3 production" },
  { key: "GITHUB_TOKEN", purpose: "Read-only GitHub connector token", requiredFor: "Phase 4 GitHub live sync" },
  { key: "GITHUB_OWNER", purpose: "GitHub organization or username to inventory", requiredFor: "Phase 4 GitHub live sync" },
  { key: "AZURE_TENANT_ID", purpose: "Microsoft Entra tenant identifier", requiredFor: "Phase 4 Entra live sync" },
  { key: "AZURE_CLIENT_ID", purpose: "Read-only Entra app registration client id", requiredFor: "Phase 4 Entra live sync" },
  { key: "AZURE_CLIENT_SECRET", purpose: "Read-only Entra app registration secret", requiredFor: "Phase 4 Entra live sync" },
];

export const securityControls = [
  {
    id: "CTRL-OWNERSHIP",
    name: "Every privileged agent has an owner",
    description: "Privileged autonomous identities must map to a business or technical owner.",
    framework: "NIST CSF GV.OC",
  },
  {
    id: "CTRL-EXPORT-APPROVAL",
    name: "Sensitive exports require human approval",
    description: "Agents exporting sensitive records above threshold must be challenged before runtime access.",
    framework: "ISO 27001 A.5.15",
  },
  {
    id: "CTRL-ASSURANCE",
    name: "Unverified agents cannot reach production data",
    description: "Low-assurance or quarantined agents must be denied production routes.",
    framework: "SOC 2 CC6",
  },
  {
    id: "CTRL-EVIDENCE",
    name: "Authorization decisions produce evidence",
    description: "Policy decisions, connector syncs, and response actions must create audit evidence.",
    framework: "COBIT DSS05",
  },
];

export const timeline = [
  { time: "16:42", event: "Finance agent requested Salesforce export", decision: "Approval required" },
  { time: "16:41", event: "Policy bundle v0.1 evaluated sensitive-data threshold", decision: "Challenge" },
  { time: "16:35", event: "GitHub release bot completed deployment metadata sync", decision: "Allow" },
  { time: "16:20", event: "MCP client route disabled by quarantine control", decision: "Deny" },
];

export const evidenceControls = [
  {
    slug: "nist-csf",
    framework: "NIST CSF",
    control: "Govern and identify autonomous access paths",
    status: "Mapped",
    evidence: ["Agent inventory export", "Owner attestation trail", "Policy decision log"],
  },
  {
    slug: "iso-27001",
    framework: "ISO 27001",
    control: "Privileged access and access review evidence",
    status: "Draft",
    evidence: ["Privileged identity list", "Access review queue", "Remediation history"],
  },
  {
    slug: "soc-2",
    framework: "SOC 2",
    control: "Change, access, and monitoring evidence",
    status: "Mapped",
    evidence: ["Release bot passport", "Authorization timeline", "Monitoring event sample"],
  },
];

export const policySimulationScenarios = [
  {
    id: "finance-export",
    agentId: "as-agent-fin-0184",
    action: "Export 750 sensitive customer records from Salesforce",
    decision: "Challenge" as SimulationDecision,
    reason: "Sensitive export exceeds the approved 500-record threshold and requires Finance Operations approval.",
    matchedPolicies: ["Sensitive export approval", "Production JIT grant"],
  },
  {
    id: "mcp-production-route",
    agentId: "as-agent-mcp-0028",
    action: "Open production PostgreSQL route through MCP Gateway",
    decision: "Deny" as SimulationDecision,
    reason: "The MCP client is quarantined and has unverified assurance.",
    matchedPolicies: ["Unverified agent denial"],
  },
  {
    id: "soc-ticket",
    agentId: "as-agent-sec-0042",
    action: "Create incident ticket with SIEM alert summary",
    decision: "Allow" as SimulationDecision,
    reason: "The agent is verified, the action is non-destructive, and the scope is telemetry-only.",
    matchedPolicies: ["Production JIT grant"],
  },
];

export function getAgentById(id: string) {
  return agents.find((agent) => agent.id === id) ?? null;
}

export function getFindingById(id: string) {
  return findings.find((finding) => finding.id === id) ?? null;
}

export function getIntegrationBySlug(slug: string) {
  return integrations.find((integration) => integration.slug === slug) ?? null;
}

export function getEvidenceBySlug(slug: string) {
  return evidenceControls.find((control) => control.slug === slug) ?? null;
}

export function getSimulationById(id: string) {
  return policySimulationScenarios.find((scenario) => scenario.id === id) ?? policySimulationScenarios[0];
}
