# DECISIONS — Superseded ADRs

> Archived from the active [`../DECISIONS.md`](../DECISIONS.md) on 2026-05-10 as part of the journal/decisions weight-reduction. These ADRs are no longer load-bearing — their live successor decisions live in the system specs cited in each banner. Preserved here for trace.

For pre-mission-clarity decisions, see [`DECISIONS-pre-mission-clarity-2026-05-08.md`](DECISIONS-pre-mission-clarity-2026-05-08.md).

---

## ADR-3: Maker profile is implicit, not claimed

**Status:** SUPERSEDED 2026-05-10. The implicit-from-behavior model is **rejected** — superseded by ADR-12 (Maker is an explicit, declared, toggle-able role) and again by the 2026-05-10 Groups ratification (the underlying primitive is now kind='business' Group memberships). Live decision: [`product/systems/member.md`](../../product/systems/member.md) status banner + [`product/systems/groups.md`](../../product/systems/groups.md).

**Original date:** 2026-05-08

**Original status:** Accepted

**Context:**
A Member who makes things (sourdough, candles, jam, knives) is a Maker. Open question: do they explicitly opt in to a "Maker mode" — a toggle in `/you`, a separate onboarding step — or does the platform notice they're making things and surface Maker affordances accordingly? People-first framing argues for the latter.

**Decision:**
The Maker profile is **implicit and behavior-derived.** A Member becomes a Maker by *posting things for sale or trade that they make.* No Maker toggle, no claim flow, no separate onboarding. The Member's profile reveals Maker sections (products, appearance schedule, followers count) only when they have product Items; otherwise those sections do not exist on the page.

The platform captures *frequency* as a signal of bona-fide-Maker status. A Member who posts one product once is not yet a Maker in any meaningful sense; a Member who posts regularly, appears at recurring Locations, and accumulates followers is. The signal lives as derived data (not a self-asserted role) so it cannot be gamed by claiming an identity without doing the work.

**Consequences:**
- The Member profile renders sections conditionally: Maker affordances appear when product Items exist; they vanish when none do. No empty-state Maker sections.
- A `member.maker_signal` derived view is needed (read from event log + `items` count + recurrence). Not a column on `members` — a query/view that ranks Members by Maker activity. Deferred to a separate ticket; not blocking b1.
- "Open a Maker shop" / "Become a Maker" CTAs are not built. The CTA is just "List a product" — listing it makes you one.
- The `community-platform.md` /You Maker section appears when the Member has products, not when they flip a switch.
- The legacy `vendor-*` system files in tree need re-anchoring on this implicit model in Phase 6 of the migration. Do not extend them with explicit-claim assumptions.

---

## ADR-8: Member Operations supersedes ADR-3's derived maker_signal

**Status:** SUPERSEDED 2026-05-10 by the Groups ratification. The `member_operations` primitive **retires**; its concerns (sole-prop / partner / staff / cooperative-member / volunteer-organizer capacities) are absorbed into kind='business' Group memberships per [`product/systems/groups.md`](../../product/systems/groups.md). The standing-tier gate `member_has_standing_presence` is redefined in `groups.md`: ≥1 active membership in kind='business' Group OR steward-role membership in any non-business Group. ADR-3's other commitments remain rejected per ADR-12.

**Original date:** 2026-05-09

