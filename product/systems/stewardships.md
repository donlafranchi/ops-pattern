> **Relocated 2026-05-19** from `planning/bundles/`. Still bundle-shaped (schema delta +
> ship-theme framing). Parked here as the canonical home for the stewardship system; needs
> a rewrite into proper system-spec form. Until then treat the schema and constraints as
> authoritative and the ship-theme framing as legacy.

# Bundle: Stewardships (ship-theme S6.5)

**Status:** Drafted 2026-05-18 — pending PM review. Slots into b1 as a discrete ship-theme between Wonder (S6) and the b2 themes. Depends on Groups, Locations, Items (gathering), and the existing `steward` role on affiliate Group kinds. No new primitive; one small child table on Groups.

**Depends on:** `b1-primitives.md`, `groups.md` (T1, `steward` role on affiliate kinds), `location.md` (T1, permanent + recurring-temporary), `item.md` (T1, kind=gathering), `loops.md` (Loops 11–12), `design-philosophy.md` (§4 Community Ownership Arc), `platform-promise.md` (shared infrastructure commitment), `canonical-examples.md`.

**North stars served:** Loop 11 (Pool resources) — partial, the lightest version. Loop 12 (Steward what we built) — full, the canonical surface. Family 1 (gathering rhythm) — reused as the upkeep cadence.

---

## What this document does

The smallest unit of community ownership is not capital — it is **care**. Members agree to look after a shared thing together, on a rhythm, with a steward. Money flows and legal entities are downstream of that social pattern, not prerequisites for it.

This bundle ships the platform's first ownership surface as **a thin metadata layer on existing primitives**: a `stewardships` record on a Group, plus seven curated templates that pre-fill the scaffold and point members at the canonical real-world playbooks that have already been pulled off in the wild. The platform does not invent these patterns — it makes them discoverable, recordable, and durable enough that step one is trivial.

The hypothesis it tests: **ordinary people, given a one-tap path to a proven template plus the locality-first index, will start and sustain small-scale shared-resource projects in their neighborhood.** If they do, the b3 ownership rails (Initiatives, pooled capital, federation) have something to grow out of. If they don't, we know before we build the rails.

This is the seed of the Mondragon trajectory in miniature. A seed library is not a cooperative federation. But a town that has run a seed library, a tool library, and a repair café for three years has the social capital, the named stewards, the rhythm, and the visible track record that the next step requires.

---

## The hypothesis the bundle is testing

Three claims, all falsifiable inside the first six months of S6.5 going live:

1. **Members will start stewardships when the path is one tap and the template is proven.** Measured: stewardships declared per 1000 Members per month.
2. **Stewardships survive the first six months at a rate consistent with the real-world precedents.** Measured: % of stewardships still active at day 180 (not dormant, has a recurring gathering on the calendar, has ≥1 active steward).
3. **A Member who participates in a stewardship is materially more likely to take a deeper ownership step later** — host a gathering, join a kind='business' Group, support an Initiative. Measured: action-diversity follow-on rate, stewardship participants vs. matched non-participants.

If (1) and (2) both pass, the substrate is real. If (3) passes, the ownership arc is real. If (1) passes but (2) fails, we're recruiting the wrong stewards or the templates aren't durable enough. If (1) fails, the locality-first index isn't surfacing them — a discovery problem, not an ownership problem.

---

## Schema delta

One new child table on Groups, three event types, one enum extension. That's it.

### `group_stewardships`

One row per Group operating as a stewardship. Most Groups never have this row; a Group with this row is *declaring* that it looks after a shared thing.

```sql
create table group_stewardships (
  group_id uuid primary key references groups(id) on delete cascade,
  template_kind text not null
    check (template_kind in (
      'tool_library',
      'seed_library',
      'repair_cafe',
      'little_free_library',
      'little_free_pantry',
      'community_fridge',
      'mutual_aid_pod',
      'buying_club',
      'other'
    )),
  shared_thing_description text not null,        -- "the box on the corner of 4th and J," "the 47 tools in the back of Drake's basement"
  upkeep_gathering_item_id uuid                  -- the recurring Gathering Item that anchors the rhythm
    references items(id) on delete set null,
  external_network_url text,                     -- "we're registered with Repair Café Foundation," etc.
  started_at timestamptz not null default now(),
  archived_at timestamptz,                       -- soft, nullable
  archived_reason text                           -- "evolved into incorporated nonprofit," "lost the host space," "stewards moved away," etc.
);

create index idx_group_stewardships_template ON group_stewardships(template_kind) where archived_at is null;
create index idx_group_stewardships_active ON group_stewardships(group_id) where archived_at is null;
```

