---
id: why-metrics
purpose: Default platform metrics, anchored on Member Flourishing. Anti-metrics named explicitly so they cannot install themselves by default.
layer: why
status: active
---

# Metrics

> Companion to [`principles.md`](principles.md). The constitution names *Member Flourishing* as the measurement. This doc carries the operational metric set — what the platform measures, what it explicitly refuses to measure, and how those measurements are anchored on Flourishing.

---

## Operating Principle

**Measure what happens inside the app.** The platform cannot honestly measure local economic impact, multiplier effects, or community health outside the app's own surface. Those are downstream consequences the movement claims philosophically; they are not metrics the platform reports until and unless the data exists to support the claim.

The platform measures: did Members find each other, and did something happen that moved them toward Flourishing?

There are no users yet, so the metrics below are generic best-practice categories with a Flourishing lens. Their job is to keep the wrong metrics from installing themselves by default. Real thresholds will be set after 90 days of real usage.

---

## Member Flourishing — The North Star

The constitution defines Flourishing as the platform's measurement. Two dimensions, both must rise together.

**Discretionary hours per week.** Hours not consumed by paid work, caregiving obligation, or commute. Working target: ≥ 40. Surveyed periodically; revealed-preference proxies (vacation days taken, paid-time-off usage) supplement self-report once the Member base supports it.

**Adequacy margin.** Disposable income (after housing, food, healthcare, transport, dependent care) as a multiple of local basic-needs cost. Working target: ≥ 1.5×. Self-reported by Member; cross-checked against revealed signals (group-purchasing savings, patronage dividends, payment-platform throughput) as those surfaces ship.

The platform's product test for any feature, partnership, or pattern: *does this net-move Members up on both dimensions?* The longer-form 0-3 community-health audit (see [`community-health-rubric.md`](community-health-rubric.md)) provides the periodic structured review; the ship gate is the single Flourishing test.

A Member is *Flourishing* only when both thresholds clear. Below either, the Member is in one of three failure states (Precarious / Overworked / Trapped). The platform never accepts a trade between the two dimensions.

---

## Operational Metrics

The metric categories below feed into the Flourishing measurement. Each is named with the question it tries to answer.

### Discovery & matchmaking

- **Search-to-find rate.** Of searches a Member runs, how many result in landing on a maker, service provider, or community page? *Discovery is happening.*
- **Find-to-engage rate.** Of pages landed on, how many result in a follow, save, encouragement, or message? *Discovery is converting to relationship.*
- **Initiative match rate.** Of Initiatives posted, how many get at least one Encouragement and one Pledge from Members not already known to the initiator? *The platform is making strangers into collaborators.*
- **Ask-to-fulfill rate.** Of Asks posted, what percentage are marked fulfilled? *Needs are being met.*
- **Wonder conversion rate.** Of Wonders posted, what percentage convert to a Host or Initiative? *The activation-energy slot is working.*

### Member engagement (per Member)

- **Time-to-first-action.** New Member to first Offer / Ask / Host / Wonder / Follow / Save / Encouragement.
- **Repeat-action rate.** Percentage of new Members who take a second meaningful action within 30 days.
- **Active Member ratio.** Members who took ≥ 1 meaningful action in the last 30 days, divided by total Members.
- **Action diversity.** Average distinct action types per active Member per month.

### Community health

- **Communities forming vs. dormant.** New communities created vs. communities with no activity in 30+ days.
- **Membership growth per community.** Median and distribution.
- **Posts per active community per month.** Tracked separately by post type.
- **Cross-community participation.** Average communities per Member; share of Members in ≥ 2.
- **Initiative throughput.** Number of Initiatives moving through `thinking → refining → active → funded → closed` per community per quarter.

### Platform growth

- New Members per week.
- New communities per week.
- Net retention at 30 / 60 / 90 days.
- Geographic footprint (cities, neighborhoods).

---

## Anti-Metrics — What the Platform Will Not Measure

Listed so they cannot install themselves by default. Naming them as anti-metrics is the only way to keep them out of dashboards through inertia — once a number is on a chart, the gravity of "improve the chart" makes the principle unenforceable.

- Daily active users as a goal in itself
- Time-on-platform
- Scroll depth or session length
- Push-notification open rate or click-through rate
- Streaks, gamified retention, engagement loops
- Anything resembling social-media metrics applied to local commerce

The rule: measure interactions that produce real-world meetings, transactions, fulfillment, and movement toward Flourishing. Do not measure attention.

---

## Thresholds

This doc names categories. It does not name pass / fail thresholds, because the platform has no users yet. After 90 days of real usage, revisit each metric category and set thresholds (e.g., "find-to-engage rate ≥ 25% by month 3"). Until then, track trends, not targets. Resist the temptation to set thresholds before there is data; arbitrary targets become arbitrary product decisions.
