---
purpose: Session log — one plain-English headline + pointer per entry. Never the load-bearing copy of any decision or fact.
layer: how
status: active
---

# JOURNAL.md

One block per session, newest at top. Each entry leads with a **one-sentence plain-English headline** naming what changed — readable cold, no F-numbers / T-numbers / schema identifiers in the headline. Optional 1–3 sentences of context follow. Each entry ends with a **pointer line** citing the durable doc(s) by name and section + the commit hash. The fact lives in the spec; the journal points to it.

Headline test: a reader returning after three weeks should know from the headline alone whether to open the pointer or skip past. If the headline only makes sense to someone with full project context loaded, rewrite it.

Rotation: anything older than 30 days moves to a monthly archive. Pre-2026-05-30 entries archived at [`planning/archive/2026-05-30-journal-pre-cleanup/`](planning/archive/2026-05-30-journal-pre-cleanup/).

---

## 2026-05-31 — Shipped the schema + handlers behind the Sell walkthrough's save-as-you-go composer

First of the four Sell-walkthrough tickets. Two critical issues caught by pre-commit code review landed in the same loop (concurrent-activate race in update-draft; slug collision on simultaneous draft creates); three smaller suggestions folded in via a new shared-constants file; four deferred with rationale in DEVIATIONS. 40/40 vitest GREEN.

→ `development/tickets/done/T070-groups-lifecycle-state-and-draft-handlers.md`; M2 trail at `planning/reviews/F036-review.md` § T070 M2 code-review; DEVIATIONS at `development/DEVIATIONS.md` § 2026-05-31 — T070; STAGE-LEDGER F036 row stamped `building` with T070 done; web commit `d8204c7` on branch `t070` (merge to main pending M4).

## 2026-05-31 — Propagated yesterday's business-Group ownership rules into locality and discovery

Locality query for kind='business' Groups now OR-aggregates across all active owners' jurisdiction rows (no founder-privileged source). Discovery defines "surfacing demotion" for inactive business Groups — they slide down promoted feeds and search defaults but are never hidden, archived, labeled, or notified. Closes the cascading work surfaced by yesterday's `groups.md` weigh.

→ `product/systems/business-jurisdiction.md` § Locality query; `product/systems/discovery.md` § Surfacing demotion for inactive kind='business' Groups; commit pending.

## 2026-05-31 — Wrote the Playwright test spec for the Sell walkthrough before any build code

8 tests covering all 5 acceptance criteria + 3 edge cases (anchor-Location inline-add, walkthrough abandonment with resume, existing-business-Group routing). Each non-mechanical assertion carries a `// Why:` comment anchored to the scenario clause it protects. Fixture file `web/evals/fixtures/F036-maya.ts` does not yet exist — build agent lands it before run-mode.

→ `web/evals/features/F036-member-creates-business-group-via-sell-walkthrough.spec.ts`; commit pending.

## 2026-05-31 — Broke the Sell walkthrough into four tickets: schema first, then three UI pieces

T070 lands the `groups.lifecycle_state` migration, RLS policy, action handlers, and `group.activated` event. T071 extracts a generic multi-step composer base consumed by F036 + the three other b1 composers (F034 / F038 / F040). T072 adds the secondary-drawer sub-flow pattern for inline "+ Add new" affordances. T073 composes the above into the Sell walkthrough surface itself. Sequence: T070 → T071 → T072 → T073.

→ `development/tickets/T070`–`T073`; STAGE-LEDGER stamped `ticketed 2026-05-31`.

## 2026-05-31 — Added a draft/active lifecycle field to Groups so partial composer state can persist before publishing

New `groups.lifecycle_state` column (`'draft' | 'active' | 'dissolved'`, default `'active'`). Public discovery surfaces filter to active only; RLS policy `groups_select_active_or_own_draft` carves out owner visibility for in-flight drafts. New `group.activated` event fires on draft → active promotion (final-step composer submit). Unblocks F036 ticket-writing.

→ `product/systems/groups.md` § Schema; commit pending.

## 2026-05-31 — Added a multi-step composer recipe to the design language — the Sell walkthrough is the first of four to use it

Canonical shape for guided multi-step flows (Sell walkthrough F036, gathering composer F034, product composer F038, service composer F040): step indicator, progressive validation, partial-state preservation via substrate writes on each Continue, draft → active promotion on final submit. Companion **secondary-drawer sub-flow** pattern: the picker step's "+ Add new" opens a stacked single-form drawer over the parent composer; never nest deeper. Cleared the EXTEND verdict on F036's pre-flight review.

→ `product/ui/design-language.md` § Component recipes → Multi-step composer; § Surface patterns → Add new entity inside a composer.

**Downstream patches surfaced for `explore` to drain:** `groups.md` lifecycle_state (landed in same session above); `business-jurisdiction.md` locality OR-aggregation (landed above); `discovery.md` surfacing demotion (landed above); "Shop" vs "business Group" copy convention (PM call still pending).

## 2026-05-31 — Approved the Sell walkthrough scenario — and decided how Groups handle business ownership

