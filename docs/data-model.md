# AgentShield Phase 1 Data Model

Phase 1 stores data in `src/data/agentShield.ts`. The model is intentionally simple but shaped like a future database schema.

## Core Entities

- `agents`: agent and non-human identity records.
- `findings`: risk issues tied to owners, severity, evidence, and remediation.
- `policies`: policy rules and expected decisions.
- `policySimulationScenarios`: sample authorization decisions.
- `integrations`: connector catalog and setup steps.
- `evidenceControls`: compliance framework mappings and evidence packages.
- `timeline`: authorization and runtime event history.
- `metrics`: dashboard posture metrics.

## Future Database Tables

When Phase 2 adds persistent storage, the likely first tables are:

- `tenants`
- `users`
- `agents`
- `agent_credentials`
- `agent_tools`
- `findings`
- `policies`
- `policy_simulations`
- `integrations`
- `evidence_controls`
- `audit_events`

## API Boundaries

Current mock API endpoints:

- `GET /api/agents`
- `GET /api/agents/:id`
- `GET /api/findings`
- `GET /api/integrations`
- `GET /api/evidence`
- `GET /api/policies/simulate`
- `POST /api/policies/simulate`
- `POST /api/demo-request`

These routes make it easier to replace mock data with database-backed services later.
