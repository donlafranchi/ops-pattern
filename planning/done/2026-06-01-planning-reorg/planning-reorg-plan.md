---
id: how-planning-reorg-plan
purpose: Step-by-step plan for Claude Code to collapse planning/ from 11 dirs to 4 Kanban lanes, atomize compound docs, and sweep all stale references.
layer: how
status: ratified-pending-execution
---

# Planning Dir Reorg — Implementation Plan for Claude Code

> Written by Cowork after a strategy conversation with the PM. Ratified on the call. This doc is the single source of truth for the reorg. CC executes; the PM ratifies each phase before the next begins.

## Goal

Collapse `planning/` from 11 directories to 4 Kanban lanes (`backlog/`, `next/`, `now/`, `done/`) while preserving the build firewall, atomizing legacy compound docs into lane-shaped work items, finishing the ADR → playbooks migration that was left half-done, and producing a one-page human-readable MVP scoreboard.

## End state

```
planning/
├── backlog/          # drafts + awaiting approval — replaces scenarios-backlog/ + proposed/ + later/
├── next/             # approved, gated for build
├── now/              # in flight
├── done/             # closed — replaces done/ + archive/, with dated subdirs YYYY-MM-DD-{slug}/
├── AGENT-BOUNDS.md   # stays
├── RELEASES.md       # stays
├── SPEC-PATCHES.md   # stays
└── STAGE-LEDGER.md   # stays
```

**Removed.** `bundles/`, `initiatives/`, `proposed/`, `later/`, `reviews/`, `scenarios/`, `scenarios-backlog/`, `archive/`, `DECISIONS.md` (after the ADR sweep), `producer-roadmap.md` (moves to `product/needs/`).

**Filename conventions inside the lanes.** Filename prefix carries kind:
- Scenarios: `scenario-F###-{slug}.md`
- Bundle overview: `bundle-N.md` (one slim overview per bundle)
- Bundle artifacts: `bundle-N-checklist.md`, `bundle-N-themes.md`, `bundle-N-sequence.md`
- Initiatives: `initiative-{name}.md` or `{name}-{slug}.md` for child items
- Reviews: `review-F###.md` (lives alongside its scenario in the same lane)
- Decisions awaiting `weigh`: `decision-{slug}.md`
- Generic work items: free-form descriptive name (e.g., `mvp-goal.md`)

## The one firewall to preserve

`build` cannot read `backlog/`. Every other lane boundary is PM-driven, not pipeline-enforced. Skill workflow updates in Phase 3 encode this.

## Sequencing

Phases 1, 2, and 3 each contain agents that run in parallel within the phase. Phases run sequentially. Phase 4 is one agent, sequential. The PM ratifies after each phase before the next opens.

---

## Phase 1 — Move content into new structure (parallel, 5 agents)

Spawn five agents in one message. Each owns a disjoint file set; no conflicts.

### Agent A — scenarios + reviews

- Create `planning/backlog/`, `planning/next/`, `planning/now/`, `planning/done/` if not already present.
- For each `F###-{slug}.md` in `planning/scenarios-backlog/`: copy to `planning/backlog/scenario-F###-{slug}.md`. Content unchanged.
- For each `F###-{slug}.md` in `planning/scenarios/`: route by current stage in `STAGE-LEDGER.md`:
  - `building` → `planning/now/scenario-F###-{slug}.md`
  - `plan-approved` or `reviewed` → `planning/next/scenario-F###-{slug}.md`
- Move `planning/reviews/F###-review.md` files alongside their scenario (same lane as the scenario they review).
- Verify file counts before/after match.
- `rm -r planning/scenarios/ planning/scenarios-backlog/ planning/reviews/`

### Agent B — bundles

- Read `planning/bundles/b1-primitives-plan.md`, `b1-primitives-work-map.md`, `bundle-themes.md`.
- Write a new slim `planning/now/bundle-1.md` — 40–60 lines, sections: hypothesis, what's in scope (one sentence each), what's deferred, success metrics. Pull from `b1-primitives-plan.md` but keep it short — the scoreboard carries the per-feature detail.
- Move `bundles/bundle-themes.md` → `now/bundle-1-themes.md` (still load-bearing as the cross-bundle sequencer).
- Archive `bundles/b1-primitives-plan.md` and `bundles/b1-primitives-work-map.md` to `done/2026-06-01-bundles-atomized/` with a `RETIRED.md` noting the atomization target.
- Move `bundles/archive/*` contents to `done/` preserving their existing dated-subdir structure.
- `rm -r planning/bundles/`

