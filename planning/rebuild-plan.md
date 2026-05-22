# Rebuild on Primitives

**Status:** Approved 2026-05-10 — clean-slate rebuild on Person / Item / Location / Group primitives. The current `web/` data layer is replaced, not migrated. App shell (auth wiring, design tokens, Tailwind/Next/Supabase scaffolding) is preserved.

> **Why "rebuild" not "migration".** The current app is in development; nobody is using it; there is no production data to preserve and no URL anyone has bookmarked. The prior plan's complexity — dual-write, backfill, divergence checker, two-week zero-read verification, per-phase rollback — existed to protect a live system. With no live system, all of it goes away. The work that remains is the rebuild of the data layer, the action layer, and the user-facing surfaces on top of an unchanged framework foundation.

**Source documents:**
- [`product/needs/member-journey.md`](../product/needs/member-journey.md) — north star
- [`product/foundation/primitives.md`](../product/foundation/primitives.md) — data spine
- [`product/foundation/principles.md`](../product/foundation/principles.md) — values stake
- [`product/foundation/policy.md`](../product/foundation/policy.md) — three-filter test, opt-out default, anti-Nextdoor commitments
- [`product/systems/item.md`](../product/systems/item.md) — Item primitive (spine + 4 child tables)
- [`product/systems/groups.md`](../product/systems/groups.md) — Group primitive (spine + 2 child tables; supersedes Community / Operations / Cooperative)
- [`product/systems/member.md`](../product/systems/member.md) — Member primitive (anchor; multi-Location affinities; DM substrate)
- [`product/systems/location.md`](../product/systems/location.md) — Location primitive (spine + 3 child tables)
- [`planning/bundles/b1-primitives.md`](../planning/bundles/b1-primitives.md) — b1 scope
- [`planning/DECISIONS.md`](../planning/DECISIONS.md) — active ADRs

**Decisions ratified in this plan:**
- **ADR-1** (stack: Next.js + Tailwind v4 + Supabase + Mapbox) — retained.
- **ADR-2** (bottom-anchored mobile-first UI) — retained.
- **ADR-4** (locality default = geolocate then city-pick, mutable) — retained; multi-Location belonging via `member_location_affinities` is additive substrate.
- **ADR-6** (Member-owned context, standing-derived persistence) — Assistant Context + Delegation substrate at b1, audit fields on every event row.
- **ADR-7** (action layer is the only write surface) — every Phase 1+ ticket implements writes via named action handlers.
- **ADR-9** (policy framework — opt-out default, three-filter test, anti-Nextdoor commitments).
- **ADR-10** (action layer + event log invariants) — same-transaction event-row commit, audit fields, view-refresh semantics. **Rewritten 2026-05-10** to drop the dual-write / per-phase rollback / verification-window sections (no live system to coexist with).
- **ADR-12 SUPERSEDED 2026-05-12** (per `agent-commerce-and-project-amendments.md` §6) — the "Maker mode" framing is retired. The `members.maker_mode_enabled` column is **dropped before any data lands**. Selling tools surface from Group / Item state: ≥1 active `kind='business'` Group membership, or any `items.kind='product'`/`'service'` row. Vocabulary: **Seller** generically; **Producer** in agricultural/food contexts (already used in `producer-tools.md`, `producer-tools.md`). "Maker" survives only as a UI label when a Member self-identifies (craftspeople, artisans).
- **ADR-13 pending** — Group consolidation. Spec banner in `groups.md` carries the decision.
- **ADR-14 pending** — Location spine + child architecture. Spec banner in `location.md` carries the decision.

---

## What we keep from current `web/`

The framework foundation is fine; the data layer is what's wrong. Preserve:

- **Next.js App Router scaffold** — `package.json`, `next.config.*`, `tsconfig.json`, ESLint + Prettier configs.
- **Tailwind v4 config + DLS tokens** — `tailwind.config.*`, the `@theme inline` token definitions, the design-language CSS variables.
- **Supabase client wiring + auth provider** — Magic link, Google OAuth, Apple OAuth flows. Real work that doesn't need redoing.
- **Mapbox GL JS integration** — initialization, style tokens, marker conventions.
- **Layout shells + design-system primitives** — page wrappers, mobile nav scaffold, bottom-anchored layout per ADR-2, modal patterns. Rebuild against new schema where they touch data.
- **Playwright + Vitest infrastructure** — test runners, fixtures, CI wiring. The tests themselves replace.
- **`web/CLAUDE.md`** — tech-stack instructions; route conventions update in Phase 4.

## What we delete from current `web/`

The data layer goes entirely. Specifically:

- **All DB migrations** under `web/supabase/migrations/` — replaced with a fresh sequence.
- **All routes tied to old schema** — `/vendors/*`, `/business/*`, `/register-vendor`, `/you/vendor/*`, `/markets/*`, `/events/*`.
- **All business logic** referencing `businesses`, `markets`, `events`, `follows`, `vendor_*`, `bulletin_*`, `support_*`, `report_*` tables.
- **The current Home / Explore / You components** that read from old schema. Visual references stay; rebuild against the new primitives.
- **Founder dashboard and bulletin compose pages** tied to the old data layer.
- **Existing Playwright/Vitest tests** against old schema. Test infrastructure stays; tests replace.

