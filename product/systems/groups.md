# System: Group

**Status:** **Approved 2026-05-10** — ratified by PM. The Community / Member Operations / Cooperative split is retired in favor of this single spine + child architecture. Predecessor specs ([`community.md`](archive/community.md), [`member-operations.md`](archive/member-operations.md), [`cooperative.md`](archive/cooperative.md)) were archived 2026-05-11 — content preserved in `systems/archive/` for historical reference. ADR-13 is pending formal write-up; this status line is the load-bearing ratification until then.

**Purpose:** Establish Group as the platform's primitive for *people organized to do things together on the platform*. Replaces the Community / Cooperative / Business distinctions fragmented across separate specs (and a Member Operations primitive that duplicated multi-Person commercial relationships) with a single spine + child architecture, mirroring [`item.md`](item.md)'s pattern. The platform's grammar becomes: **People form Groups to do things using Items, attached to Locations.** Some Groups affiliate — a Run Club, school parents, a family. Some Groups operate — Maya's bakery, a partnership, an auto shop. All are people, never persons.

**Bundles:** b1 (T1 — affiliate kinds + business kind, full surface).

**Companion specs:** [`primitives.md`](../foundation/primitives.md) · [`item.md`](item.md) · [`member.md`](member.md) · [`location.md`](location.md) · [`policy.md`](../foundation/policy.md)

**Retires (ratification 2026-05-10, archived 2026-05-11):** [`archive/community.md`](archive/community.md) · [`archive/member-operations.md`](archive/member-operations.md) · [`archive/cooperative.md`](archive/cooperative.md). Predecessors now live in `systems/archive/`; do not cite as live — use this spec.

**Cooperative coordination — deferred until real-world need:** Cooperative-style coordination in the app (voting, distributions, governance mechanics) is deferred until real-world cooperative operations create a clear need for in-app coordination tools, and the user explicitly prioritizes building them. The platform is the coordination layer for organizing real-life cooperation; it is not a replacement for the real-life operations of cooperatives, businesses, or any other entity. People meet in real life; cooperatives operate in real life; the app helps them find each other, coordinate logistics, and make commerce visible. When in-app cooperative coordination becomes useful, the architecture is open to extension: `kind='business'` Groups with multiple owner-role memberships are the foundation, and child tables or additional kinds can be added without disturbing the spine. The `cooperative.md` spec is retired (above); the prior ADR-11 schema reservations (no `cooperative_cohort` Item kind, no `cooperatives` table, no `cooperative_*_events` table) stand as current-scope architectural decisions — correct for now, revisitable when the need emerges.

**Decisions encoded (ADR-13 pending formal write-up):** supersedes ADR-11 (cooperative-style coordination deferred until real-world need + explicit user prioritization; schema reservations stand as current-scope), fully supersedes ADR-8 (Member Operations primitive dies — sole-prop case is a kind='business' Group of one), supersedes ADR-12 (per `agent-commerce-and-project-amendments.md` §6: the "Maker mode" framing is retired; selling tools surface from Group/Item state, not from a Member-level toggle).

**North stars served:** Family 1 (Gather) and Family 2 (Share) by affiliate kinds. Family 3 (Trade) by business kind, plus by no-Group one-off sales.

> Map to numbered north stars from `product/foundation/north-stars.md` before scenario approval.

---

## What a Group is

A Group is a set of People organized around something on the platform. The "something" varies — shared place, shared interest, shared practice, shared event, shared household, shared commercial operation. The shape varies with the something. The fact that it is **people, not a person**, does not.

This is the platform's structural refusal of corporate personhood. US law treats LLCs, corporations, and cooperatives as legal persons that can own property, sign contracts, and outlive their human members. The platform does not. Items always belong to Members. Money flows are **visible and accountable**: both parties always know who they are dealing with (per `agent-commerce-and-project-amendments.md` §5). Recipients can be Members, Groups of Members, or identified external recipients (a Girl Scouts troop, a local nonprofit, a community fund). The platform's preferences are surfacing-level: locally-owned businesses are surfaced first; Member recipients are preferred when intent doesn't specify; external recipients are supported, not blocked. A Group cannot sign, own, be delegated to, or outlive its last Member.

The Group primitive lets the platform represent how people actually organize — partnerships of equals, families, run clubs, neighborhood associations, sole proprietors — without modeling them as the corporate shells US law would impose.

## What the platform drives versus what it records

A structural commitment, parallel to the no-personhood guarantees:

- **The platform drives on-platform verbs.** Affiliating, operating, posting, gathering, following, selling, hosting — these happen *here*, with the platform as their record and surface.
- **The platform may record off-platform facts.** A Group operating as an LLC can declare that fact — `group_businesses.legal_entity_kind = 'llc'` — and the platform mirrors it. The platform doesn't drive the LLC formation; it acknowledges it.
- **The platform records facts and facilitates transactions; it does not perform legally-binding business or governance operations.** Action handlers reject any write that would simulate the platform *executing* an off-platform legal act — filing paperwork on behalf of an entity, committing a binding governance vote, signing a regulated agreement. Money movement is different: the platform is the rail for transactions between people and organizations (per [`payments.md`](payments.md)), not the legal principal of those transactions. Off-platform facts arrive as Member-recorded statements about the world, not as platform-driven processes.

  > **Intent:** Legally-binding operations regarding business or governance — entity filings, binding cooperative votes, regulated agreement signing, tax-authority-recognized acts — carry legal ramifications the platform isn't equipped to handle (securities law, operating-agreement enforcement, jurisdictional dispute resolution, fraud recourse). Taking them on would make the platform the legal record-of-truth for actions it can't authenticate, dispute, or unwind. Money flow is structurally different: the platform *facilitates* transactions between identified parties (the rail role per `payments.md`); it doesn't *act as* their legal principal. The deferral on legally-binding org operations is **long, not categorical** — revisit only when the platform's relationship to legal-weight operations is clarified through a federation partner or chartered entity. Test for future proposals: does this entangle the platform in legally-binding business or governance acts? If yes, defer for a very long time.

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

  > **Intent:** Business Groups exist to let Members answer one question: *is this local to my community; does this entity support my community; should I support it?* Member count is not a signal toward that question — a 1-owner sole-prop and a 3-owner partnership give Members the same information about locality and community support. Forcing the vendor to self-categorize by count would impose a costume (sole-prop vs. partnership) the people-first stance refuses (per [`../foundation/principles.md`](../foundation/principles.md) and the role-as-verb commitment); the vendor describes themselves through their display name, description, and owner-role memberships. Test for future proposals: does this differentiation help a Member decide "is this local / does it support my community"? If no, the differentiation is extra; don't add it.
  >
  > **Forward-looking watchpoints** (not b1; flagged for design when they matter): (1) a locally-owned business acquired by private equity or outside capital — the locality signal has gone stale; the platform should eventually surface that transition rather than letting the Group present as locally-owned indefinitely. (2) Complex or opaque ownership (many out-of-state owners, layered entities) that makes the locality answer unreliable — the platform needs a mechanism to surface "locality unclear" rather than defaulting to "ownership unknown = treat as local." Both are failure modes of the locality answer the platform exists to provide.

