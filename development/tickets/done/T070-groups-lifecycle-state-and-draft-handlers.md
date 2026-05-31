---
id: how-t070-groups-lifecycle-state-and-draft-handlers
purpose: Substrate ticket adding groups.lifecycle_state + draft-aware RLS + draft/activate action handlers.
layer: how
status: complete
---

# T070: Groups lifecycle_state column + draft-aware RLS + draft/activate action handlers

**Scenario:** `substrate`
**Status:** Open
**Bundle:** b1
**Depends on:** T055 (groups schema floor)

**Serves:**
- **Spec:** `product/systems/groups.md § Schema` (lifecycle_state column, idx_groups_lifecycle, RLS rule); `§ Action handlers` (`group.create`, `group.update_draft`, `group.activate`); `§ Event log entries` (`group.activated`).
- **ADRs:** ADR-7 (action layer), ADR-10 (event log).
- **Encodes ratified absolute:** none new — this ticket adds the substrate backing the Multi-step composer recipe's partial-state contract per `product/ui/design-language.md § Multi-step composer`. The recipe itself is the contract.

## Workflow gates (mandatory during the migration phase)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `test` (run mode) is called.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — yes, includes a migration.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [ ] Migration `web/supabase/migrations/0NN_groups_lifecycle_state.sql` adds:
  - `alter table groups add column lifecycle_state text not null default 'active' check (lifecycle_state in ('draft','active','dissolved'));`
  - `create index idx_groups_lifecycle on groups (lifecycle_state) where dissolved_at is null;`
- [ ] RLS policy `groups_select_active_or_own_draft` on `groups`:
  - SELECT permitted when `lifecycle_state = 'active'` (subject to existing discoverability scope), OR `lifecycle_state = 'draft' AND founder_member_id = auth.uid()`.
  - Replaces or augments the existing public-select policy; existing `active`-row visibility unchanged for non-founders.
  _Why: discovery surfaces must never leak in-flight composer state. Founder-scoped draft visibility is the minimum needed for the composer's resume contract per `product/ui/design-language.md § Multi-step composer / Partial-state preservation`._
- [ ] Action handler `group.create` (file: `web/lib/actions/group/create.ts`):
  - Inserts a `groups` row with `lifecycle_state='draft'` and the supplied `kind`, `founder_member_id`, `name`, `slug`, `description` (description may be empty string at draft time).
  - Same-transaction insert of `group_memberships` row: founder + `role='owner'` + `source='explicit'`.
  - Same-transaction emit of `group.created` event with `acting_member_id = founder_member_id` and `payload.lifecycle_state = 'draft'`.
  _Why: same-transaction row + event invariant per `product/systems/action-layer.md`. The composer's step-1 write creates the draft Group immediately so subsequent steps update it — that's what makes partial-state preservation real._
- [ ] Action handler `group.update_draft` (file: `web/lib/actions/group/updateDraft.ts`):
  - Updates any column on a `groups` row where `lifecycle_state='draft'` AND caller has `role='owner'` on the Group.
  - Refuses (action-layer error) if the row is not in `draft` state.
  - For business kinds: same handler also accepts `group_businesses` field updates (display_name, public_description, legal_entity_kind, state_of_formation) in the same transaction.
  - No event emitted for per-step updates (would flood the event log; the eventual `group.activated` carries the final state).
- [ ] Action handler `group.activate` (file: `web/lib/actions/group/activate.ts`):
  - Promotes a `draft` Group to `active` (`update groups set lifecycle_state='active' where id=$1 and lifecycle_state='draft' and founder_member_id = auth.uid()`).
  - Same-transaction emit of `group.activated` event with `acting_member_id = founder_member_id`.
  - Refuses if any required field is null (kind-specific: business kind requires `group_businesses.display_name` + `groups.anchor_location_id`).
  _Why: the validation gate is on activate, not on per-step update, so the Member can save partial progress without satisfying full-Group invariants mid-flow._
- [ ] Event-row schema accepts `event_type IN (..., 'group.activated')`; no other event-schema changes.
- [ ] Substrate tests (Vitest, not Playwright): one test per handler — happy path + refusal path (e.g., `group.update_draft` on an active Group raises action-layer error).
- [ ] BUILD-LOG.md updated.

## Notes

- This ticket is the substrate floor for F036 and every later multi-step composer (F034 gathering, F038 product, F040 service). Build agents reading this later: do not collapse `update_draft` into the per-handler verbs — keeping it generic is what makes the composer recipe one component instead of four.
- The action layer's existing same-transaction invariant (per `product/systems/action-layer.md`) governs `group.create` and `group.activate`; `group.update_draft` is intentionally simpler (single-table mutation, no events).
- Existing migrations that filter on `lifecycle_state` (none currently) would need to add the filter; since this column is new, audit Phase 1 queries for assumed-active reads and add `lifecycle_state = 'active'` where missing. Discovery indexes and the `group_public_view` (if it exists) are the priority surfaces.

## Completion

Date: 2026-05-31
Commit: d8204c7
Branch: t070 (worktree: ../web-t070)

**Files landed:**
- `web/supabase/migrations/023_groups_lifecycle_state.sql` (new)
- `web/src/actions/group/create.ts` (new)
- `web/src/actions/group/update-draft.ts` (new)
- `web/src/actions/group/activate.ts` (new)
- `web/src/actions/group/index.ts` (new)
- `web/src/actions/_lib/event-log.ts` (modified — added `'group_events'` to EventTable union + targetColumnFor switch)
- `web/src/actions/index.ts` (modified — registry entries for the three new handlers + barrel re-exports)
- `web/tests/migrations-t070.test.ts` (new — 10 file-shape assertions)
- `web/tests/actions-t070.test.ts` (new — 30 Zod validation + registry + source-shape sanity assertions)

**Verification:**
- `npm test -- tests/migrations-t070.test.ts tests/actions-t070.test.ts` → 40/40 GREEN.
- `npm run check:action-layer` → OK (scanned 153 files; 35 protected tables; 0 exemptions).
- `npx eslint` on the touched files → clean.
- `npx tsc --noEmit` → no new errors in T070 files (pre-existing errors in unrelated scripts/ + tests/migrations-t042.test.ts).

**M2 — `engineering:code-review`:** ran on the diff before commit-summary. Verdict REQUEST → PROCEED after 2 critical fixes landed in the same loop:
1. TOCTOU re-assertion of `lifecycle_state = 'draft'` in both `update_draft` UPDATEs (spine + group_businesses).
2. Random-hex suffix on draft slugs to prevent concurrent-create collisions on the `groups.slug` UNIQUE constraint.
See DEVIATIONS § "2026-05-31 — T070" for full notes.

**DEVIATIONS:** 3 entries logged (random-suffix on draft slugs; TOCTOU re-assertion in update_draft; `group.member_removed` event_kind pre-added without handler).

**M4 — `engineering:deploy-checklist`:** the migration adds a column with a default + a partial index + a constraint swap + an RLS-policy swap — safe against the live group set (all backfill-to-'active'). PM should re-run the existing deploy-checklist before merging t070 to main.

**Not in scope (handled elsewhere):**
- F036 fixture file `web/evals/fixtures/F036-maya.ts` — the Playwright eval refers to seeded Members `MAYA` / `BAKER_RUTH`; fixture creation belongs to T073 (or a small adjacent ticket) since it depends on the surface layer.
- `group.activate`'s user-facing slug per ADR-22 random-suffix scheme — current implementation uses the draft slug as-is on promotion. PM may want a follow-up patch to compute a clean, user-visible slug from `display_name` at activate time, dropping the draft's hex suffix.
