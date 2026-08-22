# AgentShield Policy Library

AgentShield policies are organized into three layers.

## Required Baseline Policies

These are the minimum controls every tenant should start with:

- Agent Registration Required
- Human Owner And Sponsor Required
- Agent Passport Required
- Least Privilege Required
- Time-Bound Credential Required
- Audit Evidence Required

## AgentShield Signature Policies

These are the differentiated controls that make AgentShield agent-specific:

- Purpose-Bound Access
- Intent Mismatch Detection
- Autonomy Level Enforcement
- Delegated User Risk Inheritance
- Agent-To-Agent Chain Control
- Toxic Permission Combination Detection
- Blast Radius Expansion Detection
- Shadow Agent Quarantine
- High-Impact Action Challenge
- Data Boundary Enforcement
- Agent Kill Switch
- Real-Time Decision Trace

## Custom Policy Library

Customers can activate or clone policy packs based on their business use case:

- Healthcare PHI Protection Pack
- Financial Services Control Pack
- DevOps Agent Pack
- Cloud Identity Pack
- Regional Privacy Pack
- Legal Confidentiality Pack

## How Customers Use It

1. Open `/policy`.
2. Review active tenant policies.
3. Activate a standard or signature policy.
4. Clone a custom policy template when they need tenant-specific tuning.
5. Use `/policy/simulate` and `/reports` to review decisions and evidence.

Policy actions are tenant-scoped and audit logged.

