import type { AgentStatus, Severity } from "@/data/agentShield";

const agentStatusClasses: Record<AgentStatus, string> = {
  active: "bg-success/10 text-success",
  review: "bg-warning/10 text-warning",
  quarantined: "bg-danger/10 text-danger",
};

const severityClasses: Record<Severity, string> = {
  critical: "bg-danger/10 text-danger",
  high: "bg-warning/10 text-warning",
  medium: "bg-accent/15 text-violet-200",
  low: "bg-success/10 text-success",
};

export function StatusPill({ value }: { value: AgentStatus | Severity | string }) {
  const normalized = value.toLowerCase() as AgentStatus | Severity;
  const classes =
    normalized in agentStatusClasses
      ? agentStatusClasses[normalized as AgentStatus]
      : normalized in severityClasses
        ? severityClasses[normalized as Severity]
        : "bg-panel-strong text-muted";

  return <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${classes}`}>{value}</span>;
}