**Constraints enforced in the action layer (per ADR-7):**

- The Group's `kind` must be in `(practice, interest, event_anchored, place)`. A `business` Group cannot declare a stewardship (the operate verb-family is wrong; if a business runs a tool library, the tool library is a separate Group). A `family` Group cannot declare a stewardship (private discoverability would defeat the point).
- The Group must have at least one active membership with `role='steward'` before the stewardship row is created.
- `upkeep_gathering_item_id`, if set, must reference an Item where `kind='gathering'` and `recurrence_metadata is not null`.

### Event log additions

Per ADR-6 (audit fields on every row) and ADR-7 (action layer is the only write surface):

- `group.stewardship_declared` — fires when the row is inserted. Payload: `template_kind`, `shared_thing_description`, `upkeep_gathering_item_id` (nullable), `acting_member_id`.
- `group.stewardship_upkeep_changed` — fires when `upkeep_gathering_item_id` is updated. Payload: old and new values.
- `group.stewardship_archived` — fires when `archived_at` is set. Payload: `archived_reason`.

### Action handlers

- `group.stewardship_declare(group_id, template_kind, shared_thing_description, upkeep_gathering_item_id, external_network_url)` — requires the caller to be a steward of the Group.
- `group.stewardship_update(group_id, ...)` — requires the caller to be a steward.
- `group.stewardship_archive(group_id, archived_reason)` — requires the caller to be a steward.

### Discoverability hook

The locality-first index (`discoverable_items` materialized view, per `discovery.md`) is extended to optionally surface a `stewardship_template_kind` facet on the Group's anchor Location. The `/l/[slug]` Location page renders a "Stewardships here" section listing active stewardships anchored to that Location. The `/g/` index gains a template-kind filter so a Member can browse "all tool libraries near me" or "all repair cafés in Sacramento."

This is the substrate for the producer-bulletin-style equivalent in b2 — a stewardship can broadcast to its followers ("open hours moved to Sundays starting July") through the same Member-authored bulletin surface, branded with the stewardship's Group name.

---

## The seven templates

Each template ships with: a one-page on-platform starter (pre-filled Group description, suggested recurring Gathering, suggested steward count, suggested host-space conversation script), a link to the canonical external network or playbook, and a peer-learning surface (other stewardships of the same template kind in the city).

The templates are not a closed list — `template_kind='other'` is always available — but the curated seven cover the patterns that have been pulled off thousands of times in the wild. They are platform-curated *because they are proven*, not because the platform wants to control them.

### 1. Tool library

A volunteer-run lending library for tools — drills, saws, ladders, garden equipment — that members borrow and return like books at a regular library. Membership is free or low-cost; tools come from donations.

**Why this is the load-bearing template.** Tool libraries are the most generalizable shared-resource model — they scale from a single shelf in a garage to a 6,000-tool warehouse, the legal posture is well-understood, and the inventory-management software ecosystem is mature. A directory of tool libraries lists almost 50 around the world. The Tool Library Alliance unites tool libraries across the United States and Shareable serves as fiscal sponsor and incubator for the network.

**What the platform pre-fills:**
- Group kind: `practice`, role: `steward` required
- Suggested Gathering: weekly or biweekly open hours, 2–4 hours, anchored to a host Location (church basement, food co-op, community center, library — the patterns the precedents have used)
- Suggested steward count at launch: 2–4
- Suggested starter inventory: 10–15 high-demand items rather than 30 unreliable ones

