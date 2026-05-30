---
id: how-onboarding-group-suggestion
purpose: Phase 3 item stub — the onboarding Group-suggestion step.
layer: how
status: stub
---

# Phase 3 — Onboarding Group-suggestion step

## What this is

A step in the onboarding flow (or right after) where a new Member who has just set `primary_home` Place sees a small set of suggested kind='place' Groups whose `anchor_location_id` resolves to a Location inside that Place. One-tap join. Skippable; defaults to no memberships.

## Where it came from

- Archived [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) Phase 3 — *"Onboarding suggestion step — when a Member sets a `primary_home` Place, surface listed Groups whose `anchor_location_id` resolves to a Location inside that Place (or a child Place) with tap-to-join. Skippable; defaults to no memberships."*

## Rough shape

- Onboarding step (appended to F030's flow) or post-onboarding nudge ("You're in Oak Park — here are some Groups your neighbors are in").
- Surfaces ≤5 kind='place' Groups (or possibly kind='interest' / 'practice' Groups) whose anchor Locations are inside or proximal to the Member's `primary_home` Place.
- Tap-to-join writes `group_memberships(source='explicit')` per F042 / F035 mechanics.
- Skippable: "Skip" closes the step; no memberships written. Skip is one of the valid completions (per `groups.md` "Groups are emergent, optional, never auto-assigned").

## Depends on

- F030 (onboarding flow exists) — the suggestion step appends to or follows it.
- F035 (Group page exists) — destination of tap-through if a Member wants to read before joining.
- Groups populated in the Member's locality (kind='place' especially — these are the most natural suggestion candidates).
- A safe ranking algorithm — see "Open questions" below.

## Advance this by

1. PM call: which kinds get suggested? kind='place' alone, or include kind='interest' and kind='practice'?
2. Design the suggestion algorithm — straight membership count, or weighted by listed-vs-private, founder activity, recent gatherings, etc.? Watch for "popular gets more popular" anti-pattern.
3. Decide: tap-to-join writes `source='explicit'` (the Member did tap) — confirm this still honors the "never auto-assigned" boundary in `groups.md`.
4. Decide UI shape: dedicated onboarding step (extends F030), post-onboarding modal, or `/you` widget surfaced for the first N visits.
5. Promote to `planning/scenarios-backlog/F###-onboarding-group-suggestion.md` via `scope`.

## Out of scope for this stub

- Soft-membership inference based on follows or gathering attendance — explicitly excluded by `groups.md` "Groups cannot be auto-assigned."
- Affinity-first Group discovery (C6) — that's a separate use case (Deferred b2+ pending design pass on not violating the auto-assigned boundary).
- Inviting people to Groups (B inviting A) — separate stub if it ever lands.
