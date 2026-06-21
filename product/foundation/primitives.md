---
id: why-primitives
purpose: Defines the Person, Item, Location, and Group data spine.
layer: why
status: active
owns:
  - person-member-primitive
  - item-primitive
  - location-primitive
  - group-primitive
  - no-business-entity
---

# The Primitives

**Status:** Foundational north star. Defines the data-model spine that backs the loops in `member-journey.md` and is implemented across the system specs ([`member.md`](../systems/member.md), [`item.md`](../systems/item.md), [`location.md`](../systems/location.md), [`groups.md`](../systems/groups.md)).

## What this document does

The platform's many surfaces — Seller pages, service listings, gatherings, Group posts, Initiatives, Wonders, Offers, Asks — are surfacings of a small set of primitives, not separate systems. This document names those primitives, the relationships between them, and what their existence (and deliberate absence) means for what gets built and what doesn't.

The argument is structural: if the platform's surfaces are schematically similar but modeled as separate entities, the engineering will reproduce the fragmentation it should be erasing. One primitive set, varying by kind, is what lets the platform feel like one place instead of a suite of loosely joined apps.

## The primitives

Three core primitives carry every loop: **Person, Item, Location.** A fourth — **Group** — exists for the moments when a set of people decide they are an intentional, self-selected unit. Groups are emergent and optional: most loops work without them, and no Member is ever auto-assigned to one.

### Person

A real human. One record per human. Holds verbs (makes, services, convenes, stewards, initiates, follows, attends, encourages, pledges) rather than role-as-identity. A Person isn't *a Maker* or *a Service Provider* — a Person *makes things* or *offers services*, and those activities surface as Items they hold and (optionally) as memberships in kind='business' Groups they belong to.

Schema name: **Member** (per [`member.md`](../systems/member.md)). "Person" is the conceptual term; "Member" is the data-model term. Public-facing language is open and likely evolves with accumulation ("Member" → "Stakeholder" at T3).

### Item

Anything a Person declares: a product, a service, a recurring gathering, a Wonder, an Offer, an Ask, an Initiative. One schema, varying by `kind`. Each Item has its own page, URL, optional Location relationships, optional schedule, and a kind-specific response surface.

The Item primitive is what makes the platform's loops collapse from many systems into one — see [`item.md`](../systems/item.md) for the full spec.

### Location

A physical place. Three flavors: **permanent** (a shop, a home, a community garden), **recurring-temporary** (a market booth occupied Saturdays, a bar where the Run Club meets Thursdays), or **area** (a service radius, a neighborhood polygon). A Location is its own entity with its own page; it can host multiple Items across multiple Persons over time.

A market is a Location that hosts many Persons' Items on a recurring schedule. A bar is a Location that hosts a Run Club gathering on a recurring schedule. A maker's home is a Location where porch pickup happens. The same primitive across all three.

A Location is **not a Group.** West Sacramento is a Location of kind=area — a polygon, a name, a geometry. The West Sac school-parents Group is a different record entirely; Groups may anchor *to* a Location, they are never equal to it. People affiliate with *Groups*; they have *affinities* with Locations (live, work, play, visit, follow, liked — see [`location.md`](../systems/location.md)). The mistake of anonymous neighborhood feeds is not location memberships per se; it is location-scoped commenting/messaging where anonymity removes accountability and attracts complaint posts. The platform's structural response lives in messaging scope (item-or-group only, never Location-scoped), every action tied to a real identity, and complaint downvote/removal — not in the absence of Person-Location relationships.

> **Intent:** Treating a Location like a Group is the anonymous-complaint-feed failure pattern — geographic auto-inclusion creates a constituency the platform then has to moderate, and broadcast-to-everyone-in-the-polygon becomes the dominant verb. People *affiliate* with Groups (chosen, named, mutual); they have *affinities* with Locations (multi, soft, asymmetric). Two records exist precisely so the distinction is load-bearing in the schema — if a future proposal collapses them ("just give Locations a posts column"), the anonymous-complaint-feed surface returns by structure.

### Group

A named, intentional, self-selected set of Members organized to do things together on the platform. It is what a set of people *becomes* when they decide they are a unit — not before.

Groups are **emergent, not prerequisite. Optional, not assumed. Chosen, not assigned.** The Run Club at Drake's exists as a Gathering Item at a Location with a recurring schedule; nothing in the schema requires its regulars to also be a Group. They become one only if they choose to — by one of them creating it and the others joining. The Gathering Item keeps working unchanged.

