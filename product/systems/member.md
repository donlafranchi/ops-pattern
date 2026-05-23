---
purpose: Anchor primitive — one row per real human.
layer: what
status: active
---

# System: Member

**Purpose:** Establish Member as the platform's anchor primitive — the record of one real human who declares Items, attaches them to Locations, optionally joins Communities, and accumulates standing presence over time. Every other primitive (Item, Location, Community) and every loop reads from or writes to a Member. This spec defines what a Member is, what is true about a Member at b1 vs. b2 vs. b3, and what data-model commitments must land at b1 so the agent-assistance stack (Operations / Assistant Context / Skills / Delegation), the policy framework, and the federation layer can layer on without retrofit.

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

**North stars served:** All five loop families. Members are present on at least one side of every loop. Specific surfaces (Maker affordances, host affordances, steward affordances) appear conditionally based on what the Member is *doing* — the role-as-verb posture from `primitives.md`.

**Decisions encoded:** ADR-4 (locality default = geolocate then city pick, mutable) · ADR-6 (Member-owned context, standing-derived persistence) · ADR-7 (action layer for all writes) · ADR-9 (opt-out default, three-filter test for every privacy/revenue/data-sharing surface) · ADR-12 **SUPERSEDED 2026-05-12** per `agent-commerce-and-project-amendments.md` §6 (the Maker-mode framing is retired; `members.maker_mode_enabled` column is dropped; selling tools surface from Group / Item state) · ADR-15 (auth.users coupling — `members.id = auth.users.id`, post-signup trigger is the only Member-create path) · ADR-16 (per-row privacy on `member_location_affinities`; algorithms via privileged paths) · ADR-17 (`bounded_purchase` Delegation scope, ratified 2026-05-12 — the Delegation-scopes Policy posture references it). **ADR-8 is fully superseded** by the Groups ratification (`member_operations` retires; standing-tier gate is now defined in `groups.md`: ≥1 active membership in kind='business' Group OR steward-role membership in any non-business Group). **ADR-3 remains rejected** — the implicit-from-behavior `maker_signal` pattern does not apply.

**Companion specs:** [`primitives.md`](../foundation/primitives.md) · [`principles.md`](../foundation/principles.md) · [`policy.md`](../foundation/policy.md) · [`groups.md`](groups.md) (the unified Group spine — supersedes the prior `community.md` / `member-operations.md` / `cooperative.md` split per the 2026-05-10 ratification) · [`item.md`](item.md) · [`location.md`](location.md) · `agent-assistance.md` / `agent-assistance.md` / `agent-assistance.md` (forward-looking, schema reserved at b1)

**Canonical examples this spec serves:** Maya at Oak Park Sourdough · Ferrari Fisheries · Cafe Capricho's successor · Brian declaring the Run Club at Drake's · Aaron posting a fish-drop Wonder · Maya finding something to do tonight · the West Sac school-parents Community founder. Per [`use-cases.md`](../needs/use-cases.md).

---

## What a Member is and why it matters

A Member is the platform's record of one real human. One row, one human, lifetime-stable identifier. Every Item is created by a Member. Every Item response is performed by a Member. Every Community is founded, joined, stewarded, and dissolved by Members. Every Operation is held by a Member. Every Delegation is granted by a Member. Every event log row is attributed to a Member.

A Member is **not** a role. Per `primitives.md`, the platform models verbs, not identities. A Member who posts product Items is acting as a Seller (Producer in agricultural / food context); the same Member organizing a recurring gathering is acting as a host; the same Member founding a cooperative bakery Community is acting as a steward. None of those activities are stored as a `role` column on `members`. They surface as conditional affordances on the Member's profile when the underlying activity exists, and they retract when it doesn't. The legacy `vendor-*` system files are wrong about this and are being re-anchored on this primitive in Phase 6 of the migration.

A Member is **not** a business. Per `principles.md`, there is no Business entity in the schema, ever. A Member who runs a personal business does so through a kind='business' Group (per `groups.md`) — a Group of one (sole proprietor), of two-plus owners (partnership), or of owners + staff (operating team). The Group carries the brand label (`group_businesses.display_name`), the optional `legal_entity_kind` (LLC, sole_prop, partnership, etc.), and the membership rows. A cooperative-shape operation is a kind='business' Group with multiple owner-role memberships, not a separate primitive — cooperative-style coordination (co-owning, voting, distributing) is deferred until real-world need + explicit user prioritization per `groups.md` and `agent-commerce-and-project-amendments.md` §2. The absence of a Business row is what keeps the platform structurally honest about who is doing the work; the Group primitive is what records the *people organizing to do it together*.

A Member is **not** a Location. Members are humans; Locations are places. A Member's relationship to Locations beyond home is recorded as multi-Location affinities in `member_location_affinities` (live, work, play, visit, follow, liked) per the Multi-Location belonging section below. The `home_location_id` column is the locality default (per ADR-4); the affinity table holds the rest. Members do not have stored addresses.

The Member primitive is the structural anchor of every loop. If a feature requires a record of an actor, that record is a Member. If it requires a record of a business, the platform does not provide one — the Member declares an Operation and the work shows up as Items with that Operation's label. If it requires a record of a group, the platform provides Community, and Communities are sets of Members. The schema cascades from Member outward; nothing precedes it.

---

## T1 — MVP Tier (b1)

The b1 surface is the smallest version of Member that lets the central hypothesis test itself: that ordinary people will step forward where they live, and their neighbors will show up for them. Anything not required to make that test work defers.

### Identity

- **One Member per real human.** Enforced by email uniqueness in `auth.users` (Supabase Auth); the platform makes no claim of strong identity verification at b1, but the email-uniqueness floor prevents trivial duplication.
- **Display name** (required, text, 1–60 chars). Real name is **encouraged but not required** — onboarding copy nudges with "people show up for people; using your real name helps." Pseudonymity is allowed; the platform does not block it. (See open question on real-name escalation for repeat-offender accounts.)
  **Intent:** Real names raise trust (Loop 1 traction is faster among neighbors who recognize names) but *requiring* them blocks populations the platform should serve — domestic-violence survivors, people in transition, professionals with reasons to separate identities, anyone whose physical safety depends on not being findable by name. Encourage > require keeps both populations onboardable: the trust signal is available to Members who can offer it, and the platform doesn't gatekeep on a credential it can't verify or protect anyway.
- **Handle** (required, text, 4–30 chars, lowercased alnum + hyphen, uniqueness enforced, profanity-filtered). User-chosen at signup; immutable at b1 (changes deferred to b2 with a redirect record). Powers the canonical Member URL `/m/[handle]`. Per ADR-20, `/m/[handle]` is intentionally **global — not place-scoped** (unlike Group, Location, and Group-filed Item URLs): the handle is the auth identity and must survive a Member relocating between neighborhoods, cities, or states. Items a Member owns that are *not* filed under a Group take the Member-anchored URL form `/m/[handle]/[kind]/[slug]`; Items filed under a Group nest under that Group's place path instead.
- **Bio** (optional, text up to 500 chars). Written in natural language for human + future embedding readability (per the AI/LLM section).
- **Avatar** (optional). Single image, square crop enforced, 512×512 stored, smaller variants generated on read.
- **Pronouns** (optional, free text, 30 chars). Surfaced on the profile when set.

### Auth (per ADR-15)

