# System: Vendor Intelligence

**Purpose:** Give independent vendors the kind of business intelligence that big chains take for granted — who their customers are, what's working, what to do next — but tuned for the relationship-first economics of a local business, not the funnel-optimization economics of e-commerce.

**Bundles:** b2 (T1), b3 (T2), beyond (T3)

**Core Principle:** *Help small vendors compete with bigger players by giving them the data the big players have.* This is the line we use to recruit vendors. Every feature in this roadmap should pass the test: "Does a small business owner gain leverage they didn't have before?" If the answer is no, it doesn't ship.

---

## The pitch (for vendor recruitment conversations)

> "When Whole Foods opens nearby, they know within a week how much foot traffic they took from you. You find out when your sales drop. We're flipping that. Your Main Street dashboard tells you who's following you, who's coming back, what content brings new followers, and how to reach the people who already chose you. The big guys have a marketing department. We're building you one."

This roadmap is what backs that pitch up. It's not a finished product on day one — it's a credible commitment that the platform's job includes making vendors smarter, not just more visible.

---

## Design principles

1. **Relationship metrics > funnel metrics.** Followers, repeat supporters, and bulletin engagement matter more than impressions and bounce rates. We're not optimizing for conversion volume; we're optimizing for community depth.
2. **Insights over data dumps.** A small business owner doesn't have time to read a dashboard. Every screen leads with one sentence: "You gained 12 followers this week — that's 3× last week." Charts come second.
3. **Actionable, not vanity.** Every metric pairs with a suggested next action. "Your profile is missing photos — vendors with 5+ photos get 4× more follows. [Add photos →]"
4. **Comparison context, anonymized.** "Your open rate is 42% — average for similar vendors is 31%." Comparison is the difference between a number and a story.
5. **Built into the workflow, not a separate tool.** Insights appear next to the action they inform — bulletin compose screen shows last bulletin's open rate, follower screen shows growth chart, listing edit shows "vendors who completed this field get 30% more views."

---

## Tier roadmap

### T1 — Founder Dashboard (b2)

The minimum that lets us put "see your followers and how you're growing" on the vendor pitch.

**Followers tab**
- Total follower count + growth this week / month
- Simple line chart: followers over time (last 90 days)
- List of recent followers (display name + when they followed)
- Geographic breakdown: bar chart of follower counts by city/zip
- Export followers as CSV

**Activity tab**
- Profile views this week (vs last week)
- Support clicks this week (vs last week)
- Share count this week
- New follows this week
- Each metric paired with delta + trend arrow

**Top Tasks (Etsy pattern)**
- Onboarding checklist surfaced until complete:
  - Add a profile photo
  - Add a cover photo
  - Write your story (200+ chars)
  - List the markets you attend
  - Post your first update
- Each task shows the *measured benefit* ("vendors who add a story get 60% more follows")

**Listing health**
- Completeness score (0–100) with breakdown
- Photo count, story length, hours filled, markets listed
- Suggested next field to fill, ranked by impact

### T2 — Engagement Insights (b3)

What lets us say "we'll help you understand what's working."

**Bulletin analytics** (depends on `vendor-bulletin` system at T1+)
- Per-bulletin: delivered / opened / clicked / shared
- Open-rate trend over time
- "Your best-performing bulletin in the last 30 days" — surfaced with what made it work (timing, length, photo)
- Subject-line A/B testing (send to two random halves, ship the winner)

**Follower segmentation (read-only)**
- New followers (last 30 days)
- Long-time followers (90+ days)
- Active supporters (took an action recently)
- Lapsing followers (no activity in 60+ days) — *with a "send a re-engagement bulletin" CTA*

**Discovery insights**
- "How people find you" — referrer breakdown: direct, search, category browse, market detail page, shared link
- Top search terms that brought people to your profile
- Top categories you appear in (and your rank within each)

**Peer benchmarks (anonymized)**
- "Your open rate vs similar-sized vendors in your category"
- "Your follower growth vs vendors who joined the same month"
- Always anonymized aggregates — no individual vendor comparison

**Event insights** (depends on `events` at T2+)
- For each event: views, RSVPs, post-event "did people show up" rough estimate from check-ins (T3)

**Weekly digest email**
- Auto-sent every Monday: "Last week at [Vendor]: 12 new followers, 3 supports, your bulletin had a 38% open rate. Here's one thing to try this week."