**Canonical external sources:**
- **Tool Library Alliance** — https://localtools.org/ — the U.S. network; map of existing tool libraries to find peers
- **Shareable's Library of Things Toolkit v2.0** — https://www.shareable.net/toolkit/library-of-things-toolkit/ — the full playbook
- **myTurn / Local Tools** — https://localtools.org/ — web-based inventory and member management used by thousands of tool libraries and libraries of things worldwide
- **Share Starter** — starter kit covering financing, staffing, outreach, legal
- **Syracuse ISE 10-step guide** — https://sustainabilityengagement.syracuse.edu/guide-how-to-start-a-tool-library/

**Growth path:** Tool library → repair café (the natural pairing) → maker space / community workshop → cooperative trades education. The Asheville Tool Library and the WNC Repair Café running side by side during Hurricane Helene recovery is the canonical example of how these compound.

### 2. Seed library

A free seed-sharing system where members "borrow" seeds in spring, grow the plants, save seeds in fall, and return some to the library. Usually hosted inside a public library or community space.

**Why this template.** Seed libraries are the lowest-friction stewardship in the set — a cabinet, some envelopes, paper labels, and a roster. Almost no legal exposure. Richmond Grows Seed Lending Library opened in May 2010 and has inspired the creation of over 2,600 seed lending libraries worldwide.

**What the platform pre-fills:**
- Group kind: `practice` or `interest`, role: `steward` required
- Suggested Gathering: seasonal — a spring seed-borrowing event, a fall seed-return + saving workshop, optionally a midsummer seed swap. Not a weekly cadence.
- Suggested steward count at launch: 1–3
- Host space: the local public library is the canonical host; community gardens, garden clubs, and farmers markets work too.

**Canonical external sources:**
- **Richmond Grows Seed Lending Library** — https://www.richmondgrowsseeds.org/create-a-library.html — the replicable model, materials free for non-commercial use
- **Seed Library Network** — https://www.seedlibrarynetwork.org/ — the global directory and current resource hub; Richmond Grows now points new librarians to this network for up-to-date resources
- **Shareable's seed library how-to** — https://www.shareable.net/how-to-launch-your-own-seed-lending-library/
- **California State Library seed library guidance** — https://www.library.ca.gov/services/to-libraries/ideas/seed-library/

**Growth path:** Seed library → community garden → CSA partnership → food-producer Initiative. This is the on-ramp to Don's farmers-market wedge for non-producer Members who are gardeners.

### 3. Repair café

A recurring event — typically a Saturday morning, monthly or biweekly — where volunteer fixers help neighbors repair broken household items: clothes, small electronics, bicycles, lamps, toys. Free or donation-based. The repair happens in the same room as the visitor.

**Why this template.** Repair cafés directly enact the Slow Economy values (repair before replace) and create a recurring real-world meeting with a strong onboarding ramp for new Members. The international foundation has been running it since 2009 and the playbook is mature.

**What the platform pre-fills:**
- Group kind: `practice`, role: `steward` required
- Suggested Gathering: monthly, Saturday morning 10am–1pm, anchored to a host Location with enough table space
- Suggested steward count at launch: 3–5 (one organizer + 2–4 lead fixers across categories)
- Categories to staff: electrical / textile / bicycle / wood-and-furniture / small-mechanical — at minimum two
- Liability template: visitor signs a brief waiver at intake (the foundation supplies one)

**Canonical external sources:**
- **Repair Café Foundation** — https://www.repaircafe.org/en/ — the digital starter kit costs €49 and includes the full manual, logos, posters, intake forms, sign templates, and access to the world map of registered cafés; new locations also get a one-time free iFixit tool credit
- **Repair Café world map** — https://www.repaircafe.org/en/visit/ — find existing cafés to visit or partner with
- **Repair Together** (French-speaking) — https://repairtogether.be/en/create-a-repair-cafe/

**Growth path:** Repair café → tool library partnership (the two reinforce) → repair-trade apprenticeship pipeline → cooperative repair business (Loop 10, b3+).

### 4. Little Free Library

A small weatherproof box of books on a post in a front yard or public space, operating on "take a book, leave a book." A single steward (or pair) keeps it stocked, clean, and weatherproofed.

**Why this template.** The smallest-possible stewardship — one person, one box, a $40 charter. The one-time registration cost is about $40 per library to register with a charter sign. It is the gateway drug for stewardship: trivial commitment, immediate visibility, social proof to neighbors that "we do things together here."

