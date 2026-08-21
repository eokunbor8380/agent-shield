# AgentShield Tenant Onboarding And Reporting

AgentShield is designed as a multi-tenant platform. You own the platform, and each customer gets a separate tenant workspace.

## Customer Onboarding Flow

1. Platform owner creates a tenant in `/platform/tenants`.
2. Platform owner creates the first tenant owner/admin account.
3. Tenant admin signs in and opens `/onboarding`.
4. Tenant admin creates users in `/settings/users`.
5. Tenant admin assigns system or custom roles in `/settings/roles`.
6. Tenant admin opens `/integrations` and chooses the first data source.
7. Tenant admin saves tenant-specific connector credentials.
8. Tenant admin runs sync.
9. Synced data appears in `/agents`, `/risk`, `/security`, `/compliance`, and `/reports`.

## First Recommended Integrations

Start with the free or near-free sources that already exist in customer environments:

- GitHub: repositories, apps, bots, workflow automation, and release identities.
- Microsoft Entra / Azure: service principals, managed identities, app registrations, and role assignments.
- AWS IAM: roles, policies, access keys, and workload identities.
- Kubernetes: service accounts, workloads, namespaces, and runtime identity surfaces.

## How Visibility Feeds The Platform

The current free-tier implementation stores connector configuration in the local AgentShield store. When a tenant runs sync:

- A connector run is recorded.
- GitHub repositories are mapped into agent inventory records.
- A report snapshot is generated.
- Audit activity is written.
- The Reports screen summarizes discovered inventory, risk, and evidence.

For credentials, use read-only or least-privilege tokens. In production, credentials should move to encrypted database fields or a managed secret store.

## Current Free-Tier Limits

The app intentionally avoids paid infrastructure right now. Local JSON persistence works for development and Vercel warm instances, but it is not durable enough for real customer production data.

Before live customer onboarding, move persistence to one of these free-tier options:

- Neon Postgres Free
- Supabase Free

Keep Vercel Hobby for hosting until traffic or business requirements justify upgrading.

## Owner Operating Model

As the platform owner:

- Use `/platform/tenants` to create customer tenants.
- Use `/settings/users` inside each tenant to manage users.
- Use `/settings/roles` to create customer-specific custom roles.
- Use `/reports` to confirm whether sync activity is producing useful visibility.
- Use `/api/reports` for tenant-scoped reporting data.

