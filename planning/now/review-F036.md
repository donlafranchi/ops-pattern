---
id: how-f036-review
purpose: Architecture + design + sibling-consistency pre-flight on F036 (Member creates business Group via Sell walkthrough).
layer: how
status: active
---

# F036 review — Maya creates a business Group through the Sell walkthrough

**Scenario:** [`planning/now/scenario-F036-member-creates-business-group-via-sell-walkthrough.md`](scenario-F036-member-creates-business-group-via-sell-walkthrough.md) *(Gate A was blocked at review time on 4 unratified absolutes in `groups.md`; PM requested pre-flight regardless)*
**Reviewer:** review
**Date:** 2026-05-31
**Bundle:** b1 (sub-bundle b1.2 per `b1-primitives-work-map.md` § "Become a Seller")
**Verdict:** **EXTEND** (design) + **PROCEED-with-extract-note** (architecture)

## Verdict summary

The data model is fully landed (Phase 1 substrate ships `groups`, `group_businesses`, `group_memberships`, event log entries, `member_has_standing_presence`); F036 fits cleanly with no new tables, no new columns, no new events. The **design language is missing a multi-step composer / wizard pattern** — F036's five-step Sell walkthrough is the first such surface in b1 and three sibling scenarios (F034 gathering composer, F038 product composer, F040 service composer) will need to share the same shape. Extend `product/ui/design-language.md` with a "Multi-step composer" recipe before ticket writing; the F036 ticket batch should also extract a shared `<KindComposer>` base.

**Next skill:** `explore` to extend `design-language.md` § Component recipes; then back here to confirm; then `weigh` to walk Gate A; then `scope` to approve.

## Architecture check

### Systems touched

- [`product/systems/groups.md`](../../product/systems/groups.md) — Group spine + `group_businesses` child + `group_memberships` writes; lifecycle + event log + Policy posture all land here.
- [`product/systems/member.md`](../../product/systems/member.md) — `member_has_standing_presence` flips true after walkthrough completes; selling-tool affordances become conditional renders driven by Group state.
- [`product/systems/location.md`](../../product/systems/location.md) — Anchor Location FK + add-Location sub-flow.
- [`product/systems/action-layer.md`](../../product/systems/action-layer.md) — `group.create` + `group.member_join` action handlers (one transaction).
- [`product/systems/business-jurisdiction.md`](../../product/systems/business-jurisdiction.md) — Tier 0 locality step (skippable; full claim lifecycle in F037).

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | **none** | `groups`, `group_businesses`, `group_memberships`, `locations`, `members` all live (T055, T047, T045). |
| New columns required? | **none** | All fields the scenario writes (display_name, public_description, legal_entity_kind, state_of_formation, anchor_location_id, founder_member_id, discoverability, role, source) exist in `groups.md` § Schema (lines 188–225-ish) and the Phase 1 migrations. |
| New event types required? | **none** | `group.created` + `group.member_joined` already listed in `groups.md:276` event-log catalog. |
| Forward-tier impact | **clear** | b2 brings multi-owner partnership Groups + `staff` confirmation flows; F036 reserves the founder-as-immutable-operator shape that those layers extend without retrofit. |
| Shell-entity smell | **clean** | F036 creates a `Group` of People, not a Business entity. Items will FK to Members (`items.member_id NOT NULL` per groups.md:344); `groups.founder_member_id` is a Member FK; no business-as-owner column anywhere. |
| Loop fidelity | **matched** | Scenario tags Loop 7 (Buy close) + Loop 9 (Make a living locally). The Sell walkthrough is the structural enabling step for Loop 9's stated pain point — "I want to make a living from what I do, locally" — by giving the seller a public, place-scoped page (Group). Loop 7 is served indirectly: by populating the buyer's locality feed with named sellers. **Recommend** narrowing the tag to Loop 9 primary, Loop 7 secondary to keep the eval anchored. |
| Policy posture present | **present** | `groups.md:360` carries a Policy posture section with the full three-filter analysis. F036's `discoverability='listed'` default is consistent with the section's analysis (`family`-kind defaults to `private`; `business`-kind defaults to `listed` because the whole point is to be found). |

