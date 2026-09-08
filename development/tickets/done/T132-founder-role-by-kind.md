# T132: Founder membership role branches by Group kind

**Scenario:** `planning/now/scenario-F060-someone-starts-something-without-opening-a-shop.md`
**Status:** Complete
**Bundle:** launch (`planning/now/initiative-launch.md`), track A
**Depends on:** none

**Serves:**
- **Loop:** 1 (Gather), 7 (Make and be found) — a run-club founder must be able to hold a role the rest of the platform already recognizes as standing.
- **Canonical example:** P1, and the run-club case it does not cover.
- **Primitive shape:** Person → Group (any kind). No new entity, no new table, no new kind value, no new role value — `owner` and `steward` both already exist in `group_memberships.role`.

**Spec contract:** `product/systems/groups.md` § Roles per kind (lines 92–95, 101) — non-business kinds (`place`, `interest`, `practice`, `event_anchored`, `family`) take `member`/`steward`; `business` takes `owner`/`member`.

**Deviation this closes:** `planning/stage-ledger/F060.md`, entry "role vocabulary divergence resolved." `src/actions/group/create.ts` hardcodes `role='owner'` for every kind, citing a stale comment (`groups.md:365`, which predates the current role table). Every downstream reader of `group_memberships.role` — the `member_has_standing_presence` view and `acquisition-prompt.ts` — already branches on `steward` for non-business kinds and is correct today; they read nothing that this ticket needs to change. This ticket is the one place the assignment itself happens.

## Workflow gates

- [x] **M2 — `engineering:code-review`** on the diff before commit. Two-pass: correctness + cleanup/conventions in parallel, one high-severity finding (update-draft.ts lockout) fixed before commit, a follow-up sweep confirmed no other owner-only gate needed a kind branch.
- [x] **M4** — no migration (no schema change; `group_memberships.role` already has no enum constraint, per `014_groups.sql:172`).
- [x] **DEVIATIONS.md entry** at close. `development/deviations/T132.md`.
- [x] **Close-out reconciliation** at close.

## Acceptance Criteria

- [x] `src/actions/group/create.ts`'s founder-membership insert assigns `role = 'owner'` when `input.kind === 'business'` and `role = 'steward'` for every other kind, via `managingRoleForKind()`.
- [x] The `group.member_joined` event payload's `role` field matches the same branch.
- [x] The stale comment citing `groups.md:365` is corrected to cite the current § Roles per kind section.
- [x] Unit test: `managingRoleForKind('business')` returns `'owner'`.
- [x] Unit test: `managingRoleForKind` returns `'steward'` for every other kind.
- [x] Existing fixtures re-checked — see Deviation 1: both named fixtures already correctly modeled the split; no change needed.
- [x] `member_has_standing_presence` and `acquisition-prompt.ts` are unmodified — their existing branch is now correctly reachable (see Deviation 3).
- [x] BUILD-LOG.md updated.
- [x] *(Added during build — see Deviation 2)* `group.update_draft`'s owner-only gate now branches by kind via the same `managingRoleForKind()`, with its own regression test.

## Notes

**Why this lands before T133.** T133 (item-create) needs to check the founder's role per kind, and the correct value only exists once this ticket ships. Land this first, or in the same PR if the build agent judges the split not worth the overhead — but the founder-role assignment and the item-create authorization check are two different action handlers serving two different scenarios, so they stay two tickets even if committed close together.

**Not in scope:** re-deriving or re-validating `member_has_standing_presence`'s own logic — it is already correct and independently shipped (T055). Touching it here would be scope creep on a ticket whose entire job is a one-line branch.

## Completion

Date: 2026-09-07
Commit: 5ed601c (web) · merged to main via 8185764 (BUILD-LOG follow-up commit; the code merge itself carries no separate hash beyond the merge commit on main)
Tests: 36 vitest GREEN across `constants.test.ts` (6 new) and `actions-t070.test.ts` (updated). tsc clean on touched files.
Deviations: `development/deviations/T132.md` — (1) ticket's predicted fixture fixes were unnecessary, both already correct; (2) `group.update_draft`'s own owner-only gate needed the same kind branch, caught by M2, fixed in this pass; (3) the acquisition-prompt's steward branch (already spec-correct) now fires for the first time — a second bug from the same root cause, not new scope; (4) the standing badge ("Active in the community" on `/m/[handle]`) starts rendering for non-business Page founders as a direct, correct consequence — role-only, no activity requirement, flagged as its own promise-collision decision: `planning/backlog/decision-standing-badge-requires-activity.md`.
Gates: M2 two-pass Approve (after fix) · M4 N/A (no migration).
