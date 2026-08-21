# AgentShield Credential Authentication

## What Changed

AgentShield now has an actual credential flow:

- Register a workspace at `/register`
- Sign in at `/sign-in`
- Passwords are hashed with Node.js `scrypt`
- Sessions use an HTTP-only cookie
- Protected pages require a valid session

## Current Storage

User accounts are stored in the current Phase 2/3 local store:

```text
.agent-shield-data/store.json
```

On Vercel serverless, this remains a memory-backed prototype until a database is connected.

## Production Recommendation

For real customer use, connect one of these next:

- Clerk Free for managed authentication
- Supabase Auth Free plus Supabase Postgres
- Auth.js plus Neon Free Postgres

The current credential flow proves the product workflow. Durable production accounts still require Postgres or a managed auth provider.
