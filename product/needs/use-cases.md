---
id: what-use-cases
purpose: Real situations the platform exists to dissolve, organized by category and progressive type.
layer: what
status: active
---

# Use Cases

> **Restructured 2026-05-26 (second pass).** Cases are organized by category (Consumer / Producer / Organizer) and ordered within each category by increasing functional requirements — each type builds on the prior type's functionality and adds something new. Find your case in the [Index](#index) and jump straight there.

## Member roles (folded from former `people.md`, 2026-05-30)

Three roles. Every person on the platform is a **Member**; **Producer** and **Convener** are roles a Member takes on (role-as-verb, per [`../foundation/primitives.md`](../foundation/primitives.md)). A role earns its own section only by needing a distinct set of tools and functionality.

- **Member** — anyone on the platform. Search, browse, discover; join Groups, attend gatherings, buy goods and services; like, follow, share, pledge; ask for help and offer it. *Types to design for:* newcomer · long-settled neighbor · follower · supporter/backer · affinity-seeker · idea-floater · help-seeker · giver · service-seeker · event-goer · browser/lurker · homebound/limited-mobility · caregiver · anonymous guest · young Member.
- **Producer** — a Member who offers goods or services. Spectrum: full professional → casual maker / informal teacher → unpaid steward. UI labels (Seller, Producer, Maker) vary per [`../../CLAUDE.md`](../../CLAUDE.md); the role is one role. *Types to design for:* farmer/grower/rancher · fisher · baker/cook/food-maker · food-truck operator · craftsperson/artisan · trades pro · professional-service provider · care provider · repair/fix-it · informal maker · informal teacher · steward (unpaid; see [`../systems/stewardships.md`](../systems/stewardships.md)) · intermittent/seasonal · home-based · multi-location · partnership/co-owned.
- **Convener** — a Member who creates and runs a Group around a shared interest. Coordination tools, not selling tools (a Convener who sells is also wearing the Producer role). *Types to design for:* sports/fitness organizer · faith or practice leader · hobby/interest organizer · recurring social host · life-stage / support group organizer · civic/cause organizer · event-series runner · one-off event host · Convener-who-also-sells.

The type lists are living — add a type the moment a real use case surfaces one. The point is coverage, not taxonomy. *Who the platform does not serve* (corporate-shell franchise, rollup-acquirer, engagement-optimizer) is in [`../foundation/principles.md`](../foundation/principles.md) Part 2.

**Status:** Foundational reference. The working set of real-world situations the platform exists to serve. Read alongside [`member-journey.md`](member-journey.md), [`../foundation/primitives.md`](../foundation/primitives.md), and [`../foundation/principles.md`](../foundation/principles.md).

## What this is

Concrete situations — drawn from West Sacramento, East Sacramento, and the surrounding region — that the platform is being built to dissolve. Each case names a real friction, the loop(s) it exercises, the primitive shape it takes, and the distinct functionality it requires. These are not personas. They are situations. The Run Club exists. Ferrari Fisheries exists. Cafe Capricho closed last month.

## How to use this document

