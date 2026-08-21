# AgentShield Phase 2 Completion

## What Phase 2 Adds

Phase 2 turns the Phase 1 prototype into a basic SaaS application foundation while keeping the project free to run.

Implemented areas:

- Demo sign-in and sign-out
- Secure HTTP-only session cookie
- Protected console pages
- Protected API routes
- Tenant-aware demo workspace
- Local JSON persistence for development
- In-memory fallback for serverless deployments
- Audit activity for sign-in and workflow actions
- Demo request storage
- Writable finding remediation workflow
- Writable integration connection workflow

## Why This Is Still Free

No paid service is required for this phase. The app uses local JSON persistence in development and gracefully falls back to memory in serverless environments.

This is good for product testing. It is not the final production data layer because Vercel serverless instances do not guarantee durable local filesystem writes.

## Production Free-Tier Recommendation

When you are ready for real users and durable data, use this order:

1. Clerk Free or Supabase Auth Free for real sign-in.
2. Neon Free or Supabase Free Postgres for durable storage.
3. Vercel environment variables for secrets.
4. One live connector first, preferably GitHub or Microsoft Entra.
5. Audit logging stored in Postgres.

## Demo Sign-In

Use the sign-in page:

```text
/sign-in
```

The demo session uses:

```text
leeokk80@gmail.com
```

No password is required in this prototype. Production auth will replace this.

## Protected Console Routes

These routes now require sign-in:

```text
/dashboard
/agents
/risk
/policy
/compliance
/integrations
```

Protected API groups:

```text
/api/agents
/api/findings
/api/integrations
/api/evidence
/api/policies
```

Public API groups:

```text
/api/auth/sign-in
/api/auth/sign-out
/api/demo-request
```

## Local Persistence

In local development, writable data is stored at:

```text
.agent-shield-data/store.json
```

This file is runtime data and should not be committed.
