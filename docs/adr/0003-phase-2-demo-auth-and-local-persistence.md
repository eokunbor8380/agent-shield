# ADR 0003: Phase 2 Uses Demo Auth and Local Persistence

## Status

Accepted

## Context

AgentShield needs authentication, tenant boundaries, persistence, and auditability. The user also requires a free or near-free build path. Adding a full production auth provider and managed database before the product workflows are tested would create account setup friction and possible cost.

## Decision

Phase 2 implements demo authentication with an HTTP-only cookie and a tenant-aware local JSON store. Console routes and core API routes are protected. Write actions produce audit events.

## Consequences

- The application can be tested as a protected SaaS console immediately.
- No paid infrastructure is required.
- Runtime writes persist locally during development.
- Runtime writes are not durable on Vercel serverless deployments.
- Phase 3 should replace demo auth and local persistence with real auth and Postgres.
