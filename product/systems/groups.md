# System: Group

**Status:** **Approved 2026-05-10** — ratified by PM. The Community / Member Operations / Cooperative split is retired in favor of this single spine + child architecture. Predecessor specs ([`community.md`](archive/community.md), [`member-operations.md`](archive/member-operations.md), [`cooperative.md`](archive/cooperative.md)) were archived 2026-05-11 — content preserved in `systems/archive/` for historical reference. ADR-13 is pending formal write-up; this status line is the load-bearing ratification until then.

**Purpose:** Establish Group as the platform's primitive for *people organized to do things together on the platform*. Replaces the Community / Cooperative / Business distinctions fragmented across separate specs (and a Member Operations primitive that duplicated multi-Person commercial relationships) with a single spine + child architecture, mirroring [`item.md`](item.md)'s pattern. The platform's grammar becomes: **People form Groups to do things using Items, attached to Locations.** Some Groups affiliate — a Run Club, school parents, a family. Some Groups operate — Maya's bakery, a partnership, an auto shop. All are people, never persons.

**Bundles:** b1 (T1 — affiliate kinds + business kind, full surface).

**Companion specs:** [`primitives.md`](../foundation/primitives.md) · [`item.md`](item.md) · [`member.md`](member.md) · [`location.md`](location.md) · [`policy-framework.md`](../foundation/policy-framework.md)

**Retires (ratification 2026-05-10, archived 2026-05-11):** [`archive/community.md`](archive/community.md) · [`archive/member-operations.md`](archive/member-operations.md) · [`archive/cooperative.md`](archive/cooperative.md). Predecessors now live in `systems/archive/`; do not cite as live — use this spec.

**Deferred indefinitely:** Cooperative-style coordination (co-owning, voting, distributing) involves verbs that happen *off-platform* — securities filings, formal votes, distribution checks, governance under operating agreements. The platform's role re those verbs is not yet well-understood, and shipping schema for them now risks painting into a corner. The `cooperative.md` spec is retired (above); the *concept* is reserved for a future version when the platform's relationship to off-platform legal coordination has clarified. No `cooperative_cohort` Item kind, no `cooperatives` table, no `cooperative_*_events` table at b1 — the prior ADR-11 schema reservations are dropped from the migration plan.

