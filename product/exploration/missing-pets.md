---
id: exploration-missing-pets
purpose: Early-stage thinking on whether the platform can help neighbors find missing pets without opening a community-post surface.
layer: what
status: exploration
---

# Exploration: Missing Pets

> **Status:** Exploration, not spec. Probes a use case that pushes against the platform's accountable-participation commitment ([`policy.md`](../foundation/policy.md) § The accountable-participation commitments; [`location.md`](../systems/location.md) § Not a complaint surface). The question is whether there is a structural shape that captures the genuine community-rallying value of "my pet is missing" without giving the platform a freeform posting affordance that becomes a vector for rants, scams, and harassment.

> **Relationship to other docs:** Sits next to [`accountability.md`](accountability.md) (structured concern reports) and [`vetting-and-vouching.md`](vetting-and-vouching.md) (structured knowledge contributions) in the broader pattern: *when neighbors need to act collectively about something with a real cost of abuse, the answer is always a tightly scoped Item kind, never a freeform post.* This doc asks whether that pattern stretches to lost pets, and if so, how far.

---

## The problem

A neighbor's pet is missing. Right now they post to an anonymous neighborhood app, Facebook neighborhood groups, group texts, and tape flyers to telephone poles. Two-thirds of dogs and 75% of cats are recovered within a few days, and the single biggest factor is neighbors actually knowing the pet is missing. The discovery problem is real.

The platform's locality-first index — knowing which Members hold affinity to which Locations — is precisely the substrate that could solve this discovery problem better than any of the existing channels. The neighbors three blocks over already exist in the system; they already declared they care about this place. A missing-pet notification is, structurally, an awareness-feed event scoped to a small radius for a short window. The substrate is already there.

But "let people post when their pet goes missing" is a one-step move from "let people post." That is exactly the surface the platform has structurally refused — for good reasons documented in [`policy.md`](../foundation/policy.md) and [`location.md`](../systems/location.md). A pet-alert surface that is even slightly loose becomes a complaint surface, a scam-bait surface, a political-rant surface, a "found a syringe in the park" surface. The failure mode is not abstract; it is what an anonymous complaint feed becomes.

So the exploration is not "should we help with missing pets?" The answer to that is obviously yes. The exploration is: **is there a shape tight enough that it can carry the help without carrying the failure mode?**

---

## The tension, named

Three forces are in opposition:

1. **Community rallying is good.** When a neighbor's pet is missing, neighbors helping is exactly what the platform exists to enable. Loop 4 (Gather regularly) and the broader "find your people" arc are weaker if we cannot help with the moments where help most matters.
2. **Open posting is forbidden.** Per [`policy.md`](../foundation/policy.md) § The accountable-participation commitments and [`location.md`](../systems/location.md) § Not a complaint surface, the platform has no Location wall, no Location feed, no Location DM. Messaging at b2+ is item-or-group only. "Member-authored notice broadcast to nearby Members" is the exact shape that has been refused.
3. **Slippery-slope reality.** Once "missing pet" is a kind, the second-day request is "missing person" (much harder safety + privacy lift). The third is "lost wallet" (mostly fine but spam-prone). The fourth is "found syringe in the playground" (the gravitational center of anonymous complaint feeds). Each request individually sounds reasonable. The cumulative drift is what we have already structurally refused.

The lexicographic close-call rule from [`DECISION-PATTERNS.md`](../../playbooks/DECISION-PATTERNS.md) applies cleanly: **member safety → platform health → member data protection → mutual benefit with reversibility.** Whatever shape this exploration lands on must pass each filter in order. A missing-pet feature that puts a Member's home address in the awareness feed fails the third filter. A missing-pet feature that becomes a complaint vector fails the second. The exploration's job is to find a shape that passes all four.

---

## Anchoring scenario — Sarah's cat Mochi

**Setup.** Sarah lives in Oak Park, Sacramento. Her tortoiseshell cat Mochi slips out the back door at 7am while Sarah is leaving for work. Sarah doesn't realize until she gets home at 6pm. Mochi has never been outside. Sarah is panicked.

**Today (no platform):** Sarah posts to an anonymous neighborhood app, the Oak Park Neighbors Facebook group, and her own Instagram stories. She tapes flyers to four telephone poles within a two-block radius. She walks the neighborhood calling Mochi's name. Three days later a neighbor four blocks over recognizes the flyer from a cat she saw in her backyard yesterday and texts Sarah. Mochi comes home.

