# System: Producer Growth

**Purpose:** Give Members operating in producer capacity — Maker-mode Members and kind='business' Group stewards — the kind of business intelligence that big chains take for granted: who their followers are, what's working, what to do next. Tuned for the relationship-first economics of a local business, not the funnel-optimization economics of e-commerce. This spec is what backs the producer recruitment pitch ("we'll help you compete with bigger players") and the platform-promise commitment in [`../foundation/platform-promise.md`](../foundation/platform-promise.md).

**Bundles:** b2 (T1 — founder dashboard), b3 (T2 — engagement insights), beyond b3 (T3 — competitive intelligence). No b1 surface; the event-log substrate (per [`action-layer.md`](action-layer.md)) lands at b1 so every action is already captured by the time the dashboards ship.

**North stars served:** Loop 5 (Subscribe), Loop 7 (Recur), Loop 8 (Follow), Loop 9 (Refer), Loop 12 (Trust at scale). Producer growth is what turns the platform's individual loops into a sustained business for the people running on top of them.

## The pitch (for producer recruitment)

> "When Whole Foods opens nearby, they know within a week how much foot traffic they took from you. You find out when your sales drop. We're flipping that. Your dashboard tells you who's following you, who's coming back, what content brings new followers, and how to reach the people who already chose you. The big guys have a marketing department. We're building you one."

The roadmap below is what backs that pitch. It is not finished on day one — it is a credible commitment that the platform's job includes making producers smarter, not just more visible. Every feature in this spec passes one test: *does a small-business owner gain leverage they didn't have before?* If the answer is no, it does not ship.

## Design principles

1. **Relationship metrics > funnel metrics.** Followers, repeat supporters, and bulletin engagement matter more than impressions and bounce rates. The platform is not optimizing for conversion volume; it is optimizing for community depth.
2. **Insights over data dumps.** A producer doesn't have time to read a dashboard. Every screen leads with one sentence — "You gained 12 followers this week, 3× last week." Charts come second.
3. **Actionable, not vanity.** Every metric pairs with a suggested next action: "Your `/m/[handle]` page is missing photos — Makers with 5+ photos get 4× more follows. [Add photos →]"
4. **Comparison context, anonymized.** "Your open rate is 42% — average for similar producers is 31%." Comparison is the difference between a number and a story. Anonymized aggregates only; never names another producer.
5. **Built into the workflow, not a separate tool.** Insights appear next to the action they inform — the bulletin compose screen shows the last bulletin's open rate, the follower screen shows the growth chart, the Item edit screen shows "producers who fill this field get 30% more views."

## T1 — Founder Dashboard (b2)

The minimum that lets the platform say "see your followers and how you're growing" in the producer pitch. Surfaced on the You-tab's **Producer panel** (gated on `member_has_standing_presence`, per [`groups.md`](groups.md)).