The kind enum is extensible. Future candidates if real cases warrant: `nonprofit`, `mutual_aid`, `worker_collective` — not in scope at b1.

## Roles per kind

| Kind | Valid roles |
|---|---|
| `place`, `interest`, `practice`, `event_anchored`, `family` | `member`, `steward` |
| `business` | `owner`, `member` |

The `member` role is shared across kinds with kind-contextual meaning: in affiliate kinds it means "affiliated with this group"; in Business it means "works in this operation under the operating owner." The action layer enforces kind-specific validity; the same string carries different semantics depending on the Group's kind.

Structural rules:

- Every kind='business' Group has ≥1 active membership with role='owner'.
- **The founder is the operating owner for kind='business' Groups, immutably at b1.** Operating-ownership is not transferable at b1 — it's a property of the Group's identity, set at creation as `groups.founder_member_id` and never changed. The operating owner is the routine point of authority for functionality writes (display_name edits, member confirmations, dissolution). They are computed at runtime as the membership where `member_id = groups.founder_member_id AND role = 'owner' AND left_at IS NULL`; if no such membership exists, the Group has no operating owner and is in a broken state (dormancy).
  **Intent:** Transferable operating-ownership is the seam at which "the person who started this thing" diverges from "the person currently running this thing." At b1 scale (small, local, simple Groups), forcing the seam to be a *new Group* (with claimed continuity via `established_on`) keeps the platform from becoming the record-of-truth for off-platform ownership transfers — a job the platform is not equipped to do (no escrow, no legal weight, no fraud recourse). The b1 answer to "transfer ownership of this Group": a new Group, with continuity claimed, never an in-place mutation. **Forward-looking — substantial-scale gate:** transferability and appointment-based succession are deferred design space for Groups large enough that dissolve-and-recreate is materially harmful (significant accumulated infrastructure, customer base, product catalog, operational complexity). When the platform sees Groups at that scale, the appointment design space opens — see OQ on substantial-scale gate. Until then, founder-immutable + recreate-via-`established_on` is the b1 floor, and Member-anchored social capital (per line 125) means a founder's accumulated recognition follows them across any Group transition regardless.
- **No transfer of operating-ownership.** If a different Member should run this commercial operation, they form a new Group with themselves as founder. The old Group ends; the new Group begins. Continuity (if any) is claimed via `established_on`. This pattern mirrors the no-kind-transitions rule: change of fundamental identity = new Group, not in-place mutation.
- **Multiple owners are supported via multiple owner-role memberships.** A partnership of three is three Members with role='owner' — but only the founder has operating-owner authority. Other owners are co-equal in ownership but defer to the founder for routine functionality writes. This is a deliberate constraint that keeps partnerships from forking on the first disagreement; partners who can't accept it should form their own Groups instead.
  **Intent:** Co-equal authority on routine writes (display_name edits, dissolution, day-to-day) would mean every change requires unanimous consent, which empirically deadlocks small partnerships. Founder-as-operating-owner is the structural concession to "this is how partnerships actually function" rather than "this is what equality theoretically demands." The platform's job is to surface the partnership's existence (multi-owner-role membership) and protect its members, not to enforce co-equality on the operating verbs.
- Communities require no leadership role; if all stewards leave, the Group becomes dormant per the lifecycle rules.

A Member can hold any role across multiple Groups simultaneously.

**Forward-looking — permissions decomposition.** Roles at b1 are fixed bundles of permissions, enforced in the action layer (per ADR-7) rather than by check constraint. A future direction (not b1) is decomposing roles into a permissions table — `group_role_permissions(kind, role, permission)` for the role-default bundle, plus optional `group_member_permissions(group_id, member_id, permission)` for per-Member overrides. This would allow custom roles like *manager* or *kitchen lead*, and granular per-Member adjustments (the long-trusted staff Member granted Item-edit rights), without expanding the role enum or migrating existing rows. The change is purely additive: the `role` column stays; new permission tables join on it. Flagged as open question for when real custom-role cases surface.

## Selling, with or without a Group

Not every commercial transaction requires a Group. Three modes at b1, one forward-looking mode for later.

**One-off sale** — A Member posts a product Item with no Group. Photo, description, price, location. Item lifecycle: `active → fulfilled` (or `withdrawn`). The garage-sale shape, the single-loaf-of-sourdough shape, the I-don't-know-if-I'm-doing-this-again shape. `items.group_id = null`. No selling-tool surface beyond the composer; no standing tier.

**Ongoing commercial** — A Member operates through a kind='business' Group. Items have `group_id` set. The Group page is the storefront. Standing tier, agent context, full selling-tool surfaces per the superseded ADR-12 (the surfaces follow Group membership, not a Member-level mode).

**Selling on behalf of others (future, not b1)** — A Member sells things owned by other Members. Garage-sale-for-someone-else, estate-sale-for-a-neighbor, kid-selling-mom's-art. Probably warrants its own Item kind (`kind='consignment'`) with separate seller-Member and owner-Member fields. Flag for forward design; don't model now.

The composer's pivotal question, at the moment of commercial Item creation: **"Is this a one-time sale, or part of something you're planning to keep doing?"** Default for new Members and Members without an active `kind='business'` Group is **no, one-time** — the casual workflow lands the Item with no Group and no business tools. Answer "yes, recurring" triggers the `kind='business'` Group walkthrough. For Members with an active business-Group membership, the default flips to **yes, recurring** — their commerce is anchored to the Group by default. Most people posting one thing for sale aren't starting a business; the platform shouldn't make them feel like they are. There is no "Become a Maker" framing — the walkthrough is structural Group setup, not a mode-flip. The "business user" vs. "non-business user" distinction is derived from active business-Group membership; no stored `is_business_user` flag exists (per the 2026-05-12 Maker-mode-retirement amendment — selling tools surface from Group/Item state, not from a toggle).

This honors how people actually start. Maya selling a single loaf at the church bake sale is one Item with no Group. Maya deciding she wants to do this regularly creates a Group at that moment. The Group is the *commitment* surface; the Item is always available without it.