**With a platform missing-pet shape (the question this doc asks):**

1. **Sarah declares a Missing Pet Item.** Not a post. An Item with `kind='missing_pet'` — a strict schema, not a freeform text field. The composer asks: species (cat), name (Mochi), description (tortoiseshell, 8 lbs, green collar, no tags), photo, last-seen point (an approximate Location, not Sarah's street address — see *Privacy implications* below), last-seen time (7am today), microchipped (yes), contact preference (DM via platform / link to phone). One screen, under 90 seconds.

2. **Auto-expiry is set.** The Item carries a hard `expires_at` of 7 days from declaration (longer than the dog/cat recovery median; shorter than the tail beyond which active alerts become noise). Sarah can extend by 7 days once. After expiry the Item moves to a `closed` state and stops surfacing in feeds; the page persists for archive and so anyone who finds the cat next week can still reach Sarah.

3. **Geographic scoping is automatic.** The Item surfaces in the awareness feed for Members whose Location affinities include the last-seen Location's place at the smallest containing administrative shell (Oak Park, in Sarah's case — not Sacramento County, not the City of Sacramento; the neighborhood-equivalent place is the scope). A Member in Land Park does not see Mochi's alert. The radius is determined by the place hierarchy, not by Sarah's choice — Sarah cannot widen it.

4. **A small set of Members sees it.** Neighbors three blocks over who already declared affinity to Oak Park see Mochi in their awareness feed alongside the other Items active in their place. The feed indicator is restrained — a small icon, not a banner; the feed never becomes mostly missing-pet content because there is structurally one active Missing Pet alert per Member at a time and the surface caps how many show at once.

5. **Found-it response is a structured reply.** A neighbor four blocks over recognizes Mochi from a photo and taps "I think I've seen this cat." This is a kind-specific response, not a freeform comment thread. The response surfaces: when, where (approximate Location), photo if available, and a one-line note (capped, 200 chars). Sarah is notified. The two of them can then DM (the existing item-scoped messaging surface from b2+) to coordinate pickup.

6. **Resolution closes the loop.** When Sarah recovers Mochi, she marks the Item `fulfilled`. The Item moves out of feeds. A small "Reunited" indicator is shown on the Item page for community memory. Members who responded with sightings get a "Mochi is home" notification — the recognition feedback that keeps people willing to help next time.

**What this scenario does NOT include:** Sarah cannot edit the Item description into a paragraph of free text. She cannot use the Item to advertise her grooming business. She cannot use the Item to complain about the neighbor whose loose dog she suspects scared Mochi out the door. She cannot post a "found syringe in the park" Item — that kind does not exist, and the kind enum is the constraint. The composer schema is the firewall.

---

## Shape options

Three shapes are worth weighing. Each has a different abuse-prevention profile.

### Shape A — A tightly scoped Item kind (`kind='missing_pet'`)

The Mochi scenario above. The strongest shape. It treats "missing pet" as a structurally distinct kind of declaration, with a schema that constrains what can be said, a scope that constrains who sees it, and an expiry that constrains how long it lives.

**Strengths:**
- Composer schema is the firewall. There is no freeform text big enough to carry a rant.
- Inherits the existing Item substrate — events, locality index, awareness feed, kind-specific response shapes, lifecycle states. No new system; an enum value and a child table.
- Inherits the auto-expiry pattern from Wonder (90-day default per [`item.md`](../systems/item.md) § `item_wonders`).
- Inherits the locality scoping from the awareness feed.
- The pet recovery framing is structurally narrow — there is no obvious adjacent use the kind can be repurposed for. A scammer cannot misuse `kind='missing_pet'` to advertise. A complainer cannot misuse it to complain about a business.

**Costs:**
- Adds an Item kind. The bar for that should be high. Per [`item.md`](../systems/item.md) the kind enum is extensible, but every new kind is a UI surface, a composer, a response shape, an event subset, and a moderation pattern. This is not free.
- "Missing pet" is the wedge. Once it ships, the next request will be missing person. The PM must be ready to refuse that request *on principle*, not on capacity — because the substrate is the same; what differs is the failure mode of getting it wrong (a wrong pet alert is mild; a wrong missing-person alert can be a vector for stalking, family-court abuse, or worse).

