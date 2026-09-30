---
id: what-location
purpose: Permanent / recurring-temporary / area places — why Location carries no purpose of its own, and the accountable-participation commitment it encodes.
layer: what
status: active
---

# Location

A Location is the platform's record of one physical place where things happen — a name, a geography, an optional description, a creator-of-record. It carries no purpose of its own; purpose comes from the Items attached and the Pages anchored to it. Three kinds, fixed at creation, with no transitions: **permanent** (a fixed point — a shop, a park, a bar), **recurring-temporary** (a point that hosts activity on a cadence — a market booth, a bar where a run club meets), **area** (a Member-drawn polygon — a service radius, a custom delivery zone).

## What a Location deliberately is not

**Not a Page.** A neighbourhood park is a Location; the Group that gathers there is a different record that may anchor to it. People affiliate with Pages; they relate to Locations only through Items they create, Pages they join, and searches they save.

**Not recognized civic geography.** A city or county is a Place (`places.md`), platform-curated and infrastructural. An "area" Location is Member-declared and personal — a service radius is not the same kind of thing as the city of Sacramento, and conflating them would let a Member's polygon carry authority it shouldn't have.

**Not a complaint surface.** This is where the accountable-participation commitment takes its structural form: when messaging ships, it's scoped to Items or Pages only — not to a Location. No Location wall, no Location feed, no Location DM. The platform's answer to "I have a problem with this place" is to create an Item that leads a fix (a Wonder, an Initiative), not to open a channel for complaint.

**Not a Person.** A Member's home-location pointer is a soft default, not a stored address. A Member's actual geographic life lives across three purpose-owned, mostly-private substrates (seller locality, community-awareness scope, saved searches) — none of them a column on the Member row.

**Not auto-discovered.** No Location is pre-populated from Google Places, OpenStreetMap, or any third-party source at launch — every row exists because a Member added it. Pre-populating would make the map look filled-in on day one at the cost of every row being a third party's fact, inheriting their errors and their update cadence. The deliberate-presence guarantee (no auto-assignment, no scraped identity) is the same one every other primitive on this platform carries.

## Locations are not transferred, only claimed

The original creator of a Location record can't hand off maintainership at launch — a future claim flow lets another Member become the maintainer of an inactive record. This is deliberately conservative: a transfer flow is exactly the surface an adversarial actor uses to take over an established, trusted record with a plausible cover story. The cost of "creator can't hand off yet" is small; the cost of "anyone can claim Drake's by submitting a form" is large enough to corrupt the trust the whole locality index depends on.

## Address handling stays deliberately unambitious

Street addresses are free Member-authored text — not run through a geocoder, validated, or auto-corrected at launch. This keeps the platform out of the address-canonicalization business and avoids standing up a new sensitive, normalized-address dataset with its own privacy footprint. Revisit only if duplicate Location rows measurably degrade discovery, not preemptively.

## What this rules in and out

**Rules in:** a Location existing because a Member declared it exists; a personal address route through an "unlisted" location a stranger doesn't browse into, reached only via the Item that references it.

**Rules out:** a Location as an addressability surface of any kind. Coordinate drift without review — a small movement auto-applies, a large jump flags for re-confirmation, because a moved pin is either a legitimate fix or vandalism and the platform can't tell which from the delta alone. A `mobile` or `route` kind before a real case can't be modeled by the existing three — the enum stays narrow on purpose.