### Followers tab
- Total follower count + growth this week / month.
- Simple line chart: followers over time (last 90 days).
- List of recent followers (display name + when they followed; no demographic data).
- Geographic breakdown: bar chart of follower counts by city (driven by follower's `home_location_id` per [`location.md`](location.md), city-level only).
- **Export followers as CSV** — Member-owned data, exportable per the agent-assistance commitment that "the Member is never trapped on the platform."

### Activity tab
- `/m/[handle]` page views this week (vs last week).
- Support actions this week (vs last week). Support = any Item-response with `response_kind` in the support tier per [`item.md`](item.md).
- Share count this week.
- New follows this week.
- Each metric paired with delta + trend arrow. No vanity-only metrics.

### Top Tasks (Etsy pattern)
- Onboarding checklist surfaced until complete:
  - Add a profile photo.
  - Add a cover photo.
  - Write your story (200+ characters).
  - List the Locations you operate from (kind='business' Group's `anchor_location_id` and any associated Locations).
  - Post your first bulletin (per [`producer-bulletin.md`](producer-bulletin.md)).
- Each task shows the measured benefit ("producers who add a story get 60% more follows").

### Profile health
- Completeness score (0–100) with breakdown of: photo count, story length, Locations listed, hours filled (per `location_permanent.public_hours`), Item count.
- Suggested next field to fill, ranked by impact.
- Visible only to the producer themselves; never surfaced to consumers and never used for ranking in `discoverable_items` (per the no-pay-for-visibility commitment in [`principles.md`](../foundation/principles.md)).

## T2 — Engagement Insights (b3)

What lets the platform say "we'll help you understand what's working."

### Bulletin analytics
Depends on [`producer-bulletin.md`](producer-bulletin.md) T1+. Surfaces:
- Per-bulletin: delivered / opened / clicked / shared.
- Open-rate trend over time.
- "Your best-performing bulletin in the last 30 days" — surfaced with what made it work (timing, length, photo attachment, Item attachment).
- Subject-line A/B testing (send to two random halves of the audience, ship the winner).

### Follower segmentation (read-only)
- New followers (last 30 days).
- Long-time followers (90+ days).
- Active supporters (took a support action recently).
- Lapsing followers (no activity in 60+ days) — *with a "send a re-engagement bulletin" CTA*.

Segmentation aggregates only; individual follower segment-membership is not surfaced. Audience minimum N≥10 per segment (consistent with the k-anonymity floor in [`assistant-context.md`](assistant-context.md)).

### Discovery insights
- "How people find you" — referrer breakdown: direct, search, category browse, Location page, Group page, shared link.
- Top search terms that brought people to `/m/[handle]` (anonymized, aggregate; minimum-volume floor before any term surfaces).
- Top categories the producer appears in (and rank within each), driven by the discovery index (per [`discovery.md`](discovery.md)).

### Peer benchmarks (anonymized)
- "Your open rate vs similar-sized producers in your category."
- "Your follower growth vs producers who joined the same month."
- Always anonymized aggregates — no individual producer comparison, no "here's how Sally's Bakery compares to yours."

### Gathering insights
Depends on Item kind='gathering' analytics. For each gathering Item the producer authored:
- Views, RSVPs, share count, post-event check-in rough estimate (T3).
- Comparison against the producer's own gathering history ("this had 2× the RSVPs of your average").

### Weekly digest email
Auto-sent every Monday: *"Last week at Drake's Bakery: 12 new followers, 3 supports, your bulletin had a 38% open rate. Here's one thing to try this week."*

Opt-in via Member privacy settings; defaults to on for Members with `member_has_standing_presence`.

## T3 — Competitive Intelligence (beyond b3)

The features that close the gap with what chains have.

### Customer lifetime value (proxy)
- Repeat-supporter count + frequency.
- "Top supporters" — leaderboard of the producer's most engaged followers (display name only; the follower is in control of what's visible).
- "Your audience overlap with [other producer]" — find collaboration partners. Surfaced as opt-in matchmaking; both producers must opt in before the overlap is exposed to either.

### Search & discovery optimization
- Keyword opportunity report: "300 people searched 'sourdough' in your area this month; you don't appear in the top 10 results. Here's what to add to your Item or profile."
- Category-visibility report: "5 other producers appear in searches for your area. You appear in 60% of them. Here's what they have that you don't."

Driven by anonymized aggregate query log (per the data model below).

### Predictive recommendations
- "Producers who publish on Friday get 2× the bulletin opens."
- "Your followers are most active on Saturday mornings — schedule your next bulletin for Saturday 8am."
- Seasonal: "It's apple season; producers in your category posted 3× more in October last year."

### Multi-Location producer tools
For Members with multiple Locations (via kind='business' Group's anchor + child Locations, or multiple kind='business' Groups under one Member):
- Per-Location follower / engagement breakdown.
- Cross-Location promotion: one bulletin to all Locations' followers, segmented by Location for tracking.

### Inbox & messaging analytics
- Response time to follower DMs (per the `member_threads` substrate in [`member.md`](member.md)).
- Common questions identified by clustering — auto-generate FAQ suggestions for the producer's `/m/[handle]` page.

### Revenue context (Member-supplied, never required)
- Optional: the producer self-reports weekly revenue → the platform shows correlation with platform metrics ("weeks you posted a bulletin had 18% higher self-reported revenue").
- **Never required, never shared with any other Member or third party, never sold.** Lives in the producer's own Assistant Context envelope (per [`assistant-context.md`](assistant-context.md)).

### Marketing automation
Pairs with the producer-bulletin T3 drip surface:
- Scheduled bulletin sequences for new followers (welcome → story → first event invite).
- Automatic re-engagement bulletins for lapsing followers.
- Birthday / anniversary triggers ("celebrating 1 year on Main Street — thank your followers").

## What this spec deliberately does not build

Per the people-first / policy-framework commitments:

- **No ad sales or sponsored placement.** The whole point is to give producers leverage *without* paying for visibility. Sponsored slots break the trust model. The pay-for-visibility refusal in [`principles.md`](../foundation/principles.md) applies here categorically.
- **No demographic targeting on followers.** The platform will not tell producers a follower's age, gender, race, or income. Geographic city-level (via `home_location_id`) is the limit.
- **No sale of producer data to third parties.** Ever. This is in [`policy.md`](../foundation/policy.md), not just this roadmap.
- **No named-competitor benchmarking.** Anonymized peer aggregates only. Never "here's how Sally's Bakery compares to yours."
- **No public follower-count badges by default.** Public counts create vanity dynamics; producers can opt in to show their follower count on `/m/[handle]` (per [`member.md`](member.md) privacy settings).

## Data model implications

The substrate lands at b1 even though no surface ships. Skipping any of these creates impossible-to-backfill gaps.

**Event sourcing via the action layer.** Every relevant action — profile view, support click, follow/unfollow, share, bulletin open, bulletin click, gathering RSVP, Item view, search query, referrer URL — writes a row to the existing `*_events` log in the same transaction as the underlying state change (per ADR-7 in [`action-layer.md`](action-layer.md)). No new event-source mechanism; producer-growth is a *read* over the existing event log.

**Rollup table — `member_growth_stats_daily`** (one row per Member per day, populated nightly):
- `member_id` (FK to `members`)
- `stats_date` (date)
- `follower_count_end_of_day`, `follower_count_delta`
- `profile_view_count`, `share_count`, `support_count`, `new_follows`
- `bulletin_delivered_count`, `bulletin_opened_count`, `bulletin_clicked_count` (when bulletins ship)
- `gathering_rsvp_count`, `gathering_attended_estimate` (when gathering insights ship)

Denormalized for fast dashboard reads; rebuildable at any time from the event log. The rollup is what makes T1 dashboards fast without forcing real-time aggregation on the hot path.

**Follow timestamps and churn signals.** Already in `member_follows` per [`member.md`](member.md): `created_at`, `unfollowed_at` (soft, nullable), composite PK. No hard deletes. Lets the dashboard show churn and re-engagement.

**Bulletin delivery tracking.** Per-recipient `bulletin_deliveries` row from b2 launch (per [`producer-bulletin.md`](producer-bulletin.md)). Drives bulletin analytics in T2.

**Search query logging.** Anonymized search queries logged with locality (city-level from `home_location_id`) + timestamp. Powers T3 search-opportunity reports. Logged via a `search.queried` event in the discovery event log (per [`discovery.md`](discovery.md)). Minimum-volume floor before any individual query surfaces.

**Referrer tracking.** Profile views log how the viewer arrived (URL param, internal-route source). Powers T2 discovery-insights.

These are cheap to write at b1 (the action layer already commits an event per write) and impossible to retrofit later.

## Policy posture

Per [`policy.md`](../foundation/policy.md) — protective defaults, opt-in expansions, three-filter test.

**Defaults:**
- Producer dashboard is private to the producer Member. No data leaves the dashboard surface unless the producer exports it.
- Aggregate metrics derived from follower behavior are anonymized to the producer; the producer never sees individual follower demographics beyond what `member_follows` and `home_location_id` already expose.
- Peer benchmarks are anonymized at the cohort level; no individual producer is named in another's dashboard.
- Revenue context (T3) is off by default; the producer opts in and the data lives in their Assistant Context envelope (Member-owned).

**Available opt-ins:**
- **Audience-overlap matchmaking (T3).** Both producers must opt in before either sees overlap data. Three-filter analysis: *helpful* (surfaces real collaboration partners), *harmless* (only producers who opted in are visible to each other; followers are never identified), *abuse-resistant* (overlap aggregate only — no individual follower's overlap is surfaced; minimum N≥10).
- **Revenue context (T3).** Opt-in, Member-owned, never shared. The platform stores the producer's self-reported figures inside their Assistant Context (per the standing-tier Assistant Context gating in [`agent-assistance.md`](../foundation/agent-assistance.md)) and surfaces correlations only to the producer themselves.
- **Public follower count on profile.** Per-Member opt-in toggle; defaults off. Lives in `member_privacy` (per [`member.md`](member.md)).

**Refused:**
- Any opt-in that would expose individual follower demographics, message contents, or non-public actions to the producer.
- Any opt-in that would allow the platform to sell producer or follower data to third parties.

## What Producer Growth rules in and rules out

**Rules in:** a producer Member sees aggregate-but-actionable signal on their followers, profile, bulletins, gatherings, and Items — surfaced in-context, paired with suggested next actions, comparison anonymized against similar producers; the data substrate sits at b1 (event log + rollups) even though the surface ships at b2.

**Rules out:** funnel-style analytics imported from e-commerce playbooks; demographic targeting on followers; ad sales or sponsored placement; sale of producer or follower data; named-competitor benchmarks; any metric that surfaces non-public follower behavior to the producer; vanity badges that exist solely for status.

## Integration Points

- **Connects to:**
  - **Member** (the dashboard's owner; follower relationships via `member_follows`; per [`member.md`](member.md))
  - **Groups** (producer-capacity gating; kind='business' Group context for multi-Location producers; per [`groups.md`](groups.md))
  - **Location** (geographic follower segmentation; multi-Location producer tools; per [`location.md`](location.md))
  - **Item** (Item views, support clicks, share events feed the activity tab; per [`item.md`](item.md))
  - **Producer Bulletin** (bulletin analytics surface; per [`producer-bulletin.md`](producer-bulletin.md))
  - **Discovery** (referrer breakdown, search-term insights, category rank; per [`discovery.md`](discovery.md))
  - **Action layer** (every event is captured here by ADR-7's same-transaction commit; per [`action-layer.md`](action-layer.md))
  - **Assistant Context** (T3 revenue context lives in the standing-tier Assistant Context; per [`assistant-context.md`](assistant-context.md))
- **Used by:**
  - The You-tab Producer panel (per [`../products/community-platform.md`](../products/community-platform.md))
  - The weekly digest email infrastructure (b2)
  - The producer-recruitment pitch (this spec is the document that conversation references)
- **Critical dependencies:** the b1 action layer + event log + audit fields; the b2 follow stream + bulletin substrate.

## Open questions

- **Public visibility of follower count on `/m/[handle]`.** Toggle defaulting off keeps focus on quality; some producers will want to flex the count for credibility. Working answer: keep default off, surface the toggle prominently in Producer-panel settings.
- **Revenue context capture (T3).** Self-reported is useful but high-friction. Is there a lighter-weight way (vendor surveys, periodic check-ins, integration with Square/Stripe APIs)? Open until T3 design.
- **Bulletin-driven foot traffic validation.** In T3 the platform should attempt a cohort study (the data team's first real research project) to validate the producer-recruitment claim that bulletins drive measurable foot traffic.
- **Data export breadth at T1.** Should the CSV export include only followers, or also activity history, support events, bulletin stats? Strong case for full envelope from a portability standpoint — Member never trapped — but adds engineering cost. Working answer: full envelope, ship at T2.
- **Cohort minimum for peer benchmarks.** Below what N does a "similar producers" comparison stop being meaningful? Empirical; surface gracefully ("not enough peers yet — check back when more producers in your category have joined") when below threshold.

## Decisions encoded here

This spec does not own any ADR. It *consumes*:
- **ADR-6** ([`agent-assistance.md`](../foundation/agent-assistance.md)) — standing-derived gating via `member_has_standing_presence`; the full producer-growth surface is the standing-tier producer's view.
- **ADR-7** ([`action-layer.md`](action-layer.md)) — every action is captured in the event log in the same transaction; producer-growth is a read over that log.
- **ADR-9** ([`policy.md`](../foundation/policy.md)) — protective defaults; three-filter analysis on every opt-in; categorical refusal of ad sales / demographics / data sales / named-competitor benchmarks.
- **ADR-12** ([`member.md`](member.md) status banner) — **SUPERSEDED 2026-05-12** per `agent-commerce-and-project-amendments.md` §6. There is no Maker mode; the producer-growth surface gates on kind='business' Group membership (per ADR-13) directly.
- **ADR-13** ([`groups.md`](groups.md)) — kind='business' Group steward/owner role is producer capacity; multi-Location producers use kind='business' Group structure.
