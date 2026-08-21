export type AgentStatus = "active" | "review" | "quarantined";
export type Severity = "critical" | "high" | "medium" | "low";

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
  },
];

export const findings = [
  {
    id: "AS-FND-1007",
    title: "Owner missing for high-reach service principal",
    severity: "critical" as Severity,
    entity: "Legacy Data Export Principal",
    status: "Open",
  },
  {
    id: "AS-FND-1014",
    title: "Agent can export records above approved policy threshold",
    severity: "high" as Severity,
    entity: "Finance Reconciliation Agent",
    status: "Approval required",
  },
  {
    id: "AS-FND-1022",
    title: "Dormant OAuth app retains production repository access",
    severity: "medium" as Severity,
    entity: "GitHub Release Bot",
    status: "Review scheduled",
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
  { name: "Microsoft Entra / Azure", status: "Planned", scope: "Service principals, managed identities, roles" },
  { name: "AWS IAM", status: "Planned", scope: "Roles, policies, access keys, workload identities" },
  { name: "GitHub", status: "Demo-ready", scope: "Apps, bots, repos, actions permissions" },
  { name: "Kubernetes", status: "Planned", scope: "Service accounts, workloads, namespaces" },
];
