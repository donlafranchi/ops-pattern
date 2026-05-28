---
purpose: Daily session report — what landed 2026-05-27 → 2026-05-28, new docs catalog, pending PM decisions, next-session queue.
layer: how
status: draft
---

# Session Report — 2026-05-27 → 2026-05-28

> **Read first:** this is a *PM resume note*, not a spec. It catalogs the doc work that landed in the rebuild-plan rescope arc + the b1 surface sequencing work. The substantive product decisions live in the linked files; this report is the index.

---

## What happened (in order)

### Rebuild-plan re-review → revise → patches landed (2026-05-27 morning)

[`planning/reviews/intent-rebuild-plan-2026-05-27.md`](../planning/reviews/intent-rebuild-plan-2026-05-27.md) ran on the existing rebuild-plan.md. Verdict **REVISE** — plan structure intact across ADR-20/21/22/23, but 7 mechanical patches required. All 7 landed in commit `fadd963`:

- **P1 + P2** — stale `pipeline-*` skill names → `ticket` / `explore` / `scope`.
- **P3** — Member handler list dropped retired `location_affinity.*` + `maker_mode.*`; added `place_interest.*` + `saved_search.*` per ADR-21.
- **P4 + P5** — ADR-13 + ADR-14 marked Accepted, canonical `adrs/` paths added.
- **P6** — Phase 2 routes rewritten to place-scoped per ADR-20/22/23 (`/p/[…place]/g/[slug]`, `/p/[…place]/l/[slug]`); Item URLs now two-shape (Group-anchored vs Member-anchored); ADR-22 random-suffix mention added.
- **P7** — Phase 2 exit criterion dropped F019–F024 scrapped reference, F018 framed as rewrite candidate.

### SPEC-PATCHES drain (2026-05-27 morning, commit `b71b3ac`)

