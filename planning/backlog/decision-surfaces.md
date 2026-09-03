---
purpose: Clean separation of the three tabs (Home, Explore, You) — fix production overlap, redefine You.
layer: what
status: draft
---

# Decision: Surface Responsibilities — Home / Explore / You

Three tabs, three jobs, zero overlap. Canonical tab specs live in `product/ui/community-platform.md`; this doc names the problems in production, the fixes, and one proposed You-tab redefinition.

---

## Tab jobs (one sentence each)

| Tab | Job | Mental model | Primary loops |
|---|---|---|---|
| **Home** | Show what's happening near you right now. | "I'm checking in — what's new this week?" | 1, 3, 4, 8 |
| **Explore** | Find a specific thing by searching and filtering the catalog. | "I'm looking for something." | 3, 7, 9 |
| **You** | Show what's coming up from the people and things you care about. | "What's mine — what's next from my follows?" | 7, 8 |

Home is ambient (the Member opens it to browse). Explore is intentional (the Member opens it to search). You is personal (the Member opens it to see payoff from their follow graph and manage their identity). The three postures don't overlap.

---

## Anti-patterns per tab

**Home must not contain:** static discovery rails (category grids, "Sellers near you," "Markets near you" — these belong on Explore), search/filter controls, recruitment pitches, profile management, any content that isn't time-stamped feed.

**Explore must not contain:** a time-stamped feed, followed-Member content, recruitment pitches ("Become a seller!"), any auth-gated content. Explore is the public front door — no signup wall, no conversion pressure.

**You must not contain:** recruitment banners or campaigns (the "Sell" CTA is a quiet affordance, not a pitch), empty category directories ("Events: 0, Products: 0"), a duplicate of the Home feed or Explore catalog, general locality discovery content. You shows things from *your graph*, not from the locality at large.

---

## Three production problems and their fixes

**Problem 1 — Recruitment pitch on Explore.** The "Start selling" pitch currently appears on both Explore and You. Explore is the unauthenticated public catalog; conversion pressure doesn't belong there. **Fix:** remove from Explore. Keep as a quiet "Sell" CTA on You only, visible when the Member has no active business Group.

**Problem 2 — Static rails on Home.** Category grids, "Sellers near you," and "Markets near you" are browse-mode content competing with the feed. They confuse Home's job. **Fix:** move to Explore as discovery aids or the empty state. Home is feed-only.

**Problem 3 — You tab has no follow-graph payoff.** The You tab currently reads as a settings page with a recruitment banner. It doesn't answer "what's coming up from what I care about?" Without that answer, Loop 8 (Follow what you love) has no payoff surface — following someone is a dead gesture. **Fix:** redefine You's primary content section (see below).

---

## You tab redefinition

The You tab should be about favorites and recurring engagement: producers you repeatedly buy from, events you repeatedly attend, upcoming things from what you're interested in. It earns daily opens by answering "here's what's coming up from what you care about."

**Primary section: Upcoming from your follows.** Next events from followed organizers, next drops from followed producers, recent activity from followed Members. This section leads — it's the first thing a Member sees on You.

**Secondary sections (per `community-platform.md` C9/C10):** your follows (horizontal scroll strips), recently viewed, locality control, conditional Seller section, notification preferences, data export, sign out. The canonical content list lives in the spec; the key change here is *section ordering* — upcoming-from-follows leads, settings trail.

**What this replaces:** the current production layout where You opens with a recruitment pitch and empty category directories. If there's nothing to show in "Upcoming from your follows," the empty state should be "Follow producers, events, and Groups to see what's coming up" — a contextual nudge, not a sales banner.

---

## TikTok top-slider pattern — RATIFIED

PM ratified 2026-09-02 via `weigh` (Option B with amendments). The three-tab bottom nav stays; the top slider is a **category-based intent switcher within Home only**, shipping at b2.

**What it is.** A horizontal swipeable tab bar at the top of the Home viewport, segmenting the feed by activity intent: Buy (products/services), Do (events/gatherings), Learn (classes/workshops), with additional categories as the Item taxonomy earns them.
Intent (Ratified 2026-09-02): Category-based ("things to buy, to do, to learn") rather than feed-mode toggle ("For You / Following") because the platform's value is *what's available locally*, not algorithmic personalization. Intent-first navigation matches the Member's opening question ("what can I do this weekend"). A For You / Following toggle implies algorithm density and follow-graph density that won't exist at b2.

**Why Home only.** Explore already has kind-filter pills (F045); a top slider would compete with the search bar. You's sections are heterogeneous — a slider implies parallel views of the same content type.

**Why not a bottom-nav replacement.** The three-tab bottom nav is the structural backbone (three irreducible surfaces). TikTok itself keeps a bottom nav *and* top tabs — the top slider is a view-mode toggle within a tab, not a replacement. The bottom nav is furniture for the less-digitally-native audience this platform serves.

**Nav proportions (b1).** The bottom nav shrinks from 52px to 44px (compact, TikTok-proportioned, icon-dominant). Full spec in design-research-thesis.md §2.
