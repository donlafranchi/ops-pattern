# System: Discovery

**Purpose:** Connect Members with Items they will love. The substrate for every feed, search result, and "related" surface. One scoring core, multiple surfaces.

**Bundles:** b2 (T1), b3 (T2), deferred (T3) — *PM to confirm bundle placement*

## Principle

Movers, Makers & Shakers is a place-based, people-first network — not an attention network. Discovery is a **graph + place + time** engine, not a watch-time optimizer. Each engagement (RSVP, pledge, show-up, return) is heavy and meaningful; volume is local, not global. The system must rank well in low-data regimes and degrade gracefully as a Member or Location is new.

**Hard constraints (from `foundation/principles.md`):**

- Never rank by business size, follower count alone, or anything that amplifies corporate shells over Members.
  **Intent:** Discovery is the single highest-leverage place a chains-vs-locals bias could enter the platform — once it's in the score, it's in every surface that uses the score. Forcing the constraint into the *scoring formula itself* (rather than into review process or content moderation) makes "but it would just be more relevant to rank by popularity" structurally unavailable; the feature can't ship without modifying the scorer, which surfaces the policy review at the point of code change. Any future weight that correlates with size proxies (review counts, follower-count standalone, listing age treated as authority) should be read as the failure mode this constraint refuses.
- Personal businesses are first-class; no "verified business" boost.
- Communities are emergent — never auto-assign a Member to a Community-scoped feed.

## Surfaces

One scoring core powers:

- **Home feed** — personalized stream of Items for a Member.
- **Explore** — Location- or Loop-scoped browsing for non-personalized discovery.
- **Search** — query-conditioned ranking over the same candidate set.
- **Related Items** — on Item detail, "more like this near you."
- **Notifications (rank-only)** — which candidate notifications to actually send.

Surfaces differ in candidate set, slot count, and recency window. Scoring math is shared.

## T1 — MVP Tier (hand-tuned scored query, no ML)

**Candidate generation.** For a Member `m` viewing surface `s`, gather candidates from:

1. Items by People `m` follows (verb edges: makes, services, convenes).
2. Items at Locations `m` has engaged with (visited Item detail, RSVPed, pledged).
3. Items in `m`'s geographic radius (default 10 miles, configurable).
4. Items by People followed by People `m` follows (2-hop graph, capped).
5. Trending Items in `m`'s radius (recent engagement velocity).

Cap candidate set at ~500 per request; rank locally.

**Scoring formula.**

```
score(item, member) =
    w_graph    · graph_proximity(member, item.creator)
  + w_loop     · loop_affinity(member, item.kind)
  + w_loc      · location_decay(member.loc, item.loc)
  + w_time     · time_decay(now, item.starts_at)        // gathering kinds only
  + w_social   · social_proof(item, member.follows)
  + w_recency  · creation_recency(item.created_at)
  - w_seen     · already_seen_penalty(member, item)
  - w_dismiss  · dismissal_penalty(member, item)
```

**Term definitions (T1):**

- `graph_proximity` — 1.0 if direct follow, 0.4 if 2-hop, 0 otherwise.
- `loop_affinity` — fraction of Member's last 50 engagements whose Item.kind matches this Item's kind. Floor at 0.1 to avoid filter-bubble lock-in.
- `location_decay` — `exp(-distance_miles / 5)`. Falls to 0.13 at 10 miles.
- `time_decay` — for `kind = gathering`: peak when `starts_at` is 3h–7d out; falls fast after start. Zero for past gatherings unless recurring.
- `social_proof` — count of Member's follows who pledged/RSVPed/saved this Item, log-scaled.
- `creation_recency` — `exp(-age_days / 14)`. New Items get a head start.
- `already_seen_penalty` — applied if Item shown ≥3× without engagement.
  **Intent:** 3× is the threshold below which "haven't decided yet" is plausible (Members often see a Gathering twice before clicking) and above which "not relevant" is the more likely explanation. The penalty catches stale candidates without suppressing slow-burn discovery. Tune this empirically once behavioral data exists at T2 — until then, the threshold is a deliberate hand-tune, not a placeholder.
- `dismissal_penalty` — applied if Member explicitly dismissed.

**Initial weights** (hand-tuned; documented in code, not config-driven yet):

```
w_graph = 1.0, w_loop = 0.6, w_loc = 0.8, w_time = 0.7,
w_social = 0.5, w_recency = 0.3, w_seen = 0.4, w_dismiss = 1.5
```