### Cross-system consistency

- **groups.md × member.md** — Coherent. `member_has_standing_presence` reads from `group_memberships`; F036 writes a qualifying row in one transaction; the view flips on next read. No re-compute triggers needed (the view derives at query time).
- **groups.md × location.md** — Coherent. `groups.anchor_location_id` is an FK to `locations(id)` per Phase 1. F036's "add a new Location" sub-flow per-existing `location.create` action handler.
- **groups.md × action-layer.md** — Coherent. `group.create` + `group.member_join` are listed in the action handler catalog (per Phase 2 plan). The "one transaction" constraint in F036's acceptance criterion satisfies the same-transaction row+event invariant from `action-layer.md`.
- **groups.md × business-jurisdiction.md** — Coherent for the skippable Tier 0 step; the full claim lifecycle lives in F037, including substrate gate S-jurisdictions (`member_business_jurisdictions` table + proximity function). F036 does NOT need that substrate; it just records the optional ZIP into a row that F037 then operates on.

### Architecture verdict

**PROCEED** — with one extraction note: F036's tickets are the first to write `groups`/`group_businesses`/`group_memberships` from a user-driven composer (the Phase 1 substrate tickets only created the tables + scaffolding). The action handlers `group.create` + `group.member_join` should be implemented in T### tickets that downstream sibling scenarios (F034, F038, F040) reuse rather than re-implementing the write paths.

## Design check

### Surfaces touched

- **`/you`** — *exists* per `community-platform.md` T1 § You. "Sell" CTA explicitly described there (line 309): "visible to Members with no active kind='business' Group membership and no kind='product'/'service' Items. Tapping it opens the kind='business' Group creation walkthrough per `../systems/groups.md`."
- **Sell walkthrough surface** — *new*. Five-step guided flow (brand · anchor · about · optional locality · done). Has no entry in design-language.md.
- **New Group page `/p/[…place]/g/[slug-suffix]`** — *covered by F035* (Viewer finds Group public page), which depends on F036 per the b1 surface sequence.
- **Add-Location sub-flow** — exists as an action handler; UI affordance "add a new Location" not yet pattern-named in DLS.

### Components required

| Component | Exists in design language? | Notes |
|---|---|---|
| `/you` Sell CTA (Button — primary) | yes (Button — primary recipe at line 249) | Already described conditionally in `community-platform.md` T1 § You. |
| **Multi-step composer / wizard / walkthrough** | **NO** | The DLS § Component recipes (lines 247–296) covers Button, Card, Pill, Search bar, Input, Recurrence picker — no multi-step pattern. **EXTEND required.** This pattern will be reused by F034 (gathering composer), F038 (product composer), F040 (service composer) — define it once. |
| Step indicator / progress dots | NO | Sub-component of the wizard pattern. |
| Inline "back-out preserves partial state" UX pattern | NO | The scenario specifies "each step writes incrementally so a back-out preserves partial state" — this is a UX commitment that needs a DLS principle entry, not just a component. |
| Location picker w/ "add new" affordance | partial | Search bar exists; "add new" sub-flow trigger not pattern-named. Could be inline; tickets can specify. |
| Done / success destination redirect | n/a | Standard navigation. |

### CTA placement

