---
id: what-member
purpose: Anchor primitive — one row per real human.
layer: what
status: active
---

# System: Member

**Purpose:** Establish Member as the platform's anchor primitive — the record of one real human who declares Items, attaches them to Locations, optionally joins Communities, and accumulates standing presence over time. Every other primitive (Item, Location, Community) and every loop reads from or writes to a Member. This spec defines what a Member is, what is true about a Member at b1 vs. b2 vs. b3, and what data-model commitments must land at b1 so the agent-assistance stack (Operations / Assistant Context / Skills / Delegation), the policy framework, and the federation layer can layer on without retrofit.

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

**North stars served:** All five loop families. Members are present on at least one side of every loop. Specific surfaces (Maker affordances, host affordances, steward affordances) appear conditionally based on what the Member is *doing* — the role-as-verb posture from `primitives.md`.

**Decisions encoded:** ADR-4 (locality default = geolocate then city pick, mutable) · ADR-6 (Member-owned context, standing-derived persistence) · ADR-7 (action layer for all writes) · ADR-9 (opt-out default, three-filter test for every privacy/revenue/data-sharing surface) · ADR-15 (auth.users coupling — `members.id = auth.users.id`, post-signup trigger is the only Member-create path) · ADR-17 (`bounded_purchase` Delegation scope — the Delegation-scopes Policy posture references it) · ADR-21 (Member↔Geography substrate split: jurisdiction + place-interests + saved-searches replace the six-kind affinity enum). Standing-tier gate is defined in `groups.md`: ≥1 active membership in kind='business' Group OR steward-role membership in any non-business Group.

**Companion specs:** [`primitives.md`](../foundation/primitives.md) · [`principles.md`](../foundation/principles.md) · [`policy.md`](../foundation/policy.md) · [`groups.md`](groups.md) · [`item.md`](item.md) · [`location.md`](location.md) · `agent-assistance.md` (forward-looking, schema reserved at b1)

**Canonical examples this spec serves:** Maya at Oak Park Sourdough · Ferrari Fisheries · Cafe Capricho's successor · Brian declaring the Run Club at Drake's · Aaron posting a fish-drop Wonder · Maya finding something to do tonight · the West Sac school-parents Community founder. Per [`use-cases.md`](../needs/use-cases.md).

---

## What a Member is and why it matters

A Member is the platform's record of one real human. One row, one human, lifetime-stable identifier. Every Item is created by a Member. Every Item response is performed by a Member. Every Community is founded, joined, stewarded, and dissolved by Members. Every Operation is held by a Member. Every Delegation is granted by a Member. Every event log row is attributed to a Member.

A Member is **not** a role. Per `primitives.md`, the platform models verbs, not identities. A Member who posts product Items is acting as a Seller (Producer in agricultural / food context); the same Member organizing a recurring gathering is acting as a host; the same Member founding a cooperative bakery Community is acting as a steward. None of those activities are stored as a `role` column on `members`. They surface as conditional affordances on the Member's profile when the underlying activity exists, and they retract when it doesn't.

A Member is **not** a business. Per `principles.md`, there is no Business entity in the schema, ever. A Member who runs a personal business does so through a kind='business' Group (per `groups.md`) — a Group of one (sole proprietor), of two-plus owners (partnership), or of owners + staff (operating team). The Group carries the brand label (`group_businesses.display_name`), the optional `legal_entity_kind` (LLC, sole_prop, partnership, etc.), and the membership rows. A cooperative-shape operation is a kind='business' Group with multiple owner-role memberships, not a separate primitive — cooperative-style coordination (co-owning, voting, distributing) is deferred until real-world need + explicit user prioritization. The absence of a Business row is what keeps the platform structurally honest about who is doing the work; the Group primitive is what records the *people organizing to do it together*.

A Member is **not** a Location. Members are humans; Locations are places. Per ADR-21, a Member's relationships to geography are recorded across three purpose-owned substrates rather than one fused enum: (1) `home_location_id` — the private locality default per ADR-4; (2) `member_place_interests` — the Member's awareness scope (one `primary_home` Place plus up to 5 `secondary` Places), private; (3) `member_saved_searches` — generalized follow / interest-in-a-Place subscriptions, private. Public seller-locality claims (the "Locally Owned" badge) live in `member_business_jurisdictions` per [`business-jurisdiction.md`](business-jurisdiction.md); the "Locally Made" product-provenance claim lives on `items.made_at_place_id` per [`item.md`](item.md). At b1 the platform does not store Member street addresses — ZIPs, Places, and radius queries are sufficient for every locality feature in scope, and the absence of an address store keeps the doxxing surface minimal. The platform revisits this only on a clear, defined Member benefit; if addresses ever land, the platform commits to active safety measures for Members who could be harmed by exposure (per-Member opt-in, granular precision, defense against bulk exfiltration).

> **Intent (Ratified 2026-05-23 — soft commitment):** The three-substrate split (per ADR-21) is the structural shape; the address-storage posture is the *current* answer to "do we need a street-address column on `members`?" — at b1, no, because ZIPs / Places / radius queries cover every locality feature on the b1–b3 horizon and the absence of an address store keeps the doxxing blast-radius small. The commitment is *"we don't store addresses by default, unless a defined benefit emerges"* — not a categorical refusal. **Test for future proposals:** does the proposal want a stored-address column or to re-fuse the geography substrates? If yes, name the defined Member benefit and the safety mechanism that lands with it — the soft commitment doesn't refuse the column, it refuses the column-without-rationale.

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

