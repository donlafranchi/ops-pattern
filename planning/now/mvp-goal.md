---
id: how-mvp-goal
purpose: North-star definition of the b1 MVP — what it is, what "done" means, scope boundaries, build status, and the path there.
layer: how
status: active
---

# MVP Goal — b1 Primitives

> North-star doc. The scoping detail lives in [`bundle-1.md`](bundle-1.md); the build order lives in [`plan-b1-surface-sequence.md`](plan-b1-surface-sequence.md). This file is the one-page answer to "what are we shipping and how do we know we're done."

## What the MVP is

The smallest expression of the platform that proves the central hypothesis: **ordinary people will step forward where they live, and their neighbors will show up for them.** A coordination layer for a place, built on the four primitives ([`../../product/foundation/primitives.md`](../../product/foundation/primitives.md)). b1 ships the four primitives at their T1 scope plus the locality-first surfaces that let a newcomer find what's near them and a producer become findable. It is not the platform; it is the version of the platform that can teach us whether the platform is right.

## What "done" looks like

b1 is done when all 14 user-surface scenarios (F030–F043) are shipped and green, anchored by these concrete exit criteria:

- **Both journeys complete without getting stuck** (F043, the integration test): (1) signup → profile → locality → feed → host a gathering at a venue → land on a shareable public page; (2) signup → Sell → business Group → list a product → public page. The "<90 seconds" figure is a working smell, not a contract.
- **A no-login visitor** can browse the locality-first index and reach any public Item / Member / Group / Venue page.
- **Every b1 composer works end-to-end**: gathering (F034), product (F038), service (F040), business-Group Sell walkthrough (F036), each writing through named action handlers (no direct writes).
- **Following works** across Member, Group, and Venue, with a unified `/you/following` surface (F042).
- **Tier 0 locality badges** ("Claimed local owner," "Claimed locally made") set, edit, remove, and render conditionally on viewer proximity (F037, F039).
- **Behavioral metrics instrumented** (the real proof, not commerce volume): Item-creation rate across kinds, response rate (RSVP / follow / save / "I'd be in"), return-visit rate, cross-kind engagement.

## In scope

- **Four primitives at T1.** Person (profile, auth, privacy, DMs, follows, multi-Location affinities); Item in four kinds — `product`, `service`, `gathering`, `wonder`; Location (permanent / recurring-temporary / area); Group in all six kinds (`place`, `interest`, `practice`, `event_anchored`, `family`, `business`).
- **Locality-first index** across Items, Persons, Locations — filterable, no-login browseable.
- **Person→Item composers** with Location attachment and (where relevant) schedule.
- **Item response surfaces** (Follow / Save / RSVP / "I'd be in"), stored uniformly in `item_responses`.
- **Tier 0 self-attested locality badges** (Locally Owned, Locally Made).
- **Item-level QR card** affordance (F041).
- **The thesis page** — names the squeeze, the antidote, and the platform's commitments.

## Explicitly out of scope

- Offer / Ask / Initiative surfaces (schema reserved, not surfaced).
- Bulletin composer + push-to-followers (substrate at b1, surface at b2).
- Saved-search composer + fan-out worker (substrate at b1, surface at b2).
- Tier 1 (community-attested) and Tier 2 (document-supported) verification.
- Group composers for `place` / `interest` / `practice` / `family` kinds beyond schema.
- Follow streams, notifications, persistent activity feeds (stored, not surfaced).
- Payments / commerce rails — transaction stays off-platform.
- Reviews and star ratings (permanently deferred).
- Cooperative-style coordination (deferred until real-world need + explicit prioritization).
- Stewardship tooling; affinity-first Group discovery; the Cafe Capricho vacant-space case.

## Current build status

**Substrate — done.** Phase 0 (extensions + embedding floor) and Phase 1 (Members, Locations, action layer, Groups + Items substrate) shipped (T041–T064). The geography substrate sprint is complete and awaiting merge to main.

**Surfaces — in flight.** F036 (Sell walkthrough → business Group) is `building`: three of four tickets shipped (T070 schema/handlers, T071 multi-step composer, T072 add-entity drawer); **T073** (the walkthrough surface itself) is the open ticket.

**Remaining surfaces — backlog.** F030–F035, F037–F043 sit in `scenarios-backlog/` as drafts, none yet approved.

**Three substrate gates** must land before the scenarios they block open:
- **S-metro** — `metro_polygons` + `members.home_metro_id` (gates F031). Decision ratified; not built.
- **S-saved-search** — surface enablement for the "Follow this venue" CTA (gates F033, F042). Table exists; handlers/CTA not wired.
- **S-jurisdictions** — `member_business_jurisdictions` Tier 0 + proximity function (gates F037, F039). Columns partly shipped; table + function not built.

## The sequence to get there

Authoritative build order is [`plan-b1-surface-sequence.md`](plan-b1-surface-sequence.md). Approval order is dependency order — producer surfaces ship before consumer surfaces so the feed has content to display:

```
F036 (finish T073) → F038, F040 → F034 → F035 → F033 → F030 → F032
  → F042 → F037, F039 → F031 → F041 → F043 (integration test, gates b1 close)
```

When F036 fully lands, reconcile or retire the historical sub-bundle slicings (`bundle-themes.md`, `b1-primitives-work-map.md`) into this F-numbered sequence per the sequence doc's own follow-on note.

## Non-negotiables — every PR upholds

1. **The four primitives hold** — Person declares Item at Location; other Persons respond; People form Groups ([`../../product/foundation/primitives.md`](../../product/foundation/primitives.md)). Code reads like the grammar.
2. **No Business entity** — no `business_name` column on Members ([`../../product/foundation/primitives.md`](../../product/foundation/primitives.md) § Why no Business entity).
3. **Groups are emergent, optional, never auto-assigned** ([`../../product/foundation/primitives.md`](../../product/foundation/primitives.md) § Group).

Deviations from these escalate to the PM, not to the data model.