The shipped tickets T001-T026 become reference, not heritage. They're moved to `development/tickets/done/` already; no further preservation.

---

## Decisions before tickets

1. **Clean-slate rebuild.** No data preservation, no dual-write, no per-phase rollback, no sunset window. Each phase produces working software at the end; no constraint that prior phases keep working.

2. **People-first is a hard constraint.** No `businesses` table. No Brand entity. Personal businesses are kind='business' Groups (per `groups.md`). Cooperative-style coordination is deferred indefinitely; the cooperative-shape use case ships at b1 as kind='business' Groups with multiple owner-role memberships.

3. **Item is the grammar; Member is the anchor; Location is where; Group is people-organizing.** Every PR during the rebuild produces code that reads like that grammar.

4. **No-login locality view non-negotiable** at b1. Loop 3 (Land here) is the lightest, most underserved loop and the strongest argument for the platform. `/explore` browseable without authentication.

5. **Wonder ships at b1.** Cheapest demonstration of the response-surface architecture and the hypothesis test for whether people will declare ideas in public.

6. **Groups ship at b1 — full surface, all six kinds.** `place`, `interest`, `practice`, `event_anchored`, `family`, `business`. Schema, create/join/leave, Group page, Group index, role-per-kind validation, soft-membership inference. Posting feeds inside Groups, stewardship rotation, capital-flow surfaces all defer to b2/b3.

7. **Multi-Location belonging via `member_location_affinities`.** Substrate at b1 (`lives` / `works` / `plays` / `visits` / `follows` / `liked`). Surface at b2.

8. **Item-level QR card affordance.** Any Member can request a QR card for any of their Items. Resolves to the Item's kind-specific canonical URL (per `item.md` naming table). No Location gating, no participating-market enum, no kind restriction.

9. **Anti-Nextdoor commitment lives in messaging-scope and complaint downvote/removal.** Not in absence of Member-Location relationships. The DM substrate ships with `group_id` only — no `location_id` column ever lands.

10. **Multi-location single-owner resolves up via `brand_label` on Items + `group_businesses.display_name` on kind='business' Groups.** Same `member_id` plus same brand_label = locally owned multi-location; same brand_label plus different `member_id`s = franchise pattern.

---

## Phases

Four phases. Each produces working software. No reversibility constraints between phases (no live system to roll back to).

### Phase 0 — AI-native floor

**Goal:** the substrate every later phase inherits — action layer skeleton, system Member, pgvector + postgis, embedding tables, auth signup hook — exists and is callable. Without these, every later ticket either bypasses ADR-7 / ADR-6 / ADR-10 or has to retrofit them.

**Migrations** (fresh sequence; not numbered against any existing migration):

- `001_extensions.sql` — `create extension if not exists vector; create extension if not exists postgis;`. Pre-conditions for embedding columns and PostGIS geography types in later phases.
- `002_system_member.sql` — inserts the **system Member** with `handle='system'`, `display_name='System'`, login disabled, used as `acting_member_id` for platform-emitted events. The handle is reserved. Tests verify the row exists, login is blocked, and the handle cannot be claimed.
- `003_action_layer_scaffold` (app-layer migration in `web/src/actions/`) — establishes the directory with a single named-handler signature pattern: Zod input schema convention, audit-field injector, transaction wrapper, event-log writer. One existing write (the simplest one — likely `member.create` for the auth signup hook) is implemented as proof of pattern. Per ADR-7.
- `004_item_embeddings.sql` — empty parallel `item_embeddings (item_id, model_version, embedding vector(1536), created_at)` table. Reserves `items.embedding_id` (will be added in Phase 1). Per `item.md` AI/LLM section.
- `005_member_embeddings.sql` — empty parallel `member_embeddings (member_id, model_version, embedding vector(1536), created_at)`. Reserves `members.embedding_id` (will be added in Phase 1).
- `006_auth_signup_hook.sql` — Supabase Auth post-signup hook (Postgres trigger or Edge Function) calling the `member.create` action handler. Per `member.md`. Without this, Member rows don't exist until the app reads `auth.users`.

**Convention established here, applied in Phase 1:** every event table created in Phase 1 inherits audit fields (`acting_member_id NOT NULL` + `via_delegation_id`) from day one. No retrofit needed since there are no existing event tables to upgrade.

**Tickets:** ~4-5 (T_floor_a system Member, T_floor_b action layer scaffold, T_floor_c pgvector + postgis + embedding tables, T_floor_d auth signup hook).

**Effort:** ~1 week. **Risk:** low.

**Exit criterion:** the action layer is the only write surface for the refactored handler. The system Member exists; login is blocked. pgvector and postgis are enabled. The embedding tables exist empty. A Member row is created automatically when a new `auth.users` row appears, with audit fields populated by the action handler. Eval: spawn a test auth user; verify `members` row exists and `member.created` event has `acting_member_id = <new member id>`.

---

### Phase 1 — Schema floor

**Goal:** all primitive tables exist with RLS, indexes, action handlers, and event-log writers wired. Empty database; nothing user-visible yet.

**Pre-step:** drop all existing migrations under `web/supabase/migrations/`. Wipe development databases (`supabase db reset`). The old `businesses`, `markets`, `events`, `follows`, `vendor_*`, `bulletin_*` tables disappear in development; production never had them since the app isn't live.

