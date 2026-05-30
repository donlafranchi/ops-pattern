---
id: how-saved-search-composer
purpose: Phase 3 item stub — the saved-search composer surface + fan-out worker.
layer: how
status: stub
---

# Phase 3 — Saved-search composer + fan-out worker

## What this is

The b2 surface on top of the `member_saved_searches` substrate. F033 + F042 write default-labeled rows ("Follow this venue") via simple CTAs; this stub adds the freeform composer — pick a Place + interest tags + item kinds, name the search, save it, get notified when matching Items appear.

## Where it came from

- ADR-21 ratified the `member_saved_searches` substrate at b1; *"saved-search UI composer + fan-out worker — b2 surface, deferred."*
- [`use-cases.md` C2](../../product/needs/use-cases.md#c2-a-member-organizes-awareness-across-multiple-places) — MVP substrate; surface deferred to b2.
- [`use-cases.md` O3](../../product/needs/use-cases.md#o3-a-multi-venue-series-spans-places-and-members-find-it-via-awareness-feed) — Concerts-in-the-Park surface; *"a member who wants a narrower filter ('anything at Drake's') creates a `member_saved_searches` row via a 'Follow this venue' CTA (b2 surface)."* The CTA writes default-labeled at b1; the composer is the b2 surface.
- [`phase-2-scenario-strategy.md`](../phase-2-scenario-strategy.md) line 41 — *"Saved-search composer + fan-out worker (substrate only at b1)."*

## Rough shape

- Composer surface at `/you/saved-searches` (or similar): list existing rows + "New saved search" CTA.
- Composer fields: label (free text), Place (typeahead over `places` — optional), Location (typeahead over `locations` — optional), interest_tags (multi-select from controlled vocab), item_kinds (multi-select). Check constraint: at least one of place / location / interest_tags must be set (per ADR-21).
- Fan-out worker: background job (cron or event-driven) that, for each new `item.published` event, computes which saved-searches match and writes to a notification surface (or sends an email).
- Notification surface: a "Saved searches" digest in `/you` — most recent matches per saved-search, with "View all" expanding to a feed view.
- Email digest: opt-in, weekly default, frequency-tunable.

## Depends on

- S-saved-search substrate (gates F033 + F042 at b1; already substrate-ratified per ADR-21).
- F033 + F042 ship at b1 with the default-labeled "Follow this venue" CTA writing the substrate rows; this stub is the surface that lets the Member curate them.
- Email substrate (likely Resend or similar) — not yet specified.
- Notification surface design — adjacent to follow-stream notifications (also b2 per F032 / F042 Out of Scope).

## Advance this by

1. Design the notification model — in-app vs. email vs. both; default frequency; opt-in semantics.
2. Decide whether saved-search digest is a separate surface or folds into the awareness feed.
3. Specify the fan-out worker — sync vs. async, batching, retry semantics.
4. Decide whether anonymous saved-search (a saved-filter URL that any Member can subscribe to) is in scope — likely no (saved searches are private per ADR-21).
5. Promote to `planning/scenarios-backlog/F###-saved-search-composer.md` via `scope`.

## Out of scope for this stub

- LLM-enhanced natural-language saved searches ("anything within walking distance with live music") — that's b2+ per `discovery.md` T3.
- Sharing a saved-search definition with another Member — privacy-bounded; out.
- Saved-search rendering in the awareness feed itself — feed reads from `member_place_interests` × `member_interests`; saved-searches are an additional filter layer, not the primary feed.
