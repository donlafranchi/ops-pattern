# System: Community

> **🚨 RETIRING (2026-05-10) — superseded by [`groups.md`](groups.md).**
>
> The Community primitive is absorbed into the Group spine + child architecture. The five community kinds defined here (`place`, `interest`, `practice`, `event_anchored`, `family`) become Group kinds with the same names. Memberships move from `community_memberships` to `group_memberships`. Items reference Groups via `items.group_id` (replaces `items.community_id`).
>
> **Why.** Community, Member Operations, and Cooperative were three separate primitives that all answered the same question — "how does the platform record people organized to do things together?" Groups consolidates them into one spine with kind-specific child tables, mirroring the Item primitive. See `groups.md` for the unified model.
>
> **What still applies from this doc.** The conceptual content (what a Community is, why it's emergent / not auto-assigned, the policy posture, the soft-affiliation semantics) all carries forward — read it as describing the affiliate kinds of Group. The data model sections are obsolete; use `groups.md`'s schema instead.
>
> **Status of this file.** Stays in tree as historical reference until the migration plan rewrite folds the absorption into Phase 1 schema. Do not extend or cite as the live spec. Cross-references in `member.md`, `b1-primitives.md`, and `notes/migration-to-primitives.md` will be re-pointed during the migration plan rewrite.

**Status:** RETIRING — see banner above. Original status: Foundational primitive at b1 (lightweight). Pairs with [`primitives.md`](../foundation/primitives.md). Distinct from Location.

**Bundles:** b1 (T1 lightweight), b2 (T2 — posting, stewardship rotation, fund linkage), b3 (T3 — Loop 11/12 capital and steward surfaces, federation handoff).

**Loops served:** Loop 11 (Pool resources) and Loop 12 (Steward what we built) require Community to exist as a record. Loop 1 (Find your people), Loop 4 (Gather regularly), Loop 7 (Make and be found), Loop 8 (Follow), Loop 9 (Find a local pro) work without it. Communities augment those loops where members want to identify as a group; they are not a precondition for them.

> Public-facing term: "group" is interchangeable with "Community" in copy. *Community* is the schema name; *group* is what most people will call it.

## What a Community is

A Community is a named, intentional, self-selected group of Members. It is what a set of people *becomes* when they decide they are a group — not before.

The Thursday Run Club at Drake's exists as a Gathering Item attached to a Location (Drake's bar) with a recurring schedule. It does not require a Community to exist. The host declares the gathering, the time and place are public, people show up. The Gathering works entirely on its own — it has a page, RSVPs, a follow surface, an event log.

If, six months in, the regulars decide they are a group — they want to call themselves *Folsom Thursday Run Club*, they want to be addressable for Wonders, they want to pool money for reflective vests, they want to organize a winter route together — that is when a Community comes into being. A Member starts it. Others join. The Gathering Item keeps working unchanged; the Community references it but does not absorb it.

Communities are **emergent, not prerequisite. Optional, not assumed. Chosen, not assigned.**

## What a Community is not

- **Not a Location.** Drake's is a Location. West Sacramento is a Location. A polygon is a Location. None of them are Communities. Communities may anchor to Locations; they are never equal to them.
- **Not a Gathering.** A Gathering is an Item kind — it is the event itself. A Community is the group that may or may not form around the gathering and its regulars.
- **Not auto-assigned.** Living inside a polygon does not enroll you. Following a Member does not enroll you (it can imply soft affiliation; that is not membership).
- **Not required.** A Member who never joins a Community is fully welcome and fully functional. The lighter loops do most of their work without Communities at all.

## When Community matters

Three places where Community must exist as a record, not just an emergent set:

1. **Loop 11 — Pool resources.** Capital cannot be pooled by an ambient set of nearby people. The pooling unit is a Community with identifiable members.
2. **Loop 12 — Steward what we built.** Ongoing care of a shared thing — a garden, a tool library, a kitchen co-op, a building — requires a "we" with a record. The "we" is a Community.
3. **Addressable scopes for Wonders, Offers, Asks.** "Post my Wonder to *West Sac school parents*" needs a target. A Community is the target. A query result is not addressable.

For everything else — finding the Run Club, listing a service, following a maker, browsing a market — Items at Locations carry the load. Communities are useful in those loops; they are not necessary.

## How a Community comes into being

A Member starts one. They fill in:

- **Name** (required) — *West Sac school parents*, *Folsom Thursday Run Club*, *Sacramento sourdough exchange*.
- **Kind** (required) — see kinds below.
- **Anchor Location** (optional) — the geographic gravity, not a boundary.
- **Parent Community** (optional) — for nesting.
- **Description** (required) — what this group is for, in plain language.
- **Discoverability** (default `listed`) — listed / unlisted / private.

There is no application, no approval, no minimum-size threshold. If one Member believes a Community should exist, they create it. If no one joins within 90 days, it dissolves quietly with one-tap revive available to the founder.

A Community born out of a recurring gathering may reference the Gathering Item, but the Item does not depend on the Community. If the Community dissolves, the Gathering keeps running.

