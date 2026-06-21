---
id: what-producer-tools
purpose: Bulletin broadcast and Growth dashboard for producer-capacity Members.
layer: what
status: active
---

# System: Producer Tools

**Purpose:** Two surfaces that together back the producer recruitment pitch ("we'll help you compete with bigger players") and the platform-promise commitment in [`../foundation/platform-promise.md`](../foundation/platform-promise.md). **Bulletin** is the Substack-light broadcast surface that turns a follow from a save-for-later into a subscription to a relationship. **Growth** is the founder dashboard that gives Members operating in producer capacity the kind of business intelligence that big chains take for granted — followers, engagement, what's working, what to do next — tuned for relationship economics, not funnel economics.

**Bundles:** b2 (Bulletin T1 + Growth T1 — founder dashboard), b3 (Bulletin T2 + Growth T2 — engagement insights), beyond b3 (Bulletin T3 + Growth T3 — competitive intelligence). No b1 surface; the follow substrate (`member_follows`) and event log (per [`action-layer.md`](action-layer.md)) land at b1 so every action is already captured by the time the surfaces ship.

**North stars served:** Loop 5 (Subscribe), Loop 7 (Recur), Loop 8 (Follow), Loop 9 (Refer), Loop 12 (Trust at scale). The bulletin is the recurring contact that turns one-time discovery into a sustained relationship; the dashboard is what turns the platform's individual loops into a sustained business for the people running on top of them.

**Folded together 2026-05-22** from two prior specs (both now retired): the producer-bulletin system spec and the producer-growth system spec. This doc is their canonical home. The Bulletin section defines the broadcast surface and the per-bulletin stats; the Growth section consumes those stats — it does not re-define them.

---

## The pitch (for producer recruitment)

> "When Whole Foods opens nearby, they know within a week how much foot traffic they took from you. You find out when your sales drop. We're flipping that. Your dashboard tells you who's following you, who's coming back, what content brings new followers, and how to reach the people who already chose you. The big guys have a marketing department. We're building you one."

The roadmap below is what backs that pitch. It is not finished on day one — it is a credible commitment that the platform's job includes making producers smarter, not just more visible. Every feature passes one test: *does a small-business owner gain leverage they didn't have before?* If the answer is no, it does not ship.

## Design principles (apply to both surfaces)

1. **Relationship metrics > funnel metrics.** Followers, repeat supporters, and bulletin engagement matter more than impressions and bounce rates. The platform is not optimizing for conversion volume; it is optimizing for community depth.
2. **Insights over data dumps.** A producer doesn't have time to read a dashboard. Every screen leads with one sentence — "You gained 12 followers this week, 3× last week." Charts come second.
3. **Actionable, not vanity.** Every metric pairs with a suggested next action: "Your `/m/[handle]` page is missing photos — Members with 5+ photos get 4× more follows. [Add photos →]"
4. **Comparison context, anonymized.** "Your open rate is 42% — average for similar producers is 31%." Comparison is the difference between a number and a story. Anonymized aggregates only; never names another producer.
5. **Built into the workflow, not a separate tool.** Insights appear next to the action they inform — the bulletin compose screen shows the last bulletin's open rate, the follower screen shows the growth chart, the Item edit screen shows "producers who fill this field get 30% more views."

---

# Bulletin

The Substack-light broadcast surface. Originally specced in the prior producer-bulletin system spec (now retired; this section is its canonical home).

## What the Bulletin Is and Why It Matters

A bulletin is a Member-authored broadcast to that Member's followers. Authorship is always a Member, never a Group — relationships on this platform are between people, never between people and corporate shells (per [`../foundation/principles.md`](../foundation/principles.md) and the Group is-not-an-actor commitment in [`groups.md`](groups.md)). When a Member operating in producer capacity authors a bulletin, the bulletin can be **branded** with the Member's kind='business' Group affiliation for display ("from Drake's Bakery"); the social connection — who is on the receiving end, who hits "follow," who can reply — is still Member-to-Member.

The argument for elevating the bulletin to its own system (rather than treating it as a special Item kind) is that a bulletin is shaped differently from an Item: it is push-delivered, audience-scoped to followers, ephemeral on the feed but persistent in the author's outbox, and gated on producer capacity rather than on Item-create permissions. Conflating bulletins with Items would either dilute Item semantics or attach broadcast machinery to surfaces that don't need it.