- **Magic link** (email) via Supabase Auth. Default and lowest friction.
- **Google OAuth** via Supabase Auth.
- **Apple OAuth** via Supabase Auth (required for the eventual iOS app, useful on web).
- All three populate the same `members` row keyed off `auth.users.id`. Linking additional providers to an existing Member is deferred to b2.
- **`public.members.id = auth.users.id`** (PK equality, 1:1, lifetime-stable). The post-signup trigger on `auth.users` is the only path to a `members` row — see ADR-15 for the trigger → Next.js route → `member.create` flow, the `login_disabled` system-Member exception, and the failure-mode treatment (hook unreachable / signature invalid / handler error). RLS policies across the schema reference `auth.uid()` directly; no `select id from members where auth_user_id = auth.uid()` subquery pattern exists.

### Locality (per ADR-4)

- `home_location_id` (nullable FK to `locations` — schema per forthcoming `location.md`; see `b1-primitives.md` Suggested build sequence step 2) — the Member's chosen locality scope. Set during onboarding via geolocation (preferred) or city pick from a list (Sacramento metro + surrounding cities at launch). Mutable from any locality-dependent surface; the affordance is visible on Home and Explore per ADR-2 and ADR-4.
- The home Location is a *scope*, not an address. A Member who lives in Bryte but works in Folsom can set Folsom as home and reset to Bryte later — the platform does not police it. Privacy: never shared with other Members, never visible on the Member's public profile.

### Privacy controls (b1 surface, opt-out default per ADR-9)

The b1 privacy controls cover what is publicly visible on `/m/[handle]`. The protective default applies to every field; Members opt in to richer visibility per the policy framework's three-filter test. The policy posture for each opt-in is in the **Policy posture** section below.

- **Profile visibility** — `public` (default, visible to anyone with the URL, indexable) / `unlisted` (no index, link-only) / `members_only` (must be signed in to view). Three-tier matches Community's discoverability enum for consistency.
- **Show items on profile** — boolean, default `true`. When false, the Member's Item count and Item list do not render on the public profile (the Items themselves remain at their own URLs and discoverability).
- **Show following / followers** — boolean, default `false`. Counts and lists hidden by default; opt in to show.
- **Allow direct messages** — boolean, default `true`. (DM surface ships at b2 per the user's b1 scope decision; the toggle exists at b1 so the substrate is honest.)
- **Locality precision** — `city` (default — only the city of the home Location is visible) / `neighborhood` (more specific) / `none` (locality not shown publicly).
- **Show Group memberships** — boolean per membership (default `true` for explicit memberships; falsifying hides that Group affiliation from the public profile but does not affect the membership row or Items filed under the Group). Per `groups.md`.

Every setting is granular, visible, revocable. Changes are written to `member_privacy` (single row per Member, columns per setting) and append a `member.privacy_changed` event with the diff.

### Selling tools (per ADR-12, superseded by `agent-commerce-and-project-amendments.md` §6, 2026-05-12)

There is no "Maker mode" to be in. There is a set of **selling tools** for offering goods or services, and those tools are present whenever a Member needs them. **The redundant `members.maker_mode_enabled` boolean is dropped.** The structural signal that a Member is selling is `groups.kind='business'` membership and / or the existence of `items.kind='product'` or `'service'` rows for that Member — exactly as `groups.md` already models it. No state to toggle. No "Become a Maker" CTA.

- New Members onboard with the universal composer (gathering, wonder, ask, offer, etc.). The product and service composers are surfaced as kind-specific verbs in the naming-conventions table (per `CLAUDE.md`): **Sell · Share** for products, **Offer** for services. A Member who taps "Sell" for the first time enters the kind='business' Group walkthrough — creates a Group with themselves as sole owner-role membership, then the product composer opens.
- A Member who has ≥1 active kind='business' Group membership has the full selling toolset surfaced ambiently: composer entries for product / service, the seller dashboard, the Item-management views, agent-assistance affordances. No toggle to enable; no toggle to disable.
- To stop selling: end the owner-role membership in the business Group (per `groups.md` lifecycle — founder leaving puts the Group into 90-day dormancy, recoverable). Items remain published per their own settings; the Member can rejoin or create a new Group later. There is no separate "pause Maker mode" surface — the tools follow the Group membership.
- The auto-flip prohibition of the previous ADR-12 dissolves with the mode itself. Since there is no state to flip, there is nothing to forbid auto-flipping.
- Profile-visibility of selling: the existing `members.show_group_memberships` per-membership privacy toggle (above) hides a business-Group affiliation from the public profile without affecting the Group itself. A Member who wants a private selling presence sets the Group's `discoverability='unlisted'` or `'private'` per `groups.md`.

**Vocabulary.** Per `agent-commerce-and-project-amendments.md` §6b (ratified 2026-05-12): **Seller** is the generic term for a Member offering goods or services. **Producer** is preferred in the agricultural and food context (already used in [`producer-tools.md`](producer-tools.md) and [`producer-tools.md`](producer-tools.md)). "Maker" survives only as a UI label where the Member specifically self-identifies as such (craftspeople, artisans).

### Standing-tier gate (per `groups.md`) — the data-tier gate

A Member has standing presence — the view `member_has_standing_presence` returns `true` — when **either** of the following holds:

- ≥1 active membership in a kind='business' Group (any role: `owner` or `member`/staff), **OR**
- ≥1 active `steward`-role membership in any non-business Group (place / interest / practice / event_anchored / family).

Standing-tier is purely a data state — driven by Group membership rows, not by any Member-level toggle. There is no separate selling-tools mode to pause or activate.

This is the gate for:

- The Assistant Context full-tier surface (vs. scratch-tier; per `agent-assistance.md`)
- The Skills subscription surface (per `agent-assistance.md`)
- The agent-assistance affordances at b2

A Member without any qualifying Group membership is fully welcome and fully functional. They can browse, attend gatherings, RSVP, follow, save, and post Wonders. Joining or creating a Group is what shifts them into the standing tier; the act is **declared, dated, and ungameable** (per the Group event log). The kind='business' Group walkthrough is gated on the explicit **Sell** verb in the composer (per `groups.md` and the CLAUDE.md naming conventions) — Members never reach business-Group creation by accident.

**Note on ADR-8 supersession.** The prior `member-operations.md` model defined `member_has_standing_presence` as `≥1 active member_operations row`. That table retires per the Groups ratification; the view is redefined above. The migration plan rewrite handles the data movement (any existing operations rows backfill into Group memberships).

### Item authorship and collaboration

- A Member is the `member_id` on every Item they create (per `item.md`).
- A Member appears in `item_collaborators` (T2 schema, reserved at b1) when collaborating on another Member's Item. Useful for cooperative bakeries where multiple Members are credited — the schema is reserved so no retrofit is needed.
- The Member's profile renders an "Items by this Member" section conditionally — present when Items exist, absent when none do (per ADR-3's spirit). Sub-sections appear per Item kind: Products, Services, Gatherings, Wonders.

### Group membership

