---
purpose: Reorganization plan — PM review before execution.
layer: how
status: draft
---

# Repo Reorganization Plan

**Date:** 2026-05-28
**Status:** PM review. Nothing moves until you approve.

---

## Guiding principle

**Prefer shorter, more specific documents that can be tackled, finished, and moved on from.**

A doc should have a clear "done" state. If it can't be done — if it grows forever, accumulates appendices, or becomes the dumping ground for related-but-distinct concerns — it's too big. Split it. The anti-pattern is the 700-line living document that nobody reads end-to-end and everybody appends to. The goal is files small enough to finish, review in one sitting, and archive when their job is done.

This principle applies across every item below. When in doubt: split, don't append.

---

## 1. product/needs/ — simplify

**Current state:** 5 files. Significant overlap between `needs.md`, `people.md`, `member-journey.md`, and `use-cases.md`. The taxonomy (`producer-capability-taxonomy.md`) is more of a roadmap lens than a need.

**What stays:**

| File | Reason |
|---|---|
| `use-cases.md` | The load-bearing doc. Real situations, real names, progressive build status. Keep as-is. |
| `member-journey.md` | The 13 loops are the north star. Referenced everywhere. Keep as-is. |
| `producer-capability-taxonomy.md` | **Move to `planning/`** — it's a Now/Later/Won't roadmap lens, not a human need. Rename to `planning/producer-roadmap.md`. |

**What gets archived:**

| File | Reason | Archive to |
|---|---|---|
| `needs.md` | Draft, never ratified. Every entry traces back to `member-journey.md` + `use-cases.md` already. It's a cross-reference table that adds no new information. | `_attic/2026-05-28-reorg/product-needs/needs.md` |
| `people.md` | The three roles (Member, Producer, Convener) are valuable as a checklist. **Fold the role definitions + "types to design for" lists into a new section at the top of `use-cases.md`** (20 lines max — role name, one-line definition, bullet list of types). Then archive the standalone file. | `_attic/2026-05-28-reorg/product-needs/people.md` |

**Result:** `product/needs/` has 2 files: `member-journey.md` (loops) and `use-cases.md` (situations + roles). `planning/producer-roadmap.md` holds the capability taxonomy.

---

## 2. foundation/design-philosophy.md — rename

**Problem:** The filename says "design philosophy" but the content is a scored 0–3 rubric for auditing community health. It's a measuring stick, not a philosophy.

**Rename to:** `product/foundation/community-health-rubric.md`

Update: CLAUDE.md authoritative-docs table, REGISTRY.md, any back-references (JUDGMENT.md L1 anchors, `principles.md` status banner).

---

## 3. planning/bundles/ — restructure

**Current state:** 5 files + empty `done/`. `rebuild-plan.md` lives outside bundles but is the active plan. `bundle-themes.md` sequences b1–b3 but is 700+ lines.

**Proposed structure:**

```
planning/bundles/
├── b1-primitives-plan.md          ← stays (the bundle scope)
├── b1-primitives-work-map.md      ← stays (the menu of work)
├── bundle-themes.md               ← stays (sequencer)
└── done/
    ├── b1.x-substrate-sprint.md   ← move here (Phase 1 substrate is done)
    └── b1.x-spec-drain-sprint.md  ← move here (spec drain is done)
```

**`rebuild-plan.md` → `planning/bundles/rebuild-plan.md`**. It IS the active bundle container. Move it into bundles where it belongs.

**Versions idea — defer.** A `versions/` directory and a CSV tracker are premature. You have zero shipped versions. The existing `RELEASES.md` + `_attic/YYYY-MM-DD-vN-{slug}/` pattern already handles version history. Revisit after v1 ships.

**Split `bundle-themes.md` now.** It's 700+ lines covering b1 through b3. Per the guiding principle, a 700-line file that spans three bundles has no "done" state. Split into:

```
planning/bundles/
├── b1-themes.md               ← b1.0–b1.6 themes (active — this is what you're building)
├── b2-themes.md               ← b2.0–b2.6 themes (reference — not yet active)
├── b3-themes.md               ← b3.0–b3.5 themes (reference — not yet active)
```

`b1-themes.md` becomes finishable — when b1 ships, archive it. The monolith `bundle-themes.md` never could be.

**Split `b1-primitives-plan.md` too.** It's 500+ lines with scope, loop tables, deferral lists, and data-model commitments all in one file. The scope definition (what ships) and the deferral log (what doesn't) are two different concerns with different lifespans. Split into:

