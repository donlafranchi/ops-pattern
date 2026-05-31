---
purpose: Thin session pointer log. Never the load-bearing copy of any decision or fact.
layer: how
status: active
---

# JOURNAL.md

One block per session, newest at top. Two to three sentences naming the durable docs that changed, plus the commit hash. No decisions, no "next session pickup" blocks, no current-state inventories — if a session produced a fact that needs to be true next quarter, the fact lives in its capability, pattern, or system spec; the JOURNAL line just notes that the file changed.

Rotation: anything older than 30 days moves to a monthly archive. Pre-2026-05-30 entries archived at [`planning/archive/2026-05-30-journal-pre-cleanup/`](planning/archive/2026-05-30-journal-pre-cleanup/).

---

## 2026-05-31 — Cascaded `groups.md` ratifications into `business-jurisdiction.md` + `discovery.md`

Two spec edits propagating the 2026-05-31 `groups.md` weigh outcomes (owners-co-equal + lifecycle-does-not-track-business-activity) into the systems that consume those rules.

- **`product/systems/business-jurisdiction.md`** — Locality query made explicit as OR-aggregation across all active `role='owner'` jurisdiction rows (no founder-privileged source). Prose + SQL pseudocode + an `Intent (Ratified 2026-05-31)` block citing `playbooks/PLATFORM-PATTERNS.md` § "Membership is the only access-granting verb for kind='business' Groups."
- **`product/systems/discovery.md`** — Added § "Surfacing demotion for inactive kind='business' Groups" under T1. Activity signal = platform action only (Items posted, orders fulfilled, member-facing events) over a rolling window (working: 90 days, 0.25 demotion factor; exact tuning is an open Phase 2 question). Demotion affects promoted surfaces + search defaults only; never hides, archives, labels, or notifies. `Intent (Ratified 2026-05-31)` block citing `playbooks/PLATFORM-PATTERNS.md` § "Lifecycle does not track business activity — discovery does."

No schema or code touched. Closes the cascading-work bullets surfaced by the earlier `Weighed groups.md` entry.

## 2026-05-31 — F036 eval spec written (Playwright, before build)

Authored `web/evals/features/F036-member-creates-business-group-via-sell-walkthrough.spec.ts` from the F036 scenario alone (no code reads). 8 tests covering all 5 acceptance criteria + 3 edge cases (anchor-Location inline-add, walkthrough abandonment with resume, existing-business-Group routing). Each non-mechanical assertion carries a `// Why:` comment anchored to the scenario clause or to the design-language recipe / ADR-12 supersession it protects. Fixture surface assumed: seeded `MAYA` (no business Group, one saved Location) + `BAKER_RUTH` (existing business Group); fixture file `web/evals/fixtures/F036-maya.ts` does not yet exist — build agent (or a small substrate ticket) lands it before run-mode eval.

## 2026-05-31 — F036 ticketed: T070 (substrate) + T071–T073 (surface)

Broke F036 into four implementable tickets (within the 2–5 fan-out range).
- **T070 — substrate** — `groups.lifecycle_state` migration, RLS policy `groups_select_active_or_own_draft`, action handlers `group.create` / `group.update_draft` / `group.activate`, event `group.activated`. `Scenario: substrate`; cites `groups.md § Schema`.
- **T071 — `<MultiStepComposer>` base** — generic composer per the new DLS recipe; consumed by F036/F034/F038/F040. Presentational + control-flow; persistence by consumer callbacks.
- **T072 — `<AddEntityDrawer>` sub-flow** — secondary-drawer pattern; first user is F036's anchor-Location step; refuses to nest deeper (dev-time error).
- **T073 — `<SellWalkthrough>` + /you Sell CTA** — composes the above; five steps (brand · anchor · about · optional locality · review); resume-detection wired to the draft Group; routing logic for first-time vs returning-with-active-business-Group. Defaults user-facing copy to "Shop" per naming-conventions table.

Sequence: T070 → T071 → T072 → T073. STAGE-LEDGER stamped `ticketed 2026-05-31`. Next per pipeline: `test` writes Playwright evals from the F036 scenario (in parallel with `build`); then `build` works through T070→T073 in TDD order.

## 2026-05-31 — `groups.md` schema patch: `lifecycle_state` column + draft/active discovery rule

