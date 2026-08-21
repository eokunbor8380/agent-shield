# AgentShield

AgentShield is an enterprise AI agent security control plane. The destination product discovers AI agents and non-human identities, maps authorization and data reach, scores risk, enforces least privilege, and preserves forensic evidence for autonomous actions.

## Phase 1 Scope

This first implementation is intentionally free/near-free and production-shaped:

- Next.js App Router with TypeScript
- Tailwind CSS
- Static/mock data in code
- Public landing page
- Dashboard
- Agent inventory and Agent Passport detail pages
- Risk center and finding detail pages
- Policy center and policy simulator
- Integrations catalog and setup checklist pages
- Compliance evidence mappings and evidence detail pages
- Contact/demo request page through a local API route
- Mock API endpoints for agents, findings, policies, integrations, and evidence

Database, authentication, email delivery, real connectors, event streaming, graph storage, and runtime enforcement are deferred until the UI and data model are stable.

## Phase 1 Routes

```text
/
/dashboard
/agents
/agents/as-agent-fin-0184
/risk
/risk/AS-FND-1014
/policy
/policy/simulate
/integrations
/integrations/github
/compliance
/compliance/nist-csf
/contact
```

## Mock API Routes

```text
GET  /api/agents
GET  /api/agents/as-agent-fin-0184
GET  /api/findings
GET  /api/integrations
GET  /api/evidence
GET  /api/policies/simulate
POST /api/policies/simulate
POST /api/demo-request
```

## Local Development

Because the workspace path contains `&`, package scripts call local binaries through Node directly.

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path
npm run dev
```

Open:

```text
http://localhost:3000
```

## Quality Checks

```powershell
npm run lint
npm run build
```

Both commands must pass before pushing changes.

## Planned Free-Tier Additions

- GitHub repository: `eokunbor8380/agent-shield`
- Hosting: Vercel Hobby
- Database: Neon Free or Supabase Free
- Auth: Auth.js or Clerk Free
- Email: Resend Free when backend delivery is needed

## Architecture Records

Architecture decisions are tracked in `docs/adr`.
