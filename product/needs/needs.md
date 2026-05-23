---
purpose: Ranked human needs traced to systems, capabilities, and personas.
layer: what
status: draft
---

# Needs — what people come here to do

> **Status: DRAFT 2026-05-22.** First synthesis from `member-journey.md` (the 13 loops), `use-cases.md` (the 12 real situations), `../foundation/principles.md`, and `../foundation/design-philosophy.md`. PM to refine — need set, ranking, and per-need traces not yet ratified. **[PM: confirm]** the need list, the ranking, and the system + capability traces.

## How to read this

Each entry: a human need stated in plain voice ("I want to ..."), then its trace through the platform — which loop(s) it touches, which system(s) serve it, which capability(ies) surface it, which persona(s) come here with it. This doc is the bridge from *why we exist* (foundation) to *what we built* (systems and capabilities).

Needs are ranked **by loop family in the order the Member's stake accumulates** — Gathering → Sharing → Trade → Pooling → Federation — because that is the order the platform's [`../foundation/principles.md`](../foundation/principles.md) Part 1 puts the loops in, and the sources do not yet support a finer ranking. **[PM: confirm]** whether to refine the ranking by importance / volume / business priority once data exists.

**What this platform doesn't serve.** Some needs are deliberately refused — the engagement-feed scroll, the rank-and-rate browse, the Location-locked complaint surface. Those refusals live in [`../foundation/principles.md`](../foundation/principles.md) Part 4 and [`../foundation/policy.md`](../foundation/policy.md) — not duplicated here.

---

## Family 1 — Gathering (civic on-ramp)

### 1. I want to find my people

The need at the doorway. A Member arrives in the locality or in the platform with an affinity they suspect others share — a way of life, a hobby, a circumstance, a stage of life — and wants to find the others.