**Member surface (007 series):**

- `007_members.sql` — `members` table per `member.md`. `id` references `auth.users(id)` directly; `handle` (unique, regex-constrained, profanity-filtered), `display_name`, `bio`, `avatar_url`, `pronouns`, `home_location_id` (nullable FK to locations — added by Phase 1 Location migration), `primary_group_id` (nullable FK to groups — added by Phase 1 Group migration), `stakeholder_visibility` (reserved), `embedding_id` (reserved per Phase 0), soft-delete, timestamps. **No `business_name`** (Items / Groups carry brand labels). **No `role`** (verbs surface from Group memberships and Item activity). **No `primary_community_id`** (renamed to `primary_group_id` per Groups ratification). **No `maker_mode_enabled`** (dropped per ADR-12 SUPERSEDED 2026-05-12 — selling tools surface from kind='business' Group membership or kind='product'/'service' Item presence, not from a profile toggle).
- `007a_member_privacy.sql` — opt-out defaults per ADR-9. Trigger creates the row on `members` insert.
- `007b_member_interests.sql` — controlled-vocabulary tag list per Member.
- `007c_member_follows.sql` — Loop 8 substrate. Composite PK; soft-unfollow.
- `007d_member_handle_history.sql` — T2 surface; schema reserved at b1.
- `007e_member_threads.sql` + `007f_member_messages.sql` + thread-participants — DM substrate per `member.md`. `member_threads.group_id` (nullable FK to groups). **No `location_id` column ever** — per the no-Location-messaging commitment in `policy.md`. Surface b2; substrate-only at b1.
- `007g_member_self_records.sql` + `007h_member_delegations.sql` — agent-assistance substrate per ADR-6. Surface b2/b3.
- `007i_member_location_affinities.sql` — multi-Location belonging per `member.md`. Composite PK on `(member_id, location_id, affinity_kind)`; affinity_kind enum (`lives`, `works`, `plays`, `visits`, `follows`, `liked`). Indexes on `(member_id, affinity_kind)` for the Member's own surfaces and on `(location_id) where affinity_kind='follows'` for the b2 follow-Location feed and `(location_id, affinity_kind) where affinity_kind in ('lives','works')` for the locality-promotion derivation in `groups.md`.
- `007j_member_events.sql` — Member event log, partitioned monthly per ADR-10. Carries `acting_member_id NOT NULL` + `via_delegation_id` per ADR-6. Partition rotation routine (pg_partman or pg_cron) installed here. Event kinds at b1: `member.created`, `member.profile_updated`, `member.handle_changed` (T2 surface; reserved), `member.home_location_set`, `member.privacy_changed`, `member.maker_mode_changed`, `member.followed` / `member.unfollowed`, `member.location_affinity_added` / `member.location_affinity_removed`, `member.interest_added` / `member.interest_removed`, `member.delegation_granted` / `member.delegation_revoked`, `member.deleted` / `member.restored`, `member.export_requested`, `member.purge_executed`.

**Location surface (008 series — spine + 3 children per ADR-14):**

- `008_locations.sql` — spine: `id`, `member_id` (creator-of-record), `kind` enum (`permanent`, `recurring_temporary`, `area`), `label`, `slug` (unique), `description`, `geography geography(Point, 4326) NOT NULL` (Point for all kinds; centroid for areas synced by trigger on the polygon child), `parent_location_id` (reserved for sub-venue surface in T2), `brand_label` (nullable text — Location-level fallback when no Group is anchored), `discoverability` enum (`listed` / `unlisted` / `private` default `listed`), `ambient_extras jsonb`, `embedding_id` (reserved), `federation_origin` (reserved), soft-delete, timestamps. GIST index on `geography`. **No `qr_card_url`, no `participating_market`** — QR cards are an Item-level affordance per `item.md` / `qr-onboarding.md`.
- `008a_location_permanent.sql` — child for kind='permanent': `street_address` (nullable text — Member-authored, not normalized at b1), `public_hours jsonb` (nullable), `accessibility_notes` (nullable text).
- `008b_location_recurring_temporary.sql` — child for kind='recurring_temporary': `recurrence_rule text` (RRULE format, nullable at b1), `session_start_time time`, `session_end_time time`. At b1, recurrence may be stored as JSONB on the spine's `ambient_extras` (`{days, start_time, end_time}`); T2 promotes to typed columns + RRULE.
- `008c_location_areas.sql` — child for kind='area': `polygon geography(Polygon, 4326) NOT NULL`, `area_kind` enum (`service_radius`, `neighborhood`, `city`, `region`, `custom`), `radius_meters int` (nullable, populated for circular areas). On insert/update, a trigger computes the polygon's centroid and writes it to the spine's `geography` column so proximity queries work uniformly across kinds.
- `008d_location_events.sql` — Location event log, partitioned monthly, audit fields. Event kinds at b1: `location.created`, `location.updated`, `location.moved`, `location.polygon_updated`, `location.hours_updated`, `location.deleted`, `location.restored`. Reserved at b1, surfaces at T2: `location.claim_requested`, `location.claim_resolved`, `location.contributor_added`, `location.followed`, `location.unfollowed` (paired with `member_location_affinities` writes).