## How people self-select

Four mechanisms, lightest to heaviest:

**1. Soft signals.** Following a Member who anchors a Community implies a soft affiliation — surfaced as a suggestion, never written as a full membership. Attending a Gathering whose host has founded a Community implies the same. Soft signals decay when the underlying relationship ends (unfollow, no attendance for a period).

**2. Suggestion.** When a Member sets a home Location, the platform surfaces nearby listed Communities: *"3 groups are based in West Sac. Take a look?"* One tap to view, one tap to join.

**3. Browse and join.** The `/c` index lists Communities filterable by anchor Location, kind, what the Member's follows are in, and size. Joining is one tap. Leaving is one tap.

**4. Create.** A Member starts a Community at any time. No approval. The founder is the first steward.

The platform **never auto-assigns**. A polygon does not enroll you. A city does not enroll you. Geography is suggestion, never membership.

## Kinds

`kind` enum at T1:

- **`place`** — anchored to a geographic Location, oriented to where members live or spend time. *West Sac school parents.* *Bryte neighborhood.*
- **`interest`** — affinity-based, optional Location anchor. *Sacramento sourdough exchange.* *California cooperative bakers.*
- **`practice`** — a recurring vocation or shared craft. *Sacramento dog walkers.* *Folsom repair café volunteers.*
- **`event_anchored`** — born from a recurring Gathering Item, references it. *Folsom Thursday Run Club.* *Drake's bar trivia regulars.*
- **`family`** — a household or extended family, typically `private`.
- **`cooperative`** — formal cooperative ownership group (reserved at MVP; full surface at b2/b3 alongside Loops 11 and 12). The Community is the *affinity wrapper* — the *we* that operates the cooperative socially. The legal entity that holds title to assets is modeled separately per [`cooperative.md`](cooperative.md) and ADR-11. A Member's relationship to a cooperative is carried on their `cooperative_member` Operation per [`member-operations.md`](member-operations.md), which links to both the Community and the Cooperative entity.

Kind is descriptive, not restrictive. A Community can change kind as it evolves — a Run Club starting as `event_anchored` and converting to `cooperative` when it pools to buy a clubhouse.

## Anchors and parents

**Anchor Location** (`anchor_location_id`, nullable) is the geographic gravity, not the boundary. *West Sac school parents* anchors to the West Sac Location; some members live across the river. The anchor is what the platform uses for proximity-based suggestion; it does not gatekeep.

**Parent Community** (`parent_community_id`, nullable) expresses nesting, not control. *Folsom parents of school-age kids* may parent into *Folsom families* may parent into *Sacramento Valley families.* The parent does not approve the child; it expresses a relationship the child's author chose. Parent Communities are how regional or statewide identity accumulates without becoming a feed.

Both fields can be null. A statewide practice Community may have neither.

## Discoverability

`discoverability` enum:

- **`listed`** — appears in the public `/c` index and in geographic suggestions. Default.
- **`unlisted`** — exists, has a public page at `/c/[slug]`, does not appear in browsing or suggestions. Joinable by direct link only. For emerging or experimental groups.
- **`private`** — members-only. Public page reveals only the name and a note that membership is by invitation. For sensitive contexts: recovery, domestic violence support, family.

All three are first-class. The choice belongs to the founder and can change.

## Membership

A `community_membership` is a relationship between a Member and a Community.

Roles at T1: `member` or `steward`. Founder is the first steward. Stewardship can transfer one-to-one at MVP; rotation surfaces at b2.

Memberships record their `source`:

- **`explicit`** — the Member chose to join. Counts toward addressability and pooling.
- **`soft_via_follow`** — the Member follows another Member who anchors this Community. Surface-level suggestion only. Does not count toward member lists or pooling. Auto-resolves on unfollow if no other tie.
- **`soft_via_attendance`** — the Member RSVP'd to a Gathering anchored by a Member who founded this Community. Same surface-only treatment. Decays after 90 days of non-attendance.

Soft memberships exist for the platform's index suggestion. They are invisible to the Community itself. They do not grant the Member addressability or pooling rights.

Members can leave at any time, no questions asked. Membership is per-Member, not per-household, even for `kind=family`.

## Items and Communities

`items.community_id` is **nullable**. An Item optionally lives in a Community. When set, the Item appears on the Community page and inherits the Community's discoverability for ambient surfacing.

Most Items at MVP have no `community_id`. A maker's products, a vet's services, a mobile groomer's bookings, the Run Club gathering at Drake's — these all work without one. The Item composer asks; it does not require.

Wonders default `community_id` to the author's primary Community if they have one; otherwise to null (locality-only scope). Offers and Asks (b2) follow the same default.

## Lifecycle