> **Intent:** The b1 design uses Member self-declaration as the trigger between casual and commercial workflows — never behavioral observation. The composer's "recurring sale?" question + the option to create a `kind='business'` Group are the only paths from casual to business; the platform never silently transitions a Member based on their sales cadence. **Self-declaration is always preferential to observation until the platform reaches critical mass and has enough data to find real patterns** — until then, behavioral pattern detection is lossy (false positives on people clearing a closet) and invasive (tracking patterns to push commerce onto Members who didn't ask). Both workflows are subject to good-faith conduct; persistent bad-actor behavior can revoke the affordance per a future moderation policy (see open questions). **Forward-looking — large-scale sellers:** this is the small-scale-seller workflow. Vendors at higher volume should eventually get robust tools (inventory management, barcode scanning, point-of-sale integration) — T2/T3+ work; flag for future design. Test for future proposals: does this make a Member commerce decision *for* them based on platform observation? If yes, refuse — self-declaration is the b1 trigger. Does it make first commerce feel like starting a business? If yes, refuse — that's the costume people-first refuses.

## Lifecycle per kind

**Universal dormancy timing.** All kinds use a **90-day dormancy window** before dissolution, with **member-extension** available. Life gets messy; the platform should accommodate that without forcing busywork or dissolving Groups whose people are temporarily occupied.

When a Group enters dormancy, `groups.dormant_at = now()` and `groups.dissolves_at = now() + interval '90 days'` are set in the same transaction. The Group becomes invisible in promoted surfaces and search defaults. Founder and any remaining members are notified. At any point during dormancy, anyone with an active or recent membership in the Group (or the founder, if not a current member) can call `group.extend_dormancy`, pushing `dissolves_at` out by another 90 days. No cap on extensions — trust the participants. If `dissolves_at` is reached without revival, the Group dissolves; Items lose `group_id`; memberships archive.

**Triggers per kind:**

- **Community kinds** (place, interest, practice, event_anchored, family): Group enters dormancy when zero `explicit` memberships have existed for 90 days (the long inactivity tail), or when the last steward leaves a Group with no other active stewards.
- **Business kind:** Group enters dormancy *immediately* when the founder ends their owner-role membership, regardless of how many other owners remain. The Group's identity is bound to its founder; without them, it cannot continue as the same operation. Other owners (partners) can extend dormancy with `group.extend_dormancy`, buying time. **Only the founder can revive** — by rejoining as owner via `group.member_join`. Other owners cannot replace the founder; if they want to continue operating, they form new Groups with themselves as founder, claiming `established_on` continuity if appropriate.

**Off-platform legal entity persistence.** When `group_businesses.legal_entity_kind` is non-null (the Group reflects a real-world LLC, partnership filing, etc.) AND the founder remains an active owner, the Group does not auto-dormant on activity-inactivity. It persists until the off-platform entity is recorded as dissolved via `group.dissolve`. The founder-leaves trigger still applies — a registered LLC whose founder departs the platform still goes dormant.

**Revival.** While dormant, a Group can be revived by `group.revive`, which clears `dormant_at` and `dissolves_at` and restores visibility. For community kinds, revival authority lives with active or recent (within 12 months) members. For Business kinds, revival authority lives with the founder only — no other Member can revive a dormant Business, since they cannot become its operating owner.

> **Intent:** The b1 restriction follows from two settled commitments: (a) **Member-anchored social capital** (line 125, ratified 2026-05-12) — reputation travels with the Member, not the Group, so dissolve-and-recreate doesn't destroy a Member's accumulated value; (b) **founder-immutable operating-ownership at b1** (line 78). Together: when a business Group's founder is gone and the Group goes dormant, no other Member can revive it — they must form a new Group, and any social capital they themselves accumulated as Members travels with them into the new Group. The seller takes their reputation; the buyer starts fresh and earns their own. **Forward-looking — substantial-scale gate:** when Groups operate at scale where dissolve-and-recreate is materially harmful (significant accumulated infrastructure, customer base, product catalog, operational complexity), appointment-based succession may be warranted — see OQ on substantial-scale gate. The Member-anchored social-capital framework may also need revisiting at that scale (does it still hold, or does substantial-Group continuity warrant a different model?). Until then, founder-only revival + recreation via `established_on` is the b1 succession path. **Test for future proposals:** does this proposal try to ship transfer or appointment machinery before the platform has Groups large enough to need it? If yes, refuse — it's premature design.

## No kind transitions

Groups do not change kind. If a Member pivots — a Run Club's organizers decide to formalize as a registered LLC, a bakery decides to convert to a non-commercial baking-class series — they end the current Group and create a new one of the new kind. This is simpler than maintaining a transition machinery with role-mapping rules and audit semantics for every kind pair. Items lose their `group_id` when the source Group dissolves; the Member can re-file Items under the new Group at their discretion.

> **Intent:** The b1 floor — dissolve-and-recreate via `established_on` rather than in-place kind mutation — is **provisional, not categorical**. The reason for the b1 stance is complexity-and-scale: maintaining transition machinery (role-mapping rules per kind pair, audit semantics, RLS policy updates, downstream consumer defenses against unstable kind enums) is real cost, and at b1 scale the Member-benefit case for in-place transitions is undemonstrated. **Door left open** — at scale, with specific use cases that argue against recreation, kind transitions may warrant design. Two distinct shapes that may warrant the affordance when use cases clarify:
>
> 1. **Operator-scale transitions** (small → large). A `kind='business'` Group operating at small scale (one founder, simple operation) growing into a multi-owner, complex operation. Mostly *within-kind* — still `kind='business'`; the open question is whether kind-level transitions are needed or whether existing within-kind affordances (multi-owner memberships, off-platform legal-entity declaration, role decomposition per the permissions-decomposition OQ) cover the case.
> 2. **Non-income → income transitions** (community-kind → business-kind). A Run Club that decides to start selling apparel together; an interest Group whose members decide to formalize as a CSA together; a practice circle that begins charging for instruction. The community → business shape is the most concrete future use case; the inverse (business → community) is also conceivable but less obvious.
>
> Until specific use cases argue for the affordance, recreation via `established_on` + Item re-filing is the b1 succession path. **Test for future proposals:** does this proposal name a specific use case where dissolve-and-recreate is materially harmful *and* within-kind affordances don't solve it? If yes, the kind-transition design space is worth entering. If no, recreation is the answer.

**Items posted by departed Members stay filed under the Group.** When a Member ends their membership, any Items they previously posted with this Group's `group_id` keep that filing. The Items still belong to the Member (`items.member_id`), and the Member can edit or withdraw them at any time as their own Items, but the Group's record honors the historical commerce. This means the Group page may surface Items by ex-members; that's the honest history. Items only lose their `group_id` when the Group itself dissolves.

