# AgentShield Phase 4 Completion

## What Phase 4 Adds

Phase 4 starts the real integration layer.

Implemented areas:

- Connector metadata model
- Required environment-variable checks per connector
- Connector run history
- Connector sync API
- GitHub live-sync path when credentials are configured
- Demo fallback sync for GitHub, Microsoft Entra/Azure, AWS IAM, and Kubernetes
- Integration detail pages with sync status and recent runs

## Connector Routes

```text
POST /api/integrations/:slug/sync
POST /api/integrations/:slug/connect
GET  /api/integrations
```

## GitHub Live Sync

The GitHub connector can call the GitHub API when these variables are configured:

```text
GITHUB_TOKEN
GITHUB_OWNER
```

Free setup:

1. Go to GitHub.
2. Create a fine-grained personal access token.
3. Limit it to read-only repository metadata where possible.
4. Add it to Vercel as `GITHUB_TOKEN`.
5. Add your GitHub username or org as `GITHUB_OWNER`.

Without these values, the connector still runs in demo mode.

## Microsoft Entra / Azure Setup

The app is prepared for Entra sync but does not call Microsoft Graph yet. Required future variables:

```text
AZURE_TENANT_ID
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
```

Free setup:

1. Create an Azure app registration.
2. Grant read-only Microsoft Graph permissions for application and service principal inventory.
3. Create a client secret.
4. Add the variables to Vercel.
5. Add the Microsoft Graph sync adapter in the next phase.

## Current Limitation

GitHub has a live API path. Microsoft Entra/Azure, AWS IAM, and Kubernetes have credential-ready placeholders and demo sync behavior until their provider-specific adapters are implemented.
