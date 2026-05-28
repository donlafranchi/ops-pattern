# ADR-0025: Local lifecycle ownership — directory-resident archives and initiatives

**Status:** Accepted
**Date:** 2026-05-28
**Deciders:** PM
**Scope:** Where retired docs and non-bundle work packages live in the repo.
**Touches:** `CLAUDE.md` (anti-sprawl rules, file-naming table), `planning/`, `product/`, `development/`, `_attic/` (frozen), `meta/cowork-pipeline/DEV-PATTERN.md`, `skills/tidy/workflow.md`, `skills/orient/workflow.md`, `REGISTRY.md`, `planning/RELEASES.md`

## Decision

Two shape changes:

1. **Archives are directory-local.** Every working directory grows an `archive/` subdir on first need. Retired docs move to `{owning-dir}/archive/YYYY-MM-DD-{slug}/` instead of global `_attic/`. On a shipped-version cut (v0.1, v0.2, …), each `{owning-dir}/archive/` wraps its contents into `{owning-dir}/archive/vN-{slug}/`, then resets empty for the next version. Root `planning/RELEASES.md` indexes the cross-directory snapshot per version.

2. **Non-bundle work packages live under `planning/initiatives/`.** Each one-off — a refactor, a doc reorg, a strategy pass, a phase-spanning plan — lands as `planning/initiatives/{slug}/` with the atomization shape inside (one stub per item). `bundles/` stays release-only. The existing `planning/phase-3-items/` is the working precedent; it renames to `planning/initiatives/phase-3/` to formalize.

Legacy `_attic/` is frozen — grandfathered. Pre-2026-05-28 retirements stay there; cite stability is preserved. New retirements use the in-place model.

## Options considered

| Option | Description | Verdict |
|---|---|---|
| **A — In-place archives + `planning/initiatives/`** | Each dir owns `archive/`; non-bundle work goes under `planning/initiatives/{slug}/`. v0.1 ship wraps `archive/` contents into `archive/v0.1/`. | **Chosen** |
| B — Reorg `_attic/` by dir | `_attic/product/`, `_attic/planning/`. Keeps global-history view. | Rejected — doesn't fix the friction; archives stay global. |
| C — Hybrid (in-place during release window, collapse to root `releases/vN/` on ship) | Two-step lifecycle. | Rejected — two states to remember; the v0.1 rollup is enough discipline. |
| D — Extend `bundles/` to host any work package | `bundles/` becomes "any coordinated work." | Rejected — dilutes the b1/b2/b3 release-package identity. |
| E — Promote each one-off to its own top-level dir under `planning/` | `planning/{slug}/` directly. | Rejected — `planning/` root crowds fast; `initiatives/` umbrella keeps it tidy. |
| F — Migrate `_attic/` contents now | Move every retired doc into its source dir's `archive/`. | Rejected — hundreds of cites in CLAUDE.md, REGISTRY.md, MEMORY, retired-doc frontmatter. Cite-stability rule says don't rename casually. Grandfather. |

## Trade-offs

**Why local won.** The active half of the repo already organizes per-directory (`planning/`, `product/`, `development/`). Archives were the one place that tried to be global, which created two friction points: (a) "where did `foo.md` get retired to" required knowing the date, not the source dir; (b) `_attic/` accumulated mixed retirements — pre-format ADRs, retired specs, shipped bundle wrap-ups — with no per-dir ownership. Local archives mean every dir owns its own lifecycle end-to-end.

**Why `planning/initiatives/` won.** `bundles/` is a release-package construct (b1, b2, b3 — bound to ship dates). The audit / reorg / phase-strategy work is process-package, not release-package, and trying to use `bundles/` for both blurred the contract. A separate `initiatives/` umbrella keeps the release-package identity of `bundles/` intact and gives non-release work a clean home with the same atomization discipline.

**What's hard.** The v0.1 rollup discipline is not yet exercised — at ship day the PM has to remember to wrap each `archive/` into `archive/v0.1/` across product, planning, development. `RELEASES.md` is the prompt. The risk is forgetting; the cost of forgetting is a few extra weeks of mixed-version contents in `archive/`. Mitigation: `orient` drift check gains a row at v0.1 ship time.