- **You are an agent looking for the relevant case for a scenario, ticket, or feature decision.** Scan the [Index](#index) by category, pick the case whose activity matches your work, jump to that section. Each case fits on roughly a screen.
- **Designing a feature?** Find the case it would help. The "Distinct functionality this case requires" line names what your design must enable.
- **Scoping a release?** MVP cases ship at b1. Cases tagged *Deferred (b2+)* are not yet in scope but their problem statements are. Cases tagged *Deferred (far horizon)* are out of scope for the foreseeable bundle plan; their problem statements stay in the canon so we don't forget them.

Cases are tagged with the loop(s) they exercise (per [`member-journey.md`](member-journey.md)) and the primitive shape they take (per [`../foundation/primitives.md`](../foundation/primitives.md)).

**Status taxonomy:**
- **MVP** — ships at b1, fully.
- **MVP substrate; surface deferred** — substrate at b1, surface at b2 or later.
- **Deferred (b2+)** — not in b1; design questions are bounded and expected to resolve in the next bundle or two.
- **Deferred (far horizon)** — not in the foreseeable bundle plan; design or coordination questions are too open or scope too large.

**Build status** (added 2026-05-27, tracks what exists after Phase 2 ships):
- 🟩 **Built** — fully functional after Phase 2.
- 🟨 **Partial** — core surfaces ship at Phase 2; some functionality deferred.
- ⬜ **Not built** — no user-facing surface ships at Phase 2 (substrate may exist).

---

## Index

| Code | Category | Activity | Lead example | Status | Build |
|---|---|---|---|---|---|
| [C1](#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) | Consumer | Searches, follows, gets a locality feed | A newcomer to Sacramento setting `home_location_id` | MVP | 🟨 Partial — feed + follow ship; text/semantic search deferred |
| [C2](#c2-a-member-organizes-awareness-across-multiple-places) | Consumer | Organizes awareness across multiple Places | A Sacramentan tracking Concerts in the Park | MVP substrate; surface b2 | 🟨 Partial — place-interest management ships; saved-search surface deferred |
| [C3](#c3-a-member-finds-a-trusted-local-service-provider) | Consumer | Finds a trusted local service provider | Someone needs a plumber, vet, electrician, piano teacher | Deferred (b2+) | ⬜ Not built |
| [C4](#c4-a-member-shares-extras-and-asks-for-help-mutual-aid) | Consumer | Shares extras and asks for help (mutual aid) | "I have extra zucchini" / "I need a truck for an hour" | Deferred (b2+) | ⬜ Not built |
| [C5](#c5-a-member-vouches-for-a-producer-or-attests-to-another-member) | Consumer | Vouches / attests | A buyer confirms Maya's Locally Made claim | Deferred (b2+) | ⬜ Not built |
| [C6](#c6-members-find-each-other-by-shared-interest-before-any-gathering-exists) | Consumer | Finds others by shared interest, no gathering exists yet | Bumble BFF refugees on Facebook | Deferred (b2+) | ⬜ Not built |
| [P1](#p1-a-producer-creates-a-profile-and-lists-their-products-or-services) | Producer | Creates profile + lists products/services | Any small seller making their work findable | MVP | 🟩 Built — business Group + product + service composers ship |
| [P2](#p2-a-producer-posts-bulletins-about-hours-stock-and-location) | Producer | Posts bulletins (write own or link Instagram/TikTok) | A bakery posts "Saturday 8–noon, fresh sourdough" | MVP | ⬜ Not built — bulletin composer + delivery are b2 |
| [P3](#p3-a-producer-with-variable-cadence-stays-findable-to-followers) | Producer | Has variable cadence — irregular / intermittent / ambulatory | Ferrari Fisheries · Dip Vendor · Food Truck | MVP | 🟨 Partial — Items listable with location; bulletin push-to-followers deferred |
| [P4](#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges) | Producer | Earns and displays Locally Owned + Locally Made badges | Maya at Oak Park Sourdough | MVP substrate; badge UI deferred | 🟨 Partial — Tier 0 self-attested badges ship; Tier 1+ community-attested deferred |
| [P5](#p5-a-service-provider-tradesperson-builds-trust-with-prospective-customers) | Producer | Service-provider builds trust with prospective customers | A plumber, electrician, hairdresser, piano teacher | Deferred (b2+) | ⬜ Not built |
| [O1](#o1-a-group-meets-at-a-regular-time-and-place) | Organizer | A group meets at a regular time and place | The Thursday Run Club at Drake's | MVP | 🟩 Built — recurring gathering composer + venue page ship |
| [O2](#o2-a-venues-recurring-program-becomes-findable-alongside-everything-nearby) | Organizer | A venue's recurring program is findable alongside everything nearby | Barn Movie Night at Drake's | MVP | 🟨 Partial — venue page + gathering by business Group ship; sub-venue deferred |
| [O3](#o3-a-multi-venue-series-spans-places-and-members-find-it-via-awareness-feed) | Organizer | A multi-venue series spans Places, members find it via the awareness feed | Concerts in the Park across the Sacramento metro | MVP substrate; surface b2 | 🟨 Partial — feed aggregation via place hierarchy (to county) + `metro_polygons` overlay (metro scope, per D3) works; saved-search surface deferred |
| [O4](#o4-a-member-floats-an-idea-to-test-interest-before-committing-to-host) | Organizer | Floats an idea to test interest before committing to host | Someone thinking about a Sunday coffee walk | Deferred (b2+) | ⬜ Not built |
| [O5](#o5-a-community-steward-keeps-an-ongoing-operation-alive) | Organizer | A steward keeps an ongoing operation alive | A community garden lead, a tool library volunteer | Deferred (b2+) | ⬜ Not built |
| [O6](#o6-a-community-coordinates-around-a-vacant-space) | Organizer | A community coordinates around a vacant space | Cafe Capricho's would-be successor | **Deferred (far horizon)** | ⬜ Not built |

---

# Consumers

> **Baseline functionality (implicit in every Consumer case below):** member profile creation, `member_place_interests` (primary + secondary Places), `member_interests` (taste tags), `home_location_id`, basic browse of public Item / Group / Location pages. Members get a locality feed the moment they set their home Location.

---

## C1. A member searches for what's nearby and follows what they love

**Status:** MVP (b1)
**Loops:** 3 (Land here), 7 (Buy close), 8 (Follow what you love)
**Primitive shape:** Person → `member_place_interests` × `member_interests` → discovery feed; Person → `member_follows` → Person | Group | Location.

**Persona examples:**
- A newcomer to Sacramento sets `home_location_id` to Oak Park, picks two interest tags ("live music," "sourdough"), and immediately sees a candidate feed of things happening nearby.
- A neighbor of Maya's bakery clicks "follow" on her Group page so they're told when she posts new product.
- A regular at Drake's clicks "follow" on the venue page so they're told about new gatherings hosted there.

**Distinct functionality this case requires:**
- `member_follows` substrate (member → person | group | location).
- Follow CTA surface on Person, Group, and Location pages.
- "Things you follow" management surface on the member's profile.
- Discovery feed reads `member_place_interests` × `member_interests` × Place-hierarchy traversal at query time.

**What the platform does:** the locality-first index. One page that answers "what's happening near me this week that I could just show up to," populated by Items declared by Persons and Groups at Locations. Following is the standing form of "tell me when this person/group/place has news"; the feed surfaces follow-targets' Items alongside taste-matched discovery. This is the baseline member experience; every other Consumer case builds on it.

---

## C2. A member organizes awareness across multiple Places

**Status:** MVP substrate (b1); saved-search surface deferred to b2
**Loops:** 1 (Find your people), 3 (Land here), 4 (Gather regularly), 8 (Follow what you love)
**Primitive shape:** Person → `member_place_interests`(primary + up to 5 secondary) × `member_interests` → community-awareness feed × Place-hierarchy traversal. Optional `member_saved_searches`(`location_id` or `place_id` + interest tags) for narrower subscriptions. Per ADR-21 (2026-05-23).

**Persona examples:**
- A Sacramentan loves outdoor live music in the summer. A dozen public parks across the Sacramento metro host concert series. The member's `primary_home` is Oak Park; opting into metro scope lets the `metro_polygons` overlay (`ST_Contains`, per D3) gather every park inside the metro — no MSA tree row, no per-park follow click — and the awareness feed serves every park's concerts.
- A member lives in Oak Park but works in Folsom — adds Folsom as a `secondary` Place-interest; the feed serves both.
- A member who wants a narrower filter ("anything at Drake's") creates a `member_saved_searches` row via a "Follow this venue" CTA (b2 surface).

**Distinct functionality this case requires beyond C1:**
- `member_place_interests` with primary + multiple secondary rows (substrate at b1 — done in C1 baseline; the multi-Place usage is what's distinct here).
- Metro-scope opt-in so the `metro_polygons` overlay covers every Location in the Sacramento metro without enumeration (per D3 — metros live in the overlay, not as a place-tree row); within the tree, `places.parent_id` traversal covers neighborhood → city → county.
- `member_saved_searches` substrate (b1) for parameterized "follow this venue" / "follow this filter" rows.
- Saved-search UI composer + fan-out worker (**b2 surface — deferred**).
- T3 natural-language compositional query layer ("places near me with summer concerts in the park") waits for the vector layer over `places` and `member_interests`.

**What the platform does:** awareness without explicit subscription. The Place hierarchy does the structural work; the member doesn't enumerate every park. Anti-Nextdoor in the affirmative — the member gets a feed of *what's happening there*, never a feed of *what people are saying about there*. Both substrates are owner-only at the row level; neither is an addressability surface.

**Cross-reference:** the host-side situation that motivates this case (a multi-venue series spans Places) lives at [O3](#o3-a-multi-venue-series-spans-places-and-members-find-it-via-awareness-feed). The badge variant of this awareness ("Locally Made sourdough near me") interacts with [P4](#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges).

**Deferral note:** substrate ships b1; saved-search composer + fan-out ship b2.

---

## C3. A member finds a trusted local service provider

**Status:** Deferred (b2+)
**Loops:** 9 (Find a local pro)
**Primitive shape:** Person(seeker) → search over Items(kind=service) + Groups(kind='business') → trust signals (attestations, prior bookings, references) → contact.

**Persona examples:**
- Someone needs a plumber whose business is mostly word-of-mouth and barely findable online — Yelp returns ads and out-of-area chains, Nextdoor returns a thread from 2019.
- Someone needs a vet they can trust for a new puppy.
- Someone needs a piano teacher for their kid; they want signal richer than "five stars on Google."

**Distinct functionality this case requires beyond C1:**
- Service-Item shape with richer fields (service area, appointment availability, scope of work, pricing model).
- Service-Item search surface in Explore with locality-aware filters.
- Read side of the attestation surface (see [C5](#c5-a-member-vouches-for-a-producer-or-attests-to-another-member)).

**Cross-reference:** producer side of this situation lives at [P5](#p5-a-service-provider-tradesperson-builds-trust-with-prospective-customers).

**Deferral statement:** the service-Item shape is partly covered by the existing Item primitive but has not been walked through a real case end to end. The trust-signal layer overlaps with C5 and is similarly unresolved. Deferred until the service-Item profile is walked through a real Sacramento case (a real plumber, a real vet) and the trust-signal layer has a designed answer.

---

## C4. A member shares extras and asks for help (mutual aid)

**Status:** Deferred (b2+)
**Loops:** 5 (Share what you have), 6 (Ask for help) — paired
**Primitive shape:** Person → Item(kind=offer) and Person → Item(kind=ask); both surfaces of one mutual-aid relationship.

**Persona examples:**
- Someone has extra zucchini, a pressure washer, two hours on Saturday, a spare bedroom, a skill.
- Someone else needs a truck for an hour, a stand mixer for a weekend, help with a faucet, an introduction to a vet, a hand moving.
- In lived experience, give and take are one mutual-aid relationship; the platform's job is to make both surfaces addressable in one place.

**Distinct functionality this case requires beyond C1:**
- Offer Item kind and Ask Item kind with composers.
- Response substrate per `item.md`.
- Reciprocity model — does the platform track give/take balance, or treat it as fully gift-economy?
- Abuse prevention without making the surface transactional.

**Deferral statement:** the reciprocity model is unresolved — see [`../exploration/reciprocity-and-goodwill.md`](../exploration/reciprocity-and-goodwill.md). Open questions: tracking give/take, preventing abuse, connecting Offer/Ask with the broader Items surface without diluting it. Deferred until the reciprocity model has a designed answer.

---

## C5. A member vouches for a producer or attests to another member

**Status:** Deferred (b2+)
**Loops:** crosses 7 (Buy close), 9 (Find a local pro), 12 (Steward what we built)
**Primitive shape:** Person(voucher) → attestation → Person(producer or member) or Group(kind='business'); attestation surfaces in the target's public profile and in discovery signal.

**Persona examples:**
- A buyer confirms Maya's "Locally Made" claim after receiving sourdough — community-attestation tier in [P4](#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges).
- A long-time Run Club regular vouches for the lead organizer.
- A handful of customers attest that a kind='business' Group is run by a real local owner.
- An established member attests to a new member's standing — the social-trust thread that would have lived in the Cafe Capricho case had it not been deferred-far.

**Distinct functionality this case requires beyond C1:**
- Attestation Item kind with composer.
- Attestation read-render on target profile (Person / Group / Item).
- Reputation discipline: how attestations age, whether they can be withdrawn, whether they aggregate into a numeric signal or stay qualitative.
- Abuse prevention: how the platform prevents a producer from collecting attestations from their own family.

**Cross-reference:** the producer-side use of this functionality at the badge tier lives at [P4](#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges); the consumer-side use for finding trusted service providers lives at [C3](#c3-a-member-finds-a-trusted-local-service-provider) and [P5](#p5-a-service-provider-tradesperson-builds-trust-with-prospective-customers).

**Deferral statement:** the attestation surface and reputation discipline are not yet designed. The Tier 1 community-attestation slot in P4 (Locally Made / Locally Owned) is the load-bearing seed and likely the first surface where this case lands. Deferred until the attestation surface and reputation discipline are designed.

---

## C6. Members find each other by shared interest before any gathering exists

**Status:** Deferred (b2+)
**Loops:** 1 (Find your people) — affinity-first, gathering-second
**Primitive shape:** Person → Group(kind='interest', optional anchor Location) → Items(kind=gathering) hosted by Group members.

**Persona examples:**
- The Bumble BFF refugees — a handful of women in Sacramento using a dating app's friend-matching mode notice they're all looking for the same thing, hand each other off to a private Facebook group, and the group becomes the actual product.
- New parents in a neighborhood looking for other new parents.
- Hobbyists (kayakers, knitters, board-gamers) trying to find each other before any meetup exists.

**Distinct functionality this case requires beyond C1:**
- Affinity-first Group discovery surface — showing a member "here are Groups you'd probably like to join" before any gathering exists inside them.
- Discoverability for kind='interest' Groups with no anchored Location and no recurring Item.
- Soft-membership inference (geographic suggestion when a member sets their home Location).
- The "Groups cannot be auto-assigned" boundary holds — geography is suggestion, the choice is the member's.

**Deferral statement:** affinity-first Group discovery is not yet designed. The case stress-tests the "Groups cannot be auto-assigned" commitment in [`../systems/groups.md`](../systems/groups.md) — the polygon "Sacramento women aged 25–40" is not this Group; the Group is the women who said *we are this group*. Deferred until affinity-first discovery is designed without violating that boundary.

---

# Producers

> **Baseline functionality (implicit in every Producer case below):** Person creates a kind='business' Group (the platform's representation of a personal business or shop), and lists what they sell as Items (kind='product' or kind='service'). Producers may exist without a business Group when they sell as an individual; in that case the Items attach to the Member directly. Every Producer case extends this baseline.

---

## P1. A producer creates a profile and lists their products or services

**Status:** MVP (b1)
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Primitive shape:** Person → Group(kind='business', optional) → Items(kind='product' or 'service').

**Persona examples:**
- A neighborhood coffee shop creates a Group, lists its drinks menu, posts its weekly hours.
- A jewelry maker who sells through one annual studio sale creates a Group, lists current inventory.
- A piano teacher creates a Group and lists a Service Item with rates and location radius.

**Distinct functionality this case requires:**
- Group composer for kind='business'.
- Item composer for kind='product' and kind='service'.
- Public Group page at `/p/[…place path]/g/[slug]` with listed Items.
- Member can sell as an individual without standing up a Group — Items attach to the Member directly.

**What the platform does:** the baseline producer surface. A producer who doesn't post updates, doesn't have variable cadence, and doesn't claim locality badges still gets a findable page, a clean URL, and the ability to be followed. Every richer producer case extends this baseline.

---

## P2. A producer posts bulletins about hours, stock, and location

**Status:** MVP (b1)
**Loops:** 7 (Buy close), 8 (Follow what you love)
**Primitive shape:** Person → Bulletin → followers; Bulletin body is either composed in-platform or imported via link from Instagram, TikTok, or Facebook.

**Persona examples:**
- A bakery posts "Open Saturday 8–noon, fresh sourdough at 9am."
- A restaurant links a TikTok video of tonight's special into a bulletin.
- A coffee shop posts "Closed Monday for staff training."

**Distinct functionality this case requires beyond P1:**
- Bulletin composer per [`../systems/producer-tools.md`](../systems/producer-tools.md).
- Bulletin delivery to followers (in-app + email at b1 floor).
- **Social-link import (Instagram / TikTok / Facebook)** — the linked post becomes the bulletin body, optionally augmented with the producer's own text. The producer-tools spec does not yet name this pathway explicitly; flagged for SPEC-PATCHES update to [`../systems/producer-tools.md`](../systems/producer-tools.md).

**What the platform does:** the producer's existing social posting becomes platform-native bulletin content without requiring the producer to write twice. The bulletin substrate is what makes following meaningful — a follow without a delivery channel is a bookmark.

---

## P3. A producer with variable cadence stays findable to followers

**Status:** MVP (b1)
**Loops:** 7 (Buy close), 8 (Follow what you love)
**Primitive shape:** Person → Item(kind='product' or 'service', cadence varies) → Location(varies); Item cadences include irregular (one-off windows), recurring-irregular (intermittent at a known venue), and ambulatory (sequence of stops).

**Persona examples (three flavors of variable cadence):**

- **3a. Irregular supply — Ferrari Fisheries.** A fisherman with a boat catches wild fish off the California coast. Supply is irregular; he alerts customers by text when he has fish available, where he'll be, and for how long. The window is sometimes hours. The platform lets him declare "I have salmon, today only, here, until 4pm" and push to followers.
- **3b. Intermittent market presence — the Quarterly Dip Vendor.** A producer of African-inspired dips shows up at a Sacramento farmers market sometimes — not every week, not on any schedule the market publishes. The platform's producer profile lives at the producer level, not the market level; followers see the next appearance the moment it's declared.
- **3c. Ambulatory / multi-stop — the Food Truck without a calendar.** A food truck operator works the Sacramento region — Tuesday lunch at Cesar Chavez Plaza, Wednesday dinner at Drake's parking lot. The producer is fixed; the Location varies. The platform lets him declare the sequence of stops as the core surface, not an afterthought to a marketing post.

**Distinct functionality this case requires beyond P2:**
- Item composer accepts irregular cadence (one-off Item with a date and a window).
- Item attachment to Locations of kind='recurring-temporary' (markets, popup venues) and to Locations of kind='area' (a Sacramento-wide service area for ambulatory work).
- Producer-level scheduling view that aggregates upcoming Items across Locations.
- Push to followers triggered on Item declaration (riding on the P2 bulletin substrate).

**What the platform does:** treats irregular and recurring as the same Item kind, varying only by schedule and Location attachment. That schema flexibility is what makes a fisherman, an intermittent market vendor, and a food truck findable in the same surface as a producer with one home base.

---

## P4. A locally-owned, locally-made producer earns and displays both badges

**Status:** MVP substrate (b1); badge UI deferred
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Primitive shape:** Person(owner) → Group(kind='business', anchored at a Place) → `member_business_jurisdictions`(ZIP, tiered evidence) → "Locally Owned" badge; Person → Items(kind='product', `made_at_place_id`) → "Locally Made" badge. Per ADR-21 (2026-05-23).

**Persona examples (illustrating the two badges diverging):**

| Producer | Owner residence (jurisdiction) | Product made at | Locally Owned | Locally Made |
|---|---|---|---|---|
| **Maya at Oak Park Sourdough** (anchor) | Sacramento metro (self-attested at b1) | Oak Park | ✓ | ✓ |
| Sacramento-resident reseller of imported textiles | Sacramento metro | Hanoi, Vietnam | ✓ | ✗ |
| National-chain coffee franchise | Franchisee resident in Sacramento | Roasted Seattle, brewed local | ✓ (franchisee) | partial (open) |
| Out-of-state designer labeling products "from Sacramento" | Out-of-state ZIP | Sacramento (declared) | ✗ | ✓ at Tier 0; community-attestation at b2+ |

**Distinct functionality this case requires beyond P1:**
- `member_business_jurisdictions` substrate (ZIP, `verification_source`, tiered evidence).
- `items.made_at_place_id` column on the Items table.
- `public.zip_is_proximal_to_location(zip, anchor_location_id)` derivation function.
- **Badge UI rendering rule** — where the badge renders, when it renders, how viewer place-interest interacts with rendering (**deferred surface**).
- Tier 1 community-attestation surface (paired with [C5](#c5-a-member-vouches-for-a-producer-or-attests-to-another-member); deferred to b2+).

**What the platform does:** two badges, two substrates, designed together. Jurisdiction answers *does the money go to a local owner?*; provenance answers *is the product made here?* The platform never collapses them. Both store ZIPs and Places, never street addresses — home stays in `members.home_location_id` (per ADR-4), owner-only.

**Deferral note:** substrate ships b1 (columns, action handlers, event log). Badge UI rendering rule, viewer-side proximity check, document-evidence ladder, and Tier 1 community-attestation surface are deferred. Surface ratification routes back through `explore` once a real seller case forces the question.

---

## P5. A service-provider (tradesperson) builds trust with prospective customers

**Status:** Deferred (b2+)
**Loops:** 9 (Find a local pro), 12 (Steward what we built — repeat-customer thread)
**Primitive shape:** Person → Group(kind='business') → Items(kind='service') with richer fields; attestation rows from prior customers and references.

**Persona examples:**
- A plumber whose business is 90% word-of-mouth and who has no findable online presence beyond a Yelp page with three reviews from 2018.
- A vet who has a Yelp ad but wants a richer page that reflects how their actual clients describe them.
- A hairdresser building a book at a new salon.
- A piano teacher whose Google search result is a generic chain's location page.

**Distinct functionality this case requires beyond P2:**
- Service-Item shape with richer fields than a product Item: service area (radius or named neighborhoods), appointment availability, scope of work, pricing model (flat / hourly / per-session), prerequisites.
- Optional appointment-booking integration (may stay external).
- Attestation surface (paired with [C5](#c5-a-member-vouches-for-a-producer-or-attests-to-another-member)) — prior customers vouching, references the provider lists themselves.
- Treatment-review surface per the 2026-05-12 amendment (review the *treatment* received, not the provider as a person — per the no-ranking-of-people corollary in [`../foundation/principles.md`](../foundation/principles.md)).

**Cross-reference:** the consumer side of this situation lives at [C3](#c3-a-member-finds-a-trusted-local-service-provider).

**Deferral statement:** the service-Item profile shape and the trust-signal layer (attestation, treatment-review, prior-customer references) are not yet designed. Deferred until at least one real Sacramento service provider is walked through end to end and the trust-signal architecture is named.

---

# Organizers

> **Baseline functionality (implicit in every Organizer case below):** Person creates an Item of kind='gathering' at a Location. The simplest case — a one-off backyard barbecue with a single date — needs only the gathering-Item composer plus a Location reference. Every Organizer case below extends this baseline by adding cadence, host shape, or scope.

---

## O1. A group meets at a regular time and place

**Status:** MVP (b1)
**Loops:** 1 (Find your people), 4 (Gather regularly)
**Primitive shape:** Person → Item(kind='gathering', recurring) → Location(permanent); optional Group(kind='event_anchored' or 'interest') emerges from the regulars.

**Persona examples:**
- The unofficial Run Club at Drake's — every Thursday evening, a group of runners meets, runs together, and stays for a beer. Currently no website, no calendar; you find out by being there.
- A weekly board game night at a brewery.
- A monthly book club rotating between members' homes.
- A weekend pickup soccer game at a public park.

**Distinct functionality this case requires beyond the baseline:**
- Recurring schedule on the gathering Item (weekly, monthly, by-day-of-week patterns).
- Public Item page at `/p/[…place path]/g/[group-slug]/e/[slug]` (if filed under a Group) or `/m/[handle]/e/[slug]` (if filed under a Member).
- Share-link surface — a chalk-on-a-board-able URL the regulars can text, post, or flyer.
- Optional Group emergence — `kind='event_anchored'` or `kind='interest'` Group that forms from the regulars without requiring it to exist first.

**What the platform does:** a public, locality-first page anchored at the Location with a recurring time and a clean URL. A stranger searching "what's happening near Drake's this week" can find it and show up Thursday. The organizer doing the platform's work without the platform's tools gets a single shareable link that replaces the three-app sprawl. The regulars become a Group only if they choose to — most of the value lands without that choice.

---

## O2. A venue's recurring program becomes findable alongside everything nearby

**Status:** MVP (b1)
**Loops:** 1 (Find your people), 3 (Land here), 4 (Gather regularly)
**Primitive shape:** Group(kind='business' — the venue) → Item(kind='gathering', recurring) → Location(sub-venue, permanent); host is a kind='business' Group rather than an individual Person.

**Persona examples:**
- Barn Movie Night at Drake's — Drake's runs a recurring barn movie night. To know about it today, you have to follow Drake's on Instagram or be on a mailing list. To find out about *all* the events like it within ten miles, you'd follow dozens of accounts.
- A weekly open-mic night at a neighborhood brewery.
- A monthly poetry reading at an independent bookstore.
- A Saturday morning kids' story hour at a coffee shop.

**Distinct functionality this case requires beyond O1:**
- Host is a kind='business' Group (not just a Person) — Item attaches to the Group as host.
- Sub-venue Location support — Drake's barn is a sub-venue of Drake's; reserved schema at b1, surface at T2.
- Cross-host discovery feed — the locality-first index aggregates gatherings from every host in the area into one page.

**What the platform does:** the locality-first index for events. One page that answers "what's happening near me this week," populated by gathering Items declared by Persons and Groups at Locations. The newcomer who just moved to Bryte and has lost their network can find their footing without first decoding the entire Sacramento social-media graph. The platform's value here is highest for the user with the *least* prior context.

---

## O3. A multi-venue series spans Places and members find it via the awareness feed

**Status:** MVP substrate (b1); saved-search surface deferred to b2
**Loops:** 1 (Find your people), 3 (Land here), 4 (Gather regularly), 8 (Follow what you love)
**Primitive shape:** Multiple hosts (Person or Group) → recurring gathering Items → Locations across multiple Places → Place-hierarchy aggregation → member's community-awareness feed (per ADR-21).

**Persona examples:**
- Concerts in the Park summer series across the Sacramento metro — a dozen public parks host concert series (Capitol Mall, Cesar Chavez Plaza, Land Park amphitheater, etc.). Each is run by a different host (city Parks & Rec, a nonprofit, a local rotary, a small promoter), publishes on a different website, and surfaces in no shared place today.
- A regional farmers-market circuit spanning four counties run by independent market operators.
- A summer outdoor-cinema series with screenings at a dozen partner venues.

**Distinct functionality this case requires beyond O2:**
- Cross-host aggregation — gatherings from independent hosts surface in the same feed if they share place + interest match.
- Place-hierarchy traversal — a gathering at Capitol Mall surfaces for any member whose place-interest set includes Sacramento (the parent Place).
- `member_saved_searches` substrate so a member can subscribe to a narrower filter ("outdoor live music in any park I care about") — substrate at b1.
- Saved-search UI composer + fan-out worker — **b2 surface, deferred**.

**What the platform does:** awareness without explicit subscription. Each park's concert series exists as recurring gathering Items; the awareness feed reads place-interests × interest tags × Place-hierarchy at query time. "Friday Concert Series at Capitol Mall: Junior Brown, 6pm, free" surfaces because the Item's tags match the member's interests and Capitol Mall's Place falls under their place-interest set.

**Cross-reference:** the member-side situation that motivates this case is [C2](#c2-a-member-organizes-awareness-across-multiple-places). The two cases share substrate; the difference is whose situation drives the design call.

---

## O4. A member floats an idea to test interest before committing to host

**Status:** Deferred (b2+) — placeholder for a real instance
**Loops:** 2 (Float an idea)
**Primitive shape:** Person → Item(kind='wonder') → encouragement signals from other Persons → tipping-point conversion to Initiative or recurring Gathering.

**Persona examples:** (slot reserved for a real instance — fill once the Wonder surface exists)
- Someone has been thinking about starting a Sunday coffee walk, a monthly clothing swap, a beginner pickleball morning, a fermentation skill-share.
- They don't want to commit to hosting before they know there is interest.
- Today, the only way to test interest is to commit to hosting and see who shows up — which is the friction.

**Distinct functionality this case requires beyond O1:**
- Wonder Item kind with composer.
- Interest-signaling mechanic — how a member declares "yes I'm interested."
- Tipping-point flow — how interest above a threshold converts a Wonder into an actual Gathering or Initiative.
- Response handling when interest is below threshold — does the Wonder expire, accumulate, hand off?

**Deferral statement:** the Wonder Item kind exists in [`../foundation/primitives.md`](../foundation/primitives.md) but the signaling mechanic, threshold logic, and tipping-point conversion are not yet designed. Deferred until the Wonder → response → tipping-point flow is designed.

---

## O5. A community steward keeps an ongoing operation alive

**Status:** Deferred (b2+) — placeholder for a real instance
**Loops:** 12 (Steward what we built)
**Primitive shape:** Person(steward) → Group(kind varies — 'practice' for tool library, 'interest' for repair café, 'business' for kitchen co-op) → operational tooling (schedules, inventories, member coordination).

**Persona examples:** (slot reserved for a real instance — fill from a real Sacramento community garden, tool library, or repair café)
- A garden lead coordinating volunteer plots, watering rotations, and seed swaps.
- A tool library volunteer tracking checkouts, returns, and equipment condition.
- A repair-café organizer scheduling pop-ups, recruiting fixers, tracking projects.

**Distinct functionality this case requires beyond O2 / O3:**
- `group_stewardships` schema delta per [`../systems/stewardships.md`](../systems/stewardships.md).
- Shared schedules and shift sign-ups (volunteer rotations).
- Shared inventory tracking (tool library, seed library, equipment).
- Optional dues collection (low-stakes, not the Cafe Capricho capital-structure flavor).
- Curated stewardship templates (the seven from ship-theme S6.5).

**Deferral statement:** the stewardship tooling layer — what a steward needs beyond a Group with members — is not yet fully designed. The minimum-viable steward toolkit (which subset of schedules / inventory / shift-signup / dues lands first) is the open question. Deferred until at least one real stewarded Sacramento community is walked through end to end.

---

## O6. A community coordinates around a vacant space

**Status:** **Deferred (far horizon)** — set 2026-05-26 per PM; the case is too complex for the foreseeable bundle plan
**Loops:** 10 (Start something), 11 (Pool resources), with mentorship and economic-capacity threads
**Primitive shape:** Person → Item(kind='initiative') → Location(the vacant space); pledges from a Group of would-be backers; mentorship relationships from Persons with relevant experience; eventual handoff to federated financing infrastructure.

**Persona examples:**
- Cafe Capricho's Successor — Cafe Capricho was an East Sacramento cafe that shut down. The space is a beloved community staple, now empty. Somewhere in Sacramento, there is at least one person who would take it over but lacks capital, mentorship, or certainty the community would back them. Somewhere in the neighborhood are dozens of regulars who would back a successor with money, patronage commitments, or hours. Today, those two sides do not find each other.
- A beloved hardware store whose owner is retiring with no buyer.
- A community garden plot whose lead steward has moved away with no backstop.

**Distinct functionality this case requires beyond every other case:**
- Initiative Item kind with composer.
- Pledge response substrate — capital pledges, patronage commitments, mentorship hours, sweat equity.
- Pledge aggregation surface — visible to others contemplating their own pledge.
- The platform / financing boundary — surfacing demand and structuring pledges versus running financing (CDFI partner, securities-compliant structures pick up at the boundary).
- Coordination flows between candidate-operators, backers, and experienced mentors.

**Deferral statement (far horizon):** the case requires the Initiative + Pledge primitive, the platform/financing boundary discipline, and multi-actor coordination flows none of which exist as designs. It also requires the trust signals from [C5](#c5-a-member-vouches-for-a-producer-or-attests-to-another-member) and the stewardship base from [O5](#o5-a-community-steward-keeps-an-ongoing-operation-alive). **PM decision 2026-05-26:** deferred past the foreseeable bundle plan. The problem statement stays in the canon because it's load-bearing for the platform's long-term thesis (community-scale undertakings, the Cleveland Model / Mondragon trajectory) but no build-pipeline work attaches to it until the prerequisite cases land and the platform's coordination capabilities deepen.

---

## What success looks like

Every MVP case above ends in a recurring relationship, not a one-off transaction:

- The newcomer at Barn Movie Night becomes a regular, then a host of something themselves.
- The Run Club gains members from people who walked past Drake's, not just the ones who already knew.
- Ferrari Fisheries' followers come back when the fish do.
- The dip producer's intermittent appearances accumulate a real customer base.
- The food truck's schedule stops being a loyalty test.
- Maya's locally-made sourdough finds the customers who specifically want it.

The deferred cases — service-provider trust, mutual aid, attestation, affinity-first finding, stewardship, the long-horizon Initiative case — extend the same pattern into territory the platform isn't yet ready to serve, but the shape of victory is the same in every one of them: a Person, declaring a thing, at a place — and other people responding, returning, and over time taking on more of the work themselves.

**Buy close. Build community. Build the future together.**