**Item surface (009 series — spine + 4 children + relations + events):**

- `009_items.sql` — spine: `id`, `member_id`, `kind` enum (`product`, `service`, `gathering`, `wonder`; `offer`, `ask`, `initiative` reserved). **No `cooperative_cohort` value** — dropped per the Groups ratification. `title`, `description`, `state` enum (`active`, `fulfilled`, `withdrawn`, `closed`), `category`, `group_id` (nullable FK to groups — replaces the prior `community_id`), `brand_label` (nullable; same `member_id` + same `brand_label` = locally owned multi-location; powers resolve-up rendering), `qr_card_url` (nullable text — populated by `item.qr_card.request` action handler), `ambient_extras jsonb`, reserved: `parent_item_id`, `collection_id`, `federation_origin`, `embedding_id`. Soft-delete, timestamps.
- `009a_item_products.sql` — 1:1 child for kind='product'.
- `009b_item_services.sql` — 1:1 child for kind='service' with PostGIS `service_area_geography`.
- `009c_item_gatherings.sql` — 1:1 child for kind='gathering'.
- `009d_item_wonders.sql` — 1:1 child for kind='wonder'.
- `009e_item_locations.sql` — join: `item_id`, `location_id`, `schedule_kind` enum, `schedule_metadata jsonb`, `status` enum, soft-delete.
- `009f_item_responses.sql` — uniform: `response_kind` enum (`interest`, `rsvp`, `follow`, `save`, `pledge`, `purchase`, `support`). **No `pledge_intent`** — dropped per the Groups ratification. The `pledge` value is reserved at b1 for Initiative cohort items (b2+ surface).
- `009g_item_tags.sql` — controlled vocabulary; composite PK.
- `009h_item_hashtags.sql` — free-form; composite PK on `(item_id, hashtag)`; index on `(hashtag)` for the `/h/[hashtag]` feed and `(hashtag, created_at desc)` for trending.
- `009i_item_events.sql` — Item event log, partitioned monthly, audit fields. Event kinds at b1: `item.created`, `item.updated`, `item.published`, `item.location_attached`, `item.location_removed`, `item.responded`, `item.response_withdrawn`, `item.state_changed`, `item.fulfilled`, `item.deleted`, `item.group_changed`, `item.brand_label_changed`, `item.qr_card_requested`. Reserved at b1, surfaces at T2: `item.converted` (Wonder → Gathering / Initiative), `item.collaborator_added`.

**Group surface (010 series — spine + 2 children + memberships + events per ADR-13):**

