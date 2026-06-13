---
pubDatetime: 2026-06-12T15:00:00.000Z
modDatetime: 2026-06-12T15:00:00.000Z
title: "Security & Compliance: AI Workflows for Regulated Industries"
slug: security-and-compliance
featured: false
tags:
  - ai
  - compliance
  - security
  - enterprise
  - architecture
  - grove
description: "Grove is a DAG-based workflow engine built for regulated industries. One-shot execution, per-node audit trail, AES-256-GCM encryption, air-gap deployment, and provable data disposal for organizations with strict data custody requirements."
ogImage: "https://cdn.enginyyr.com/arborist-dag.png"
canonicalURL: "https://grove.enginyyr.com/compliance/"
draft: false
---

*Originally posted on the [Grove blog](https://grove.enginyyr.com/compliance/).*

Grove executes workflows as one-shot directed graphs: input in, DAG runs, output out. No hidden state, no implicit memory, no surprise side effects. Deploy within your own infrastructure, maintain a complete audit trail of every run, and keep regulated data under your control.

## Workflows as bounded executions

Grove's execution model is predictable by design: each workflow run takes an explicit input, traverses a directed graph of nodes, and produces an explicit output. The graph is defined up front and cannot change mid-run. Every data dependency is visible in the definition. For non-conversational workloads — extraction, classification, enrichment, multi-step analysis — there is no implicit state between runs.

- **Air-gap compatible** — Grove runs as a self-contained Kubernetes deployment within your VPC. The orchestration engine, database, and all workflow state remain inside your infrastructure perimeter.
- **Your LLM keys, your contracts** — API keys for LLM providers are passed per-request via HTTP headers. You use your own enterprise agreements with Anthropic, OpenAI, or Google. We are not a party to the LLM inference chain — your data flows directly from your infrastructure to your provider.
- **Self-hosted model support** — For workflows processing the most sensitive data, route specific nodes to self-hosted models running within your VPC. Different nodes in the same workflow can use different providers — cloud APIs for non-sensitive tasks, self-hosted models for everything else.
- **No implicit state** — A workflow run is self-contained. It receives its inputs, executes its nodes, and returns its outputs. Nothing carries over to the next run except the persisted audit trail. Conversational state is an optional, opt-in layer — most workflows do not use it at all.

## Encryption & secrets management

Credentials and sensitive configuration are encrypted at rest using industry-standard cryptography. Secret values are never exposed through the API.

| | |
| --- | --- |
| **Algorithm** | AES-256-GCM — authenticated encryption with per-value nonces |
| **Key management** | Server-side encryption key loaded from environment; never persisted to storage |
| **API design** | Values write-only — the API never returns secret content, only confirms existence |

## Workflow documentation

Grove supports plain-language workflow documentation for compliance review. Each workflow can carry human-authored metadata and per-node descriptions, and the platform can export the current workflow as a CCO-friendly markdown document.

- **Plain-language metadata** — Workflows can include a description, purpose statement, category, data classification, and owning team. These fields are designed for human reviewers rather than model execution.
- **Per-node documentation** — Every node can carry its own description so compliance staff can understand what each step does without reading prompts or application code.
- **Markdown compliance export** — A dedicated API endpoint renders the workflow, execution order, node details, referenced models, and accessible tools as a markdown document that can be reviewed directly or printed to PDF.
- **Metadata change history** — Metadata edits are audit-logged field by field. Compliance staff can see who changed a workflow description, what the previous value was, and what it said at any historical point.

## Per-node audit trail

Every workflow execution produces a complete, timestamped record of what ran, when, with what inputs and outputs, and how long it took. This audit trail is persisted to PostgreSQL and queryable via API.

- **Node execution records** — Each node in a workflow — every LLM call, tool invocation, and data transformation — generates a durable execution record capturing its upstream inputs, output value, status, error details, and wall-clock duration. Full data provenance for every decision.
- **Real-time event stream** — Server-Sent Events (SSE) stream every workflow event as it happens: node started, node completed, tool calls requested, results received, run completed. Build monitoring and alerting on top of the native event stream.
- **Run configuration capture** — The execution configuration for every run — which model, what tools, timeout settings, session bindings — is captured and persisted at run creation time. Full reproducibility of the execution context.
- **Tool call tracking** — Every tool invocation within a workflow is recorded: what was requested, what inputs were provided, and when results were received. Both built-in and application-defined tool calls are captured in the audit trail.

## Immutable records & non-destructive lifecycle

Workflow definitions and execution history are preserved throughout their lifecycle. The audit trail is append-only at the operational level — records are not overwritten or removed during normal operation.

- **Workflow immutability** — Workflow definitions are create-and-retire only. There is no update operation. A workflow deployed on day 1 remains byte-identical throughout its operational lifetime, so every audit record unambiguously references the exact workflow that was executed. Retired workflows are soft-deleted and retained.
- **Non-destructive audit trail** — Run records and node execution history are not deleted during normal operation. Failed runs retain their complete execution trail — which nodes ran, what inputs they received, what outputs they produced, and where execution halted — so incidents can be fully reconstructed after the fact.

## First-class multi-tenant isolation

Grove models tenants as a first-class entity in the database, not an opaque label. Every tenant-owned table — workflows, runs, sessions, agents, skills, secrets, storage profiles, triggers, disposal log — carries a non-null `tenant_id` with a foreign key to `tenants`. Postgres Row-Level Security policies enforce the boundary as defense-in-depth. The repository layer filters every `SELECT`, `UPDATE`, and `DELETE` by `tenant_id`, and a cross-tenant fetch returns **404, not 403** — existence is not leaked across the tenant boundary.

- **The tenant entity** — A real row in a `tenants` table with `id`, `name`, `slug`, `status`, and lifecycle states (`active`, `suspended`, `deleted`). A suspended tenant's API keys are rejected by the auth layer at authentication time, before any handler runs.
- **Per-tenant secrets & LLM credentials** — Secrets, provider records, and model-group definitions are keyed on `(tenant_id, name)` — one tenant's Anthropic key is invisible to another. The `SecretStore` trait takes a `tenant_id` on every operation; OAuth tokens, git credentials, and connector credentials live in the calling tenant's namespace.
- **Per-tenant quotas & budgets** — Operators set per-tenant limits for concurrent runs, runs per hour, and USD budget per period. The rate limiter, run scheduler, and broker check the limits before launching work. Caps are observable through tenant usage views.
- **Tenant lifecycle API** — An admin-gated lifecycle surface — `POST /tenants` provisions a tenant and mints its initial API key in one call; `PATCH /tenants/:id` toggles status; `GET /tenants/:id/export` bundles every tenant-owned row for portability; `DELETE /tenants/:id` drives the disposal pipeline.
- **Trusted-caller assertion** — Keys come in two kinds. `Tenant` keys are pinned to one tenant and cannot escape it. `Service` keys may assert a tenant per request via signed headers — the trust model is "trust who, enforce what". A tenant key's assertion headers are ignored at the auth layer.
- **Per-run execution context** — Every workflow run constructs its own execution context — inputs, tool registry, scratch state — at run start, and discards it when the run completes. One run cannot read another's data, even within the same tenant.

## Data disposal & right-to-erasure

Grove provides provable data disposal with a forever-retained audit trail. When customer data needs to be removed — whether for retention policies, customer offboarding, or regulatory deletion requests — the disposal is genuine, recorded, and cryptographically attested.

- **Tombstones for audit records** — Run history and per-node execution records are tombstoned: their content is erased while the row remains as a marker. The audit trail's structural integrity is preserved — foreign key references survive — without retaining any of the disposed data.
- **Hard delete for sensitive data** — Sessions, conversation messages, and session memory are hard-deleted on disposal. PII-bearing records are physically removed from storage, not flagged or hidden.
- **Disposal audit log** — Every disposal event is recorded in a separate, forever-retained audit log: what was disposed, when, by whom, why, and a SHA-256 hash of the original record content. The hash proves the record existed without retaining its content.
- **Owner-scoped bulk disposal** — Records can be tagged with an opaque owner label at creation time. A single API call disposes every workflow, run, and session associated with a given label — ideal for customer offboarding and tenant-scoped erasure requests.

| | |
| --- | --- |
| **Disposal endpoints** | Per-record (run, workflow, session) and bulk (by owner label) with dry-run preview |
| **Cascade semantics** | Disposing a workflow cascades to its runs and node executions; sessions are intentionally not cascaded |
| **Audit query API** | Disposal log is queryable by table, record ID, owner label, and date range |

## Durability & crash recovery

Grove persists execution state at every step. If the server crashes mid-workflow, failed runs can be resumed from the last completed checkpoint — no data loss, no re-execution of already-completed work.

| | |
| --- | --- |
| **Checkpoint persistence** | Per-node outputs persisted to PostgreSQL as each node completes |
| **Stale run detection** | On startup, orphaned in-progress runs are automatically detected and marked failed |
| **Resume from checkpoint** | Failed runs resume execution from the last completed node — already-finished work is not repeated |
| **Atomic claims** | Concurrent resume requests are safely handled — exactly one succeeds |

## Agent runtime safety

Grove's autonomous agent runtime is designed for execution inside regulated environments. A goal-driven agent is bounded at four layers — sandbox, allowlist, budget, and durability — each of which is independently auditable.

- **Sandboxed workspace** — Agents that write files or run shells get a per-run ephemeral workspace under a container sandbox (namespaces, cgroups, `--network none`, bind-mounted root). Real-path containment resolves symlinks on every file op. A file-writing run is refused when no usable sandbox is available — never run unsandboxed.
- **Allowlisted tools** — An agent definition declares exactly which tools it may use. The runtime validates the allowlist at definition time against the registry's known tool names and builds a fresh per-run tool registry on every run — nothing leaks between runs.
- **Budget caps** — Per-run token and USD budget caps stop the loop the moment they trip. Sub-agent delegation passes the parent's *remaining* budget down so the tree's worst-case spend is bounded, not unbounded. Cost is computed from the `model_prices` table.
- **Durable turn history** — Every turn writes to `agent_run_turns` incrementally. Each tool call is bracketed by a **Started** / **Completed** idempotency marker so a crash mid-tool does not re-run a side-effecting operation on resume — the LLM sees an "interrupted" error rather than risking duplicate work.
- **Sub-agent containment** — Delegated children are capped on depth (default 5) and fan-out (default 10) per parent. The child-count check is a single atomic `UPDATE … WHERE child_count < max` — no race that lets siblings exceed the cap. Cancellation cascades to every descendant via a shared atomic flag.
- **Tenant-scoped git credentials** — Agent `git_*` tools fetch credentials through a tenant-bound `SecretStoreCredentialProvider`. Per-host tokens come from the calling tenant's secret namespace; they never appear in the agent's prompt or the request body.

## Enterprise LLM provider management

Register and manage LLM providers through a secure API with support for multiple authentication methods. Route workflows through named model groups with automatic failover.

- **Five provider backends** — Anthropic, OpenAI, Google Gemini, Vertex AI (Claude on GCP), and Azure OpenAI. Mix providers within a single workflow based on sensitivity, cost, or capability requirements.
- **Enterprise auth** — API keys (encrypted in the secrets store), OAuth2 client credentials, GCP managed identity, and Azure managed identity. No plaintext credentials in configuration.
- **Named model groups** — Define model tiers — fast, standard, frontier — and the broker resolves them to concrete providers. Change what "fast" means across all workflows without modifying any workflow definition.
- **Automatic failover** — Model groups support ordered backends. If the primary provider is unavailable (rate limited, down, or timing out), the broker automatically falls through to the next backend.

## Regulatory alignment

Grove's architecture supports compliance with data protection frameworks across regulated industries — financial services, healthcare, legal, and any environment where data custody and auditability are required.

| Requirement | Grove capability |
| --- | --- |
| Administrative, technical, and physical safeguards | Air-gap deployment, AES-256-GCM encryption (with optional HashiCorp Vault KV v2 backend), first-class tenant entity with Postgres row-level isolation, Kubernetes namespace controls |
| Service provider oversight | Client-owned API keys for LLM providers — your enterprise agreements, your data relationship with the inference provider. The orchestration vendor is not a party to the LLM inference chain. |
| Incident detection and response | Per-node audit trail, real-time SSE event stream, persistent run history in PostgreSQL — the technical substrate for detection, investigation, and documentation. |
| Recordkeeping and retention | PostgreSQL persistence of workflow definitions, run history, node executions, session data, and execution configuration. Retention periods configurable to your regulatory requirements. |
| Data custody and sovereignty | Entire platform deploys within the institution's cloud boundary. Customer information never routes through external SaaS. |
| Data disposal and right to erasure | Per-record and bulk disposal endpoints with cryptographically attested audit log. Tombstone-based disposal preserves audit integrity for run history while hard-deleting PII-bearing session data. Owner-scoped purges support customer offboarding workflows. |

---

Grove is the DAG-based workflow and agent engine behind everything above. If you're building AI for an environment where data custody and auditability aren't optional, [check out Grove](https://grove.enginyyr.com).

*Grove provides the technical infrastructure for compliance. Regulatory compliance programs, written policies, and legal assessments are the responsibility of the deploying institution and should be developed with qualified compliance counsel.*
