---
id: what-discovery
purpose: One scoring core for feed, search, and notifications.
layer: what
status: active
---

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

### Community-awareness feed (per ADR-21)

The platform's locality-first feed reads from two Member-private substrates instead of per-Location follow rows:

- **`member_place_interests`** (per [`member.md`](member.md)) — the Member's awareness scope (one `primary_home` Place + up to 5 `secondary` Places). The candidate set is bounded by Items whose attached Location's `place_id` (or any ancestor via `places.parent_id`) appears in the Member's place-interest set. Default traversal depth is *up to city* (a Member with `primary_home=Oak Park` sees Items in Oak Park and in Sacramento-the-city by default); metro-scope opt-in — which widens the candidate set to every Location inside the Member's `metro_polygons` overlay via `ST_Contains` rather than walking further up the place tree (per D3) — is a Member setting.

  > **Intent (Ratified 2026-05-23):** *City* is the default depth because Items at that scope are still *legibly local* to a Member — a Member with primary_home in Oak Park recognizes Sacramento-the-city as their place; metro scope is one step too wide for "the neighborhood feed I check daily" framing and risks diluting the locality signal with cross-city noise. Metro-scope opt-in (computed against the `metro_polygons` overlay per D3, not a tree row) exists because some Members (commuters, cross-city families) genuinely want the wider scope; making it the default would lower the locality signal for everyone. State-never depth is excluded by the same reasoning carried further.
- **`member_interests`** (the controlled tag vocabulary per Member) — overlays a tag/kind filter so a Member with `outdoor`+`live-music` interest tags sees gathering Items at parks in their place-interest set before they see, say, sourdough drops.

The community-awareness feed is the b1 substrate for the canonical *Concerts in the Park* surface; the b2 saved-search surface (per [`member.md`](member.md)) is the explicit complement for filters too narrow for place-interest × interest-tag composition. At b1 the feed is *computed* at query time from place-interests × interests; no per-Location follow-edge table participates in feed generation, by design — the prior six-kind affinity substrate retired with ADR-21. The platform revisits only if computation cost or feed quality argues for materialization; any stored follow-edge that ever lands would serve as a *performance cache* under the existing query, not as a competing product surface or a follow-graph the platform would optimize for engagement.

> **Intent (Ratified 2026-05-23 — soft commitment):** Computed-not-stored is the b1 shape because the community-awareness feed is meant to reflect the Member's *current* place-interests and tags, not a snapshot of who they once clicked "follow" on. The product reason is anti-engagement-optimization (per `principles.md`): once a stored follow-edge set exists, every product question drifts toward "how do we get more of them?" — the engagement-metric trap. Computation over the Member's own private interests + Places keeps the feed structurally Member-driven and resistant to follow-graph gaming. **Test for future proposals:** does the proposal want to introduce a stored follow-edge that *replaces* the computed feed, or that surfaces as a product affordance ("X members follow this venue")? If yes, refuse — the answer is "extend the computation, or land it as a transparent performance cache under the existing query." Does it want a materialized view or query cache to lower computation cost? Welcome — that's an optimization, not a product surface.

### Candidate generation

For a Member `m` viewing surface `s`, gather candidates from:

1. Items by People `m` follows (verb edges: makes, services, convenes).
2. Items at Locations `m` has engaged with (visited Item detail, RSVPed, pledged).
3. Items whose attached Location's `place_id` (or any ancestor) is in `m`'s `member_place_interests` set (per ADR-21).
4. Items in `m`'s geographic radius (default 10 miles, configurable) — backstop for Members with empty place-interest sets or for cross-Place serendipity.
5. Items by People followed by People `m` follows (2-hop graph, capped).
6. Trending Items in `m`'s place-interest scope (recent engagement velocity).

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

### Surfacing demotion for inactive kind='business' Groups