**What the platform pre-fills:**
- Group kind: `practice` or `interest`, role: `steward` required
- Suggested Gathering: optional — a ribbon-cutting / opening event, occasional themed book drives. Most LFLs have no recurring gathering. The platform should not force one.
- Suggested steward count at launch: 1–2 (a person and optionally their partner)
- Host space: front yard, business storefront, school perimeter, community garden, church property

**Canonical external sources:**
- **Little Free Library (nonprofit)** — https://littlefreelibrary.org/ — 501(c)(3) nonprofit that helps people worldwide start and maintain "take a book, share a book" book exchanges
- **Steward registration** — https://littlefreelibrary.org/stewards/registration/ — the official registration process, charter sign, and world map
- **Insider's Guide to Starting a Little Free Library** — https://littlefreelibrary.org/wp-content/uploads/2022/07/insiders-guide-to-start-little-free-library-2022.pdf

**Growth path:** Little Free Library → Little Free Pantry (the structural sibling) → block-level mutual aid pod. Many neighborhoods that have one LFL acquire two or three within a year — the social proof is contagious in a way that matters.

### 5. Little Free Pantry

The food-and-essentials sibling of the Little Free Library. A small weatherproof cabinet stocked with shelf-stable food and hygiene products, operating on "take what you need, leave what you can."

**Why this template.** The lowest-overhead food-security intervention in the set, structurally identical to the Little Free Library at the platform layer. The mini pantry movement is a grassroots, crowdsourced solution to immediate and local need; the original is stocked organically and irregular supply is an effective control keeping consumption and traffic manageable.

**What the platform pre-fills:**
- Group kind: `practice`, role: `steward` required
- Suggested Gathering: optional, but a monthly "restock and clean" gathering is a useful default that recruits new stockers
- Suggested steward count at launch: 1–3 (one operator + a rotating restock crew of 2–5)
- Host space: front yard, church property, school perimeter, library exterior. Privately-owned, publicly-operated properties — businesses, schools, churches, nonprofits — help avoid privacy/traffic concerns and red tape; projects on city property are more labor and time intensive but yield good community buy-in.

**Canonical external sources:**
- **The Little Free Pantry** — https://www.littlefreepantry.org/ — the original (Fayetteville, Arkansas, 2016) with FAQ, steps, and the world map
- **Building guides** — https://www.thelittlefreepantries.org/guides/building — CAD plans, materials list, construction guide
- **Little Free Pantry steps** — https://www.littlefreepantry.org/steps

**Liability note for the platform copy:** The Bill Emerson Good Samaritan Food Donation Act (42 USCA § 1791) protects in most situations those who donate food products to a nonprofit organization for distribution to needy individuals; affiliating with a project does not guarantee protection. The platform should recommend that pantry stewards consult an attorney for specific liability and zoning questions in their area.

**Growth path:** Little Free Pantry → community fridge (the cold-storage upgrade) → community-garden integration → mutual aid pod.

### 6. Community fridge (freedge)

A publicly accessible refrigerator stocked with free, fresh food, typically placed in front of a host business or community space. Surplus from restaurants, gardens, and individuals goes in; anyone takes what they need. Higher operational overhead than a pantry — cleaning, food safety, electricity, weatherization.

**Why this template.** Direct food access at 24/7 cadence, including fresh produce and prepared food a pantry cannot offer. Higher-skill stewardship — this is the template that introduces members to the operational reality of running a real shared resource.

**What the platform pre-fills:**
- Group kind: `practice`, role: `steward` required
- Suggested Gathering: weekly check-in and clean, plus a monthly larger restock and maintenance gathering
- Suggested steward count at launch: 3–5 (one operator + 2–4 weekly cleaning/restock rotation)
- Host space: storefront, community center, church, with electricity access and a small weatherized shelter
- Cleaning cadence: 2–3 times a week minimum; food safety protocols posted on or near the fridge

**Canonical external sources:**
- **Freedge** — https://freedge.org/ — the global community-fridge network, map, and resource hub
- **Freedge Yourself starter guide** — https://freedge.org/wp-content/uploads/2017/12/Freedge_Yourself_v0.pdf — team formation, location, fridge specs, shed plans, funding, liability, law
- **Freedge legal guides** — https://freedge.org/freedge-yourself/legal/ — state-specific liability protection, food sharing scope, and permit requirements; the foundation's posture is that a favorable legal environment is not a prerequisite to start a community fridge
- **Hubbub UK Community Fridge Network** — communityfridge@hubbub.org.uk

