# AgentShield

AgentShield is an enterprise AI agent security control plane. The destination product discovers AI agents and non-human identities, maps authorization and data reach, scores risk, enforces least privilege, and preserves forensic evidence for autonomous actions.

## Phase 1 Scope

The first implementation is intentionally free/near-free and production-shaped:

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

## Phase 2 Scope

Phase 2 adds the first SaaS foundation:

- Demo sign-in and sign-out
- Protected console routes
- Protected API routes
- Tenant-aware demo workspace
- Local JSON persistence for development
- Audit activity
- Writable finding remediation workflow
- Writable integration connection workflow

This phase still avoids paid infrastructure. Production authentication and durable Postgres storage are planned for the next phase.

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
/sign-in
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
