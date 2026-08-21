# AgentShield Phase 3 Completion

## What Phase 3 Adds

Phase 3 prepares AgentShield for a real production SaaS foundation without forcing paid services today.

Implemented areas:

- Tenant-aware settings page
- Runtime mode detection
- Environment readiness checks
- Protected settings API
- Database-ready SQL schema
- `.env.example` template
- Users, tenant metadata, and audit events visible in the app

## Free Production Path

Recommended free or near-free setup:

1. Keep GitHub as the source repository.
2. Keep Vercel Hobby for hosting.
3. Add Neon Free or Supabase Free for Postgres when durable data is needed.
4. Add Clerk Free, Supabase Auth Free, or Auth.js when real user sign-in is needed.
5. Store secrets in Vercel project environment variables.

## Environment Variables

The template is stored in `.env.example`.

Important keys:

- `APP_BASE_URL`
- `AUTH_PROVIDER`
- `DATABASE_URL`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `AZURE_TENANT_ID`
- `AZURE_CLIENT_ID`
- `AZURE_CLIENT_SECRET`

## Database Schema

The Postgres-ready schema is stored at:

```text
db/schema.sql
```

Tables included:

- `tenants`
- `users`
- `agents`
- `findings`
- `integrations`
- `connector_runs`
- `policies`
- `evidence_controls`
- `audit_events`
- `demo_requests`

## Current Limitation

The app still uses local JSON plus memory fallback until `DATABASE_URL` is connected and a database adapter is added. This avoids cost now and keeps the Phase 3 code deployable.