```
├── b1-primitives-plan.md      ← scope only: what ships, in what primitive/loop terms (shrinks to ~150 lines)
├── b1-deferrals.md            ← what was explicitly deferred and why (archivable when b2 opens)
```

**Split `b1-primitives-work-map.md` per sub-bundle.** Each b1.N section is an independent unit of work. When b1.0 ships, its work-map section should archive. One file per sub-bundle:

```
├── work-maps/
│   ├── b1.0-show-up.md
│   ├── b1.1-groups.md
│   ├── b1.2-items.md
│   ├── b1.3-producer.md
│   ├── b1.4-follow.md
│   ├── b1.5-thesis.md
│   └── b1.6-stewardship.md
```

Each file is short, finishable, and independently archivable.

---

## 4. meta/ + housekeeping/ — merge

**Current state:** `meta/cowork-pipeline/` has 4 process docs. `housekeeping/` has a README. Both are process artifacts.

**Merge into:** `meta/`. Move `housekeeping/README.md` content into `meta/README.md`. Delete `housekeeping/` as a top-level dir.

**`.gitignore` question:** No. These process docs (DECISION-PATTERNS, DEV-PATTERN, HANDOFF-TO-CLAUDE-CODE) are load-bearing for the pipeline. They're referenced from CLAUDE.md and AGENTS.md. Ignoring them would break agent workflows. They should stay tracked.

The `housekeeping/YYYY-MM-DD-{slug}/` pattern for in-flight work products moves under `meta/housekeeping/` (or just use `_inbox/` for untriaged and `_attic/` for archived).

---

## 5. Arbitrary metrics — flag

These numbers appear in specs without evidence. Flag for PM decision (keep/soften/remove):

| Metric | Location | Issue |
|---|---|---|
| "create an Item in <90 seconds" | `rebuild-plan.md` Phase 2 exit test, `phase-2-scenario-strategy.md` | Arbitrary. No user testing. Could be 60s or 120s — the number is made up. **Replace with qualitative:** "a new Member can sign up and create an Item without getting stuck or abandoning." |
| "up to 5 secondary Places" | ADR-21, `member.md`, `rebuild-plan.md` | Magic number. Why 5? Why not 3 or 10? Should carry rationale or be flagged as a tunable default. |
| "k ≥ 10 anonymity floor" | `agent-assistance.md` | Already in `pending-ratifications.md` — good. |
| "90-day Delegation expiry" | `agent-assistance.md` | Already in `pending-ratifications.md` — good. |
| "~50 active-member natural group size" | `design-philosophy.md` | Cites Dunbar but applies it loosely. Flag as tunable. |

**Action:** Add a `## Arbitrary metrics` section to `pending-ratifications.md` with the first two. The others are already there.

---

## 6. planning/reviews/ → planning/adrs/reviews/

**Current state:** 6 intent-review files in `planning/reviews/`. These are decision artifacts — they review ADRs and spec patches.

**Move to:** `planning/adrs/reviews/`. Reviews are part of the decision record. They belong under `adrs/`, not as a sibling.

Update: `adrs/README.md` to mention the `reviews/` subdirectory. Update CLAUDE.md references.

---

## 7. Archive completed items

Files sitting in active directories that should move to `_attic/`:

| File | Why | Archive to |
|---|---|---|
| `planning/bundles/b1.x-substrate-sprint.md` | Phase 1 substrate sprint is complete (T058–T066 done). | `planning/bundles/done/` |
| `planning/bundles/b1.x-spec-drain-sprint.md` | Spec drain sprint is done. | `planning/bundles/done/` |
| `operations/deploy-checklist-b1x.md` | b1.x deploy is done. | `_attic/2026-05-28-reorg/operations/` |
| `development/tickets/T054–T066` (open dir) | T054–T064, T066 — check each. If done, move to `done/`. Several appear to be substrate sprint tickets that shipped. | `development/tickets/done/` |
| `product/exploration/member-geography-redesign.md` | Drove ADR-21, which is accepted. The exploration is concluded. | `_attic/2026-05-28-reorg/product-exploration/` |
| `planning/phase-2-pipeline-audit.md` | A checklist of TODO items from 2026-05-27. Should be an issue list or inbox item, not an active planning doc. **Move to** `_inbox/` or convert to OPEN-QUESTIONS entries. |
| `planning/phase-2-scenario-strategy.md` | Draft strategy doc for Phase 2. If approved, fold key decisions into `rebuild-plan.md` and archive. If not yet approved, leave but mark clearly as draft. |