**Six kinds at b1 (per [`groups.md`](../systems/groups.md)):** five **affiliate** kinds — `place` (the neighborhood school parents), `interest` (the sourdough nerds), `practice` (the Tuesday-night meditation circle), `event_anchored` (the cohort that formed around a specific Initiative or Gathering), `family` — and one **operate** kind — `business` (one or more Members operating commercially together, including sole proprietors). The operate/affiliate distinction is structural: `business` Groups carry operating-owner authority, money-flow semantics, and producer-capacity gating; affiliate Groups do not.

Where Group matters structurally:

- **Loop 11 (Pool resources).** Capital cannot be pooled by an ambient set; the pooling unit is a Group with identifiable members.
- **Loop 12 (Steward).** Ongoing care of a shared thing — a garden, a tool library, a building — requires a "we" with a record.
- **Producer capacity.** Members operating commercially do so via membership in a kind='business' Group (sole proprietors are kind='business' Groups of one). Producer-tier surfaces (producer-bulletin, producer-growth) gate on `member_has_standing_presence` which includes business-Group steward/owner status.
- **Addressable scopes.** Posting a Wonder, Offer, or Ask "to my school-parents group" needs a target. A query result is not a target.

Where Group does not matter — and the platform must work without it:

- **Loops 1, 3, 4, 7, 8, 9.** Items at Locations carry these. A Member with no Group memberships finds the Run Club, lists their service, follows a maker, and finds a plumber, all without ever joining anything.

A Group has a name, an optional Location anchor (geographic gravity, not a boundary — applies to `place` and `event_anchored` kinds especially), an optional parent Group (nesting, not control), a founder/creator (rotates to a steward role thereafter), and a discoverability setting (listed / unlisted / private). Members join and leave on their own. The platform never auto-assigns based on polygon — that is the explicit refusal of the anonymous-complaint-feed pattern.

A Group without Members ceases to exist (enters dormancy after the inactivity window, then archives). Members can dissolve a Group; a Group cannot dissolve a Member.

**Deliberately no separate Cooperative entity.** Cooperative-shape coordination — multiple owners, shared assets, distributed authority — is served at b1 by kind='business' Groups with multiple owner-role memberships. The platform does not model voting, distributions, or off-platform legal entity verbs. Those concerns are deferred until real-world cooperative operations create a clear need + the user explicitly prioritizes building them.

See [`groups.md`](../systems/groups.md) for the full system spec. Public-facing copy may use "community," "circle," "team," or "shop" interchangeably depending on Group kind.

## Why no Business entity

The data model deliberately does not include a Business entity, an Organization entity, or any corporate shell as a separate primitive between Persons and the things they declare. The closest construct is a kind='business' Group, which is itself a Group of Members — not a corporate record. This is structural, not an oversight:

> **Intent:** Strong-form rationale lives in [`principles.md`](principles.md); the local restatement here is what prevents future "but Items need to FK to *something* corporate for tax handling" proposals. Money flows are Member-to-Member (or Member-to-kind='business'-Group); tax surfaces are a federation handoff at Loop 13, not a schema fix. Whenever a feature seems to want a corporate row to attach to, the answer is: attach to the Member, or to the `kind='business'` Group of Members. Never to a shell.

- Maya doesn't *have* a business called Oak Park Sourdough as a separate record. *Oak Park Sourdough* is a kind='business' Group with Maya as the sole owner-role member. Her Items belong to her; the Group is the operating context she chose to declare.
- A cooperative bakery isn't a Business entity that owns Items. It is a kind='business' Group with multiple owner-role memberships, anchored to a Location, with Items declared by individual Members operating under the Group's branding.
- "Business name" on any surface is a Group label, not a separate record. The kind='business' Group's display name renders alongside the Member's handle on the producer-bulletin authorship line, on the Member's Seller page, and on Item pages where the Member chooses to credit the Group.

Three reasons this matters:

**It keeps the platform people-first structurally, not just rhetorically.** Every Item, every Gathering, every service traces to one or more Persons. There is no place in the schema for an LLC to obscure the human accountability of who is doing what — the Group is just a labeled set of Persons.

**It protects against the directory-of-companies failure mode.** Yelp, Angi, Google Business — these are directories of business records, where the Person doing the work is invisible behind a corporate listing. Building from People-and-Items (with Groups as the operating context where applicable) keeps the work visible to its source.

**It makes cooperative formation a first-class outcome rather than an afterthought.** When an Initiative produces a cooperative bakery, that bakery doesn't need to be modeled as a new entity type. It's a kind='business' Group whose Members collectively operate a Location producing Items. The data model already supports it; no new schema, no special-case "cooperative" entity.