Per [`playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) § "Lifecycle does not track business activity — discovery does," kind='business' Groups have no auto-dormancy and no auto-dissolution at the lifecycle layer (see [`groups.md`](groups.md) § Lifecycle per kind). The job of distinguishing actively-operating from quiescent business Groups belongs here, to discovery — as a surfacing-weight adjustment, not a state machine.

**Signal.** Activity for surfacing purposes is computed from *platform action only* — never from off-platform inference about whether a business is "really" operating. Qualifying actions for a kind='business' Group `g` over a rolling window:

- Items posted by `g` (any kind — `product`, `service`, `gathering`, etc., per `items.group_id = g.id`).
- Order-fulfillment events on `g`'s commercial Items (a `kind='product'` or `'service'` Item moving `active → fulfilled`).
- Member-facing events the Group is the subject of (a kind='business' Group's recurring gathering occurring; per-attendance events when those surfaces land).

A Group with zero qualifying actions over the window is *surfacing-inactive*; the score for `g`'s Items in promoted surfaces and search-default ranking is multiplied by a demotion factor (working answer: 0.25). The Group remains fully visible — direct URL, the Group's own page, queries that explicitly filter to it, the owner's `/you` surface — none of those are affected. Only the promoted positions are.

**What demotion never does.** Demotion never hides the Group from search results when a Member is actively searching for it, never archives the Group, never alters membership rows, never fires a state-change event on the Group, and never surfaces a public "inactive" label. The Group's owners see no platform message inviting them to "reactivate" — the platform makes no claim about whether their business is really inactive. The signal is internal to the ranker.

**Window.** Open question for Phase 2 — the rolling window length (30 / 60 / 90 days) and the demotion factor are both tuning knobs that need behavioral data to set honestly. Working defaults at first ship: **90-day rolling window, 0.25 demotion factor.** Both move to the T2 A/B harness once it lands; the demotion factor never goes below a floor that would amount to hiding the Group from a normal-locality search (working floor: 0.1).

**Scope.** kind='business' Groups only. Community kinds (`place`, `interest`, `practice`, `event_anchored`, `family`) keep their existing dormancy + revival lifecycle per `groups.md`, and their dormant state is the visibility signal there — discovery does not double-demote dormant community Groups.

> **Intent (Ratified 2026-05-31):** Adjudicating whether an off-platform business is "really" dormant requires signals the platform doesn't have (sales records, legal filings, owner intent) and creates surface area for the platform to mis-handle. Putting the activity question in *discovery* — as a surfacing weight, never a Group-state change — separates *whether the Group continues to exist* (answered by membership, per [`playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) § "Membership is the only access-granting verb for kind='business' Groups") from *whether anyone sees it in promoted surfaces* (answered here, by observable platform action). The two questions had been conflated by lifecycle machinery; this section is the home of the second one. **Test for future proposals:** does the proposal want to auto-archive, auto-dormant, or auto-dissolve a kind='business' Group based on activity? Refuse — extend this section's signal set or tune the demotion factor instead. Does it want to surface a public "inactive" label or notify owners that they're being demoted? Refuse — the signal is internal; the platform makes no public claim about a business's operating status. Does it want to add a new qualifying-action class (a new event type that counts as activity)? Welcome — extend the signal list.

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

## Search as the load-bearing surface (forward note, 2026-05-23)

Per PM direction 2026-05-23: **search is probably the platform's most helpful tool.** The current saved-search substrate (`member_saved_searches`, per `member.md` per ADR-21) is a *starting point*. The larger vision spans the tiers below:

- **b1 / T1.** `member_saved_searches` substrate ships; the structured-filter saved-subscription pattern is real and useful on its own.
- **b2 / T2.** A composer surface that lets Members assemble filters into named feeds; the feeds become first-class entries on the Member's `/you` page. Search queries (free-text + structured) start writing to a search-event log alongside the ranking event log — the substrate that lets the platform learn what Members are looking for.
- **T3.** **LLM-enhanced search.** Natural-language queries ("plumbers in West Sac who do pre-1900 work," "places near me with summer concerts") resolve against vector embeddings on `items`, `members`, `groups`, `places`. Search-pattern analysis at the platform level (anonymized aggregate per ADR-9's k-anonymity floor) feeds two consumer-facing intelligence surfaces: (a) **Member-side ideation seeds** — "lots of Members near you are searching for X; would you like to propose a Wonder / start a Group / open a kind='business' Group for X?" (b) **Producer-side market signal** — "across the Sacramento metro, demand for X has risen N% this quarter" (per `producer-tools.md` Growth dashboard). Both surfaces use search-pattern intelligence to translate latent demand into Member action.

The thread connecting these tiers: search isn't just a *find* surface — it's the platform's most honest signal about what Members want and don't yet have. Capturing it well at every tier is what lets the platform help Members close the gap themselves through the platform's own primitives (Wonder, Group, Item).

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

- **Reads:** [`item.md`](item.md) (Item shape, kinds, `made_at_place_id` for Locally-Made surfaces), [`groups.md`](groups.md) (Group-scoped feeds in T3), [`location.md`](location.md) (locality scope, geography for proximity), [`places.md`](places.md) (Place hierarchy for community-awareness traversal), [`member.md`](member.md) (`member_place_interests`, `member_interests`, `member_saved_searches`, follower edges — all per ADR-21), [`../foundation/primitives.md`](../foundation/primitives.md) (verb edges as signal), [`../needs/member-journey.md`](../needs/member-journey.md) (loop families, adjacency), [`../foundation/principles.md`](../foundation/principles.md) (hard constraints).
- **Used by:** Home feed, Explore, search, Item detail "related," notifications, You page activity.
- **Writes:** Ranking event log (training data for T2/T3).

## Open Questions

- Should search use the same candidate set as feed, or a broader index? T1 starts shared; revisit at T2.
- How aggressive should diversity be? Ship T1 conservative; tune from logs.
- Does each Location get its own "what's happening here" feed, or is that just Explore filtered by Location? Lean toward the latter — Locations are not Communities.
- When does ranking surface a Wonder / Ask vs. a finished Item? Likely a per-loop-family rule, decided at T2 when we have engagement data on lighter-weight Items.