**Original status:** Accepted (supersedes the `maker_signal` derivation in ADR-3; ADR-3's other commitments remain in force)

**Context:**
ADR-3 (Maker profile is implicit, not claimed) introduced the `member.maker_signal` derived view as the mechanism for surfacing Maker affordances based on behavior — post frequency, Item count, recurrence, follower count. The derivation was deferred to a separate ticket and never specified.

The independent architectural review of the agent-assistance specs (and subsequent PM review) surfaced three concerns with the derived-signal approach:

1. **Gameable.** A signal that derives from posting behavior creates incentives to post for the signal rather than for the work.
2. **Opaque.** Members cannot easily see what their `maker_signal` is, what threshold they're below, or what would change it. This is the opposite of the platform's transparency commitments.
3. **Insufficient capacity.** ADR-3 captures "is this Member acting as a Maker" but cannot capture *in what capacity* — sole proprietor vs. side business vs. cooperative member vs. staff working for someone else's operation. The PM raised the staff/business/side-hustle distinction explicitly: ADR-3's mechanism cannot honor it.

In parallel, the agent-assistance system specs (Self-Record, Skills) needed a clean standing-tier gate. Two undefined views (`maker_signal` from ADR-3, `member_standing_signal` introduced in `member-self-record.md`) gating real user-visible behavior was the kind of phantom dependency the architectural reviewer correctly called out.

**Decision:**
Introduce **Member Operations** (per `product/systems/member-operations.md`, since RETIRING) as the explicit, Member-authored declaration of what commercial work the Member is doing and in what capacity. The capacity enum is `sole_personal`, `side_personal`, `partner`, `cooperative_member`, `staff`, `volunteer_organizer`. A Member can hold multiple Operations.

The standing-tier gate becomes **`member_has_standing_presence`** — a Member with at least one active Member Operation, regardless of capacity. This view replaces both `member.maker_signal` (ADR-3) and `member_standing_signal` (member-self-record.md draft). It is declared, dated, and ungameable.

**Consequences:**
- A new system spec (`member-operations.md`) joined the canon. Now RETIRING per the 2026-05-10 Groups ratification.
- The `member_self_record.md` and `skills.md` standing-tier references update to point at `member_has_standing_presence` (now Group-derived).
- The Item composer's `brand_label` field integrates with the Member's affiliations.
- The PM-raised distinction between sole-personal, side, partner, cooperative, staff, and volunteer-organizer is first-class data — now expressed via kind='business' Group memberships and roles.
- People-first holds: there is still no Business entity. The capacity is a label on the Member's affiliation, not a row in a `businesses` table.

---

## ADR-11: Cooperative is a separate entity from Community

**Status:** SUPERSEDED 2026-05-10 by the Groups ratification. Cooperative-style coordination (co-owning, voting, distributing) is **deferred indefinitely** — the verbs happen off-platform (securities filings, formal votes, distribution checks, governance under operating agreements), and the platform's relationship to off-platform legal coordination is not yet well-understood. **Schema reservations from this ADR are dropped:** no `cooperatives` table, no `cooperative_assets` table, no `cooperative_cohort` Item kind, no `pledge_intent` response_kind, no `cooperative_*_events`. The cooperative-shape use case is served at b1 by kind='business' Groups with multiple owner-role memberships per [`product/systems/groups.md`](../../product/systems/groups.md). When the platform's role re off-platform legal coordination clarifies, a future spec revisits cooperative-specific affordances.

**Original date:** 2026-05-09

**Original status:** Accepted

**Context:**
The orphan `cooperatives.md` document (now relocated to `product/systems/cooperative.md`, RETIRING) introduced a `cooperatives` legal-entity table, share ledgers, off-platform legal handoff to counsel, three-tier federation (Local / Regional / National), governance votes, distributions, and asset records. The platform's existing `community.md` already had `kind='cooperative'` as one of six Community kinds. Open question prior to this ADR: is a Cooperative best modeled as (a) the Community of `kind=cooperative` itself, (b) a separate entity row referenced from such a Community, or (c) something else?

The orphan file's content makes a strong implicit argument for (b). A Community is the affinity primitive — *the we that decides we are a group.* A Cooperative is the legal entity primitive — *the LCA / LLC / Cooperative Association that holds title to assets.* Conflating them collapses two distinct lifecycles, two distinct governance scopes, and two distinct data shapes into one row, and it loses the Mondragon-pattern federation architecture (federations are *of Cooperatives*, not of Communities). PM review confirmed (b) at the time; the 2026-05-10 ratification reverses (b) to defer the question entirely.

**Decision:**
A Cooperative is a separate primitive from Community. Three distinct rows connect a Member to a co-owned asset: an Item of `kind='cooperative_cohort'` (formation-period posting), a `cooperatives` row (registered legal entity), and the Member's `cooperative_member` Operation. The Community of `kind='cooperative'` is the optional affinity wrapper. B1 ships schema reservation only; b3 ships the surface.

**Consequences (now obsolete):**
- A new system spec joined the canon: `product/systems/cooperative.md` (RETIRING).
- B1 schema reservation: `cooperative_cohort` reserved as `items.kind`, `cooperatives` and `cooperative_assets` empty, `member_operations.cooperative_id` reserved. **All dropped 2026-05-10.**
- `community.md` kind=cooperative cross-reference. **Obsolete; community.md is RETIRING.**
- Off-platform legal handoff structural at T1, securities-law posture confirmation pending. **Deferred indefinitely.**

---