**Decisions encoded (ADR-13 pending formal write-up):** supersedes ADR-11 (cooperative is neither a separate entity nor a Group kind — it's deferred entirely; schema reservations dropped), fully supersedes ADR-8 (Member Operations primitive dies — sole-prop case is a kind='business' Group of one), reinterprets ADR-12 (Maker mode toggle now applies to Groups, not Operations).

**North stars served:** Family 1 (Gather) and Family 2 (Share) by affiliate kinds. Family 3 (Trade) by business kind, plus by no-Group one-off sales.

> Map to numbered north stars from `product/foundation/north-stars.md` before scenario approval.

---

## What a Group is

A Group is a set of People organized around something on the platform. The "something" varies — shared place, shared interest, shared practice, shared event, shared household, shared commercial operation. The shape varies with the something. The fact that it is **people, not a person**, does not.

This is the platform's structural refusal of corporate personhood. US law treats LLCs, corporations, and cooperatives as legal persons that can own property, sign contracts, and outlive their human members. The platform does not. Items always belong to Members. Money flows Member-to-Member directly. A Group cannot sign, own, be delegated to, or outlive its last Member.

The Group primitive lets the platform represent how people actually organize — partnerships of equals, families, run clubs, neighborhood associations, sole proprietors — without modeling them as the corporate shells US law would impose.

## What the platform drives versus what it records

A structural commitment, parallel to the no-personhood guarantees:

- **The platform drives on-platform verbs.** Affiliating, operating, posting, gathering, following, selling, hosting — these happen *here*, with the platform as their record and surface.
- **The platform may record off-platform facts.** A Group operating as an LLC can declare that fact — `group_businesses.legal_entity_kind = 'llc'` — and the platform mirrors it. The platform doesn't drive the LLC formation; it acknowledges it.
- **The platform never moves money, never files paperwork, never commits a vote.** Action handlers reject any write that would simulate an off-platform action. Off-platform facts arrive as Member-recorded statements about the world, not as platform-driven processes.

This commitment is what keeps the deferred cooperative-coordination pattern out of the spec for now. Co-owning, voting, distributing are off-platform verbs. The platform isn't ready to mirror them; until the relationship is clarified, they're not modeled.

## On-platform verbs

**Affiliate** — community kinds (place, interest, practice, event_anchored, family). Members gather, share, follow, attend, host.

**Operate** — business kind. Members make, sell, serve, host commercially, work.

That's the verb set. Six kinds. Two verb-families. The kinds are defined by what people *do* in them.

## Group kinds

**Community kinds** — affiliate verbs:

- `place` — anchored to a geographic Location, oriented to where members live or spend time. *West Sac school parents.*
- `interest` — affinity-based, optional Location anchor. *Sacramento sourdough exchange.*
- `practice` — recurring vocation or shared craft. *Sacramento dog walkers.*
- `event_anchored` — born from a recurring Gathering Item, references it. *Folsom Thursday Run Club.*
- `family` — a household or extended family, typically `discoverability='private'`.

**Business kind** — operate verbs:

- `business` — one or more Members operating commercially together. At least one Member holds the structural-responsibility role of `owner`. Other Members may operate alongside (additional `owner` memberships for partnerships) or under direction (`staff`). Sole proprietors are kind='business' Groups of one. The platform does not differentiate by Member count — a Group of one and a Group of three render the same shape; the vendor describes themselves as they want.

The kind enum is extensible. Future candidates if real cases warrant: `nonprofit`, `mutual_aid`, `worker_collective` — not in scope at b1.

## Roles per kind

| Kind | Valid roles |
|---|---|
| `place`, `interest`, `practice`, `event_anchored`, `family` | `member`, `steward` |
| `business` | `owner`, `member` |

The `member` role is shared across kinds with kind-contextual meaning: in affiliate kinds it means "affiliated with this group"; in Business it means "works in this operation under the operating owner." The action layer enforces kind-specific validity; the same string carries different semantics depending on the Group's kind.

Structural rules:

- Every kind='business' Group has ≥1 active membership with role='owner'.
- **The founder is the operating owner for kind='business' Groups, immutably.** Operating-ownership is not a transferable role — it's a property of the Group's identity, set at creation as `groups.founder_member_id` and never changed. The operating owner is the routine point of authority for functionality writes (display_name edits, member confirmations, dissolution). They are computed at runtime as the membership where `member_id = groups.founder_member_id AND role = 'owner' AND left_at IS NULL`; if no such membership exists, the Group has no operating owner and is in a broken state (dormancy).
- **No transfer of operating-ownership.** If a different Member should run this commercial operation, they form a new Group with themselves as founder. The old Group ends; the new Group begins. Continuity (if any) is claimed via `established_on`. This pattern mirrors the no-kind-transitions rule: change of fundamental identity = new Group, not in-place mutation.
- **Multiple owners are supported via multiple owner-role memberships.** A partnership of three is three Members with role='owner' — but only the founder has operating-owner authority. Other owners are co-equal in ownership but defer to the founder for routine functionality writes. This is a deliberate constraint that keeps partnerships from forking on the first disagreement; partners who can't accept it should form their own Groups instead.
- Communities require no leadership role; if all stewards leave, the Group becomes dormant per the lifecycle rules.

A Member can hold any role across multiple Groups simultaneously.

**Forward-looking — permissions decomposition.** Roles at b1 are fixed bundles of permissions, enforced in the action layer (per ADR-7) rather than by check constraint. A future direction (not b1) is decomposing roles into a permissions table — `group_role_permissions(kind, role, permission)` for the role-default bundle, plus optional `group_member_permissions(group_id, member_id, permission)` for per-Member overrides. This would allow custom roles like *manager* or *kitchen lead*, and granular per-Member adjustments (the long-trusted staff Member granted Item-edit rights), without expanding the role enum or migrating existing rows. The change is purely additive: the `role` column stays; new permission tables join on it. Flagged as open question for when real custom-role cases surface.

## Selling, with or without a Group

Not every commercial transaction requires a Group. Three modes at b1, one forward-looking mode for later.

**One-off sale** — A Member posts a product Item with no Group. Photo, description, price, location. Item lifecycle: `active → fulfilled` (or `withdrawn`). The garage-sale shape, the single-loaf-of-sourdough shape, the I-don't-know-if-I'm-doing-this-again shape. `items.group_id = null`. No Maker mode, no standing tier.

**Ongoing commercial** — A Member operates through a kind='business' Group. Items have `group_id` set. The Group page is the storefront. Standing tier, agent context, full Maker affordances per the reinterpreted ADR-12.

**Selling on behalf of others (future, not b1)** — A Member sells things owned by other Members. Garage-sale-for-someone-else, estate-sale-for-a-neighbor, kid-selling-mom's-art. Probably warrants its own Item kind (`kind='consignment'`) with separate seller-Member and owner-Member fields. Flag for forward design; don't model now.

The composer's pivotal question, at the moment of first commercial Item creation: **"Is this a one-time sale, or part of something you're planning to keep doing?"** Answer determines whether the "Become a Maker" CTA fires. Most people posting one thing for sale aren't starting a business; the platform shouldn't make them feel like they are.

This honors how people actually start. Maya selling a single loaf at the church bake sale is one Item with no Group. Maya deciding she wants to do this regularly creates a Group at that moment. The Group is the *commitment* surface; the Item is always available without it.

## Lifecycle per kind

**Universal dormancy timing.** All kinds use a **90-day dormancy window** before dissolution, with **member-extension** available. Life gets messy; the platform should accommodate that without forcing busywork or dissolving Groups whose people are temporarily occupied.

When a Group enters dormancy, `groups.dormant_at = now()` and `groups.dissolves_at = now() + interval '90 days'` are set in the same transaction. The Group becomes invisible in promoted surfaces and search defaults. Founder and any remaining members are notified. At any point during dormancy, anyone with an active or recent membership in the Group (or the founder, if not a current member) can call `group.extend_dormancy`, pushing `dissolves_at` out by another 90 days. No cap on extensions — trust the participants. If `dissolves_at` is reached without revival, the Group dissolves; Items lose `group_id`; memberships archive.

**Triggers per kind:**

- **Community kinds** (place, interest, practice, event_anchored, family): Group enters dormancy when zero `explicit` memberships have existed for 90 days (the long inactivity tail), or when the last steward leaves a Group with no other active stewards.
- **Business kind:** Group enters dormancy *immediately* when the founder ends their owner-role membership, regardless of how many other owners remain. The Group's identity is bound to its founder; without them, it cannot continue as the same operation. Other owners (partners) can extend dormancy with `group.extend_dormancy`, buying time. **Only the founder can revive** — by rejoining as owner via `group.member_join`. Other owners cannot replace the founder; if they want to continue operating, they form new Groups with themselves as founder, claiming `established_on` continuity if appropriate.

**Off-platform legal entity persistence.** When `group_businesses.legal_entity_kind` is non-null (the Group reflects a real-world LLC, partnership filing, etc.) AND the founder remains an active owner, the Group does not auto-dormant on activity-inactivity. It persists until the off-platform entity is recorded as dissolved via `group.dissolve`. The founder-leaves trigger still applies — a registered LLC whose founder departs the platform still goes dormant.

**Revival.** While dormant, a Group can be revived by `group.revive`, which clears `dormant_at` and `dissolves_at` and restores visibility. For community kinds, revival authority lives with active or recent (within 12 months) members. For Business kinds, revival authority lives with the founder only — no other Member can revive a dormant Business, since they cannot become its operating owner.

## No kind transitions

Groups do not change kind. If a Member pivots — a Run Club's organizers decide to formalize as a registered LLC, a bakery decides to convert to a non-commercial baking-class series — they end the current Group and create a new one of the new kind. This is simpler than maintaining a transition machinery with role-mapping rules and audit semantics for every kind pair. Items lose their `group_id` when the source Group dissolves; the Member can re-file Items under the new Group at their discretion.

**Items posted by departed Members stay filed under the Group.** When a Member ends their membership, any Items they previously posted with this Group's `group_id` keep that filing. The Items still belong to the Member (`items.member_id`), and the Member can edit or withdraw them at any time as their own Items, but the Group's record honors the historical commerce. This means the Group page may surface Items by ex-members; that's the honest history. Items only lose their `group_id` when the Group itself dissolves.

**Continuity across pivots: the `established_on` field.** A Member starting a new Group that continues an earlier effort can self-report `established_on` to claim the historical date — Maya's new "Oak Park Sourdough" Group can carry `established_on = '2020-01-01'` even if `created_at` is much later. The platform doesn't verify this; it's the Member's claim, displayed honestly alongside the actual `created_at` if the user cares to see both. This gives the affordance of continuity without requiring schema-level Group-lineage links the platform would have to enforce and the Member would have to navigate.

**Continuity of reputation: travels with the Member, not the Group.** Member-level reputation, ratings, endorsements, and accumulated social capital are anchored to the Member primitive — not the Group. When Maya's Oak Park Sourdough dissolves and she starts a new Group, whatever recognition she's accumulated as Maya travels with her. This is a forward-looking commitment of the platform's design space, not a b1 deliverable: a future reputation/rating system (community-member rating, customer-happiness rating, endorsement graph) will key on `members.id` rather than `groups.id`. Groups are commercial-shape coordination; reputation is a social-shape commitment from one Person to another.

## Standing-tier gate

`member_has_standing_presence` view returns TRUE for a Member when:
- They have ≥1 active membership in a kind='business' Group, **OR**
- They have a `role='steward'` membership in any non-business Group.

Replaces both `member.maker_signal` (ADR-3, deprecated) and the prior Operations-derived `member_has_standing_presence` (ADR-8, fully superseded by this spec). Assistant Context affordance prominence, agent context tier, and Skill subscription affordance read this view.

A Member with only one-off sale Items has no standing tier — correctly.

## Maker mode (ADR-12, reinterpreted)

`members.maker_mode_enabled` toggle still applies. Reinterpreted:

- Default `false` for new Members.
- Set to `true` when the Member completes the "Become a Maker" CTA, which now creates or joins a kind='business' Group (with the Member as sole owner-role membership for first-time use).
- Toggle off pauses storefront / composer / Maker-section surfaces from the Member's own UX. The Group itself doesn't pause — public page persists, other Members aren't affected.
- Toggle on restores surfaces immediately.

Maker mode is a personal-UX toggle. Group lifecycle is a separate concern. They were always layered; this just makes the layering explicit.

## Spine + child data model

Mirrors `item.md`'s pattern. One spine, kind-specific child tables for kinds that need extra structure.

**The spine — `groups`:**

```sql
create table groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  kind text not null check (kind in (
    'place','interest','practice','event_anchored','family','business'
  )),
  anchor_location_id uuid references locations(id) on delete set null,
  parent_group_id uuid references groups(id) on delete set null,
  founder_member_id uuid not null references members(id),
  description text not null,
  discoverability text not null default 'listed'
    check (discoverability in ('listed','unlisted','private')),
  metadata jsonb not null default '{}',
  established_on date,             -- self-reported establishment date; nullable
                                   -- defaults to created_at for display when null
  created_at timestamptz not null default now(),
  dormant_at timestamptz,           -- when entered dormancy (null otherwise)
  dissolves_at timestamptz,         -- scheduled dissolution time during dormancy
  dissolved_at timestamptz
);

create index idx_groups_anchor on groups (anchor_location_id) where dissolved_at is null;
create index idx_groups_parent on groups (parent_group_id) where dissolved_at is null;
create index idx_groups_kind on groups (kind) where dissolved_at is null;
```

**Kind-specific child table** (1:1 with `groups` where `groups.kind='business'`; FK = `group_id`):

- `group_businesses` — `group_id` PK FK, `display_name` (the brand label — Maya's "Oak Park Sourdough"), `public_description` (storefront copy), `legal_entity_kind` (nullable enum: `llc`, `sole_prop`, `partnership`, `other`), `state_of_formation` (nullable), `formed_at` (nullable). No `ownership_locality` column — locality is derivable from owner Member Locations vs. the Group's `anchor_location_id` and computed at query time (see Locality and promotion).
- `group_event_anchored` — `group_id` PK FK, `seeded_by_item_id` (FK to `items.id`, nullable). Promoted out of `metadata` JSONB because it's load-bearing for kind='event_anchored' Groups specifically. Leaves room to add more event-specific fields (recurrence reference, founding-event date) without spine churn.

Community kinds other than `event_anchored` use the spine only; no child table.

**Memberships — `group_memberships`:**

```sql
create table group_memberships (
  group_id uuid not null references groups(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  role text not null,  -- validated per-kind in the action layer
  source text not null default 'explicit'
    check (source in ('explicit','soft_via_follow','soft_via_attendance')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  confirmed_by_member_id uuid references members(id),
  confirmed_at timestamptz,
  primary key (group_id, member_id)
);

create index idx_memberships_member_active on group_memberships (member_id, group_id)
  where left_at is null and source = 'explicit';
create index idx_memberships_role on group_memberships (group_id, role)
  where left_at is null;
```

Role validation per kind is enforced in the action layer (per ADR-7), not by check constraint, because the valid set varies by `groups.kind`. The handler reads kind first, validates role, then writes.

`source = 'soft_via_*'` is valid only for community kinds. The action layer rejects soft-source memberships for the business kind.

**Item integration:**

- `items.group_id` (nullable FK to `groups.id`) — replaces `items.community_id`. Set when the Item is filed under a Group; null for one-off sales and non-commercial Items.
- `items.brand_label` retires. The brand label is `group_businesses.display_name` when `items.group_id` references a kind='business' Group.

**Location integration (brand precedence):**

- A kind='business' Group may anchor to a Location via `groups.anchor_location_id`. The Location renders the Group's storefront affordances on its public page.
- Brand label precedence on the Location page: `group_businesses.display_name` (canonical when an anchored Group exists) wins over `locations.brand_label` (the Location-level fallback for places without a Group anchor — e.g., Drake's the bar). Per [`location.md`](location.md), `locations.brand_label` is denormalized to power resolve-up rendering when no Group is anchored; the Location page renderer must check Group first, then fall back.

**Event log entries (required at b1):** `group.created`, `group.member_joined`, `group.member_left`, `group.role_changed`, `group.steward_transferred`, `group.dormant`, `group.dormancy_extended`, `group.revived`, `group.dissolved`. Append-only, partitioned monthly per ADR-10. Audit fields per ADR-6.

**Action handlers (per ADR-7):** `group.create`, `group.member_join`, `group.member_leave`, `group.role_change`, `group.steward_transfer` (community kinds only), `group.confirm_membership` (b2 — for member confirmation in business kind), `group.extend_dormancy`, `group.revive`, `group.dissolve`. The action layer enforces the structural rules:
- ≥1 active owner for kind='business' Groups; the operating owner is the founder while their owner-role membership remains active.
- Members control their own membership: writes to other Members' rows are rejected, except the operating owner of a kind='business' Group may end a member-role (staff) membership.
- Routine functionality writes (display_name, public_description, member confirmations, dissolution) on a kind='business' Group require the operating owner.
- `group.extend_dormancy` requires the caller to have an active or recent (within last 12 months) membership in the Group; pushes `dissolves_at` forward by 90 days; no cap on extensions. The founder retains no special authority post-leaving — their "recent membership" qualifies them like any other ex-member, but historical-founder-status alone does not.
- `group.revive` for a dormant kind='business' Group can only be performed by the founder, by re-joining as owner. Other owners' presence does not unblock revival because operating-ownership is the founder's permanently. If the founder doesn't return within dormancy, dissolution is inevitable; remaining owners can extend the dormancy window but cannot continue the Group themselves — they form new Groups if they want to operate.

## Locality and promotion

The platform promotes locally owned and operated Business Groups. Locality is derivable, not stored — the `ownership_locality` enum approach was the wrong shape because "locality" is a property of *who owns this Group's location*, not a label on the Group itself.

**The rule.** A kind='business' Group is locally owned and operated when **at least one owner Member is local to the Group's `anchor_location_id`** — i.e., the Member holds a `lives` or `works` affinity on a Location in proximity (same metro, or roughly within a 30-minute drive). The concrete proximity threshold is spec'd at index time, likely `as the crow flies` distance for query simplicity, calibrated against real Sacramento-area distances.

**Access path (per ADR-16).** The derivation reads `member_location_affinities` indirectly through `public.member_is_local_to_location(member_id uuid, location_id uuid) returns boolean` — a `SECURITY DEFINER` function that reads `lives` and `works` rows internally and returns a boolean. **No spec, surface, or query JOINs against `member_location_affinities` directly.** The underlying rows are owner-only at the RLS layer; this function is the only authorized path. Reference shape:

```sql
-- Pseudocode for the locality test on a kind='business' Group.
select exists (
  select 1
  from group_memberships gm
  where gm.group_id = $group_id
    and gm.role = 'owner'
    and gm.ended_at is null
    and public.member_is_local_to_location(gm.member_id, $anchor_location_id)
);
```

The function is public-callable (no auth required); the platform's locality-promotion surfaces invoke it from query-time computation. A set-returning variant (`members_local_to_area(area)`) can land at T2+ if the per-call cost becomes hot.

**Computed at query time.** Locality is dynamic. If Maya owns Oak Park Sourdough (anchor: Oak Park) and lives in Oak Park, the Group is locally owned. If Maya moves to Phoenix, the Group is no longer locally owned — the wealth created here now flows out of the community. The platform recomputes locality on every Member Location change; no stored field to drift out of sync.

**Multi-location operations require multiple Groups.** Bob owning two McDonald's franchises is two separate Groups, each with Bob as an owner-role membership. The Citrus Heights Group has Bob's Citrus Heights Location near its anchor (locally owned). The Roseville Group does not (Bob's Citrus Heights Location is not in proximity to the Roseville anchor). The platform promotes the first, not the second. This is the franchise pattern: each operating location stands on its own ownership-locality test.

**Promotion semantics** (b2+ surface): Groups passing the locality test get prominence in the locality-first index, surface in "locally owned" filters and badges, and rank higher in proximity-sorted browse. Groups failing the test still appear when explicitly searched but don't get promotional weight. The Buy Close north star is structural here: the platform's index makes the local-money-stays-local distinction visible.

**Edge cases:**
- Owner has no public Location set → the Group's locality is unknown for that owner; falls through to other owners (if any). If no owner has a Location, the Group is not promoted.
- Group anchor is an `area` Location (a polygon, not a point) → proximity test runs against the area's representative point or boundary; spec'd at index time.
- Multiple owners with different Locations → as long as ≥1 is in proximity, the test passes (the Group has at least one local owner).
- Owner moves out of metro → recompute on next Location change; promotion drops.

## Discoverability and visibility

`listed` / `unlisted` / `private` per Group. Detailed UX deferred. Working defaults:

- Community kinds: default `listed`, except `family` defaults `private`.
- Business: default `listed` for ongoing commercial. (One-off sellers don't have a Group.)

`listed` / `unlisted` / `private` semantics get fully spec'd when the storefront UX is designed.

## No-personhood guarantees, encoded structurally

Schema-level, not policy-level:

- `items.member_id` is NOT NULL. Items always belong to Members. `items.group_id` is the optional filing surface only.
- No `group_assets` table. The platform does not custody capital, hold title, or mirror financial flows. Money flows Member-to-Member directly.
- Groups cannot be the target of a Delegation (per ADR-6). Only Members can grant or hold Delegations.
- Groups dissolve when their Members leave (community kinds, or business kinds without an off-platform legal entity) or when an off-platform legal entity is recorded as dissolved.
- The action layer (ADR-7) rejects any write attempting to set Item ownership to a Group, Group-to-Group ownership, or any other corporate-shell-shaped relationship.

## Policy posture

Per [`policy-framework.md`](../foundation/policy-framework.md):

**Default:** Members are not auto-assigned to Groups. The platform never enrolls based on geography, follow graph, or attendance. Joining is always explicit; the platform may *suggest* a Group based on follows or attendance (`source='soft_via_follow'`, `'soft_via_attendance'`) but those are surface-level only and do not grant addressability.

**Three-filter analysis:**
1. *Helpful?* Yes — Groups give Members a way to recognize themselves as part of something larger, do work together, and let neighbors find them as units.
2. *Harms others?* No — joining a Group makes the Member visible as part of it; it does not impose obligations on anyone else. `staff` declarations require owner confirmation (b2) to prevent false claims.
3. *Abusable?* Limited surface area. Vectors: (a) false `staff` claims to ride on a Group's reputation — mitigated by confirmation flows; (b) public discovery of `family`-kind Groups exposing personal-life details — mitigated by `family` defaulting to `private`.

## What does not ship at b1

- Cooperative-style coordination (co-owning, voting, distributing) — deferred indefinitely; not in scope.
- Stewardship rotation algorithms — b2.
- Group feed / discussion surfaces — b2.
- Confirmation flows for `member` claims in business kind — schema reserves `confirmed_by_member_id` / `confirmed_at`; surface at b2.
- Locality promotion surface (badges, filters, ranking weight) — locality is computed at b1 for index purposes but the user-facing promotion UX ships at b2.
- Algorithmic Group recommendations beyond geographic and follow-graph suggestion. We do not build a Group discovery feed.

What ships at b1: the spine, the `group_businesses` child table (full), the membership table with role-per-kind validation, item integration (`items.group_id` rename + `brand_label` retirement), the standing-tier view, lifecycle / dormancy infrastructure, event log entries, action handlers.

## Integration points

- **Member** — Members hold zero or many Group memberships. Standing tier reads from `member_has_standing_presence`.
- **Item** — Items optionally file under a Group via `items.group_id`. Items always belong to their Member, never to the Group.
- **Location** — Groups optionally anchor to a Location. Locations have no members; if you want members, you need a Group.
- **Operation (retiring)** — Member Operations are absorbed into Group memberships. The remaining "personal commercial capacity" use case is covered by sole-prop Groups (a kind='business' Group of one with the Member as owner). The `member_operations` table retires once the migration completes.
- **Delegation** (b2+) — `staff_edit_items` Delegation scope from Group owner to Group staff member.
- **Action layer** (ADR-7) — every Group write goes through a named handler.
- **Event log** (ADR-6) — every Group event row carries `acting_member_id` + `via_delegation_id`.

## Open questions

1. **One-off sale Item kind.** The "one-time sale" path uses `kind='product'`. Does it warrant a separate kind (`kind='listing'` for one-offs)? Probably no — the lifecycle distinguishes them. Confirm with first canonical examples.
2. **Reputation / rating system as a future Member-level surface.** Member-level recognition (community-member rating, customer-happiness rating, endorsement graph) is anchored on the Member primitive and travels with the Member across Group endings. Schema commitment: any future ratings/endorsements table keys on `members.id`, not `groups.id`. Not modeled at b1; the platform's design space stays open.
3. **Selling on behalf of others.** When does this graduate from "future shape" to "ship it"? Likely when the first canonical example demands it. Not b1.
4. **Side-hustle UX.** Same data shape, different rendering. The platform doesn't store a `commitment_level` flag — vendors describe themselves however they want. Open whether the composer needs a lower-friction variant for side hustles, or whether posting cadence + Item count + the Group's self-description carry it. Likely UX research at b2.
5. **Naming.** "Group" reads naturally as the data-model term and pairs with the existing public-facing "group" copy. Stick with "Group" unless usability data argues otherwise. UX language adapts per kind ("my bakery," "the Run Club," "school parents") — kind-appropriate copy throughout.
6. **Discoverability defaults.** `family` defaults `private`. Business default `listed` is right for ongoing commercial, but the platform may want `unlisted` for solo-prep-stage Groups. Defer the UX flow design.
7. **Confirmation requirements.** Business `member` claims need owner confirmation to prevent false claims. b1 ships claim with `confirmed_at = null`; b2 ships the confirmation surface. Confirm before b2 design.
8. **Locality proximity threshold.** Working answer: same metro / ~30-minute drive / "as the crow flies" distance. Concrete number TBD at index time — likely 25–50 miles for the Sacramento area. Confirm with first canonical examples.
9. **Permissions decomposition.** Today roles are fixed bundles enforced in the action layer. Future direction: `group_role_permissions(kind, role, permission)` + `group_member_permissions(group_id, member_id, permission)` for per-Member overrides. Enables custom roles (manager, kitchen lead) and granular per-Member adjustments without role-enum churn. Not b1; flagged here so it isn't forgotten.
10. **Migration mapping from `member_operations`.** Each existing row maps to a Group + membership pair:
    - `sole_personal` / `side_personal` → kind='business' Group of one, founder=Member, role='owner'.
    - `partner` → kind='business' Group with the earliest-declared partner as founder; other partners as additional role='owner' memberships. The founder's role as operating owner is permanent under the new model; if real partnerships need a different lead, they form new Groups.
    - `cooperative_member` → no migration target; cooperative coordination is deferred. Existing rows archive in place pending the eventual cooperative spec.
    - `staff` → kind='business' Group membership, role='member' (renamed from `staff`). The `operating_for_member_id` Person-to-Person link retires; the linked operator becomes the Group's founder/owner.
    - `volunteer_organizer` → steward role on the relevant non-business Group (often kind='event_anchored' from a recurring Gathering Item).
    The migration ticket sequence needs careful design — flagged for `notes/migration-to-primitives.md` revision.

## Comments

This spec is the consolidation step that follows from "everything is a primitive." `item.md` did this for things-being-declared. `groups.md` does it for people-organized-around-something on the platform. The fragmentation of Community / Cooperative / Business across separate specs and a Member Operations primitive was the symptom of premature differentiation — calling out kinds as separate systems before recognizing they shared a spine.

The spine + child architecture is the key compromise. Communities don't need everything Businesses need (display name, legal entity attributes, ownership locality). One table forces JSONB for everything; many tables fragment cross-kind queries; spine + child gives strong typing per kind without sacrificing the cross-kind reads.

The structural refusal of corporate personhood is encoded throughout. Items always FK to Members. Money flows Member-to-Member directly. Groups can't sign or own. They dissolve when their people leave. This is what keeps the platform faithful to the people-first commitment when the schema gets stressed at scale.

The on-platform-vs-off-platform line is the second structural commitment. The platform's verbs are what *happens here*. Off-platform legal coordination — cooperative governance, voting, distributions, securities filings — is a separate concern that the platform isn't yet ready to mirror. Deferring cooperative-style coordination indefinitely is the right call: when the day comes that the platform's relationship to off-platform legal coordination has clarified, the spec can extend with new kinds, new child tables, and new event types without disturbing the affiliate / operate spine that ships now.

The composer's "one-time, or ongoing?" question is the friction-asymmetric path that honors how people actually start. Most first-time sellers are not starting businesses. The platform that makes them feel like they are will turn them away. The platform that lets them sell their loaf, and offers — but does not impose — the path to a Group when they decide to keep doing it, will keep the door open without forcing a costume.

Operations as a primitive dies in this consolidation. Its purpose was to capture *what commercial work a Member is doing and in what capacity* without modeling Businesses. Once the platform admits that "what work is being done" is best modeled as **the Group the Member is operating through**, Operations becomes redundant. The Group is the answer to "what commercial work, in what shape, with whom, under whose responsibility." Operations was answering the same question with weaker tools.

The Group of one is the same shape as the partnership of three or the bakery-with-members. The platform does not differentiate by Member count. The granularity that matters for Buy Close is not how many people own the operation but where the money goes — and the locality test makes that visible structurally: an owner Member's current Location vs. the Group's anchor Location is the live signal of whether wealth created here stays here. When an owner moves away, the Group stops being locally owned, the platform stops promoting it, and the system honestly reflects what's happened: the wealth this operation generates now flows out of the community.

## Decisions encoded here

This spec is the live home for the following architectural decisions. See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register; the entries below are the single-system decisions whose status banner in this file *is* the load-bearing ratification (until ADR-13 is written).

| ADR | Status | What lives here |
|---|---|---|
| ADR-8 | **SUPERSEDED** 2026-05-10 | The `member_operations` primitive retires. Capacities (sole-prop / partner / staff / cooperative-member / volunteer-organizer) are absorbed into kind='business' Group memberships with role-per-kind. Standing-tier gate `member_has_standing_presence` redefined here: ≥1 active membership in kind='business' Group OR steward-role membership in any non-business Group. Historical text in [`../../planning/archive/DECISIONS-superseded-2026-05-10.md`](../../planning/archive/DECISIONS-superseded-2026-05-10.md). |
| ADR-11 | **SUPERSEDED** 2026-05-10 | Cooperative-style coordination (co-owning, voting, distributing) **deferred indefinitely**. No `cooperatives` / `cooperative_assets` tables, no `cooperative_cohort` Item kind, no `pledge_intent` response_kind. Cooperative-shape use case ships at b1 as kind='business' Group with multiple owner-role memberships. Historical text in [`../../planning/archive/DECISIONS-superseded-2026-05-10.md`](../../planning/archive/DECISIONS-superseded-2026-05-10.md). |
| ADR-13 | **Pending formal write-up** — this status banner is the ratification | Group consolidation. Community / Member Operations / Cooperative absorbed into one Group primitive with spine + child architecture and six kinds at b1: five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) + one operate (`business`). |

This spec also reinterprets ADR-12 (Maker mode): the "Become a Maker" CTA now creates/joins a kind='business' Group rather than declaring an Operation. The live home of ADR-12 is [`member.md`](member.md).

This spec also *encodes* (but does not own) ADR-16 (per-row privacy on `member_location_affinities`): the locality-promotion derivation in the **Locality and promotion** section above is the load-bearing surface — it calls `public.member_is_local_to_location()` rather than JOINing against `member_location_affinities` directly. ADR-16 lives cross-cutting in [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md).
