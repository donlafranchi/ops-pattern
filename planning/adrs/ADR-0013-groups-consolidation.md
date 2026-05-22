# ADR-0013: Group consolidation — Community / Member Operations / Cooperative absorbed into one primitive

**Status:** Accepted
**Date:** 2026-05-10
**Deciders:** PM
**Scope:** The Group primitive replaces three previously-separate specs (Community, Member Operations, Cooperative). One spine + child architecture, six kinds at b1
**Touches:** `product/systems/groups.md` (canonical home — long-form text lives here), `_attic/2026-05-19/product-systems/community.md`, `_attic/2026-05-19/product-systems/member-operations.md`, `_attic/2026-05-19/product-systems/cooperative.md` (predecessor specs, archived 2026-05-11), `product/foundation/primitives.md` (Group is now one of three core primitives + Group), `product/systems/member.md` (cross-references), `product/systems/item.md` (cross-references — Item belongs to Member, may be attached to Group), `product/systems/location.md` (cross-references — Group anchors to Location)
**Supersedes:** ADR-8 (Member Operations primitive retires), ADR-11 (Cooperative as separate entity retires), ADR-12 (Maker-mode framing retired per agent-commerce amendments §6)

## Decision

The Community, Member Operations, and Cooperative primitives are retired and absorbed into a single **Group** primitive. Group uses a spine + child architecture (mirroring [`item.md`](../../product/systems/item.md)): one `groups` spine table plus per-kind child tables for kind-specific fields.

Six kinds ship at b1:

- **Affiliate kinds (5):** `place`, `interest`, `practice`, `event_anchored`, `family`. Self-selected, intentional, emergent. Never auto-assigned by geography or behavior.
- **Operate kind (1):** `business`. Replaces both the prior "vendor" framing and the "cooperative" framing. A sole proprietor is a kind='business' Group of one. A partnership is a kind='business' Group with multiple owner-role memberships. A cooperative-shape operation is a kind='business' Group with multiple owner-role memberships — schema is identical; coordination mechanics (voting, distributions) deferred until real-world need.

Kind is locked at create. Groups never transition kind — a Practice Group that adds a commercial side becomes a *new* kind='business' Group; the original keeps its history.

The platform's grammar becomes: **People form Groups to do things using Items, attached to Locations.** Some Groups affiliate; some operate; all are people, never persons (structural refusal of corporate personhood).

## Trade-offs

The three predecessor specs (Community, Member Operations, Cooperative) each modeled a slice of multi-Person coordination, with overlapping concepts and divergent vocabularies. Three specs meant three places to look for "how do groups of people work on this platform," three sets of capacities to memorize, three event-log namespaces, and three migration paths to track. The consolidation gives the platform one answer to that question.

The cost: the new spec is larger than any one of the three predecessors, and the six-kind enumeration carries the semantic weight that was previously distributed. Mitigated by the spine + child architecture — the spine is small, the child tables hold the variation, and adding a seventh kind (when one is justified) doesn't disturb the spine.

The deferral of cooperative-style coordination mechanics (voting, distributions, governance) is the most consequential consequence. The decision: do not build coordination tooling for a workflow that doesn't have real-world demand yet. When demand emerges, kind='business' Groups with multiple owner-role memberships are the foundation; child tables or additional kinds can be added without disturbing the spine.

## Consequences

- `groups.md` is the live home for the long-form spec. The spec's Status banner (line 3) is the user-facing ratification; this ADR is the canonical record.
- Predecessor specs ([`community.md`](../../_attic/2026-05-19/product-systems/community.md), [`member-operations.md`](../../_attic/2026-05-19/product-systems/member-operations.md), [`cooperative.md`](../../_attic/2026-05-19/product-systems/cooperative.md)) live in `_attic/2026-05-19/product-systems/` for historical reference. Do not cite as live.
- The cooperative-coordination deferral preserves the schema reservations from the prior ADR-11 (no `cooperative_cohort` Item kind, no `cooperatives` table, no `cooperative_*_events` table) as current-scope decisions — correct for now, revisitable when real-world need + explicit user prioritization emerge.
- The "Maker mode" framing from ADR-12 dissolves with this consolidation. Selling tools surface from Group/Item state (kind='business' Group membership or `items.kind='product'` / `'service'`), not from a Member-level toggle. `members.maker_mode_enabled` is dropped.
- The "Seller" vocabulary becomes the generic UI term; "Producer" is preferred in agricultural/food context; "Maker" survives only as a Member self-identification label.
- Standing-tier gate (per `groups.md`): ≥1 active membership in kind='business' Group OR steward-role membership in any non-business Group.
- This ADR forecloses a path where Communities, Cooperatives, and Businesses are modeled as separate entities. Reversible at significant cost — would require re-splitting the spine, re-homing fields, re-deriving all cross-references. The foreclosure is the point: one primitive, one home, one set of rules.

## Action Items

1. [x] Decision ratified 2026-05-10.
2. [x] `groups.md` Status banner is the user-facing ratification (line 3).
3. [x] Predecessor specs archived 2026-05-11.
4. [x] Pointer line in `../DECISIONS.md` pointer index.
5. [x] ADR-8, ADR-11, ADR-12 status updated to Superseded with link back to this ADR.
6. [ ] Cooperative-coordination revisit trigger: documented real-world cooperative operation + explicit user prioritization.
