create table if not exists tenants (
  id text primary key,
  name text not null,
  plan text not null,
  region text not null default 'us-east',
  status text not null default 'Active',
  created_at timestamptz not null default now()
);

create table if not exists users (
  id text primary key,
  tenant_id text not null references tenants(id),
  name text not null,
  email text not null,
  role text not null,
  platform_role text,
  password_hash text,
  password_reset_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists roles (
  id text primary key,
  tenant_id text not null references tenants(id),
  name text not null,
  type text not null,
  description text not null,
  permissions jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists agents (
  id text primary key,
  tenant_id text not null references tenants(id),
  name text not null,
  type text not null,
  owner text not null,
  environment text not null,
  status text not null,
  trust_score integer not null,
  risk_score integer not null,
  tools jsonb not null,
  data_reach text not null,
  assurance text not null,
  last_seen text not null,
  passport jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists findings (
  id text primary key,
  tenant_id text not null references tenants(id),
  title text not null,
  severity text not null,
  entity text not null,
  entity_id text,
  status text not null,
  owner text not null,
  due text not null,
  impact text not null,
  evidence jsonb not null,
  remediation jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists integrations (
  slug text primary key,
  tenant_id text not null references tenants(id),
  kind text not null,
  name text not null,
  status text not null,
  scope text not null,
  freshness text not null,
  setup jsonb not null,
  required_env jsonb not null,
  sync_mode text not null,
  updated_at timestamptz not null default now()
);

create table if not exists connector_runs (
  id text primary key,
  tenant_id text not null references tenants(id),
  integration_slug text not null references integrations(slug),
  status text not null,
  source text not null,
  summary text not null,
  started_at timestamptz not null,
  finished_at timestamptz
);

create table if not exists tenant_integration_configs (
  id text primary key,
  tenant_id text not null references tenants(id),
  integration_slug text not null,
  status text not null,
  credentials jsonb not null,
  masked_credentials jsonb not null,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, integration_slug)
);

create table if not exists report_snapshots (
  id text primary key,
  tenant_id text not null references tenants(id),
  report_type text not null default 'custom',
  title text not null,
  summary text not null,
  source text not null,
  metrics jsonb not null,
  sections jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists report_definitions (
  id text primary key,
  title text not null,
  category text not null,
  cadence text not null,
  description text not null,
  sections jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists policies (
  id text primary key,
  tenant_id text not null references tenants(id),
  name text not null,
  category text not null default 'Baseline',
  pack text not null default 'Required Baseline',
  decision text not null,
  enforcement_mode text not null default 'Monitor',
  risk_tier text not null default 'High',
  rule text not null,
  business_value text not null default '',
  configuration jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  frameworks jsonb not null default '[]'::jsonb,
  status text not null default 'Active',
  source text not null default 'standard',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists evidence_controls (
  slug text primary key,
  tenant_id text not null references tenants(id),
  framework text not null,
  control text not null,
  status text not null,
  evidence jsonb not null
);

create table if not exists audit_events (
  id text primary key,
  tenant_id text not null references tenants(id),
  actor text not null,
  action text not null,
  target text not null,
  created_at timestamptz not null default now()
);

create table if not exists security_controls (
  id text primary key,
  tenant_id text not null references tenants(id),
  name text not null,
  description text not null,
  framework text not null,
  created_at timestamptz not null default now()
);

create table if not exists policy_evaluations (
  id text primary key,
  tenant_id text not null references tenants(id),
  scenario_id text not null,
  agent_id text not null,
  action text not null,
  decision text not null,
  reasons jsonb not null,
  matched_policies jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists evidence_exports (
  id text primary key,
  tenant_id text not null references tenants(id),
  framework_slug text not null,
  package jsonb not null,
  exported_by text not null,
  exported_at timestamptz not null default now()
);

create table if not exists demo_requests (
  id text primary key,
  tenant_id text not null references tenants(id),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
