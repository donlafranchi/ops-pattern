---
purpose: ADR-19 — clean-slate rebuild on primitives (no dual-write migration).
layer: how
status: active
---

# ADR-0019: Clean-slate rebuild on the four primitives — replace the data layer, preserve the app shell

**Status:** Accepted
**Date:** 2026-05-10
**Deciders:** PM
**Scope:** The decision to rebuild the data layer, action layer, and user-facing surfaces from scratch on Person / Item / Location / Group primitives, while preserving the Next.js / Tailwind / Supabase / Mapbox framework foundation
**Touches:** `planning/rebuild-plan.md` (the long-form plan — phases, sequencing, what stays, what goes), `planning/bundles/b1-primitives-plan.md` (the scope this rebuild ships), every `product/systems/*.md` spec (each one is a target of the rebuild), `web/supabase/migrations/` (replaced from scratch), `web/src/` (re-derived from new schema), `development/tickets/` (T027+ are rebuild tickets; T001–T026 archived as reference)
**Supersedes:** the original ADR-10 dual-write / per-phase rollback / two-week verification-window plan. Surviving invariants from the original ADR-10 (same-transaction event commit, audit fields, view-refresh semantics) were consolidated into ADR-7.

## Decision

Replace the current `web/` data layer with a clean-slate build on the four primitives — Person (Member), Item, Location, Group. The framework foundation (Next.js App Router, Tailwind v4 + DLS tokens, Supabase client wiring, Mapbox GL JS, Playwright + Vitest infrastructure, layout shells) is preserved unchanged. Everything below the framework layer — schema, action handlers, routes, components that read data, server logic — is rewritten against the new primitives.

**Sequencing** lives in [`planning/rebuild-plan.md`](../../planning/rebuild-plan.md) as a four-phase plan:

- **Phase 0 — Floor.** Schema floor (extensions, system Member, action-layer trigger, conformance enforcement). T041–T044, T051, T052.
- **Phase 1 — Primitives.** The four core tables and their child tables. `members`, `items` + 4 child tables, `locations` + 3 child tables, `groups` + 2 child tables. Event-log tables. RLS policies.
- **Phase 2 — Surfaces.** Composer flows for each Item kind, Group creation and membership, Location creation and follow, Member profile + Assistant Context substrate.
- **Phase 3 — Federation-readiness.** Schema and audit-field shapes that survive a federation-peer handoff (per Loop 13).
- **Phase 4 — Cleanup.** Delete legacy routes, components, and migration files. Update `web/CLAUDE.md`. Close the rebuild.

**No dual-write. No backfill. No rollback. No verification window.** The original ADR-10 plan included all of those because it was protecting a live system with users and data. Today's `web/` is in development; nobody is using it; there is no production data to preserve and no URL anyone has bookmarked. The complexity that existed to protect a live system goes away.

## Trade-offs

**Why clean-slate over incremental migration.** The original ADR-10 plan migrated the existing schema into the primitives shape via dual-write, backfill, divergence-checker, and a two-week zero-read verification window. That plan was correct *if* there was a live system to protect. With no live system, every layer of migration safety is dead weight — the dual-write phase doubles the work without protecting anything, the divergence checker compares one in-development schema against another, the verification window delays shipping by two weeks for a property that's trivially true on day one (no reads to be wrong about). The pragmatic answer is to delete the old schema and write the new one.

**Why preserve the framework.** The Next.js / Tailwind / Supabase / Mapbox foundation took real work, has zero alignment problems with the primitives, and would cost weeks to redo. Magic-link auth, Google OAuth, Apple OAuth flows are correct. The DLS tokens are correct. The bottom-anchored layout (per ADR-2) is correct. None of that needs rewriting. The rewrite is below the framework — the schema, the action handlers, the data-reading components — not the framework itself.

**Why phases over a single waterfall.** The work is too large for one ticket and the dependencies between layers (schema → action handlers → routes → components) make a single-shot impractical. Phases let each layer ship verifiably (Phase 0 has its own conformance gate; Phase 1 has its own eval surface) before the next layer depends on it. Phases also give the PM concrete merge points: each phase is a Pull-Request-shaped block of work.

**Why now, not later.** The longer the current `web/` accumulates code against the old schema (vendor / business / market / event tables), the more code becomes throwaway when the rebuild lands. The decision to rebuild was made when the cost of continuing on the old schema started to exceed the cost of the rebuild itself.

## Consequences

- The four-phase plan in `planning/rebuild-plan.md` is the load-bearing sequencing document. This ADR is its architectural ratification.
- Every Phase 1+ ticket implements writes via named action handlers (per ADR-7). The action layer is the only sanctioned write surface; no Phase 1+ ticket writes via service-role SQL.
- The conformance gate (`web/scripts/check-action-layer-conformance.ts`, T043/T051) is the structural enforcement that the rebuild stays inside ADR-7's invariants. Every CI run flags violations.
- Phase 0 ratifies the schema floor: extensions (pgvector, postgis), system Member, action-layer trigger on auth signup (per ADR-15), conformance script. T041–T044, T051, T052.
- Phase 4 deletes legacy routes (`/vendors/*`, `/business/*`, `/register-vendor`, `/you/vendor/*`, `/markets/*`, `/events/*`) and legacy components. After Phase 4, the term "vendor" survives only in archived specs and in the "Producer" vocabulary in agricultural/food context.
- Rebuild-phase rules in the root `CLAUDE.md` (lines 116–128: pipeline-review mandatory, ADR-or-spec-banner required before plan ratifies new schema, code-review mandatory before commit, deploy-checklist mandatory before merge to main, etc.) are active until Phase 4 completes. After Phase 4, the rebuild-specific gates can be relaxed; the load-bearing gates (code-review, intent-check) stay.
- The shipped tickets T001–T026 become reference, not heritage. Already moved to `development/tickets/done/`. No further preservation.
- The original ADR-10 plan is **superseded by this ADR**. Surviving invariants from ADR-10 (same-transaction event commit, audit fields on every event row, view-refresh semantics) were consolidated into ADR-7 and live in `action-layer.md`. The `DECISIONS.md` pointer for ADR-10 reflects the consolidation.
- This ADR forecloses an incremental-migration path. Reversible only by adopting a different live-data preservation plan if the platform's situation changes (e.g., a real-user beta launches mid-rebuild). The foreclosure is the point: every layer of migration safety the original plan carried is dead weight in the absence of users, and re-litigating that on every Phase 1+ ticket is the cost the consolidation removes.

## Action Items

1. [x] Decision ratified 2026-05-10.
2. [x] `planning/rebuild-plan.md` rewritten to drop dual-write / rollback / verification sections.
3. [x] Original ADR-10 superseded; surviving invariants moved to ADR-7.
4. [x] Pointer line in `../DECISIONS.md` pointer index.
5. [x] Phase 0 tickets (T041–T044, T051, T052) tracked.
6. [ ] Phase 1 sequencing.
7. [ ] Phase 4 cleanup checklist (legacy route/component deletion).
8. [ ] After Phase 4, root `CLAUDE.md` rebuild-phase rules section reviewed for relaxation candidates.
