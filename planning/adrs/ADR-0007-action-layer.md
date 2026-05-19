# ADR-0007: Action layer is the single canonical write surface

**Status:** Accepted (graduated from cross-cutting to spec-resident 2026-05-11; expanded to include the runtime trust substrate)
**Date:** 2026-05-09
**Deciders:** PM
**Scope:** Every write to every table the platform owns — `members`, `items`, `locations`, `groups`, every `*_events` log, every join table — flows through named action handlers. Six runtime-trust concerns are enforced here
**Touches:** [`product/systems/action-layer.md`](../../product/systems/action-layer.md) (canonical home — the entire document carries the load-bearing prose), every Phase 0/1 migration in [`notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md), `web/src/actions/` (the implementation directory), every other system spec (action handlers ship alongside their tables), [`product/foundation/agent-assistance.md`](../../product/foundation/agent-assistance.md) (ADR-6 — agent writes flow through the same handlers as human writes), ADR-10 (consolidated into this ADR 2026-05-10 — same-transaction invariant, audit fields, view-refresh semantics)
**Supersedes:** Original ADR-10 transactional model (consolidated 2026-05-10 when the rebuild reframe retired dual-write / per-phase rollback / verification-window concerns)

## Decision

The action layer is the **only** write surface for any table the platform owns. Every write — human-initiated, agent-initiated, platform-initiated, federation-initiated — flows through a named, schema-validated, transactional action handler. There is no back door, no admin SQL path that bypasses, no "trusted internal" exception.

Each action handler:

- **Is named** (one camelCase identifier per write — e.g., `member.create`, `item.publish`, `group.member_join`).
- **Has a schema-validated input** (Zod schema enforced at the function entry).
- **Runs inside a transaction** that commits the data row + the matching `*_events` row **in the same transaction**. If the event log write fails, the data row write rolls back. This is the same-transaction invariant inherited from the original ADR-10.
- **Populates audit fields** (`acting_member_id NOT NULL`, `via_delegation_id` when an agent acted, trace ID in `payload` jsonb) inside the handler. The application code cannot write a row without audit fields.
- **Uses the system Member** (`handle='system'`, created by Phase 0 migration `002_system_member.sql`) as `acting_member_id` for platform-emitted events.

The runtime trust substrate (six concerns, each enforced structurally at the action layer):

1. **Scoped capabilities, not long-lived secrets.** Each call carries a short-lived capability naming exactly one scope, bound to one Delegation (or none, for human composer calls), expiring in seconds-to-minutes, non-replayable.
2. **Permission catalog — the scope vocabulary is the catalog.** Closed-world: every scope a caller might exercise is enumerated in code (TypeScript enum + Postgres enum, kept in sync by CI). No scope outside the catalog can be exercised.
3. **Approval gates — confirmation-required scopes.** Some scopes require explicit Member confirmation per call (e.g., `bounded_purchase` per ADR-17). The gate is unbypassable.
4. **Network-layer credential injection.** Credentials never reach the model / agent. The action-layer edge injects them at the network boundary.
5. **Per-turn credential selection.** The active Delegation determines which credentials are minted for this turn. No credential persists across turns.
6. **Sandboxed Skill execution.** Skills run in a sandbox per [`skills.md`](../../product/systems/skills.md). No exception.

View-refresh semantics: the `discoverable_items` materialized view refreshes synchronously on `item.published` via an AFTER INSERT trigger on `item_events` (per [`item.md`](../../product/systems/item.md) lines 128–136). At b1, synchronous. T2 transitions to async when p99 view-refresh latency exceeds 30s for a week.

The full long-form prose lives in [`action-layer.md`](../../product/systems/action-layer.md). This ADR is the canonical index entry.

## Trade-offs

The dominant alternative — direct table writes from server components, with `*_events` log writes happening as a separate concern — was rejected because the failure modes are catastrophic and silent. A row that lands without its event-log entry leaves the audit trail incomplete; a downstream reader (`discoverable_items` refresh, federation peer sync, agent-context accumulation) sees state without provenance. The same-transaction invariant makes this failure mode impossible by construction.

The cost: every write goes through a named handler. There is no "quick patch" that writes directly to a table from a script. Migration files that need to bootstrap data write through plpgsql functions that *also* commit the matching event row in the same transaction (per ADR-18's Path A — the eval-helpers ADR).

The runtime trust substrate added 2026-05-11 makes the action layer the architectural locus of agent trust. Before the substrate, agent trust was a "we'll figure it out at b2" deferral. The substrate makes agent assistance shippable at b2 without re-architecting the floor.

The consolidation 2026-05-10 (the original ADR-10's surviving invariants moving here when the rebuild reframe retired its migration-specific concerns) keeps the same-transaction invariant + audit fields + view-refresh semantics in their natural home — the action layer enforces all three.

## Consequences

- The action-layer conformance check in CI (per [`notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md) Phase 1 exit criterion) asserts that no write to a `members`, `items`, `locations`, `groups`, or `*_events` table occurs outside the action layer. Violation fails the build.
- Phase 0 ticket T_floor_b establishes the action-layer scaffold with one working handler (`member.create`, called by the Phase 0 auth signup hook).
- Every Phase 1 migration ships with its action handlers (per the migration plan's action-handler list). Handlers cannot land in a later phase than their tables.
- The audit-field invariant (`acting_member_id NOT NULL` on every `*_events` row) is enforced at the database level (`NOT NULL` constraint) and at the application level (Zod schema + injection by the handler). Two-layer enforcement.
- Eval helpers per ADR-18 reproduce the same-transaction invariant in plpgsql (Path A) to test it without failure-injection on the Node handler.
- Web composer, in-app assistant, MCP server, and federation peers are all thin clients over the same handlers — code shared, security model shared, audit log shared.
- This ADR forecloses a path where agents or federation peers get a separate write API. Reversible only by abandoning the unified-write-surface invariant, which would dissolve ADR-6, ADR-17, ADR-18's eval helpers, and the same-transaction invariant simultaneously. The foreclosure is the foundation.

## Action Items

1. [x] Decision ratified 2026-05-09; graduated to spec-resident 2026-05-11; consolidated original ADR-10 invariants 2026-05-10.
2. [x] [`action-layer.md`](../../product/systems/action-layer.md) is the canonical home for the full prose.
3. [x] Pointer line in [`../DECISIONS.md`](../DECISIONS.md) pointer index.
4. [x] Phase 0 ticket T_floor_b scaffolds the action layer with `member.create` as proof of pattern.
5. [ ] Every Phase 1 ticket ships its action handlers alongside the table migration.
6. [ ] CI action-layer conformance check lands as part of Phase 1 exit.
7. [ ] T2 trigger: re-evaluate synchronous view refresh when p99 latency on `discoverable_items.refresh` exceeds 30s for one week.