**Growth path:** Community fridge → community kitchen / commissary → food-recovery routing partnerships with farmers markets and restaurants → cooperative grocery (Loop 10–11, b3+).

### 7. Mutual aid pod / buying club (the two coordination patterns)

These two are paired because they share a structure — a small group of households coordinating mutual support — and the platform models them with the same scaffold.

**Mutual aid pod.** A hyperlocal group of 5–20 households on the same block or in the same building who agree to be reachable for each other — meal trains, ride coordination, childcare swaps, emergency check-ins. The COVID-19 response in 2020 created thousands of these; the durable ones survived because they had named coordinators and a stable communication channel.

**Buying club.** A group of households pooling orders to buy at wholesale or bulk discount — typically food, sometimes household goods. A common pattern: keep the group small (10 households or fewer) and split geographically when it grows; minimum monthly order thresholds and per-order distributor fees are spread across the group.

**Why these templates.** Both surface the relational substrate the platform's full thesis depends on — neighbors who actually know each other and act together. Mutual aid pods are the most resilient durable structure in the set during a crisis. Buying clubs are the most direct economic test — they put money in motion outside the chains.

**What the platform pre-fills:**
- Group kind: `place` (for a block-based pod) or `interest` (for a buying-shape coordination), role: `steward` required
- Suggested Gathering: pods — quarterly in-person check-in plus an always-on group chat; clubs — monthly or quarterly order assembly + pickup
- Suggested steward count: 1–2 coordinators per pod, 1–3 per buying club (one ordering + one logistics + one bookkeeping when group is larger)
- Suggested size cap: 20 households for a pod, 10 for a buying club — both split when they outgrow the cap (mirrors the natural-size advice in `design-philosophy.md` §2b)

**Canonical external sources:**

*Mutual aid pods:*
- **Mutual Aid Hub** — https://www.mutualaidhub.org/ — the U.S. directory of active mutual aid networks
- **AFSC mutual aid network guide** — https://afsc.org/news/how-create-mutual-aid-network
- **Mutual Aid 101 Toolkit** — the open-access toolkit from the AOC × Mariame Kaba March 2020 training, including the pod-mapping exercise from the Bay Area Transformative Justice Collective
- **Big Door Brigade pod mapping** — https://www.bigdoorbrigade.com/

*Buying clubs:*
- **CoFED Bulk Buying Club Guide** — https://www.nasco.coop/resources/how-start-and-run-bulk-buying-club-your-friends-neighbors — sourcing, organizing, logistics
- **Frontier Co-op buying club program** — wholesale dry goods, spices, personal care
- **Azure Standard** — bulk organic and natural foods, regional drop network
- **Local Food Marketplace** — https://localfoodmarketplace.com/ — coordination software for larger buying clubs and food hubs

**Growth path:** Mutual aid pod → block club → neighborhood association → community land trust supporter base. Buying club → food co-op → grocery cooperative (the West Coast cooperative grocery sector mostly started this way).

### Why these seven and not others

The seven were chosen because they share five structural traits:

1. **A simple replicable charter.** All seven have a one-page playbook that works.
2. **A clear ritual cadence.** Each has a natural rhythm — weekly, monthly, seasonal — that anchors a recurring Gathering.
3. **A named steward.** Each pattern has an established "this is the person who looks after it" role.
4. **A physical anchor.** Each has somewhere it lives — a box, a cabinet, a fridge, a shelf, a host space.
5. **No money or legal entity required to start.** Each has been pulled off thousands of times by households with no LLC, no nonprofit, no insurance carrier.

Other candidates considered and rejected for the curated seven at b1.5 — community gardens (require land tenure and water access — too operationally heavy for a starter template), tool sharing without a central location (works informally but doesn't anchor on the platform), free clothing pantries (subsumed under Little Free Pantry's generalized "essentials" framing), CSAs (a Producer + subscribers shape that already lives in `kind='business'` Groups + product Items, not a stewardship). All remain available under `template_kind='other'`.