### Agent C — initiatives

- For each file in `planning/initiatives/phase-3/`: move to `planning/backlog/initiative-phase-3-{slug}.md` (preserve content; rename for kind-prefix consistency).
- Read `initiatives/README.md`; if it carries unique context (not just an index), distill into `planning/now/initiative-phase-3.md` as the overview. Otherwise archive to `done/`.
- `rm -r planning/initiatives/`

### Agent D — proposed + later

- `proposed/F018-flagship-decision.md` → `backlog/decision-F018-flagship.md`. (PM will route through `weigh` separately.)
- `later/reorg-03-restructure-bundles-pending-pattern-shift.md` → `done/2026-06-01-reorg-superseded/` (the pattern shift this was waiting on is this very reorg; the item is closed).
- `proposed/README.md` → delete (stub).
- `rm -r planning/proposed/ planning/later/`

### Agent E — producer-roadmap + done/archive collapse

- Move `planning/producer-roadmap.md` → `product/needs/producer-roadmap.md`. (Content is a system-capability taxonomy, belongs in product/.)
- For each dated subdir in `planning/archive/`: move to `planning/done/{same-name}/`.
- For each loose file in `planning/archive/`: move to `planning/done/`.
- `rm -r planning/archive/`
- Move existing `planning/done/reorg-12-yaml-doc-ids.md` to `planning/done/2026-05-30-reorg-yaml-doc-ids/` (wrap loose files in dated subdirs for consistency).

### Phase 1 verification (PM ratifies before Phase 2)

```bash
ls planning/  # should show: backlog/ next/ now/ done/ + 4 root .md files
find planning/scenarios planning/scenarios-backlog planning/bundles planning/initiatives planning/proposed planning/later planning/reviews planning/archive 2>/dev/null  # should return nothing
ls product/needs/producer-roadmap.md  # should exist
```

---

## Phase 2 — Verify the scoreboard (1 agent)

### Agent F — scoreboard verification

The scoreboard is already pre-placed at `planning/now/bundle-1-checklist.md` (PM-ratified). This phase verifies, not creates.

- Re-check the checked / in-build / unchecked state against `STAGE-LEDGER.md` Features and Substrate tables — update if anything has shifted.
- Verify Markdown links resolve (`mvp-goal.md`, `../STAGE-LEDGER.md`, `plan-b1-surface-sequence.md`, `bundle-1.md`). Note: `bundle-1.md` is created in Phase 1 Agent B; the link only resolves after that phase completes.

---

## Phase 3 — Reference updates (parallel, 4 agents)

Spawn four agents in one message. Each owns a disjoint cite pattern.

### Agent G — ADR cite sweep (the unfinished migration)

- Find every ADR cite in active docs: `grep -rn "planning/adrs/\|ADR-[0-9]" --include="*.md" .` and filter out `_attic/`, `planning/done/`, `.claude/worktrees/`, `development/tickets/done/`.
- For each cite: open the file, read context, rewrite to the appropriate target:
  - Cross-cutting platform decisions → `playbooks/PLATFORM-PATTERNS.md` (specific section if cited)
  - How-we-build decisions → `playbooks/DEVELOPMENT-PATTERNS.md`
  - Reversal-of-a-prior-decision memos → `playbooks/memos/memo-####-{slug}.md`
- Map needed: ADR-N → playbook section. Read `playbooks/PLATFORM-PATTERNS.md` and `DEVELOPMENT-PATTERNS.md` first to build the mapping; cache it.
- Touch list will include (~30 files): `CLAUDE.md`, `MAP.md`, `REGISTRY.md`, `planning/AGENT-BOUNDS.md`, `planning/STAGE-LEDGER.md`, `planning/SPEC-PATCHES.md`, `web/BUILD-LOG.md`, scenarios (now in `backlog/` / `next/` / `now/`), system specs (`product/systems/*.md`), capabilities (`product/capabilities/*.md`), the new `bundle-1.md`, `mvp-goal.md`, `plan-b1-surface-sequence.md`, etc.

