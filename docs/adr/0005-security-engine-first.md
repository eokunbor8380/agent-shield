# ADR 0005: Build a Deterministic Security Engine Before External Policy Infrastructure

## Status

Accepted

## Context

The AgentShield design documents call for enterprise policy and authorization components such as OPA, Cedar, OpenFGA, runtime gateways, and signed evidence. Those tools are useful, but adding them before validating workflows would add complexity and potential cost.

## Decision

Phase 5 implements a deterministic in-application security engine. It computes explainable risk scores, evaluates policy scenarios, checks controls, performs incident response state changes, and exports evidence packages.

## Consequences

- The product gains real security behavior without paid infrastructure.
- Policy and risk decisions are explainable in the UI.
- APIs are shaped for future policy-engine replacement.
- Advanced external policy engines remain deferred until the workflow and data model are stable.
