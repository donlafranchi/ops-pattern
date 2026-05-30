---
purpose: Provenance for files retired during the 2026-05-28 reorg execution.
layer: how
status: retired
retired_on: 2026-05-30
---

# Retired — 2026-05-28 reorg execution

Files moved here as the reorg items in `planning/next/reorg-*` execute.

## product-needs/ (reorg-01)

- `people.md` — Folded into the "Member roles" section at the top of `product/needs/use-cases.md`. The three-role frame (Member / Producer / Convener) and the types-to-design-for lists live there now.
- `needs.md` — Draft, never ratified. Every entry already traced back to `member-journey.md` + `use-cases.md`; no unique content lost.

Replacements live in `product/needs/use-cases.md` and `product/needs/member-journey.md`. The producer capability taxonomy moved to `planning/producer-roadmap.md` (it was a roadmap lens, not a human need).

## operations/ (reorg-07)

- `deploy-checklist-b1x.md` — b1.x substrate sprint M4 deploy checklist; sprint complete, merge landed. Kept for historical trace.

## product-exploration/ (reorg-07)

- `member-geography-redesign.md` — Exploration that drove ADR-21 (accepted). The substrate split between locally-owned and locally-made shipped; exploration concluded. Three open-question pointers from other docs ([`product/systems/item.md`](../../product/systems/item.md), [`planning/producer-roadmap.md`](../../planning/producer-roadmap.md), [`planning/scenarios-backlog/F039-producer-claims-locally-made.md`](../../planning/scenarios-backlog/F039-producer-claims-locally-made.md)) now point here as historical context.

## development/tickets/ shipped (reorg-07)

Eleven b1.x substrate + surface tickets moved from `development/tickets/` to `development/tickets/done/`: T054, T055, T056, T057, T058, T059, T060, T061, T062, T063, T064, T066. Commit hashes for T055/T056/T057 backfilled inline (web + parent).

## planning/bundles/ (reorg-07 — pre-existing)

The two named b1.x sprint files (`b1.x-substrate-sprint.md` + `b1.x-spec-drain-sprint.md`) were already at `planning/bundles/archive/` before this reorg ran; no move required.
