# MVP Bundle (b1)

**Status:** The first bundle definition. Specifies what ships at b1 in primitive terms (per `primitives.md`), in cluster terms (per `primitives.md`), and in loop terms (per `loops.md`). Names what defers, and what data-model commitments are non-negotiable at MVP.

**Companions:** [`bundle-themes.md`](bundle-themes.md) sequences b1 into seven sub-bundles (`b1.0`–`b1.6`, plus cross-cutting `b1.x`). [`b1-work-map.md`](b1-work-map.md) lists the menu of work per sub-bundle, tagged 🟢 / 🟡 / ⚪. Read all three to scope an F### scenario.

**Depends on:** `loops.md`, `primitives.md`, `member.md` (T1), `groups.md` (T1 — supersedes `community.md` / `member-operations.md` / `cooperative.md` per the 2026-05-10 Groups ratification), `item.md` (T1), `service-provider.md` (T1), `location.md` (T1), `initiatives.md` (schema-reserved at b1).

## What this document does

The MVP is the smallest expression of the platform that proves the central hypothesis: **ordinary people will step forward where they live, and their neighbors will show up for them.** Everything in this document either serves that hypothesis or is deliberately out of scope.

This is a scoping document, not a feature list. Scope is defined in primitive and cluster terms because the schematic similarity across loops collapses into a small number of build units. Defining the MVP at the cluster level prevents the mistake of shipping seven systems that were always one.

The b1 success metric is behavioral, not financial: Item creation rate across kinds, response rate (RSVP / follow / save / "I'd be in"), return visit rate, and cross-kind engagement (someone who came for a gathering discovers a maker). Commerce volume is **not** the b1 metric.

## What ships at b1 — in primitive terms

The four primitives from `primitives.md`, at their T1 scope:

**Person** (Member T1). Profile, auth, privacy controls, zero-or-many Community memberships, direct messaging within shared Communities, soft delete.

**Item** (Item T1). Four kinds at b1: `product`, `service`, `gathering`, `wonder`. Title, description, state, category, kind-specific metadata. Public page at a stable URL. Location attachments with optional schedules. Kind-specific responses (RSVP, follow, save, "I'd be in") all stored uniformly in `item_responses`. Tags from controlled vocabulary. Optional `community_id` (most Items have none).

**Location** (Location T1). Three flavors — permanent (a shop, a home, a park), recurring-temporary (a market booth, a bar where the Run Club meets), area (a service radius, a city scope). Public page, description, coordinates. Members hold multi-Location affinities (live, work, play, visit, follow, liked) per `member_location_affinities`. **The anti-Nextdoor commitment lives in messaging scope (item-or-group only, never Location-scoped) and complaint downvote/removal — not in absence of Member-Location relationships.** QR cards are an Item-level Member-requestable affordance per `qr-onboarding.md` — no Location carries QR-card columns. Per `location.md`.

**Group** (Group T1, full surface — supersedes the prior Community / Member Operations / Cooperative split per the 2026-05-10 Groups ratification). Six kinds at b1: five affiliate kinds (`place`, `interest`, `practice`, `event_anchored`, `family`) and one operate kind (`business`). Groups are emergent and optional — a Member is never auto-assigned to one. The b1 surface ships the primitive (spine + child schema, create flow, join/leave, page at `/g/[slug]`, index at `/g`, role-per-kind validation, soft-membership inference, lifecycle/dormancy infrastructure, full event log). The kind='business' Group absorbs the personal-business / partnership / cooperative-shape use cases (sole-prop = Group-of-one; partnership = multi-owner Group; co-op-shaped = multi-owner Group with optional `legal_entity_kind` recorded). **What does not ship at b1:** posting surfaces inside Groups (Group feeds with discussion), stewardship rotation, capital-flow surfaces, federation handoff, b2 staff-confirmation flow. Per `groups.md`.

**The connecting surfaces:**