Added `groups.lifecycle_state` column (`'draft' | 'active' | 'dissolved'`, default `'active'`) backing the Multi-step composer recipe's partial-state preservation contract. Public discovery surfaces filter `lifecycle_state = 'active'`; RLS policy `groups_select_active_or_own_draft` carves out owner visibility for in-flight drafts. New event `group.activated` fires on draft → active promotion (final-step composer submit). New handlers `group.activate` + `group.update_draft` added to the action catalog; `group.create` now writes `lifecycle_state='draft'` by default. Index `idx_groups_lifecycle` added. Unblocks F036 ticket-writing.

## 2026-05-31 — Extended `design-language.md`: Multi-step composer recipe + Add-new-entity-inside-composer sub-flow pattern

Landed two additions to `product/ui/design-language.md`:
- **§ Component recipes → Multi-step composer** — canonical shape for guided multi-step flows (Sell walkthrough F036, gathering composer F034, product composer F038, service composer F040). Covers step indicator, navigation (back/continue/skip-optional), progressive validation (field-on-blur, step-on-Continue), partial-state preservation via substrate writes on each Continue (with `lifecycle_state='draft'` → `'active'` promotion on final submit), completion redirect, loading/error/offline states, no-fork rule.
- **§ Surface patterns → Add new entity inside a composer** — secondary-drawer sub-flow for the picker step's "+ Add new" affordance (first user: anchor-Location step in F036). Single-form drawer stacks over parent composer; on save returns to parent step with new entity pre-selected; never nest a tertiary drawer.

Cleared the EXTEND verdict on F036's pre-flight review. Ticket-writing on F036 is unblocked (modulo the still-pending Shop vs Group copy call).

**Downstream spec patches surfaced — flag for `explore` follow-on:**
- **`groups.md`** needs a `groups.lifecycle_state` column (`'draft' | 'active' | 'dissolved'`) to support the composer partial-state contract. Public discovery surfaces must filter `lifecycle_state = 'active'`. Substrate addition; not in current schema.
- **`product/systems/business-jurisdiction.md`** — locality query needs to read ANY active owner's `member_business_jurisdictions` row (OR aggregation) per the 2026-05-31 groups.md amendment. Blocks F037 + F042; not F036.
- **`product/systems/discovery.md`** — must define surfacing demotion for inactive kind='business' Groups (since they no longer enter dormancy). Blocks no scenario directly but shapes the discovery algorithm at b1.
- **Shop vs business Group copy convention** — root CLAUDE.md naming-conventions table says "Shop" for kind='business' UI label; F036 scenario body uses "business Group" throughout. PM call pending. Route: `weigh` or direct PM decision.

## 2026-05-31 — F036 approved (Gate A cleared); moved to `planning/scenarios/`

F036 cleared Gate A after the weigh session ratified all 4 cited `groups.md` absolutes. One drift fix in F036's body (Capabilities-unlocked footer rewritten to match the new owners-co-equal model, dropping the "Founder = operating owner immutable at creation" framing). Scenario moved from `scenarios-backlog/` to `scenarios/`; STAGE-LEDGER stamped `plan-approved 2026-05-31`. Ticket-writing remains blocked on the design-language EXTEND verdict (Multi-step composer recipe) from the 2026-05-31 pre-flight review.

### Weighed groups.md — 2026-05-31

4 statements walked: 2 ratified-with-revision, 2 ratified-as-drafted.

