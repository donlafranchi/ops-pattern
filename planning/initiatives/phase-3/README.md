---
purpose: Index for Phase 3 item stubs — each is a standalone small plan extracted from the archived rebuild-plan and the Phase 2 strategy doc's Out-of-Scope list.
layer: how
status: active
---

# Phase 3 Items

> Phase 2 is sequenced + scenarioed ([`../phase-2-scenario-strategy.md`](../phase-2-scenario-strategy.md), F030–F043). Phase 3 is not. Rather than carry Phase 3 inside a half-completed bigger plan, each Phase 3 item lives here as its own small artifact — pick one up, ratify it, plan it, ship it, archive it. Independent lifecycles.

## What's here

Nine candidate Phase 3 items, each in its own file. Each stub answers: what is this, where did it come from, what is its rough shape, what depends on it, what would advance it.

| Item | File | Rough size | Dependency on |
|---|---|---|---|
| No-login `/explore` (anonymous locality index) | [`explore-no-login-index.md`](explore-no-login-index.md) | medium | F030 (`/` feed exists), `discoverable_items` RLS for anon |
| `/g` Group browse index | [`group-browse-index.md`](group-browse-index.md) | small–medium | F035 (Group page exists), Groups populated |
| `/g/new` Group create flow (non-business kinds) | [`group-create-flow.md`](group-create-flow.md) | medium | F036 (kind='business' walkthrough as reference), groups.md role-per-kind validation |
| `/why` thesis page | [`thesis-page.md`](thesis-page.md) | small | content from `principles.md` + `use-cases.md` |
| Wonder kind composer | [`wonder-composer.md`](wonder-composer.md) | medium | `item_wonders` substrate (shipped Phase 1), use-cases.md O4 design pass |
| Wonder → Gathering / Initiative conversion stub | [`wonder-conversion.md`](wonder-conversion.md) | small | `items.parent_item_id` (reserved Phase 1), Wonder composer (above) |
| Onboarding Group-suggestion step | [`onboarding-group-suggestion.md`](onboarding-group-suggestion.md) | small | F030 (onboarding flow), F035 (Group page) |
| Saved-search composer + fan-out worker | [`saved-search-composer.md`](saved-search-composer.md) | medium | S-saved-search substrate (gates F033 + F042) |
| Stewardships surface | [`stewardships.md`](stewardships.md) | large | b1 Group substrate, design pass on use-cases.md O5 |

## How these were chosen

Each item appears either in the archived [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) Phase 3 section or in [`phase-2-scenario-strategy.md`](../phase-2-scenario-strategy.md) line 33–41 Out-of-Scope (Phase 3) list. The strategy doc said *"Phase 3 scenarios need a separate strategy pass"* — these stubs are the inputs to that pass.

## Status

All stubs are `status: stub`. None has been scoped or ratified. When PM picks one up:
1. Promote `status: stub` → `status: active` (or merge into a scenario set if appropriate).
2. Decide if it becomes an F### scenario, multiple scenarios, a substrate ticket, or a doc-only artifact (thesis page is doc-only).
3. Add a STAGE-LEDGER row when it transitions to `plan-backlog`.
4. When fully shipped: archive to `_attic/`.

## Phase 3 strategy doc — when

Phase 3 strategy can be drafted by walking these 9 stubs and applying the same dependency-ordering pattern used for Phase 2. The strategy doc would name: which stubs become single scenarios, which split, which fold together, the dependency chain, and the exit criterion. That work has not started.