### Shape B — A Group-level opt-in feature

A kind='interest' Group ("Oak Park Pet Network" or similar) gets a Missing Pet surface inside it. Only Group members see and post Missing Pet alerts. The Group is opt-in; the surface is gated to membership.

**Strengths:**
- The opt-in moves the trust calculus from "anyone in the place can see this" to "people who explicitly joined a pet-network Group can see this." This is a much smaller, more committed audience.
- The Group-as-container precedent already exists for affinity. A pet network is a textbook kind='interest' Group.
- Failure mode is contained. If the Group degrades into complaint posting, the Group can be moderated by its stewards (per the Group steward role in [`groups.md`](../systems/groups.md)), and a degraded Group does not contaminate the platform-wide awareness feed.
- This shape is also the natural home for adjacent helpful surfaces: "found a cat, no collar" sightings, "anyone seen a stray in this neighborhood lately" inquiries, the slow-burn community knowledge about which dogs belong to which houses.

**Costs:**
- Discovery is much weaker. Sarah's neighbor four blocks over only sees Mochi if they happened to join the pet-network Group. Most won't. The whole point of the platform's locality-first index is to reach the neighbor who would help but doesn't know to look.
- The recovery rate likely drops. The Group becomes a self-selected pool of pet people, not a broad neighborhood broadcast. Mochi's actual finder is more likely to be a non-pet-person who happens to glance out their window.
- A Group with a missing-pet surface is structurally close to "a Group with a posting surface." The same Group, with a slightly different surface inside, slides toward an anonymous complaint feed. The Group container is not actually the firewall — the Item kind is. So this shape gets the discovery cost without buying the abuse-prevention benefit.

### Shape C — Nothing on platform

The platform does not help with missing pets. Members continue to use anonymous neighborhood feeds, Facebook, and flyers. The platform stays clean.

**Strengths:**
- No new surface. No abuse risk. No slippery slope.
- The platform is what it claimed to be in `policy.md` and `location.md`. No drift.

**Costs:**
- Real community value declined for fear of misuse. This is the trap [`policy.md`](../foundation/policy.md) softened against in 2026-05-12 (the accountable-participation framing was softened because absolute refusals were wrong) — the design intent is sound; the absolutism was the problem.
- The platform's claim to be the place where neighbors help neighbors has a visible hole right at one of the moments where help is most felt. The hole is more credible-damaging than any drift risk a tightly scoped kind would carry.
- Members will improvise. Sarah will post Mochi as a `kind='wonder'` ("wondering if anyone has seen my cat?"), or as a Group post in the Oak Park interest Group, or as an Initiative ("Initiative: help me find Mochi"). The platform does not get to avoid the use case by not naming it. It gets to avoid *handling it well.*

**Working preference, not yet a decision:** Shape A. The composer-schema firewall is the actual abuse-prevention mechanism; the Item kind is what gives the firewall something to attach to. Shape B is too weak on discovery without being meaningfully stronger on safety. Shape C concedes a real loop to fear of a hypothetical drift. But the call is `weigh`-shaped at scope time, not exploration time.

---

## How this maps to existing primitives

| Primitive | Role in missing-pet shape (A) |
|---|---|
| **Member** | The pet owner (declares the Item). The responder (reports a sighting). The neighbor in the feed (receives an alert because of their Location affinity). |
| **Item (kind='missing_pet')** | The declaration. Strictly schemaed. Auto-expires. Carries the photo, description, last-seen Location, contact preference. |
| **Location** | The last-seen anchor. *Approximate*, not the Member's home. The smallest containing place is the scope of who sees the alert. |
| **Group** | Not used in Shape A. (Shape B is the Group-mediated alternative.) Could optionally be the home for adjacent surfaces — sightings, lost-pet community knowledge — without being the home for the active alert itself. |

### New substrate this would require