**Continuity across pivots: the `established_on` field.** A Member starting a new Group that continues an earlier effort can self-report `established_on` to claim the historical date — Maya's new "Oak Park Sourdough" Group can carry `established_on = '2020-01-01'` even if `created_at` is much later. The platform doesn't verify this; it's the Member's claim, displayed honestly alongside the actual `created_at` if the user cares to see both. This gives the affordance of continuity without requiring schema-level Group-lineage links the platform would have to enforce and the Member would have to navigate.

**Continuity of reputation: travels with the Member, not the Group.** Member-level reputation, ratings, endorsements, and accumulated social capital are anchored to the Member primitive — not the Group. When Maya's Oak Park Sourdough dissolves and she starts a new Group, whatever recognition she's accumulated as Maya travels with her. **This applies equally to founders and to participants** — any Member who has contributed good behavior, helped neighbors, or built trust accumulates social capital that follows them across Group endings. A future reputation/rating system will key on `members.id` rather than `groups.id`. Groups are commercial-shape coordination; reputation is a social-shape commitment from one Person to another.

> **Intent:** Member-anchored social capital is the ratified b1 framing (PM 2026-05-12). The principle: *good behavior is rewarded by recognition that follows the person who did the good* — applies to founders and participants alike. The earlier "three-framings open" framing surfaced during the groups.md walk and resolved in favor of Member-anchored: Group-anchored / transferable reputation would let trust be sold without the conduct that earned it; Hybrid (transfer-with-conduct-commitment) introduces adjudication complexity the platform isn't equipped for at b1 (no conduct-monitoring infrastructure, no enforcement mechanism for inherited commitments). Member-anchored is the simplest framing that protects the reward mechanic. **Forward-looking — substantial-scale gate:** when a Group has accumulated significant infrastructure, customer base, product catalog, etc., dissolve-and-recreate may become materially harmful. At that scale the question of how Member-anchored social capital interacts with Group succession may re-open — does Member-anchored hold (and we live with the recreation cost), or does the substantial-Group case warrant a different framework? See OQ on substantial-scale gate. Until then, Member-anchored holds, founder-immutable holds, recreation-via-`established_on` is the succession path.

## Standing-tier gate

`member_has_standing_presence` view returns TRUE for a Member when:
- They have ≥1 active membership in a kind='business' Group, **OR**
- They have a `role='steward'` membership in any non-business Group.

Replaces both `member.maker_signal` (ADR-3, deprecated) and the prior Operations-derived `member_has_standing_presence` (ADR-8, fully superseded by this spec). Assistant Context affordance prominence, agent context tier, and Skill subscription affordance read this view.

A Member with only one-off sale Items has no standing tier — correctly.

## Selling tools (ADR-12, superseded 2026-05-12)

Per `agent-commerce-and-project-amendments.md` §6 (ratified 2026-05-12), the "Maker mode" framing is retired. There is no `members.maker_mode_enabled` toggle. Selling tools — product/service composers, storefront, seller dashboard, agent-assistance affordances — are present whenever the Member needs them, surfaced from Group / Item state:

- A Member with ≥1 active kind='business' Group membership has the full selling toolset surfaced ambiently. No toggle to enable.
- A Member without a kind='business' Group sees the universal composer (gathering, wonder, ask, offer). Tapping the **Sell** verb (per CLAUDE.md naming conventions) for the first time triggers the kind='business' Group walkthrough (`group.create` + `group.member_join`), after which the product composer opens.
- To stop selling: end the owner-role membership in the business Group (per the Lifecycle rules — founder leaving puts the Group into 90-day dormancy). Items remain published per their own settings.
- Per-membership profile-visibility (the `members.show_group_memberships` privacy toggle per `member.md`) hides the business affiliation from the public profile without affecting the Group itself. For a fully private selling presence, set the Group's `discoverability` to `unlisted` or `private`.

**Vocabulary.** Per `agent-commerce-and-project-amendments.md` §6b: **Seller** is the generic term for a Member offering goods or services; **Producer** is preferred in agricultural / food contexts (already used in [`producer-tools.md`](producer-tools.md) and [`producer-tools.md`](producer-tools.md)). "Maker" survives only as a UI label for Members who specifically self-identify as such (craftspeople, artisans).

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

> **Intent:** The `member_location_affinities` table carries Members' `lives` and `works` rows — personal data whose exposure would enable stalking, doxxing, and harassment. ADR-16's owner-only RLS is the structural protection: each Member can only see their own affinity rows. The b1 commitment is **protection via the `SECURITY DEFINER` function pattern** — `member_is_local_to_location()` is the only currently-authorized path; the boolean granularity it returns is sufficient for the locality-promotion use case. **Door left open** for future use cases that genuinely need different (and still safely-scoped) information from this data: the path is *adding a new authorized function* with its own narrowed contract — not cracking the no-direct-JOINs rule. When a new use case arises, the proposal must name what data is needed, why existing functions don't serve it, and what privacy safeguards accompany the new function (rate-limiting, audit, narrow scope, threat-model review). **Test for future proposals:** does this proposal want to JOIN against `member_location_affinities` directly, or relax the SECURITY DEFINER discipline? If yes, refuse — the answer is "propose a new authorized function." The wall stays up; doors open *through* it, not *around* it.

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

> **Intent:** Locality is a *property of the current state of Member-Location affinities*, not a stored fact about the Group. A stored `is_locally_owned` field would represent locality *as of the time it was computed* — and every Member-Location change (Member moves, owner-Member added or removed, `lives` affinity updated) would need to fire a re-compute trigger. Missed triggers leave the field stale; stale fields lie to consumers. Computing at query time eliminates the entire class of staleness bugs by construction: **the answer reflects the current state of the input data, always.**
>
> **Important — staleness-free is not gaming-proof.** Dynamic computation guarantees the answer is current; it does not guarantee the *input* is honest. Locality depends on Member-declared `lives` affinity in `member_location_affinities`, which the platform cannot independently verify. The current incentive structure rewards gaming: an owner who has moved out of Oak Park has a clear motive to keep their `lives` affinity pointed at Oak Park to retain locality-promotion benefits. The "always correct relative to the current state" guarantee is *narrower than locality integrity*. See OQ on locality verification + counter-gaming.
>
> The cost of dynamic computation is per-query overhead — solvable through query-layer caching with explicit invalidation on Member-Location change events, *not* through storing the answer on the Group row. **Test for future proposals:** does this proposal add a stored locality flag (or any other derived-from-state column that can drift)? If yes, refuse — the answer is "compute at query time, cache at the query layer if performance argues for it." Derived state belongs in functions, not columns. Separately: does this proposal address the input-honesty / gaming concern? If yes, route through the locality-verification OQ.

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

  > **Intent:** `items.member_id NOT NULL` is the schema-level enforcement of the no-impersonal-business-entity commitment from [`../foundation/principles.md`](../foundation/principles.md). Every Item has a named human accountable for it — and that Member must be the one *operating* the Group the Item is filed under (or operating no Group, for one-off sales). `items.group_id` is the *filing surface* (where the Item sits commercially — under the bakery Group, under the Run Club, etc.); `items.member_id` is the *responsible operator* of that filing — the human whose social capital is on the line for the Item's existence. **What this rules out:** Items existing without a Member (orphaned, headless, corporate-only), and Items filed under a Group by a Member who isn't operating that Group. **What this rules in:** Group display branding on an Item via the Member-as-operator's chosen `group_id` filing, with the Member's identity (and accumulated social capital — Member-anchored per line 125) as the load-bearing accountability surface. **Test for future proposals:** does this proposal want to let Items have a `group_id` without a `member_id`, treat a Group as the primary owner of an Item, or let Members post Items under Groups they don't operate? If yes, refuse — that's reintroducing the impersonal-business-entity path through the back door. **Forward-looking — substantial-scale gate:** when appointment-based operator succession is designed (currently deferred), the question of how `items.member_id` behaves across an operator change (stays with original poster, or follows current operator?) is part of the deferred work. b1 is trivially safe because operator = founder = immutable; the question is real at scale.
