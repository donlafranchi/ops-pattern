---
name: pipeline-bundle-resync
description: Re-sync the bundle theme sequencer and the work-map against shipped reality. Use when the user says "resync the work map", "what's drifted since last sub-bundle", "is the work-map still right", "did anything shift after T###", "scope sync", "did the menu change", "what's next in b1.N", or at any sub-bundle close. Reads BUILD-LOG.md, development/tickets/done/, JOURNAL.md, DEVIATIONS.md, the active bundle file, bundle-themes.md, and b{N}-work-map.md. Writes re-tags / re-sequences / new entries to bundle-themes.md and the active work-map. Does NOT invent scope, write scenarios, write tickets, or redesign systems — only re-syncs the map against what the build process has revealed.
---

# pipeline-bundle-resync

Project-resident maintenance skill. Keeps `bundle-themes.md` (the sub-bundle sequencer) and `b{N}-work-map.md` (the menu of work per sub-bundle) honest against shipped reality. The planning tier writes these docs at the start of a bundle; the build tier reveals what actually happens. This skill is the closed loop.

## When to use

- **At sub-bundle close.** After the last ticket in a sub-bundle (e.g. `b1.3`) merges, before the planner starts writing scenarios for the next sub-bundle. Mandatory if the sub-bundle produced ≥1 DEVIATIONS.md entry.
- **After a DEVIATIONS.md entry lands.** Even mid-sub-bundle. A deviation is signal that the work-map under-predicted.
- **When the PM says "where are we" or "did anything shift."** Out-of-band sync.
- **Before scaling up.** Before writing scenarios for a new sub-bundle that depends on a sub-bundle that just shipped — confirm the work-map's dependency lines still match reality.

## When NOT to use

- Mid-ticket. Do not interrupt an open TDD loop.
- To rewrite scope. This skill re-tags and re-sequences items that exist in BUILD-LOG / DEVIATIONS / done-tickets. New scope comes from `pipeline-product`, not here.
- To resolve a design dispute. If the sync surfaces a structural disagreement, escalate to `pipeline-adr` or `pipeline-plan`.
- When the work-map and reality already match. CLEAN verdicts are common and the right outcome.

## Constraints (hard)

- Read-only on `product/`, `web/`, `development/tickets/` (incl. `done/`), `planning/scenarios/`. The skill consumes them; it does not modify them.
- Write only to `bundle-themes.md` and `b{N}-work-map.md`. One JOURNAL.md entry summarizing the sync.
- Never invent a work-map item. If a deviation reveals work not on the map, the skill *proposes* an entry; the PM ratifies before it lands.
- Never re-sequence past a hard dependency. If the dependency graph in `bundle-themes.md` says b1.4 depends on b1.2, the resync cannot reorder them — only the source-of-truth dependency claim can.
- Never alter the canonical-examples / loops / metrics gates for a theme. Those come from `pipeline-plan` and the foundation docs.

## Workflow

See `workflow.md`.

## Output — five verdicts

The skill closes with one of:

- **CLEAN** — predictions matched reality. No edits. Log a one-line JOURNAL entry confirming the sync ran.
- **RE-TAG** — one or more 🟢 / 🟡 / ⚪ assignments shifted. Update the work-map; log what moved and why.
- **RE-SEQUENCE** — a sub-bundle's order changed (e.g. Wonder moved from b1.5 → b1.3 once signup-to-first-action data showed friction). Update both `bundle-themes.md` and the work-map; log the move with rationale.
- **EXPAND** — work surfaced from a DEVIATION that needs a menu entry the work-map doesn't have. Propose the new line(s); PM ratifies before the skill writes them.
- **ESCALATE** — drift is structural enough to need an ADR (`pipeline-adr`), a system-spec change (`pipeline-product`), or a scenario re-write (`pipeline-plan`). The skill pauses and hands off.

## Related skills

- `pipeline-router` — orient before invoking; confirm no open phase is in flight.
- `pipeline-plan` — downstream when the resync produces an EXPAND or RE-TAG that creates new scenarios.
- `pipeline-product` — downstream when EXPAND requires a system-spec extension.
- `pipeline-adr` — downstream when ESCALATE produces a structural decision.
- `pipeline-prune` — analogous out-of-band pattern; runs against JOURNAL/DECISIONS, this runs against bundle-themes/work-map.

## Hand off

**You produced:** updated `bundle-themes.md` and/or `b{N}-work-map.md`, one JOURNAL.md entry summarizing the sync verdict and the changes. If verdict is EXPAND or ESCALATE, a hand-off note to the next skill.

**You hand to:** the PM. PM either accepts the sync as logged or routes the hand-off to the next skill.
