# AgentShield Launch Checklist

## Vercel

- Confirm latest GitHub deployment is green.
- Set `APP_BASE_URL` to the production URL or custom domain.
- Keep the project on Vercel Hobby until traffic or compliance needs require an upgrade.

## Domain

- Buy the domain from GoDaddy only when ready.
- Add the domain in Vercel Project Settings.
- Copy Vercel DNS records into GoDaddy DNS.
- Wait for Vercel to show valid SSL.

## Free Production Services

Use only when needed:

- Auth: Clerk Free, Supabase Auth Free, or Auth.js.
- Database: Neon Free or Supabase Free Postgres.
- Email: Resend Free for backend email delivery.

## Environment Variables

Set these in Vercel only when you activate the related capability:

```text
APP_BASE_URL
AUTH_PROVIDER
DATABASE_URL
GITHUB_TOKEN
GITHUB_OWNER
AZURE_TENANT_ID
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
```

## Manual Smoke Test

After every deployment:

1. Open `/`.
2. Open `/api/health`.
3. Open `/sign-in`.
4. Sign in as demo admin.
5. Open `/dashboard`.
6. Open `/security`.
7. Open `/integrations/github` and run sync.
8. Open `/compliance/nist-csf` and export evidence.
9. Open an Agent Passport and test quarantine/restore.

## Go/No-Go

Go live when:

- Vercel deployment is ready.
- Health endpoint returns `ok`.
- Sign-in works.
- Protected pages redirect when signed out.
- Security page loads after sign-in.
- Evidence export returns JSON.
