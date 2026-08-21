# AgentShield Phase 5 Completion

## What Phase 5 Adds

Phase 5 introduces the first real security engine layer.

Implemented areas:

- Security engine library
- Dynamic agent risk scoring
- Policy scenario evaluation using current agent and finding state
- Control checks mapped to security/compliance frameworks
- Protected security posture API
- Protected policy evaluation API
- Incident response API for quarantine and restore
- Evidence export API
- New `/security` page
- Agent Passport incident-response actions
- Compliance evidence JSON export
- Database schema additions for controls, policy evaluations, and evidence exports

## Security Engine Behavior

The current engine is deterministic and explainable. It scores agents using:

- Existing risk score
- Related findings
- Agent status
- Tool reach
- AgentTrust score

Policy evaluations account for:

- Scenario baseline decision
- Quarantined state
- Related critical findings
- Matched policies

Control checks account for:

- Ownership findings
- Quarantined agents
- Audit evidence volume

## New Routes

```text
/security
GET  /api/security/posture
POST /api/security/evaluate
POST /api/security/incident
GET  /api/evidence/export/:framework
```

## Incident Response

Agent Passport pages now include:

- Quarantine agent
- Restore to review

Every incident action writes an audit event.

## Evidence Export

Compliance detail pages now include a JSON evidence export. The export includes:

- Framework mapping
- Current posture summary
- Audit events
- Connector runs
- Findings

## Current Limitation

The security engine is deterministic and code-based. In a later phase, policy logic can move to OPA, Cedar, OpenFGA, or a database-backed rule editor after the product workflow is validated.