The exception is **federated handoff**: at Loop 13 (per [`member-journey.md`](../needs/member-journey.md)), a community fund grows into a CDFI, a cooperative federation grows into a cooperative-services platform. Those external platforms have their own entities; this platform federates with them through identity and protocol, not by absorbing their data model.

## The relationships

The relationships between primitives are where the platform's behavior lives:

- **Person ↔ Item** — creates, holds, collaborates on, responds to (interest, follow, save, pledge, RSVP, purchase — kind-specific).
- **Item ↔ Location** — anchored at, with optional schedule (one-time, recurring, ongoing, by appointment).
- **Person ↔ Location** — as of 2026-05-23, Person-to-Location relationships flow through three purpose-owned substrates rather than a single multi-belonging affinity table. (1) **Locality default** — `members.home_location_id` (single column, soft pointer) carries the discovery locality default. (2) **Place-interest** — `member_place_interests` (one `primary_home` + up to 5 `secondary` Places per Member) carries community-awareness scope; private, owner-only RLS. (3) **Subscription** — `member_saved_searches` rows scoped to a `location_id` carry the "follow this venue" affordance and other location-shaped subscriptions; private, owner-only RLS. **None of these grant addressability** — no DM, feed, or wall is scoped to a Location (per the no-Location-messaging commitment in [`policy.md`](policy.md)). The structural accountable-participation commitment lives in messaging scope, every action tied to a real identity, and complaint downvote/removal, not in the absence of Person-Location relationships. The prior six-kind `member_location_affinities` table (`lives` / `works` / `plays` / `visits` / `follows` / `liked`) was retired because it fused three threads with different shapes; see [`member.md`](../systems/member.md) for the current substrate detail.
- **Person ↔ Person** — follows, messages, endorses (per [`member.md`](../systems/member.md) `member_follows` + `member_threads`).
- **Person ↔ Group** — founder of, steward of, owner of (kind='business'), member of. Soft affiliations are inferred (following, attendance) and surface-only; they are never written as full membership without consent. The role-per-kind matrix lives in [`groups.md`](../systems/groups.md).
- **Item ↔ Group** — optionally scoped to one Group. Most Items have none. An Item authored by a Member operating under a kind='business' Group can be branded with that Group's identity at render time.
- **Location ↔ Group** — Groups optionally anchor to a Location for geographic gravity (the `anchor_location_id` on the Group spine). Locations have no members; if you want members, you need a Group.

The relationship surface is intentionally flat. There is no Business that owns Items at a Location and employs Persons. There are Persons, the Items they hold, the Locations those Items attach to, and (optionally) the Groups those Persons join.

## How the 13 loops collapse

The 13 loops in `member-journey.md` collapse into four build clusters once they're restated in primitive terms:

### Cluster 1 — Standing presence

A Person declares a recurring or ongoing Item attached to a Location with a schedule. Covers Loop 1 (Find your people), Loop 4 (Gather regularly), Loop 7 (Make and be found), and Loop 9 (Find a local pro).

The Run Club organizer declaring "we meet Thursdays at Drake's" and Maya declaring "I sell sourdough at the Saturday market and from my porch on Tuesdays" are *the same data shape*: Person + Item + Location + recurring schedule. The differences (a baker vs. a runner, a market booth vs. a bar, goods vs. activity) are presentation variations, not schema variations.

This is the highest-leverage cluster to build first. One schema, one surface, one onboarding flow yields three of the most important loops.

### Cluster 2 — Call for response

A Person posts a kind-specific Item soliciting a kind-specific response from other Persons. Covers Loop 2 (Wonder), Loop 5 (Offer), Loop 6 (Ask), and Loop 10 (Initiative).

All four are "person posts an Item with a stated solicitation." The differences are which response verb the platform offers (*"I'd be in"* / *"I'll take it"* / *"I can help"* / *"I'll back this"*) and how much structure the response carries (Wonder is a tap; Initiative pledge has components). Same posting schema, four response semantics.

### Cluster 3 — Browse

A Person browses the locality-first index across Items, Persons, and Locations. Covers Loop 3 (Land here) and the consumption side of every Cluster 1 and Cluster 2 surface.

One index, multiple filters: kind, location, schedule, tags, distance. The same query infrastructure serves the newcomer browsing what's nearby, the Member looking for a plumber, the buyer searching for sourdough.

### Cluster 4 — Long-tail care

Persistence and ongoing-relationship primitives that sit on top of the other three clusters. Covers Loop 8 (Follow), Loop 11 (Pool), Loop 12 (Steward).

