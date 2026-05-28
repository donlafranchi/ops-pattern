---
purpose: Provenance for the F025–F029 pre-rescope scenarios archived 2026-05-28.
layer: how
status: archived
retired_from: planning/scenarios-backlog/
---

# Pre-rescope scenarios — archived 2026-05-28

## What's here

Five scenarios drafted between 2026-05-12 and 2026-05-23, all in `planning/scenarios-backlog/` (never promoted to `planning/scenarios/`):

| Scenario | Drafted | Anchor |
|---|---|---|
| F025-adaeze-member-public-page.md | 2026-05-12 | Member.md (public page surface) |
| F026-maya-claims-locally-owned.md | 2026-05-23 | business-jurisdiction.md, groups.md; ADR-21 |
| F027-maya-claims-locally-made.md | 2026-05-23 | item.md Provenance, places.md; ADR-21 |
| F028-sam-lands-in-awareness-feed.md | 2026-05-23 | discovery.md, member.md, places.md; ADR-21 |
| F029-maya-manages-place-interest-scope.md | 2026-05-23 | member.md Place-interest scope; ADR-21 |

## Why archived

PM call 2026-05-28. The five scenarios were drafted against the post-ADR-21 substrate but **before** `use-cases.md` was restructured (2026-05-26) and **before** ADR-24 (metro polygons as discovery overlay) was drafted (2026-05-26).

Per PM direction: rather than audit each scenario against the new measuring stick and patch what's salvageable, the cleaner move is **start fresh** — write new scenarios against the rewritten use cases, sequenced by build dependency.

The new sequence ([`planning/bundles/b1-primitives-sequence.md`](../../planning/bundles/b1-primitives-sequence.md), F030–F037) covers the use cases these scenarios were trying to serve:

- F025 (Adaeze Member public page) → folded into F030 (P1) public Group page + F032 (C1) follow surfaces. Member public page surface is implicit in both; no standalone scenario needed at b1.
- F026 (Maya claims Locally Owned) → **F035** (P4 Tier 0 Locally Owned + Locally Made badges). Same scope, different anchoring (P4 use case spans both badges; F035 ships both as one scenario).
- F027 (Maya claims Locally Made) → **F035** (P4). Folded into F035 with F026.
- F028 (Sam lands in awareness feed) → **F036** (C2 multi-Place awareness). Awareness-feed onboarding is part of F036's `/you/locality` surface + the metro-polygon "wider scope" opt-in (per ADR-24).
- F029 (Maya manages place-interest scope) → **F036** (C2). Same `/you/locality` surface; F036 absorbs the management UI.

## Use-cases.md mapping

The new sequence is anchored to MVP-tagged rows of `use-cases.md` (restructured 2026-05-26). The five archived scenarios pre-dated that restructure. The mapping above reflects how their work folds into the new sequence — no functional loss, cleaner anchoring.

## Provenance — STAGE-LEDGER updates

STAGE-LEDGER.md row updates for these archives (handled in the same PM session):
- F025 → `deferred` (folded into F030 + F032; no standalone surface at b1)
- F026 → `deferred` (folded into F035)
- F027 → `deferred` (folded into F035)
- F028 → `deferred` (folded into F036)
- F029 → `deferred` (folded into F036)

## Don't cite these as live

Cite F030–F037 (in `planning/bundles/b1-primitives-sequence.md`) instead. The substantive work is preserved in the new sequence; these files are kept here for trace only.