---

## What ships at S6.5 — in primitive terms

**Person:** unchanged. A Member can be a steward of any number of stewardships; steward role is per-Group per existing schema.

**Item:** unchanged. The recurring upkeep Gathering is a normal Item kind=gathering with `recurrence_metadata` populated. No new Item kind.

**Location:** unchanged. The stewardship's "physical anchor" is the Group's anchor Location (existing field) plus optionally a more specific upkeep-Gathering Location (existing pattern).

**Group:** one new child table (`group_stewardships`), three new events, no new kinds.

**Discovery:** one new facet on the index (`stewardship_template_kind`), one new filter on `/g/`, one new section on `/l/[slug]`.

That's the full footprint. Less than a week of build for a single engineer if the underlying Group, Location, and Gathering primitives are solid.

---

## What ships at S6.5 — in loop terms

| Loop | Status at S6.5 |
|---|---|
| 11 — Pool resources | Partial. Capital pooling defers to b3; the *care* dimension of pooling (people sharing time and labor for a thing they collectively look after) ships here. |
| 12 — Steward what we built | Full. This is the canonical surface for Loop 12. |
| 1, 3, 4, 7, 8, 9 | Reused. Stewardships use the gathering, locality-index, follow, and Item surfaces those loops already ship. |
| 10, 13 | Deferred. Initiatives and federation are downstream. |

---

## Metrics

### Adoption — does the path work?
- **Stewardships declared per 1000 Members per month** — the rate.
- **Time-from-Group-create to stewardship-declared** for stewardship-bound Groups — does the template flow lower the friction or does it sit unused?
- **% of stewardships using the seven curated templates vs. `template_kind='other'`** — are the templates covering the actual demand, or are members shaping something we didn't curate?
- **Template adoption breakdown** — which of the seven dominate, which lag?

### Survival — does the care hold?
- **% of stewardships still active at day 30, day 90, day 180, day 365** — the survival curve. Day 180 is the headline number (the field operates on six-month patience).
- **% of stewardships with a recurring upkeep Gathering still on the forward calendar** — the rhythm health.
- **Median number of active stewards per stewardship over time** — is the load distributing, or is it concentrating on one person who eventually burns out?
- **Stewardship archive reasons** — when stewardships end, why? "Evolved into incorporated entity" is a success. "Stewards moved away" is a turnover problem. "Lost host space" is a relationship problem. "Burnout" is a load problem.