- **`items.kind` enum extension** — add `'missing_pet'`. Per [`item.md`](../systems/item.md), the kind enum is extensible without schema migration of the spine.
- **`item_missing_pets`** child table — `species` (cat / dog / bird / rabbit / other), `pet_name`, `description` (capped text, e.g. 280 chars), `photo_urls` (array, capped at 4), `last_seen_at` (timestamptz), `last_seen_location_id` (FK to `locations`, **not** Member's home), `microchipped` (bool), `collar_info` (capped text), `contact_method` (enum: `platform_dm`, `external_phone`, `external_email`), `contact_value` (capped, only if `contact_method != 'platform_dm'`), `expires_at` (timestamptz, default `now() + 7 days`, extendable once).
- **`item_responses.response_kind`** extension — add `'sighting'`. Sighting response carries `metadata`: `seen_at` (timestamptz), `seen_location_id` (FK to `locations`, approximate), `seen_photo_url` (nullable), `seen_note` (capped 200 chars).
- **Awareness-feed read path extension** — surface Missing Pet Items in feeds scoped to the place containing `last_seen_location_id`. Caps: at most 1 Missing Pet item per feed view at a time, with a small icon (not a banner).
- **No new event kinds needed.** Reuse `item.created`, `item.published`, `item.responded`, `item.fulfilled`, `item.state_changed`, `item.deleted`. The `state` enum on the spine already covers the lifecycle.

---

## Geographic scoping

The single most load-bearing constraint, and the one most prone to creep.

**The rule:** Missing Pet Items surface only in the awareness feed of Members whose Location affinities include the **smallest place containing the last-seen Location**. For Mochi, that's Oak Park (the neighborhood-equivalent place). Not the City of Sacramento. Not Sacramento County. Not "everyone within 5 miles."

**Why so tight:**
- Pet recovery is hyperlocal. Cats are typically recovered within 500m of where they were lost. Dogs travel further but rarely beyond a few miles within a few days. The neighborhood-equivalent place is the right scope.
- Scope creep is the abuse vector. "Let people choose a wider radius" is the move that turns a neighborhood-help feature into a broadcast surface. The author does not pick the radius.
- The place hierarchy is already there. Per [`location.md`](../systems/location.md), Places nest. Pick the smallest containing place and surface there.

**What this prevents:** A Member in Roseville cannot post a missing-pet alert that surfaces to every Member in the Sacramento metro. The geographic scope is the firewall against the alert system being used as a broadcast channel for anything else.

**What this requires:** The platform must have a place hierarchy populated at neighborhood granularity for any place where missing-pet alerts work. For Oak Park, that exists. For a rural area without a neighborhood-equivalent place, the smallest containing place might be the city, and that may be the right scope by default. The system tolerates this fall-back; it does not let the Member widen the scope.

---

## Time limits and expiry

**Default expiry: 7 days.** Long enough to cover the recovery median for cats and dogs; short enough that alerts do not pile up indefinitely in feeds.

**One extension allowed, +7 days.** A Member whose pet is still missing after a week can extend once. After that, the Item closes. The pet's page persists for archive and contact, but the Item stops surfacing in feeds. This is a deliberate friction point — at 14 days the platform's broadcast value has run out and the Member should be working other channels (shelters, recovery services).

**Expired Items are not deleted.** They move to a `closed` state. The page is reachable by link (e.g., a flyer's QR code still works). They are not in feeds. This matches the existing Item lifecycle states from [`item.md`](../systems/item.md).

**No "found" without resolution.** The author marks the Item `fulfilled` (pet recovered) or it expires. There is no third state. This keeps the resolution flow simple and the data clean for community memory ("3 cats reunited in Oak Park this year").

---

## Abuse prevention (structural)

The platform assumes adversarial use (P7). Named threats and mitigations.

**Threat 1 — Missing-pet alert as a freeform rant vehicle.** Member writes "Missing cat" but the description is actually a political rant or a complaint about a neighbor.
- *Mitigation:* The description field is capped (e.g., 280 chars) and labeled. The composer asks for species and last-seen Location as required fields. A photo is strongly encouraged. The structured schema makes a non-pet description visibly wrong — and easy to flag.
- *Mitigation:* Sightings respond *to* the pet alert; they do not become a comment thread on the Member's description. There is no thread.

**Threat 2 — Missing-pet alert as a scam vector.** "Reward for missing dog" with an external phone number that is actually a phishing line.
- *Mitigation:* `contact_method` defaults to `platform_dm`. External contact requires explicit composer toggle. The platform-mediated DM substrate (b2+) gives both parties identity persistence and the platform an abuse audit trail.
- *Mitigation:* No reward field. The Item schema does not include a monetary reward, because reward-bait is the scam pattern. Members can mention a reward in the (capped) description if they want, but the platform does not give it a structured slot or render it prominently.

**Threat 3 — One Member floods the feed with fake alerts.**
- *Mitigation:* One active Missing Pet alert per Member at a time. A Member with a current `published` Missing Pet Item cannot create another until it is closed or expired. (Edge case: a household genuinely loses two pets — the second Member of the household creates the second Item. The platform tolerates this rather than building a household-account abstraction.)
- *Mitigation:* Rate limit on creation per Member (e.g., 3 per rolling 90 days) to prevent a serial-creator pattern even with proper closure between Items.

**Threat 4 — Adjacent-use scope creep at the composer level.** Member tries to post a "missing person" or "lost wallet" Item using the missing-pet composer.
- *Mitigation:* The species field is an enum (cat / dog / bird / rabbit / other). "Other" is for guinea pigs and the long tail, not for "human." If a Member describes a human in the description with "other" selected, the description's structured nature makes that flaggable.
- *Mitigation:* The kind enum is `'missing_pet'`, not `'missing'`. The naming is the contract. A future "missing person" kind would be a separate `weigh`-shaped decision, not a config of this one.

**Threat 5 — Stale alerts pollute the feed.**
- *Mitigation:* 7-day default expiry with one extension. After expiry, no feed surfacing.

**Threat 6 — Members downvoting a legitimate alert.** A neighbor with a grievance downvotes Sarah's Mochi alert.
- *Mitigation:* The complaint-downvote affordance from [`policy.md`](../foundation/policy.md) is for complaint-style content. A Missing Pet Item is not complaint-style by schema. If downvotes are surfaced at all on Missing Pet Items (open question — probably not), they should be a separate signal for "this Item is misclassified or fake" routed to admin review, not a feed-suppression mechanism.

---

## The slippery-slope question

Once `kind='missing_pet'` exists, the next requests will come. The PM should pre-decide the answers so the precedent isn't set ad-hoc under pressure.

| Request | Likely answer | Why |
|---|---|---|
| **Missing person** | No. Different system, different bar. | The abuse vectors are categorically different — stalking, family-court abuse, fraudulent missing-person posts to track an estranged spouse. This requires its own exploration, its own kind, its own consent and privacy substrate, its own coordination with law enforcement and shelters. It cannot inherit the missing-pet shape. |
| **Lost wallet / phone / keys** | No. | The recovery probability does not justify the alert. Wallets that are going to be returned are returned via a local mechanism (the bartender, the lost-and-found, the address inside) without needing a broadcast. Wallets that are not going to be returned are not coming back. The alert burden on neighbors exceeds the expected value. |
| **Found pet (no owner known)** | Probably yes, as the symmetric kind or as a response shape. | This is the dual of missing-pet and shares the same recovery loop. Could be `kind='found_pet'` or could be a response shape on a Missing Pet Item plus a standalone surface. Worth its own exploration if and when missing-pet ships. |
| **Found item (wallet, phone, keys)** | No. | Same logic as lost wallet — the alert burden does not match the recovery probability. The Member who found the wallet can hand it to a business, drop it at a precinct, or leave it where they found it. The platform does not need to be involved. |
| **"Suspicious person" alert** | No, hard refusal. | This is the anonymous-complaint-feed failure mode. It is racially weaponized in practice. The platform does not have an alert affordance for "people I find suspicious," period. |
| **"Loose dog" or "aggressive dog" sighting** | Probably no, or as a sighting response only if a Missing Pet Item exists. | A standalone "warning: loose dog" surface drifts toward complaint posting about the dog's owner. A sighting response on a specific Missing Pet Item is bounded by the alert it responds to. |
| **"Crime tip" or "saw something concerning"** | Hard no. | Police function; not the platform's role; structurally the anonymous-complaint-feed failure mode. |
| **"Neighborhood-wide announcement" (e.g., water main break)** | No. | Municipal communication channel; not the platform's role. Members get this from city alerts. |

The pattern: **species enum + photo + structured fields is the substrate.** Anything that does not fit the species enum + photo pattern is a different system. Anything that fits but has higher abuse stakes (missing person) is a different system because the abuse stakes are categorical, not configurable.

---

## Privacy implications

Sarah's last-seen Location is *not* her home address. This is load-bearing.

**Why:** Per the doxxing-prevention design in [`business-jurisdiction.md`](../systems/business-jurisdiction.md) and the broader privacy baseline in [`principles.md`](../foundation/principles.md), the platform does not surface home addresses. "My cat was last seen at the corner of X and Y" leaks Sarah's home location to every Member who sees the alert if the corner is in front of her house. The composer's job is to make the approximate-location-not-precise-address pattern the default and easy.

**Mechanics:**
- The composer presents a place picker scoped to the smallest containing place (Oak Park). The Member picks an approximate point or a small area — a block, a park, a Location they already follow. Not a street address.
- The platform never asks for "your home address." Sarah's home Location (from `members.home_location_id`) is used to *route* the alert geographically (via the place hierarchy) but is not shown to other Members.
- For Items with `last_seen_location_id` pointing to a Location of `kind='area'` (Oak Park as a neighborhood), the displayed scope is the area. For Items pointing to a `kind='point'` Location (a specific park), the point is displayed but only because the Member chose to share that specific public location.
- Sightings inherit the same constraint. A neighbor reporting "I saw Mochi in my backyard" picks an approximate Location (their block, not their house). The platform refuses to render a street address in the sighting response.

**What about the contact method?** If Sarah picks `external_phone`, her phone number is visible to anyone who sees the Item. That is Sarah's explicit choice — the composer warns. The platform-mediated DM default avoids this for the cautious. The Member who wants the phone number for faster-response gets it; the Member who values privacy uses platform DM.

**What this protects against:** A bad actor scanning Missing Pet alerts to harvest home addresses. The schema simply does not contain the address.

---

## The fix-it path framing

[`location.md`](../systems/location.md) § Not a complaint surface establishes the pattern: the platform's response to "I have a problem with this place" is to channel it into a constructive Item kind — a Wonder ("would folks be into fixing the broken playground?") or an Initiative ("let's organize the playground rebuild"). The platform redirects complaint energy into coordination energy.

Missing Pet fits this pattern naturally, with a twist. The energy being channeled is not complaint — it is *fear and rallying*. The Member is not complaining about a problem; they are asking for help with a problem. But the structural lesson is the same: the platform provides a *named, structured shape* for the action they want to take, rather than a freeform surface. The shape is the help; the freeform surface would be the harm.

A useful frame: **"missing pet" is to "lost pet" as "Initiative" is to "complaint."** The platform names the constructive verb (lead, host, wonder, ask, *report-as-missing*) and provides a composer for it. It does not provide a composer for the unstructured emotion behind the verb.

---

## Relationship to other systems

| System | Connection |
|---|---|
| [`item.md`](../systems/item.md) | This is an extension to the kind enum and the child-table pattern. Shape A is structurally an Item with a strict child schema and a short lifecycle. |
| [`location.md`](../systems/location.md) | Locality scoping is the firewall. Last-seen Location, place-hierarchy-driven scope, the doxxing-prevention default on home addresses. |
| [`policy.md`](../foundation/policy.md) | This exploration pushes against the accountable-participation commitments. It is only acceptable if the structural firewall (Item kind, schema, scope, expiry) is strong enough to keep this from becoming the wedge that opens the platform to general posting. |
| [`groups.md`](../systems/groups.md) | Shape B (Group-mediated) would lean on kind='interest' Groups. Shape A does not — the surface is platform-wide within the locality scope, not Group-gated. |
| [`accountability.md`](accountability.md) | Sibling pattern: structured concern reports, not freeform reviews. Same shape, different content. |
| [`vetting-and-vouching.md`](vetting-and-vouching.md) | Sibling pattern: structured knowledge contributions with tier/category/sentiment, not freeform comments. Same shape, different content. |
| [`agent-assistance.md`](../systems/agent-assistance.md) | Agent surface: a Member's assistant could create the Missing Pet Item on their behalf with a single instruction ("Mochi is missing, last seen this morning, post the alert"). The action-layer scoped capabilities apply. |

---

## Open questions

1. **Shape A vs. Shape B vs. Shape C — the actual decision.** Working preference is Shape A, but the call belongs to `weigh` at scope time. The lexicographic close-call rule applies: does the structural firewall (composer schema + scope + expiry) protect member safety and platform health well enough to clear the third filter (data protection — addressed in the privacy section) and the fourth (mutual benefit, reversible — yes, the kind enum is reversible by deprecation if the surface degrades)?

2. **Bundle assignment.** This is almost certainly *not* b1. b1 ships the producer + community substrate; Missing Pet is an adjacent loop, not a core one. The dependencies (Item child tables for new kinds, sighting response shape, item-scoped DM substrate at b2+ for `contact_method='platform_dm'`) point at b2 or later. PM call at planning time.

3. **Found-pet symmetry.** Does the system ship as just Missing Pet, or does Missing Pet + Found Pet ship together? Found Pet is the obvious symmetric kind and may be necessary for the loop to close (Sarah's neighbor reporting a sighting is one shape; a Member who actually has the cat in their backyard wanting to declare "found cat" is another). Could be a response kind on an existing Missing Pet Item, or its own kind, or both. Defer the design choice to scope time, but the loop is not complete without it.

4. **Reward field, explicitly absent.** Should the system allow Members to declare a reward? The case for: real, increases response rate, common practice. The case against: scam-bait pattern, asymmetric across Members (wealthier owners get more help), feels off-brand for a platform built on neighborly help rather than transactional incentives. Working answer: no structured reward field; Members can mention a reward in the (capped) description if they choose. PM ratification needed.

5. **Microchip-registry integration.** Many missing pets are recovered because someone scans the microchip at a vet or shelter. The platform could integrate with public chip registries to let a Member who finds a pet look up the owner without going through the alert. This is forward-looking and probably out of scope for the first ship; flag for future exploration.

6. **Multi-place pets.** A pet that lives in two households (joint custody, a barn cat that roams between neighbors) doesn't have a single home Location. The shape mostly tolerates this because the last-seen Location is what matters, not the home Location. But the "one Missing Pet alert per Member" rule may need to flex if two co-owners both want to post. Probably fine; flag in case it comes up.

7. **Geographic scope edge cases.** What about a pet that goes missing while traveling (Member visiting another city)? The last-seen Location is in another place; the alert routes there even though the Member's home affinity is elsewhere. This is correct behavior — the alert needs to reach the people who might find the pet, not the people who know the Member. Worth confirming in the composer copy.

8. **Accessibility of the photo requirement.** A Member without a photo of their pet (rare but possible — a new rescue, a phone wiped of photos) should not be blocked. Photo is "strongly encouraged" not required. Description carries more weight in that case.

9. **The "is this a vet emergency" path.** A Member whose pet is missing might genuinely need other resources (vet emergency hotline, microchip registry, local shelters). Should the composer link to these? Probably yes, as informational sidebar, not as platform commitments. PM call on whether to maintain a curated list per place.

10. **Closing the loop on slippery slope.** When the missing-person request comes — and it will — the PM needs to be ready with the structural answer (different system, different bar) rather than reaching for the missing-pet substrate as a quick win. The pre-decided answers in the *slippery slope* table above need PM ratification before missing-pet ships, not after.

---

## What this is NOT

- **Not a community-post surface.** No freeform text big enough to carry a non-pet message. The composer schema is the firewall.
- **Not a complaint surface.** The Item structurally cannot contain a complaint about a person, business, or place. There is no field for it.
- **Not a Location feed or Location wall.** The locality scoping is a read-side filter on the awareness feed (which already exists), not a new Location-scoped surface. Per [`location.md`](../systems/location.md) and [`policy.md`](../foundation/policy.md).
- **Not a broadcast channel.** The author cannot widen the scope. The system widens or narrows based on the place hierarchy.
- **Not a payment surface.** No reward field. Per [`payments.md`](../systems/payments.md), platform payment rails are b2+ and gated; even when they exist, they are not for this.
- **Not a moderation lift the platform takes on.** The schema is the moderation. Items that violate the schema are flaggable; admin review applies the same way it does for any other Item misuse. No special missing-pet moderation team.
- **Not the wedge for opening freeform posting.** If this ships, it ships *because* the structural firewall holds. If the firewall does not hold, the answer is to fix the firewall or close the surface — not to relax the structural commitments in [`policy.md`](../foundation/policy.md) and [`location.md`](../systems/location.md).