- **The locality-first index** (Cluster 3). A single surface that browses across Items, Persons, and Locations near a stated point. Filterable by kind, category, distance, schedule. No-login browseable.
- **Person-Item creation flows.** A Person can create a product, service, gathering, or wonder Item in under 90 seconds, including Location attachment and (where applicable) schedule.
- **Item response surfaces.** Kind-appropriate response actions on every Item page — Follow (products / services / gatherings), Save (services), RSVP (gatherings), "I'd be in" (wonders).
- **The thesis page.** Linked from every page. Names the squeeze, names the antidote, names what the platform commits to and refuses to do. Earns the right to ask people to step forward.

## What ships at b1 — in cluster terms

- **Cluster 1 (Standing presence)** — full. A Person declaring a recurring or ongoing Item attached to a Location is the core mechanic of b1.
- **Cluster 3 (Browse)** — full. The locality-first index across Items, Persons, and Locations.
- **Cluster 2 (Call for response)** — Wonder only. Offer, Ask, and Initiative are reserved at the schema level (per `item.md`'s `kind` enum) but not surfaced.
- **Cluster 4 (Long-tail care)** — does **not** ship as user-facing surfaces. Follow and "I'd be in" exist as `response_kind` values stored in `item_responses`; the streams, notifications, and persistent relationship surfaces that read from them defer to b2/b3.

## What ships at b1 — in loop terms

| Loop | Status at b1 |
|---|---|
| 1 — Find your people | Ships (gathering Items, locality index) |
| 2 — Float an idea | Ships (Wonder) |
| 3 — Land here | Ships (no-login locality index) |
| 4 — Gather regularly | Ships (recurring gathering Items) |
| 5 — Share what you have | Defers — Offer reserved at schema, surfaces at b2 |
| 6 — Ask for help | Defers — Ask reserved at schema, surfaces at b2 |
| 7 — Make and be found | Ships (product Items, Item-level QR cards on demand for any Member-owned Item per `qr-onboarding.md`) |
| 8 — Follow what you love | Partial — Follow stores at b1; the follow stream surfaces at b2 |
| 9 — Find a local pro | Ships (service Items, Saved primitive) |
| 10 — Start something | Defers — Initiative reserved at schema, surfaces at b2 per `initiatives.md` |
| 11 — Pool resources | Defers to b3 |
| 12 — Steward what we built | Defers to b3 |
| 13 — Federate and spawn | Architectural — no user surface |

Six loops fully reachable at b1, one partial, six deferred. The reachable set spans Family 1 (gathering), Family 3 (trade), and one verb of Family 2 (Wonder). That coverage is enough to test the hypothesis.

## Deliberately deferred

Each of the following is real and downstream. None ships at b1:

- **Posting surfaces inside Communities.** Communities exist at b1 as a primitive (create, join, leave, page, index). Community feeds with discussion and structured posting defer to b2.
- **Stewardship rotation, pooled-capital tooling, capital-flow surfaces.** Loop 11 / Loop 12 surfaces. Substrate intent at b1 (per `groups.md` lifecycle + Group event log); user-facing surfaces are b2/b3. **Cooperative-style coordination is deferred until real-world need + explicit user prioritization** per the Groups ratification + `agent-commerce-and-project-amendments.md` §2 — no `cooperative_*` schema lands at b1.
- **Initiatives.** State machine, structured pledges, capital infrastructure — reserved at the schema level only.
- **Offer / Ask.** Cluster 2 verbs beyond Wonder. Real, but require Community surfaces to feel right.
- **Follow streams, notifications, persistent feeds.** Stored at b1, surfaced at b2.
- **Reviews, ratings.** Permanently deferred (per `service-provider.md` Comments — community-anchored endorsements at T2 instead, no star ratings ever).
- **Endorsements.** Service Provider T2.
- **Payments and commerce rails.** Items at b1 surface availability and contact; transaction is off-platform.
- **Verification badges** (license, insurance). Service Provider T2.
- **Stakeholder dashboard.** Member T3 surface; the event log entries that feed it are required at b1.
- **Vector / semantic search and the AI chat surface.** b3. Schema commitments to enable it are made at b1 (per `item.md` and `primitives.md` AI/LLM sections).
- **Intelligence layer.** Data accumulates at b1; analysis surfaces are b3.

## Data model floor — retrofit is the failure mode

Every system spec referenced names its own data-model floor. Across all of them at b1:

**Tables required:**
- Member: `members`, `member_privacy`, `member_interests`, `member_follows`, `member_location_affinities` (multi-Location belonging — substrate at b1, surface b2; per `member.md` and `location.md`), `member_handle_history` (T2 surface, schema reserved at b1), DM substrate (`member_threads`, `member_thread_participants`, `member_messages`), agent-assistance substrate (`member_self_records`, `member_delegations`), `member_events`, `members.primary_community_id` nullable, `members.home_location_id` nullable, `members.stakeholder_visibility` reserved column. **No `members.maker_mode_enabled` column** (per ADR-12 SUPERSEDED 2026-05-12 — the Maker-mode framing is retired; selling-tool affordances surface from ≥1 active kind='business' Group membership OR any kind='product'/'service' Item, not from a profile toggle). **No `member_roles` table** — Operations supersede roles per ADR-8; see `member-operations.md`. **No `location_memberships` table** — Members have multi-Location *affinities*, not memberships; the structural anti-Nextdoor commitment lives in messaging scope (item-or-group only) and complaint downvote/removal.
- Item — **spine + kind-specific child tables** (the four kinds share a logical primitive but have separate physical tables for typed columns and per-kind indexes; see `item.md` for the full rationale):
  - `items` (the spine: shared columns across all kinds — id, member_id, kind enum, title, description, state, community_id nullable, brand_label nullable, category, ambient_extras jsonb, timestamps, soft-delete; reserved columns parent_item_id / collection_id / federation_origin / embedding_id)
  - `item_products` (1:1, kind=product: price_cents, price_unit, composition, photo_urls, available_until)
  - `item_services` (1:1, kind=service: rate_model, rate_cents, service_area_geography, hours, license_info, on_call, accepts_new_clients)
  - `item_gatherings` (1:1, kind=gathering: starts_at, ends_at, recurrence_rule, capacity, cost_cents, what_to_bring, host_member_id, rsvp_cutoff)
  - `item_wonders` (1:1, kind=wonder: interest_count, expires_at, conversion_target_kind, converted_to_item_id)
  - `item_locations`, `item_responses`, `item_tags` (controlled vocabulary categories), `item_hashtags` (free-form, user-generated, normalized; complements categories with long-tail / cross-genre / trend-emergent labels)
  - **No `cooperative_cohort` value in the `items.kind` enum.** The prior ADR-11 reservation was dropped per the Groups ratification (2026-05-10); cooperative-style coordination is deferred until real-world need + explicit user prioritization per `groups.md` and `agent-commerce-and-project-amendments.md` §2. No `cooperatives`, `cooperative_assets`, `item_cooperative_cohorts`, `cooperative_distributions`, or `cooperative_governance_votes` tables ship at b1.
  - `items.group_id` (nullable FK to `groups.id`) replaces the prior `items.community_id`. Set when the Item is filed under a Group; null for one-off sales and non-commercial Items. Per `groups.md` and `item.md`.
- Location: `locations` (per forthcoming `location.md`) with PostGIS `geography` column + GIST index for proximity queries
- Group (per `groups.md` — supersedes Community / Member Operations / Cooperative): `groups` (spine — kind enum: `place`, `interest`, `practice`, `event_anchored`, `family`, `business`), `group_memberships` (with `source` enum: `explicit`, `soft_via_follow`, `soft_via_attendance`; role validated per-kind in the action layer), `group_businesses` (kind-specific child for kind='business' Groups — display_name, public_description, optional `legal_entity_kind` / `state_of_formation` / `formed_at`), `group_event_anchored` (kind-specific child for kind='event_anchored' Groups — `seeded_by_item_id` FK), `group_events` (Group event log, partitioned monthly per ADR-10, audit fields per ADR-6). Posting surfaces inside Groups, stewardship rotation, capital-flow tables defer to b2/b3. **No `wonder_interests` table** — Wonder responses live uniformly in `item_responses` per `item.md`.
- **`discoverable_items` materialized view** — denormalized join across the spine, nearest Location, Member display, brand cluster, response counts. The locality-first index queries this view exclusively; base tables are not touched on the anonymous Loop 3 read path.
- Service Provider: `service_providers`, `service_provider_contact_methods`, `service_provider_metadata`, `member_saved_service_providers`

**Forward-looking columns reserved at b1** (full list in each system spec):
- `items.parent_item_id`, `items.collection_id`, `items.federation_origin`, `items.embedding_id`
- `groups.parent_group_id` (nesting), `groups.established_on` (Member-claimed continuity), `group_memberships.confirmed_by_member_id` / `confirmed_at` (b2 staff confirmation flow per `groups.md`)
- `locations.parent_location_id` (sub-venues, T2 surface), `locations.embedding_id`, `locations.federation_origin`
- `service_providers.availability_kind`, `service_providers.verified_badges` (no `cooperative_id` — cooperative coordination deferred until real-world need per `groups.md` and `agent-commerce-and-project-amendments.md` §2; the cooperative-shape use case is served at b1 by kind='business' Groups with multiple owner-role memberships)
- `members.stakeholder_visibility`

**Event logs complete from day one across every system.** The stakeholder dashboard, state machines, AI search, Intelligence-layer surfaces, and the b2 follow streams all read from event histories. Missing entries become retrofit work. Every system spec lists its required b1 events. **Per ADR-6, every event row carries `acting_member_id` + `via_delegation_id` — populated by the action layer per ADR-7, never by callers.** Per ADR-10, every event row writes in the same transaction as the row write — same-transaction commit is a hard invariant, code-review enforced.

**AI-native floor at b1** (per the 2026-05-09 migration audit):
- pgvector extension enabled.
- Empty parallel embedding tables created: `item_embeddings`, `member_embeddings`. `items.embedding_id` and `members.embedding_id` reserved.
- Action layer skeleton (per ADR-7) is the only write surface. Every Phase 1+ ticket implements writes via named action handlers; direct controller writes are rejected at code review.
- System Member seeded (handle: `system`, login disabled) per ADR-10 §6 — used as `acting_member_id` for backfilled and platform-emitted events.
- Auth post-signup hook calls `member.create` action handler per `member.md` line 369.
- MCP-server-ready handler shape (per ADR-7) — the b3 MCP server is a thin wrapper over the same handlers.

**Soft delete on every entity.** Hard deletes never ship at any tier.

## Suggested build sequence

Sequencing lives in [`bundle-themes.md`](bundle-themes.md) — b1 ships in seven sub-bundles (`b1.x` URL namespacing → `b1.0` through `b1.6`), each 1–2 weeks. The menu of work per sub-bundle, tagged 🟢 / 🟡 / ⚪ for scope decisions, lives in [`b1-work-map.md`](b1-work-map.md). The planner reads both before writing the next F### scenario.

The previous primitive-order build sequence (Member → Location → Item → index → Wonder → QR → thesis → Service Provider → Community) is superseded by the sub-bundle sequence as of 2026-05-18. The primitive ordering survives inside individual sub-bundles where it still matters — e.g. b1.0 builds Member before locality-default works, b1.4 builds the product/service Items before the locality-first index queries them.

## Open questions to resolve before build

- **Auth approach.** Magic link, social login, or existing platform auth? Resolves Member T1 entry flow.
- **City scope at launch.** Sacramento only, or generic city-selection from day one? Affects Location and index design.
- **Geographic precision.** Free-text place description, zip code, or polygon? Affects Location and cross-visibility logic.
- **Default locality scope (RESOLVED — see [ADR-4](../DECISIONS.md#adr-4-locality-default-is-geolocate-then-city-pick-mutable-from-any-surface)).** Geolocation first; fall back to city pick from a list. Mutable at any time, visible affordance on locality-dependent surfaces. Supersedes the earlier `community-platform.md` "no header pill in MVP" decision.
- **Seller onboarding flow (RESOLVED — see ADR-12 SUPERSEDED 2026-05-12 per `agent-commerce-and-project-amendments.md` §6; ADR-3 superseded entirely; ADR-8 fully superseded).** Selling-tool affordances surface from Group / Item state: ≥1 active kind='business' Group membership OR any kind='product'/'service' Item. **No `members.maker_mode_enabled` column** — the toggle, the auto-flip prohibition, and the "Pause / Leave one Group / Stop entirely" three-state model are all dropped. A new Member onboards without any selling-tools surface; the "Sell" CTA on `/you` walks them through creating a kind='business' Group (per `groups.md`); selling-tool affordances surface from that point on. To stop selling: end the owner-role membership(s); the Group enters its 90-day dormancy window per `groups.md`. The original ADR-3's implicit-from-behavior model and `maker_signal` derivation remain **rejected**. Standing-tier gate (`member_has_standing_presence`, defined in `groups.md`) is the same Group-membership signal that drives the selling-tool affordances. Vocabulary: **Seller** generically; **Producer** in agricultural/food contexts (per `producer-bulletin.md`, `producer-growth.md`); **Maker** survives only as a self-identified UI label for craftspeople/artisans.
- **Market session as feed-card type (RESOLVED — see [ADR-5](../DECISIONS.md#adr-5-a-market-is-a-gathering-item-gathering-is-broad-and-varied)).** A market is a Gathering Item, not a separate card type. Categories and hashtags carry the kind-of-gathering distinction (farmers-market, swap-meet, class, run-club, etc.). Update `community-platform.md` to remove the distinct "Market session" card type.
- **Initial tag vocabulary per Item kind.** Curated before the first Item is created. For gathering Items specifically, ADR-5 implies a controlled list of gathering categories — sized as part of this open question.
- **Initial metadata schema per Item kind.** A Product's metadata fields, a Gathering's, a Service's — each documented before build.
- **No-login browse vs. signup wall.** Loop 3 (newcomer) requires no-login browseable surfaces. Confirm this overrides any signup-first instinct.
- **QR card design.** What the printable card actually says, looks like, and links to. Marketing-adjacent decision. Item-level affordance per `qr-onboarding.md` — any Member can generate one for any Item they own.
- **Public-facing language for Item kinds.** "Product / Service / Gathering / Wonder" are internal terms. Button labels, composer prompts, page titles — open.

## Comments

The discipline at b1 is to ship the smallest version of the primitives that lets the central hypothesis test itself. Every deferred system in this document is real and will ship in time. None of them is needed to learn whether ordinary people step forward when given a place-anchored, locality-first surface that doesn't exist anywhere else.

Three named risks to hold against the scope:

**Cluster 4 creep.** The temptation to ship follow streams, notification feeds, and activity rails because they feel like "what apps do." Resist. The b1 platform is intentionally quiet. It tells you what's near you; it doesn't push at you. Retention at b1 comes from the locality index and shared URLs in the wild (texted, group-chatted, chalked, flyered) — people come back because there are real things happening near them, not because the app pinged them.

**Treating the four Item kinds as four features.** They are one flow with kind variations. Building them as four onboarding paths reproduces the fragmentation the Item primitive exists to erase. One composer, kind picker at the top, kind-specific metadata fields below.

**Starting commerce work too early.** Payments, ratings, transaction support feel "real" but are the wrong proof for b1. The proof is *people declared things and others responded.* That can be tested without a single dollar moving through the platform. The economic loop runs on attention and contact at b1; transactions are b3.

The b1 build is small on purpose. It is not the platform; it is the smallest version of the platform that can teach you whether the platform is right. If the hypothesis holds at b1, b2 and b3 are obvious. If it doesn't, no amount of additional features at b1 would have saved it.
