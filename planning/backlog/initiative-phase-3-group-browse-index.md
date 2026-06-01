---
id: how-group-browse-index
purpose: Phase 3 item stub — the `/g` Group browse index.
layer: how
status: stub
---

# Phase 3 — `/g` Group browse index

## What this is

A public index at `/g` listing Groups, filterable by anchor Location, kind, follow-graph proximity, and size. The companion to F035 (Group public page) — F035 is the read surface for one Group; `/g` is the read surface for many.

## Where it came from

- Archived [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) Phase 3 — *"`/g` — Group browse index. Filterable by anchor Location, kind, follow-graph, size."*
- [`phase-2-scenario-strategy.md`](../done/2026-05-30-phase-2-historical/phase-2-scenario-strategy.md) line 36 — *"Out of scope (Phase 3): `/g` browse index + `/g/new` Group create flow (non-business)"*.

## Rough shape

- URL: `/g` — top-level, optional `?place=&kind=&size=` query params for filter state.
- Lists: kind chip + name + anchor Location + member count + brand label (for kind='business' Groups).
- Filters: kind enum (`place` / `interest` / `practice` / `event_anchored` / `family` / `business`), anchor Location radius, member-count bucket.
- Default scope: locality-aware (filter to Groups whose anchor Location resolves to the viewer's place-interest set).
- Auth-optional: anonymous browsing allowed; sign-in CTA inline; sign-in unlocks Join CTAs on individual Group pages (F035).

## Depends on

- F035 (Group public page) — destination of every row in the index.
- Groups populated enough to be worth indexing (b1.x shipped substrate; F036 + F031 + Phase 3 group-create-flow will populate over time).
- `groups.discoverability='listed'` filter — Groups marked `unlisted` / `private` don't appear.

## Advance this by

1. PM decides: one F### scenario covering all six kinds, or split (e.g., business Groups index separate from community-kind index)?
2. Decide whether anonymous viewers see all Groups or only listed kind='business' (a stricter anti-Nextdoor stance) — design call.
3. Decide the default sort: alphabetical, newest, most-active, or locality-distance.
4. Folds together with Phase 3 `/g/new` group-create-flow? — possibly; they're the two halves of "Group lifecycle" but can ship independently.
5. Promote to `planning/backlog/scenario-F###-group-browse-index.md` via `scope`.

## Out of scope for this stub

- Affinity-first Group discovery (showing "Groups you'd like to join" before joining) — that's [`use-cases.md` C6](../../product/needs/use-cases.md#c6-members-find-each-other-by-shared-interest-before-any-gathering-exists), Deferred b2+. Different scope.
- Group invitations or join requests — separate stub if it ever lands.
