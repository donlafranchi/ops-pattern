# ADR-0009: Policy framework — three-filter test, opt-out default, anti-Nextdoor commitments

**Status:** Accepted (anti-Nextdoor framing softened 2026-05-12)
**Date:** 2026-05-09
**Deciders:** PM
**Scope:** Every system spec that introduces a policy surface — data sharing, monetary flow, visibility, agent action, complaint handling, content moderation
**Touches:** [`product/foundation/policy-framework.md`](../../product/foundation/policy-framework.md) (canonical home — entire document carries the load-bearing prose), every system spec under [`product/systems/`](../../product/systems/) (must include a "Policy posture" section when touching a policy surface), [`product/systems/member.md`](../../product/systems/member.md) (DM substrate — no `location_id` column ever per anti-Nextdoor commitment), [`product/systems/groups.md`](../../product/systems/groups.md) (group-scoped messaging only), ADR-16 (per-row privacy on `member_location_affinities` — the hard architectural floor under this ADR's privacy commitments), [`product/foundation/people-first.md`](../../product/foundation/people-first.md), [`product/foundation/foundational-principles.md`](../../product/foundation/foundational-principles.md) Part 3 + Part 8

## Decision

Every policy surface (data sharing, revenue, monetary flow, visibility, agent action, complaint handling, content moderation) is evaluated against a **three-filter test**:

1. **Helpful?** — does this serve a Member-side benefit, named concretely?
2. **Harmless?** — does this avoid foreseeable harm to Members, including the opted-out?
3. **Abuse-resistant?** — does this design hold up under bad-faith use by Members, third parties, or the platform itself in a future failure mode?

A proposal that cannot articulate its three-filter answer in the spec does not ship.

**Opt-out is the default.** Every policy that introduces a new data flow, visibility surface, or agent capability ships with the Member opted-out by default. Opt-in is an explicit Member action. The opt-out default applies to:

- Data participation in cross-Member analytics, peer benchmarks, or any aggregate signal.
- Visibility of `member_location_affinities` rows beyond owner-only.
- Inclusion in any feed, suggestion surface, or matching system the Member did not consciously join.

Every system spec touching a policy surface carries a **Policy posture** section that:

- States the three-filter answer in the spec.
- Names the opt-in design (what the Member sees, what they consent to, how revocation works).
- Names the abuse-resistance design (what the platform refuses, what the database enforces, what the audit log captures).

**Anti-Nextdoor commitments (softened 2026-05-12):**

The anti-Nextdoor framing is about *messaging-scope and complaint-handling*, not about the *absence of Member↔Location relationships*. Specifically:

- **Messaging is item-or-group at b1.** No Location-scoped messaging surface. The DM substrate (`member_threads`) ships with `group_id` only — no `location_id` column ever. (Structural prevention.)
- **Location-scoped surfaces are designed carefully when they appear.** Multi-Location belonging (`member_location_affinities`) is allowed; what's refused is the Nextdoor-style location-locked feed that becomes a complaint magnet.
- **Push-back on complaint-only behavior.** Complaint downvote / removal. The fix-it path is offered but never forced.

ADR-16 (per-row privacy on `member_location_affinities`) is the hard architectural floor under these commitments — the RLS enforcement is non-negotiable; the surface design above it is a per-feature conversation.

The full prose lives in [`policy-framework.md`](../../product/foundation/policy-framework.md). This ADR is the canonical index entry.

## Trade-offs

The dominant alternative — case-by-case policy reasoning without a shared framework — was rejected because it fragments the platform's promise to Members. A Member who opts out of cross-Member analytics needs to know they opted out of *everything that is cross-Member*, not "the seven cross-Member surfaces we happened to remember to gate." The three-filter test plus the opt-out default give the Member a single mental model.

The opt-out-default cost is real: features that benefit from broad participation (peer benchmarks, region-wide signal, federation-grade match quality) ship with a smaller dataset on day one. Mitigated by the rule that *every* feature opting Members in is communicated as a benefit the Member can choose, never as a default they have to discover and undo.

The anti-Nextdoor framing was the most-contested piece of this ADR. The 2026-05-08 framing said "no Location-scoped surfaces at all"; the 2026-05-12 softening narrowed the refusal to messaging-scope + complaint-handling, while preserving Member-Location relationships (`member_location_affinities`) as productive substrate. The softening cost: surfaces that ride on Location-affinity data (Concerts-in-the-Park feed, locality-promotion in Groups) now need their own three-filter analysis — they don't inherit a categorical refusal. The benefit: features that serve Loop 3 (Land here) and Loop 4 (Gather regularly) can ship without the framing fighting them.

ADR-16's RLS enforcement is the architectural floor: even when a surface "loosens" the anti-Nextdoor framing to allow a Location-shaped read, the underlying `member_location_affinities` row is owner-only at the row level. The surface reads through a SECURITY DEFINER function with a specific access pattern, not by reading the table directly.

## Consequences

- Every new system spec touching a policy surface includes a "Policy posture" section. Specs without one fail review (pipeline-review gate).
- The opt-out default applies to every new feature; opt-in is an explicit Member action with a named consent surface.
- The DM substrate ships with `group_id` only (per [`member.md`](../../product/systems/member.md) Phase 1 migration `007e_member_threads.sql`). The `location_id` column **never** lands. Structural.
- `member_location_affinities` ships at b1 substrate-only; surfaces ship at b2 with their own three-filter analysis per surface.
- ADR-16's per-row privacy on `member_location_affinities` is the load-bearing RLS floor.
- The "abuse-resistant" filter has surfaced concrete refusals: no engagement-shaped ad injection (per `foundational-principles.md` Part 3, narrowed 2026-05-12 from "ads of any kind"), no Member-data sale, no venture capital funding (Part 8, 2026-05-12), no aggregate surveillance even on transacting Members.
- This ADR forecloses a path where the platform ships a Nextdoor-style location-locked feed even under a different name. Reversible only by replacing this ADR — a deliberate architectural change, not a per-feature decision. The foreclosure is the load-bearing safety guarantee for the platform's "messaging-scope, not location-scope" promise.

## Action Items

1. [x] Decision ratified 2026-05-09; anti-Nextdoor framing softened 2026-05-12 (per JOURNAL entry; the canonical prose in `policy-framework.md` carries the revision).
2. [x] [`policy-framework.md`](../../product/foundation/policy-framework.md) is the canonical home for the full prose.
3. [x] Pointer line in [`../DECISIONS.md`](../DECISIONS.md) pointer index.
4. [x] ADR-16 lands the per-row RLS floor on `member_location_affinities`.
5. [ ] Every Phase 1 / Phase 2 / Phase 3 system spec ships with a Policy posture section.
6. [ ] pipeline-review gate enforces Policy-posture presence for any new policy surface.