- No `group_assets` table at b1. The platform does not custody capital, hold title, or mirror financial flows for its own balance sheet. Money flows are visible and accountable to identified recipients (Members, Groups of Members, identified external recipients) per `agent-commerce-and-project-amendments.md` §5 and `payments.md`. Custody is at a chartered partner (CDFI / credit union / cooperative bank), never the platform. The "no `group_assets` table" decision is current-scope, not categorical — revisitable if cooperative-coordination needs emerge.
- Groups cannot be the target of a Delegation (per ADR-6). Only Members can grant or hold Delegations.

  > **Intent:** Delegations are the substrate by which non-human actors (assistants, Skills, federation peers) act on a Member's behalf — and the trust commitment (per [`../systems/agent-assistance.md`](../systems/agent-assistance.md)) is fundamentally a *Person-level* commitment. Groups can't consent (no context window, no prompt-injection surface, no "I withdraw this" mechanism). Letting Groups grant or hold Delegations would force the platform to invent Group-consent machinery — who consents on behalf of the Group, by what quorum, under what dispute mechanism — every answer to which collapses back to "a specific Member." The schema makes it impossible by construction: only Members can be Delegation principals.
  >
  > **Group-coordination agents are valuable; the b1 path is platform-curated, not Member-invented.** Many Group-coordination use cases exist (calendar management for a `kind='business'` Group, scheduling for a recurring Gathering, member-onboarding flows, recurring-event coordination). Letting Members invent these agents themselves and grant them Group-scoped Delegations creates a substrate for harmful agents — poorly-scoped, malicious, or just badly-designed — that other Group Members have no protection against. **The path:** platform curates Group-coordination agents (same shape as platform-curated Skills per `agent-assistance.md`), and a Group's operator opts the Group into using them via the operator's own Delegation scoped to Group-coordination scopes. The Member is still the Delegation principal; the agent functionality is platform-built and reviewed. **Forward-looking:** if a future design surface lets Groups create operation-specific agents safely (with sufficient scoping, review, and protection for other Group Members), leave that open for discussion. See OQ on Group-coordination agents.
  >
  > **Test for future proposals:** does this proposal want Groups to grant/hold Delegations, or let Members create custom Group-scoped agents at b1? If yes, refuse — the answer is "use platform-curated Group-coordination agents, invoked under the operator's Delegation." Person-anchoring is the trust commitment; agent creation is platform-curated (at b1), not Member-invented.
- Groups dissolve when their Members leave (community kinds, or business kinds without an off-platform legal entity) or when an off-platform legal entity is recorded as dissolved.
- The action layer (ADR-7) rejects any write attempting to set Item ownership to a Group, Group-to-Group ownership, or any other corporate-shell-shaped relationship.

  > **Intent:** This is the action-layer (ADR-7) enforcement counterpart to the `items.member_id NOT NULL` schema constraint above. Where the schema prevents the *column-shape* of corporate-shell ownership, the action layer prevents the *writes* that would skirt it — proxying ownership through a system-Member that represents a Group, constructing Group-to-Group ownership relations through metadata fields, or any other path that ends up with a non-human entity as the load-bearing accountability for an Item or a Group. Specifically refused: (a) writes setting Item ownership to a Group (collapses back to the schema constraint), (b) writes establishing Group-to-Group ownership (parent-Group / child-Group structures that mirror a corporate hierarchy), (c) any other write that constructs a corporate-shell-shaped relationship by combining individually-legal operations. **Test for future proposals:** does this proposal want to add a write path that effectively gives a Group ownership of Items or other Groups, even indirectly through metadata or proxy Members? If yes, refuse — the no-impersonal-business-entity commitment (per [`../foundation/principles.md`](../foundation/principles.md)) is enforced at both layers; the action layer is the runtime guardrail that catches the writes the schema can't see (composed-from-legal-parts attacks).

## Policy posture

Per [`policy.md`](../foundation/policy.md):

**Default:** Members are not auto-assigned to Groups. The platform never enrolls based on geography, follow graph, or attendance. Joining is always explicit; the platform may *suggest* a Group based on follows or attendance (`source='soft_via_follow'`, `'soft_via_attendance'`) but those are surface-level only and do not grant addressability.

> **Intent:** This is the Nextdoor-failure-mode refusal at the policy layer. What's refused is *auto-enrollment with addressability* — putting Members into a Group-shaped constituency they can then be messaged in, without their explicit opt-in. The harm is structural: auto-enrollment creates a broadcast surface the Member never chose to be on, where bad-faith broadcasters get a free megaphone and the Members swept into the constituency lose control over who can address them. **The carve-out — soft suggestions are fine** — because they don't grant addressability. The platform may surface a candidate Group to the Member (via `source='soft_via_follow'` or `'soft_via_attendance'`); the Member converts the suggestion to explicit membership only by acting on it. Until they do, no other Member of the Group can address them. The distinction lives in the `source` enum: `explicit` = Member opted in, addressability granted; `soft_via_*` = platform's suggestion, addressability deferred until conversion. **Test for future proposals:** does this proposal want to add a path that puts a Member into a Group's addressable roster without explicit opt-in? If yes, refuse — that's the Nextdoor pattern. Does it want to *surface* a Group as a candidate to a Member (without granting addressability)? If yes, fine — that's the discovery utility the carve-out preserves.

