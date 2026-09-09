---
id: what-use-cases
purpose: Real situations the platform exists to dissolve — not personas, actual local cases. The working test set for any feature.
layer: what
status: active
---

# Use cases

Real situations, drawn from Sacramento and the surrounding region, that the platform exists to dissolve. The Run Club exists. Ferrari Fisheries exists. Every scenario's capabilities trace back here. **MVP** ships at b1. **Deferred (b2+)** — problem statement is canon, design isn't finished. **Deferred (far horizon)** — out of scope for the foreseeable bundle plan, kept so the shape isn't forgotten.

## Roles — not account types, activities a Member takes on

**Member** — anyone: searches, browses, joins, follows, asks for help, offers it. **Producer** — a Member offering goods or services, spectrum from full professional to casual maker to unpaid steward; UI labels (Seller/Producer/Maker) vary, the role is one role. **Convener** — a Member who creates and runs a Group around a shared interest; coordination tools, not selling tools. Who the platform does *not* serve (corporate-shell franchise, rollup-acquirer, engagement-optimizer) is in `principles.md`.

## Consumer cases

- **C1 — MVP.** A newcomer sets their home locality and two interest tags and immediately sees a candidate feed of nearby things; follows a bakery's Page and a venue so they hear when either posts. This is the baseline member experience every other case builds on.
- **C2 — substrate MVP, surface b2.** A member tracks a concert series across a dozen parks metro-wide without following each one individually — the place hierarchy does the aggregation work so the member doesn't enumerate. A narrower "follow this venue" saved search is the deferred surface.
- **C3 — deferred (b2+).** Someone needs a plumber whose business is mostly word-of-mouth — existing tools (Yelp, Angi) charge for visibility and gate trust behind star ratings that hurt small operators. Blocked on a designed trust-signal layer, not on the Item shape.
- **C4 — deferred (b2+).** "I have extra zucchini" / "I need a truck for an hour" — give and take are one mutual-aid relationship in lived experience. Blocked on an unresolved reciprocity model (does the platform track balance, or stay pure gift-economy?).
- **C5 — deferred (b2+).** A buyer confirms a producer's Locally Made claim, or an established member vouches for a newcomer. Blocked on undesigned reputation discipline — how attestations age, whether they aggregate into a number (they must not, per the no-ranking-of-people corollary).
- **C6 — deferred (b2+).** People notice they're all looking for the same thing and want to find each other before any gathering exists to organize around. Stress-tests the "Groups cannot be auto-assigned" boundary — geography is a suggestion, never a placement.

## Producer cases

- **P1 — MVP, built.** Any small seller — a coffee shop, a jewelry maker, a piano teacher — creates a Page and lists what they sell. The baseline producer surface every richer case extends. A Member may also sell as an individual with no Page.
- **P2/bulletins — MVP, not yet built.** A bakery posts "Saturday 8–noon, fresh sourdough," or imports a linked social post as the bulletin body instead of writing twice. The bulletin substrate is what makes following meaningful — a follow with no delivery channel is a bookmark. Now scoped as F066.
- **P3 — MVP, partial.** Three flavors of variable cadence: a fisherman whose catch (and selling window) is irregular; a producer who shows up at a market some weeks, not on a published schedule; a food truck whose location changes by the day. The platform treats irregular and recurring as the same Item kind, varying only by schedule and location — that flexibility is what makes all three findable on one surface.
- **P4 — substrate MVP, badge UI deferred.** Locally Owned (does the money go to a local owner — self-attested ZIP) and Locally Made (was the product made here) are two separate badges, deliberately never collapsed — a Sacramento reseller of imported goods gets one, not both. Both store ZIPs and Places, never street addresses.
- **P5 — deferred (b2+).** A plumber whose only online presence is a Yelp page with three reviews from 2018 wants a page that reflects how real clients describe them. Blocked on the same undesigned trust-signal layer as C3/C5, plus a richer service-Item shape (service area, availability, pricing model).

## Organizer cases

- **O1 — MVP, built.** The Thursday Run Club at Drake's — currently findable only by being there. A public, locality-first page with a recurring schedule and one shareable URL replaces the three-app sprawl an organizer currently maintains for free. A Group only emerges if the regulars choose it.
- **O2 — MVP, partial.** A venue's own recurring program (Barn Movie Night at Drake's) becomes findable alongside every other nearby thing, not just to people already following that one venue on Instagram. Host is a Page, not an individual.
- **O3 — substrate MVP, surface b2.** A multi-venue series (Concerts in the Park, a dozen parks, a dozen independent hosts, no shared calendar) surfaces in one feed because place hierarchy and interest tags do the aggregation — no member subscribes to each park individually.
- **O4 — deferred (b2+).** Someone's thinking about a Sunday coffee walk and doesn't want to commit to hosting before they know anyone would come. This is Wonder (Loop 2) — the signaling mechanic and the tipping-point conversion into a real gathering aren't designed yet, though the Item kind exists.
- **O5 — deferred (b2+).** A community garden lead coordinating volunteer plots and watering rotations, a tool-library volunteer tracking checkouts. Needs shared schedules and inventory tracking beyond a plain Group — the minimum-viable steward toolkit isn't scoped.
- **O6 — deferred, far horizon.** A beloved local cafe closes; someone in the neighborhood would take it over but lacks capital or certainty the community would back them, and dozens of regulars would back a successor if they could find them. Needs the Initiative + Pledge primitive, a platform/financing boundary (a CDFI partner picks up where pledging ends), and the trust signals from C5 — none of which exist as designs. Kept in the canon because it's load-bearing for the platform's long-term thesis; no build-pipeline work attaches until the prerequisite cases land.

## What success looks like

Every MVP case ends in a recurring relationship, not a one-off transaction — the newcomer at a venue's event becomes a regular, then hosts something themselves; a producer's followers come back when the next batch is ready. The deferred cases extend the same shape into territory the platform isn't ready to serve yet: a person, declaring a thing, at a place — and other people responding, returning, and over time taking on more of the work themselves.
