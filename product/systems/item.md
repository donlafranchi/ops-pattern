---
id: what-item
purpose: One kind-varying entity for everything Members declare.
layer: what
status: active
---

# System: Item

**Purpose:** Establish Item as one of the three foundational primitives of the Project — a single, kind-varying entity that represents anything a Person declares: a product, a service, a recurring gathering, a Wonder, an Offer, an Ask, or an Initiative. The Item primitive is what lets the platform's many surfaces share data shape and code while presenting differently. Without it, the platform fragments into per-feature systems that solve the same problem six ways.

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

**North stars served:** All five. Items are the surface through which every loop operates. Specific kinds map to specific north stars (gatherings → Belong; products and services → Buy Close; Wonder and Initiative → Learn and Build Together; etc.), but the primitive itself is shared infrastructure.

> Map to numbered north stars from `product/foundation/north-stars.md` before scenario approval.

## What an Item Is and Why It Matters

An Item is the platform's universal "thing-being-declared" entity. The schema is shared across kinds; the kind is what varies.

The argument for Items as a primitive (rather than as separate per-feature entities) is that the platform's loops are schematically similar. A Maker declaring sourdough, a Service Provider declaring plumbing, an Organizer declaring a Thursday Run Club, a Member posting a Wonder, a Member posting an Offer, a Member posting an Ask, and an Initiator declaring an Initiative are all the same act in different costumes: a Person declares something, with a description, optionally anchored to a Location and/or a schedule, with a discoverable page, with responses from other Persons, with a lifecycle.

Modeling these as separate systems means writing the same code six times. Modeling them as Items with kind variations means writing it once and varying behavior per kind. The schematic similarity becomes structural reuse, the locality-first index becomes a single query, and natural-language search becomes tractable because there's one consistent thing to embed.

This is the data-model equivalent of the synthesis that drove `member-journey.md`: the platform's many surfaces are surfacings of a few primitives.

## Item Kinds

T1 ships a subset; T2 and T3 add more.

> **Naming.** "Item" is the spec/schema term for the unified entity. It is **not** used in user-facing copy or URLs — the UI always uses the specific kind. The mapping below is the load-bearing translation. See [`../../CLAUDE.md`](../../CLAUDE.md) § Naming conventions for the platform-wide rules.

| Schema (`items.kind`) | URL segment | UI label | UI verb (CTA) | Tier |
|---|---|---|---|---|
| `product` | `…/p/[slug]` | Product | Sell · Share | T1 |
| `service` | `…/s/[slug]` | Service | Offer | T1 |
| `gathering` | `…/e/[slug]` | **Event** | Host | T1 |
| `wonder` | `…/i/[slug]` | **Idea** | Wonder · Float | T1 |
| `offer` | `…/o/[slug]` | Offer | Offer up | T2 |
| `ask` | `…/a/[slug]` | Ask | Ask | T2 |
| `initiative` | `…/initiative/[slug]` | Initiative | Lead · Start | T2 |

The URL column shows the **resource segment** only — the full canonical URL is place-scoped. An Item filed under a Group nests under that Group's place path (`/p/[…place path]/g/[group-slug]/[segment]`); an Item with no Group (Member-owned) nests under the owner's handle (`/m/[handle]/[segment]`). The per-kind `URL:` lines further down show the same resource segment. See [`../../CLAUDE.md`](../../CLAUDE.md) § Naming conventions rule 6.

The schema names are durable; URLs and UI labels can evolve. Two enum values use friendlier user-facing labels: `gathering` → "Event," `wonder` → "Idea." Code references the schema name; surfaces render the label.

> **Intent:** Schema migrations are expensive (data, RLS policies, event-log replay, type generators); UI and URL renames are cheap (find-and-replace inside a release). Locking the schema vocabulary to the most stable concept available at design time — not the prettiest user-facing word — keeps future rename work bounded to the surfaces that actually need to change. "Gathering" and "Wonder" were the *spec verbs* that made loop discussions legible internally; "Event" and "Idea" are the everyday nouns a non-aligned user recognizes immediately. The split lets the team keep the spec language without imposing it on users, and lets the user-facing label evolve without dragging the schema along. When proposing a new Item kind, propose all four columns (schema / URL / UI label / UI verb) at once — the layers should never be reasoned about in isolation.

**Product (T1, `kind='product'`)** — A tangible thing made by a Person, available at one or more Locations on a schedule. Standing in nature. Example: Oak Park Sourdough's loaves, Curtis Park Candles' tapers. URL: `/p/[slug]`. UI verb: *Sell* (commerce-shaped) or *Share* (gift / community context).

**Service (T1, `kind='service'`)** — Skilled labor offered by a Person, available within an area on declared availability. Standing in nature. Example: plumbing, vet care, hairdressing, accounting. URL: `/s/[slug]`. UI verb: *Offer*.