The bulletin is also the load-bearing surface for the producer recruitment pitch: "we'll help you compete with bigger players" depends on followers being a real audience the producer can reach. Without a bulletin, follow is a save-for-later; with it, follow is a subscription. The whole asymmetry — *a one-person operation can outcompete a chain because they have direct access to their audience the chain can't replicate* — runs through this system.

## Bulletin — T1 (b2)

The minimum surface that lets us ship "follow a Member, receive their bulletins."

### Authorship
- Any Member with `member_has_standing_presence` = true (≥1 active kind='business' Group membership OR steward-role membership in any non-business Group, per [`groups.md`](groups.md)) can compose and publish bulletins.
- Members without standing presence see a "Sell" CTA in place of the compose surface — tapping it opens the kind='business' Group walkthrough per [`groups.md`](groups.md) (the prior `maker_mode_enabled` gate is dropped).

### Compose
- Plain-text body, optional title.
- "Publish" button — no scheduling, no drafts in T1.
- Preview before publish.
- Optional **branding** field: the Member selects one of their active kind='business' Group memberships to display alongside their handle ("Aaron from Drake's Bakery"). Optional; Members without a Group selection publish under their own handle.

### Delivery
- Every Member in `member_follows` (where `followed_member_id = author.member_id` and `unfollowed_at IS NULL`) receives:
  - An in-app card on their Home feed (top-pinned for 24h, then sorted normally).
  - An email digest entry, if `member_privacy.email_notifications_bulletins = true` (defaults per Member onboarding).
- Delivery is per-recipient, recorded in `bulletin_deliveries` (one row per follower per bulletin).

### Author guardrails
- Rate limit: 3 bulletins per author per 7-day window. Anti-spam — prevents the anonymous-feed over-posting failure mode. Enforced at the action handler.
- Followers can **mute** a producer's bulletins without unfollowing (`member_follows.bulletins_muted = true`). They keep the social tie; they just don't get the broadcast.
- Followers can unsubscribe from email delivery only (in-app card still appears).

### Per-bulletin stats (the canonical definition)

This is the **single home** for bulletin engagement metrics. The Growth dashboard consumes these — it does not re-define them.

- Per bulletin: # delivered, # opened (email), # clicked-through, # shared.
- Cached on the bulletin row (`stats_cache` jsonb); refreshed async from `bulletin_deliveries` events.
- Surfaced to the author in the Growth dashboard (see § Growth — Bulletin Analytics below), never on the bulletin card to followers.

## Bulletin — T2 (b3)

### Rich composition
- Markdown / lightweight rich text.
- Inline photo upload (1–5 photos per bulletin).
- Attach an **Item** — the bulletin announces a specific Item (a Gathering, a Product drop, a Service availability). Renders as a card linking to the Item's page (per [`item.md`](item.md)).
- Attach a **Location** — the bulletin references a permanent or recurring-temporary Location (per [`location.md`](location.md)). Renders as a map preview linking to the Location's page.

### Scheduling
- Schedule for a future date/time.
- Drafts save automatically (per-author, not shared).
- "Best time to send" suggestion at T3 (based on follower open patterns).

### Welcome bulletin
- Auto-send on new follow: producer's editable welcome message template.
- One per producer; configurable from the Growth dashboard.

### Per-bulletin stats (extended)

- Open rate (email), click-through rate per link.
- "Influence" metric (followers who took action — visited profile, supported, shared — within 24h of bulletin).
- All surfaced in Growth § Bulletin Analytics; not on the bulletin itself.

## Bulletin — T3 (beyond b3)

### Audience segmentation
- Segment by: locality (followers in Sacramento vs elsewhere), follow date (new followers vs longtime), past actions (supported recently vs lurkers). Anonymized aggregates only — the producer sees segment sizes and behavior, never individual follower identity beyond what `member_follows` already exposes.
- Geographic segments use the follower's `home_location_id` (per [`location.md`](location.md)), not a stored address.

### Drip sequences
- Auto-sequence on new follow: welcome → 3 days later → "here's our story" → 7 days later → "come visit us." Per-producer template library.