### T3 — Competitive Intelligence (beyond b3)

The features that close the gap with what chains have.

**Customer lifetime value (proxy)**
- Repeat supporter count + frequency
- "Top supporters" — leaderboard of your most engaged followers
- "Your audience overlap with [other vendor]" — find collaboration partners

**Search & discovery optimization**
- Keyword opportunity report — "300 people searched 'sourdough' in your area this month; you don't appear in the top 10 results. Here's what to add to your listing."
- Competitor visibility — "5 other bakeries appear in searches for your area. You appear in 60% of them."

**Predictive recommendations**
- "Vendors who post on Friday get 2× the bulletin opens"
- "Your followers are most active on Saturday mornings — schedule your next bulletin for Saturday 8am"
- Seasonal: "It's apple season; vendors in your category posted 3× more in October last year"

**Multi-location vendor tools**
- Per-location follower / engagement breakdown
- Cross-location promotion (one bulletin to all locations' followers, segmented by store)

**Inbox & messaging analytics**
- Response time to customer messages
- Common questions identified by clustering — auto-generate FAQ suggestions

**Revenue context (vendor-supplied)**
- Optional: vendor self-reports weekly revenue → platform shows correlation with platform metrics ("weeks you posted a bulletin had 18% higher self-reported revenue")
- Never required, never shared, never sold

**Marketing automation**
- Scheduled bulletin sequences for new followers (welcome → story → first event invite)
- Automatic re-engagement bulletins for lapsing followers
- Birthday / anniversary triggers ("celebrating 1 year on Main Street — thank your followers")

---

## What we don't build

- **Ad sales / sponsored placement.** The whole point is to give vendors leverage *without* paying for visibility. Sponsored slots break the trust model.
- **Demographic targeting on followers.** We won't tell vendors a follower's age, gender, or income. Geographic city-level is the limit.
- **Selling vendor data to third parties.** Ever. This is in the foundation, not just the roadmap.
- **A "competitor benchmarking" feature that names other vendors.** Anonymized peer aggregates only. Never "here's how Sally's Bakery compares to yours."

---

## Data model implications (build with this in mind from day one)

Even though most of this is post-MVP, the data model should anticipate it:

- **Event sourcing for vendor-side actions.** Log every profile view, support click, follow, share, bulletin open, bulletin click as a row in `vendor_events` (or similar). Cheap to write, lets us derive any metric later without backfill pain.
- **Denormalized rollups.** A `vendor_stats_daily` table aggregated nightly, so dashboards are fast.
- **Follow timestamps + churn signals.** `follows.created_at`, `follows.last_active_at`, `follows.unfollowed_at` — never hard-delete a follow row, soft-delete with timestamp. Lets us show churn and re-engagement.
- **Bulletin delivery tracking.** Per-recipient `bulletin_deliveries` row from the start (see `vendor-bulletin.md`).
- **Search query logging.** Anonymized search queries logged with location + timestamp. Powers T2 search insights.
- **Referrer tracking.** Profile views log how the user arrived (URL param, internal route source).

These are cheap to add at MVP and impossible to backfill if skipped.

---

## Integration Points

- **Connects to:** `businesses`, `follows`, `vendor_bulletins`, `events`, `vendor_events` (new), `vendor_stats_daily` (new)
- **Used by:** You → Business tab (the dashboard surface)
- **Drives:** Vendor recruitment pitch, retention, weekly digest emails, bulletin scheduling suggestions

---

## Open Questions

- Do we ever expose any of this data publicly on a vendor's profile (e.g. "1.2k followers" badge)? Public follower counts create vanity dynamics; hiding them keeps focus on quality. Probably hide.
- Self-reported revenue (T3) — useful but high-friction. Is there a lighter-weight way to capture economic outcomes (vendor surveys, periodic check-ins)?
- Do bulletins drive measurable foot traffic? In T3 we should attempt to validate this with a vendor cohort study (the data team's first real research project).
- Should T1 ship with a "data export" feature (CSV of followers, bulletin stats) so vendors who outgrow our dashboard can take their data with them? Strong yes from a trust standpoint — bake portability in early.

---

## Changelog

**2026-04-25** — Initial roadmap. Designed to support vendor pitch ("we'll help you compete with bigger players") and to inform data model decisions from MVP forward.
