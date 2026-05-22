# Bundle Themes

**Status:** Drafted 2026-05-18 — pending PM review. The sequencing layer above [`b1-primitives.md`](b1-primitives.md). Slices each bundle into release-sized sub-themes so the team ships every 1–2 weeks rather than all-at-once. Companion to [`b1-work-map.md`](b1-work-map.md) (the menu of work per sub-bundle).

**Depends on:** `b1-primitives.md`, `loops.md`, `primitives.md`, `canonical-examples.md`, `principles.md` Part 6 (metrics), `groups.md`, `member.md`, `location.md`, `item.md`, `discovery.md`, [`../../product/systems/stewardships.md`](../../product/systems/stewardships.md).

**What this doc does.** `b1-primitives.md` defines what ships in bundle 1 in primitive and cluster terms. This doc takes that scope and *sequences* it — what ships first, what second, what depends on what, and what each release is tested against. The unit of release is a **sub-bundle**, decimal-numbered (`b1.0`, `b1.1`, …). Each sub-bundle is small enough to ship in 1–2 weeks, demoable on its own, and metered against canonical examples.

---

## Vocabulary

To prevent the same confusion that produced the prior `S`/`T` ambiguity:

| Symbol | Meaning | Source |
|---|---|---|
| **b** | **Bundle.** Major release phase (`b1`, `b2`, `b3`). Defined in `b1-primitives.md`. The unit of "where we are in the platform's lifecycle." |
| **b1.N** | **Sub-bundle.** A sequenced slice within a bundle, decimal-numbered. `b1.0` ships before `b1.1`, etc. The unit of "what ships next." |
| **T** | **Tier within a system spec** (`T1`, `T2`, `T3`). Defined per-system in each system spec. A system has tiers; tiers ship inside bundles. The unit of "how mature is this system." |
| Theme name | **Plain-English label** for a sub-bundle (e.g. "Show up & be seen"). The user-facing description of what the release is for. |

Example reading: *"Producer Bulletin T1 ships at b2.0."* Producer Bulletin (a system) is at its first tier; it lands inside bundle 2's first sub-release.

This doc does not invent the bundle / tier scheme — it inherits both from existing specs. It introduces only the sub-bundle decimal notation and the theme names.

---

## How to read each theme

Each theme below carries:

- **What ships** — the primitive surfaces and behaviors that go live
- **Doesn't ship** — what is deliberately held back
- **Canonical examples served** — which entries in `canonical-examples.md` this theme makes meaningfully better. Per that doc's rule: every release must move at least one canonical example meaningfully — depth over breadth when forced to choose.
- **Loops advanced** — which of the 13 loops in `loops.md` this theme exercises
- **Metrics** — what we measure to know if it's working
- **Dependencies** — what must ship first

Themes are sequenced strictly; later themes assume earlier themes are live.

---

## Bundle 1 — the MVP arc

**Hypothesis being tested across b1.** Ordinary people will step forward where they live, and their neighbors will show up for them. Per `b1-primitives.md`. The b1 success metric is behavioral — Item creation across kinds, response rate, return visits, cross-kind engagement — not commerce volume.

**Total b1 scope.** Six core themes (`b1.0`–`b1.5`), one care-floor theme (`b1.6`), one cross-cutting schema commitment (`b1.x` — applies across all of b1). Target window: 6–10 weeks end-to-end, 1–2 weeks per theme.

### b1.x — URL namespacing (cross-cutting schema commitment, lands with b1.0)

A schema decision that must be made before any public URL exists, because it constrains slug uniqueness from day one. Not its own ship-theme — it ships *with* b1.0 as the URL convention every later theme inherits.

**The pattern:**

| Primitive | URL | Uniqueness scope |
|---|---|---|
| Member | `/m/[handle]` | Globally unique |
| Location | `/l/[slug]` | Globally unique within `kind` |
| Affiliate Group with anchor Location | `/g/[location-slug]/[group-slug]` | `(anchor_location_id, slug)` |
| Affiliate Group without anchor | `/g/[group-slug]` | Globally unique |
| Business Group | `/g/[location-slug]/[group-slug]` | `(anchor_location_id, slug)` |
| Items | kind-specific paths (`/p/`, `/s/`, `/e/`, `/i/`, etc. per `item.md`) | Globally unique per kind |

