---
purpose: Provenance for b1-primitives-sequence.md (drafted + retired in the same session 2026-05-28).
layer: how
status: archived
retired_from: planning/bundles/b1-primitives-sequence.md
---

# b1-primitives-sequence.md — drafted + retired same-session

## What's here

`b1-primitives-sequence.md` — an 8-scenario (F030–F037) sequence doc drafted earlier in this 2026-05-28 PM session, before the PM noticed `planning/phase-2-scenario-strategy.md` (drafted 2026-05-27) was a more detailed 14-scenario plan that already addressed the same problem.

## Why archived

PM call 2026-05-28 (mid-session). When the PM asked for the "new plan" replacing the archived `rebuild-plan.md`, this agent drafted an 8-scenario sequence consolidating use-cases.md MVP rows into roughly one F-number per row. Mid-archival, the agent surfaced the existence of `phase-2-scenario-strategy.md` (a 14-scenario strategy from yesterday awaiting PM approval). PM directed: implement the existing strategy doc, not the new draft.

The 8-scenario draft bundled scenarios that the 14-scenario strategy deliberately split:

| 8-scenario bundling | 14-scenario splitting |
|---|---|
| F035 = Locally Owned + Locally Made (one scenario, both badges) | S7 (Sell walkthrough) + S8 (Locally Owned) + S9 (product composer) + S10 (Locally Made) — four distinct capabilities |
| F030 implicit Member page | S3 separate (Member public page + follow) |
| F030 implicit Group page | S6 separate (Group public page) |
| F030 includes service composer | S11 separate (Service composer) |
| No QR card scenario | S12 (QR card affordance) standalone |
| Per-scenario 90s timing | S14 (90-second integration test) standalone |

The strategy doc's `more scenarios, not fewer` directive (captured in its line 200) is consistent with PM's prior guidance.

## What this doc captured that survives

A few framings that may inform the strategy doc's promotion:
- ADR-24 as the substrate gate for the multi-Place awareness work — the strategy doc names ADR-24 ratification as an open item.
- Substrate-lane tickets framed as parallel tracks (S-metro, S-saved-search, S-jurisdictions) — the strategy doc names the substrate gates per-scenario; framing them as a separate parallel lane aligns with CLAUDE.md rule 14 (substrate lane).
- The "Wonder is OUT of b1" call — `use-cases.md` O4 is Deferred (b2+) so the prior `rebuild-plan.md` "Wonder ships at b1" commitment retires. The strategy doc's 14 scenarios do not include a Wonder composer.

## Don't cite this as live

Cite `planning/phase-2-scenario-strategy.md` (promoted to active 2026-05-28) for the Phase 2 scenario plan. The F030–F043 numbering in that doc is canonical; this draft's F030–F037 numbering does not match it.