- A Member holds zero or many Group memberships via `group_memberships` (per `groups.md`). All explicit, none auto-assigned (per `principles.md` and `groups.md`).
- `members.primary_group_id` (nullable FK to `groups.id`) — set explicitly by the Member at onboarding *if* they choose one (most don't). Used as the default `group_id` for Wonders, Offers, Asks (b2) the Member posts. (Replaces the prior `members.primary_community_id` per the 2026-05-10 Groups ratification.)
- `group_memberships.source = 'soft_via_follow'` and `'soft_via_attendance'` rows exist for the platform's internal index suggestion only — they are invisible to other Members and do not count toward addressability or pooling (per `groups.md`).
- A Member can hold any role across multiple Groups simultaneously per `groups.md` (e.g., owner of one business Group, member of another business Group as staff, steward of an interest Group, member of a family Group).

### Following (Loop 8 — partial at b1)

- A Member can follow another Member. Storage at b1; the follow stream surface is b2.
- `member_follows` table: `follower_member_id`, `followed_member_id`, `created_at`, `unfollowed_at` (soft, nullable). Composite PK.
- Follow events: `member.followed`, `member.unfollowed`. The b2 follow stream and the eventual notification surfaces read from these.

### Multi-Location belonging (substrate at b1; surface at b2)

A Member belongs to multiple Locations — they live somewhere, work somewhere, play somewhere, visit places, follow places, and like places. The platform records all of these as **affinities**, distinct from Group memberships and distinct from `home_location_id`.

- `member_location_affinities` table: `member_id`, `location_id`, `affinity_kind` (enum: `lives`, `works`, `plays`, `visits`, `follows`, `liked`), `created_at`, `removed_at` (soft, nullable). Composite PK on `(member_id, location_id, affinity_kind)` — a Member can hold multiple kinds of affinity for the same Location (a Member who both `lives` and `plays` at the same neighborhood Location).
- `members.home_location_id` (unchanged) stays as the single locality default per ADR-4. The affinity table is additive — `home_location_id` is NOT replaced; it remains the Member's "near me" default scope. Many Members will also have an affinity row of kind=`lives` pointing at the same Location, but the two surfaces serve different purposes.
- **Affinity does not grant addressability.** Per the no-Location-messaging commitment in `policy.md` and `location.md`, no DM, feed, or wall is scoped to a Location. A Member with `lives` affinity to West Sacramento cannot be addressed because of that affinity. Affinities surface in: the Member's "Locations I belong to" list (private profile by default), the Location's reverse query (the Location page may show "N Members live here" without naming them — privacy-respecting), and the locality-promotion derivation in `groups.md` (a Group's local-owner test reads any of `lives` / `works`).
- **Follows drive notifications.** The `affinity_kind='follows'` row is the b2 surface that delivers the "Concerts in the Park" feed: when an Item attaches to a followed Location, the follower's feed surfaces it. Wire-up is the same as Member follow fan-out — `item.location_attached` event triggers a per-follower fan-out to the followers of the affected Location.
- Affinity events: `member.location_affinity_added`, `member.location_affinity_removed`. Reserved at b1; the Location-follow surface ships at b2.

### Taste profile (extends `member_interests` — substrate at b1, richer surface at b2)

`member_interests` (the controlled-vocabulary tag list per Member, b1) carries the Member's stated affinities for kinds of things — `live-music`, `outdoor`, `summer-evenings`, `vegan-food`, `pre-1900-plumbing`. Combined with `member_location_affinities` of kind=`follows`, this powers compositional queries the Member can run against the locality-first index — *"places near me where outdoor live-music gathering Items happen in summer."* The b1 substrate ships the tags + the follow rows; b2 surfaces the compositional query as a saved-search affordance ("create a feed for outdoor live music in Sacramento MSA"). T3 layers vector embeddings over Member interests + Location descriptions for natural-language equivalents ("find places near me with summer concerts in the park").

### Direct messaging (substrate only at b1; surface at b2)

Per the b1 scope decision: the messages schema lands at b1 so b2 can ship the surface without retrofit, but no UI exists at b1. Tables: `member_threads`, `member_thread_participants`, `member_messages`. Constrained at b1: only Members in the same Community can be in the same thread (RLS-enforced); the b2 surface relaxes this with explicit allow-DM toggles. The constraint at b1 lets the schema land with no moderation surface area exposed to a solo team.

### Account lifecycle

- **Soft delete only.** Setting `deleted_at` retracts the Member from public surfaces, hides their Items (which retain `member_id` for attribution), and removes them from active Community memberships. Hard delete never ships at any tier (per b1-primitives.md).
- **Data export** (per ADR-6 b1 commitment) — `/you/data` surface offers a JSON export of the Member's records (profile, Operations, Items, follows, memberships, Assistant Context). One-tap purge action also lives there.
- **Assistant Context substrate** (per ADR-6) — `member_self_records` table reserved at b1 (one row per Member, JSONB document, append-only). No surface ships at b1; the schema exists so b2 can land the three update pathways without retrofit.
- **Delegation substrate** (per ADR-6) — `member_delegations` table + scope enum reserved at b1. No surface ships at b1; the schema exists so the b2/b3 agent-assistance surfaces and the eventual MCP server land cleanly.

---

## T2 — Core Tier

- **DM surface ships.** Compose, thread list, in-thread view, notifications. Same-Community constraint relaxes; Members can opt in to receive DMs from any Member with an explicit "allow DMs from outside my Communities" toggle.
- **Member Group surfaces** — full Group profile pages (e.g., `/g/oak-park-sourdough`), Group-level analytics for the owner / steward Members, multi-Group switcher in `/you` for Members in multiple business Groups. Per `groups.md`.
- **Assistant Context surfaces** ship the three update pathways (explicit teach, confirmation-derived, inferred-and-proposed). Per `agent-assistance.md`.
- **Skills subscription** — Members with standing presence (per ADR-8) can subscribe to platform-curated and community-authored Skills. Per `agent-assistance.md`.
- **Follow stream** — the b1 follow event log gets a surface. Per Loop 8.
- **Endorsements (service Items)** — Members endorse other Members' Service Items. Community-anchored, no star ratings (per `service-provider.md` and `principles.md`).
- **Member ↔ Member messaging filters** — block, mute, report. Lightweight moderation surfaces.
- **Multi-locality awareness** — `home_location_id` becomes plural via a new `member_localities` table (introduced at T2 — *not* reserved at b1; the single `home_location_id` column on `members` covers b1) with a primary marker. Useful for travel and split households.
- **Handle changes** — Members can change handle once per quarter; old handle becomes a redirect for 90 days. Reserve `member_handle_history` table at b1 for this.
- **Avatar variants** — additional crops, video avatars (short loop, no audio), seasonal swap. Schema-light.

---

## T3 — Polish Tier

- **Stakeholder dashboard** — the producer-facing analytics surface (views, follows, saves, response counts, engagement over time) reads from the b1 event log entries. Per b1-primitives.md, the dashboard ships at b3; the events are required at b1.
- **Stakeholder visibility** (`stakeholder_visibility` enum, reserved at b1) — `private` (default) / `community_only` / `public`. Controls which surfaces show this Member's accumulated standing patterns to other Members. The default is private; Members opt in.
- **Member federation** — under Loop 13, a Member's identity, Assistant Context, and (where flagged) Delegations follow them to spawned platforms. Federation handoff per `member-journey.md` Loop 13 and `agent-assistance.md` T3 surface.
- **Vector embeddings on Member bio** — enables natural-language search like *"who in Folsom does pre-1900 plumbing"* to surface Members directly, not just their Items.
- **Member chat surface** — the platform's AI chat surface (per `item.md` T3) returns Members as first-class results when relevant.
- **Member Group transitions** — Members shift between Groups (leaving one business Group to start another, joining a partnership, becoming a steward of an interest Group) via the standard `group.member_join` / `group.member_leave` handlers per `groups.md`. No special "capacity transition" surface needed — the Group lifecycle handlers cover the cases the prior `member-operations.md` model needed dedicated transitions for. T3 may add a multi-Member consent flow when a Group's structural responsibilities (e.g., founder transferring co-ownership) are at stake.
- **Assistant Context federation portability** — exports follow the Member to spawned platforms with explicit per-spawn re-confirmation.
- **Skill-author Member surfaces** — Members who author Skills (per `agent-assistance.md`) get an authoring surface, version history, install metrics.

---

## Data model implications

**Required at MVP — retrofit is the failure mode.**

The Member primitive is referenced by every other primitive in the schema. Reserving columns and tables now is cheap; backfilling them when half the platform points at them is not. The b1 schema commits to the full Member surface even where the surface is b2 or b3 — the tables exist, the columns exist, the event log fires, and the b2/b3 surfaces become composition rather than excavation.

### `members` (one row per real human)

```sql
create table members (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null
    check (char_length(handle) between 4 and 30 and handle ~ '^[a-z0-9-]+$'),
  display_name text not null check (char_length(display_name) between 1 and 60),
  bio text,
  avatar_url text,
  pronouns text check (char_length(pronouns) <= 30),
  home_location_id uuid references locations(id) on delete set null,
  primary_group_id uuid references groups(id) on delete set null,
  stakeholder_visibility text not null default 'private'
    check (stakeholder_visibility in ('private','community_only','public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_members_handle on members (handle) where deleted_at is null;
create index idx_members_home_location on members (home_location_id) where deleted_at is null;
create index idx_members_primary_group on members (primary_group_id) where deleted_at is null;
```

Notes on choices:
- `id` is `auth.users.id` (Supabase Auth). One Member per auth user; the cascade keeps deletion clean.
- `handle` is enforced lowercased alnum + hyphen at the column check; profanity filtering happens in the action handler (per ADR-7), not in the constraint.
- `stakeholder_visibility` is reserved at b1 for the b3 dashboard. Default `private` — opt-out default per ADR-9.
- **No `maker_mode_enabled` column.** Per `agent-commerce-and-project-amendments.md` §6 (ratified 2026-05-12), the "mode" framing is dropped. Selling-tool surfaces are driven by Group membership (≥1 active kind='business' Group) and / or Item kind (`product` / `service` rows), not by a Member-level boolean. ADR-12 is superseded by the amendment; see Decisions encoded section.
- No `role` column. Roles are verbs surfaced from Item + Group activity, not stored.
- No `business_id`. There is no Business entity (per `principles.md`).

### `member_privacy` (one row per Member, opt-out defaults per ADR-9)

```sql
create table member_privacy (
  member_id uuid primary key references members(id) on delete cascade,
  profile_visibility text not null default 'public'
    check (profile_visibility in ('public','unlisted','members_only')),
  show_items_on_profile boolean not null default true,
  show_following boolean not null default false,
  show_followers boolean not null default false,
  allow_direct_messages boolean not null default true,
  locality_precision text not null default 'city'
    check (locality_precision in ('city','neighborhood','none')),
  updated_at timestamptz not null default now()
);
```

A trigger on `members` insert creates the matching `member_privacy` row with defaults. Changes append `member.privacy_changed` events with a JSON diff so the audit log is complete.

**Scope shift — follow visibility is public-by-default at b1** (2026-05-11 product decision, surfaced at T048 M2 review; flagged here for `pipeline-product` to memorialize when convenient). The `show_following` and `show_followers` columns ship at b1 as reserved substrate, but the **schema does not enforce them**: `member_follows.member_follows_public_read` is `using (true)`. Rationale: the threat model behind ADR-9's opt-out posture is *cross-community discovery by bad actors*, not intra-community visibility. Follow graph is social fabric — same-community Members already know who hangs out with whom. The privacy investment ADR-9 targets earns its keep on `member_location_affinities` (T049): the `lives` and `works` affinity rows are owner-only at the row level, with cross-Member computation only via the three SECURITY DEFINER functions named below (see "Structural enforcement"). If real-Member feedback at b2 surfaces follow-graph opt-out as a need, the action layer can wire the existing toggles in — action-layer-applied gating, not RLS-applied. If the b2 surface never asks for them, these two columns become candidates for deletion at the next privacy-spec consolidation.

### `member_interests` (one row per interest tag a Member declares)

```sql
create table member_interests (
  member_id uuid not null references members(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  primary key (member_id, tag)
);
```

Free-form text drawn from a controlled vocabulary (mirrors `item_tags`). Used for Community suggestion at onboarding ("here are nearby groups that match what you're into") and as an embedding-context input at T3.

### `member_follows` (Loop 8 substrate — surface at b2)

```sql
create table member_follows (
  follower_member_id uuid not null references members(id) on delete cascade,
  followed_member_id uuid not null references members(id) on delete cascade,
  created_at timestamptz not null default now(),
  unfollowed_at timestamptz,
  primary key (follower_member_id, followed_member_id),
  check (follower_member_id <> followed_member_id)
);

create index idx_follows_followed_active on member_follows (followed_member_id)
  where unfollowed_at is null;
create index idx_follows_follower_active on member_follows (follower_member_id)
  where unfollowed_at is null;
```

### `member_location_affinities` (multi-Location belonging — substrate at b1, surface at b2)

```sql
create table member_location_affinities (
  member_id uuid not null references members(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  affinity_kind text not null
    check (affinity_kind in ('lives','works','plays','visits','follows','liked')),
  created_at timestamptz not null default now(),
  removed_at timestamptz,
  primary key (member_id, location_id, affinity_kind)
);

create index idx_affinity_member_active on member_location_affinities (member_id, affinity_kind)
  where removed_at is null;
create index idx_affinity_location_followers on member_location_affinities (location_id)
  where affinity_kind = 'follows' and removed_at is null;
create index idx_affinity_location_locals on member_location_affinities (location_id, affinity_kind)
  where affinity_kind in ('lives','works') and removed_at is null;
```

The composite PK allows a Member to hold multiple kinds of affinity for the same Location (a Member who both `lives` and `plays` at a neighborhood Location). The `idx_affinity_location_followers` index serves the b2 follow-Location feed (per `location.md` Member-following-Location section), accessed through the `public.count_followers_for_location()` aggregate function. The `idx_affinity_location_locals` index serves the locally-owned-and-operated derivation in `groups.md` (any of `lives` / `works` is sufficient for a Member to count as a local owner), accessed exclusively through the `public.member_is_local_to_location()` SECURITY DEFINER function — direct `SELECT` against another Member's affinity rows is blocked at the RLS layer per ADR-16.

`affinity_kind` semantics:
- `lives` — Member-declared residential affinity. Default candidate for `home_location_id` but not auto-set; the Member sets `home_location_id` separately.
- `works` — Member-declared work affinity. Useful for the Folsom-business-with-West-Sac-resident-owner case in the locality-promotion derivation.
- `plays` — Member-declared recreational affinity. Surfaces in the Member's "places I go" private profile section at b2.
- `visits` — Member-declared lighter affinity. Travel, occasional places.
- `follows` — Standing relationship that drives notifications. The Concerts-in-the-Park surface reads from this kind.
- `liked` — Save / bookmark. Surfaces in the Member's "Locations I like" list without driving notifications.

**No addressability.** Per the no-Location-messaging commitment, no surface in the platform sends messages, posts, or any kind of content to "Members affiliated with Location X." Affinities are read by feeds the Member opted into (their own follow feed, their own profile) and by query-time aggregations on the Location side (the Location page may display "N Members like / follow / live near here" without naming them — via the `public.count_likes_for_location()` and `public.count_followers_for_location()` SECURITY DEFINER functions per ADR-16; raw rows remain owner-only). They are never used as a *send-to* target.

**Structural enforcement (per ADR-16).** All six `affinity_kind` values are **owner-only at the row level**. Peer Members, anonymous visitors, and signed-in non-owners cannot `SELECT` another Member's affinity rows under any condition. Three privileged paths exist for cross-Member computation, all named and audited:

1. `public.count_likes_for_location(location_id uuid) returns integer` — public-callable; powers Location-page rollups.
2. `public.count_followers_for_location(location_id uuid) returns integer` — public-callable; powers Location-page rollups.
3. `public.member_is_local_to_location(member_id uuid, location_id uuid) returns boolean` — public-callable; the **only** path for the `groups.md` locally-owned-and-operated derivation. Reads `lives` and `works` rows internally; returns a boolean only.

Backend services (recommendation engine, embedding pipeline) connect with the service-role key, bypass RLS, and compute over the full row set. Outputs to users are anonymized aggregates (similarity-driven recommendations, taste-matched location lists). **Per-Member identity never surfaces in a recommendation.** No per-Member opt-out for similarity matching ships at b1 — similarity matching discloses no Member identity to any other Member; the benefit is to many and harms none.

### `member_handle_history` (T2 surface — schema reserved at b1)

```sql
create table member_handle_history (
  member_id uuid not null references members(id) on delete cascade,
  handle text not null,
  changed_at timestamptz not null default now(),
  primary key (member_id, handle)
);
```

Reserved so the b2 handle-change feature can land without retrofit. Rows are written by the action handler when a handle changes; old handles redirect to the current `/m/[handle]` for 90 days.

**Open product question — re-claimable handles?** (surfaced by the T047 M2 code review on 2026-05-11; flagged here for `pipeline-product` to decide before the b2 `member.handle.set` surface scopes.) The composite PK `(member_id, handle)` permanently retires any handle a Member has used: an insert sequence of `alice → wonderland → alice` would PK-collide on the second `alice` entry. Two product options that need a call before this table accepts its first row:

- **(a) Permanently retired.** Keeps the composite PK. Encodes "your old handle is yours forever, even after you change away from it" — useful for identity-recovery and impersonation-prevention semantics. The b2 surface copy explains "you can't reuse a handle you've previously moved away from."
- **(b) Re-claimable.** Requires widening the PK to `(member_id, handle, changed_at)` or replacing it with a serial id. Encodes "you can come back to a name you used before." More UX-permissive; weakens the redirect-for-90-days guarantee if a Member re-claims a recently-retired handle.

The decision belongs to `pipeline-product` (UX + identity-recovery trade-offs are product calls), then `pipeline-plan` ratifies, then the b2 ticket carries the schema change if needed. Because the b1 surface is placeholder-only (no surface, no write triggers — the action handler `member.handle.set` is T2), the table is empty until the b2 handler ships and PK shape can change up until that day.

### Direct messaging (substrate only at b1, surface at b2)

```sql
create table member_threads (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id),
  -- No location_id column — per policy.md, no message channel is Location-scoped.
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table member_thread_participants (
  thread_id uuid not null references member_threads(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  primary key (thread_id, member_id)
);

create table member_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references member_threads(id) on delete cascade,
  sender_member_id uuid not null references members(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
-- ON DELETE RESTRICT on sender: hard delete of a Member is never permitted
-- by the action layer (soft delete only — see Account lifecycle). RESTRICT
-- exists as a defense-in-depth safeguard against any out-of-band deletion;
-- the soft-delete model preserves message attribution for audit + thread
-- integrity. The b2 surface renders deleted-Member messages with a
-- "[deleted member]" placeholder; the row stays intact.

create index idx_messages_thread_recent on member_messages (thread_id, created_at desc)
  where deleted_at is null;
```

RLS at b1 enforces the same-Group constraint: a `member_messages` row is visible to a Member only if that Member holds an explicit `group_memberships` row in the thread's `group_id` Group. The `member_threads.community_id` column becomes `member_threads.group_id` per the 2026-05-10 Groups ratification. The b2 surface relaxes this with explicit allow-DM toggles per the privacy controls. **The DM substrate does not now and will not ever carry a `location_id` column** — per the no-Location-messaging commitment in `policy.md`, no message channel is Location-scoped.

### Agent-assistance substrate (per ADR-6) — schema reserved at b1, no surface

```sql
-- Member-owned context document (per assistant-context.md, surface at b2)
create table member_self_records (
  member_id uuid primary key references members(id) on delete cascade,
  document jsonb not null default '{}',
  scratch_or_full text not null default 'scratch'
    check (scratch_or_full in ('scratch','full')),
  updated_at timestamptz not null default now()
);

-- Scoped, expiring permission grants from Member to non-human actors (per delegation.md)
create table member_delegations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  grantee_label text not null,
  scopes text[] not null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'
);

create index idx_delegations_member_active on member_delegations (member_id)
  where revoked_at is null and (expires_at is null or expires_at > now());
```

The `scopes` array carries values from a stable additive enum (`item.read`, `item.create.draft`, `item.publish` (confirmation-required), `member.profile.read`, `delegation.grant` (never delegable), etc.) defined in `agent-assistance.md`. The b1 commitment is that the enum is published and stable; the surface is b2.

### Audit fields on every event log entry (per ADR-6)

Every event log table — `item_events`, `community_events`, `member_events` (new at b1), and any future `*_events` table — carries:

```sql
acting_member_id uuid not null references members(id),
via_delegation_id uuid references member_delegations(id),
```

`via_delegation_id` is null for human-on-keyboard writes (the overwhelming majority at b1); populated when an action handler is invoked by an MCP client or in-app assistant on behalf of the Member via a granted Delegation. The audit field is **populated by the action handler, never by the caller** (per ADR-7).

### `member_events` (Member-scoped event log)

```sql
create table member_events (
  id bigserial primary key,
  member_id uuid not null references members(id),
  acting_member_id uuid not null references members(id),
  via_delegation_id uuid references member_delegations(id),
  event_kind text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
) partition by range (created_at);
```

> **Partition setup belongs in the migration, not the spec.** The DDL above declares the parent table as partitioned by month on `created_at`; the initial partitions and the monthly partition-rotation routine are created by the migration ticket (T028 schema floor) and documented in ADR-10 (the migration's transactional model). A build agent reading this DDL in isolation will not have a runnable table — that is intentional. See `planning/rebuild-plan.md` Phase 1.

Initial event kinds at b1:

- `member.created`
- `member.profile_updated` (display name, bio, avatar, pronouns)
- `member.handle_changed` (T2 surface; event reserved at b1)
- `member.home_location_set`
- `member.privacy_changed` (with diff in payload)
- `member.followed` / `member.unfollowed`
- `member.location_affinity_added` / `member.location_affinity_removed` (payload includes `{location_id, affinity_kind}`)
- `member.interest_added` / `member.interest_removed`
- `member.delegation_granted` / `member.delegation_revoked`
- `member.self_record_updated` (T2 surface; event reserved at b1)
- `member.deleted` / `member.restored`
- `member.export_requested`
- `member.purge_executed`

Append-only, partitioned monthly. Reads by the b3 Stakeholder dashboard, the Assistant Context audit trail, the Delegation audit surface, the future Intelligence layer. Missing entries become retrofit work.

### `discoverable_members` (deferred — locality index extension)

The `discoverable_items` materialized view (per `item.md`) is the locality-first index for Items at b1. A parallel `discoverable_members` view that surfaces Members directly in the locality index is a T2/T3 concern. Reserved here as a forward-looking note; not built at b1. When it lands, it joins `members` + `member_privacy` (filtered to public profile) + nearest active Item's location + Group `display_name` labels (from joined kind='business' Group memberships).

### Integration with `groups.md` (supersedes the prior `member-operations.md` integration)

Per the 2026-05-10 Groups ratification, Group memberships are the standing-tier gate. The view `member_has_standing_presence` is defined in `groups.md` and lives in the migration; the Member spec's role is to acknowledge that:

- Group memberships are stored on `group_memberships` (with `member_id` FK), not on `members` directly.
- A Member holds zero or many Group memberships across any number of Groups (per `groups.md`).
- The first commercial Item composition (kind='product' or kind='service') prompts a kind='business' Group walkthrough that creates or joins a Group via `group.create` + `group.member_join` action handlers. Per `agent-commerce-and-project-amendments.md` §6, this is not a "Become a Maker" mode-flip — it's the structural setup for the Group membership that henceforth carries the selling tools.
- The Item composer's `brand_label` field autosuggests from the Member's active business-Group `group_businesses.display_name` values.
- The Member's profile renders Group affiliations conditionally — present when explicit memberships exist, absent when none do, with per-membership visibility toggles (per the privacy controls).

### Integration with the action layer (per ADR-7)

Every write that touches a Member row goes through a named action handler. Initial handlers at b1:

- `member.create` — invoked by the Supabase Auth post-signup hook; creates the `members` row, the `member_privacy` row with defaults, fires `member.created`.
- `member.profile.update` — display name, bio, avatar, pronouns. Validates lengths, checks profanity on display name, fires `member.profile_updated`.
- `member.handle.set` — handle uniqueness check, profanity filter, writes to `members.handle`, fires `member.handle_changed`. **At b1: only invoked once per Member, at signup.** T2 surface allows updates.
- `member.privacy.update` — writes to `member_privacy`, fires `member.privacy_changed` with diff.
- `member.locality.set` — writes `home_location_id`, fires `member.home_location_set`.
- (Selling-tools handlers retired per `agent-commerce-and-project-amendments.md` §6.) The prior `member.maker_mode.toggle`, `member.maker_mode.activate`, and `member.maker.full_stop` handlers are removed. To start selling, a Member invokes `group.create` (kind='business') and `group.member_join` directly — composer flows wrap these but no Member-level state changes. To stop selling, the Member invokes `group.member_leave` for each owner-role business-Group membership (per `groups.md` lifecycle).
- `member.interests.add` / `member.interests.remove` — writes to `member_interests`, fires events.
- `member.follow` / `member.unfollow` — writes to `member_follows`, fires events.
- `member.location_affinity.add` / `member.location_affinity.remove` — writes to `member_location_affinities` (`{location_id, affinity_kind}`), fires `member.location_affinity_added` / `member.location_affinity_removed`. Validates `affinity_kind` against the enum; rejects writes targeting another Member's affinity rows. The action handler enforces the no-addressability commitment by exposing no surface that *reads* affinities for messaging-target purposes — it only writes them.
- `member.delete` — sets `deleted_at`, retracts public surfaces, fires `member.deleted`.
- `member.export.request` — produces the JSON export per ADR-6, fires `member.export_requested`.
- `member.purge.execute` — destroys the Member and cascades, fires `member.purge_executed` *before* the cascade so the audit log persists.
- `member.delegation.grant` / `member.delegation.revoke` — writes to `member_delegations`, fires events. (Surface b2; handlers exist at b1 for the substrate to be honest.)

No write to `members` or `member_*` tables occurs outside these handlers. Read paths are not constrained.

---

## RLS sketch

- `members` SELECT: public for `deleted_at is null` rows, filtered by `member_privacy.profile_visibility` (public → anyone; unlisted → anyone with the URL but no index; members_only → authenticated only).
- `members` INSERT: only via the `member.create` action handler, which is invoked by the Auth post-signup trigger.
- `members` UPDATE: row-owner only, only via action handlers.
- `members` DELETE: row-owner only, soft (sets `deleted_at`), only via action handler.
- `member_privacy` SELECT: row-owner only.
- `member_privacy` UPDATE: row-owner only, only via action handler.
- `member_interests` SELECT: visible per the Member's `profile_visibility`.
- `member_interests` INSERT/DELETE: row-owner only.
- `member_follows` SELECT: row-owner always; followed Member sees their followers if `show_followers` is true; followers see their following list if `show_following` is true.
- `member_follows` INSERT/DELETE: row-owner only (the follower).
- `member_location_affinities` SELECT: **owner-only at the row level (per ADR-16)** — `member_id = auth.uid()`. No peer-Member access, no anon access, no per-kind public-read across all six `affinity_kind` values (`lives`, `works`, `plays`, `visits`, `follows`, `liked`). Cross-Member computation goes through the three SECURITY DEFINER functions named above; backend services use the service-role key.
- `member_location_affinities` INSERT/DELETE: row-owner only, only via action handlers (`member.location_affinity.add` / `member.location_affinity.remove`).
- `member_messages` SELECT: only Members in the thread, and only if both Members share an active Community membership (b1 constraint; relaxed at b2).
- `member_messages` INSERT: thread participants only.
- `member_self_records` SELECT/UPDATE: row-owner only. **Never visible to other Members or their assistants. Never input to recommendation surfaces. Never trained on.** Per ADR-6 and ADR-9.
- `member_delegations` SELECT/UPDATE: row-owner only.

---

## Policy posture (per ADR-9)

Every privacy/revenue/data-sharing surface walks the three filters: helpful? harmless? abuse-resistant? The protective stance is the default; Members opt in to relax.

**Profile visibility — default `public`.**
- Helpful: discoverability is the Member's commercial and social value; default-private would defeat the locality index for Members who do want to be found.
- Harmless: a public profile reveals only what the Member explicitly chose to put on it (display name, optional bio, optional avatar). Not address, not email, not real name unless the Member typed it.
- Abuse-resistant: Members can switch to `unlisted` or `members_only` at any time; the affordance is in the privacy controls. The platform never auto-reverts, never nags to make public.

**Show items on profile — default `true`.**
- Helpful: the Member's posted Items are the primary surface their followers and prospective customers want to see. Defaulting on lets the profile do its work.
- Harmless: the Items themselves are public at their own URLs; aggregating them on the Member's profile reveals nothing the Item URLs don't already.
- Abuse-resistant: per-Item visibility (T2 reserved on `items`) takes precedence; a Member with a private Item does not surface it via this toggle.

**Show following / followers — default `false`.**
- Helpful: most Members do not benefit from public follow graphs; Twitter-shaped social graphs are not the platform's interaction model.
- Harmless: defaulting off prevents inadvertent reveal of who-follows-whom (a real privacy concern in small communities).
- Abuse-resistant: Members opt in per direction (show followers vs. show following); the toggles are independent.

**Allow direct messages — default `true`.**
- Helpful: a Member who joins a Community is implicitly opting in to coordination with other Community members; DM-default-on reflects that.
- Harmless: the b1 constraint (same-Community-only) means the DM surface area at b1 is limited to people the Member chose to be in a Community with. The b2 surface introduces explicit allow-DMs-from-outside, defaulting off.
- Abuse-resistant: block / mute / report are b2 surfaces. At b1, the Community membership is the moderation surface — leaving the Community removes the DM channel.

**Locality precision — default `city`.**
- Helpful: showing a Member's city helps neighbors recognize them as local; a Sacramento maker reading "based in Sacramento" is signal.
- Harmless: city-level precision does not reveal address. The home Location itself is never shown publicly even at the highest precision setting.
- Abuse-resistant: Members can drop to `none`; the platform does not require any locality precision to function.

**Selling tools — surfaced from Group / Item state, not from a Member-level toggle (per `agent-commerce-and-project-amendments.md` §6, ratified 2026-05-12).**
- Helpful: selling surfaces (product / service composers, seller dashboard, Item-management views, bulletin compose) are present when the Member needs them — i.e., when they hold an active kind='business' Group membership or have created a kind='product' / 'service' Item. Showing those surfaces to every new Member would be noise; surfacing them on the act of selling is honest signal.
- Harmless: a Member who has not declared any commercial intent does not see the selling-related surfaces. There is no aggregation, no inferred commercial framing, no profile section that appears uninvited.
- Abuse-resistant: there is no Member-level mode to auto-flip — the auto-flip prohibition of the prior ADR-12 dissolves with the mode itself. To start selling, the Member explicitly creates or joins a kind='business' Group (the action is declared, dated, ungameable per the Group event log). To stop selling, they end the owner-role membership; Items remain published per their own settings. ADR-12 is superseded; ADR-3's implicit-from-behavior pattern remains rejected.

**Stakeholder visibility — default `private` (T3 surface, schema reserved at b1).**
- Helpful: at T3, the Stakeholder dashboard surfaces accumulated patterns (followers, repeat customers, market history). Some Members will want this visible to attract business; many won't.
- Harmless: defaulting private prevents the surface from ever embarrassing a Member who didn't realize what was being aggregated.
- Abuse-resistant: opt-in per Member, granular by surface, revocable. The schema enforces it at the column.

**Assistant Context (per ADR-6 and ADR-9) — never visible to other Members, never trained on, never feed input. Permanent commitments.**
- Per ADR-9, opt-ins for aggregate analysis (with k-anonymity floor N≥10), opt-in cross-Member sharing (granular, time-bounded), and opt-in feed-input *for the Member's own surface* are T2/T3 surfaces. Categorical refusal of feed input *for other Members* is permanent.

**Delegation scopes — confirmation-required for publish-tier; one-time monetary actions delegable only under the schema-enforced `bounded_purchase` scope. Per ADR-6, ADR-9, and `agent-commerce-and-project-amendments.md` §8.**
- The `recurring_payment` opt-in (per ADR-9) lands at T2 with required caps, recipient allowlist, and required expiry.
- The `bounded_purchase` opt-in (per `agent-commerce-and-project-amendments.md` §8b, ratified 2026-05-12) lands at T2 with required per-transaction and per-period caps, required `recipient_scope` (one or more of: `community_members`, `locality`, `specific_members`, `specific_groups`, `external_recipients`), required `category_scope`, required expiry, required reversibility window, and first-recipient confirmation defaulting on. See `agent-assistance.md` for the full scope shape and `payments.md` for the rail.

---

## Integration Points

**Connects to:**

- **Item** — every Item has a `member_id` author. Most Items have one Member; multi-Member co-creation (T2) adds `item_collaborators`.
- **Location** — Members have a soft `home_location_id` for locality default per ADR-4 (not an address). They hold multi-Location affinities (live, work, play, visit, follow, liked) via `member_location_affinities` per the Multi-Location belonging section above.
- **Group** — Members hold zero or many Group memberships via `group_memberships` (per `groups.md`). `members.primary_group_id` is a soft pointer to a chosen primary Group (most Members have none). The Group primitive is the unified replacement for the prior Community / Member Operations / Cooperative split — kind='business' Group memberships drive standing tier; kind='steward' role on non-business Groups also qualifies.
- **Assistant Context** — one row per Member in `member_self_records`; row-owner only.
- **Delegation** — Members grant zero or many Delegations to non-human actors (assistants, Skills, federation peers).
- **Skills** — Members with standing presence subscribe to Skills (per `agent-assistance.md`); subscriptions are per-Member.
- **Auth** — `members.id = auth.users.id`; Supabase Auth is the identity floor.
  **Intent:** PK equality (1:1, lifetime-stable) is the structural choice. Decoupling auth identity from Member identity — separate IDs joined by FK — would let the two drift over time (orphaned auth rows, multi-Member auth accounts, reconciliation tooling required to keep them aligned). Equating the primary keys removes the entire class of bugs by construction: there is no second row to be out of sync with the first. The cost (auth provider changes are migrations) is paid once; the bug class is closed forever.

**Used by:**

- The locality-first index (Cluster 3) — every Item card surfaces the creating Member's display name + handle + avatar.
- The Member's `/m/[handle]` profile page — assembles Items, Group memberships, Location affinities, follow counts (privacy-filtered).
- The action layer (per ADR-7) — every write validates `members.id` and any granted Delegation scope.
- The event log — every event row carries `acting_member_id` and `via_delegation_id`.
- The b3 Stakeholder dashboard — reads from `member_events` + Item engagement events.
- The Intelligence layer (b3) — Member creation rates, Group-formation rates, Item creation by kind, locality-wise activity are direct signals of community economic activity.
- Federation (Loop 13, T3) — Member identity, Assistant Context, and Delegations follow the Member to spawned platforms.

---

## AI / LLM searchability

Every Member is designed to be queryable via natural language at T3. The MVP doesn't build semantic search but commits to the schema that enables it:

- **Bio as embedding substrate.** Member bios are written in natural language (first-person, plain English, no keyword stuffing). The same bio that reads well to a human will embed well for semantic search.
- **Group memberships and `group_businesses.display_name`** (per `groups.md`) provide the structured layer. An LLM mapping "who in Folsom does pre-1900 plumbing" maps Group `display_name` + the Member's role (`owner` / `member`) + locality (via Member affinities and Item-Location attachments) + linked Service Items.
- **Member interests** (`member_interests`) constrain the topical surface to terms an LLM can reason over. Combined with `member_location_affinities` of kind=`follows`, these power compositional queries like the Concerts-in-the-Park surface (per `use-cases.md` example #12).
- **Reserved embedding column** — when the parallel `member_embeddings` table is built at T3, it indexes against `bio`, the Member's active Group `display_name` values, and the Member's `member_interests`.

The MVP serves structured-filter search (handle, display name lookup, Items by Member, Members in Community); T3 adds vector search across bios; T3 also surfaces the chat surface that resolves natural-language Member queries.

---

## Social capital

Members earn **social capital** through participation, helping others, contribution to their communities, hosting Gatherings, fulfilling Asks, sharing Offers, supporting Initiatives, and other prosocial actions on the platform. Social capital is earned (no way to purchase it), Member-owned (accrues to the Member, follows them across loops, portable through federation handoff per Loop 13), not a ranking signal that affects what other Members see (refusing the engagement-metric trap), and optionally surfaced (Members choose whether and how it appears on their profile). **Planned feature, design pending user ratification.** Schema, surfaces, and the prosocial-action taxonomy ship after the design is settled. The Member primitive is the anchor; the schema lands on this table or a sibling once the design is approved.

---

## What does not ship at b1

- Reviews of Members in their personal capacity (rating a Member as a person, separate from any commercial activity) are not a planned feature. Reviews tied to commercial activity — buyers reviewing producers/sellers/service-providers they bought from — are a **planned feature; design pending user ratification** (visibility model, anti-gaming, symbiosis, reciprocity all open). Social capital earned through participation is a **planned feature; design pending user ratification** (see "Social capital" below). The prior "permanently deferred" framing is rescinded per `agent-commerce-and-project-amendments.md` §3.
- Public follow streams or Member activity feeds. Loop 8 storage is b1; surfaces are b2.
- Direct message UI. Schema at b1; surface at b2.
- Assistant Context UI and update pathways. Substrate at b1; surface at b2.
- Skill subscription UI. Substrate at b1; surface at b2.
- Delegation grant/revoke UI and the MCP server. Substrate at b1; surface at b2/b3.
- Stakeholder dashboard. Event log entries are b1; the surface is b3.
- Member federation across spawned platforms. T3, Loop 13.
- Member ↔ Member endorsements. Service Provider T2.
- Block / mute / report surfaces. b2.
- Handle changes. T2 (schema reserved at b1).
- Multi-locality. T2.
- Member chat surface. T3.

---

## Open questions

- **Real-name escalation.** Real name is encouraged-not-required at b1. Open: should the platform ever escalate (require) real name for Members who repeatedly violate the canonical examples' spirit (impersonation, fake Operations, harassment)? Working answer: defer to b2's moderation surface; b1 trusts the email-uniqueness floor and the small initial population.
- **Avatar moderation.** Profanity-filtered display names, but avatars can carry the same content. b1 leaves avatar moderation to community report (a b2 surface). Open whether to add a lightweight automated filter (NSFW detection) at b1.
- **Vendor-at-market modeling per ADR-5.** Does a Maker's appearance at a market session live as (a) a separate Item the Maker declares ("I'll be at Saturday's Folsom market") or (b) a relationship between the Member and the market's Gathering Item (RSVP-as-vendor with a "vendor list" surface on the market page)? Decision belongs in `item.md` per ADR-5; this spec just acknowledges the open question.
- **Account merge.** A Member who signed up with magic-link and later signs in with Google: same Member or two? Working answer at b1: same email = same Member (Supabase Auth handles this for matching emails); different email but same human = no merge surface at b1, defer to b2.
- **Display-name uniqueness.** Handle is unique; display name is not. Two Members named "Maya" is fine. Open: do we surface a (handle) disambiguator on Item cards when display names collide within a locality? Defer to b2 once we observe collisions.
- **Soft-delete revival window.** A soft-deleted Member can be restored by signing in again within N days. Open: what's N? Working answer: 30 days, then the row is hard-archived (with audit log preserved). Confirm before T1 ships.
- **Handle redirect history.** When the b2 handle change ships, old handles redirect for 90 days. Open: do they also resolve in the locality search results, or just direct-URL? Working answer: direct-URL only.
- **Member privacy + Item privacy interaction.** A Member with `profile_visibility=members_only` who posts a `public` Item — does the Item card link back to a profile a non-member can see? Working answer: no; the link is hidden for non-members but the Item itself remains discoverable. Confirm in the design review of the Item card pattern.
- **Onboarding length.** The b1 hypothesis depends on conversion: a newcomer arrives via a shared URL, lands on an Item, and signs up to RSVP / follow / save. Open: how many fields are *required* at signup? Working answer: email (auth) + display name + handle. Bio, avatar, locality, interests are post-signup nudges, not blockers. Confirm with the F021 Member-public-page scenario before T1 ticket sequencing.
- **Initial interest vocabulary.** `member_interests.tag` is sized from the same controlled vocabulary as `item_tags`. The initial vocabulary list per Item kind is an open question on `b1-primitives.md` (Open question: *Initial tag vocabulary per Item kind*). Member's initial interest options should be drawn from that list once it's sized.

---

## Comments

The Member primitive is the structural anchor of the entire platform. Every other primitive references it; every loop reads from or writes to it; every event row attributes work to it. Getting Member right at b1 is what lets the rest of the schema land cleanly.

The two most consequential commitments encoded here:

**One Member per real human, no role column, no Business shell.** The temptation will be to add a `role` enum on `members` (Maker, Service Provider, Community Founder, etc.) so feature flags and routing are easy. Don't. Roles are verbs the Member is doing, surfaced from Operations + Item activity. The moment a `role` column lands, the primitive collapses back into a directory-of-types and the people-first posture is gone. The same holds for any "is this a business" boolean: there is no Business entity in the schema, and a Member who runs a personal business is captured by their Operations, not by a flag.

**Schema reserved for the agent-assistance stack at b1, surface deferred.** The `member_self_records`, `member_delegations`, and the `acting_member_id` + `via_delegation_id` audit fields land at b1 even though no surface uses them. This is the single decision that prevents the b2/b3 agent-assistance work from becoming a multi-month retrofit. The cost at b1 is small — three tables, two columns on every event log row, no UI. The cost at b2 if skipped is rewriting every action handler and event row to retroactively populate the audit trail. The same logic applies that drove the event log itself: ship empty, fill later, never paint into a corner.

The deliberate refusal of a `role` column is the relational realization of `principles.md`. The deliberate substrate-at-b1 for Assistant Context and Delegation is the realization of ADR-6's "agent-friendly natively, not bolted on." The opt-out default across every privacy field is the realization of ADR-9's three-filter test. These three commitments do most of the long-term work; the rest of the spec is the surface that lets them ship.

## Decisions encoded here

This spec is the live home for the following architectural decisions. See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register; the entries below are the single-system decisions whose status banner in this file *is* the load-bearing ratification.

| ADR | Status | What lives here |
|---|---|---|
| ADR-3 | **REJECTED** — superseded by the 2026-05-10 Groups ratification and the 2026-05-12 ADR-12 supersession (no Member-level mode at all per `agent-commerce-and-project-amendments.md` §6) | The implicit-from-behavior Maker model. Historical text in [`../../_attic/2026-05-19/planning/DECISIONS-superseded-2026-05-10.md`](../../_attic/2026-05-19/planning/DECISIONS-superseded-2026-05-10.md). |
| ADR-12 | **SUPERSEDED** 2026-05-12 by `agent-commerce-and-project-amendments.md` §6 | The "Maker mode" framing is retired. There is no Member-level boolean — `members.maker_mode_enabled` is dropped. Selling tools surface from Group membership (kind='business') and Item kind (`product` / `service`). The auto-flip prohibition dissolves with the mode itself. Vocabulary: **Seller** is the generic term; **Producer** is preferred in agricultural/food context (per the amendment §6b ratification). Historical text of the prior ADR-12 interpretations lives in [`../../_attic/2026-05-19/planning/DECISIONS-superseded-2026-05-10.md`](../../_attic/2026-05-19/planning/DECISIONS-superseded-2026-05-10.md). |

This spec also *encodes* (but does not own) ADR-4 (locality default), ADR-6 (Assistant Context + Delegation substrate at b1), ADR-7 (action layer), ADR-9 (opt-out privacy defaults), ADR-15 (auth.users coupling — `members.id = auth.users.id` and the post-signup trigger pattern), and ADR-16 (per-row privacy on `member_location_affinities` — the RLS sketch above and the `member_location_affinities` substrate section above are the load-bearing surfaces). Those live cross-cutting in `DECISIONS.md`.