**Why it matters.** Two "Tater Tot Dog Store" business Groups in different cities should not collide. Folsom's becomes `/g/folsom/tater-tot-dog-store`, Sacramento's becomes `/g/sacramento/tater-tot-dog-store`. The locality-first index still routes "tater tot dog store near me" to the right one for the visitor.

**Federation shape.** This URL pattern is the natural carve-out for Loop 13 federation later. A Sacramento subdomain is one step away.

**Schema impact.** `groups.slug` becomes unique on `(anchor_location_id, slug)` for locality-bound Groups, globally unique for Groups without anchor.

### b1.0 — Show up & be seen *(the awareness floor)*

**What ships:**
- Member sign-up, profile, public `/m/[handle]` page
- Locality default per ADR-4 (geolocate or city pick → `members.home_location_id`)
- Privacy controls per `member.md` b1 set: profile visibility, item display, follow display, locality precision, allow DMs (substrate)
- Browse Items + Members at city scope, no login required for read
- URL namespacing per `b1.x` lands here
- Soft-delete with credit preservation per the people-first commitment

**Doesn't ship:** DM surface (substrate yes, UI at b2 per `b1-primitives.md`); follow stream (storage yes, surface b2); search beyond city-scope browse.

**Canonical examples served:** all of them — every example assumes a Member can sign up and be found. b1.0 is the prerequisite for the rest.

**Loops advanced:** Loop 3 (Land here) — the locality-first index becomes addressable to a real Person with a real locality.

**Metrics:**
- Signups per week
- Profile completion rate (photo, locality, description)
- Locality-set rate (% of signups with home Location set within 7 days)
- Day-3 return rate
- Day-30 return rate (the harder bar)

**Dependencies:** none. This is the floor.

### b1.1 — Groups people can join *(the affiliate floor, lightweight)*

**What ships:**
- Create a Group in the five affiliate kinds: `place`, `interest`, `practice`, `event_anchored`, `family`
- Required at create: name, kind, one-line purpose, optional anchor Location. That's it.
- Group page with who / where / what
- Join / leave (Member-controlled own membership)
- Group memberships visible on Member profile per privacy controls
- Group index `/g/`
- Steward role on affiliate kinds (the seed of governance-without-rails)
- Standing-tier substrate per `groups.md` (`member_has_standing_presence`) — read path only; the surface that uses it lands at b1.2

**Doesn't ship:** Group feeds and discussion (b2); proposal/voting tooling (b2+); algorithmic Group recommendations.

**Canonical examples served:** #7 (Bumble BFF Refugees — the affinity-first Group case) directly. #1 and #5 (Drake's Run Club, Barn Movie Night) become *optionally* Group-shaped — the regulars can declare a Group if they choose to.

**Loops advanced:** Loop 1 (Find your people) — partial; the affiliate side, not yet the gathering side.

**Metrics:**
- Groups created per week (by kind)
- Median time from "Group created" to "≥3 members"
- Joins per Group (median, p90)
- % of Members in ≥1 Group by day 14

**Dependencies:** b1.0 (Members exist; locality default works).

### b1.2 — Business Groups & makers *(the producer floor, heavier requirements)*

**What ships:**
- Create a `kind='business'` Group (sole prop = Group of one per `groups.md`)
- Required at create: name, founder = operating owner, anchor Location, ZIP for Tier 0 self-attested locality per `business-jurisdiction.md`
- "Become a Maker" CTA + `maker_mode_enabled` toggle per `member.md` Maker mode (ADR-12)
- Business Group page with "Claimed local owner" badge (Tier 0)
- The substrate read path from b1.1 — `member_has_standing_presence` — becomes user-visible (Maker surfaces render only for Members with standing presence)

**Doesn't ship:** products or services yet (those are b1.4); locality verification Tier 1/2 (b2); bulletin (b2); follower fan-out surfaces (b2); confirmation flow for `member` claims (b2).

**Canonical examples served:** #2 (Ferrari Fisheries), #3 (Quarterly Dip Vendor), #4 (food truck) — all three become *creatable* (the Member can declare themselves a maker) even though their first Item is the b1.4 surface. The maker identity lands first; the items come next.

**Loops advanced:** Loop 7 (Make and be found) — partial; the Maker exists on the platform but hasn't yet declared the thing they make.

**Metrics:**
- Business Groups created per week
- Makers onboarded per week (Sacramento target per `maker_outreach_list.md`: 30–50 by week 4 of recruitment)
- % of business Groups with Tier 0 locality claim set
- Maker-mode walkthrough completion rate

