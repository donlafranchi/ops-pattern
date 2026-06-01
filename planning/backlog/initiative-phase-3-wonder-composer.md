---
id: how-wonder-composer
purpose: Phase 3 item stub — the Wonder kind composer.
layer: how
status: stub
---

# Phase 3 — Wonder kind composer

## What this is

A composer for `items.kind='wonder'` — declaring an idea publicly to test interest before committing to host. "I've been thinking about a Sunday coffee walk; would anyone come?" The "I'd be in" response substrate exists; the composer doesn't.

## Where it came from

- Archived [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) Phase 3 — *"Wonder kind composer (no schedule, no Location required). Posts from `/explore` ('Wonder if…' composer) and from `/you`."*
- [`use-cases.md` O4](../../product/needs/use-cases.md#o4-a-member-floats-an-idea-to-test-interest-before-committing-to-host) — Status: **Deferred (b2+)**. *"the Wonder Item kind exists in `primitives.md` but the signaling mechanic, threshold logic, and tipping-point conversion are not yet designed."*

## Status reconciliation

The archived rebuild-plan committed to shipping Wonder at b1. The current `use-cases.md` (restructured 2026-05-26) tags O4 as Deferred (b2+). The strategy doc dropped Wonder from b1 to match `use-cases.md`. **This stub treats Wonder as Phase 3 / b2+.** If PM wants Wonder back at b1, re-tag O4 in `use-cases.md` first; then this stub can promote.

## Rough shape

- Composer fields: title (the Wonder framed as a question or "I'd be in if…" statement), description, optional Place anchor (where would this happen?), optional interest tags. No schedule, no Location required.
- Entry points: `/explore` ("Wonder if…" composer), `/you` ("Float an idea"), possibly Group pages ("Wonder if our Group did…").
- Page: `/i/[wonder-slug-suffix]` (the Idea URL slot per `item.md` naming table) — title, description, "I'd be in" CTA, count of responses visible.
- Response substrate: `item_responses.response_kind='interest'` already exists (Phase 1).

## Depends on

- O4 design pass (deferred): signaling mechanic (how is "I'd be in" surfaced beyond a count?), threshold logic (what number tips a Wonder into action?), tipping-point conversion (Wonder → Gathering / Initiative).
- `item_wonders` child table (substrate exists per Phase 1: `interest_count`, `expires_at`, `conversion_target_kind`, `converted_to_item_id`).
- Conversion stub (separate stub — see [`wonder-conversion.md`](initiative-phase-3-wonder-conversion.md)).

## Advance this by

1. PM call: keep Wonder Phase 3 (current state), or pull back to b1 (re-tag O4 in `use-cases.md`)?
2. If Phase 3: walk the O4 deferral statement and answer the three open questions (signaling, threshold, tipping-point).
3. Decide: does Wonder need a "Wonder period" (e.g., visible for 30 days then auto-archives if no traction)?
4. Design the response affordance — "I'd be in" is the minimum; do we need richer signals ("I'd host this," "I could help organize," "Maybe / depends")?
5. Promote to `planning/backlog/scenario-F###-wonder-composer.md` once design questions resolve.

## Out of scope for this stub

- The conversion flow (Wonder → Gathering / Initiative) — separate stub (`wonder-conversion.md`).
- Wonder discovery surface (a dedicated `/wonders` feed) — likely subsumed by `/explore`.
- Wonder boost / promotion — out per `principles.md` (no paid placement).