- **Revised + Ratified:** `product/systems/groups.md:88-93` — retired the "founder is immutable operating owner" rule and the assignable-operating-owner middle ground. New shape: owners co-equal on member-management and dissolution; staff have producer-tool access (post on behalf, edit own Items) but cannot manage roster or dissolve; `founder_member_id` is a historical label only. Locally-Owned badge sources from "any current owner is local → badge applies" (OR across owners). PM direction: the platform is not a CRM for business ownership; adding a Member is the only access-granting verb.
- **Ratified:** `product/systems/groups.md:114` — self-declaration over observation as the casual↔commercial trigger. Stamped `Intent (Ratified 2026-05-31)`; observation-path remains an open question without a Deferral trigger (the "critical mass" condition isn't observable enough to be a real Deferred trigger).
- **Revised + Ratified:** `product/systems/groups.md:124-131` — retired auto-dormancy and founder-only revival for kind='business'. New shape: business Groups have no auto-dormancy, no auto-dissolution; discovery algorithm (per `discovery.md`) handles surfacing of inactive Groups; only explicit `group.dissolve` by an owner ends a Group. Off-platform legal-entity persistence simplified; revival concept retained for community kinds only.
- **Ratified:** `product/systems/groups.md:365` — no auto-Group assignment; explicit-vs-soft_via_* source distinction. Stamped `Intent (Ratified 2026-05-31)`; no wording change.

**Cascading downstream work surfaced:**
- `product/systems/business-jurisdiction.md` — locality query needs to read ANY active owner's `member_business_jurisdictions` row (OR aggregation), not just the founder's.
- `product/systems/discovery.md` — must define "surfacing demotion for inactive business Groups" since the lifecycle no longer handles it.
- Action handlers: dropped `group.transfer_operating_ownership`, `group.set_locality_source`, `group.operating_owner_transferred` event, `group.locality_source_changed` event from groups.md catalog. Added `group.member_remove` and made several handlers owner-only.
- F036 cleared Gate A — all four cited absolutes now carry State tags. Scope can re-run the gate and move F036 from backlog to approved.

## 2026-05-31 — Pre-Gate-A review on F036 (Sell walkthrough) — verdict EXTEND

Reviewed F036 ahead of the Gate A walk. Architecture clean — full Phase 1 substrate already supports it (no new tables / columns / events). Design verdict EXTEND: `product/ui/design-language.md` lacks a multi-step composer recipe and an inline "add new entity inside a composer" pattern; F036 is first of four b1 composers (F034 / F038 / F040 to follow) and the shared `<MultiStepComposer>` base should be extracted in F036's tickets. Sibling check also flagged a "Shop" vs "business Group" copy mismatch (root CLAUDE.md naming table says "Shop" for kind='business' UI label; scenario body uses "business Group" throughout). Review at `planning/reviews/F036-review.md`; STAGE-LEDGER stamped EXTEND 2026-05-31. F036 remains blocked from approval pending (a) Gate A weigh on 4 unratified `groups.md` absolutes, and (b) the design-language extend.

## 2026-05-30 — Reorg-12 Phase A: stable doc IDs injected; REGISTRY rebuilt; b1 surface sequence pulled to `now/`

Injected `id:` front-matter into 148 narrative docs across `product/`, `planning/`, `development/`, `standards/`, `playbooks/`, `skills/` via `scripts/inject-doc-ids.py` (idempotent; `why-` / `what-` / `how-` prefixes by layer; generic README.md / SKILL.md disambiguated by parent dir). Rebuilt `REGISTRY.md` via `scripts/rebuild-registry.py` — 150 docs (5 why, 30 what, 115 how). Archived 9 closed kanban items from `planning/done/` to `_attic/2026-05-30-kanban-done-batch/` with RETIRED.md index. Moved `reorg-12-yaml-doc-ids` to `done/`; pulled `plan-b1-surface-sequence` into `now/`. Phase B (convert refs in top-15 cited docs) and Phase C (full ref conversion + `tidy` check) remain deferred per the reorg-12 spec. Next: route F036 to `scope` to open the b1 surface build. Commit: c43101c.

## 2026-05-30 — Ratified lane-routing rule + default-private Member discoverability (PM override; weigh skipped)

PM exercised override under AGENTS.md §3 to ratify two decisions without `weigh` dialectic. New entries in `playbooks/DEVELOPMENT-PATTERNS.md` ("Route work items by ratification need") and `playbooks/PLATFORM-PATTERNS.md` ("Default Member discoverability to private"). Stubs moved from `planning/next/` to `planning/done/`. Implementation follow-ups for the Member discoverability decision park in `product/systems/member.md` spec work.

## 2026-05-30 — Scaffolded `playbooks/`; migrated 19 ADRs; demoted JOURNAL to pointer-log

Stood up `playbooks/` with `DECISION-PATTERNS.md`, `PLATFORM-PATTERNS.md`, `DEVELOPMENT-PATTERNS.md`, `writing-docs.md`, `repo-tidying.md`. Migrated ADR-0001 → ADR-0025 (ratified) as pattern-doc entries: 12 platform, 6 development; ADR-0016 left alone for PM review-pass; ADR-0024 ratified inline. Absorbed `meta/cowork-pipeline/DEV-PATTERN.md` into DEVELOPMENT-PATTERNS § Pipeline patterns + § Pipeline anti-patterns; original at `meta/cowork-pipeline/archive/2026-05-30-dev-pattern/`. Archived 6 review files (`planning/archive/2026-05-30-intent-reviews/`), 2 done sprints (`planning/bundles/archive/`), `pending-ratifications.md` (`planning/archive/2026-05-30-pending-ratifications/`), `phase-2-scenario-strategy.md` (`planning/archive/2026-05-30-phase-2-historical/`). Trimmed RELEASES, SPEC-PATCHES, OPEN-QUESTIONS, STAGE-LEDGER, b1-primitives-plan. Rewrote CLAUDE.md + AGENTS.md doc-map. Commit: {pending}.