F036 cleared Gate A after the `groups.md` weigh session ratified the four cited absolutes. Scenario moved from `scenarios-backlog/` to `scenarios/`; one drift fix to the capabilities footer to match the new co-equal owner model. Ticket-writing remained blocked on the design-language EXTEND verdict (cleared in the entry above this one).

**Weigh outcome — `groups.md`.** Four absolutes walked: 2 revised + ratified, 2 ratified as drafted.

- **Revised + Ratified:** `product/systems/groups.md:88-93` — owners are now co-equal on member-management and dissolution; staff get producer-tool access (post on behalf, edit own Items) but can't manage roster or dissolve; `founder_member_id` is a historical label only. Locally-Owned badge sources from "any current owner is local → badge applies" (OR across owners). PM direction: the platform is not a CRM for business ownership; adding a Member is the only access-granting verb.
- **Ratified:** `product/systems/groups.md:114` — self-declaration over observation as the casual↔commercial trigger. Observation-path remains an open question without a Deferral trigger.
- **Revised + Ratified:** `product/systems/groups.md:124-131` — retired auto-dormancy and founder-only revival for kind='business'. Business Groups have no auto-dormancy or auto-dissolution; discovery (per `discovery.md`) handles surfacing of inactive Groups; only explicit `group.dissolve` by an owner ends a Group. Revival concept retained for community kinds only.
- **Ratified:** `product/systems/groups.md:365` — no auto-Group assignment; explicit-vs-soft_via_* source distinction holds.

Cascading work landed in the same day's entries above (business-jurisdiction locality query, discovery surfacing demotion). Action-handler catalog edits: dropped `group.transfer_operating_ownership`, `group.set_locality_source`, plus their two events; added `group.member_remove`; made several handlers owner-only.

→ `planning/scenarios/F036-…md`; `product/systems/groups.md` § Ownership, § Lifecycle; STAGE-LEDGER `plan-approved 2026-05-31`.

## 2026-05-31 — Reviewed the Sell walkthrough scenario ahead of approval — verdict EXTEND on design-language gaps

Architecture clean — full Phase 1 substrate supports F036 with no new tables / columns / events. Design verdict EXTEND because `design-language.md` lacked a multi-step composer recipe and an inline "add new entity" pattern. F036 is the first of four b1 composers (F034 / F038 / F040 follow); the shared `<MultiStepComposer>` base should be extracted in F036's tickets. Sibling check flagged a "Shop" vs "business Group" copy mismatch between root `CLAUDE.md` naming table and the scenario body.

→ `planning/reviews/F036-review.md`; STAGE-LEDGER stamped `EXTEND 2026-05-31`.

## 2026-05-30 — Injected stable IDs into every narrative doc and rebuilt the registry

148 docs across `product/`, `planning/`, `development/`, `standards/`, `playbooks/`, `skills/` picked up `id:` frontmatter via `scripts/inject-doc-ids.py` (idempotent; `why-` / `what-` / `how-` prefixes by layer). REGISTRY rebuilt via `scripts/rebuild-registry.py` — 150 docs (5 why, 30 what, 115 how). 9 closed kanban items archived from `planning/done/` to `_attic/2026-05-30-kanban-done-batch/`. Reorg-12 Phases B + C (ref conversion + tidy check) remain deferred per spec. Pulled the b1 surface sequence to `now/`.

→ `REGISTRY.md`; `planning/now/`; commit c43101c.

## 2026-05-30 — Ratified two decisions by PM override: how to route work items, and Members default to private

PM exercised the AGENTS.md §3 override to ratify both decisions without running the `weigh` dialectic. Lane-routing rule lands in `playbooks/DEVELOPMENT-PATTERNS.md`; default-private Member discoverability lands in `playbooks/PLATFORM-PATTERNS.md`. Implementation follow-ups for the Member decision park in `member.md` spec work.

→ `playbooks/DEVELOPMENT-PATTERNS.md` § Route work items by ratification need; `playbooks/PLATFORM-PATTERNS.md` § Default Member discoverability to private.

## 2026-05-30 — Stood up `playbooks/` and migrated 19 ratified ADRs into pattern entries

New playbook docs: `DECISION-PATTERNS.md`, `PLATFORM-PATTERNS.md`, `DEVELOPMENT-PATTERNS.md`, `writing-docs.md`, `repo-tidying.md`. ADR-0001 → ADR-0025 absorbed: 12 into PLATFORM, 6 into DEVELOPMENT; ADR-0016 left alone for PM review-pass; ADR-0024 ratified inline. Absorbed `meta/cowork-pipeline/DEV-PATTERN.md` into DEVELOPMENT-PATTERNS § Pipeline patterns + § Pipeline anti-patterns. Multiple archives created (intent reviews, done sprints, pending ratifications, historical phase-2 strategy). Rewrote `CLAUDE.md` + `AGENTS.md` doc-maps. Demoted JOURNAL itself to pointer-log form (which today's session — 2026-05-31 — further refined to hybrid headline + pointer form).

→ `playbooks/`; root `CLAUDE.md`; root `AGENTS.md`; commit pending.