Three patches landed, one rescinded; Phase 2 gate cleared:
- **SPEC-PATCH-0001** — `item.md` state enum reconciled to `draft / published / withdrawn / fulfilled / closed`.
- **SPEC-PATCH-0002** — `member.md` delegations partial-index predicate aligned with shipped T050.
- **SPEC-PATCH-0004** — ADR-21 drift fixed in `primitives.md`, `payments.md`, `agent-assistance.md`, `affinity-derived-groups.md` (four sites the original entries didn't name).
- **SPEC-PATCH-0003** — rescinded; both targets (`member_location_affinities` table + `member_is_local_to_location()` function) dissolved by ADR-21 before the patch could land.

Sprint def: [`planning/bundles/b1.x-spec-drain-sprint.md`](../planning/bundles/b1.x-spec-drain-sprint.md).

### Phase 2 scenario strategy + producer taxonomy + pipeline audit (2026-05-27 afternoon, commit `bf97565`)

Four new docs co-landed:
- [`planning/phase-2-scenario-strategy.md`](../planning/phase-2-scenario-strategy.md) — strategy doc for Phase 2 scenario authoring (later partially superseded by the b1-primitives-sequence rescope).
- [`planning/phase-2-pipeline-audit.md`](../planning/phase-2-pipeline-audit.md) — audit findings against the Phase 2 framing.
- [`product/needs/producer-capability-taxonomy.md`](../product/needs/producer-capability-taxonomy.md) — producer/seller capability taxonomy with Now/Later/Won't tagging per category. PM-ratified scope boundaries.
- `use-cases.md` build status — added Build column to every row.

### Pipeline wiring: Phase 2 scenario patterns (2026-05-27 evening, commit `dd2df49`)

Wired Phase 2 patterns into the pipeline: scenario template updated, registry + work-map references aligned, REGISTRY/MAP/TRACE updated. Touches `scope` workflow + template + AGENTS.md reads.

### Repo reorganization plan + directory conventions (2026-05-27 evening, commit `41c56e7`)

Two housekeeping docs proposing the next sweep:
- [`housekeeping/2026-05-28-repo-reorg/reorg-plan.md`](../housekeeping/2026-05-28-repo-reorg/reorg-plan.md) — proposed reorg steps. Includes the **rename `design-philosophy.md` → `community-health-rubric.md`** call (the doc is already a scored 0–3 rubric; the current filename is misleading).
- [`housekeeping/2026-05-28-repo-reorg/directory-conventions.md`](../housekeeping/2026-05-28-repo-reorg/directory-conventions.md) — target-state directory layout reference.

### Rebuild-plan archived; b1 build sequence ratified (2026-05-28, uncommitted as of this report)

The substantive PM decision of 2026-05-28: **rebuild-plan.md is archived** (Phases 0/1/4 done, Phases 2/3 superseded) and replaced by a single sequenced build doc.

- **Archived:** `planning/rebuild-plan.md` → [`_attic/2026-05-28-rebuild-plan/`](../_attic/2026-05-28-rebuild-plan/) (with `RETIRED.md` provenance).
- **New:** [`planning/bundles/b1-primitives-sequence.md`](../planning/bundles/b1-primitives-sequence.md) — eight scenarios (F030–F037) + three substrate gates (S-jurisdictions, S-metro, S-saved-search) sequenced by build dependency, every F### anchored to one MVP-tagged row of `use-cases.md`.

### Pre-rescope scenarios archived (2026-05-28, uncommitted)

F025–F029 archived to [`_attic/2026-05-28-pre-rescope-scenarios/`](../_attic/2026-05-28-pre-rescope-scenarios/) with provenance + fold-into mapping. The substantive work is preserved in F030–F037:

| Archived | Folds into | Notes |
|---|---|---|
| F025 (Adaeze public page) | F030 + F032 | No standalone Member-page scenario at b1; surface is implicit |
| F026 (Locally Owned) | F035 | Same scope; F035 ships both badges as one scenario |
| F027 (Locally Made) | F035 | Folded into F035 with F026 |
| F028 (Sam awareness feed) | F036 | Part of F036's `/you/locality` surface + metro-polygon opt-in |
| F029 (Place-interest scope mgmt) | F036 | Same `/you/locality` surface |

### ADR-0024 drafted (2026-05-26, uncommitted)

[`planning/adrs/ADR-0024-metro-polygon-discovery-layer.md`](../planning/adrs/ADR-0024-metro-polygon-discovery-layer.md) — Status: **Proposed**. Metro polygon (MSA geometry) returns as a *discovery-layer overlay*, not a hierarchy tier. Resolves the "wider than my city" opt-in scope that ADR-0022 left orphaned when MSA dropped out of the addressing hierarchy. F036 depends on this ratifying.

---

## New docs catalog (created or substantively re-shaped in this arc)

| Doc | Purpose | Status |
|---|---|---|
| [`planning/bundles/b1-primitives-sequence.md`](../planning/bundles/b1-primitives-sequence.md) | The ratified b1 build sequence — F030–F037 + three substrate gates, sequenced by dependency. Supersedes rebuild-plan.md Phases 2/3. | **Active** (PM-ratified 2026-05-28, uncommitted) |
| [`planning/bundles/b1.x-spec-drain-sprint.md`](../planning/bundles/b1.x-spec-drain-sprint.md) | Sprint def for the SPEC-PATCHES drain (Phase 2 gate). | Done (committed) |
| [`planning/phase-2-scenario-strategy.md`](../planning/phase-2-scenario-strategy.md) | Phase 2 scenario authoring strategy. | Partially superseded by b1-primitives-sequence.md — PM to confirm retire-vs-keep |
| [`planning/phase-2-pipeline-audit.md`](../planning/phase-2-pipeline-audit.md) | Audit findings against the Phase 2 framing. | Historical (Phase 2 framing now archived) |
| [`planning/reviews/intent-rebuild-plan-2026-05-27.md`](../planning/reviews/intent-rebuild-plan-2026-05-27.md) | Verdict + 7-patch punch list from the rebuild-plan re-review. | Done; rebuild-plan.md subsequently archived (its successor doc is now b1-primitives-sequence.md) |
| [`planning/adrs/ADR-0024-metro-polygon-discovery-layer.md`](../planning/adrs/ADR-0024-metro-polygon-discovery-layer.md) | Metro polygon returns as a discovery-layer overlay (not a hierarchy tier). | **Proposed** — needs ratification (gates F036) |
| [`product/needs/producer-capability-taxonomy.md`](../product/needs/producer-capability-taxonomy.md) | Producer/seller capabilities organized by business function, Now/Later/Won't per category. | Active (committed) — PM-ratified scope boundaries |
| [`housekeeping/2026-05-28-repo-reorg/reorg-plan.md`](../housekeeping/2026-05-28-repo-reorg/reorg-plan.md) | Proposed reorg sweep — incl. design-philosophy → community-health-rubric rename. | Proposed — awaits PM ratification |
| [`housekeeping/2026-05-28-repo-reorg/directory-conventions.md`](../housekeeping/2026-05-28-repo-reorg/directory-conventions.md) | Target-state directory layout reference. | Reference doc (committed) |
| `_attic/2026-05-28-rebuild-plan/` | Archived rebuild-plan.md + RETIRED.md provenance. | Archived |
| `_attic/2026-05-28-pre-rescope-scenarios/` | Archived F025–F029 + RETIRED.md provenance + fold-into mapping. | Archived |

### The rubric (re Job 1)

`product/foundation/design-philosophy.md` is the scored 0–3 community-health rubric. The current filename is misleading — its purpose frontmatter already calls it "Scored 0–3 rubric grading platform decisions against community-health theory." The reorg plan (reorg-plan.md §49–51) proposes renaming the file to `community-health-rubric.md`. The rename has not happened yet; it is queued in the reorg-plan as item #2 of the proposed sweep.

---

## Open items / PM decisions still pending

1. **ADR-0024 ratification.** Currently **Proposed**. Gates F036 (C2 multi-Place awareness with metro-polygon "wider scope" opt-in). Needs `weigh` (or direct PM ratify) → `DECISIONS.md` row → spec patches in `discovery.md` + `places.md`.
2. **STAGE-LEDGER updates for F025–F029.** The `_attic/2026-05-28-pre-rescope-scenarios/RETIRED.md` provenance lists these as stamped `deferred`, but `planning/STAGE-LEDGER.md` still shows them as `plan-backlog`. **Drift to fix** — five rows need `deferred` stamps with fold-into reasons.
3. **F030–F037 stamping.** No STAGE-LEDGER rows yet for the new scenarios. `scope` will create rows as each scenario opens, but the sequence doc commits to eight rows that don't exist yet — flag if `orient` drift check fires on this.
4. **`phase-2-scenario-strategy.md` + `phase-2-pipeline-audit.md` status.** The Phase 2 framing they wrap is archived. Both docs are now partially historical. PM to decide: retire to `_attic/`, or keep as auxiliary references to the sequence doc.
5. **Reorg plan ratification.** [`housekeeping/2026-05-28-repo-reorg/reorg-plan.md`](../housekeeping/2026-05-28-repo-reorg/reorg-plan.md) proposes a multi-step sweep including the `design-philosophy.md` → `community-health-rubric.md` rename. Not yet ratified.
6. **P2 use-cases.md status mismatch.** P2 (Producer bulletins) is tagged "MVP (b1)" in the Status column but "⬜ Not built — bulletin composer + delivery are b2" in the Build column. The b1 sequence treats P2 as substrate-at-b1 / surface-at-b2 with no F-number. PM to confirm row re-tag to "MVP substrate; surface deferred."
7. **`region`-kind drop in `places`.** ADR-24 notes `region` may drop entirely if no URL-browsable region surfaces in b1. The new sequence does not introduce one. Follow-up b2 ADR call.

---

## What's queued for next session

**First moves:**

1. **Ratify ADR-0024** (unblocks F036 work upstream) or explicitly defer it with a State-tagged Intent line. Update `DECISIONS.md`. Patch `discovery.md` + `places.md` for the metro-polygon overlay shape.
2. **Drain the STAGE-LEDGER drift** — five `plan-backlog` → `deferred` stamps for F025–F029 (the archives are landed; the ledger row updates are not).
3. **Run `scope` on F030** — Producer profile + lists. Anchor: `use-cases.md` P1. First scenario in the new sequence. No substrate gate; can open immediately.

**Then the sequence:**

`scope` opens scenarios one at a time per [`planning/bundles/b1-primitives-sequence.md`](../planning/bundles/b1-primitives-sequence.md):
- F030 (P1, no gate) → F031 (O1, no gate) → F032 (C1, no gate) → F033 (O2, no gate) → F034 (P3, no gate)
- F035 (P4, gate: S-jurisdictions) → F036 (C2, gate: S-metro / ADR-24) → F037 (O3, gate: S-saved-search)

**Substrate work** can run in parallel as gates open:
- **S-jurisdictions** — `member_business_jurisdictions` table + verification_source enum + the three-tier ladder (Tier 0 at b1 only). Gates F035.
- **S-metro** — metro polygons (MSA geometry as overlay), once ADR-0024 ratifies. Gates F036.
- **S-saved-search** — `member_saved_searches` substrate (table + action handlers; UI deferred). Gates F037.

**Out-of-band:**

- Reorg plan ratification (incl. the rubric rename). Cheap if batched.
- F018 (Run Club) flagship-trace question — separate track per OPEN-QUESTIONS #1.

---

## Pointers

- [`JOURNAL.md`](../JOURNAL.md) — full session-by-session log; 2026-05-27 entry is the most recent.
- [`planning/STAGE-LEDGER.md`](../planning/STAGE-LEDGER.md) — pipeline stage tracker; drift items above.
- [`planning/DECISIONS.md`](../planning/DECISIONS.md) — ADR index; ADR-0024 still missing a row.
- [`planning/bundles/b1-primitives-sequence.md`](../planning/bundles/b1-primitives-sequence.md) — the active build sequence.
- [`product/needs/use-cases.md`](../product/needs/use-cases.md) — source of truth for what each F### must serve.