### Two-way comms
- Followers can reply to a bulletin. Reply lands in the bulletin's thread, scoped to (bulletin, follower) — a thread per follower, owned by the bulletin's author.
- Replies use the existing `member_threads` DM substrate (per [`member.md`](member.md)) with `bulletin_id` as the conversation anchor; the bulletin is the addressable scope, consistent with the messaging-scope commitment (item-or-group-scoped, never Location-scoped — see [`../foundation/policy.md`](../foundation/policy.md)).
- Optional: producer surfaces replies as a public Q&A thread under the bulletin.

### Cross-promotion
- A producer can co-author a bulletin with another producer (collaborating pop-up, joint event). The bulletin appears in both producers' follower feeds; both authorships are stamped on the row.

### Performance benchmarks
- "Your open rate is 42% — average for similar producers is 31%." Anonymized peer comparison; never names another producer. Surfaced in Growth § Peer Benchmarks; Bulletin system writes the underlying data.

## Bulletin — data model

**Required at b2:**

**The spine — `bulletins`** (one row per published bulletin):

- `id` (uuid)
- `author_member_id` (FK to `members`) — required, never null
- `branding_group_id` (FK to `groups`, nullable) — the kind='business' Group displayed alongside the author handle; null = author handle only
- `co_authors` (uuid[], nullable — T3) — additional `author_member_id` values for co-authored bulletins
- `title` (text, nullable)
- `body` (text — markdown allowed in T2+)
- `cover_photo_url` (text, nullable — T2)
- `attached_item_id` (uuid, FK to `items`, nullable — T2)
- `attached_location_id` (uuid, FK to `locations`, nullable — T2)
- `published_at` (timestamptz)
- `scheduled_for` (timestamptz, nullable — T2 scheduling)
- `audience` (enum: `all_followers` | `segment_id` — T3 segmentation)
- `delivery_channels` (jsonb — `{in_app: true, email: true, push: false}`)
- `stats_cache` (jsonb — `{delivered, opened, clicked, shared}`, refreshed async)

**Delivery — `bulletin_deliveries`** (one row per follower per bulletin):

- `bulletin_id`, `recipient_member_id` (composite PK)
- `delivered_at`, `opened_at` (nullable), `clicked_at` (nullable), `shared_at` (nullable)
- Soft unsubscribe lives on `member_follows.bulletins_muted` and `member_privacy.email_notifications_bulletins`, not here.

**Event log entries:** `bulletin.published`, `bulletin.scheduled`, `bulletin.delivered` (per recipient — high volume, partition aggressively), `bulletin.opened`, `bulletin.clicked`, `bulletin.shared`, `bulletin.replied` (T3).

**Action handlers** (per [`action-layer.md`](action-layer.md)): `bulletin.publish` (rate-limited at the handler; requires the author to have producer capacity), `bulletin.schedule` (T2), `bulletin.mute_for_self` (follower action, writes to `member_follows`), `bulletin.reply` (T3).

## Bulletin — Policy posture

Per [`../foundation/policy.md`](../foundation/policy.md) — protective defaults, opt-in expansions.

**Defaults:**
- Bulletins are author-scoped (Member or co-author Members), never Location-scoped. The messaging-scope commitment is upheld structurally: there is no `bulletin.location_id` field, no Location-scoped bulletin surface, and no handler that accepts a Location as a delivery target.
- Email delivery is opt-in at Member sign-up; defaults to on for follower-bulletins of producers the Member has followed (the follow is the act of opting in to broadcast).
- Mute is one-tap from any bulletin card and from the producer's profile.
- Rate limit (3/week) is unconditional at T1; producers with proven low-complaint history may receive a higher cap at T3 (open question).

**Available opt-ins:**
- Producer opts in to **scheduling** (T2) — no opt-in required, just a UI affordance.
- Producer opts in to **drip sequences** (T3) — they choose to enable auto-sequence per template.
- Follower opts in to **bulletin replies as public Q&A** at the bulletin level — defaults to private (DM-shaped reply thread); producer can flip a bulletin to public-Q&A mode.

