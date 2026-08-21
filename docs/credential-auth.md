# AgentShield Credential Authentication

## What Changed

AgentShield now has an actual credential flow:

- Register a workspace at `/register`
- Sign in at `/sign-in`
- Passwords are hashed with Node.js `scrypt`
- Sessions use an HTTP-only cookie
- Protected pages require a valid session

## Admin Login

The seeded owner email is:

```text
Email: leeokk80@gmail.com
Role: Super Admin
```

For security, the initial password is not stored in code. Set this Vercel environment variable before relying on the seeded owner login:

```text
AGENTSHIELD_OWNER_INITIAL_PASSWORD=<your-strong-temporary-password>
```

Optional:

```text
AGENTSHIELD_OWNER_EMAIL=leeokk80@gmail.com
```

Without `AGENTSHIELD_OWNER_INITIAL_PASSWORD`, create the first account through `/register`.

## Roles

System roles:

- `Super Admin`: full platform and workspace owner permissions.
- `Admin`: manage users, roles, integrations, policy, risk, and evidence.
- `Standard`: operate normal security workflows.
- `Read-Only`: view console data and export/view evidence.
- `Custom`: created by Super Admin or Admin users.

Custom roles can be created at:

```text
/settings/roles
```

## User Management

Super Admin and Admin users can manage accounts at:

```text
/settings/users
```

Available actions:

- Create a user
- Assign any system or custom role
- Reset another user's password

The current implementation stores passwords as hashes. Until Postgres or managed auth is connected, user accounts remain part of the prototype local/memory store.

## Platform Owner Tenant Management

The AgentShield application owner has `platformRole: Owner` and can create customer tenants at:

```text
/platform/tenants
```

Each customer tenant gets:

- Its own tenant ID
- Its own Super Admin owner account
- Its own system roles
- Its own user-management area

Customer tenant admins manage their own workspace under `/settings/users` and `/settings/roles`. They do not get access to `/platform/tenants`.

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