- `home_location_id` (nullable FK to `locations` — schema per forthcoming `location.md`; see `b1-primitives-plan.md` Suggested build sequence step 2) — the Member's chosen locality scope. Set during onboarding via geolocation (preferred) or city pick from a list (Sacramento metro + surrounding cities at launch). Mutable from any locality-dependent surface; the affordance is visible on Home and Explore per ADR-2 and ADR-4.
- The home Location is a *scope*, not an address. A Member who lives in Bryte but works in Folsom can set Folsom as home and reset to Bryte later — the platform does not police it. Privacy: never shared with other Members, never visible on the Member's public profile.

### Privacy controls (b1 surface, opt-out default per ADR-9)

The b1 privacy controls cover what is publicly visible on `/m/[handle]` and whether the Member is findable as a person at all. The protective default applies to every field; Members opt in to richer visibility per the policy framework's three-filter test. The discoverability default and the prompt-on-acquisition flow below are the b1 encoding of the platform pattern **"Default Member discoverability to private; outputs surface, people opt in"** ([`playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md)). The policy posture for each opt-in is in the **Policy posture** section below.

- **Member discoverability** (`is_discoverable`, boolean, **default `false`**) — the gate on search results, directory listings, autocomplete suggestions, handle-direct typing inside the app, and external search-engine indexing of `/m/[handle]`. When false, the Member does not surface in any of those affordances; the page still resolves for anyone with the direct URL subject to `profile_visibility`. When true, the Member is findable across all four surfaces and `/m/[handle]` is indexable. T1 ships as a single switch (default off); per-surface granularity (search / directory / handle-direct / autocomplete as separate switches) and public-with-friction defer to T2/T3 per the pattern. **(Ratified 2026-06-03 — inverts the as-shipped public-default in F032 to match the platform pattern; the producer/organizer auto-opt-in was rejected in favor of a one-time prompt — see the prompt-on-acquisition rule below.)**
- **Profile visibility** — `public` (visible to anyone with the URL, indexable subject to `is_discoverable`) / `unlisted` (no index, link-only) / `members_only` (**default**, must be signed in to view) / `private` (only the Member themselves can view the page; signed-in viewers with the URL get a tombstone). The b1 default is `members_only`: a non-discoverable Member is unfindable in search, but if a friend pastes a direct URL into chat, a signed-in viewer can see the page. Members who want full invisibility set `private` ("become private within the app from other Members"). Three-tier-plus-private supersedes the prior `public`-default; the enum extension is additive on top of Community's discoverability enum.
- **Show items on profile** — boolean, default `true`. When false, the Member's Item count and Item list do not render on the public profile (the Items themselves remain at their own URLs and discoverability).
- **Show following / followers** — boolean, default `false`. Counts and lists hidden by default; opt in to show.
- **Allow direct messages** — boolean, default `true`. (DM surface ships at b2 per the user's b1 scope decision; the toggle exists at b1 so the substrate is honest.)
- **Locality precision** — `city` (default — only the city of the home Location is visible) / `neighborhood` (more specific) / `none` (locality not shown publicly).
- **Show Group memberships** — boolean per membership (default `true` for explicit memberships; falsifying hides that Group affiliation from the public profile but does not affect the membership row or Items filed under the Group). Per `groups.md`.

Every setting is granular, visible, revocable. Changes are written to `member_privacy` (single row per Member, columns per setting) and append a `member.privacy_changed` event with the diff.

### Attribution behavior in cross-Member surfaces (T095 Ratified 2026-06-03)

The discoverability bit gates findability; it does **not** gate visibility of a Member's outputs. Selling, hosting, or otherwise posting publicly is itself a consent to attribution — every Group, Item, gathering, or follow event carries the acting Member's handle and display name in the system of record. What is gated is the *link to the personal profile* on surfaces a third party sees:

- **`/m/[handle]` page** — gated by the SECURITY DEFINER `resolve_member_page_visibility(handle, via_direct_link)` verdict function. Returns `render` / `tombstone` / `notfound` and the discoverability + visibility flags the page needs for robots-meta. Anon never learns a non-public Member exists (returns `notfound` for anything but `public` / `unlisted`); signed-in non-self gets `tombstone` only for `private`. The verdict function is the single source of truth for the page-render decision and the search-origin gate (via the `via_direct_link = false` argument, reserved for the b2 listing surfaces).

- **Robots / external index** — the `/m/[handle]` page emits `<meta name="robots" content="noindex,nofollow">` whenever `is_discoverable = false`. External search engines never index a non-discoverable Member's page.

- **Shop "Founded by" line** — the Member's display name + avatar always render (the Group surface keeps a named human visible as load-bearing accountability per `groups.md` § No-personhood guarantees). The wrapping is conditional: `<a href="/m/<handle>">` when the founder has opted into discoverability, plain `<span>` otherwise. A non-discoverable founder is named, not linked.

- **Individual-Item attribution** ("Sold by Maya", "Hosted by Sam") on items not filed under a Group — same conditional rule: link to `/m/<handle>` when the seller / host is discoverable, plain text otherwise. The Item itself is visible regardless. The base members row is still embedded for the handle + display name; only `member_public_discoverability` is consulted for the link decision.

- **Group-filed Item attribution** ("Sold by Oak Park Sourdough") — attribution reads from the Group, not the Member-behind-the-Group. Item resolvers do not embed `members` for Group-filed items. The Group is always public-by-default; the personal Member behind the Group is separately gated by the rules above. See `groups.md` § Public-face attribution.

The projection view `public.member_public_discoverability` (regular view bypassing RLS, same pattern as `member_public_group_memberships`) exposes only `(member_id, is_discoverable)` to anon / authenticated. It is the only privacy-bearing column readable cross-Member; the base `member_privacy` row remains owner-only.

### Selling tools

There is no "Maker mode" to be in. There is a set of **selling tools** for offering goods or services, and those tools are present whenever a Member needs them. There is no `members.maker_mode_enabled` boolean. The structural signal that a Member is selling is `groups.kind='business'` membership and / or the existence of `items.kind='product'` or `'service'` rows for that Member — exactly as `groups.md` already models it. No state to toggle. No "Become a Maker" CTA.

- New Members onboard with the universal composer (gathering, wonder, ask, offer, etc.). The product and service composers are surfaced as kind-specific verbs in the naming-conventions table (per `CLAUDE.md`): **Sell · Share** for products, **Offer** for services. A Member who taps "Sell" for the first time enters the kind='business' Group walkthrough — creates a Group with themselves as sole owner-role membership, then the product composer opens.
- A Member who has ≥1 active kind='business' Group membership has the full selling toolset surfaced ambiently: composer entries for product / service, the seller dashboard, the Item-management views, agent-assistance affordances. No toggle to enable; no toggle to disable.
- To stop selling: end the owner-role membership in the business Group (per `groups.md` lifecycle — founder leaving puts the Group into 90-day dormancy, recoverable). Items remain published per their own settings; the Member can rejoin or create a new Group later.
- Profile-visibility of selling: the existing `members.show_group_memberships` per-membership privacy toggle (above) hides a business-Group affiliation from the public profile without affecting the Group itself. A Member who wants a private selling presence sets the Group's `discoverability='unlisted'` or `'private'` per `groups.md`.

**Vocabulary.** **Seller** is the generic term for a Member offering goods or services. **Producer** is preferred in the agricultural and food context (already used in [`producer-tools.md`](producer-tools.md)). "Maker" survives only as a UI label where the Member specifically self-identifies as such (craftspeople, artisans).

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

### Place-interest scope (substrate at b1; surface at b2) — per ADR-21

A Member has an **awareness scope**: a set of Places they care about for the community-awareness feed. One `primary_home` Place plus up to 5 `secondary` Places.

- `member_place_interests` table: `member_id`, `place_id`, `scope_kind` (enum: `primary_home`, `secondary`), `created_at`, `removed_at` (soft, nullable). Composite PK on `(member_id, place_id, scope_kind)`.
- `primary_home` is derived from `home_location_id`'s `place_id` at onboarding (the `member.locality.set` action handler maintains the trigger). Mutable. One row per Member.
- `secondary` captures cross-Place interests — a Member who lives in West Sac but cares about Folsom because they work there; a Member who lives in Oak Park but wants Sacramento-wide awareness; a Member with a hometown they still follow. Up to 5 secondaries at b1.

  > **Intent (Ratified 2026-05-23 — soft commitment):** 5 is a starting point, not a structural commitment. The cap exists to bound the community-awareness feed candidate-set cost while we learn what Members actually want. We'll watch how many Members hit the cap and what they do when they hit it — if the pattern says 5 is too low, we raise it (and reshape the feed query if cardinality argues for it). The cap is action-layer-enforced, not DDL-enforced, so it's tuneable without migration. **Test for future proposals:** does the proposal want to raise / lower the cap? Land a measurement story alongside (how many Members hit the current cap, what they dropped to add the new one).
- **The hierarchy in `places.parent_id` handles within-hierarchy traversal.** A Member with `primary_home=Oak Park` traverses up to Sacramento by default for the awareness feed — they don't need separate rows for Oak Park and Sacramento-the-city. Colloquial-metro scope ("the whole Sacramento metro") is not a tree row at all — it's computed against the `metro_polygons` discovery overlay via `ST_Contains` (per D3, [`places.md`](places.md) / [`discovery.md`](discovery.md)), not by walking the tree to an MSA ancestor. The secondary set is for *cross-hierarchy* interests, not parent-of-home interests.
- **Place-interests do not grant addressability.** Per the anti-Nextdoor commitments in `policy.md` and `location.md`, no DM, feed, or wall is scoped to a Place. `member_place_interests` is read by feed candidate generation (per [`discovery.md`](discovery.md) community-awareness feed), never consulted for messaging targets.
- Events: `member.place_interest_added`, `member.place_interest_removed`, `member.place_interest_promoted` (secondary → primary_home), `member.place_interest_demoted`.

### Saved searches (substrate at b1; surface at b2) — per ADR-21

A Member subscribes to streams of Items via a general saved-search shape rather than per-Location follow rows. Subsumes "follow this venue," "notify me about outdoor live music in any park I care about," "let me know about sourdough drops in Oak Park."

- `member_saved_searches` table: `id` UUID PK, `member_id`, `label` (Member-authored, 1–80 chars), `place_id` (nullable FK to `places`), `location_id` (nullable FK to `locations`), `interest_tags` text[], `item_kinds` text[], `created_at`, `removed_at` (soft, nullable). Check constraint: at least one of `place_id`, `location_id`, or non-empty `interest_tags` must be set.
- Member-labeled. The label is intent ("Concerts in the parks I like," "Anything at Drake's," "Sourdough drops in Oak Park") and is private to the Member.

  > **Intent (Ratified 2026-05-23 — soft commitment + forward note):** The labeled-saved-search shape (`label` + structured filters) is a *starting point*, not the end state. The larger vision per PM direction 2026-05-23: a **rich, LLM-enhanced search experience** where search patterns inform the platform's understanding of consumer wants and preferences, seed Member-authored Wonders, and surface ideation opportunities for new Groups, businesses, and community initiatives. Search is — per the PM — *probably the platform's most helpful tool*. The b1 substrate (`member_saved_searches`) is honest enough to ship the saved-subscription pattern and to feed the search-intelligence layer when it lands. The 1–80 char label range is sized to be a legible intent string in a list-of-subscriptions UI and is tuneable. **Test for future proposals:** does the proposal want to add structured filter fields the LLM-search layer can consume (semantic-query embedding, free-text-search column)? Welcome — additive to the substrate. Does it want to replace labels with auto-derived names? Walk that through `explore` — labels-as-Member-intent is the b1 commitment.
- **The "Follow this venue" UI affordance** on a Location page creates a saved-search row with `location_id` set and a default label derived from the venue's name. The Member can edit filters and label afterward.
- **Notification fan-out is pull-shaped at b1.** When a new Item attaches to a Location, the platform evaluates `member_saved_searches` rows whose filters match the new Item and notifies the saving Member. Pull-shape is fine at b1 scale; push (precomputed) is a T2/T3 question.
- Events: `member.saved_search.created`, `member.saved_search.updated`, `member.saved_search.removed`. Reserved at b1; surface and fan-out worker ship at b2.

### Taste profile (extends `member_interests` — substrate at b1, richer surface at b2)

`member_interests` (the controlled-vocabulary tag list per Member, b1) carries the Member's stated affinities for kinds of things — `live-music`, `outdoor`, `summer-evenings`, `vegan-food`, `pre-1900-plumbing`. Combined with `member_place_interests` and `member_saved_searches` (per ADR-21), this powers compositional queries against the locality-first index — *"gatherings tagged outdoor+live-music in any park inside my place-interest set."* The b1 substrate ships the tags + the place-interest rows + the saved-search rows. b2 surfaces saved-search composition explicitly ("create a feed for outdoor live music across the Sacramento metro"); the community-awareness feed in `discovery.md` already reads place-interests × interest tags at b1. T3 layers vector embeddings over Member interests + Place descriptions for natural-language equivalents.

### Direct messaging (substrate only at b1; surface at b2)

Per the b1 scope decision: the messages schema lands at b1 so b2 can ship the surface without retrofit, but no UI exists at b1. Tables: `member_threads`, `member_thread_participants`, `member_messages`. Constrained at b1: only Members in the same Community can be in the same thread (RLS-enforced); the b2 surface relaxes this with explicit allow-DM toggles. The constraint at b1 lets the schema land with no moderation surface area exposed to a solo team.

### Account lifecycle

- **Soft delete only.** Setting `deleted_at` retracts the Member from public surfaces, hides their Items (which retain `member_id` for attribution), and removes them from active Community memberships. Hard delete never ships at any tier (per b1-primitives-plan.md).
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

- **Stakeholder dashboard** — the producer-facing analytics surface (views, follows, saves, response counts, engagement over time) reads from the b1 event log entries. Per b1-primitives-plan.md, the dashboard ships at b3; the events are required at b1.
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
- **No `maker_mode_enabled` column.** Selling-tool surfaces are driven by Group membership (≥1 active kind='business' Group) and / or Item kind (`product` / `service` rows), not by a Member-level boolean.
- No `role` column. Roles are verbs surfaced from Item + Group activity, not stored.
- No `business_id`. There is no Business entity (per `principles.md`).

### `member_privacy` (one row per Member, opt-out defaults per ADR-9)

```sql
create table member_privacy (
  member_id uuid primary key references members(id) on delete cascade,
  is_discoverable boolean not null default false,
  profile_visibility text not null default 'members_only'
    check (profile_visibility in ('public','unlisted','members_only','private')),
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

### Prompt-on-acquisition for producers / organizers

When a Member acquires either (a) their first active kind='business' Group membership (any role), or (b) their first active `steward`-role membership in any non-business Group, the action handler that writes the membership row also enqueues a one-time UI prompt on the Member's next session offering to flip `is_discoverable = true` (and optionally `profile_visibility = public`). The prompt is dismissible; default selection is "Not now." There is no auto-flip — Members who acquire producer / organizer roles must consent to discoverability explicitly, same as any other Member. The prompt does not re-fire on subsequent business / steward role acquisitions; one offer per Member lifetime. Substrate at b1: a row in `member_prompts (member_id, prompt_kind, shown_at, dismissed_at, accepted_at)` written by the membership action handler; the prompt UI surface itself can defer to b2 if needed, but the substrate ships at b1 so the audit log is complete and the prompt-not-yet-shown state is queryable. (Ratified 2026-06-03 — alternative was auto-opt-in on acquisition; rejected because role acquisition is a data state, not a privacy consent.)

**Follow visibility is public-by-default at b1.** The `show_following` and `show_followers` columns ship as reserved substrate, but the **schema does not enforce them**: `member_follows.member_follows_public_read` is `using (true)`. Rationale: the opt-out privacy posture targets *cross-community discovery by bad actors*, not intra-community visibility. Follow graph is social fabric — same-community Members already know who hangs out with whom. The privacy investment earns its keep on the geography substrates: `member_place_interests` and `member_saved_searches` are owner-only at the row level (doxxing-prevention). If real-Member feedback at b2 surfaces follow-graph opt-out as a need, the action layer can wire the existing toggles in — action-layer-applied gating, not RLS-applied.

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

### `member_place_interests` (community-awareness scope — per ADR-21)

```sql
create table member_place_interests (
  member_id   uuid not null references members(id) on delete cascade,
  place_id    uuid not null references places(id) on delete cascade,
  scope_kind  text not null
    check (scope_kind in ('primary_home','secondary')),
  created_at  timestamptz not null default now(),
  removed_at  timestamptz,
  primary key (member_id, place_id, scope_kind)
);

create index idx_place_interests_member_active
  on member_place_interests (member_id, scope_kind)
  where removed_at is null;
create unique index ux_place_interests_primary_home
  on member_place_interests (member_id)
  where scope_kind = 'primary_home' and removed_at is null;
```

The unique partial index enforces exactly one active `primary_home` row per Member. The `secondary` cap (≤5 per Member) is enforced in the `member.place_interest.add` action handler rather than at the column level (action-layer guard rather than DDL constraint, so the cap can be tuned without migration).

> **Intent (Ratified 2026-05-23):** Exactly-one `primary_home` is about the *awareness-default anchor*, not about scope size. The Member picks the **granularity they want their default community to be** — a neighborhood (Oak Park), a city (Sacramento), or a county (Sacramento County) — because the `places` hierarchy supports any of those (per `places.md`). The unique constraint enforces that there's *one* such default, not that the default has to be small. A Member who wants metro-wide awareness ("the whole Sacramento metro") keeps a tree-anchored primary_home and opts into metro scope, which the feed computes against the `metro_polygons` overlay via `ST_Contains` (per D3) — the colloquial metro is not itself a `primary_home`-able Place. A Member who feels their community is "Oak Park, specifically" sets primary_home to the neighborhood Place. Secondaries handle cross-Place interests that don't fit a single hierarchy line (work city, hometown, vacation spot). **Test for future proposals:** does the proposal want multiple primary_homes (treating "home" as plural)? Walk through what *one default* means in the feed — the awareness query needs a single starting point for the parent-traversal; ambiguity here cascades into "which home wins when they conflict" questions that the secondary-set was designed to absorb. Does it want to remove the unique constraint and let Members hold multiple primary_homes? Strong burden-of-proof: the secondary-set + the choice-of-granularity already covers every shape we've identified.

### `member_saved_searches` (generalized follow / interest-in-a-Place — per ADR-21)

```sql
create table member_saved_searches (
  id             uuid primary key default gen_random_uuid(),
  member_id      uuid not null references members(id) on delete cascade,
  label          text not null check (char_length(label) between 1 and 80),
  place_id       uuid references places(id),
  location_id    uuid references locations(id),
  interest_tags  text[] not null default '{}',
  item_kinds     text[] not null default '{}',
  created_at     timestamptz not null default now(),
  removed_at     timestamptz,
  check (place_id is not null
         or location_id is not null
         or array_length(interest_tags, 1) > 0)
);

create index idx_saved_searches_member_active
  on member_saved_searches (member_id)
  where removed_at is null;
create index idx_saved_searches_place
  on member_saved_searches (place_id)
  where place_id is not null and removed_at is null;
create index idx_saved_searches_location
  on member_saved_searches (location_id)
  where location_id is not null and removed_at is null;
```

**Notification fan-out.** When a new Item attaches to a Location, the platform evaluates `member_saved_searches` rows whose filters match (place ancestry, location, interest-tag overlap, kind overlap) and notifies the saving Member. Pull-shape at b1; push (precomputed follower-set per saved-search) is a T2/T3 question.

**Structural privacy (per ADR-21).** Both `member_place_interests` and `member_saved_searches` are **owner-only at the row level** (`member_id = auth.uid()`). Peer Members, anonymous visitors, and signed-in non-owners cannot `SELECT` another Member's rows under any condition. The Member's awareness scope and subscription set are private — doxxing-prevention. If a future surface needs an aggregate ("how many Members opted into Sacramento as a place-interest?"), it lands as a named SECURITY DEFINER function — owner-only RLS + named-function aggregates is the standard posture for private geography substrates under ADR-21.

Backend services (recommendation engine, embedding pipeline) connect with the service-role key, bypass RLS, and compute over the full row set. Outputs to users are anonymized aggregates. **Per-Member identity never surfaces in a recommendation.**

**No addressability.** Per the anti-Nextdoor commitments in `policy.md` and `location.md`, no surface in the platform sends messages, posts, or any content to "Members with place-interest in X" or "Members with a saved-search matching Y." Place-interests are read by feed candidate generation in `discovery.md`; saved-searches are read by the fan-out worker. Neither is ever a *send-to* target.

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

**Open product question — re-claimable handles?** (surfaced by the T047 M2 code review on 2026-05-11; flagged here for `explore` to decide before the b2 `member.handle.set` surface scopes.) The composite PK `(member_id, handle)` permanently retires any handle a Member has used: an insert sequence of `alice → wonderland → alice` would PK-collide on the second `alice` entry. Two product options that need a call before this table accepts its first row:

- **(a) Permanently retired.** Keeps the composite PK. Encodes "your old handle is yours forever, even after you change away from it" — useful for identity-recovery and impersonation-prevention semantics. The b2 surface copy explains "you can't reuse a handle you've previously moved away from."
- **(b) Re-claimable.** Requires widening the PK to `(member_id, handle, changed_at)` or replacing it with a serial id. Encodes "you can come back to a name you used before." More UX-permissive; weakens the redirect-for-90-days guarantee if a Member re-claims a recently-retired handle.

The decision belongs to `explore` (UX + identity-recovery trade-offs are product calls), then `scope` ratifies, then the b2 ticket carries the schema change if needed. Because the b1 surface is placeholder-only (no surface, no write triggers — the action handler `member.handle.set` is T2), the table is empty until the b2 handler ships and PK shape can change up until that day.

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
  where revoked_at is null;
```

> **Note on the partial-index predicate (per T050 DEVIATIONS, 2026-05-17).** The predicate is `revoked_at is null` only — `expires_at` is filtered at *query time* by the action layer, not by the index. Postgres evaluates partial-index predicates at INSERT time using the constant value of `now()` at insert; a row inserted today with `expires_at = today + 1 day` would enter the index and remain in it after tomorrow's `now()` advances past `expires_at` (no implicit re-evaluation). The behavioral intent is "active = unrevoked AND unexpired"; the index narrows on the durable half (revocation), and `expires_at` is added to every `WHERE` clause that reads active Delegations.

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
- `member.place_interest_added` / `member.place_interest_removed` / `member.place_interest_promoted` / `member.place_interest_demoted` (per ADR-21)
- `member.saved_search.created` / `member.saved_search.updated` / `member.saved_search.removed` (per ADR-21)
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
- The first commercial Item composition (kind='product' or kind='service') prompts a kind='business' Group walkthrough that creates or joins a Group via `group.create` + `group.member_join` action handlers. This is not a mode-flip — it's the structural setup for the Group membership that henceforth carries the selling tools.
- The Item composer's `brand_label` field autosuggests from the Member's active business-Group `group_businesses.display_name` values.
- The Member's profile renders Group affiliations conditionally — present when explicit memberships exist, absent when none do, with per-membership visibility toggles (per the privacy controls).

### Integration with the action layer (per ADR-7)

Every write that touches a Member row goes through a named action handler. Initial handlers at b1:

- `member.create` — invoked by the Supabase Auth post-signup hook; creates the `members` row, the `member_privacy` row with defaults, fires `member.created`.
- `member.profile.update` — display name, bio, avatar, pronouns. Validates lengths, checks profanity on display name, fires `member.profile_updated`.
- `member.handle.set` — handle uniqueness check, profanity filter, writes to `members.handle`, fires `member.handle_changed`. **At b1: only invoked once per Member, at signup.** T2 surface allows updates.
- `member.privacy.update` — writes to `member_privacy`, fires `member.privacy_changed` with diff.
- `member.locality.set` — writes `home_location_id`, fires `member.home_location_set`.
- Selling-tools are not Member-level handlers. To start selling, a Member invokes `group.create` (kind='business') and `group.member_join` directly — composer flows wrap these but no Member-level state changes. To stop selling, the Member invokes `group.member_leave` for each owner-role business-Group membership (per `groups.md` lifecycle).
- `member.interests.add` / `member.interests.remove` — writes to `member_interests`, fires events.
- `member.follow` / `member.unfollow` — writes to `member_follows`, fires events.
- `member.place_interest.add` / `member.place_interest.remove` / `member.place_interest.promote` / `member.place_interest.demote` — writes to `member_place_interests` (per ADR-21). The add handler enforces the secondary-cap (≤5 per Member); the promote handler atomically demotes the previous `primary_home` row before promoting the target row, preserving the unique partial index. Rejects writes targeting another Member's rows.
- `member.saved_search.create` / `.update` / `.remove` — writes to `member_saved_searches` (per ADR-21). Validates the check constraint (≥1 of place_id, location_id, non-empty interest_tags). Rejects writes targeting another Member's rows. The fan-out worker is a b2 surface and does not ship at b1.
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
- `member_place_interests` SELECT: **owner-only at the row level (per ADR-21)** — `member_id = auth.uid()`. No peer-Member access, no anon access. Future cross-Member aggregates land as named SECURITY DEFINER functions.
- `member_place_interests` INSERT/UPDATE/DELETE: row-owner only, only via action handlers (`member.place_interest.*`).
- `member_saved_searches` SELECT: **owner-only at the row level (per ADR-21)** — `member_id = auth.uid()`. Saved-search labels carry Member intent and are private. Backend fan-out worker (b2) connects via service-role.
- `member_saved_searches` INSERT/UPDATE/DELETE: row-owner only, only via action handlers (`member.saved_search.*`).
- `member_messages` SELECT: only Members in the thread, and only if both Members share an active Community membership (b1 constraint; relaxed at b2).
- `member_messages` INSERT: thread participants only.
- `member_self_records` SELECT/UPDATE: row-owner only. **Never visible to other Members or their assistants. Never input to recommendation surfaces. Never trained on.** Per ADR-6 and ADR-9.
- `member_delegations` SELECT/UPDATE: row-owner only.

---

## Policy posture (per ADR-9)

Every privacy/revenue/data-sharing surface walks the three filters: helpful? harmless? abuse-resistant? The protective stance is the default; Members opt in to relax.

**Member discoverability — default `false` (T095 Ratified 2026-06-03; reverses the prior default-public stance).**
- Helpful: a Member's outputs (Items, Groups, public actions) are what's useful to other Members; the Member-as-person-to-search-for is a separate and rarer need that imports doxxing risk without imported loop value. Producers and organizers who want to be found get a one-time opt-in prompt on acquisition (see § Prompt-on-acquisition); they pick the timing of public exposure rather than receiving it as a default.
- Harmless: defaulting `is_discoverable = false` removes the Member from search, directory, autocomplete, handle-direct typing, and external indexing of `/m/[handle]`. The Member is not invisible to people who already know them — direct URLs still work subject to `profile_visibility`.
- Abuse-resistant: the platform never auto-flips the bit. Even when a Member acquires a kind='business' Group or a steward role, the prompt-on-acquisition surface offers the opt-in; Members tap to consent.

**Profile visibility — default `members_only` (T095 Ratified 2026-06-03; reverses the prior default-public stance).**
- Helpful: a Member who arrives via direct link from a friend should see a useful profile; signed-in viewers get the page. Anon viewers don't see anything (the `/m/[handle]` page returns 404 for non-public profiles to anon) — closing the casual reconnaissance vector at the same time as the discoverability bit.
- Harmless: signed-in-only access at the audience layer matches the "people who know each other" interaction model the platform encourages, and pairs with the discoverability bit to gate findability orthogonally — a Member who has set `profile_visibility = 'public'` but kept `is_discoverable = false` is viewable-by-URL but never indexed or listed.
- Abuse-resistant: the four-tier enum (`public` / `unlisted` / `members_only` / `private`) is the canonical surface — `private` is the strictest tier (signed-in viewers with the URL see a tombstone; anon gets 404 to avoid leaking handle existence). The platform never auto-reverts and never nags to make public.

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

**Selling tools — surfaced from Group / Item state, not from a Member-level toggle.**
- Helpful: selling surfaces (product / service composers, seller dashboard, Item-management views, bulletin compose) are present when the Member needs them — i.e., when they hold an active kind='business' Group membership or have created a kind='product' / 'service' Item. Showing those surfaces to every new Member would be noise; surfacing them on the act of selling is honest signal.
- Harmless: a Member who has not declared any commercial intent does not see the selling-related surfaces. There is no aggregation, no inferred commercial framing, no profile section that appears uninvited.
- Abuse-resistant: there is no Member-level mode to auto-flip. To start selling, the Member explicitly creates or joins a kind='business' Group (the action is declared, dated, ungameable per the Group event log). To stop selling, they end the owner-role membership; Items remain published per their own settings.

**Stakeholder visibility — default `private` (T3 surface, schema reserved at b1).**
- Helpful: at T3, the Stakeholder dashboard surfaces accumulated patterns (followers, repeat customers, market history). Some Members will want this visible to attract business; many won't.
- Harmless: defaulting private prevents the surface from ever embarrassing a Member who didn't realize what was being aggregated.
- Abuse-resistant: opt-in per Member, granular by surface, revocable. The schema enforces it at the column.

**Assistant Context (per ADR-6 and ADR-9) — never visible to other Members, never trained on, never feed input. Permanent commitments.**
- Per ADR-9, opt-ins for aggregate analysis (with k-anonymity floor N≥10), opt-in cross-Member sharing (granular, time-bounded), and opt-in feed-input *for the Member's own surface* are T2/T3 surfaces. Categorical refusal of feed input *for other Members* is permanent.

**Delegation scopes — confirmation-required for publish-tier; one-time monetary actions delegable only under the schema-enforced `bounded_purchase` scope. Per ADR-6 and ADR-9.**
- The `recurring_payment` opt-in (per ADR-9) lands at T2 with required caps, recipient allowlist, and required expiry.
- The `bounded_purchase` opt-in lands at T2 with required per-transaction and per-period caps, required `recipient_scope` (one or more of: `community_members`, `locality`, `specific_members`, `specific_groups`, `external_recipients`), required `category_scope`, required expiry, required reversibility window, and first-recipient confirmation defaulting on. See `agent-assistance.md` for the full scope shape and `payments.md` for the rail.

---

## Integration Points

**Connects to:**

- **Item** — every Item has a `member_id` author. Most Items have one Member; multi-Member co-creation (T2) adds `item_collaborators`.
- **Location** — Members have a soft `home_location_id` for locality default per ADR-4 (not an address). Per ADR-21, the six-kind `member_location_affinities` substrate is retired. A Member's relationship to specific Locations beyond home flows through Items they create (which attach to Locations), Groups they belong to (which anchor to Locations), and `member_saved_searches` rows scoped to a `location_id` (the "follow this venue" affordance — see the Saved searches section above).
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
- **Member interests** (`member_interests`) constrain the topical surface to terms an LLM can reason over. Combined with `member_place_interests` (per ADR-21), these power compositional queries like the Concerts-in-the-Park surface (per `use-cases.md` example #12) — a Member with `outdoor`+`live-music` interest tags and metro-scope opt-in sees gathering Items at parks across the Sacramento metro (gathered via the `metro_polygons` overlay per D3) through the community-awareness feed in `discovery.md`.
- **Reserved embedding column** — when the parallel `member_embeddings` table is built at T3, it indexes against `bio`, the Member's active Group `display_name` values, and the Member's `member_interests`.

The MVP serves structured-filter search (handle, display name lookup, Items by Member, Members in Community); T3 adds vector search across bios; T3 also surfaces the chat surface that resolves natural-language Member queries.

---

## Social capital

Members earn **social capital** through participation, helping others, contribution to their communities, hosting Gatherings, fulfilling Asks, sharing Offers, supporting Initiatives, and other prosocial actions on the platform. Social capital is earned (no way to purchase it), Member-owned (accrues to the Member, follows them across loops, portable through federation handoff per Loop 13), not a ranking signal that affects what other Members see (refusing the engagement-metric trap), and optionally surfaced (Members choose whether and how it appears on their profile). **Planned feature, design pending user ratification.** Schema, surfaces, and the prosocial-action taxonomy ship after the design is settled. The Member primitive is the anchor; the schema lands on this table or a sibling once the design is approved.

---

## What does not ship at b1

- Reviews of Members in their personal capacity (rating a Member as a person, separate from any commercial activity) are not a planned feature. Reviews tied to commercial activity — buyers reviewing producers/sellers/service-providers they bought from — are a **planned feature; design pending user ratification** (visibility model, anti-gaming, symbiosis, reciprocity all open). Social capital earned through participation is a **planned feature; design pending user ratification** (see "Social capital" below).
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
- **Initial interest vocabulary.** `member_interests.tag` is sized from the same controlled vocabulary as `item_tags`. The initial vocabulary list per Item kind is an open question on `b1-primitives-plan.md` (Open question: *Initial tag vocabulary per Item kind*). Member's initial interest options should be drawn from that list once it's sized.

---

## Comments

The Member primitive is the structural anchor of the entire platform. Every other primitive references it; every loop reads from or writes to it; every event row attributes work to it. Getting Member right at b1 is what lets the rest of the schema land cleanly.

The two most consequential commitments encoded here:

**One Member per real human, no role column, no Business shell.** The temptation will be to add a `role` enum on `members` (Maker, Service Provider, Community Founder, etc.) so feature flags and routing are easy. Don't. Roles are verbs the Member is doing, surfaced from Operations + Item activity. The moment a `role` column lands, the primitive collapses back into a directory-of-types and the people-first posture is gone. The same holds for any "is this a business" boolean: there is no Business entity in the schema, and a Member who runs a personal business is captured by their Operations, not by a flag.

**Schema reserved for the agent-assistance stack at b1, surface deferred.** The `member_self_records`, `member_delegations`, and the `acting_member_id` + `via_delegation_id` audit fields land at b1 even though no surface uses them. This is the single decision that prevents the b2/b3 agent-assistance work from becoming a multi-month retrofit. The cost at b1 is small — three tables, two columns on every event log row, no UI. The cost at b2 if skipped is rewriting every action handler and event row to retroactively populate the audit trail. The same logic applies that drove the event log itself: ship empty, fill later, never paint into a corner.

The deliberate refusal of a `role` column is the relational realization of `principles.md`. The deliberate substrate-at-b1 for Assistant Context and Delegation is the realization of ADR-6's "agent-friendly natively, not bolted on." The opt-out default across every privacy field is the realization of ADR-9's three-filter test. These three commitments do most of the long-term work; the rest of the spec is the surface that lets them ship.

## Decisions encoded here

This spec is the live home for the following architectural decisions. See [`../../playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) for the cross-cutting register; the entries below are the single-system decisions whose status banner in this file *is* the load-bearing ratification.

| ADR | Status | What lives here |
|---|---|---|
This spec *encodes* (but does not own) ADR-4 (locality default), ADR-6 (Assistant Context + Delegation substrate at b1), ADR-7 (action layer), ADR-9 (opt-out privacy defaults), ADR-15 (auth.users coupling — `members.id = auth.users.id` and the post-signup trigger pattern), and ADR-21 (Member↔Geography substrate split — the `member_place_interests` and `member_saved_searches` sections + their RLS entries above are the load-bearing surfaces; the owner-only-RLS posture belongs to ADR-21 outright; jurisdiction lives in `business-jurisdiction.md`; Locally Made provenance lives in `item.md`). Those live cross-cutting in `DECISIONS.md`.