**Three-filter analysis:**
1. *Helpful?* Yes — Groups give Members a way to recognize themselves as part of something larger, do work together, and let neighbors find them as units.
2. *Harms others?* No — joining a Group makes the Member visible as part of it; it does not impose obligations on anyone else. `staff` declarations require owner confirmation (b2) to prevent false claims.
3. *Abusable?* Limited surface area. Vectors: (a) false `staff` claims to ride on a Group's reputation — mitigated by confirmation flows; (b) public discovery of `family`-kind Groups exposing personal-life details — mitigated by `family` defaulting to `private`.

## What does not ship at b1

- Cooperative-style coordination (co-owning, voting, distributing) — deferred until real-world need; not in current scope. kind='business' Groups with multiple owner-role memberships cover the cooperative-shape use case for now.
  **Intent:** Voting and distributions are *off-platform* verbs (securities law, operating agreements, distribution checks, tax handling). Modeling them in schema before the platform's relationship to those verbs is clear paints into a corner — once `cooperative_governance_votes` exists, the platform implicitly owns the question of whether the vote is legally binding, which it isn't equipped to answer. Multiple owner-role memberships are enough to surface the *shape* of cooperative coordination without surfacing the legal obligations. When real-world need arrives, the answer is most likely a federation handoff to a cooperative-services platform (Loop 13), not a schema patch.
- Stewardship rotation algorithms — b2.
- Group feed / discussion surfaces — b2.
- Confirmation flows for `member` claims in business kind — schema reserves `confirmed_by_member_id` / `confirmed_at`; surface at b2.
- Locality promotion surface (badges, filters, ranking weight) — locality is computed at b1 for index purposes but the user-facing promotion UX ships at b2.
- Algorithmic Group recommendations beyond geographic and follow-graph suggestion. We do not build a Group discovery feed.

  > **Intent:** Two refusals here, both targeting the engagement-optimization failure mode (per [`../foundation/principles.md`](../foundation/principles.md) Part 3 Categorical Failures):
  >
  > 1. **No algorithmic Group recommendations beyond geographic + follow-graph.** The carve-out (geographic suggestion + follow-graph suggestion) preserves discovery utility — Members find Groups via signals that don't require behavioral profiling. What's refused is the engagement-ranked recommendation surface that would optimize for click-through, attention capture, or time-on-feed. Static, locality-and-relationship-derived suggestions answer the question Members are actually asking ("what's near me / what do people I know participate in?"). Engagement-ranked suggestions answer a different question ("what would maximize this Member's session length?") that the platform structurally refuses to optimize for.
  >
  > 2. **No Group discovery feed.** A Group discovery feed is the engagement-feed shape applied to Group recommendations — algorithmically ranked, designed to keep the Member scrolling. Distinct from the *Group feed / discussion surfaces* deferred to b2 (which are *within-Group communication*, a different shape). Refusing the discovery feed prevents the engagement-optimization failure mode from entering through the Group-recommendation surface specifically.
  >
  > **Carve-out clarity:** geographic suggestion (Groups within locality) + follow-graph suggestion (Groups your follows participate in) = allowed. Engagement-ranked feed of Groups = refused. **Test for future proposals:** does this proposal want to add a Group-recommendation surface that ranks by engagement-shaped signals (predicted click-through, dwell time, time-since-last-interaction, etc.)? If yes, refuse — that's the engagement-feed shape this commitment refuses. Does it want to surface Groups via geographic or follow-graph signals? If yes, fine — that's the discovery utility the carve-out preserves.

What ships at b1: the spine, the `group_businesses` child table (full), the membership table with role-per-kind validation, item integration (`items.group_id` rename + `brand_label` retirement), the standing-tier view, lifecycle / dormancy infrastructure, event log entries, action handlers.

## Integration points

- **Member** — Members hold zero or many Group memberships. Standing tier reads from `member_has_standing_presence`.
- **Item** — Items optionally file under a Group via `items.group_id`. Items always belong to their Member, never to the Group.
- **Location** — Groups optionally anchor to a Location. Locations carry Member *affinities* (live, work, play, visit, follow, liked — per `member_location_affinities`), not *memberships*. Affinities are lightweight, multi, asymmetric; memberships are named, addressable, intentional. If you want a named, addressable set of People organized to do something at or about a Location, you need a Group anchored to it.

  > **Intent:** Conflating Location-affinities with Group-memberships is the Nextdoor failure pattern (geographic auto-inclusion creates a constituency the platform then has to moderate) — the same failure mode the auto-assignment refusal at line 291 guards against, applied to the Location surface. Two records exist precisely because the distinction is load-bearing in the schema: `member_location_affinities` is multi-soft-asymmetric (a Member can have *liked* affinity with a Location without anyone there knowing); `group_memberships` is named-addressable-intentional (joining a Group makes the Member visible as part of it). When a future proposal wants to "send a notification to everyone at a Location" or "let Location followers post in a feed," the answer is: that's Group surface, not Location surface — anchor a Group there. **Test for future proposals:** does this proposal want to treat Location-affinity as if it were membership (addressable, listable, broadcast-targetable)? If yes, refuse — that's the Nextdoor pattern entering through the Location door. Affinities surface in privacy-preserving ways (per ADR-16 + the SECURITY DEFINER pattern at line 240); memberships are addressable.
- **Operation (retiring)** — Member Operations are absorbed into Group memberships. The remaining "personal commercial capacity" use case is covered by sole-prop Groups (a kind='business' Group of one with the Member as owner). The `member_operations` table retires once the migration completes.
- **Delegation** (b2+) — `staff_edit_items` Delegation scope from Group owner to Group staff member.
- **Action layer** (ADR-7) — every Group write goes through a named handler.
- **Event log** (ADR-6) — every Group event row carries `acting_member_id` + `via_delegation_id`.

## Open questions

1. **One-off sale Item kind.** ~~The "one-time sale" path uses `kind='product'`. Does it warrant a separate kind (`kind='listing'` for one-offs)? Probably no — the lifecycle distinguishes them.~~ **Resolved 2026-05-12 — Option A.** Same `items.kind='product'` row covers both casual and commercial modes; the Member's `kind='business'` Group state distinguishes them, not the Item kind. The composer's "recurring sale?" question (per the Selling, with or without a Group section) is the self-declaration trigger. Forward-looking rename consideration: `kind='listing'` may be a more accurate name than `kind='product'` since it covers both garage-sale and commercial uses; not changed in this pass — a multi-file rename, not a schema migration, if ever pursued.
2. **Social-capital framework.** ~~Member-level recognition (community-member rating, customer-happiness rating, endorsement graph) is anchored on the Member primitive and travels with the Member across Group endings.~~ ~~**Reframed 2026-05-12 — open.** The Member-anchored assertion is one of three framings under consideration; the others are Group-anchored / transferable and Hybrid (transfer-with-conduct-commitment).~~ **Resolved 2026-05-12 — Member-anchored.** PM ratified that social capital travels with the Member, not the Group — applies to founders and participants alike. Good behavior is rewarded by recognition that follows the person who did the good. The other two framings (Group-anchored / Hybrid) considered and refused: Group-anchored would let trust be sold without the conduct that earned it; Hybrid introduces adjudication complexity the platform isn't equipped for at b1. See line 125 Intent for the full reasoning. Schema commitment: any future ratings/endorsements table keys on `members.id`, not `groups.id`. Substantial-scale revisit is a separate OQ (see below).

