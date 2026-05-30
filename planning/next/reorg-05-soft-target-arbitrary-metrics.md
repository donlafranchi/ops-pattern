---
purpose: Mark arbitrary numeric metrics in specs as soft/illustrative — do not enforce thresholds or remove the numbers.
layer: how
status: ratified
source: housekeeping/2026-05-28-repo-reorg/items/05-flag-arbitrary-metrics.md (original — formal flag-in-pending-ratifications; PM softened 2026-05-30)
risk: low
---

# Soft-target arbitrary metrics

## PM ratification — 2026-05-30

The metrics ("create an Item in <90 seconds", "up to 5 secondary Places", "~50 active-member natural group size") are examples, not contracts. They were never load-bearing decisions; the PM doesn't yet have evidence for what the right numbers are. Three calls:

- **Keep the numbers** — they're useful as concrete targets to design against.
- **Mark them as soft / illustrative** — annotate inline at each citation site that the number is a working example, not a measured target, and that overage isn't a failure condition.
- **No new tracking doc** — the original stub proposed adding entries to `pending-ratifications.md`. That doc is now archived (2026-05-30) and the PM doesn't want to revive a parallel tracker. Each metric lives at its citation site with its soft-target annotation; nothing else.

## Actions

For each metric, add one short inline note at the citation site:

| Metric | Where | Annotation |
|---|---|---|
| "create an Item in <90 seconds" | `_inbox/b1-primitives-sequence.md` (and wherever F043 ends up if it carries the test) | "Soft target — working example, not a contract. The real test is *no one gets stuck*." |
| "up to 5 secondary Places" | ADR-21 (or its pattern-entry successor), `product/systems/member.md` | "Soft target — tunable default at the action layer. Cap exists to bound surface area, not as a measured optimum." |
| "~50 active-member natural group size" | `product/foundation/design-philosophy.md` (will be `community-health-rubric.md` after reorg-02 ships) | "Cites Dunbar as a working order-of-magnitude. Soft target — no enforcement, no flag if a Group grows past it." |

## Side effects

- No new tracking doc, no `pending-ratifications.md` revival.
- The annotations make every metric self-describing — a future reader sees the soft-target framing at the citation site without needing to chase a separate file.
- Coordinate with reorg-02 (rename `design-philosophy.md` → `community-health-rubric.md`) — apply the annotation to whichever filename is current when this executes.

## Risk

Low. Documentation-only inline notes. No schema, no code, no removal of existing numbers.

## Source

Housekeeping reorg item 5. PM softened the scope 2026-05-30: metrics stay, get annotated as soft, no separate tracker.
