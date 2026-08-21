# AgentShield Phase 1 Completion

## What Phase 1 Delivers

Phase 1 is a zero-cost, deployable SaaS prototype for AgentShield. It proves the product direction without requiring a paid database, queue, graph engine, SIEM, cloud account integration, or authentication provider.

Implemented areas:

- Public product homepage
- Dashboard for autonomous identity posture
- Agent and non-human identity inventory
- Agent Passport detail pages
- Risk findings queue and finding detail pages
- Policy center and deterministic policy simulator
- Integration catalog and setup checklist pages
- Compliance evidence mapping and evidence detail pages
- Contact/demo request form through a local API route
- Mock API endpoints shaped for a future real backend

## Free/Near-Free Stack

- GitHub for source control
- Vercel Hobby for hosting
- Next.js App Router for frontend and API routes
- Tailwind CSS for styling
- In-repository mock data for Phase 1

No paid services are required for Phase 1. A custom domain from GoDaddy is optional and can be connected to Vercel after purchase.

## What Is Intentionally Deferred

These items appear in the design documents, but are deferred until the product needs real tenants, real data, and real enforcement:

- PostgreSQL or Neon database
- Authentication and tenant isolation
- Live Microsoft Entra, Azure, AWS, GitHub, and Kubernetes connectors
- Kafka or Redpanda event streaming
- ClickHouse analytics storage
- Neo4j graph database
- OpenSearch search index
- OPA, Cedar, or OpenFGA policy engine
- SPIFFE/SPIRE workload identity infrastructure
- Kubernetes production deployment

## Phase 2 Entry Criteria

Move to Phase 2 when we are ready for sign-in, persistent data, and real customer workflows.

Recommended Phase 2 order:

1. Add authentication with a free-tier provider.
2. Add a free-tier Postgres database.
3. Replace mock data reads with database queries.
4. Add tenant/account boundaries.
5. Connect one real integration first, probably GitHub or Microsoft Entra.
6. Add audit logging for every important action.
