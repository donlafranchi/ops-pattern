---
id: memo-0026-metro-default-feed-depth
purpose: Reverses city-as-default feed depth to metro-as-default. Metro polygon becomes the out-of-box discovery scope; city/neighborhood granularity deferred to b2.
layer: what
status: proposed
---

# memo-0026: Metro is the default feed depth

**Status:** Proposed
**Date:** 2026-09-02
**Deciders:** PM
**Scope:** Default discovery scope for the community-awareness feed — metro replaces city as the out-of-box depth.
**Touches:** `product/systems/discovery.md`
**Supersedes:** Intent (Ratified 2026-05-23) in `discovery.md` § Community-awareness feed — "City is the default depth … metro-scope opt-in"

## Decision

Metro polygon is the default feed depth. A Member's community-awareness feed scopes to their `home_metro_id` polygon via `ST_Intersects` from sign-up. City and neighborhood granularity controls are deferred to b2. There is no metro "opt-in" toggle at b1.

## Options considered

| Option | Description | Verdict |
|---|---|---|
| **A — Metro default** | Feed scopes to the metro polygon out of the box. Members see Items across the full metro (Oak Park member sees Folsom, Roseville, Davis). Granularity controls ship in b2. | Chosen |
| B — City default, metro opt-in | Feed scopes to up-to-city by default. Metro scope requires a Member setting toggle. Original ratified decision. | Reversed |
| C — Radius default | Feed scopes to a configurable mile radius. No polygon dependency. | Rejected — loses the named-community framing ("Sacramento metro") and introduces a tuneable that most Members won't touch. |

## Trade-offs

The original city-default decision (Ratified 2026-05-23) reasoned that city scope was "legibly local" and that metro scope "risks diluting the locality signal with cross-city noise." That reasoning assumed a mature user base producing enough Items to fill a city-scoped feed. At b1 scale, the opposite is true:

1. **More discovery out of the box.** A Member in Oak Park immediately sees Items from Folsom, Roseville, Davis without finding and flipping a setting most Members won't discover. The platform's value proposition — connect with what's happening near you — lands on first feed load, not after a settings detour.

2. **Fewer dead feeds in small cities.** A city-scoped feed in a city with 3 listings is useless. Metro scope gives critical mass from day one. The platform cannot afford empty feeds during the launch window when first impressions determine retention.

3. **The "diluting locality signal" concern is theoretical at b1 scale.** With a small user base, more signal (metro) beats less noise (city). The noise problem emerges only when the metro has hundreds of Items competing for attention — a good problem that b2 granularity controls are designed to solve.

4. **Granularity controls ship in b2.** Members who want a tighter view can filter by neighborhood or city when those controls land. Metro-as-default with future narrowing is a better UX arc than city-as-default with future widening — the first delivers value immediately and lets Members opt into precision; the second withholds value and asks Members to opt into breadth they didn't know existed.

**What this costs:** Members in dense metros (if the platform reaches that scale before b2) may see Items from areas they don't consider "their community." This is a b2 problem solvable by granularity controls, not a b1 problem worth solving by starving the feed.

## Consequences

- `discovery.md` § Community-awareness feed: the Intent block (Ratified 2026-05-23) is superseded. The spec language changes from "default traversal depth is up to city … metro-scope opt-in" to "default scope is the Member's metro polygon." Intent: Metro gives critical mass at launch scale; granularity controls in b2 let Members narrow once there's enough signal to filter. **(Ratified 2026-09-02)**
- F031 scenario (`scenario-F031-member-manages-place-interest-scope.md`) is unblocked — its metro-as-default language now matches the spec. Gate A clears.
- The `locality_feed_items` RPC refactor (F031 implementation) targets metro-polygon `ST_Intersects` as the primary query path, not as an opt-in branch.
- No metro opt-in toggle ships at b1. The Member settings surface for feed scope is deferred to b2 with the granularity controls.
- The b2 granularity-control scenario must include a "narrow to city/neighborhood" affordance — the default-metro decision creates that obligation.

## Action Items

1. [ ] Update `discovery.md` § Community-awareness feed — replace the reversed Intent block with metro-default language and cross-reference this memo.
2. [ ] Confirm F031 scenario's Gate A clears (metro-default language matches spec).
3. [ ] Update `JOURNAL.md` with ratification entry after PM accepts.
