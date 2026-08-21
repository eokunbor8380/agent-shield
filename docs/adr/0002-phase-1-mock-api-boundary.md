# ADR 0002: Phase 1 Uses Mock APIs Before Paid Infrastructure

## Status

Accepted

## Context

The complete AgentShield design calls for multiple backend services, event pipelines, graph storage, analytics storage, search, policy engines, and cloud integrations. Building all of that immediately would increase cost and complexity before validating the product experience.

## Decision

Phase 1 uses Next.js API routes backed by in-repository mock data. The routes are shaped like backend contracts so the app can later move to persistent storage and live connectors with less UI churn.

## Consequences

- The prototype remains free to host on Vercel Hobby.
- Demo pages can be clicked end-to-end.
- API responses can be tested immediately.
- Data resets when source files change because there is no database yet.
- Real authentication, tenancy, persistence, and connector sync are deferred to Phase 2.
