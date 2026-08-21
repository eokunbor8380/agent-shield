# ADR-0001: Free Phase 1 Stack

## Status

Accepted

## Context

AgentShield's full design describes an enterprise SaaS platform with databases, event streaming, graph analytics, policy engines, runtime gateways, connectors, observability, and compliance evidence services. The first implementation must stay free or near-free while preserving a path toward that destination architecture.

## Decision

Phase 1 will use:

- Next.js, React, and TypeScript for the web application
- Tailwind CSS for styling
- Static/mock data in code for the first UI pass
- GitHub for source control
- Vercel Hobby for hosting

Phase 1 will not yet provision Kafka, Neo4j, ClickHouse, OpenSearch, Kubernetes, SPIRE, Vault, or paid cloud resources.

## Consequences

The first build is cheap, fast to deploy, and easy to review. It is not yet a production security enforcement platform. The codebase must keep data and UI boundaries clean so database, auth, connectors, event ingestion, policy evaluation, and graph services can be introduced without rewriting the entire product.