---

## 8. Atomicity — make everything finishable

**The guiding principle applied to the biggest offenders.** Every long doc gets the same question: *can I mark this done and archive it?* If no, it needs splitting.

**`rebuild-plan.md` → overview + per-phase files:**

```
planning/bundles/
├── rebuild-plan.md          ← overview only: decisions, what-we-keep/delete (~100 lines)
├── phase-1-substrate.md     ← extracted from § Phase 1 (status: done — archive immediately)
├── phase-2-surfaces.md      ← extracted from § Phase 2 (status: active)
├── phase-3-explore.md       ← extracted from § Phase 3 (status: planned)
└── phase-4-polish.md        ← extracted from § Phase 4 (status: planned)
```

Phase 1 is done → archive `phase-1-substrate.md` on creation. Each subsequent phase archives independently. The overview stays as long as the rebuild is in flight, then archives with the bundle.

**`bundle-themes.md`, `b1-primitives-plan.md`, `b1-primitives-work-map.md`:** Already addressed in item #3 above — split by bundle (themes) and by concern (plan vs. deferrals) and by sub-bundle (work maps).

**`DEVIATIONS.md` (611 lines, 49 entries):** Rotate now. Phase 1 entries → `development/archive/DEVIATIONS-phase-1.md`. Live file resets to empty for Phase 2. This is already called out in OPEN-QUESTIONS #7 — the reorg is the right moment to do it.

**`use-cases.md` (474 lines):** Currently one long file with 16 cases. Manageable for now, but watch it. If it grows past ~20 cases, split by category (consumer/producer/organizer) into three files. Each category file becomes independently finishable per bundle.

**`DECISIONS.md` (74 lines):** Already well-scoped as a pointer index. No split needed. Good example of the pattern — thin index, detail lives elsewhere.

**General rule going forward:** Any doc that crosses 300 lines should be examined for splits. Any doc that spans multiple bundles, phases, or concerns should be split at those boundaries.

---

## 9. planning/outreach/ → operations/

**Current state:** `planning/outreach/outreach-list.md` — a list of potential users to recruit. This is operational (getting users in the app), not planning (deciding what to build).

**Move:** `planning/outreach/outreach-list.md` → `operations/outreach-list.md`. Delete `planning/outreach/`.

`operations/` already exists with `DEPLOY.md`. Outreach fits there.

---

## 10. DECISIONS.md vs JUDGMENT.md — clarify, don't merge

**These serve different purposes and should NOT merge:**

| Doc | What it is | Analogy |
|---|---|---|
| `DECISIONS.md` | Pointer index to ADRs — "what did we decide" | Case law index |
| `JUDGMENT.md` | Bounds for agent autonomy — "when can agents decide alone vs. escalate" | Operating manual for the staff |

**Problem:** The names are confusing. `JUDGMENT.md` sounds like it should contain judgments/decisions.

**Rename `JUDGMENT.md` → `AGENT-BOUNDS.md`.** Clearer: this file defines the boundaries of agent autonomy. Update references in CLAUDE.md, AGENTS.md, pipeline skills.

---

## 11. Clean up resolved open questions

**OPEN-QUESTIONS.md** has 8 items. Review each:

| # | Item | Proposed action |
|---|---|---|
| 1 | F018 re-anchoring | Still open. Keep. |
| 2 | BUILD-LOG prose cleanup | Mechanical fix. **Do it and remove.** |
| 3 | Web-side cleanups | Still open (web repo). Keep. |
| 4 | Remove stale worktrees | **Do it and remove.** Check if worktrees still exist first. |
| 5 | Global skill-symlink cleanup | **Do it and remove.** 30-second task. |
| 6 | Backfill T055/T056/T057 commit hashes | **Do it and remove.** 2-minute edit. |
| 7 | First DEVIATIONS rotation | Phase 1→2 boundary is now. **Do it and remove.** |
| 8 | F025 re-anchoring | Still open (PM scenario decision). Keep. |

**After cleanup:** 3 items remain (1, 3, 8). File shrinks from 126 lines to ~40.

**`pending-ratifications.md`:** Same treatment. Walk each PENDING item — if the decision has been made elsewhere (ADR, spec banner), flip status and trim. Don't keep history of resolved items in the active file.

---

## 12. YAML front-matter `id:` field — stable doc IDs