### Agent H — old planning/ path sweep

- Find every cite to retired paths: `grep -rEn "planning/(scenarios-backlog|scenarios|bundles|initiatives|proposed|later|reviews|archive)/" --include="*.md"`.
- For each cite: rewrite to the new lane location. Heuristic by context:
  - `planning/scenarios-backlog/F###...` → `planning/backlog/scenario-F###-...`
  - `planning/scenarios/F###...` → `planning/now/scenario-F###-...` or `planning/next/scenario-F###-...` (check current stage in `STAGE-LEDGER`)
  - `planning/bundles/b1-primitives-plan.md` → `planning/now/bundle-1.md`
  - `planning/bundles/bundle-themes.md` → `planning/now/bundle-1-themes.md`
  - `planning/bundles/b1-primitives-work-map.md` → cite the new `bundle-1-checklist.md` if it's a scoping-of-work cite; otherwise cite the archived path under `done/`
  - `planning/initiatives/phase-3/{x}.md` → `planning/backlog/initiative-phase-3-{x}.md`
  - `planning/reviews/F###-review.md` → wherever the scenario lives (same lane), as `review-F###.md`
  - `planning/proposed/F018...` → `planning/backlog/decision-F018-flagship.md`
  - `planning/archive/...` → `planning/done/...` (path unchanged otherwise)

### Agent I — orphan-doc + DECISIONS sweep

- `grep -rn "planning/producer-roadmap.md" --include="*.md"` → rewrite to `product/needs/producer-roadmap.md`.
- `grep -rn "planning/DECISIONS.md" --include="*.md"` → rewrite to `playbooks/PLATFORM-PATTERNS.md` (default) or `playbooks/DEVELOPMENT-PATTERNS.md` (if context is build-time). `DECISIONS.md` was already a 10-line redirect stub; its only purpose was keeping these links alive.
- After all cites are rewritten: delete `planning/DECISIONS.md`.

### Agent J — skill workflow path updates

For each pipeline skill, read and update `skills/{skill}/workflow.md` (and `SKILL.md` if it carries path strings):

- `build/workflow.md`: read-set `planning/scenarios/` → `planning/next/scenario-*.md` AND `planning/now/scenario-*.md`. Backlog firewall: cannot read `planning/backlog/`. Update any DEVIATIONS-write or commit-message templates referencing old paths.
- `ticket/workflow.md`: read-set `planning/scenarios/` + `planning/reviews/` → `planning/next/scenario-*.md` + `planning/now/scenario-*.md` + `planning/now/review-*.md`. Write-set `development/tickets/` unchanged.
- `scope/workflow.md`: write-set `planning/scenarios-backlog/` → `planning/backlog/scenario-*.md` (drafts). Promote action: move file from `backlog/` → `next/` (rename pattern unchanged; lane changes).
- `review/workflow.md`: write-set `planning/reviews/F###-review.md` → `planning/{same-lane-as-scenario}/review-F###.md`.
- `atomize/workflow.md`: input `_inbox/` unchanged; output `planning/proposed/` → `planning/backlog/`.
- `orient/workflow.md`: drift check needs new dir layout. Update the checklist of "empty `scenarios/` with live ticket refs" etc.
- `tidy/workflow.md`: knows about lane layouts — update the "what lives where" map.
- `weigh/workflow.md`: any cites to `planning/proposed/` for decision items → `planning/backlog/decision-*.md`.
- `memo/workflow.md`: probably untouched (memos write to `playbooks/memos/`), verify.
- `explore/workflow.md`: probably untouched, verify.
- `test/workflow.md`: probably untouched, verify.

### Phase 3 verification (PM ratifies before Phase 4)

```bash
# Should return zero matches in active docs (allow hits in _attic/, planning/done/, .claude/worktrees/, development/tickets/done/):
grep -rEn "planning/(adrs|scenarios-backlog|scenarios|bundles|initiatives|proposed|later|reviews|archive|DECISIONS\.md|producer-roadmap\.md)" --include="*.md" . | grep -v "_attic\|planning/done\|\.claude/worktrees\|development/tickets/done"
```

