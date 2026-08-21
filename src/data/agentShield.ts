export type AgentStatus = "active" | "review" | "quarantined";
export type Severity = "critical" | "high" | "medium" | "low";
export type IntegrationStatus = "Connected" | "Demo-ready" | "Planned" | "Needs setup";

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
  },
  {
    id: "AS-FND-1014",
    title: "Agent can export records above approved policy threshold",
    severity: "high" as Severity,
    entity: "Finance Reconciliation Agent",
    status: "Approval required",
    owner: "Finance Operations",
    due: "2 days",
  },
  {
    id: "AS-FND-1022",
    title: "Dormant OAuth app retains production repository access",
    severity: "medium" as Severity,
    entity: "GitHub Release Bot",
    status: "Review scheduled",
    owner: "Platform Engineering",
    due: "7 days",
  },
];

export const policies = [
  {
    name: "Sensitive export approval",
    decision: "Challenge",
    rule: "Require human approval when agent export exceeds 500 sensitive records.",
  },
  {
    name: "Unverified agent denial",
    decision: "Deny",
    rule: "Block privileged actions when identity assurance is below required tier.",
  },
  {
    name: "Production JIT grant",
    decision: "Allow with TTL",
    rule: "Issue scoped 10-minute grant only after policy and owner checks pass.",
  },
];

export const integrations = [
  { name: "Microsoft Entra / Azure", status: "Planned" as IntegrationStatus, scope: "Service principals, managed identities, roles", freshness: "Not connected" },
  { name: "AWS IAM", status: "Planned" as IntegrationStatus, scope: "Roles, policies, access keys, workload identities", freshness: "Not connected" },
  { name: "GitHub", status: "Demo-ready" as IntegrationStatus, scope: "Apps, bots, repos, actions permissions", freshness: "Mock sync: 9 minutes ago" },
  { name: "Kubernetes", status: "Planned" as IntegrationStatus, scope: "Service accounts, workloads, namespaces", freshness: "Not connected" },
];

export const timeline = [
  { time: "16:42", event: "Finance agent requested Salesforce export", decision: "Approval required" },
  { time: "16:41", event: "Policy bundle v0.1 evaluated sensitive-data threshold", decision: "Challenge" },
  { time: "16:35", event: "GitHub release bot completed deployment metadata sync", decision: "Allow" },
  { time: "16:20", event: "MCP client route disabled by quarantine control", decision: "Deny" },
];

export const evidenceControls = [
  { framework: "NIST CSF", control: "Govern and identify autonomous access paths", status: "Mapped" },
  { framework: "ISO 27001", control: "Privileged access and access review evidence", status: "Draft" },
  { framework: "SOC 2", control: "Change, access, and monitoring evidence", status: "Mapped" },
];