**Three-filter analysis for the audience-segmentation opt-in (T3):**
- *Helpful:* yes — lets producers reach the right people with the right message; raises bulletin quality and lowers unsubscribe risk.
- *Harm to others:* segmentation uses only data the follower has already opted into (follow, follow date, `home_location_id`, action history). No demographic targeting, no inferred profiling. Anonymized aggregates — the producer sees "12 followers in Sacramento" not "John from 9th & K Street."
- *Abusable:* mitigated by (a) audience minimum N≥10 per segment (consistent with `agent-assistance.md`'s k-anonymity floor), (b) producer cannot see individual segment-membership status of any follower, (c) audit log entry on every segment-targeted send.

## Bulletin — what it rules in and rules out

**Rules in:** a Member operating in producer capacity broadcasts to their Member-followers, with attribution to a kind='business' Group if they choose; followers receive in-app and (opt-in) email; the producer sees aggregate engagement; the follower can mute, unsubscribe-email, or reply (T3); co-authored bulletins (T3) appear in both producers' fans' feeds.

**Rules out:** Group-as-author (Groups don't broadcast; Members do, with optional Group branding). Location-scoped delivery (there is no surface that addresses "everyone in West Sac" — per the accountable-participation commitment). Demographic targeting (geographic city-level via `home_location_id` is the limit; no age/gender/income segments exist). Selling delivery (no paid promotion of bulletins; the platform never charges to deliver). Surveying non-followers (only followers receive; non-followers cannot be reached via bulletin).

## Bulletin — open questions

- **Public visibility on producer profile.** Should bulletins appear on the producer's `/m/[handle]` page (visible to non-followers as recent posts) or only in followers' feeds? Public visibility is more discoverable; hidden makes follow more valuable. Working answer: hidden by default; producer can opt a bulletin into public ("featured on profile") at publish time.
- **Bulletin fatigue.** Rate limit is a blunt instrument; mute gives followers control but producers can't see who muted. Should we surface aggregate mute counts so producers can self-correct? T2/T3 design call.
- **Paid bulletins.** Substack model: free to send, charge for email-domain / advanced features. For Main Street the answer is probably always free; the platform's value comes from producers staying, not from bulletin fees. Confirm at b3.
- **Reply default visibility.** Private (DM-shaped) or public (Q&A under bulletin)? T3 surface design will decide; the data model supports both via the same thread substrate.

---

# Growth

The founder dashboard. Originally specced in the prior producer-growth system spec (now retired; this section is its canonical home).

## Growth — T1 (b2) — Founder Dashboard

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
  - Post your first bulletin (per § Bulletin above).
- Each task shows the measured benefit ("producers who add a story get 60% more follows").

### Profile health
- Completeness score (0–100) with breakdown of: photo count, story length, Locations listed, hours filled (per `location_permanent.public_hours`), Item count.
- Suggested next field to fill, ranked by impact.
- Visible only to the producer themselves; never surfaced to consumers and never used for ranking in `discoverable_items` (per the no-pay-for-visibility commitment in [`../foundation/principles.md`](../foundation/principles.md)).

## Growth — T2 (b3) — Engagement Insights

What lets the platform say "we'll help you understand what's working."

### Bulletin analytics

Reads from the per-bulletin stats defined in § Bulletin above. The Growth section *consumes* those stats; it does not re-define them.

- Per-bulletin: delivered / opened / clicked / shared (from `bulletins.stats_cache`).
- Open-rate trend over time.
- "Your best-performing bulletin in the last 30 days" — surfaced with what made it work (timing, length, photo attachment, Item attachment).
- Subject-line A/B testing (send to two random halves of the audience, ship the winner).

### Follower segmentation (read-only)
- New followers (last 30 days).
- Long-time followers (90+ days).
- Active supporters (took a support action recently).
- Lapsing followers (no activity in 60+ days) — *with a "send a re-engagement bulletin" CTA*.

Segmentation aggregates only; individual follower segment-membership is not surfaced. Audience minimum N≥10 per segment (consistent with the k-anonymity floor in [`agent-assistance.md`](agent-assistance.md)).

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

## Growth — T3 (beyond b3) — Competitive Intelligence

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
- **Never required, never shared with any other Member or third party, never sold.** Lives in the producer's own Assistant Context envelope (per [`agent-assistance.md`](agent-assistance.md) § Assistant Context).

### Marketing automation
Pairs with the bulletin T3 drip surface:
- Scheduled bulletin sequences for new followers (welcome → story → first event invite).
- Automatic re-engagement bulletins for lapsing followers.
- Birthday / anniversary triggers ("celebrating 1 year on Main Street — thank your followers").

## Growth — what this spec deliberately does not build

Per the people-first / policy commitments:

- **No ad sales or sponsored placement.** The whole point is to give producers leverage *without* paying for visibility. Sponsored slots break the trust model. The pay-for-visibility refusal in [`../foundation/principles.md`](../foundation/principles.md) applies here categorically.
- **No demographic targeting on followers.** The platform will not tell producers a follower's age, gender, race, or income. Geographic city-level (via `home_location_id`) is the limit.
- **No sale of producer data to third parties.** Ever. This is in [`../foundation/policy.md`](../foundation/policy.md), not just this roadmap.
- **No named-competitor benchmarking.** Anonymized peer aggregates only. Never "here's how Sally's Bakery compares to yours."
- **No public follower-count badges by default.** Public counts create vanity dynamics; producers can opt in to show their follower count on `/m/[handle]` (per [`member.md`](member.md) privacy settings).

## Growth — data model implications

The substrate lands at b1 even though no surface ships. Skipping any of these creates impossible-to-backfill gaps.

**Event sourcing via the action layer.** Every relevant action — profile view, support click, follow/unfollow, share, bulletin open, bulletin click, gathering RSVP, Item view, search query, referrer URL — writes a row to the existing `*_events` log in the same transaction as the underlying state change (per [`action-layer.md`](action-layer.md)). No new event-source mechanism; Growth is a *read* over the existing event log.

**Rollup table — `member_growth_stats_daily`** (one row per Member per day, populated nightly):
- `member_id` (FK to `members`)
- `stats_date` (date)
- `follower_count_end_of_day`, `follower_count_delta`
- `profile_view_count`, `share_count`, `support_count`, `new_follows`
- `bulletin_delivered_count`, `bulletin_opened_count`, `bulletin_clicked_count` (sourced from the per-bulletin stats defined in § Bulletin)
- `gathering_rsvp_count`, `gathering_attended_estimate` (when gathering insights ship)

Denormalized for fast dashboard reads; rebuildable at any time from the event log. The rollup is what makes T1 dashboards fast without forcing real-time aggregation on the hot path.

**Follow timestamps and churn signals.** Already in `member_follows` per [`member.md`](member.md): `created_at`, `unfollowed_at` (soft, nullable), composite PK. No hard deletes. Lets the dashboard show churn and re-engagement.

**Bulletin delivery tracking.** Per-recipient `bulletin_deliveries` row defined in § Bulletin data model. Drives bulletin analytics in T2.

**Search query logging.** Anonymized search queries logged with locality (city-level from `home_location_id`) + timestamp. Powers T3 search-opportunity reports. Logged via a `search.queried` event in the discovery event log (per [`discovery.md`](discovery.md)). Minimum-volume floor before any individual query surfaces.

**Referrer tracking.** Profile views log how the viewer arrived (URL param, internal-route source). Powers T2 discovery-insights.

These are cheap to write at b1 (the action layer already commits an event per write) and impossible to retrofit later.

## Growth — Policy posture

Per [`../foundation/policy.md`](../foundation/policy.md) — protective defaults, opt-in expansions, three-filter test.

**Defaults:**
- Growth dashboard is private to the producer Member. No data leaves the dashboard surface unless the producer exports it.
- Aggregate metrics derived from follower behavior are anonymized to the producer; the producer never sees individual follower demographics beyond what `member_follows` and `home_location_id` already expose.
- Peer benchmarks are anonymized at the cohort level; no individual producer is named in another's dashboard.
- Revenue context (T3) is off by default; the producer opts in and the data lives in their Assistant Context envelope (Member-owned).

**Available opt-ins:**
- **Audience-overlap matchmaking (T3).** Both producers must opt in before either sees overlap data. Three-filter analysis: *helpful* (surfaces real collaboration partners), *harmless* (only producers who opted in are visible to each other; followers are never identified), *abuse-resistant* (overlap aggregate only — no individual follower's overlap is surfaced; minimum N≥10).
- **Revenue context (T3).** Opt-in, Member-owned, never shared. The platform stores the producer's self-reported figures inside their Assistant Context (per the standing-tier Assistant Context gating in [`agent-assistance.md`](agent-assistance.md)) and surfaces correlations only to the producer themselves.
- **Public follower count on profile.** Per-Member opt-in toggle; defaults off. Lives in `member_privacy` (per [`member.md`](member.md)).

**Refused:**
- Any opt-in that would expose individual follower demographics, message contents, or non-public actions to the producer.
- Any opt-in that would allow the platform to sell producer or follower data to third parties.

## Growth — what it rules in and rules out

**Rules in:** a producer Member sees aggregate-but-actionable signal on their followers, profile, bulletins, gatherings, and Items — surfaced in-context, paired with suggested next actions, comparison anonymized against similar producers; the data substrate sits at b1 (event log + rollups) even though the surface ships at b2.

**Rules out:** funnel-style analytics imported from e-commerce playbooks; demographic targeting on followers; ad sales or sponsored placement; sale of producer or follower data; named-competitor benchmarks; any metric that surfaces non-public follower behavior to the producer; vanity badges that exist solely for status.

## Growth — open questions

- **Public visibility of follower count on `/m/[handle]`.** Toggle defaulting off keeps focus on quality; some producers will want to flex the count for credibility. Working answer: keep default off, surface the toggle prominently in Producer-panel settings.
- **Revenue context capture (T3).** Self-reported is useful but high-friction. Is there a lighter-weight way (vendor surveys, periodic check-ins, integration with Square/Stripe APIs)? Open until T3 design.
- **Bulletin-driven foot traffic validation.** In T3 the platform should attempt a cohort study (the data team's first real research project) to validate the producer-recruitment claim that bulletins drive measurable foot traffic.
- **Data export breadth at T1.** Should the CSV export include only followers, or also activity history, support events, bulletin stats? Strong case for full envelope from a portability standpoint — Member never trapped — but adds engineering cost. Working answer: full envelope, ship at T2.
- **Cohort minimum for peer benchmarks.** Below what N does a "similar producers" comparison stop being meaningful? Empirical; surface gracefully ("not enough peers yet — check back when more producers in your category have joined") when below threshold.

---

## Integration Points (both surfaces)

- **Connects to:**
  - **Member** (the dashboard's owner; follower relationships via `member_follows`; bulletin author identity; per [`member.md`](member.md))
  - **Groups** (producer-capacity gating via `member_has_standing_presence`; bulletin branding via `branding_group_id`; multi-Location producers use kind='business' Group structure; per [`groups.md`](groups.md))
  - **Location** (T2 bulletin attachment; geographic follower segmentation; multi-Location producer tools; per [`location.md`](location.md))
  - **Item** (T2 bulletin attachment; Item views / support clicks / share events feed the Growth activity tab; per [`item.md`](item.md))
  - **Discovery** (referrer breakdown, search-term insights, category rank; per [`discovery.md`](discovery.md))
  - **Action layer** (every bulletin publish/schedule/mute/reply through named handlers; every Growth event captured here by the action layer's same-transaction commit; per [`action-layer.md`](action-layer.md))
  - **Agent Assistance** (T3 Growth revenue context lives in the standing-tier Assistant Context; producer-capacity gating uses `member_has_standing_presence` defined there; per [`agent-assistance.md`](agent-assistance.md))
- **Used by:**
  - The You-tab Producer panel (per the community-platform UI doc)
  - Home feed surfaces (followers see bulletin cards inline)
  - The weekly digest email infrastructure (b2)
  - Email delivery infrastructure (per the notification system, b2)
  - The producer-recruitment pitch (this spec is the document that conversation references)
- **Critical dependencies:** the b1 follow substrate (`member_follows`), the b1 action layer + event log + audit fields, the b2 notification + email-delivery infrastructure.

## Decisions encoded here

This spec does not own any cross-cutting decision. It *consumes*:
- **[`agent-assistance.md`](agent-assistance.md)** — producer-capacity gating uses `member_has_standing_presence` (standing-derived); T3 revenue context lives in the standing-tier Assistant Context.
- **[`action-layer.md`](action-layer.md)** — every publish/schedule/mute/reply is a named handler with same-transaction row+event commit; Growth is a read over the event log.
- **[`../foundation/policy.md`](../foundation/policy.md)** — protective defaults, accountable-participation messaging-scope commitment, three-filter test on segmentation opt-in; categorical refusal of ad sales / demographics / data sales / named-competitor benchmarks.
- There is no Maker mode; both Bulletin authorship and the Growth surface gate on kind='business' Group membership directly.
- **[`groups.md`](groups.md)** — branding attribution via kind='business' Group memberships; Groups are decoration on bulletins, not authors; multi-Location producers use kind='business' Group structure.
