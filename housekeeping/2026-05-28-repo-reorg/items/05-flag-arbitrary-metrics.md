---
purpose: Reorg item — flag arbitrary numeric metrics in specs as tunable or evidence-needed.
layer: how
status: stub
---

# Reorg Item 5 — Flag arbitrary metrics

## What this is

Some specs carry numeric metrics with no evidence (no user testing, no rationale documented). Flag each one in `pending-ratifications.md` so the PM can keep / soften / remove with intention.

## Actions

Add a `## Arbitrary metrics` section to `pending-ratifications.md` with:

| Metric | Location | Issue |
|---|---|---|
| "create an Item in <90 seconds" | `phase-2-scenario-strategy.md` (was also in archived `rebuild-plan.md`) | Arbitrary. No user testing. Replace with qualitative: "a new Member can sign up and create an Item without getting stuck or abandoning." Numeric target is the proxy, not the contract. |
| "up to 5 secondary Places" | ADR-21, `member.md`, archived `rebuild-plan.md` | Magic number. Why 5? Should carry rationale OR be flagged as a tunable default (action-layer enforced, no migration needed to change). |
| "k ≥ 10 anonymity floor" | `agent-assistance.md` | Already in `pending-ratifications.md` — confirmed; no new flag needed. |
| "90-day Delegation expiry" | `agent-assistance.md` | Already in `pending-ratifications.md` — confirmed; no new flag needed. |
| "~50 active-member natural group size" | `design-philosophy.md` (or `community-health-rubric.md` after rename) | Cites Dunbar but applies loosely. Flag as tunable. |

The first two (90-second composer + 5 secondaries) are new flags. The others are already tracked.

## Side effects

- F043 (90-second integration test scenario) carries the working-target note; the flag in pending-ratifications connects to that note explicitly so the metric has one canonical home.
- ADR-21 + `member.md` should reference the pending-ratifications entry for the 5-secondaries cap.

## Risk

Low. Documentation-only. No code or schema changes.

## Advance this by

1. PM ratifies the framing (working-target + qualitative test for 90s; tunable default for 5).
2. Add the two new entries to `pending-ratifications.md` § Arbitrary metrics.
3. Add cross-references from the source docs (F043, ADR-21, member.md) to the pending-ratifications entries.
4. Commit as `docs(reorg): flag arbitrary metrics in pending-ratifications`.

## Source

Reorg-plan.md §5.