**Dependencies:** b1.0, b1.1.

### b1.3 — Gather *(the real-world floor)*

**What ships:**
- Item `kind=gathering` (one-off + recurring with `recurrence_metadata`)
- Attach to Locations (permanent + recurring-temporary)
- RSVP response per `item_responses`
- Surfaces on home feed, Group pages, Location pages
- The monthly dinner-circle practice has its native shape here
- The hashtag autocomplete API per `item.md` API surfaces lands here (the gathering composer is the first surface that uses it; the wonder/product/service composers reuse it)

**Doesn't ship:** Initiative kind (b2.2); Offer/Ask kinds (b2.1); post-event check-in surface beyond the basic RSVP (b3); paid event surfaces (deferred indefinitely).

**Canonical examples served:** #1 (Drake's Run Club), #5 (Barn Movie Night), and #8-as-TODO (Wonder slot) — though #8 also depends on b1.5. The Run Club and Barn Movie Night both light up: a public, locality-first, shareable page anchored at Drake's, with a recurring time, a clean URL, and RSVP.

**Loops advanced:** Loop 4 (Gather regularly), Loop 1 (Find your people) — fully; the gathering side now exists alongside the affiliate side.

**Metrics — the headline product test:**
- Gatherings posted per week
- RSVPs per gathering (median)
- Recurring-gathering count (proxy for real-world community formation)
- Estimated real-world attendance (RSVPs × actual-show-up rate, sampled via post-event prompt at b2)

**Dependencies:** b1.0, b1.1.

### b1.4 — Find & follow *(the maker payoff)*

**What ships:**
- Item kinds `product` and `service` per `item.md` T1
- Follow primitives: Member-to-Member follow (storage; stream is b2), Save an Item, Location follow (`member_location_affinities.affinity_kind='follows'`)
- Locality-first discovery index — the `discoverable_items` materialized view per `discovery.md` and `item.md`
- The locality-first index is the first surface that anonymous Members can use end-to-end (Loop 3 "Land here" — `b1-primitives.md` lists this as full at b1)
- Item-level QR cards per `qr-onboarding.md` — Member-requestable, generated on demand for any Member-owned Item

**Doesn't ship:** Follow stream surfaces (b2 per `member.md`); Producer Bulletin (b2 per `producer-tools.md`); endorsements (b3 per `service-provider.md`); ratings (never — per the categorical-failures commitment).

**Canonical examples served:** #2 (Ferrari Fisheries) and #3 (Quarterly Dip Vendor) finally have their full shape — the irregular-Item product surface, followers, and the locality-first index. #4 (food truck) gets product + service Items with multi-Location attachment. #10-as-TODO (find a local pro, plumber/vet/mechanic) becomes creatable as a service Item.

**Loops advanced:** Loop 7 (Make and be found) — full. Loop 8 (Follow what you love) — partial (storage; stream b2). Loop 9 (Find a local pro) — substantively, since `service-provider.md`'s Saved-not-Follow distinction is honored. Loop 3 (Land here) — full.

**Metrics:**
- Products/services published per week
- Follows per maker (median)
- Search-to-find rate (of searches, what fraction result in landing on a maker / service / community page)
- Find-to-engage rate (of pages landed on, what fraction produce a follow, save, RSVP, or message)

**Dependencies:** b1.0, b1.1, b1.2 (makers must exist to publish products/services).

### b1.5 — Wonder *(latent demand → demand-signal pipeline)*

**What ships:**
- Item `kind=wonder` per `item.md` T1
- "I'd be in" response per `item_responses`
- Wonder feed at locality scope
- `item.converted` event substrate reserved (Wonder → Gathering / Initiative conversion lands surface-side at b2.2)

**Doesn't ship:** Initiative conversion surface (b2.2); push notifications on wonder traction (b2+); per-Group wonder scoping (b2 once Group feeds exist).

**Canonical examples served:** #8-as-TODO (Wonder / Float an idea — Loop 2) — this is the slot's first surface. Until b1.5 ships, slot #8 cannot be filled with a real instance.

**Loops advanced:** Loop 2 (Float an idea) — full.

**Metrics:**
- Wonders posted per week
- Median "I'd be in" responses per Wonder
- Wonders reaching ≥3 "I'd be in" within 14 days
- Wonders that convert to a gathering Item at b2.2+ (substrate metric ready at b1.5; the conversion event itself fires only after b2.2 ships)