3. **Social capital at substantial-scale Groups.** ~~When (or whether) a business Group's accumulated social capital should transfer to a new owner — depends on the social-capital framework above.~~ **Reframed 2026-05-12** — the social-capital framework is settled (Member-anchored). The remaining open question is specifically: when a Group reaches substantial scale (significant accumulated infrastructure, customer base, product catalog, operational complexity), the dissolve-and-recreate path becomes materially harmful. At that scale, the question re-opens — does Member-anchored hold (and we live with the recreation cost), or does the substantial-scale case warrant a different model (Group-anchored with strong conduct-monitoring, or a Hybrid framework)? Not b1; flag for design when substantial-scale Groups exist on the platform. See the substantial-scale gate OQ below.

4. **Substantial-scale gate for transfer / appointment / continuity design.** Transferability, appointment-based succession, and the social-capital-at-scale question (OQ #3) are all deferred until the platform sees Groups operating at substantial scale — Groups where dissolve-and-recreate would be materially harmful due to accumulated infrastructure, customer base, product catalog, operational complexity, etc. Until then, the b1 framings hold (founder-immutable operating-owner per line 78, founder-only revival per line 115, Member-anchored social capital per line 125, recreation-via-`established_on` for succession). Open: what threshold of size / complexity / accumulated value triggers the design work? Likely tied to observable metrics on the platform once it's running and has its first substantial Groups. Working answer: defer entirely until specific use cases surface; do not pre-design for hypothetical scale. Not b1; revisit at b2+ if the platform begins to see Groups at that scale.

5. **Locality verification / counter-gaming.** Locality depends on Member-declared `lives` affinity in `member_location_affinities` — self-declaration the platform cannot independently verify. Current incentive structure rewards gaming: owners benefit from claiming local-ness (locality-promotion to community members); the platform has no detection mechanism for "owner moved away but kept `lives` pointed at the old Location." **The trade-off shape: community-benefit vs. individual-cost (one Member's privacy vs. many Members' protection).** Collecting an owner's actual geo-location (GPS verification, mailing-address verification, document upload, etc.) helps the *community of Members* by protecting them from deceitful owners. It does not help the individual owner being verified — it imposes a privacy cost on them. This is an asymmetric trade-off the platform must navigate proportionally: how much privacy cost is acceptable for what level of community-protection benefit? **PM direction (2026-05-12):** some form of **interaction reconnaissance** — neighbors who interact with a Group / Member provide implicit signals (proximity-based interaction patterns, vouching, dispute mechanisms) that can corroborate or challenge declared locality. This shifts the verification burden from "owner uploads documents" (high individual cost) to "community implicitly confirms" (low individual cost, distributed across many Members) — a structurally better trade-off shape. Not b1; the mechanism design depends on having enough Member-Location interaction data to be meaningful (post-critical-mass). Until then, self-declaration is the input and the integrity gap is a known limitation of the locality-promotion mechanic.

6. **Group-coordination agents (platform-curated path).** Many Group-coordination use cases exist (calendar management, scheduling, member-onboarding, recurring-event coordination). The b1 path is platform-curated — the platform builds these agents centrally; a Group's operator opts the Group into using them via the operator's own Delegation. Open: what's the curation pipeline (who reviews, what scopes are available, how Groups discover and adopt)? Likely lives in `agent-assistance.md` (forward-looking, not b1) when that spec is built out. Member-invented Group-coordination agents are deferred — open whether a safe future design surface lets Groups create operation-specific agents themselves (with sufficient scoping, review, and protection for other Group Members). Both are future work; cross-references `agent-assistance.md` (forward-looking).

7. **Selling on behalf of others.** When does this graduate from "future shape" to "ship it"? Likely when the first canonical example demands it. Not b1.

8. **Behavioral pattern detection (post-critical-mass).** Self-declaration is the b1 trigger between casual and commercial workflows — the composer's "recurring sale?" question and the Member's choice to create a `kind='business'` Group are the only paths from casual to business. Open: at what platform scale does observed sales-pattern data (cadence, repeat customers, volume) become reliable enough to *suggest* (never auto-flip) Group creation to a Member showing consistent commerce behavior? Not before critical mass; the threshold itself is open. Until then, self-declaration is the only signal — behavioral observation is lossy without scale and invasive by default.

9. **Robust moderation policy.** Several Intent lines in this spec reference "subject to good-faith conduct; moderation can revoke." The platform needs a substantive moderation policy spec eventually — triggers for revocation, surfaces affected (one-off sale affordance, business-Group standing, locality promotion, Delegations, agent context), who adjudicates, due process, appeal path. Not b1; flag for future system spec. Until it exists, "moderation can revoke" is a hand-wave at a policy that doesn't have a home.

10. **Kind transitions.** Provisional b1 floor: no kind transitions; dissolve-and-recreate via `established_on`. Door left open for two specific shapes when use cases clarify: (1) **operator-scale transitions** (small → large; mostly within-kind, e.g., a small `kind='business'` Group growing into a complex multi-owner operation), (2) **non-income → income transitions** (community-kind → business-kind, e.g., Run Club starts selling apparel together; interest Group formalizes as a CSA). Open: are there other shapes worth designing for? What does the design look like — full in-place mutation (risky), wizard-driven dissolve-and-recreate-with-pre-filled-fields (safer middle path), or something else? Not b1; flag for design when specific use cases surface.

11. **Naming.** "Group" reads naturally as the data-model term and pairs with the existing public-facing "group" copy. Stick with "Group" unless usability data argues otherwise. UX language adapts per kind ("my bakery," "the Run Club," "school parents") — kind-appropriate copy throughout.
12. **Discoverability defaults.** `family` defaults `private`. Business default `listed` is right for ongoing commercial, but the platform may want `unlisted` for solo-prep-stage Groups. Defer the UX flow design.
13. **Confirmation requirements.** Business `member` claims need owner confirmation to prevent false claims. b1 ships claim with `confirmed_at = null`; b2 ships the confirmation surface. Confirm before b2 design.
14. **Locality proximity threshold.** Working answer: same metro / ~30-minute drive / "as the crow flies" distance. Concrete number TBD at index time — likely 25–50 miles for the Sacramento area. Confirm with first canonical examples.
15. **Permissions decomposition.** Today roles are fixed bundles enforced in the action layer. Future direction: `group_role_permissions(kind, role, permission)` + `group_member_permissions(group_id, member_id, permission)` for per-Member overrides. Enables custom roles (manager, kitchen lead) and granular per-Member adjustments without role-enum churn. Not b1; flagged here so it isn't forgotten.
16. **Migration mapping from `member_operations`.** Each existing row maps to a Group + membership pair:
    - `sole_personal` / `side_personal` → kind='business' Group of one, founder=Member, role='owner'.
    - `partner` → kind='business' Group with the earliest-declared partner as founder; other partners as additional role='owner' memberships. The founder's role as operating owner is permanent under the new model; if real partnerships need a different lead, they form new Groups.
    - `cooperative_member` → no migration target; cooperative coordination is deferred. Existing rows archive in place pending the eventual cooperative spec.
    - `staff` → kind='business' Group membership, role='member' (renamed from `staff`). The `operating_for_member_id` Person-to-Person link retires; the linked operator becomes the Group's founder/owner.
    - `volunteer_organizer` → steward role on the relevant non-business Group (often kind='event_anchored' from a recurring Gathering Item).
    The migration ticket sequence needs careful design — flagged for `planning/rebuild-plan.md` revision.

## Comments

This spec is the consolidation step that follows from "everything is a primitive." `item.md` did this for things-being-declared. `groups.md` does it for people-organized-around-something on the platform. The fragmentation of Community / Cooperative / Business across separate specs and a Member Operations primitive was the symptom of premature differentiation — calling out kinds as separate systems before recognizing they shared a spine.

The spine + child architecture is the key compromise. Communities don't need everything Businesses need (display name, legal entity attributes, ownership locality). One table forces JSONB for everything; many tables fragment cross-kind queries; spine + child gives strong typing per kind without sacrificing the cross-kind reads.

The structural refusal of corporate personhood is encoded throughout. Items always FK to Members. Money flows are visible and accountable — both parties always know who they're dealing with, and recipients can be Members, Groups of Members, or identified external recipients per `payments.md` and `agent-commerce-and-project-amendments.md` §5. Groups can't sign or own. They dissolve when their people leave. This is what keeps the platform faithful to the people-first commitment when the schema gets stressed at scale.

The on-platform-vs-off-platform line is the second structural commitment. The platform's verbs are what *happens here*. Off-platform legal coordination — cooperative governance, voting, distributions, securities filings — is a separate concern that the platform isn't yet ready to mirror. Deferring cooperative-style coordination until real-world need emerges is the right call for now: when the day comes that the platform's relationship to off-platform legal coordination has clarified and Members express a clear need for in-app coordination tools, the spec can extend with new kinds, new child tables, and new event types without disturbing the affiliate / operate spine that ships now.

The composer's "one-time, or ongoing?" question is the friction-asymmetric path that honors how people actually start. Most first-time sellers are not starting businesses. The platform that makes them feel like they are will turn them away. The platform that lets them sell their loaf, and offers — but does not impose — the path to a Group when they decide to keep doing it, will keep the door open without forcing a costume.

Operations as a primitive dies in this consolidation. Its purpose was to capture *what commercial work a Member is doing and in what capacity* without modeling Businesses. Once the platform admits that "what work is being done" is best modeled as **the Group the Member is operating through**, Operations becomes redundant. The Group is the answer to "what commercial work, in what shape, with whom, under whose responsibility." Operations was answering the same question with weaker tools.

The Group of one is the same shape as the partnership of three or the bakery-with-members. The platform does not differentiate by Member count. The granularity that matters for Buy Close is not how many people own the operation but where the money goes — and the locality test makes that visible structurally: an owner Member's current Location vs. the Group's anchor Location is the live signal of whether wealth created here stays here. When an owner moves away, the Group stops being locally owned, the platform stops promoting it, and the system honestly reflects what's happened: the wealth this operation generates now flows out of the community.

## Decisions encoded here

This spec is the live home for the following architectural decisions. See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register; the entries below are the single-system decisions whose status banner in this file *is* the load-bearing ratification (until ADR-13 is written).

| ADR | Status | What lives here |
|---|---|---|
| ADR-8 | **SUPERSEDED** 2026-05-10 | The `member_operations` primitive retires. Capacities (sole-prop / partner / staff / cooperative-member / volunteer-organizer) are absorbed into kind='business' Group memberships with role-per-kind. Standing-tier gate `member_has_standing_presence` redefined here: ≥1 active membership in kind='business' Group OR steward-role membership in any non-business Group. Historical text in [`../../_attic/2026-05-19/planning/DECISIONS-superseded-2026-05-10.md`](../../_attic/2026-05-19/planning/DECISIONS-superseded-2026-05-10.md). |
| ADR-11 | **SUPERSEDED** 2026-05-10 (framing softened 2026-05-12 per `agent-commerce-and-project-amendments.md` §2) | Cooperative-style coordination (co-owning, voting, distributing) **deferred until real-world need + explicit user prioritization**. No `cooperatives` / `cooperative_assets` tables, no `cooperative_cohort` Item kind, no `pledge_intent` response_kind — these architectural decisions stand as current-scope. Cooperative-shape use case ships at b1 as kind='business' Group with multiple owner-role memberships. Historical text in [`../../_attic/2026-05-19/planning/DECISIONS-superseded-2026-05-10.md`](../../_attic/2026-05-19/planning/DECISIONS-superseded-2026-05-10.md). |
| ADR-13 | **Pending formal write-up** — this status banner is the ratification | Group consolidation. Community / Member Operations / Cooperative absorbed into one Group primitive with spine + child architecture and six kinds at b1: five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) + one operate (`business`). |

This spec also reflects ADR-12's supersession (per `agent-commerce-and-project-amendments.md` §6): the kind='business' Group walkthrough replaces the prior "Become a Maker" CTA, and selling tools surface from Group / Item state rather than from a Member-level toggle. The live home of ADR-12 (now superseded) is [`member.md`](member.md).

This spec also *encodes* (but does not own) ADR-16 (per-row privacy on `member_location_affinities`): the locality-promotion derivation in the **Locality and promotion** section above is the load-bearing surface — it calls `public.member_is_local_to_location()` rather than JOINing against `member_location_affinities` directly. ADR-16 lives cross-cutting in [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md).