- `010_groups.sql` — spine: `id`, `name`, `slug` (unique), `kind` enum (`place`, `interest`, `practice`, `event_anchored`, `family`, `business`), `anchor_location_id` (nullable FK to locations), `parent_group_id` (reserved), `founder_member_id` (NOT NULL — operating-owner anchor for kind='business' Groups), `description`, `discoverability` enum (`listed` / `unlisted` / `private` default `listed`; `family` defaults `private`), `metadata jsonb`, `established_on date` (Member-claimed continuity, nullable), dormancy fields (`dormant_at`, `dissolves_at`, `dissolved_at`), timestamps.
- `010a_group_businesses.sql` — child for kind='business': `display_name` (the brand label — Maya's "Oak Park Sourdough"), `public_description`, optional `legal_entity_kind` enum (`llc`, `sole_prop`, `partnership`, `other`), optional `state_of_formation`, optional `formed_at`. **No `ownership_locality` column** — locality is derived at query time from owner Member affinities vs. Group's `anchor_location_id` per `groups.md`.
- `010b_group_event_anchored.sql` — child for kind='event_anchored': `seeded_by_item_id` (FK to items, nullable).
- `010c_group_memberships.sql` — `(group_id, member_id)` composite PK, `role text` (validated per-kind in the action layer), `source` enum (`explicit`, `soft_via_follow`, `soft_via_attendance`), `joined_at`, `left_at` (soft), `confirmed_by_member_id` + `confirmed_at` (b2 surface for staff confirmation in business kind; reserved at b1). Indexes on `(member_id, group_id) where left_at IS NULL AND source='explicit'` and `(group_id, role) where left_at IS NULL`.
- `010d_group_events.sql` — Group event log, partitioned monthly, audit fields. Event kinds at b1: `group.created`, `group.member_joined`, `group.member_left`, `group.role_changed`, `group.steward_transferred`, `group.dormant`, `group.dormancy_extended`, `group.revived`, `group.dissolved`.

**Standing-tier view (per `groups.md`):**

`member_has_standing_presence` view returns TRUE for a Member when ≥1 active membership in a kind='business' Group OR `role='steward'` membership in any non-business Group. Replaces the prior `member_operations`-derived view per the Groups ratification.

**Discovery surface (011):**

- `011_discoverable_items.sql` — materialized view joining items spine + nearest Location + Member display info + Group display (when filed under kind='business' Group) + response counts + primary tag. AFTER INSERT trigger on `item_events` filtered to `event_kind='item.published'` calls `REFRESH MATERIALIZED VIEW CONCURRENTLY discoverable_items` per ADR-10. Pre-condition: `unique_idx_discoverable_items` on `(item_id)` exists before the trigger is created. The locality-first index queries this view exclusively.

**Action handlers** ship alongside their tables (per ADR-7). Initial set:

- **Member:** `member.create`, `member.profile.update`, `member.handle.set`, `member.privacy.update`, `member.locality.set`, `member.location_affinity.add`, `member.location_affinity.remove`, `member.maker_mode.toggle`, `member.maker_mode.activate`, `member.maker.full_stop`, `member.interests.add`, `member.interests.remove`, `member.follow`, `member.unfollow`, `member.delete`, `member.export.request`, `member.purge.execute`, `member.delegation.grant`, `member.delegation.revoke`.
- **Location:** `location.create`, `location.update_metadata`, `location.move` (same-coords-or-flag rule), `location.update_polygon`, `location.set_hours`, `location.delete`, `location.restore`.
- **Item:** `item.create`, `item.update`, `item.publish` (transitions state, fires `item.published`, triggers view refresh), `item.attach_location`, `item.detach_location`, `item.respond`, `item.withdraw_response`, `item.set_state`, `item.delete`, `item.qr_card.request` (generates PNG, writes `qr_card_url`).
- **Group:** `group.create`, `group.member_join`, `group.member_leave`, `group.role_change`, `group.steward_transfer` (community kinds only), `group.extend_dormancy`, `group.revive`, `group.dissolve`.

**RLS:** every table passes the anon vs auth-self vs auth-other matrix smoke test. Public-read tables (`items` where `state='active'` and discoverability allows; `locations` where `discoverability != 'private'`; `groups` where `discoverability='listed'`) are anon-readable; owner-writes only via action layer.

**Tickets:** ~10-15 (per-migration plus the action-handler set). `pipeline-ticket` decides allocation when the work begins.

**Effort:** ~2-3 weeks. **Risk:** low — additive only; no live data to corrupt.

**Exit criterion:** all tables exist; RLS matrix passes; action-handler conformance check passes (no write to `*_events`, `members`, `items`, `locations`, `groups` outside the action layer); audit fields populated by handlers (CI assertion); the `discoverable_items` refresh meets the 60s SLA under synthetic 10× write load; system Member is the `acting_member_id` for platform-emitted events.

---

### Phase 2 — Cluster 1 surfaces (Standing presence)

**Goal:** A Person can sign up, create an Item of any of the four b1 kinds (product / service / gathering / wonder), attach a Location, and reach a public page in <90 seconds.

**New routes** (all new; old routes don't exist):

- `/m/[handle]` — Member public page. Items grouped by `brand_label`. Group memberships visible per privacy. Multi-Location affinities surface privately on `/you`, publicly only when the Member opts in.
- Kind-specific Item URLs (`/e/[event]`, `/p/[product]`, `/s/[service]`, `/i/[idea]`, `/o/[offer]`, `/a/[ask]`, `/initiative/[init]` per `item.md` naming table) — Item public pages, first-class, not buried. Includes resolve-up rendering (per `item.md`):
  - **Owner.** Member name + link to `/m/[handle]`. Always.
  - **Brand.** `group_businesses.display_name` if filed under kind='business' Group; else `items.brand_label` if set.
  - **Multi-location:** same brand_label + same `member_id` → "Local — one owner" badge with linked siblings; same brand_label + different `member_id`s → "Franchise — local operator" badge.
  - **Group.** Linked to `/g/[slug]` if `items.group_id` is set.
- `/l/[slug]` — Location public page. Venue page pattern per `community-platform.md`: header (hero image → name → address+distance), primary CTA "Host something here" → gathering composer with this Location pre-attached. Sections: "What's happening here," "About," "Items here." Optional "Follow this place" CTA (writes `member_location_affinities` row of `affinity_kind='follows'`).
- `/g/[slug]` — Group public page. Header, Members visible per privacy, Items filed under the Group, anchored Location.

**Surface-specific composers per loop** (no unified `/new` picker):

- **Gathering** — venue page (`/l/[slug]`) "Host something here" CTA; Member's `/you` "Host a gathering" affordance.
- **Product** — Seller-as-Member profile "Sell" / "Add a product" affordance; visible to any Member, opens the kind='business' Group walkthrough for first-time Sellers (no Maker-mode gate).
- **Service** — `/you` "Offer a service" affordance; visible to any Member, opens the kind='business' Group walkthrough for first-time Sellers (no Maker-mode gate).
- **Wonder** — Phase 3 (paired with the locality-first index).

Each composer carries its kind as known context, never as a picker. The four entries are instances of the same underlying `item.create` action handler with `kind` predetermined from the entry surface.

**"Sell" CTA** on `/you` and as a secondary CTA on the gathering / wonder composers. Tapping it opens the kind='business' Group walkthrough — for first-time Sellers, creates a kind='business' Group with the Member as sole owner-role membership. Selling-tool affordances surface from that membership going forward; no profile toggle is set or maintained. (Per ADR-12 SUPERSEDED 2026-05-12, the prior `member.maker_mode.activate` composite handler is dropped — the Group-create flow stands on its own.)

**Item-level QR card affordance.** Post-create screen on the Item composer offers "Get a QR card for this." Calls `item.qr_card.request`; generates PNG at print-quality DPI; downloadable. Per `qr-onboarding.md`. Available for any kind of Item (product, service, gathering/event, wonder/idea). Resolves to the Item's kind-specific canonical URL (per `item.md` naming table). The Seller-at-the-farmers-market case is the canonical first instance, not the only one.

**Component reuse from current `web/`** (harvest only what's worth re-typing):

- Item card / Member card / Location card visuals — rebuild against new schema.
- Bottom-anchored search component per ADR-2.
- Layout shells (page wrappers, mobile nav, modal patterns).
- DLS tokens (Tailwind config, CSS variables, design-language).
- Auth-gate modal (unchanged in shape; new auth flow).

**Tickets:** ~10-15.

**Effort:** ~3-4 weeks. **Risk:** medium (new design surface area; the 90-second composer is a real challenge).

**Exit criterion:** a new Member can sign up, create an Item, attach a Location, and reach a public page in <90 seconds. The F018-F021 scenarios pass evals end-to-end. Surface-specific composers reachable from their named entry points (no `/new` picker exists). Item-level QR card affordance generates a PNG. The "Sell" CTA creates a kind='business' Group.

---

### Phase 3 — Locality index + Wonder + thesis page + Group surfaces

**Goal:** close the b1 hypothesis test surface. Index browseable without login. Wonder live. Thesis page linked from every page. Groups create/join/browse.

**New routes:**

- `/explore` — locality-first index. **No-login browseable.** Filterable by kind, category, distance, schedule. Reads `discoverable_items` materialized view exclusively.
- `/g` — Group browse index. Filterable by anchor Location, kind, follow-graph, size.
- `/g/new` — Group create flow. Six kinds; each kind walks role-per-kind validity (e.g., kind='business' creates founder owner-role membership).
- `/why` — thesis page. Static content. Links from every page footer. Uses content from `use-cases.md`, `principles.md`, `member-journey.md` distilled.

**Surfaces:**

- **Wonder kind composer** (no schedule, no Location required). Posts from `/explore` ("Wonder if…" composer) and from `/you`. Page at `/i/[idea-slug]` (the Idea URL slot — see `item.md` naming table) with "I'd be in" response, count visible.
- **Wonder → Gathering / Wonder → Initiative conversion stub.** T2 surface; data model entry only at b1 (the `parent_item_id` reservation).
- **Onboarding suggestion step** — when a Member sets a home Location, surface listed Groups anchored to that Location with a tap-to-join. Skippable; defaults to no memberships.
- **Concerts in the Park surface** (per canonical example #12) — Members follow Locations, get a feed of Items attached to those Locations, filterable by `member_interests` taste profile + MSA browse. Reads `member_location_affinities` of kind=`follows` joined to `item_locations`. The compositional query *"outdoor live music in summer across the Sacramento MSA"* is composable at b1; the saved-search affordance ships at b2.
- **Anonymous Loop 3 path** — a newcomer can land on `/explore`, browse Items near a stated point, click an Item, see the Member and Location, read the thesis. No account required.

**Tickets:** ~8-10.

**Effort:** ~3-4 weeks. **Risk:** medium (Wonder is genuinely new behavior; no-login surfaces require RLS care).

**Exit criterion:** six loops fully reachable per the b1 bundle. A newcomer can reach `/explore` without an account and browse Items. A Member can create a Wonder in 30 seconds. A Member can create or join a Group in under a minute. The Concerts-in-the-Park surface delivers a Location-follow feed. Thesis page footer link present on every page.

---

### Phase 4 — Doc cleanup + final retirements — **DONE 2026-05-11**

**Goal (met):** docs match code; retired specs leave the live tree.

**Completed 2026-05-11:**
- `product/systems/vendor-bulletin.md` → rewritten as [`producer-tools.md`](../product/systems/producer-tools.md); original archived.
- `product/systems/vendor-intelligence.md` → rewritten as [`producer-tools.md`](../product/systems/producer-tools.md); original archived.
- `product/systems/vendor-self-service.md` → retired as superseded (Location concerns covered by `location.md`; profile-completeness covered by `producer-tools.md` T1; community pin-flagging absorbed into `location.md` T2). Original archived.
- `product/capabilities/pin-accuracy-verification.md` → archived (substrate now in `location.md`).
- `product/systems/community.md`, `member-operations.md`, `cooperative.md` → archived. The live `groups.md` is the only spec for the Group primitive.
- `product/foundation/primitives.md` Community section → rewritten as Group section with six-kind framing.
- `product/ui/community-platform.md` → broader rewrite (Member/Producer language replaces Shopper/Business; anti-Nextdoor framing replaces "Nextdoor-style location-locked feed"; archived C2/C3 capability rows). [Renamed from `product/products/` 2026-05-11.]
- `product/capabilities/community-create-join.md` → renamed and rewritten as `group-create-join.md`.
- `product/capabilities/consumer-feed.md` → renamed "Locality Feed" and re-anchored on Item primitive.
- `product/capabilities/landing-page.md` → rewritten on Member primitive with anonymous Loop 3 path.
- `product/capabilities/shareable-listing.md` → renamed "Shareable Entity Pages" and generalized across `/i/`, `/m/`, `/l/`, `/g/` routes.
- `product/systems/discovery.md` → Community-scoped → Group-scoped throughout.
- Cross-reference cleanup: `MAP.md`, `use-cases.md`, `F018-brian-declares-run-club.md`, `agent-assistance-handoff-2026-05-09.md`, `reciprocity-and-goodwill.md`, `agent-assistance.md`, `item-view.md`, `gathering-host.md` — all live broken pointers fixed.
- `planning/scenarios/F001–F017` (17 pre-primitives scenarios) → archived to `_attic/2026-05-19/planning-scenarios-backlog/` with `PRE-PRIMITIVES-AUDIT-2026-05-11.md` documenting the mapping. Live `planning/scenarios/` contains only F018.

**Exit criterion met:** a new contributor reading the project from `CLAUDE.md` can reach all canonical docs without encountering a "vendor", "Community", "Member Operations", or "cooperative" reference outside `archive/` folders.

**Still optional (not blockers):**
- Update `web/CLAUDE.md` route conventions for the new surfaces (only when Phase 2 surface tickets land).
- Final pass on `b1-primitives.md` to clean any phrasing that referenced the old 7-phase structure (cosmetic).
- Write ADR-13 (Group consolidation) and ADR-14 (Location spine+child) formal entries if the spec banners aren't enough. Per the DECISIONS.md format, banners may be sufficient permanently.

**Tickets:** 0 (doc-only work; no code changes).

**Effort:** ~1 week. **Risk:** low.

**Exit criterion:** a new contributor reading the project from `CLAUDE.md` can reach all canonical docs without encountering a "vendor", "Community", "Member Operations", or "cooperative" reference outside `archive/` folders.

---

## Sequencing and timeline (rough)

| Phase | Tickets | Effort | Risk |
|---|---|---|---|
| 0 — AI-native floor | 4-5 | 1 week | Low |
| 1 — Schema floor | 10-15 | 2-3 weeks | Low |
| 2 — Cluster 1 surfaces | 10-15 | 3-4 weeks | Medium |
| 3 — Index + Wonder + thesis + Groups | 8-10 | 3-4 weeks | Medium |
| 4 — Doc cleanup | ~5 | 1 week | Low |

**Total: roughly 10-13 weeks.** Phases 2 and 3 can overlap partially (the locality index can start while Phase 2's Item / Member / Location / Group pages stabilize). Phase 4 can begin in parallel with Phase 3 for the doc-only edits that don't depend on shipped routes.

## Risks and how we hold them

**Scope creep from new loops appearing tractable.** The temptation will be to ship Offer / Ask / Initiative once `items.kind` is an enum that already supports them. Resist. b1 ships product / service / gathering / wonder. The reserved kinds for offer / ask / initiative ship at b2.

**The 90-second composer.** Hitting <90 seconds for a new Item with kind picker + Location attachment + metadata + photo + (optional) Group filing is a real design challenge. Treat it as a first-class scenario. F018 (Run Club) is the canonical example and currently sits deferred in `planning/scenarios-backlog/` per the 2026-05-18 PM call — needs rewrite against the post-2026-05-11 naming pass before promotion. F019–F024 were scrapped 2026-05-11 (PRE-PRIMITIVES-AUDIT). Phase 2 scenarios get authored fresh under the current primitives at Phase 2 open.

**The "vendor" mental model in our heads.** Every PR during the rebuild must say "Member" / "Item" / "Location" / "Group" rather than "vendor" / "business" / "market" / "Community". The mental shift is the substance of the work; if we keep saying "vendor" we will end up rebuilding a vendor system on Member-shaped tables.

**Wonder is new behavior.** Nobody has shipped a "Wonder" surface in this exact shape. The activation-energy hypothesis (people will declare an idea publicly without commitment) is untested. Treat F022 / Wonder evals as load-bearing.

**RLS on the no-login `/explore`.** Anon-readable surfaces need RLS care. The matrix test (anon vs auth-self vs auth-other) catches most of it; explicit eval coverage on the Loop 3 newcomer path is the safety net.

## Observability commitments (cleaner than the prior plan since no dual-write/divergence)

Operational health signals — Supabase logs + a single ops view at b1; no admin UI:

- **Action handler latency** — p50, p95, p99 per handler name. Tags drawn from the handler lists in `member.md`, `item.md`, `location.md`, `groups.md`.
- **Materialized view staleness** — `extract(epoch from now() - last_refresh_at)` on `discoverable_items`. SLA alert at > 60s. The b1 → T2 sync→async transition trigger is p99 > 30s for one week.
- **RLS test matrix coverage** — anon vs auth-self vs auth-other for every public-readable table. CI gate: matrix passes for every table touched by the PR.
- **Action-handler conformance** — CI assertion that no write to a `*_events`, `members`, `items`, `locations`, `groups`, or related table occurs outside the action layer. Per ADR-7.
- **Trace IDs** — every action handler injects a trace ID into the event-log entry's `payload` JSONB. Web-request → DB-event-log correlation is the b1 baseline; T2 adds OpenTelemetry export.
- **Embedding-job failure alerts** — once T3's embedding pipeline ships, failed embedding jobs alert. Reserved at b1 (no embeddings written yet).

## Eval coverage per phase (per AGENTS.md M1–M4 gates)

Every phase exit requires the named eval set to pass. Playwright + RLS-matrix evals; not unit tests.

- **Phase 0 exit:** action layer skeleton has 1 working handler with full test coverage; system Member exists and login is blocked; pgvector + postgis enabled; auth signup hook creates Member rows and fires `member.created` event with audit fields populated.
- **Phase 1 exit:** schema-shape evals for every new table (column existence, RLS shape, index existence); audit-field invariant evals (every event row carries `acting_member_id`); the `discoverable_items` refresh meets the 60s SLA under synthetic 10× write load; action-handler conformance check passes; same-transaction event-row commit verified by deliberate failure injection (when the event write fails, the row write rolls back).
- **Phase 2 exit:** the fresh Phase 2 scenarios (authored at Phase 2 open under the current primitives; covers product / service / gathering / wonder composer flows + Member page + Location page) pass evals end-to-end; surface-specific composers are reachable from their named entry points (no `/new` picker exists); the "Sell" CTA creates a kind='business' Group; Item-level QR card affordance generates a PNG. F018 is the rewrite candidate for the gathering composer surface — promoted only when the b1 implementation plan recommends pulling it in.
- **Phase 3 exit:** anonymous Loop 3 evals (no-login browseable index works); Wonder→Gathering conversion stub eval; thesis page link present from every page footer; `/g` browse + `/g/new` create flow; Concerts-in-the-Park surface delivers a Location-follow feed.
- **Phase 4 exit:** docs match code (manual audit + grep sweeps); no "vendor" / "Community" / "Member Operations" / "cooperative" references outside `archive/` folders.

## What we explicitly do NOT do during the rebuild

- Ship Offer, Ask, or Initiative.
- Ship vector / semantic search.
- Ship the AI chat surface.
- Ship Group posting feeds, stewardship rotation, capital-flow tooling, or any Loop 11/12 surface beyond schema reservation.
- Auto-create or auto-assign any Group based on geography, follows, attendance, or any other signal.
- Ship payments / commerce rails.
- Ship reviews or ratings (permanently deferred per `service-provider.md` — community-anchored endorsements at T2 instead).
- Re-do the design system.
- Cooperative-style coordination (deferred indefinitely per Groups ratification).
- Location-scoped messaging or feeds (anti-Nextdoor commitment per `policy.md`).

Each of those is real, downstream, and not the work of the floor.

## What this plan commits to

Three structural truths:

1. **The platform's grammar is "Person declares Item at Location; other Persons respond. People form Groups when they decide they are a group."** Every PR during the rebuild produces code that reads more like that grammar than the previous PR did.

2. **Business serves people, not the other way around.** No Business entity in the schema. No `business_name` column on Members. No "Brand" abstraction beyond `brand_label` on Items / `group_businesses.display_name` on kind='business' Groups. Every reviewer holds the line.

3. **Groups are emergent, optional, never auto-assigned.** The platform never enrolls a Member in a Group based on geography, follows, or attendance. Soft affiliations exist as query-time inference for surface suggestion only; they are never written as full memberships without explicit consent. A Group is what people *become* when they decide they are a group — never what the platform decides they already are.

If at any phase a proposed change requires any of these to bend, escalate to the PM, not to the data model.

## Approval

PM signed off on this plan 2026-05-10 (rebuild reframe; supersedes the prior 7-phase migration plan that assumed a live system with data to preserve). Plan can be revised between phases; phase exit criteria do not move without an explicit JOURNAL entry.

---

**Current state (2026-05-19):**

- **Phase 0 — DONE 2026-05-10.** Substrate runtime-verified end-to-end.
- **Phase 1 — DONE 2026-05-19.** All schema, RLS, evals shipped: Members + Locations + Groups + Items + discoverable_items. Eval state: **142/142 Phase 1 green**; action-layer conformance 0 violations across 125 files / 32 protected tables. Tickets T041–T057 complete. Migration sequence (dependency-driven, deviated from plan): 007 locations → 008 locations RLS → 009 members_phase1 → 010 member interests/follows → 011 affinities → 012 agent assistance → 013 delegations CHECK → 014 groups → 015 items → 016 discoverable_items. Two going-forward rules added to DEVIATIONS at T055/T057 close: (1) SECURITY DEFINER pattern for cross-table RLS recursion; (2) `eval_indexes_for_table` returns `pg_indexes` column names (`indexname`, `indexdef`). Action handlers for Locations / Groups / Items intentionally NOT shipped in Phase 1 — they land with the Phase 2 surface composers that need them.
- **Phase 2 — NEXT.** Fresh F-numbered scenarios authored at Phase 2 open via `pipeline-product` → `pipeline-plan` against the now-closed Phase 1 substrate. F018 (Run Club gathering composer) is the rewrite candidate when the b1 implementation plan recommends pulling it in; rewrite punch list preserved in [`../planning/history/F018-review.md`](../planning/history/F018-review.md).
- **Phase 3 — NOT STARTED.**
- **Phase 4 — DONE 2026-05-11.** Doc cleanup complete.

**Stale ticket pointers retired:** T028–T040 (pre-rebuild) are STALE-banned in `development/tickets/`; they predate both the Groups ratification and this rebuild reframe. F001–F024 (pre-primitives scenarios) are archived per `PRE-PRIMITIVES-AUDIT-2026-05-11.md`.