**Sequencing note.** Wonder is cheap (one Item kind, one response kind, one feed) and serves the lowest-friction engagement verb on the platform. There is a case for moving it earlier (alongside b1.3) so newcomers who won't post a product or host a gathering have an even lower-effort first action. Open question; the current order keeps it after b1.4 so it benefits from a populated locality-first index. Confirm during b1.3 design.

**Dependencies:** b1.0, b1.1, b1.4 (Wonders need the locality index to be useful).

### b1.6 — Stewardships *(the care floor — the smallest ownership step)*

**What ships:** per [`stewardships.md`](../../product/systems/stewardships.md) in full.

- `group_stewardships` child table on Groups (one row per Group declaring itself a stewardship)
- Seven curated templates with on-platform starter copy and links to canonical external playbooks: tool library, seed library, repair café, Little Free Library, Little Free Pantry, community fridge, mutual aid pod / buying club
- Template-kind filter on `/g/` and "Stewardships here" section on `/l/[slug]`
- Three event types (`group.stewardship_declared`, `_upkeep_changed`, `_archived`)
- Three action handlers

**Doesn't ship:** inventory management (use myTurn et al. off-platform); money flow; legal entity formation tooling; stewardship federation surfaces (b3+); rotation algorithms (b2+).

**Canonical examples served:** #11-as-TODO (Steward what we built — Loop 12) — the slot's first surface. The reserved framing in `canonical-examples.md` — "A garden, tool library, repair café, kitchen co-op, or shared space that is keeping itself alive on group-text-and-spreadsheets energy" — is exactly what this theme serves. As soon as a real Sacramento instance shows up (or is recruited via outreach), it fills slot #11.

**Loops advanced:** Loop 12 (Steward what we built) — full. Loop 11 (Pool resources) — partial; the *care* dimension of pooling ships; capital pooling defers to b3.

**Metrics — per [`stewardships.md`](../../product/systems/stewardships.md) § Metrics:**
- Stewardships declared per 1000 Members per month
- % of stewardships still active at day 30 / 90 / 180 / 365
- Median active stewards per stewardship over time
- Action-diversity follow-on rate (stewardship participants vs. matched non-participants)
- Stewardship → kind='business' Group transition rate (the headline thesis metric)

**Dependencies:** b1.1 (Groups), b1.3 (recurring Gatherings — used as the upkeep rhythm anchor).

---

## Bundle 2 — the relational deepening

**Hypothesis being tested across b2.** Once Members can find each other and gather, the platform's job is to let relationships become *recurring* and *reciprocal*. Substrate from b1 (follows stored, event log, locality index) becomes user-facing surface. Mutual aid verbs (Offer, Ask) and coordination verbs (Initiative T1) land.

### b2.0 — Producer Bulletin T1

Per [`producer-tools.md`](producer-tools.md). Member-authored broadcast to followers (Substack-light). The payoff for a b1.4 follow. **Canonical examples served:** #2, #3, #4 (Ferrari, dip vendor, food truck — their followers now hear from them). **Loops:** 5 (Subscribe), 7 (Recur), 8 (Follow).

### b2.1 — Offer / Ask

Per `item.md` T2 (`kind='offer'`, `kind='ask'`). The mutual-aid verbs that make Family 2 land. **Canonical examples served:** #9-as-TODO (Share / Ask paired — Loops 5+6). **Loops:** 5, 6.

### b2.2 — Initiative T1 (coordination floor — moved forward from b3)

Per the conversation history. The full Initiative spec (pledges, capital infrastructure, CDFI handoff, securities-compliant capital structures) remains b3+. The **coordination-only** layer ships at b2.2: declare an Initiative, signal interest, convert-to-Gathering for the meeting where real-world work happens, `outcome` field that closes the Initiative when it concludes off-platform.

What the platform does NOT do at b2.2: form the entity, hold money, draft bylaws, file paperwork. Per the `groups.md` commitment — co-owning, voting, distributing are off-platform verbs the platform records but doesn't drive.