**Event (T1, `kind='gathering'`)** — A real-world meetup (one-time, recurring, or open) hosted by a Person at a Location on a schedule. Standing in nature. Example: Run Club Thursdays at Drake's, repair café Tuesday nights at the library, a one-time pop-up. URL: `/e/[slug]`. UI verb: *Host*. (User-facing name "Event" deliberately broader than "gathering" in common usage; schema keeps `gathering` for stability.)

**Idea (T1, `kind='wonder'`)** — A test-the-waters declaration: *"I'm wondering if folks would be into..."* Lower commitment than an Event — no schedule or place required, no implied date. Convertible to Event or Initiative if interest accumulates (per the wonder-conversion rules in this spec). URL: `/i/[slug]`. UI verb: *Wonder* / *Float*. (User-facing name "Idea" for accessibility; schema keeps `wonder` for stability and Loop 2 alignment.)

**Offer (T2, `kind='offer'`)** — Something a Person has to give, lend, or share with the community. One-time or limited-availability. Example: extra zucchini, a pressure washer to lend, two hours of yard help Saturday. URL: `/o/[slug]`. UI verb: *Offer up*.

**Ask (T2, `kind='ask'`)** — Something a Person needs from the community. Time-bounded. Example: a truck for a Saturday move, a babysitter recommendation, a stand mixer for the weekend. URL: `/a/[slug]`. UI verb: *Ask*.

**Initiative (T2, `kind='initiative'`)** — A proposal to grow community economic capacity. Carries a state machine, structured pledges, and an explicit gathering-as-next-step. The most structured Item kind. URL: `/initiative/[slug]` (full word, not single-letter — single letters are exhausted by the higher-frequency kinds, and Initiative is load-bearing enough to deserve the legibility). UI verb: *Lead* / *Start*.

The kind enum is extensible. Future kinds (Class, Tool-share, CSA Subscription, Workshop Series) can be added without schema migration — one enum value, one metadata schema, and (if user-facing) a row in the naming table per addition.

## T1 — MVP Tier

- A Person can create an Item of kind `product`, `service`, `gathering`, or `wonder`.
- Item record carries `title`, `description`, `state` (draft / published / withdrawn / fulfilled / closed — per the reconciled enum shipped in T056; see *Data model implications* below), `category` (controlled vocabulary, kind-specific), and `metadata` (JSONB, kind-specific schema).
- Items attach to Locations via `item_locations` with optional schedule (one-time / recurring / ongoing / by-appointment).
- Each Item has a public page at a stable URL — first-class, not buried inside the creating Person's profile.
- Items are discoverable via the locality-first index (Cluster 3): filterable by kind, category, location, distance, schedule.
- Responses are kind-specific: Wonder gets *"I'd be in"* taps; Gathering gets RSVPs; Product/Service gets Follow or Save (per existing maker / service-provider primitives); Initiative is reserved at MVP and surfaces at b2.
- Tags from a controlled vocabulary, attached to Items for discovery refinement.
- Soft delete on Items.
- Cross-Community visibility inherited from the creating Person's posting context (per Community's cross-visibility rules).
- Description fields written in natural language suitable for future embedding-based search.

## T2 — Core Tier

