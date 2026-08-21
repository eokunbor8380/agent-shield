import type { AgentStatus, ControlStatus, Severity, SimulationDecision } from "@/data/agentShield";
import type { AgentShieldStore } from "@/lib/store";

const severityWeights: Record<Severity, number> = {
  critical: 40,
  high: 25,
  medium: 12,
  low: 5,
};

const decisionRank: Record<SimulationDecision, number> = {
  Deny: 3,
  Challenge: 2,
  Allow: 1,
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreAgent(agent: AgentShieldStore["agents"][number], findings: AgentShieldStore["findings"]) {
  const relatedFindings = findings.filter((finding) => finding.entityId === agent.id);
  const findingRisk = relatedFindings.reduce((total, finding) => total + severityWeights[finding.severity], 0);
  const quarantineRisk = agent.status === "quarantined" ? 35 : 0;
  const reviewRisk = agent.status === "review" ? 10 : 0;
  const reachRisk = Math.min(agent.tools.length * 4, 20);
  const trustCredit = Math.max(0, (agent.trustScore - 700) / 10);
  const score = clampScore(agent.riskScore + findingRisk + quarantineRisk + reviewRisk + reachRisk - trustCredit);

  return {
    agentId: agent.id,
    name: agent.name,
    owner: agent.owner,
    status: agent.status,
    score,
    band: score >= 85 ? "Critical" : score >= 65 ? "High" : score >= 40 ? "Medium" : "Low",
    drivers: [
      `${relatedFindings.length} related finding(s)`,
      `${agent.tools.length} connected tool(s)`,
      `AgentTrust ${agent.trustScore}`,
      agent.status === "quarantined" ? "Quarantined" : "Active route state",
    ],
  };
}

export function evaluatePolicyScenario(
  scenario: AgentShieldStore["policySimulationScenarios"][number],
  store: AgentShieldStore,
) {
  const agent = store.agents.find((item) => item.id === scenario.agentId);
  const relatedFindings = store.findings.filter((finding) => finding.entityId === scenario.agentId);
  let decision = scenario.decision;
  const reasons = [scenario.reason];

  if (agent?.status === "quarantined") {
    decision = "Deny";
    reasons.push("Agent is quarantined by incident response control.");
  }

  if (relatedFindings.some((finding) => finding.severity === "critical")) {
    decision = decisionRank[decision] < decisionRank.Challenge ? "Challenge" : decision;
    reasons.push("Critical related finding requires elevated review.");
  }

  return {
    scenarioId: scenario.id,
    agentId: scenario.agentId,
    agentName: agent?.name ?? "Unknown agent",
    action: scenario.action,
    decision,
    matchedPolicies: scenario.matchedPolicies,
    reasons,
  };
}

export function evaluateControls(store: AgentShieldStore) {
  const openCritical = store.findings.filter((finding) => finding.severity === "critical" && finding.status !== "Resolved").length;
  const quarantined = store.agents.filter((agent) => agent.status === "quarantined").length;
  const auditCount = store.auditEvents.length;

  return store.securityControls.map((control) => {
    let status: ControlStatus = "Passing";
    let evidence = `${auditCount} audit event(s) available`;

    if (control.id === "CTRL-OWNERSHIP" && openCritical > 0) {
      status = "Failing";
      evidence = `${openCritical} critical ownership or privilege finding(s) remain open`;
    }

    if (control.id === "CTRL-ASSURANCE" && quarantined > 0) {
      status = "Needs review";
      evidence = `${quarantined} quarantined agent(s) blocked from production routes`;
    }

    if (control.id === "CTRL-EVIDENCE" && auditCount < 3) {
      status = "Needs review";
      evidence = "More audit events are needed for export-ready evidence";
    }

    return {
      ...control,
      status,
      evidence,
    };
  });
}

export function buildSecurityPosture(store: AgentShieldStore) {
  const agentScores = store.agents.map((agent) => scoreAgent(agent, store.findings));
  const averageRisk = agentScores.length
    ? Math.round(agentScores.reduce((total, item) => total + item.score, 0) / agentScores.length)
    : 0;
  const highRiskAgents = agentScores.filter((item) => item.band === "Critical" || item.band === "High").length;
  const policyEvaluations = store.policySimulationScenarios.map((scenario) => evaluatePolicyScenario(scenario, store));
  const controlEvaluations = evaluateControls(store);

  return {
    averageRisk,
    highRiskAgents,
    openFindings: store.findings.filter((finding) => finding.status !== "Resolved").length,
    deniedOrChallenged: policyEvaluations.filter((item) => item.decision !== "Allow").length,
    agentScores,
    policyEvaluations,
    controlEvaluations,
  };
}

export function buildEvidenceExport(store: AgentShieldStore, frameworkSlug: string) {
  const control = store.evidenceControls.find((item) => item.slug === frameworkSlug);
  const posture = buildSecurityPosture(store);

  return {
    exportedAt: new Date().toISOString(),
    framework: control?.framework ?? frameworkSlug,
    control: control?.control ?? "Custom evidence package",
    status: control?.status ?? "Draft",
    evidence: control?.evidence ?? [],
    posture: {
      averageRisk: posture.averageRisk,
      openFindings: posture.openFindings,
      deniedOrChallenged: posture.deniedOrChallenged,
    },
    auditEvents: store.auditEvents.slice(0, 20),
    connectorRuns: store.connectorRuns.slice(0, 10),
    findings: store.findings,
  };
}

export function updateAgentStatus(
  agents: AgentShieldStore["agents"],
  agentId: string,
  status: AgentStatus,
) {
  return agents.map((agent) => (agent.id === agentId ? { ...agent, status, lastSeen: status === "quarantined" ? "Suspended" : "Just now" } : agent));
}