---

## Phase 4 — Update controlling docs (sequential, 1 agent)

### Agent K — CLAUDE.md + AGENTS.md + STAGE-LEDGER.md + cleanup

- **CLAUDE.md naming table:** replace the dir-status rows with the new 4-lane shape. Drop entries for `bundles/`, `initiatives/`, `proposed/`, `later/`, `reviews/`, `scenarios/`, `scenarios-backlog/`, `archive/`. Add a "filename prefix carries kind" subsection.
- **CLAUDE.md project-specific authoritative docs table:** update paths for `bundle-1-plan` etc. Add a row for `planning/now/bundle-1-checklist.md` ("the MVP scoreboard — glance at this on Monday morning"). Add `product/needs/producer-roadmap.md`.
- **CLAUDE.md rebuild-phase rules:** rule 7 currently says "build cannot read `planning/scenarios-backlog/`" — update to "build cannot read `planning/backlog/`." Same firewall, new path.
- **AGENTS.md:** any skill read/write firewall mentions get new paths. Lane semantics rather than entity-dir semantics.
- **STAGE-LEDGER.md:** the Stage enum table currently says "Scenario in `planning/scenarios/`" — update to "Scenario in `planning/next/`." `plan-backlog` → "Scenario drafted in `planning/backlog/`." Schema otherwise unchanged.
- **MAP.md, TRACE.md, REGISTRY.md:** path-string sweep for any stale cites.
- Delete `planning/DECISIONS.md` (last reference was retired in Phase 3 Agent I).
- Run `orient` drift check to surface any missed cites. Re-run Phase 3 verification grep.

---

## Commit choreography

Per `CLAUDE.md` § Commit Rules, this work touches the parent repo (not `web/`). One commit per agent per phase, with subject `docs(pipeline): {what}`. Examples:

- `docs(pipeline): collapse scenarios into kanban lanes`
- `docs(pipeline): atomize bundles into now/bundle-1.md + done/`
- `docs(pipeline): finish ADR → playbooks migration`
- `docs(pipeline): update skill workflows for lane-based paths`
- `docs(pipeline): update CLAUDE.md naming table for 4-lane shape`

Lock pre-flight (`clearlock` check from CLAUDE.md) before each commit.

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Reference rewrite misses a cite | Phase 3 verification grep is exhaustive; re-run after Phase 4. |
| Wrong scenario routed to `next/` vs `now/` in Phase 1 Agent A | Use `STAGE-LEDGER.md` as the source of truth; verify per scenario. |
| Skill workflow update breaks an in-flight ticket | T073 is the only open ticket; check `build` skill changes against T073's expected paths before commit. |
| ADR cite that points to a section number that doesn't exist in playbooks | Agent G builds the ADR-N → playbook-section map first (read playbooks before rewriting). If a section is missing, leave a TODO comment in the citing file and surface to PM. |
| File-move race: two agents touch the same file | Phase 1 agents are scoped to disjoint dirs. No overlap. |
| Cite to a moved scenario in a doc owned by another agent's scope | Phase 3 runs AFTER Phase 1, so all moves are settled before reference rewrites begin. |

## What this plan deliberately does NOT do

- Does not route `decision-F018-flagship.md` through `weigh`. That's a PM-driven follow-up after the reorg lands.
- Does not write a new `bundle-1.md` overview from scratch — it pulls from the existing `b1-primitives-plan.md`. Editorial pass is a PM follow-up if desired.
- Does not modify `web/` repo. All changes are parent-repo only.
- Does not delete the legacy bundle docs outright — they archive to `done/` with provenance so the trail survives.
- Does not collapse `next/` into `now/`. The PM's preference is to keep all four lanes.

## Success criteria

1. `planning/` shows 4 lanes + 4 root files; no other dirs.
2. The Phase 3 verification grep returns zero matches in active docs.
3. `planning/now/bundle-1-checklist.md` exists, renders cleanly, and uses human terms (no F### / T### in body).
4. `build` skill workflow reads from `next/` and `now/`, not from `backlog/`.
5. `orient` drift check passes.
6. The PM can answer "what's left in the MVP?" by reading one page.