- Additional Item kinds surfaced: `offer`, `ask`, `initiative`.
- Item kind-specific state machines (e.g., Initiative's `thinking` → `refining` → `active` → `funded` → `closed` per `initiatives.md`).
- **Item conversions** — a Wonder can convert to a Gathering or an Initiative; a new Item is created with `parent_item_id` linking back to the Wonder, preserving the original for archive (mirrors Community's wonder-to-host pattern).
- Multi-Location Items (a Maker who sells at three different markets, a Service Provider with multiple service areas).
- Embedded media — photos for Products, attached docs for Initiatives, gallery for Locations.
- **Item collections** — a Person's curated catalog view of their own Items (a Maker's full product line, a teacher's class series).
- Endorsement-style responses for Service Items (per `service-provider.md` T2).

## Provenance claims — "Locally Made"

kind='product' Items carry an optional **product-provenance claim** — the platform's "Locally Made" badge. This is a *sibling* signal to "Locally Owned" (per [`business-jurisdiction.md`](business-jurisdiction.md)): jurisdiction answers "does the money go to a local owner?"; provenance answers "is the product made here?" The two diverge often — a Sacramento-resident Member who imports finished goods is *Locally Owned* but not *Locally Made*; a Member who designs and assembles every piece in their Oak Park studio is both; a national-chain franchise is neither (though the franchisee owner may be locally resident, surfacing only Locally Owned).

**Substrate (reserved at b1; surface ratification deferred — verification ladder is open product policy).**

- `items.made_at_place_id` (nullable FK to `places.id`) — the Place the Member declares the product is made in. Only meaningful when `kind='product'`; the action handler enforces this. NULL means no claim.
- `items.made_at_verification_source` enum — values: `none` (default for all rows), `self_attested` (Member declared the Place; Tier 0), `community_attested` (buyers attested to the provenance claim; Tier 1, b2+), `document_supported` (T3 evidence — facility lease, manufacturing-source attestation, etc.; Tier 2, b2+/b3). The Tier 1 ladder shape mirrors `business-jurisdiction.md` — community-attestation is the platform-internal verification path for both badges. Buyers who actually receive a product carry ground-truth about where it came from; that ground-truth is what the platform records.

**Action handlers.**

- `item.set_made_at(item_id, place_id)` — Tier 0 write. Rejects if `kind != 'product'`. Sets `made_at_place_id`, `made_at_verification_source='self_attested'`. Fires `item.made_at_set`.
- `item.remove_made_at(item_id)` — clears the claim. Fires `item.made_at_removed`.
- `item.attest_made_at_community(item_id)` (b2+) — Tier 1 write triggered by the attestation-threshold worker when confirming buyer attestations cross the threshold. Sets `made_at_verification_source='community_attested'`. Demotion path also lives here when dissent flags. Fires `item.made_at_community_attested`. Buyer-side attestations land in a sibling table (`item_made_at_attestations`) — substrate ships at b2 alongside the surface, designed in lockstep with `member_business_jurisdiction_attestations` per `business-jurisdiction.md`.
- `item.verify_made_at_document(item_id, document_blob_id)` (b2+/b3) — Tier 2 write; queues OCR/manual review. Fires `item.made_at_documented` on confirmation.

**Event log entries:** `item.made_at_set` (Tier 0, b1), `item.made_at_removed` (b1), `item.made_at_community_attested` (Tier 1, b2+), `item.made_at_documented` (Tier 2, b2+/b3). All append-only, audit-field-bearing per the same-transaction row+event invariant.

> **Intent (Ratified 2026-05-23):** Default `'none'` because the "Locally Made" badge is a Member-affirmative *claim*, not a platform inference. Defaulting to `self_attested` (or auto-deriving from the seller's jurisdiction ZIP) would either lie about the evidence level or quietly conflate ownership with provenance — the exact conflation the substrate split exists to prevent. The climb path mirrors `business-jurisdiction.md`: Member self-attests at Tier 0 → buyers attest at Tier 1 (b2+, peer pressure for the greater good) → document-supported at Tier 2 (b2+/b3). The Member declares the claim; the community confirms it; the platform records both honestly. **Test for future proposals:** does the proposal want to auto-populate `made_at_verification_source` from any other field (the seller's jurisdiction ZIP, the seller's home Location, the seller's `kind='business'` Group anchor)? If yes, refuse — that would re-merge ownership and provenance, which the substrate split keeps separate.

**Surface — deferred to PM ratification.** The "Locally Made" badge surface on Item pages and Item cards in discovery ships when the verification-ladder design lands. The b1 commitment is the substrate (columns, action handlers, event log); the badge UI, the "viewer's place vs. made-at place" proximity rule, and the document-evidence shape route back through `explore` once a real seller case forces the question. Open Questions parked in [`_attic/2026-05-28-reorg/product-exploration/member-geography-redesign.md`](../../_attic/2026-05-28-reorg/product-exploration/member-geography-redesign.md) (exploration retired 2026-05-30):

- Edge case: "designed in Sacramento, assembled in Vietnam" — does the badge require both? Working answer: the badge reads on `made_at_place_id` (where final assembly happens); "designed in" is a separate, lower-trust signal.
- Edge case: services have no physical provenance — the column is intentionally not extended to kind='service'.
- **Checked 2026-09-03 — Member-entered Item location does not trigger this prohibition.** A Member enters the Item's location at creation — address, neighborhood, or Online — and it resolves into the Item's stored *discovery* hierarchy (per [`../../planning/backlog/decision-surfaces.md`](../../planning/backlog/decision-surfaces.md) § Location is entered at creation). That is a different question from provenance: where an Item *is* vs. where a product was *made*. **Guard:** the entered location writes the discovery hierarchy only — never `made_at_place_id`, never `made_at_verification_source`, and it never causes a badge to render. A Member entering an address is stating where the Item is, not claiming where it was made; any implementation that routes one into the other falls under the Ratified 2026-05-23 test above, and the answer is refuse.
- The document-evidence shape differs from jurisdiction (facility lease ≠ SOS filing); the Tier 2 ladder is unfinished.

## T3 — Polish Tier

- **Vector embeddings** for all Items, enabling natural-language search across the platform. Embeddings indexed against a parallel table, refreshed on Item update.
- **AI chat surface** — a conversational interface that accepts natural-language queries and resolves them across Items, Persons, and Locations.
- **Cross-platform Item federation** — an Item from a federated platform (per Loop 13 in `member-journey.md`, e.g., a cooperative service from the spawned cooperative-services platform) surfaceable here through federation protocols.
- **Categorical recommendation surfaces** — *"you follow these makers; here are similar Items in your area"* — driven by Item embeddings plus Person history.
- **Item performance dashboards** for the creating Person — views, follows, saves, response counts, engagement over time. Producer-facing metrics in plain language: *"12 people searched for sheep milk near you this week."*
- **Item history** — version log of Item edits, visible to the creating Person.

## Data model implications

**Required at MVP — retrofit is the failure mode.**

The mental model in `primitives.md` is one Item primitive with a `kind` enum. The physical schema is **shared spine + kind-specific child tables.** This is a deliberate divergence between the conceptual primitive and the storage layer. Reasons: a single table forces JSONB for all kind-specific fields (weak typing, indexing pain, no FK constraints from kind-specific child rows), while four independent tables fragment the locality index (UNION across four tables on every cross-kind read) and complicate Wonder→Gathering conversions. Spine + child gives strong typing and per-kind indexing without sacrificing the cross-kind locality query that drives Loop 3.

**The spine — `items`** (one row per Item, all kinds):
- `id`, `member_id` (FK to Person), `kind` (enum: `product`, `service`, `gathering`, `wonder`; `offer`, `ask`, `initiative` reserved at MVP). **No `cooperative_cohort` value** — cooperative-style coordination is deferred until real-world need + explicit user prioritization.
- `group_id` (nullable FK to `groups.id` — replaces the prior `community_id`; per `groups.md`). Set when the Item is filed under a Group; null for one-off sales and non-commercial Items.
- `title`, `description` (text — written for human + future embedding readability)
- `state` (enum: `draft`, `published`, `withdrawn`, `fulfilled`, `closed`) — `draft` is the create state; `published` is the visible-to-discovery state and the lifecycle target for new Items (the `item.published` event fires on the `draft`→`published` transition, per *Key event semantics* below); `withdrawn`, `fulfilled`, and `closed` are the terminal states. The prior `'active'` value was dropped in T056's reconciliation — `'published'` is the equivalent for visible Items.
- `category` (text — controlled vocabulary per kind)
- `brand_label` (nullable text — same `member_id` + same `brand_label` = locally owned multi-location; powers resolve-up rendering. When `group_id` references a kind='business' Group, the Group's `group_businesses.display_name` is the canonical brand source and `brand_label` is the Location/Item-level fallback per `groups.md`.)
- `qr_card_url` (nullable text — populated on demand when the Member requests a QR card for this Item via the `item.qr_card.request` action handler. Resolves to the Item's canonical kind-specific page (per the naming table above). Per [`qr-onboarding.md`](../capabilities/qr-onboarding.md): QR cards are an **Item-level Member-requestable affordance** — there is no Location-level QR card, no participating-market gating, no kind restriction. Any Member can request a QR for any of their Items.)
- `ambient_extras` (JSONB — small, for fields not worth a column and never queried; **not** the dumping ground)
- `made_at_place_id` (nullable FK to `places.id`; meaningful only when `kind='product'`) — the Place the product is made in; powers the "Locally Made" badge. See *Provenance claims* section.
- `made_at_verification_source` (text, default `'none'`; check constraint over `('none','self_attested','community_attested','document_supported')`) — the evidence tier for the provenance claim. Tier 1 (`community_attested`) lands at b2+ alongside the buyer-attestation surface; the enum value is reserved at b1 so the column shape never changes.
- `created_at`, `updated_at`, `fulfilled_at` (nullable), `deleted_at` (soft)
- **Reserved at MVP, populated later:** `parent_item_id`, `collection_id`, `federation_origin`, `embedding_id`

**Kind-specific child tables** (1:1 with `items` where `items.kind` matches; FK = `item_id`):

- **`item_products`** — `price_cents`, `price_unit` (text — "loaf", "dozen", "lb"), `composition` (text — what it's made of, ingredients), `photo_urls` (text[]), `available_until` (nullable timestamptz). Indexes: composite on `(category, price_cents)` for browse.
- **`item_services`** — `rate_model` (enum: `hourly`, `flat`, `quote`, `membership`), `rate_cents` (nullable), `service_area_geography` (PostGIS — for area-inclusion queries), `hours` (JSONB — structured weekly hours), `license_info` (JSONB nullable — type, number, jurisdiction), `on_call` (bool), `accepts_new_clients` (bool default true).
- **`item_gatherings`** — `starts_at` (timestamptz, for one-time), `ends_at` (nullable), `recurrence_rule` (text RRULE format, nullable), `capacity` (nullable int), `cost_cents` (nullable; null = free), `what_to_bring` (text nullable), `host_member_id` (FK; usually = `items.member_id`, may differ for delegated hosting), `rsvp_cutoff` (nullable). Indexes: `(starts_at)` for the discovery feed, `(host_member_id)` for "who's hosting what."
- **`item_wonders`** — `interest_count` (int default 0; denormalized from `item_responses` for fast sort), `expires_at` (timestamptz; default 90 days from create), `conversion_target_kind` (enum nullable — author hint "I'd convert to a gathering if this gets traction"), `converted_to_item_id` (nullable FK — set when Wonder converts).

### Recurring gathering lifecycle (F034 architecture)

A recurring gathering (e.g., "Run Club every Thursday, June–August") is a single `items` row with a single `item_gatherings` child. The `recurrence_rule` column holds the iCal RRULE defining the series; `starts_at` always holds the **next upcoming occurrence**.

**One live occurrence at a time.** The platform materializes only the next occurrence as a concrete `starts_at` value. When that occurrence passes, a rotation job advances `starts_at` to the next date computed from the RRULE. This keeps the DB lean — no pre-creation of 13 rows for 13 Thursdays — while keeping the Item perpetually discoverable until the series ends.

**Rotation job.** A background process (cron or database trigger, implementation TBD) watches for `starts_at < now()` on items with a non-null `recurrence_rule`. For each match it computes the next occurrence from the RRULE, updates `starts_at` (and `ends_at` if duration is defined), and fires an `item.published` event to refresh the `discoverable_items` MV. If the RRULE has no more occurrences (series ended), the item transitions to `state='fulfilled'`.

**Discovery filtering.** The `discoverable_items` MV carries `starts_at` (T106). Discovery surfaces (`locality_feed_items`, `venue_nearby_items`) filter out past gatherings (`starts_at < now()`) and gatherings with no date set (`starts_at IS NULL` for kind='gathering'). Non-gathering items (products, services) pass through with null `starts_at`. Between the rotation job and the MV filter, a recurring series is always discoverable by its next occurrence and never shows stale dates.

**"I can't make this one — show me the next."** The RRULE is the series definition. Computing the next N occurrences from the rule is a pure function — no schema change, no pre-creation. The UI calls it on demand and renders a list of upcoming dates. A viewer who can't make this Thursday sees next Thursday, the Thursday after, etc., and can add any of them to their calendar.

**Calendar export.** The RRULE *is* the iCal recurrence format. Generating an `.ics` file with the full series is a literal pass-through of the stored rule — no transformation needed.

**Follow → notification across occurrences.** The `member_saved_searches` follow (from the venue page or item page) is tied to the *item* (the series), not to a single date. When the rotation job fires `item.published` on the next occurrence, the existing saved-search → event → notification pipeline alerts everyone following the item or venue. A viewer who follows "Run Club at Drake's" gets notified each time the next Thursday materializes — no re-follow needed.

**What ships when:**

- **b1 (shipped):** RRULE capture in the gathering composer (F034/T084-T085). `starts_at` on the MV (T106). Past-event filtering on discovery surfaces (T106). Schema supports the full lifecycle.
- **b2:** Rotation job. "Show me upcoming dates" UI on the event page. Single-occurrence cancellation. `.ics` export with RRULE. Edit-gathering flow (recurrence changes). RSVP per-occurrence.

**Shared join tables** (serve all kinds; no kind discriminator needed):

- **`item_locations`** — `id`, `item_id`, `location_id`, `schedule_kind` (enum: `one_time`, `recurring`, `ongoing`, `by_appointment`), `schedule_metadata` (JSONB), `status` (enum: `pending`, `approved`, `declined` — for cross-Member Location attachments), `created_at`, `removed_at` (soft).
- **`item_responses`** — `id`, `item_id`, `responder_member_id`, `response_kind` (enum: `interest`, `rsvp`, `follow`, `save`, `pledge`, `purchase`, `support`), `metadata` (JSONB), `created_at`, `withdrawn_at` (nullable). The `pledge` value is reserved at b1 for Initiative cohort items (b2+ surface — binding response shape, paired with an off-platform commitment). **No `pledge_intent` value** — cooperative cohorts are not modeled. Re-introduce `pledge_intent` only if a future Initiative or non-cooperative use case demands a non-binding intent shape distinct from `pledge`.
- **`item_tags`** — `item_id`, `tag` (controlled vocabulary — categories like `vet`, `plumber`, `food-makers`, `class`), composite PK. Powers the locality-index facets and structured filters. Curated by the platform.
- **`item_hashtags`** — `item_id`, `hashtag` (free-form text, normalized: lowercased, leading-`#` stripped, whitespace stripped), `created_at`, composite PK on `(item_id, hashtag)`. Free-form, user-generated. Captures long-tail differentiation (`#avian`, `#pre1900plumbing`), cross-category specificity (`#beginnerfriendly`, `#wheelthrown`), and trend emergence (`#fermentation`, `#naturallyleavened`). Index on `(hashtag)` for the `/h/[hashtag]` feed; index on `(hashtag, created_at desc)` for "trending #X nearby" surfaces. Composer offers autocomplete from existing hashtags as the user types — reduces noise without preventing new tags. Hashtags never appear as primary index facets; they live as clickable chips on Item pages and as peripheral discovery signal. At T3, hashtags get included in the embedding context for vector search.
- **`item_collaborators`** (T2 surface, schema reserved at MVP) — `item_id`, `member_id`, `role` (free text), `created_at`, `removed_at`. For cooperative Items where multiple Persons share creation credit.

**The locality-first index — `discoverable_items` materialized view.**

A denormalized join across the spine, the nearest-attached Location (with PostGIS geography), Member display info, brand-cluster siblings, response counts, and primary tag. Refreshed incrementally on writes to underlying tables. The Cluster 3 locality index queries this view exclusively; anonymous Loop 3 traffic never touches base tables in hot paths. Per-kind filters JOIN to `item_products` / `item_services` / `item_gatherings` / `item_wonders` only when the user asks a kind-specific question (price-sorted products, dated gatherings, top-interest Wonders).

**Event log entries (required at MVP):** `item.created`, `item.updated`, `item.published`, `item.location_attached`, `item.location_removed`, `item.responded`, `item.response_withdrawn`, `item.state_changed`, `item.fulfilled`, `item.deleted`, `item.community_changed`, `item.brand_label_changed`, `item.qr_card_requested` (Member-requested QR generation; payload includes `qr_card_url`), `item.converted` (T2 — Wonder → Gathering / Initiative), `item.collaborator_added` (T2). Append-only, partitioned monthly. The locality index, the future stakeholder dashboard, AI search, and Intelligence-layer surfaces all read from this log. Complete from day one — missing entries become retrofit work.

**Key event semantics — `item.published`.** Fired when an Item transitions from `state='draft'` (or `'withdrawn'`) to `state='published'`. Distinct from `item.created` (which fires when the row is first inserted, in any state). The split exists because two listeners care only about the publish moment, not the create moment:

1. **Discovery refresh.** A trigger on `item_events` listens for `item.published` rows and refreshes the `discoverable_items` materialized view (see below). The 60-second SLA the locality-first index promises (per F018 acceptance criteria and `discovery.md`) is enforced through this trigger, not through periodic polling.
2. **Follower fan-out.** When a Member with followers publishes an Item, follower notifications dispatch off this event (email at b1, push at b2 per `follow.md`). Drafts and withdrawals do not trigger notifications; only the publish moment does.

A helper SQL function `publish_item(item_id uuid)` performs the state transition + event append + (synchronous at b1) view refresh in one transaction.

**Discoverable-items refresh trigger.** The `discoverable_items` materialized view is refreshed by an `AFTER INSERT` trigger on `item_events` filtered to `event_kind = 'item.published'`. At b1 the refresh is **synchronous** (`REFRESH MATERIALIZED VIEW CONCURRENTLY discoverable_items` inside the same transaction) — view is small and traffic is local, latency budget is met. At T2, when traffic and the view both grow, refresh moves to **asynchronous** (NOTIFY/LISTEN with a job queue worker, or pg_cron at a short interval). The triggering event-row stays the contract; only the refresh mechanism changes between tiers. The `unique_idx_discoverable_items` index (created in the migration that builds the view) is required for `CONCURRENTLY` to work — confirm it exists before merging.

**API surfaces (read paths called from composers).**

- `GET /api/hashtags/suggest?q={prefix}` — autocomplete for the hashtag input. Returns the top 10 most-used hashtags whose normalized form starts with `prefix`. Requires a non-empty `prefix` (≥1 char after normalization); empty queries return 400 to prevent dumping the whole table. Response shape: `{ hashtags: [{ hashtag: string, item_count: int }] }`. Caching: 60s edge cache keyed on the normalized prefix. Used by the gathering composer (T038), and by the future product/service/wonder composers for the same hashtag input.

## Attribution contract (T095 Ratified 2026-06-03)

Every public Item page surfaces an attribution line — "Sold by …" / "Offered by …" / "Hosted by …" — that names the responsible party for the Item. The contract is decoupled from the seller's personal-profile visibility: an Item is visible to anyone the Item itself allows; the attribution names the responsible party; the link from the attribution to a personal `/m/[handle]` profile is gated by the Member's discoverability bit.

**The discriminated union.** Item resolvers return an `ItemAttribution` value shaped as a two-variant discriminated union:

```
type ItemAttribution =
  | { kind: 'group';  name: string }
  | { kind: 'member'; handle: string; displayName: string; isDiscoverable: boolean }
```

- **`kind === 'group'`** — the Item is filed under a Group (`items.group_id IS NOT NULL`). `name` is `items.brand_label`, denormalized from `group_businesses.display_name` at composer time. The attribution links to the Group page (the place-scoped `/p/[…place]/g/[slug]`, derivable from URL context). The members table is **not** read on this path.
- **`kind === 'member'`** — the Item is sold / hosted as an individual (`items.group_id IS NULL`). `handle` + `displayName` come from the embedded `owner:members!member_id(...)` row; `isDiscoverable` comes from a separate read of the `public.member_public_discoverability` projection view (see `member.md` § Attribution behavior). The attribution links to `/m/<handle>` when `isDiscoverable === true`; otherwise the name renders as plain text.

**Why the two paths differ.** Group-filed items attribute to the Group because Groups are always public-by-default (per `groups.md` § Public-face attribution) — there is no privacy state on a Group that could 404 the item page. Individual items have no public-by-default carrier, so attribution falls back to the Member and the conditional-link rule applies. This eliminates the seller-privacy-vs-item-visibility loop at the resolver layer rather than at RLS: the Group-filed common case never reads the seller's `members` row, so the seller's discoverability bit cannot 404 the Item.

**`brand_label` semantics under the new contract.**

- Group-filed items: `brand_label` is the denormalized Group display name and is the canonical attribution source. The Group page URL is derivable from the URL the viewer is on (the inner `/g/[slug]` segment); the resolver does not need to query `groups` for it beyond the existence check.
- Individual items: `brand_label` is null. Attribution reads from the members embed instead.

The field name `brand_label` predates this contract; it is now load-bearing for the Group-attribution path and the resolve-up rendering on the Item page is a single attribution block rather than a separate "Brand resolve-up" + "Sold by Member" pair.

**The `member_public_discoverability` projection view.** Defined in migration `030_member_discoverability.sql` § 4. Regular view (runs with owner privileges, bypassing the owner-only RLS on `member_privacy`) — same pattern as `member_public_group_memberships` in migration 029. Exposes only `(member_id, is_discoverable)`; never any other privacy column. Granted to `anon` and `authenticated`. The view is the only privacy-bearing read that an Item resolver makes for an individual-path Item; for a Group-filed Item, no privacy-bearing reads happen at all (Groups carry their own discoverability enum at the Group layer).

**Test for future proposals.** Does a proposal want to (a) attribute a Group-filed Item to the founder's personal handle rather than the Group, (b) 404 a Group-filed Item when the founder is not discoverable, or (c) embed the base `member_privacy` row directly in an item resolver? If yes, refuse — that re-couples item visibility to member visibility and re-opens the loop the Group-attribution model exists to close. The projection view is the only readable source of cross-Member discoverability state.

## AI / LLM searchability

Every Item is designed to be queryable via natural language at T3. The MVP doesn't build semantic search but commits to the schema that enables it:

- **Description as embedding substrate.** Item descriptions are written in natural language (first-person where appropriate, plain English, no keyword stuffing). The same description that reads well to a human will embed well for semantic search.
- **Controlled tag vocabulary for categories; free-form hashtags for the rest.** Categories (`item_tags`) use a curated vocabulary that bounds the index facets and the LLM filter-mapping surface. Hashtags (`item_hashtags`) are free-form, user-generated, and complement categories — they capture long-tail differentiation (#avian, #pre1900plumbing), cross-category specificity (#beginnerfriendly, #fermentation), and trends. Both feed embedding context at T3.
- **Predictable structured fields.** Kind, category, location, schedule — the fields an LLM maps "plumber on weekends in Oak Park" against — are consistent across Items and exposed cleanly in the data model.
- **Per-kind typed columns.** Kind-specific fields live in dedicated child tables (`item_products`, `item_services`, `item_gatherings`, `item_wonders`) with strong types and explicit columns. LLM mapping a query like "plumber on weekends in Oak Park" lands cleanly on `item_services.hours` + service_area + Location, not on parsed JSONB.
- **Reserved embedding column.** `items.embedding_id` is reserved at MVP; the parallel `item_embeddings` table is built at T3 when vector search ships.

The MVP serves structured-filter search; T3 adds vector search; T3 also surfaces a chat interface that resolves natural-language queries to Item results. The throughline from MVP description text to T3 chat answer is unbroken because the schema commitments are made on day one.

## Integration Points

- **Connects to:**
  - **Member** (every Item is created by a Person; per `member.md`)
  - **Location** (every standing Item attaches to at least one Location; per `location.md`, forthcoming)
  - **Group** (Items optionally file under a Group via `items.group_id`; per `groups.md` — replaces the prior Community framing)
  - **Initiatives** (an Initiative is an Item kind with extended state machine; per `initiatives.md`)
  - **Maker** (a Maker's products are Items of kind `product`; per `maker.md`, forthcoming)
  - **Service Provider** (a Service Provider's services are Items of kind `service`; per `service-provider.md`)
  - **Organizer** (an Organizer's gatherings are Items of kind `gathering`; per `organizer.md`, deferred)
- **Used by:**
  - The locality-first index (Cluster 3 — queries across Items by kind, location, tags, schedule, distance)
  - The AI / chat search surface at T3
  - The Member's "what I've made / posted" view
  - Community surfaces (filter Items by Community membership of the creating Member)
  - The Intelligence layer (Item creation rates, fulfillment rates, response rates by category and locality are direct signals of community economic activity)

## Open questions

- **Item kind boundaries.** Is a sourdough class a Product, a Service, or a Gathering? Working answer: `service` if it's bookable on demand for groups; `gathering` if it's recurring and others can drop in. May warrant its own `class` kind at T2.
- **Standing vs. event Items.** The schema treats them uniformly via `state` and `schedule_kind`, but UX must handle them differently (a Product is "available," a Gathering is "scheduled," a Wonder is "open"). Likely metadata-driven UX layer rather than per-kind page templates.
- **Item ownership across Persons.** A cooperative bakery's products may be made by multiple Persons. Working answer: one creating Member of record, additional Members in `item_collaborators` at T2. Revisit when first cooperative Initiative funds.
- **Conversion mechanics.** When a Wonder converts to a Gathering or Initiative, does a new Item get created (with `parent_item_id`) or does the existing Item transform in place? Working answer: new Item, parent link, mirroring Community's wonder-to-host pattern. Confirm before T2.
- **Cross-Community visibility for Items.** Inherited from the creating Member's posting context, or Item-level setting? Working answer: inherit by default, Item-level override allowed at T2.
- **Tag vocabulary governance.** Controlled vocabulary needs maintenance as Items proliferate. Open whether there's a community contribution mechanism (proposal + approval) or platform-curated only. Likely platform-curated through T2, then reconsider.
- **Vector search build vs. partner.** At T3, build embedding infrastructure in-house or partner with an external semantic search provider? Cost, latency, and operational complexity differ. Defer until T2 metrics indicate volume.
- **Item edit history.** Should every Item edit be versioned at MVP, or only at T3? Cheap to add later if event log is complete. Defer.
- **Federated Item identity.** When Items federate across platforms (T3), what's the identity model — same `id` across platforms via a shared registry, or platform-scoped ids with federation pointers? Defer until cooperative-services platform is real.

## Comments

The Item primitive is the structural unification of the platform's surfaces. Without it, the platform builds Maker, Service Provider, Organizer, Wonder, Offer, Ask, and Initiative as seven separate systems — seven schemas, seven page templates, seven search behaviors — and the cumulative experience reads as a fragmented suite, not one platform.

Modeling them as Items with kind variations is what makes the locality-first index possible (one query against one table, filtered by kind), what makes natural-language search tractable at T3 (one schema for embeddings), what makes the Wonder-to-Gathering and Wonder-to-Initiative conversions clean (same primitive, kind change with parent link), and what makes future Item kinds cheap to add (one enum value and one metadata schema, not a new system).

The deliberate use of `metadata` JSONB per Item is what lets the schema flex across kinds without proliferating columns. Each kind has a documented metadata schema; the JSONB is structured storage in a deliberately constrained way, not a free-for-all. Reviewers should treat the per-kind metadata schema as an interface contract and version it accordingly.

The forward commitment to natural-language search via vector embeddings at T3 is what protects the platform from devolving into a tags-only experience. As the volume of Items grows, structured filters become insufficient — people want to ask *"who near me sells eggs from happy chickens"* and get an answer. The MVP doesn't build this, but it reserves the column, the parallel table pattern, and the description-writing posture that makes embedding work later. Skipping these reservations at MVP is the failure mode the entire data-model section is designed to prevent.

Finally: no Business entity (see [`../foundation/primitives.md`](../foundation/primitives.md) § Why no Business entity). For Items, this means a Person's Items belong to that Person, and a cooperative's Items are owned by the cooperative-Community with collaborator Members in `item_collaborators` (T2) — no shell entity between Persons and the things they make. That absence is what keeps the data model honest about who is actually doing the work in any community.

## Decisions encoded here

This spec is the live home for the following architectural decision. See [`../../playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) for the cross-cutting register.

| Status | What lives here |
|---|---|
| Accepted | A market is a Gathering Item; "gathering" is broad and varied (farmers markets, swap meets, classes, workshops, run clubs, movie nights, community projects). Distinction between kinds of gathering lives in **categories and hashtags** (`item_tags` controlled vocabulary + `item_hashtags` user-generated), not in a separate Item kind. The "Market session" feed-card type is removed — markets render as gathering cards. |

This spec also *encodes* (but does not own) the audit-field commitment (`acting_member_id` + `via_delegation_id` on every event row), the action-layer contract (action handlers `item.create`, `item.publish`, `item.qr_card.request`, etc.), and the event semantics (`item.published` event + `discoverable_items` synchronous refresh). Those live cross-cutting in `DECISIONS.md`.