**Canonical examples served:** the Cafe Capricho example (#6) becomes structurally addressable — a community can organize *around an absence* (an empty commercial space, a closing business) via an Initiative. **Loops:** 10 (Start something), Wonder → Initiative escalation via the `item.converted` event from b1.5.

### b2.3 — Locality verification Tier 1

Per [`business-jurisdiction.md`](business-jurisdiction.md). SOS-verified local owner badge. Tier 0 ships at b1.2; Tier 1 SOS lookup ships here. The "Verified local owner" badge in the discovery index.

### b2.4 — Producer Growth Dashboard T1

Per [`producer-tools.md`](producer-tools.md) T1. Followers, profile health, activity. The BI dashboard backing the producer recruitment pitch.

### b2.5 — Follow streams + notifications

Per `member.md` and `loops.md`. The follow surface from b1.4 substrate. Email at b2.5; push notifications b3.

### b2.6 — Group feeds (selectively)

Per `b1-primitives.md` deferral list — "Communities exist at b1 as a primitive; Community feeds with discussion and structured posting defer to b2." Lands here, with care. The anti-Nextdoor commitments hold: messaging-scope item-or-group-only, complaint downvote/removal, "create an Item to lead the fix" replacing the complaint surface.

---

## Bundle 3 — the institutional substrate

**Hypothesis being tested across b3.** Members who have participated in gathering, trade, mutual aid, and care can now begin to *own* things together. Initiatives mature with pledges. Stewardships compound into pooled-resources structures. The discovery layer matures.

**Still no payments. Still no securities. Still no fee collection.** Per the cross-cutting commitment that money flows, capital instruments, and formal cooperative governance are downstream of b3.

### b3.0 — Initiative T2 (with structured pledges)

Pledge verbs (capital, time, customers, mentorship), accumulation against a stated target, handoff to partner CDFIs for the actual financial transaction. The Cafe Capricho example (#6) lights up end-to-end.

### b3.1 — Steward role + pooled-resources substrate

Loop 11 (Pool resources) — the structured-pledges accumulation, the "we have committed N hours / N dollars / N people toward this thing" surface. Capital flow remains off-platform; the platform records.

### b3.2 — Discovery T2

Per `discovery.md` T2. The scoring core matures — graph proximity, time decay, social proof at scale. Still no engagement-optimized feed; still no time-on-platform metric.

### b3.3 — Producer Dashboard T2 / T3

Per `producer-tools.md` T2/T3. Bulletin analytics, follower segmentation, peer benchmarks. T3 competitive intelligence opt-ins (audience overlap matchmaking, revenue context — both Member-owned).

### b3.4 — Locality verification Tier 2

Document-uploaded local-owner verification. OCR pipeline or manual review.

### b3.5 — Federation substrate (Loop 13 — architectural, no user surface)

The URL namespacing from b1.x earns its keep here. A Sacramento subdomain becomes feasible. The deeper institutions — the bank, the cooperative services federation, the intelligence layer, the education arm — have somewhere to grow out of.

---

## What never ships in this arc

Per the categorical commitments throughout the project. Listed so they cannot install themselves by default:

- **Payments / commerce rails on-platform.** Items surface availability and contact; transaction is off-platform.
- **Ad injection of any kind.** Categorical failure per `principles.md` Part 3.
- **Data sales or licensing.** Categorical failure.
- **Star ratings / gatekeeping ratings.** Permanently deferred per `service-provider.md`.
- **Cooperative-style coordination on-platform** (voting, distributions, treasury, securities filings). Deferred indefinitely per `groups.md`. Off-platform verbs the platform may record but does not drive.
- **Engagement-optimized feed / time-on-platform metrics.** Categorical failure.
- **Auto-assigned Communities or Groups** based on geography or demographics. Categorical failure per `principles.md`.
- **Founder-as-permanent-CEO patterns inside Communities.** Categorical failure.
- **Location-scoped messaging walls.** The anti-Nextdoor commitment per `policy.md`.

---

## Testing harness — how each theme proves itself

Every theme is graded against:

1. **Canonical examples.** Does it move at least one canonical example meaningfully? (Per the rule in `canonical-examples.md`.) Depth over breadth when forced to choose — a theme that goes deep on one example is preferred to one that nudges three. If a theme cannot find even one example, the scope is wrong.
2. **Loop coverage.** Does it advance the loops it claims to? Verified by walking one canonical example end-to-end through the theme's surfaces.
3. **Foundational principles.** Does it pass the P1–P8 Decision Test in `principles.md`? Any categorical failure (Part 3) is disqualifying.
4. **Metrics.** Do the metrics distinguish success from noise? If a "successful" theme would look identical in the dashboard to a "failed" theme, the metrics are wrong.
5. **Architectural commitments.** ADRs in `planning/DECISIONS.md` — every theme inherits, none weakens.

The Evaluator agent in the pipeline checks all five gates before any theme is marked shipped.

---

## Sub-bundle dependency graph

```
b1.x (URL namespacing, lands with b1.0)
  ↓
b1.0 (Show up & be seen)
  ↓
b1.1 (Groups people can join)
  ↓
  ├──→ b1.2 (Business Groups & makers)
  │      ↓
  │    b1.4 (Find & follow) ← also depends on b1.0
  │      ↓
  │    b1.5 (Wonder) ← also depends on b1.0
  │
  └──→ b1.3 (Gather)
         ↓
       b1.6 (Stewardships) ← also depends on b1.1
```

**Hard order:** b1.x with b1.0 → b1.1. After that, the two branches (b1.2 → b1.4 → b1.5, and b1.3 → b1.6) can ship in parallel if engineering capacity allows. The cross-dependency between b1.4 and b1.5 (Wonder benefits from a populated index) is soft — Wonder can ship without it and gain richness when b1.4 ships.

**b2 sequence** depends on b1 being complete. Within b2, b2.0 (Producer Bulletin) depends on b1.4 (follow substrate). b2.2 (Initiative T1) depends on b1.5 (Wonder, for the conversion event). b2.6 (Group feeds) depends on b1.1.

**b3 sequence** depends on b2 being substantively complete, especially b2.2 (Initiative T1) and b2.4 (Producer Growth T1).

---

## Open questions

1. **Wonder placement.** Move b1.5 (Wonder) earlier — alongside or before b1.3 (Gather) — to lower first-action friction for newcomers? Working answer: keep current order; revisit during b1.3 design with real signup-to-first-action data.
2. **Stewardship → canonical example #11.** When does a real Sacramento stewardship instance fill slot #11? Working answer: as soon as one of the founding 30–50 makers (or their network) shows up with one. Could be a community garden, tool library, or repair café in Sacramento. If none surfaces in the recruitment phase, the platform team writes a synthetic-but-plausible instance based on a real Sacramento situation observed in person.
3. **b2 sequencing inside the bundle.** Is the b2.0–b2.6 order right? Producer Bulletin first feels right because it's the most leveraged follow-payoff, but Offer / Ask (b2.1) is the more democratic test of mutual aid. Confirm at b2 design.
4. **b1.x URL namespacing edge cases.** What URL does an affiliate Group with no anchor and a colliding handle get? Working answer: globally-unique within Groups-without-anchor. Confirm with a real collision (which we won't have until ~100 Groups exist).
5. **Sub-bundle release cadence vs. theme size.** Some themes (b1.6 Stewardships) are larger than others (b1.x URL namespacing). Should the larger themes be split further? Working answer: no — b1.6 is still 1–2 weeks because the platform footprint is small (one child table, three events, seven curated templates). Confirm during build.
6. **Local copy of `canonical-examples.md` reconciliation.** PM has noted a local version that may have more filled examples than the project version (which has 7 filled, 4 TODOs, and 1 supplementary). Sync local back into the project so the pipeline sees the full canon.

---

## Comments

This document is the sequencing layer that the build pipeline reads when deciding what to work on next. `b1-primitives.md` answers *what's in scope for the MVP*; this doc answers *what ships next within that scope*; [`b1-work-map.md`](b1-work-map.md) answers *what work is in each sub-bundle, tagged for scope decisions*. Together the three give the planning tier a sufficient view: scope from primitives, sequence from themes, menu from work-map.

The decision to slice b1 into seven sub-bundles (b1.0 through b1.6, plus the cross-cutting b1.x) is the structural commitment to *shipping often*. It is what makes the difference between a six-month b1 release that lands as one giant motion and a seven-stage rollout where the team learns from real users at every step. The smaller the slice, the faster the loop between "we built it" and "we know if it works." Per `principles.md` Part 1 — lightweight, performant, evolvable — the slicing posture honors P1 at the release level, not just the feature level.

The canonical-examples-first testing posture is the discipline that keeps the slices honest. Every theme has to point at at least one real situation in `canonical-examples.md` that it makes meaningfully better. If a theme cannot find its example, the theme is wrong — not the example.

**Buy close. Build community. Build the future together.**