| Surface | CTA | Established pattern | Match? |
|---|---|---|---|
| `/you` | "Sell" | `community-platform.md` line 309 — primary CTA in the You-page action list, conditional on no kind='business' Group + no product/service Items | **yes** |
| Gathering composer (F034) | "Sell instead?" (secondary) | DLS § CTA placement #4 "One primary per screen" allows secondary CTAs below the primary | **yes** (forward-looking — F034 isn't built) |
| Wonder composer | "Sell instead?" (secondary) | same | **yes** (forward-looking — Wonder composer is deferred to b2 per `b1-primitives-plan.md`; the scenario's reference to it is aspirational) |
| New Group page completion | "Add a product" | F035 specifies this; F036's scenario references it as the destination | covered by F035 |

**Flag:** the scenario references "Sell instead?" on the Wonder composer (line 38 of F036), but Wonder composer is deferred to b2 (per b1-primitives-plan.md). The Wonder reference is forward-looking and should not generate b1 tickets — call this out in ticket writing.

### Copy & tone

- "Sell" — direct, action-first, no jargon. Matches the project's plain-American-English voice in root CLAUDE.md § Language & Framing.
- "Brand name" / "Anchor Location" / "About" / "Locality claim (optional)" — neutral, descriptive. No flagged terms (no "vendor," "merchant," "establishment").
- "Add a product" CTA on the new Group page — matches DLS § Button — primary tone.
- No marketing-speak; no oligarchy/anti-capitalist framing risks here.

### Empty / loading / error states

- **Partial-state preservation on abandonment** — described as a UX commitment ("each step writes incrementally"). Implementation pattern not specified. **Recommend** ticket writer makes this an explicit ticket with acceptance criteria.
- **Anchor Location doesn't exist** — sub-flow opens to add new Location; on save, returns to walkthrough. Pattern not yet in DLS; bespoke per scenario.
- **Brand name collision** — handled by slug-suffix-on-create per ADR-22 (now in `playbooks/PLATFORM-PATTERNS.md`). Display name has no uniqueness constraint.
- **Loading state during submit** — not specified. **Recommend** standard button-disabled-during-submit + spinner pattern (Button — primary already implies it).
- **Error state on submit failure** — not specified. **Recommend** ticket writer asks for inline error display + retry, no destructive rollback (partial state preservation should mean the user doesn't lose typed data).

### Design verdict

**EXTEND** — `product/ui/design-language.md` needs:
1. A "Multi-step composer" (or "Walkthrough") component recipe under § Component recipes — step indicator, navigation (back/next), progressive validation, partial-state preservation principle, completion redirect.
2. A "Add new entity inside a composer" sub-flow pattern under § Surface patterns — used by the anchor-Location add-new step in F036, and reusable for any composer needing to create a referenced entity inline.

These extensions should land before F036 tickets so F034 / F038 / F040 can reference the same recipe.

## Sibling-scenario consistency findings

**First-in-family** for the **Sell-walkthrough composer family**, but NOT first in the larger **composer family** for b1. The b1 surface sequence has four composers: F036 (Sell walkthrough → business Group), F034 (gathering composer), F038 (product composer), F040 (service composer). F036 opens first per the dependency chain (Sell walkthrough must exist before product/service/gathering composers can attach Items to a Group).

Scenarios checked: none yet approved in `planning/next/`; all four are in `planning/backlog/`.

**Recommendations:**

1. **Shared base component.** Extract a `<MultiStepComposer>` base in F036's ticket batch. F034 / F038 / F040 instantiate it with kind-specific step lists. Divergence on copy and per-step fields is expected; divergence on navigation, validation, partial-state-preservation, or completion-redirect mechanics is **not** justified — flag if it emerges.
2. **Vocabulary alignment.** F036 uses "Sell" as the verb and "business Group" as the entity. Per root CLAUDE.md naming conventions, the UI term for a kind='business' Group is **"Shop"** (with "Sell" / "Offer" as the action verbs). The scenario's body text uses "business Group" throughout — this is the schema term leaking into user-facing prose. **Recommend** the F036 ticket writer aligns user-facing copy on **"Shop"** (or accepts an explicit deviation with rationale; see Decisions captured below).
3. **Loop-shape alignment.** F034 will serve Loop 4 (Gather regularly); F038/F040 serve Loop 9 (Make a living locally) like F036. The Sell walkthrough is upstream of all three — its mechanic (declared self-categorization, Member taps "Sell") is the entry; the per-kind composers fan out below it. Coherent.
4. **Empty / loading / error state consistency.** Define once in the `<MultiStepComposer>` base. Document the patterns in the design-language EXTEND.

## Recommendations for the ticket writer (once approved)

- **Extract `<MultiStepComposer>` in the first F036 ticket.** Don't inline the multi-step machinery into a `<SellWalkthrough>` component — extract the reusable base immediately so F034 / F038 / F040 can compose on it without a later refactor ticket.
- **Pull `group.create` + `group.member_join` action handlers into named, reusable handlers** (not inlined in the walkthrough's submit). F036 is their first user-driven call site; F034/F038/F040 will write Items into the same Group via separate handlers, but the create-Group path is F036's exclusive contract.
- **One transaction, one ticket.** The "group + group_business + group_membership + 2 events in one transaction" is its own ticket. Test the rollback behavior on partial failure.
- **Add a ticket for partial-state preservation behavior.** Acceptance: a user fills steps 1–3, navigates away, returns via Sell CTA, lands on step 4 (or wherever they left off) with prior fields populated.
- **Skip the Wonder composer "Sell instead?" cross-link** for b1 — Wonder composer is deferred to b2. Track as a b2 follow-on.
- **Tier 0 locality step is intentionally minimal in F036.** Full claim lifecycle (set / edit / remove / out-of-metro / badge rendering) is F037's surface. F036 writes the optional ZIP into the same row F037 will read/update; F037 owns the badge UI.
- **Vocabulary fix:** prefer "Shop" over "business Group" in user-facing copy (per the naming-conventions table in root CLAUDE.md), unless the scenario PM explicitly decides "Group" is the right user-facing term for b1.

## Decisions captured

These should land as pattern-doc entries (per [`playbooks/writing-docs.md`](../../playbooks/writing-docs.md) § Pattern-doc entry) before tickets open:

1. **Multi-step composer pattern.** The DLS needs a recipe + principle: progressive validation, partial-state preservation on abandonment, navigation behavior (back/next/skip-optional), completion-redirect. → `playbooks/PLATFORM-PATTERNS.md` (if it's a platform-shape decision) or `product/ui/design-language.md` § Component recipes (if it's a DLS-only pattern). Lean: design-language.md.
2. **"Shop" vs "business Group" in UI copy.** Naming-conventions table in root CLAUDE.md says "Shop" for kind='business'. F036's scenario body uses "business Group" throughout. Either fix the scenario copy or carry a deferred decision; do not let tickets land bespoke prose.
3. **Sell-verb routing.** The "Sell" CTA on `/you` routes to the walkthrough for first-time Sellers and to "Add an Item" picker for Members with ≥1 active kind='business' Group membership. This routing rule isn't documented anywhere outside the scenario body — promote it into `groups.md` § "Sell" verb routing, or into `community-platform.md` T1 § You. Otherwise it's tribal knowledge until the second composer tries to reuse it.

## Pre-Gate-A note

This review is a pre-flight on a backlog scenario, requested by the PM ahead of the Gate A walk. The four unratified absolutes in `groups.md` flagged by `scope` (lines 88-89 founder-immutable, 113 self-declaration-over-observation, 124-130 founder-only revival, 364-366 no auto-Group-assignment) still block the scenario from moving to `planning/next/`. The findings above are independent of Gate A: they describe gaps in design-language coverage and ticket-writing extraction notes, none of which depend on the absolutes' ratification state. After `weigh` walks Gate A and `scope` approves, this review remains valid and the EXTEND verdict still stands.

---

## T070 M2 code-review (2026-05-31)

**Reviewer:** `engineering:code-review` (M2 mandatory gate, pre-commit)
**Ticket:** [`development/tickets/done/T070-groups-lifecycle-state-and-draft-handlers.md`](../../development/tickets/done/T070-groups-lifecycle-state-and-draft-handlers.md)
**Branch:** `t070` (worktree at `../web-t070`)
**Files reviewed:** `supabase/migrations/023_groups_lifecycle_state.sql`, `src/actions/group/{create,update-draft,activate,index}.ts`, `src/actions/_lib/event-log.ts`, `src/actions/index.ts`, `tests/{actions,migrations}-t070.test.ts`
**Verdict:** **REQUEST CHANGES** — two criticals must land before commit (fix-now per Rebuild Phase rule 3).

### Findings

| # | Severity | Summary | File · Line |
|---|---|---|---|
| 1 | Critical | TOCTOU on `lifecycle_state` — `update-draft.ts` re-uses the SELECT'd state without re-asserting `AND lifecycle_state = 'draft'` on the UPDATE. Concurrent `group.activate` between SELECT and UPDATE silently mutates an active row. | `update-draft.ts:122–144, 161–183` |
| 2 | Critical | Unhandled slug uniqueness collision in `create.ts`. `groups.slug` is `NOT NULL UNIQUE`; concurrent draft creates with the same brand name collide on 23505. | `create.ts:82–94` |
| 3 | Suggestion | `group.member_removed` added to event-kind CHECK with no producer in T070's scope. | `023_*.sql:77` |
| 4 | Suggestion | Owner-check race comment — theoretical at b1 (no `member_remove` handler), worth a note for the next reader. | `update-draft.ts` |
| 5 | Suggestion | `GROUP_KINDS` duplicates the migration's kind list and is referenced in multiple handlers. Lift to a shared constant. | `create.ts:23–30` |
| 6 | Suggestion | Conditional `UPDATE` after `INSERT` for `anchor_location_id` is two round trips when one would do. | `create.ts:113–122` |
| 7 | Suggestion | `DRAFT_NAME_PLACEHOLDER` duplicated between `create.ts` and `activate.ts`. | `create.ts:55`, `activate.ts:34` |
| 8 | Suggestion | Handler-wrapper `ValidationError` test casts ctx to `never` — cleaner to use the existing `makeContext` helper. | `tests/actions-t070.test.ts:100–110` |
| 9 | Suggestion | `create.ts` hardcodes `lifecycle_state = 'draft'` at insert — no path for an admin caller wanting `'active'` directly. | `create.ts:81–94` |

### PM disposition (2026-05-31)

| # | Disposition | Rationale |
|---|---|---|
| 1 | **Fold-in (already applied)** | Mandatory critical. TOCTOU re-assertion added on both `groups` UPDATE and `group_businesses` UPDATE; `rowCount === 0` surfaces concurrent activate as `STATE_CONFLICT`. |
| 2 | **Fold-in (already applied)** | Mandatory critical. Random 4-byte hex suffix on draft slug at insert; `activate` re-derives the user-visible slug per ADR-22 on promotion. |
| 3 | **Fold-in** | One-line migration edit, free window before commit, prevents misleading orphan event_kind in CHECK. |
| 4 | **Defer** | No `group.member_remove` handler exists at b1 — the race is theoretical. Add when that handler lands. |
| 5 | **Fold-in** | Three-line extract to new `src/actions/group/constants.ts`. Pre-empts schema drift when a new kind is added. |
| 6 | **Defer** | Single extra DB round-trip per draft create, low traffic. Not worth re-running M2 review. |
| 7 | **Fold-in** | Trivial, pairs with #5 in the same `constants.ts` file. |
| 8 | **Defer** | Low-value test polish. |
| 9 | **Defer** | YAGNI — flag when a real caller needs `'active'` at create. |

### What's left for `build` to apply

Findings #3, #5, #7 (suggestions) land in a single follow-up edit pass on branch `t070` before the commit. Mechanical line-edits, no behavior change, no re-review needed (refactor-only). After application: vitest 40/40 + action-layer conformance + tsc clean, then ask PM for commit y/n.

`development/DEVIATIONS.md` entry captures the full M2 trail at ticket close (build's responsibility, post-commit).
