---
id: how-stewardships
purpose: Phase 3 item stub — the stewardships surface (group_stewardships schema delta + steward tooling).
layer: how
status: stub
---

# Phase 3 — Stewardships surface

## What this is

The set of tools a community steward needs to keep an ongoing operation alive — a community garden lead, a tool library volunteer, a repair-café organizer. Goes beyond what a Group with members can do: schedules, shift sign-ups, inventory tracking, optional dues, stewardship rotation.

## Where it came from

- Archived [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) — referenced as "stewardship rotation, capital-flow surfaces" deferred to b2/b3.
- [`use-cases.md` O5](../../product/needs/use-cases.md#o5-a-community-steward-keeps-an-ongoing-operation-alive) — Status: **Deferred (b2+)**. Open question: minimum-viable steward toolkit.
- [`phase-2-scenario-strategy.md`](../phase-2-scenario-strategy.md) line 262 — names stewardships as a Phase 3 surface needing its own strategy pass.
- `product/systems/stewardships.md` — system spec exists (referenced from `use-cases.md` O5).

## Rough shape

A large item — likely multiple scenarios when atomized. Candidate sub-pieces:

- **Stewardship schema delta** — `group_stewardships` table (per `stewardships.md` spec); reserved at b1 perhaps; surface b2.
- **Shared schedules / shift sign-ups** — for volunteer rotations (community garden watering, tool-library hours).
- **Shared inventory** — tool library checkouts/returns, seed library, equipment condition.
- **Optional dues collection** — low-stakes, not the Cafe Capricho capital-structure flavor (that's far-horizon O6).
- **Stewardship rotation** — handing the steward role between members (per `groups.md` lifecycle).
- **Curated stewardship templates** — the seven from the `b1.6-stewardship` sub-bundle theme (if still load-bearing).

## Depends on

- O5 design pass — the deferral statement names "the minimum-viable steward toolkit (which subset of schedules / inventory / shift-signup / dues lands first) is the open question."
- A real Sacramento community garden / tool library / repair café walked through end to end (O5 deferral criterion).
- b1 Group substrate (already shipped) — kind='practice' Groups in particular.
- `stewardships.md` system spec — needs review to confirm current shape matches Phase 3 thinking.

## Advance this by

1. PM call: walk a real Sacramento steward case (garden, tool library, repair café) end to end. Use it to pick the minimum-viable toolkit.
2. Decide the substrate vs. surface split — is `group_stewardships` shipped at b1 substrate-only (like saved-search), or only when the surface lands?
3. Likely atomize this stub further once the design pass starts — each of the 6 candidate sub-pieces above probably becomes its own stub or scenario.
4. Decide ordering relative to other Phase 3 items — stewardships likely lands after `/g/new` (community-kind Group create) since you need a Group to steward.
5. Promote individual sub-pieces to `planning/scenarios-backlog/F###-*.md` via `scope` once the toolkit is named.

## Out of scope for this stub

- The Cafe Capricho case (O6) — that's far-horizon (Initiative + Pledge + financing boundary). Stewardships are the operational-tooling layer, not the capital-structure layer.
- Federation between stewarded Groups (Loop 13) — separate concern, far-horizon.
- Cooperative governance tooling (voting, treasury) — deferred indefinitely per `groups.md`.
