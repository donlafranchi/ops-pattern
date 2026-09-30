---
id: what-discovery
purpose: One scoring core for feed, search, and notifications — the hard constraints on how ranking may work.
layer: what
status: active
---

# Discovery

*Index of every product doc and its settled rules: [`../README.md`](../README.md).*

One scoring core powers the home feed, Explore, search, related-items, and notification ranking — a graph + place + time engine, not a watch-time optimizer. Each engagement (RSVP, pledge, show-up, return) is heavy and meaningful; volume is local, not global, so the system has to rank well in low-data regimes and degrade gracefully for a new Member or a new Location.

## Hard constraints — load-bearing, not tuning knobs

**Ranking doesn't favour a member because of payment, size or follower count, or amplify corporate shells over Members** (2026-09-30). This is the single highest-leverage place a chains-vs-locals bias could enter the platform — once a size-correlated signal is in the score, it's in every surface that uses the score. The constraint lives in the scoring formula itself, not in review process, so "just rank by popularity" is structurally unavailable without modifying the scorer — which is exactly the point where policy review has to happen.

**Personal businesses are first-class; no "verified business" boost.** **Communities are emergent — we currently don't auto-assign a Member to a Community-scoped feed.**

## Computed, not stored — the community-awareness feed

The locality-first feed is computed at query time from a Member's private place-interests and interest tags — no per-location "follow" edge table participates in feed generation. This is deliberate: a stored follow-edge set turns every product question toward "how do we get more of them," which is the engagement-metric trap. Computation over the Member's own private interests keeps the feed structurally Member-driven and resistant to follow-graph gaming. A materialized view or cache under the same query is fine as a performance optimization; a stored edge that becomes its own product surface ("12 members follow this venue") is not.

## Inactive businesses are demoted, not hidden or state-changed

A `kind='business'` Group with no qualifying platform activity (posts, fulfillments, gathering occurrences) over a rolling window gets a surfacing-weight demotion in promoted positions — not archived, no state change, no public "inactive" label, still fully reachable by direct URL or explicit search. This keeps two questions separate that lifecycle machinery used to conflate: *does the Group continue to exist* (answered by membership alone) versus *does anyone see it in a promoted surface* (answered here, by observable action only — not by the platform guessing whether a business is "really" dormant, which it has no reliable signal for).

## Weights are hand-tuned and in-code on purpose

Every weight change is a code-review event, not a config toggle — a config-driven knob would let ranking drift without an explicit decision, which is exactly the door engagement-optimization would walk through disguised as a routine tuning change. Weights move to data-driven tuning only once real behavioral data exists to tune against.

## Anti-patterns — do not build

Watch-time or dwell-time as an objective. Infinite scroll with no daily cap — discovery should feel curated, not endless. Any boost tied to payment, "promoted" status, or business size. Auto-membership in a Group from engagement alone — soft signals (follows, attendance) compute at query time and don't write a membership row. Unlogged ranking — every call must log its candidate set and score breakdown, because that log is the only path to a smarter ranker later.