- **Why it matters:** The substrate of every other loop. Without the "find your people" surface, the platform is a directory. With it, the platform is a place.
- **Loop:** 1 (Find your people).
- **Served by:** [`../systems/groups.md`](../systems/groups.md) (the six Group kinds at b1; Member-declared, never auto-assigned), [`../systems/member.md`](../systems/member.md) (the Member profile + follow substrate), [`../systems/discovery.md`](../systems/discovery.md) (the locality-first index).
- **Capabilities:** [`../capabilities/group-create-join.md`](../capabilities/group-create-join.md), [`../capabilities/member-profile.md`](../capabilities/member-profile.md).
- **Persona(s):** [The Affinity-Group Seeker](people.md#6-the-affinity-group-seeker), [The Newcomer / Wanderer](people.md#3-the-newcomer--wanderer), [The Everyday Neighbor](people.md#8-the-everyday-neighbor).
- **Use case anchor:** [#7 Bumble BFF Refugees](use-cases.md#7-the-bumble-bff-refugees).

### 2. I want to float an idea

A Member has an idea they aren't ready to commit to hosting — a Sunday coffee walk, a monthly clothing swap, a beginner pickleball morning, a fermentation skill-share. They want to test demand and find collaborators before they take ownership.

- **Why it matters:** Activation energy is the dominant friction in real-world coordination. The Wonder primitive lowers it by separating *floating an idea* from *committing to host* — two acts that every other tool conflates.
- **Loop:** 2 (Float an idea).
- **Served by:** [`../systems/item.md`](../systems/item.md) (Item with kind=wonder).
- **Capabilities:** Item composer (kind picker) in [`../capabilities/item-view.md`](../capabilities/item-view.md); Wonder → Gathering conversion (b2 — schema reserved).
- **Persona(s):** **[PM: confirm]** — the Idea-Floater persona is named in [`people.md`](people.md) as a TBD; this need is the load-bearing reason for that persona.
- **Use case anchor:** [#8 (TODO) Float an idea](use-cases.md#8-todo-float-an-idea--loop-2) — slot is reserved for a real instance.

### 3. I want to land somewhere new

A Member is new to the locality and wants to find the activity that's already happening. They want to *show up to a Thursday-night run, a barn movie night, a Saturday market, a concert in the park* — without first decoding the Sacramento social-media graph.

- **Why it matters:** The locality-first index is the platform's value to the user with the *least* prior context. If a Newcomer can find their footing in a session, the loop accumulates; if they can't, they leave.
- **Loop:** 3 (Land here).
- **Served by:** [`../systems/discovery.md`](../systems/discovery.md) (the locality-first index, the `discoverable_items` materialized view, the `/explore` surface).
- **Capabilities:** [`../ui/community-platform.md`](../ui/community-platform.md) (Home — locality feed; Explore — locality browse).
- **Persona(s):** [The Newcomer / Wanderer](people.md#3-the-newcomer--wanderer), [The Everyday Neighbor](people.md#8-the-everyday-neighbor).
- **Use case anchor:** [#5 Barn Movie Night](use-cases.md#5-barn-movie-night-at-drakes) (newcomer side), [#12 Concerts in the Park](use-cases.md#12-concerts-in-the-park) (Loop 3 entry).

### 4. I want to gather regularly

A Member wants to host a recurring gathering — a Run Club, a Movie Night, a book club, a concert series, a market booth — without having to maintain a website, an Instagram account, a Substack, or a mailing list.

- **Why it matters:** The recurring-real-world relationship is the platform's load-bearing pattern. A platform that surfaces a one-off event is a calendar; a platform that surfaces a recurring rhythm becomes part of the rhythm.
- **Loop:** 4 (Gather regularly).
- **Served by:** [`../systems/item.md`](../systems/item.md) (Item with kind=gathering, recurring), [`../systems/location.md`](../systems/location.md) (permanent + recurring-temporary Locations).
- **Capabilities:** [`../capabilities/event-host.md`](../capabilities/event-host.md), the gathering composer (b1).
- **Persona(s):** [The Convener](people.md#2-the-convener-recurring-host), [The Everyday Neighbor](people.md#8-the-everyday-neighbor) (as audience).
- **Use case anchor:** [#1 Run Club at Drake's](use-cases.md#1-the-unofficial-run-club-at-drakes), [#5 Barn Movie Night](use-cases.md#5-barn-movie-night-at-drakes), [#12 Concerts in the Park](use-cases.md#12-concerts-in-the-park).

---

## Family 2 — Sharing (mutual aid)

### 5. I want to share what I have

A Member has extra capacity — extra zucchini, a pressure washer collecting dust, two hours on Saturday, a spare bedroom, a skill — and wants to offer it to neighbors. They are not selling; they are giving.

- **Why it matters:** Mutual aid is the second-most fundamental loop after Gathering. It's how a community moves from "I know who else lives here" to "we look after each other."
- **Loop:** 5 (Share what you have).
- **Served by:** [`../systems/item.md`](../systems/item.md) (Item with kind=offer).
- **Capabilities:** The Offer surface in the Item composer ([`../capabilities/item-view.md`](../capabilities/item-view.md)); the response substrate per [`../systems/item.md`](../systems/item.md).
- **Persona(s):** **[PM: confirm]** — the Mutual-Aid Member persona is named in [`people.md`](people.md) as a TBD; covers both Offer and Ask sides.
- **Use case anchor:** [#9 (TODO) Share / Ask](use-cases.md#9-todo-share--ask--loops-5-and-6-paired) — slot reserved.

### 6. I want to ask for help

A Member needs something — a truck for an hour, a stand mixer for a weekend, help with a faucet, an introduction to a vet they trust, a hand moving — and wants to ask without it being a transaction or a forum-post.

- **Why it matters:** Asking is the dual of giving. A platform that makes giving easy but asking awkward gets unbalanced; both surfaces need to feel equally lightweight.
- **Loop:** 6 (Ask for help).
- **Served by:** [`../systems/item.md`](../systems/item.md) (Item with kind=ask).
- **Capabilities:** The Ask surface in the Item composer; the response substrate per [`../systems/item.md`](../systems/item.md). The open design tension around how reciprocity and goodwill surface here lives in [`../exploration/reciprocity-and-goodwill.md`](../exploration/reciprocity-and-goodwill.md).
- **Persona(s):** Same as #5 — the Mutual-Aid Member persona covers both sides. **[PM: confirm]** whether Offer-side and Ask-side warrant separate personas.
- **Use case anchor:** [#9 (TODO) Share / Ask](use-cases.md#9-todo-share--ask--loops-5-and-6-paired).

---

## Family 3 — Trade (the economic loop)

### 7. I want to make and be found

A Member is making something — bread, ceramics, wild-caught fish, dips, repairs — and wants to be findable by the neighbors who would buy it. They are running a personal business in producer capacity (per [`../foundation/principles.md`](../foundation/principles.md) Part 2: personal businesses are first-class).

- **Why it matters:** The trade loop is where the platform's economic premise meets the test. If the platform can sustain a real working maker — irregular, intermittent, personal — it can sustain the rest of the Slow Economy thesis. If it can't, none of the other loops compound into livelihoods.
- **Loop:** 7 (Make and be found).
- **Served by:** [`../systems/item.md`](../systems/item.md) (Item with kind=product or kind=service), [`../systems/groups.md`](../systems/groups.md) (kind='business' Group for the sole-prop / cooperative / partnership cases), [`../systems/discovery.md`](../systems/discovery.md), [`../systems/business-jurisdiction.md`](../systems/business-jurisdiction.md) (locality verification).
- **Capabilities:** Item composer for product/service kinds; the Seller section in [`../ui/community-platform.md`](../ui/community-platform.md); [`../systems/producer-tools.md`](../systems/producer-tools.md) (Bulletin + Growth).
- **Persona(s):** [The Producer (irregular supply)](people.md#1-the-producer-irregular-supply).
- **Use case anchor:** [#2 Ferrari Fisheries](use-cases.md#2-ferrari-fisheries), [#3 Quarterly Dip Vendor](use-cases.md#3-the-quarterly-dip-vendor), [#4 Food Truck Without a Calendar](use-cases.md#4-the-food-truck-without-a-calendar).

### 8. I want to follow what I love

A Member has chosen a Producer or a Convener and wants to be alerted when they have something to offer — a fish drop, a market appearance, a concert at a followed park, a new product, a recurring gathering.

- **Why it matters:** Following is what turns one-time discovery into a sustained relationship. Without it, the platform is a search engine; with it, it's a subscription to people.
- **Loop:** 8 (Follow what you love).
- **Served by:** [`../systems/member.md`](../systems/member.md) (the `member_follows` substrate at b1; the surface at b2), [`../systems/location.md`](../systems/location.md) (Location-follow surface, the Concerts-in-the-Park pattern), [`../systems/producer-tools.md`](../systems/producer-tools.md) (Bulletin delivery).
- **Capabilities:** Follow surface in [`../capabilities/member-profile.md`](../capabilities/member-profile.md) and the Location page surface in [`../systems/location.md`](../systems/location.md).
- **Persona(s):** [The Follower (loyalty-shaped)](people.md#7-the-follower-loyalty-shaped).
- **Use case anchor:** [#2 Ferrari Fisheries](use-cases.md#2-ferrari-fisheries), [#3 Quarterly Dip Vendor](use-cases.md#3-the-quarterly-dip-vendor), [#4 Food Truck](use-cases.md#4-the-food-truck-without-a-calendar), [#12 Concerts in the Park](use-cases.md#12-concerts-in-the-park).

### 9. I want to find a local pro

A Member needs to hire someone — a plumber, a vet, a piano teacher, a hairdresser, a mechanic — and wants signal richer than Yelp / Angi / Google Business. They want the platform's equivalent of "ask a neighbor."

- **Why it matters:** This is the loop where the platform's people-first commitment most directly competes with the gatekeeping-rating model the foundation rejects. Reviews surface treatment (per [`../foundation/principles.md`](../foundation/principles.md) Part 2's "no ranking of people" corollary), not stars.
- **Loop:** 9 (Find a local pro).
- **Served by:** [`../systems/item.md`](../systems/item.md) (Item with kind=service), [`../systems/member.md`](../systems/member.md) (treatment-review surfaces per the 2026-05-12 amendment).
- **Capabilities:** Service-Item view; service-Item search via [`../ui/community-platform.md`](../ui/community-platform.md) Explore.
- **Persona(s):** **[PM: confirm]** — the Trades-Pro Seeker persona is named in [`people.md`](people.md) as a TBD; this need is its load-bearing reason.
- **Use case anchor:** [#10 (TODO) Find a local pro](use-cases.md#10-todo-find-a-local-pro--loop-9).

---

## Family 4 — Pooling (community ownership)

### 10. I want to start something

A Member wants to lead a community-scale undertaking — reopen a beloved closed café, found a tool library, start a community garden — that they cannot accomplish alone. They need to find backers, candidates, mentors, and a path that doesn't require them to first incorporate, raise capital, and hire a marketing team.

- **Why it matters:** The Initiative primitive is what lets a community organize *around an absence* (an empty storefront, an unfulfilled need) rather than only around existing listings. This is the loop where the platform's coordination value is highest and the line with regulated finance is most acute.
- **Loop:** 10 (Start something).
- **Served by:** [`../systems/item.md`](../systems/item.md) (Item with kind=initiative; schema reserved at b1, full surface b3), the Initiative-pledge substrate.
- **Capabilities:** **[PM: confirm]** — the Initiative composer ships at b3 (per [`../foundation/platform-promise.md`](../foundation/platform-promise.md)); the capability file does not yet exist as a separate doc.
- **Persona(s):** [The Steward / Initiator](people.md#4-the-steward--initiator).
- **Use case anchor:** [#6 Cafe Capricho's Successor](use-cases.md#6-cafe-caprichos-successor).

### 11. I want to pool resources

A Member is part of a group that wants to pool money, time, or commitments toward something specific — backing a successor candidate, funding a tool library, sponsoring a series of community gatherings. They want the platform to record the commitment in a way that's visible to others contemplating their own.

- **Why it matters:** Most platforms make pooling either too heavy (Kickstarter-shaped, all-or-nothing, time-bounded campaigns) or too light (a Google Doc nobody updates). The middle — durable, visible, structurally credible pledges that aren't yet contracts — is the substrate the platform needs to make community-scale undertakings possible.
- **Loop:** 11 (Pool resources).
- **Served by:** [`../systems/item.md`](../systems/item.md) (Item with kind=initiative + the pledge response substrate); [`../systems/payments.md`](../systems/payments.md) at the rail layer (Member→Group commerce, the ledger).
- **Capabilities:** Pledge surface (b3); [`../systems/stewardships.md`](../systems/stewardships.md) (ship-theme S6.5 — the care-floor smallest-ownership-step).
- **Persona(s):** [The Backer](people.md#5-the-backer), [The Steward / Initiator](people.md#4-the-steward--initiator).
- **Use case anchor:** [#6 Cafe Capricho's Successor](use-cases.md#6-cafe-caprichos-successor); future #11 placeholder (stewardship case).

### 12. I want to steward what we built

A Member is part of a small group keeping something alive — a tool library, a seed library, a repair café, a community fridge, a Little Free Pantry. They want durable platform support for the rhythm — the upkeep schedule, the rotation, the named stewards, the discoverability for neighbors — without it pretending to be a startup or a 501(c)(3).

- **Why it matters:** Stewardship is the smallest ownership step. A community that has run a seed library, a tool library, and a repair café for three years has the social capital, the named stewards, the rhythm, and the visible track record that real community ownership requires. This is the platform's b1 surface for the Mondragon trajectory in miniature.
- **Loop:** 12 (Steward what we built).
- **Served by:** [`../systems/stewardships.md`](../systems/stewardships.md) (the ship-theme S6.5 schema delta — `group_stewardships` table + seven curated templates), [`../systems/groups.md`](../systems/groups.md) (Groups with the steward role on affiliate kinds).
- **Capabilities:** **[PM: confirm]** — capability docs for stewardship UI not yet authored; surface ships with ship-theme S6.5 per `stewardships.md`.
- **Persona(s):** **[PM: confirm]** — the Community Steward persona named in [`people.md`](people.md) as a TBD; this need is its load-bearing reason.
- **Use case anchor:** [#11 (TODO) Steward what we built](use-cases.md#11-todo-steward-what-we-built--loop-12).

---

## Family 5 — Federation

### 13. I want to take what I built with me

A Member (or a Group, or a thriving community-owned enterprise) has accumulated identity, relationships, context, and track record on the platform — and as the community grows deeper infrastructure (banking, insurance, intelligence), they want that accumulated stake to follow them rather than evaporate when the platform's centrally-built tools don't fit anymore.

- **Why it matters:** Federation is the platform's structural commitment that it won't become a trap. The Cleveland Model / Mondragon trajectory the platform is built around requires that the deeper infrastructure (CDFI, cooperative-services, insurance pools) spawn into *federated* platforms — separate, locally-owned, but interoperable with the originating platform.
- **Loop:** 13 (Federation).
- **Served by:** [`../systems/agent-assistance.md`](../systems/agent-assistance.md) (federation-portable Delegations, Assistant Context portability — both T3), [`../systems/action-layer.md`](../systems/action-layer.md) (the event log invariants that make portability possible), Member data export (per ADR-6 b1).
- **Capabilities:** Data export at `/you/data` (b1 substrate, b2 surface). Federation handoff flows (b3).
- **Persona(s):** Cross-cutting — every persona above benefits from federation portability. Most acutely felt by [The Steward / Initiator](people.md#4-the-steward--initiator) and [The Producer](people.md#1-the-producer-irregular-supply), whose accumulated stake is the highest.
- **Use case anchor:** **[PM: confirm]** — federation does not have a single canonical example (per `use-cases.md`); the use case is structural rather than situational. The canonical-examples doc explicitly notes Loop 13 "is architectural and does not anchor to a single example."

---

## What this draft does not yet do

- **Does not stack-rank needs by importance or volume.** The ranking above is by loop family in the published order. **[PM: confirm]** whether to refine — e.g., by b1 volume (Land here + Make and be found + Gather regularly are likely highest at MVP), by stake accumulation (Steward + Pool are highest later), by some PM judgment of urgency.
- **Does not address Member-Operations needs separately** (Maker mode is retired per ADR-12 SUPERSEDED 2026-05-12). All "I want to operate commercially" needs route through the kind='business' Group walkthrough (per [`../systems/groups.md`](../systems/groups.md)); the surface is the same as #7 (Make and be found).
- **Three of the thirteen needs name personas as `[PM: confirm]` TBD** — the Idea-Floater (Loop 2), the Trades-Pro Seeker (Loop 9), and the Community Steward (Loop 12). These match the persona TBDs in [`people.md`](people.md) and resolve together.