**What rejected options would have cost.** Option B (`_attic/` reorg) preserves the global view but leaves `_attic/` as the dumping ground — solves the symptom, not the cause. Option F (migrate `_attic/` now) breaks hundreds of cites for no current value; legacy archives are read-only history.

## Consequences

- `_attic/` is frozen as a historical-grandfather. All existing references in `CLAUDE.md`, `REGISTRY.md`, `AGENTS.md`, retired-doc frontmatter, and `MEMORY.md` stay valid.
- New retirements after 2026-05-28 go to `{owning-dir}/archive/YYYY-MM-DD-{slug}/`. Pattern: `product/archive/`, `planning/archive/`, `development/archive/`, `meta/archive/`, `skills/archive/`, etc. Each emerges on first need — no scaffold required up front.
- `development/tickets/done/` keeps its current shape; it is the per-ticket archive and predates this ADR. At v0.1 ship, `done/` wraps to `done/v0.1/` per the same discipline.
- `CLAUDE.md` anti-sprawl rule 6 ("Archive shape is unified … to `_attic/`") rewrites to reflect the new model. The file-naming-table rows for "Retired spec" and "Shipped-version release doc" rewrite accordingly.
- `planning/initiatives/` is the formal home for non-bundle work packages. `planning/phase-3-items/` renames to `planning/initiatives/phase-3/`. New initiatives (audits, reorgs, refactors, strategy passes) land under `initiatives/{slug}/`.
- `planning/phase-2-scenario-strategy.md` is **not** moved by this ADR — its items (scenarios F030–F043) already live atomized in `scenarios-backlog/`. The strategy doc is meta-narrative pointing at atomized items. A follow-up may move it to `planning/initiatives/phase-2/` for symmetry; that decision is deferred.
- `bundles/` continues to host release-bound work only (b1, b2, b3 + their sprint / work-map / wrapup artifacts). The existing `bundles/` lifecycle (filename kind suffix + `status` frontmatter) is unchanged.
- The atomization-trigger broadening (DEV-PATTERN line 190 + tidy finding #7 + orient drift row line 38: "4+ items, any state" replaces "mixed states") lands as a separate doc edit — it is a refinement of DEV-PATTERN, not an architectural decision, and uses DEV-PATTERN's own update-log mechanism.
- `housekeeping/` keeps its current shape (dated work products in flight → archived to `_attic/YYYY-MM-DD-{slug}/`). New `housekeeping/` work after this ADR archives in-place to `housekeeping/archive/YYYY-MM-DD-{slug}/`. Grandfathered entries already in `_attic/` stay.

**Foreclosures and cost to reverse:**

- Forecloses: a global retirement view (date-sorted across all dirs). Cost to reverse: low — a tooling script can walk `*/archive/` and synthesize a date-sorted index any time. Not a path-dependent lock-in.
- Forecloses: putting non-bundle work inside `bundles/`. Cost to reverse: low — the dir is renamable.

## Action Items

1. [ ] PM ratifies; flip Status to Accepted.
2. [ ] Update `planning/DECISIONS.md` pointer index with ADR-25 row.
3. [ ] Update `CLAUDE.md` anti-sprawl rule 6 to describe the new archive model. Update the file-naming table rows for "Retired spec" and "Shipped-version release doc."
4. [ ] Update `CLAUDE.md` to add a one-line note marking `_attic/` as frozen-grandfather (pre-2026-05-28 retirements).
5. [ ] Rename `planning/phase-3-items/` → `planning/initiatives/phase-3/`. Update `planning/phase-2-scenario-strategy.md` cross-references if any point at `phase-3-items/`.
6. [ ] Apply the atomization-trigger broadening (separate edit, not part of this ADR): DEV-PATTERN.md § Atomize big plans line 190, `skills/tidy/workflow.md` finding #7, `skills/orient/workflow.md` drift row line 38.
7. [ ] `orient` drift check gains a row at v0.1-ship time: "any `{dir}/archive/` not wrapped into `archive/v0.1/` after RELEASES.md marks v0.1 shipped." Deferred — add at the next `orient` workflow edit.
8. [ ] JOURNAL.md entry on ratification: "Ratified ADR-25: directory-local archives + planning/initiatives/."
9. [ ] At v0.1 ship: wrap each `{dir}/archive/` into `{dir}/archive/v0.1/`. Add a row per dir to `planning/RELEASES.md`. Deferred to ship day.
