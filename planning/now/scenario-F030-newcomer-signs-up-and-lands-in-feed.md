---
id: how-f030-newcomer-signs-up-and-lands-in-feed
purpose: Scenario — a newcomer signs up, picks a locality + interest tags, and lands in the awareness feed.
layer: how
status: approved
---

# F030: A newcomer signs up and lands in the awareness feed

**Bundle:** b1
**Loops:** 3 (Land here), 8 (Follow what you love)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) — the newcomer-to-Sacramento situation.
**Primitive shape:** Person → `member_place_interests`(primary_home) × `member_interests` → discovery feed (read from `discoverable_items`).
**Status:** in `planning/now/` (moved from backlog 2026-06-02); ticketing blocked — see below.

> **Ticketing blocked (2026-06-02).** Three gates open before `ticket`:
> 1. **Deps not met** — F036 surface incomplete (eval 5/9; 4 reds) and F038 not yet merged/evaled (T077–T079 on branch `t77`). F034 + F040 are done.
> 2. **Auth-method decision unratified** — see Assumptions; required before `ticket` per scenario.
> 3. **No `review-F030`** — rebuild rule 1 requires `review` before tickets.
**Replaces:** F028 (archived 2026-05-28 — drop persona; replace `member_location_affinities` references with `member_place_interests`; trim MSA-depth opt-in into F031's scope).

## The Person

A new resident of Oak Park, Sacramento. They've heard a friend talk about this platform; they want to see what's happening near where they live before committing time to any one thing. They've used anonymous neighborhood feeds (loud, hostile), Yelp (advertorial), and Instagram (algorithmic). They want a quiet, locality-first feed that says *this is what's near you* without selling them anything.

## The Story

They open the platform on their phone. Anonymous, IP-geolocated. The home surface already shows them a small set of Items nearby — gatherings, products, services — with a soft signup banner: "Make this yours." They tap signup. Magic link or social login.

After auth, a three-step onboarding: profile (name, handle, optional photo + bio + pronouns), home locality (geolocated default; can be edited), interest tags (2–6 from a controlled vocabulary). On the third step, the feed re-renders in place — already populated, because they entered their locality and tags into the same query that drives the public feed.

They scroll the home feed. It shows: a recurring gathering at Drake's, a bakery's weekly schedule, a service Item from a tradesperson in the neighborhood. Each card is tappable. The feed updates each visit; no notifications, no badges to clear, no push.

## Surfaces

- **Entry point:** `/` (home) — anonymous-readable with locality-defaulted IP fallback; signup CTA inline.
- **Primary action:** "Sign up" or "Sign in" (magic link or social).
- **Composer / interaction:** Three-step onboarding — profile · locality · interest tags. Each step optional-skippable except locality (the feed needs it). Feed re-renders inline as steps complete.
- **Completion:** Lands on `/` with a populated feed scoped to their `primary_home` Place + selected interests.
- **Discovery:** N/A — this is the consumer-entry scenario, not an Item creation scenario.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Name | `members.display_name` | yes |
| Handle | `members.handle` (unique, regex-constrained) | yes |
| Photo | `members.avatar_url` | optional |
| Bio | `members.bio` | optional |
| Pronouns | `members.pronouns` | optional |
| Home locality | `member_place_interests(scope_kind='primary_home', place_id=...)` + `members.home_location_id` | yes |
| Interest tags | `member_interests` (rows from controlled vocab) | optional (cold-start works without; feed leans on locality) |

Implicit: `member.created` event with `acting_member_id = <new member id>`; `member.place_interest_added` for primary_home; `member.interests.added` per tag.

## Acceptance Criteria

### Anonymous visitor sees a locality-defaulted feed

**Given** an anonymous visitor opens `/` for the first time
**When** the page loads
**Then** the feed renders Items near the IP-geolocated locality, with a "Make this yours" signup CTA above the feed and an inline scope picker if the visitor wants to change locality before signing up.

### Signup → profile → locality → interests onboarding flow

**Given** a visitor taps "Sign up" and completes magic-link or social auth
**When** the post-auth flow begins
**Then** they see three sequential steps — profile, home locality (geolocated default), interest tags — each with skip-but-locality-required behavior; on each step's submit, the underlying row writes immediately so a back-out leaves a partial record (not an aborted one).

### Feed re-renders against the chosen scope

**Given** a new Member has set `primary_home` Place and at least one interest tag
**When** they land on `/`
**Then** the feed renders Items matching `member_place_interests` × `member_interests` via Place-hierarchy traversal, ordered by recency + locality match.

### Empty-state handling when no Items match

**Given** a new Member's locality + interests yield no Items
**When** they land on `/`
**Then** the feed shows a friendly empty-state message — "No matches near you yet. Browse nearby Places: …" — and offers a one-tap widen-the-locality affordance (escalates to parent Place in the hierarchy).

## Edge Cases

- **IP-geolocation fails or returns a generic fallback:** show locality picker upfront instead of a feed, with a one-line explainer.
- **Member skips the interest tags step:** feed leans on locality only (no taste filter); the empty-state widen-locality CTA is the recovery path.
- **Member's `primary_home` Place has no children or siblings:** widen-locality CTA falls back to "any Place in your state."
- **Handle collision:** inline validation with suggestions (`yourname-2`, etc.).
- **Magic link expires before tap:** standard "request a new link" path.

## Assumptions

- Phase 1 substrate is in place: `members`, `member_place_interests`, `member_interests`, `places`, `discoverable_items` materialized view. (All shipped per T041–T066.)
- Auth method (magic link / social / email-password) ratified before this scenario goes to `ticket`. See `b1-themes.md` open auth-method decision.
- Interest-tag controlled vocabulary exists. Initial set drafted in `b1-themes.md`.

## Out of Scope

- Saved-search composer surface (b2 — UI on top of `member_saved_searches` substrate; substrate writes happen elsewhere).
- LLM-enhanced natural-language search (b2+ per `discovery.md` T3).
- Follow-stream notifications when a followed target posts new Items (b2).
- Secondary Place-interest management (covered by F031).
- The no-login `/explore` surface (Phase 3 — covered by a later scenario set).

## Capabilities unlocked

- **1. Presence & Findability** — Items appear in the locality-first awareness feed via place-interest × interest-tag matching.
- **5. Customer & Community Relationships** — (member side) members can land in a feed of producers they may eventually follow.
- (Consumer-facing capabilities, taxonomy categories above are producer-shaped — the consumer baseline is "members get a locality feed the moment they set their home Location" per `use-cases.md` Consumer baseline note.)
