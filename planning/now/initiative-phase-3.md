---
id: how-initiative-phase-3
purpose: Overview for the Phase 3 surface set — nine candidate items, each a standalone small plan now living as backlog stubs.
layer: how
status: active
---

# Initiative — Phase 3 surfaces

> Phase 2 is sequenced + scenarioed (F030–F043). Phase 3 is not. Rather than carry Phase 3 inside a half-completed bigger plan, each Phase 3 item lives as its own small artifact in `planning/backlog/` — pick one up, ratify it, plan it, ship it, archive it. Independent lifecycles.

## The nine items

Each stub answers: what is this, where did it come from, rough shape, what depends on it, what would advance it. All live in `planning/backlog/` as `initiative-phase-3-{slug}.md`.

| Item | File | Rough size | Dependency on |
|---|---|---|---|
| No-login `/explore` (anonymous locality index) | [`../backlog/initiative-phase-3-explore-no-login-index.md`](../backlog/initiative-phase-3-explore-no-login-index.md) | medium | F030 (`/` feed exists), `discoverable_items` RLS for anon |
| `/g` Group browse index | [`../backlog/initiative-phase-3-group-browse-index.md`](../backlog/initiative-phase-3-group-browse-index.md) | small–medium | F035 (Group page exists), Groups populated |
| `/g/new` Group create flow (non-business kinds) | [`../backlog/initiative-phase-3-group-create-flow.md`](../backlog/initiative-phase-3-group-create-flow.md) | medium | F036 (kind='business' walkthrough as reference), groups.md role-per-kind validation |
| `/why` thesis page | [`../backlog/initiative-phase-3-thesis-page.md`](../backlog/initiative-phase-3-thesis-page.md) | small | content from `principles.md` + `use-cases.md` |
| Wonder kind composer | [`../backlog/initiative-phase-3-wonder-composer.md`](../backlog/initiative-phase-3-wonder-composer.md) | medium | `item_wonders` substrate (shipped Phase 1), use-cases.md O4 design pass |
| Wonder → Gathering / Initiative conversion stub | [`../backlog/initiative-phase-3-wonder-conversion.md`](../backlog/initiative-phase-3-wonder-conversion.md) | small | `items.parent_item_id` (reserved Phase 1), Wonder composer (above) |
| Onboarding Group-suggestion step | [`../backlog/initiative-phase-3-onboarding-group-suggestion.md`](../backlog/initiative-phase-3-onboarding-group-suggestion.md) | small | F030 (onboarding flow), F035 (Group page) |
| Saved-search composer + fan-out worker | [`../backlog/initiative-phase-3-saved-search-composer.md`](../backlog/initiative-phase-3-saved-search-composer.md) | medium | S-saved-search substrate (gates F033 + F042) |
| Stewardships surface | [`../backlog/initiative-phase-3-stewardships.md`](../backlog/initiative-phase-3-stewardships.md) | large | b1 Group substrate, design pass on use-cases.md O5 |

## How these were chosen

Each item appears either in the archived `_attic/2026-05-28-rebuild-plan/rebuild-plan.md` Phase 3 section or in the Phase 2 scenario strategy's Out-of-Scope (Phase 3) list. The strategy doc said *"Phase 3 scenarios need a separate strategy pass"* — these stubs are the inputs to that pass.

## Status

All stubs are `status: stub`. None has been scoped or ratified. When PM picks one up:
1. Promote `status: stub` → `status: active` (or merge into a scenario set if appropriate). Move from `backlog/` to `next/` when build-gated.
2. Decide if it becomes an F### scenario, multiple scenarios, a substrate ticket, or a doc-only artifact (thesis page is doc-only).
3. Add a STAGE-LEDGER row when it transitions to `plan-backlog`.
4. When fully shipped: archive to `planning/done/YYYY-MM-DD-{slug}/`.

## Phase 3 strategy doc — when

Phase 3 strategy can be drafted by walking these nine stubs and applying the same dependency-ordering pattern used for Phase 2. The strategy doc would name: which stubs become single scenarios, which split, which fold together, the dependency chain, and the exit criterion. That work has not started.
