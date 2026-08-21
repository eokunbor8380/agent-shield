# AgentShield

AgentShield is an enterprise AI agent security control plane. The destination product discovers AI agents and non-human identities, maps authorization and data reach, scores risk, enforces least privilege, and preserves forensic evidence for autonomous actions.

## Phase 1 Scope

This first implementation is intentionally free/near-free and production-shaped:

- Next.js App Router with TypeScript
- Tailwind CSS
- Static/mock data in code
- Public landing page
- Dashboard
- Agent inventory and passport-style cards
- Risk center
- Policy center
- Integrations catalog
- Contact/demo request page

Database, authentication, email delivery, real connectors, event streaming, graph storage, and runtime enforcement are deferred until the UI and data model are stable.

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