> **Intent:** Weights are hand-tuned and in-code on purpose — keeping changes in code review (visible, diffable, reversible) is the only way to prevent silent drift until the platform has enough behavioral data to tune empirically. A config-driven knob would let weights change without explicit decision, which is the exact failure mode that lets engagement-optimization creep into a "we just nudged w_recency a little" change-log entry. Config moves to data-driven tuning at T2; until then, every weight change is a code-review event.

**Diversity rule.** No more than 3 consecutive Items from the same creator or same Location. Reshuffle after scoring.

**Cold start.**

- New Member, no follows: rank by `w_loc + w_time + w_recency + trending_in_radius`. Surface a "Follow people whose work you love" prompt above the feed.
- New Item, no engagement: boost `w_recency` for first 48h so new declarations get seen.
- New Location: same as new Item — `w_recency` boost on Items at that Location.

**Loop adjacency seeding.** ~15% of slots come from the loop family adjacent to Member's revealed loop (e.g., a Gathering-heavy Member sees some Sharing items). Walks Members down the activation-energy ladder defined in `needs/member-journey.md`.

**Logging.** Every ranking call writes: candidate set IDs, final ranked list, slot positions, surface, and per-Item score breakdown. Mandatory — this is the training data for T2.

**Pluggable surfaces.** Each surface specifies: candidate sources to use, weight overrides (e.g., search overrides `w_graph` lower, query-match higher), slot count, and recency window.

## T2 — Core Tier (learned weights, A/B harness)

- Weights tuned per surface and per loop family from logged engagement events.
- Engagement event hierarchy (most → least valuable): showed up / pledged / purchased; RSVPed / saved; opened detail; impression. Train against the heavy events.
- A/B harness: deterministic Member-bucket assignment, per-experiment weight overrides, holdout group always on T1 weights for regression detection.
- Per-loop-family ranking — Trade items rank differently from Gathering items even for the same Member.
- Cold-start improvements: similarity over Item text + creator graph for new Items; Location-cluster priors for new Locations.
- Member-controlled levers: "show me more nearby," "less from this creator," "more gatherings, fewer products." Not just dismissal — direction.

## T3 — Polish Tier (learned ranker)

- Embeddings over Items, People, and Locations; learned ranker (e.g., LambdaMART or two-tower model) on top of hand-engineered features.
- Counterfactual evaluation — replay logged sessions with new ranker, estimate uplift before shipping.
- Group-scoped ranking when the Member belongs to a Group (per [`groups.md`](groups.md)) — a Group-scoped feed treats Group membership as a strong feature.
- Federation-aware ranking — when a Group federates to dedicated infrastructure (`member-journey.md` family 5), Items from federated spaces still surface to opted-in Members.
- Per-Member transparency: "why am I seeing this?" with top contributing features.
- Adversarial / spam dampening: detect engagement-farming, reciprocal-follow rings, and corporate astroturfing.

## Anti-patterns (do not build)

- Watch-time / dwell-time as primary objective. Bad fit for an action-oriented platform.
- Infinite scroll without a daily cap. Discovery should feel curated; ~20 well-chosen Items/day beats endless feed.
- Boost based on payment, "promoted Items," or business size. Violates `principles.md`.
- Auto-membership in a Group just because a Member engaged with its Items. Groups are intentional and Member-declared (per [`groups.md`](groups.md)) — soft signals (follows, attendance) compute at query time only and never write membership rows.
- Hidden / unlogged ranking. T1 must log everything so T2 has training data.

## Integration Points

- **Reads:** [`item.md`](item.md) (Item shape, kinds), [`groups.md`](groups.md) (Group-scoped feeds in T3), [`location.md`](location.md) (locality scope, multi-Location affinities), [`member.md`](member.md) (follower edges as signal), [`../foundation/primitives.md`](../foundation/primitives.md) (verb edges as signal), [`../needs/member-journey.md`](../needs/member-journey.md) (loop families, adjacency), [`../foundation/principles.md`](../foundation/principles.md) (hard constraints).
- **Used by:** Home feed, Explore, search, Item detail "related," notifications, You page activity.
- **Writes:** Ranking event log (training data for T2/T3).

## Open Questions

- Should search use the same candidate set as feed, or a broader index? T1 starts shared; revisit at T2.
- How aggressive should diversity be? Ship T1 conservative; tune from logs.
- Does each Location get its own "what's happening here" feed, or is that just Explore filtered by Location? Lean toward the latter — Locations are not Communities.
- When does ranking surface a Wonder / Ask vs. a finished Item? Likely a per-loop-family rule, decided at T2 when we have engagement data on lighter-weight Items.
