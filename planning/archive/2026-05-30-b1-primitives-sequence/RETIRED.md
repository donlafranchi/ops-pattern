---
purpose: Historical record of what b1-primitives-sequence.md accomplished before triage on 2026-05-30.
layer: how
status: archived
retired_from: _inbox/b1-primitives-sequence.md
---

# b1-primitives-sequence.md — triaged 2026-05-30

The sequence was drafted 2026-05-28 as the ratified b1 build sequence (F030–F037 + three substrate gates). It sat in `_inbox/` because the F-numbering was reworked the same week and the surface decomposition was re-scoped. Triaged here for provenance; the active build sequence lives at [`planning/next/plan-b1-surface-sequence.md`](../../next/plan-b1-surface-sequence.md).

## What this sequence accomplished

### Decisions captured (still in force)

- **`use-cases.md` is the source of truth** for what each scenario must serve. Every F### in the active backlog anchors to one MVP-tagged use case.
- **Sequence is by build dependency, not by use-case order.** Producers and Organizers declare Items first; consumer surfaces follow so the feed is not empty.
- **Wonder is OUT of b1.** O4 is Deferred (b2+) in `use-cases.md`. The Wonder primitive (Item kind enum value, child table reservation) stays in the schema; no surface ships at b1.
- **F018 (Run Club) stays deferred.** Replaced by F034 (recurring gathering at venue) which drops the persona framing and fixes the three REVISE blockers.
- **ADR-24 ratification runs on its own track.** Substrate gate (S-metro) for metro-polygon discovery overlay.
- **The grammar holds:** "Person declares Item at Location; other Persons respond. People form Groups when they decide they are a group." No Business entity in the schema. Groups never auto-assigned.

### Scenarios decomposed and re-scoped

The sequence proposed 8 coarse F-numbers (F030–F037). The current scenario backlog has 14 finer-grained scenarios (F030–F043), written 2026-05-28 against the rescoped use-cases.md. Approximate mapping:

| Sequence F# | Anchor | Decomposed into current backlog |
|---|---|---|
| F030 — Producer profile + lists (P1) | Sell walkthrough + product + service composers | F036 (business Group via Sell), F038 (lists product), F040 (lists service) |
| F031 — Recurring gathering (O1) | Wedge demo | F034 (member hosts recurring gathering) |
| F032 — Locality feed + follow (C1) | Consumer entry | F030 (newcomer signs up + lands in feed), F032 (Member page + follow), F042 (follows producer/Group/venue) |
| F033 — Venue's recurring program (O2) | Cross-host aggregation | F033 (viewer finds venue page) |
| F034 — Variable cadence producer (P3) | Irregular/ambulatory | (folded into F038/F034; push-to-followers deferred to b2) |
| F035 — Locally Owned + Made badges (P4) | Tier 0 self-attested | F037 (Locally Owned), F039 (Locally Made), F035 (Group public page rendering) |
| F036 — Multi-Place awareness (C2) | Place-interest mgmt + metro scope | F031 (place-interest scope) |
| F037 — Multi-venue series (O3) | Cross-host feed + saved-search substrate | substrate-only at b1; surface deferred to b2 |

New scenarios added on top: F041 (QR card cross-cutting), F043 (newcomer completes journey under target).

The five Phase 3 concerns named in the sequence (`/explore` anonymous, Wonder, `/why` thesis page, Group browse/create, stewardships) were either folded into b1 surfaces (`/explore` into F030), dropped from b1 (Wonder, stewardships), or treated as doc-only work (thesis page).

### Substrate that landed

- **Phase 0 + Phase 1 substrate** — complete pre-sequence. Extensions, embedding floor, Members, Locations, Action layer, Groups, Items, materialized view. T041–T057 in `tickets/done/`.
- **ADR-20 + ADR-21 geography substrate (b1.x sprint)** — complete 2026-05-25. T058–T064: `places` table, reverse-geocoder, place URL routing, `member_location_affinities` retirement, `member_place_interests`, `member_saved_searches` table, `items.made_at_place_id` + `items.made_at_verification_source` columns. 107/107 unit + 181/181 Phase 1 evals green; 0 conformance violations.
- **ADR-24 migrated to playbooks/PLATFORM-PATTERNS.md** — "Layer metro polygons over the place tree as a discovery overlay, not a hierarchy tier." Ratified inline during the 2026-05-30 repo reorg. Substrate code (the actual `metro_polygons` table and seed job) has not yet shipped — see remaining work doc.
- **ADR-25 (local lifecycle ownership)** — ratified. Directory-local archive convention encoded in CLAUDE.md.

### What the sequence got right that survives

Three structural truths the active build sequence inherits:

1. The grammar — *Person declares Item at Location; other Persons respond. People form Groups when they decide they are a group.*
2. **Business serves people, not the other way around.** No Business entity. No `business_name` column on Members. No "Brand" abstraction beyond `brand_label` and `group_businesses.display_name`.
3. **Groups are emergent, optional, never auto-assigned.** kind='business' Groups created via explicit producer action; kind='event_anchored' emergence is opt-in.

## Why this was retired

The F-numbering collision is the proximate reason: the sequence's "F030 = Producer profile + lists" is not the same scenario as the backlog's "F030 = Newcomer signs up and lands in feed." Continuing to reference the sequence by F-number would have been confusing.

The deeper reason is decomposition granularity. The 8-scenario sequence bundled too much per scenario (one F# covered Group composer + product composer + service composer + Group page rendering). The 14-scenario rewrite separates these so each scenario is a single coherent walk — a producer claims Locally Owned is its own walk from a producer lists a product. This matches the project's "one scenario, one walk" pipeline norm and produces cleaner Playwright eval coverage.

The phase-2-scenario-strategy.md companion was also retired on 2026-05-30 (`planning/archive/2026-05-30-phase-2-historical/`).

## Where the surviving content lives now

| Concern from the sequence | Lives now in |
|---|---|
| F-numbered active backlog | `planning/scenarios-backlog/F030.md` through `F043.md` |
| Pipeline stage tracker | `planning/STAGE-LEDGER.md` (rows for F030–F043 + 3 substrate gates) |
| Remaining substrate work + open inconsistencies | `planning/next/plan-b1-surface-sequence.md` |
| The grammar + the three non-negotiables | `playbooks/PLATFORM-PATTERNS.md`, `product/foundation/principles.md` |
| The metro-polygon decision | `playbooks/PLATFORM-PATTERNS.md` § metro polygons over the place tree |
| Bundle scoping (what ships at b1 in primitive / cluster / loop terms) | `planning/bundles/b1-primitives-plan.md` |
| Sub-bundle slicings (b1.0–b1.6) | `planning/bundles/bundle-themes.md` + `b1-primitives-work-map.md` (both flagged for reconciliation in the next-doc) |