### Compound — does it ripen into deeper ownership?
- **Action-diversity follow-on rate** — stewardship participants vs. matched non-participants, on subsequent actions taken in the 90 days after joining.
- **Stewardship → kind='business' Group transition rate** — when a stewardship grows into a real cooperative business, the platform records it (`archived_reason='evolved into cooperative business'` + the resulting Group's existence). This is the headline thesis metric.
- **Multi-stewardship Members** — Members participating in 2+ stewardships. The seed-library-then-tool-library pipeline. This is the strongest leading indicator of the ownership arc compounding.

### Anti-metrics — explicitly never optimized for
Per `principles.md` Part 6, listed so they cannot install themselves:

- Stewardship count as a vanity number absent survival data
- Time-on-platform or session length on stewardship pages
- Notification CTR on stewardship-related pushes
- Engagement-driven "you should start a stewardship" prompts to Members who haven't signaled interest

---

## Deliberately deferred

Each of the following is real and downstream. None ships at S6.5:

- **Inventory management** for tool libraries, seed libraries, and buying clubs. The mature external ecosystem (myTurn, Local Food Marketplace, Wholeshare) already covers this. The platform's job is the *social* layer; inventory lives in purpose-built tools, linked from the stewardship's profile.
- **Money flow.** No shared treasury, no fee collection, no payments. Stewardships that need to handle money do so off-platform (a steward's PayPal, a fiscal sponsor, a CDFI account). Per the cross-cutting payment deferral in `b1-primitives.md`.
- **Legal entity formation tooling.** No LLC walkthrough, no bylaws templates, no insurance partner. Stewardships that incorporate do so off-platform with their lawyer; the platform records the transition (`archived_reason`).
- **Cross-stewardship federation surfaces.** A stewardship that wants to coordinate with the regional Tool Library Alliance does so off-platform at b1.5. The federation surface for stewardships (a "stewardship network" primitive) defers to b3+.
- **Stewardship-scoped messaging.** The existing item-or-group-only messaging-scope commitment in `policy.md` holds. Stewardships use Group-scoped DMs through the existing surface; no special-cased messaging.
- **Steward rotation algorithms.** Per `groups.md` open questions, rotation tooling is b2+. At S6.5 stewards add and remove themselves manually; the event log records what happened.
- **Endorsement / verification badges for stewardships.** Per the no-ratings commitment.
- **A platform-curated "what stewardship should we start" recommender.** Auto-assignment violates the people-first commitment. The seven templates are presented as a catalog Members browse, not as suggestions pushed at them.

---

## Open questions

1. **The `stewardship_template_kind` enum granularity.** Seven templates plus `other` is the working answer. Should "mutual_aid_pod" and "buying_club" be split into two enum values (they're paired in the doc but structurally different)? Working answer: yes, two values, paired in UX only. Confirm before schema lands.
2. **What does the stewardship's public page look like when the Group's anchor Location is a Member's home address?** A Little Free Library in a front yard is the canonical case. Doxxing concern. Working answer: the Location is publicly resolvable to a neighborhood-precision area but the exact street address is rendered only to Members the steward has approved. Confirm with the privacy framework before launch.
3. **External-network registration linkage.** If a stewardship registers with Repair Café Foundation or Little Free Library (paying their fee, joining their map), should the platform verify that registration? Working answer: no — `external_network_url` is self-attested, like Tier 0 jurisdiction in `business-jurisdiction.md`. The platform displays the link, doesn't audit it.
4. **What happens when a stewardship "evolves" into a kind='business' Group?** Working answer: the original Group is archived (`archived_reason='evolved into incorporated business'`) with a link to the successor Group; the successor is a new Group of kind='business' that the founder creates from scratch. The continuity is recorded in the event log but the Groups are separate. Confirm with the canonical-examples set when first real case appears.
5. **Discovery weighting.** Should stewardships rank higher than ordinary Groups in the `/explore` locality view? Working answer: no — ranking neutrality holds. Stewardships are *findable* via the template filter on `/g/`; they don't get a boost on the home feed. The peer-to-peer social proof is what makes them spread, not platform amplification.
6. **The template content itself.** Who writes the one-page on-platform starter for each template? Working answer: the platform team writes the first cut, drawing from the canonical sources cited in this doc; first 10 stewardships per template kind get a follow-up review where the steward suggests edits; the canonical content gets versioned in the codebase like a CMS entry, not user-generated.
7. **Migration of S6.5 forward to b2.** Producer Bulletin at b2 — does a stewardship get bulletin access the same way a kind='business' Group's owner does? Working answer: yes. Stewards of an active stewardship pass the `member_has_standing_presence` check for bulletin authorship, scoped to the stewardship's followers. Confirm during b2 design.

---

## Comments

This bundle is the structural answer to "how do members become owners without us shipping ownership rails." The answer is that ownership is a multi-year arc that *starts with care*, and care is something the platform can already host with one small child table plus a curated set of templates that point at the real-world playbooks. The platform does not need to invent the patterns. The patterns exist, they work, and the people who have pulled them off have written down how. The platform's contribution is making them discoverable, recordable, and durable enough at the social-substrate level that the next steps in the arc — Initiative, pooled capital, federation — have something to grow out of.

The Mondragon trajectory analogy holds at the bundle level. A neighborhood that has run a seed library for two years, a tool library for one year, and a repair café for six months has accumulated something Mondragon's first cooperative had on day one: a set of people who have proven they show up for each other on a rhythm, with a track record other neighbors can see, anchored to a place. That is the substrate the bigger institutions grow from. Most of the historical examples that compounded into real cooperative federations did so out of exactly this layer — not out of nothing, and not out of capital. Out of practiced care.

The platform's job at S6.5 is not to be the cooperative. It is to be the place where step one becomes trivial and step five becomes legible.

**Buy close. Build community. Build the future together.**