**The idea:** Every doc gets a stable `id:` in its YAML front-matter. Other docs reference `[[id]]` instead of file paths. When files move, update REGISTRY.md only — all `[[id]]` references resolve through the registry.

**Plan:**

### ID format

`{layer}-{short-slug}` — e.g., `why-principles`, `what-item`, `how-adr-0021`, `how-stage-ledger`.

Layer prefixes: `why` (foundation), `what` (needs/systems/capabilities/ui/exploration), `how` (planning/development/standards/meta).

### Conversion steps

1. **Generate IDs.** Script reads every `.md` file with front-matter, generates an `id:` based on layer + filename slug. Output: a mapping file (`meta/doc-ids.json` or similar).
2. **Inject `id:` into front-matter.** Automated — add `id:` line to each file's YAML block.
3. **Rebuild REGISTRY.md** as the resolution table: `id → current path`.
4. **Convert path references to `[[id]]`.** This is the big lift. Every `[text](../path/to/file.md)` becomes `[text]([[what-item]])`. A script can do the mechanical conversion; PM reviews edge cases.
5. **Update pipeline skills** to resolve `[[id]]` via REGISTRY.md lookup before reading files.

### Phasing

- **Phase A (now):** Inject `id:` into all front-matter. Rebuild REGISTRY with ID column. No link conversion yet — both path refs and IDs coexist.
- **Phase B (next session):** Convert internal references in the 15 most-cited docs first. Validate nothing breaks.
- **Phase C (ongoing):** Convert remaining refs. Add a `tidy` check that flags path-based refs when an `id:` exists.

**Risk:** The `[[id]]` syntax isn't standard Markdown. GitHub rendering will show raw `[[id]]` text. If that matters, use a different convention — e.g., `[text](registry:what-item)` with a custom resolver, or simply keep path refs and treat `id:` as a stable key for REGISTRY lookups only (no inline linking change).

**Recommendation:** Start with Phase A only. Inject IDs, rebuild REGISTRY. See if the value justifies the link-conversion effort. The main win is that REGISTRY becomes a reliable catalog with stable keys — even without `[[id]]` inline linking.

---

## Execution order

If you approve all of the above, here's the sequence:

**Batch 1 — moves and renames (no content changes):**
1. Archive completed items (#7)
2. Move outreach to operations (#9)
3. Merge meta + housekeeping (#4)
4. Rename `design-philosophy.md` → `community-health-rubric.md` (#2)
5. Rename `JUDGMENT.md` → `AGENT-BOUNDS.md` (#10)
6. Move reviews under adrs (#6)
7. Move `rebuild-plan.md` into bundles (#3)

**Batch 2 — content splits (the atomicity pass):**
8. Split `bundle-themes.md` → `b1-themes.md` / `b2-themes.md` / `b3-themes.md` (#3)
9. Split `b1-primitives-plan.md` → plan + deferrals (#3)
10. Split `b1-primitives-work-map.md` → per-sub-bundle files (#3)
11. Split `rebuild-plan.md` → overview + per-phase files; archive Phase 1 (#8)
12. Rotate DEVIATIONS (#8)

**Batch 3 — simplify and clean:**
13. Simplify product/needs/ — fold people.md into use-cases.md, archive needs.md, move taxonomy (#1)
14. Clean up OPEN-QUESTIONS — resolve the 5 mechanical items (#11)
15. Flag arbitrary metrics in pending-ratifications (#5)

**Batch 4 — infrastructure:**
16. Inject doc IDs into front-matter, rebuild REGISTRY (#12, Phase A only)

Batch 1 is mechanical — one commit, low risk. Batch 2 is the structural work — do it in one session while the splits are fresh. Batch 3 is editorial. Batch 4 is tooling.

---

## What this plan does NOT do

- **Does not touch `web/` repo.** Web-side cleanups (BUILD-LOG, evals graveyard) are separate.
- **Does not touch `_attic/`.** Existing archives stay as-is.
- **Does not touch skills/.** Skill workflows are a separate concern.
- **Does not rename CLAUDE.md or AGENTS.md.** Those are stable entry points.
- **Does not split system specs** (`item.md`, `groups.md`, etc.). Those are already well-scoped — one file per primitive. The guiding principle targets planning/bundle docs that span multiple concerns, not system specs that cover one thing deeply.

## Going forward

After this reorg, the 300-line rule applies to all new docs: if a doc is approaching 300 lines, ask whether it's trying to be two docs. If it spans multiple bundles, phases, or pipeline stages, it probably is. Split at the natural boundary. Make it finishable.
