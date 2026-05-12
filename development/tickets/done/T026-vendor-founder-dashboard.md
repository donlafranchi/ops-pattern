# T026 — Vendor founder dashboard (T1 — followers, activity, top tasks, listing health)

## Goal
Ship the T1 Founder Dashboard from `vendor-intelligence.md`. This is the surface that backs the vendor pitch ("we'll help you compete with bigger players"). It must exist — even thinly — for the recruitment story to hold up.

## References
- [product/systems/vendor-intelligence.md](../../product/systems/vendor-intelligence.md) — full roadmap; this ticket = T1 only
- T022 — `vendor_events`, `vendor_stats_daily`, `follows` columns (hard prerequisite)
- T023 — `/you/vendor` route (hard prerequisite)
- T025 — bulletin stats (consumed but not blocking)

## Scope

### 1. Dashboard route: `/you/vendor`
Replaces the placeholder from T023. Three tabs:
- `Overview` (default)
- `Followers`
- `Activity`

Plus a persistent right-rail or bottom card: `Top Tasks` (Etsy-style onboarding checklist).

### 2. Overview tab
Hero metric block — 4 cards, each with current value + delta vs prior 7 days + tiny sparkline:
- Followers (total)
- Profile views (last 7d)
- Support clicks (last 7d)
- Bulletin opens (last 7d, if any bulletins exist)

Below: "Listing health" card
- Completeness score (0–100) with bar
- Breakdown: photo count, story length, hours filled, markets listed, bulletin sent in last 30d
- "Suggested next step" — single highest-impact missing field, with `[Fix it →]` link

### 3. Followers tab
- Total + growth chart (last 90 days, simple line — use a tiny chart lib or hand-rolled SVG)
- Geographic breakdown: bar chart of follower counts by city (from `users.city` if available; else "Unknown")
- Recent followers list: display name + when followed (paginated, 25 per page)
- `[Export CSV]` button — downloads followers (display name, city, followed_at)

### 4. Activity tab
- 4 metric rows with delta arrows: profile views, support clicks, shares, new follows (this week vs last)
- Daily breakdown table for last 14 days

### 5. Top Tasks (always visible)
Onboarding checklist; each task shows the *measured benefit* per `vendor-intelligence.md`:
- Add a profile photo — *"Vendors with photos get 4× more follows"*
- Add a cover photo
- Write your story (200+ chars) — *"60% more follows"*
- List the markets you attend
- Post your first bulletin — *"Followers who get bulletins are 3× more likely to support"*

Completed tasks check off and grey out. When all complete, the section collapses to "All set up ✓ — keep posting."

### 6. Data pipeline
- **Read path:** dashboard reads from `vendor_stats_daily` (rolled up) for trend data, and from `vendor_events` for "recent" lists
- **Write path:** add a nightly Supabase scheduled function `rollup_vendor_stats_daily(date)` that aggregates yesterday's `vendor_events` into `vendor_stats_daily`
- For the live current-day numbers, query `vendor_events` directly (cheap because indexed on `(vendor_id, created_at desc)`)

### 7. Permissions
- Only the vendor owner can view their dashboard
- RLS on `vendor_events` and `vendor_stats_daily`: select gated by `vendor_id` ownership

## Acceptance criteria
- [ ] `/you/vendor` shows Overview / Followers / Activity tabs.
- [ ] Overview shows 4 hero metrics with 7-day deltas and sparklines.
- [ ] Listing health card calculates completeness from real fields and surfaces one suggested next step.
- [ ] Followers tab shows growth chart, geographic bar chart, recent followers list, and CSV export.
- [ ] Activity tab shows weekly comparison and 14-day table.
- [ ] Top Tasks panel renders with measured-benefit microcopy; completed tasks check off automatically based on profile state.
- [ ] Nightly rollup function exists and produces correct `vendor_stats_daily` rows from `vendor_events`.
- [ ] Non-owners get 403 / redirect when accessing another vendor's `/you/vendor`.
- [ ] CSV export contains expected columns (display name, city, followed_at) for active followers only.
- [ ] `npm run build` and evals pass.

## Out of scope (all T2/T3 per system doc)
- Bulletin per-bulletin analytics drill-down (T25 surfaces basic counts; deep analytics is T2)
- Follower segmentation
- Discovery insights (referrer breakdown, search terms) — *referrer is logged in T022 but not visualized in T1*
- Peer benchmarks, weekly digest email
- Customer LTV, predictive recommendations, multi-location tools

## Notes
The dashboard's job in T1 is to make the vendor pitch credible — not to be analytically deep. One chart per tab is fine. If a metric requires more than ~50 lines of computation, defer it to T2 instead of cutting corners. The "Top Tasks" panel may matter more than the metrics themselves for activation.

## Completion (2026-04-25)

- Migration `006_rollup_vendor_stats.sql` — `rollup_vendor_stats_daily(target_date)` plpgsql function with full-outer-join of vendor_events + bulletin_deliveries CTEs into `vendor_stats_daily`, idempotent via `on conflict (vendor_id, day)`.
- `/api/vendor/followers/export` — auth-gated CSV (`display_name,city,followed_at`), service-role lookup of follower emails via `auth.admin.listUsers`, attachment download named `${slug}-followers.csv`.
- `Sparkline` — hand-rolled SVG polyline component (no chart-lib dep).
- `/you/vendor` rewritten as full dashboard:
  - Three URL-driven tabs (`?tab=overview|followers|activity`) wrapped in Suspense.
  - **Overview** — 4 MetricCards (Followers / Profile views 7d / Support clicks 7d / Bulletin opens 7d) each with 14-day Sparkline, plus ListingHealth score (cover/story/tagline/markets/bulletin) and suggested next step.
  - **Followers** — 90-day cumulative growth Sparkline, CSV export button, paginated recent-follower list (25/page).
  - **Activity** — week-over-week metric rows (views/supports/shares/follows) + 14-day daily breakdown table.
  - Sticky **Top Tasks** aside (cover/story/markets/bulletin) with measured-benefit microcopy; collapses to "All set up ✓" when complete.
- Build: ✅ `npm run build` clean. Tests: ✅ 51/51 passing.
- Deploy note: requires `supabase db push` for migration 006. Cron `select rollup_vendor_stats_daily();` should run nightly.