- **Birth** — a Member creates the Community. They are the first steward.
- **Growth** — Members join. Items optionally attach. The Community accumulates a page, a member count, a feed of Items posted to it (b2 surface).
- **Dormancy** — a Community with zero `explicit` memberships for 90 days enters dormancy. The founder is notified; one-tap revive is available for 30 days.
- **Dissolution** — a dormant Community after 30 days is dissolved. Its Items lose their `community_id` (revert to locality scope). Its membership rows are archived.
- **Stewardship transfer** — a steward can hand off to another Member at any time. If the last steward leaves, the Community is auto-dormant.
- **Pooling and stewardship surfaces (b2/b3)** — a Community that wants to pool capital or steward a Location triggers Loop 11/12 infrastructure. At MVP, neither surface ships; the schema does not block their later addition.

## Data model

```sql
create table communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  kind text not null check (kind in ('place','interest','practice','event_anchored','family','cooperative')),
  anchor_location_id uuid references locations(id) on delete set null,
  parent_community_id uuid references communities(id) on delete set null,
  founder_member_id uuid not null references members(id),
  description text not null,
  discoverability text not null default 'listed' check (discoverability in ('listed','unlisted','private')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  dormant_at timestamptz,
  dissolved_at timestamptz
);

create index idx_communities_anchor on communities (anchor_location_id) where dissolved_at is null;
create index idx_communities_parent on communities (parent_community_id) where dissolved_at is null;
create index idx_communities_kind on communities (kind) where dissolved_at is null;

create table community_memberships (
  community_id uuid not null references communities(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  role text not null default 'member' check (role in ('member','steward')),
  source text not null default 'explicit' check (source in ('explicit','soft_via_follow','soft_via_attendance')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  primary key (community_id, member_id)
);

create index idx_memberships_member_active on community_memberships (member_id, community_id)
  where left_at is null and source = 'explicit';
```

`items.community_id` (nullable, FK to `communities.id`) is added in `009_items.sql`.

`members.primary_community_id` (nullable, FK) is set at onboarding when the Member explicitly chooses one.

Event log entries: `community.created`, `community.joined`, `community.left`, `community.steward_transferred`, `community.dormant`, `community.revived`, `community.dissolved`, `item.community_changed`.

## RLS sketch

- `communities` SELECT: public for `discoverability in ('listed','unlisted')`; members-only for `private`.
- `communities` INSERT: any authenticated Member.
- `communities` UPDATE: stewards only.
- `community_memberships` SELECT: row-owner Member always; other members of the same Community for `explicit` rows; never visible for `soft_via_*` rows.
- `community_memberships` INSERT: self-join for any Member if Community is `listed`/`unlisted`; invite-only for `private` (T2 surface).
- `community_memberships` UPDATE/DELETE: row-owner only.

## What does not ship at MVP

- Posting surfaces inside a Community (a Community feed of Items + discussion). b2.
- Stewardship rotation algorithms. b2.
- Cooperative-fund linkage and pooled-capital tooling. b3 (Loop 11).
- Steward task surfaces (workdays, rotations). b3 (Loop 12).
- Federation handoff for mature Communities — the protocol is real but the surface is b3 (Loop 13).
- Algorithmic Community recommendations beyond geographic and follow-graph suggestion. We do not build a Community discovery feed.

## Integration points

- **Member** — Members hold zero or many Community memberships. `members.primary_community_id` is a soft pointer used for default scope on Wonders and the index.
- **Item** — Items optionally scope to one Community (`items.community_id`). Most Items have none.
- **Location** — Communities optionally anchor to a Location (`anchor_location_id`). Locations have no members; if you want members, you need a Community.
- **Gathering Items** — an event-anchored Community references the Gathering Item that seeded it via `metadata.seeded_by_item_id` (jsonb, optional). The Gathering does not depend on the Community.

## Open questions

- **Naming collisions.** Two Communities named *Folsom Thursday Run Club* — slug uniqueness handles it but the second creator may not realize a Community already exists. Surfaced via a "communities you might mean" suggestion at create. Confirm at MVP.
- **Soft-membership scoring.** Soft memberships drive index suggestion strength. The decay function (linear over 90 days? half-life?) is open.
- **Cross-platform federation of Communities.** When a Community grows past what we host (a fund reaches scale, cooperatives federate), the federation interface is per `loops.md` Loop 13. Handoff protocol design defers to b3.
- **Community kind transitions.** Should `event_anchored → cooperative` transitions be auditable or quiet? Working answer: auditable via event log; UI surfaces the change to existing members.
- **Multi-anchor Communities.** A statewide group may "anchor" to no single Location. Currently nullable — confirm one-anchor or none is enough at MVP, multi-anchor reserved for T2.

## Comments

The discipline at MVP is to build Community as a thin, voluntary primitive that earns its existence by being optional. Every loop in `loops.md` that does not require Community must keep working without one. Every loop that does require Community (11, 12) reads from this primitive cleanly when its surfaces ship.

The trap to avoid is Nextdoor's: drawing a polygon and calling everyone inside it a community. Geography is not affinity. People-first means letting people choose who they consider their group, name it, leave it, dissolve it. The platform's job is to make the choosing easy and the addressing possible — and otherwise to stay out of the way.

A Community without Members ceases to exist. That asymmetry — Members can dissolve a Community; a Community cannot dissolve a Member — is the structural posture that keeps the platform people-first all the way down to the relational layer.
