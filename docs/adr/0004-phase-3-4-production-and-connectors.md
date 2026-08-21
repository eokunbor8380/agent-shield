# ADR 0004: Phase 3 and 4 Add Production Boundaries Before Paid Services

## Status

Accepted

## Context

AgentShield needs real auth, durable data, and live integrations. The user wants to keep cost at zero or near zero while continuing to build the product.

## Decision

Phase 3 adds environment readiness, tenant settings, and a Postgres-ready schema. Phase 4 adds connector metadata, sync runs, and a GitHub live-sync path that activates only when free GitHub credentials are provided. Other connectors remain credential-ready placeholders with demo sync behavior.

## Consequences

- The app remains deployable on Vercel Hobby.
- No paid service is required to test the product.
- The database and connector boundaries are now explicit.
- Durable production persistence still requires a free-tier Postgres provider.
- Real Microsoft Entra, AWS, and Kubernetes adapters remain future work.