Follow keeps a Person-to-Person/Item relationship alive. Pool accumulates pledges toward an Initiative target. Steward maintains an owned Location/Item over time. None of these need to ship at MVP, but the event log entries that feed them must exist from day one.

**Loop 13 (Federate and spawn) is architectural rather than user-facing** — it's the boundary at which this platform hands off to dedicated, federated infrastructure (banking, insurance, intelligence). The handoff protocols are themselves a design surface, but they don't appear as a loop in the same sense the others do.

## What this means for what to build

**Build Cluster 1 first.** It's the highest-leverage thing on the board: one Item-plus-Location-plus-schedule schema yields Maker, Service Provider, AND recurring gathering, with surface variations for what the Item is. The Run Club doesn't need a new system — it's a gathering Item hosted by Persons at a Location with a recurring schedule. Same fields as a maker's market booth.

**Pair Cluster 1 with Cluster 3.** Once there are things in the index, browsing them is the natural complement. Build them together.

**Add one Cluster 2 verb.** Wonder is the strongest candidate — lightest activation energy, best demonstrates the agency thesis, and proves the response-surface architecture without the structural weight Initiative carries.

**Defer Cluster 4 entirely.** Follow, Pool, and Steward are real loops; they don't ship at v1. What ships at v1 is the *event log* that will eventually feed them — every interaction is captured from day one even if no surface uses it yet.

**Build the Item primitive seriously from day one.** The temptation will be to model a maker's products as fields on the maker profile, a gathering as fields on an organizer profile, a Wonder as a post type on the community. Don't. Items deserve their own first-class entity, with their own page, URL, Location attachments, and event log. The schematic similarity that makes the platform feel coherent depends on Items being a real primitive — not a concept that fragments back into per-feature tables.

> **Intent:** Modeling products-as-fields-on-Maker is the same pattern that produced the six separate legacy systems the rebuild exists to collapse. The Item primitive is what makes Maker, Run Club, Wonder, and Plumber share one set of code paths. Skipping it at MVP is a one-way ratchet — once per-feature tables exist, the platform can't unfork them without a migration. The cost of "this seems like overkill for v1" is paid once at v1; the cost of forking is paid forever.

## AI / LLM searchability

Every primitive should be queryable via natural language. A user should be able to ask the platform's chat surface things like:

- *"Who near me sells eggs from pasture-raised chickens?"*
- *"What's happening this week within walking distance that I could just show up to?"*
- *"Find me a plumber in Oak Park who works on weekends."*
- *"Which Initiatives in Sacramento are looking for capital?"*

For this to work, the primitives must be designed to embed and query well:

**Consistent structured fields per kind.** An LLM mapping "plumber on weekends" to a query needs predictable fields: `kind=service`, `category=trades`, schedule includes weekend availability. The Item schema's `kind` + `category` + `metadata` JSONB pattern is built for this.

**Rich, descriptive text fields.** Item `description`, Person `bio`, Location `description` should be written in natural language suitable for embedding-based semantic search. Avoid SEO-style keyword stuffing; prefer how a human would describe the thing to a neighbor.

**Controlled vocabulary tags.** Tags constrain the search surface to terms an LLM can reason over consistently. Open vocabulary tags degrade quickly into noise.

**Reserved schema for vector embeddings at MVP.** Don't build semantic search at v1. Do reserve the column or the parallel table that will hold embeddings, and ensure the text fields it will index are written from day one with future embedding in mind.

> **Intent:** Embeddings amplify a working index; they don't fix a broken one. Shipping vector search before structured filter is right would mask whether the index is actually surfacing the right things — "magic AI search" failures are extremely hard to debug because the inputs and outputs are both fuzzy. Reserve the substrate so the future ship isn't a migration; defer the surface until structured filter proves the index works.

The MVP ships with structured-filter search (kind, location, tags). Vector search is a T3 capability. But the schema decisions made at MVP either enable that future or block it — there is no neutral choice here.

## Closing

The clean primitive model is what makes the schematic similarity across loops translate into actual code reuse. Without it, the platform builds Maker, Run Club, Wonder, and Plumber as four separate systems and discovers too late that they were always one. With it, adding the next kind (a class, a tool-share program, a CSA subscription, a workshop series) costs one enum value and one metadata schema — not a new system.

Three core primitives — Person, Item, Location — and the deliberate absence of a Business entity between them are what give this platform its structural posture. The fourth primitive, Group, exists for the moments when people decide they are an intentional unit; it is emergent, optional, and never imposed. People declare things. Things attach to places. Some people choose to be a Group. Other people respond. That's the entire grammar.
