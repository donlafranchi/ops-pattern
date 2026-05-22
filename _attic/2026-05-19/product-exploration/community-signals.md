# Exploration: Community Signals — How Users Interact With Businesses

## The Problem With Our Current Approach

"I visited here" + text notes is a review system in disguise. Visit counts are vanity metrics. Check-ins are Foursquare. None of this is about ownership transparency — it's about experience, and experience is Yelp's lane, not ours.

We need to strip this back to what actually serves the mission.

## What We Want

1. Consumers can express support or non-support for a business
2. Bad actors face community pressure to do better
3. The platform doesn't become a mob justice tool or a review site
4. Signals are simple, not editorial

## Proposed Interaction Model

### Layer 1: Support Signal (public, lightweight)

Binary: **I support this business** or nothing. Not "I visited." Not "I had a good experience." Just: "I'm choosing this business because of what it stands for."

- One tap. No text. No note.
- Aggregate count visible: "47 people support this business"
- Users can remove their support at any time
- This is a stance, not a review. You don't need to visit to support.
- Optional: small emoji reaction set (heart, handshake, star, thumbs up) — expressive but not editorial. No negative emojis. Support is opt-in; absence of support is the signal.

The absence of support IS the negative signal. A business with 0 supporters in an area with 500 active users tells you something without anyone writing a word.

### Layer 2: Ethics Report (private, high-friction)

A **Report** button — separate from support, separate from ownership flagging.

- User taps "Report ethical concern"
- Selects category: labor practices, customer treatment, community harm, discrimination, other
- Brief required description (what happened, not opinion)
- Optional source link (news article, court record, social media post)
- Submitted privately — **never displayed publicly as individual reports**
- Reports are NOT reviews. They're signals to the platform.

**What happens with reports:**

- Reports accumulate privately in the platform's backend
- No individual report is ever shown to other users
- No report count is ever displayed
- The platform uses report volume + category patterns as ONE input into an internal ethics signal
- If a business crosses a threshold (many reports, consistent pattern, same category), it may trigger:
  - Admin review
  - Quiet deprioritization in results (lower in browse order, not removed)
  - If verified via public records: accountability badge (see business-accountability.md)
- The business owner is NEVER shown individual reports — only notified if an admin review is triggered
- Reports that can't be verified don't result in any visible action

**This is the TikTok pile-on problem solved:** individual reports are invisible. Only patterns matter. One angry person can't hurt a business. Twenty people reporting the same thing over six months triggers a review — not public shaming.

### Layer 3: Experience Signal (private to user, aggregate to platform)

After supporting a business, the user can privately note:
- 👍 Good experience
- 👎 Bad experience

This is NEVER shown to other users. No public display. No count. But:
- The platform tracks the ratio privately
- A business with 80% good experiences and strong support = healthy
- A business with support but 60% bad experiences = something's off
- This feeds into platform health metrics, not public-facing features
- Could eventually feed into "recommended" vs "not recommended" — but that's b3+ territory and needs careful thought

## What This Replaces

| Old (remove) | New |
|---|---|
| "I visited here" button | Support button (stance, not visit) |
| Optional text note | Gone. No public text. |
| Visit count on listing | Support count on listing |
| Recent visit notes on detail | Gone. No user-generated content on listings. |

## The TikTok Problem

The scenario: someone posts a video of a business doing something awful. Thousands of people flood the platform to report it. What happens?

**With this model:**
- Reports accumulate but are invisible
- No public-facing change happens from reports alone
- Admin review is triggered by volume
- If the claim is verifiable (public record, video evidence, news coverage) → accountability badge
- If the claim is unverifiable or a pile-on with no substance → nothing changes
- The business is protected from mob justice by the verification requirement
- The crowd's energy is captured (the reports exist) but filtered through verification

**The key principle: volume triggers review, not action.** The crowd can ring the bell, but only verified facts change what's displayed.

## What This Is NOT

- Not a review system (no public text, no stars)
- Not a check-in system (no visits tracked)
- Not a rating system (no scores, no rankings)
- Not a boycott tool (no "don't go here" mechanics)
- Not a social network (no comments, no replies, no threads)

## Open Questions

- Should support be anonymous or tied to a visible profile?
- Can a user both support AND report the same business? (Yes — you can support a local business but still flag an ethical concern)
- What's the threshold for triggering admin review? Absolute count? Per-capita in the area?
- Should the emoji set exist at all, or is bare "support" cleaner?
- How do we prevent astroturfing (fake support from business owners)?
- Does removing support leave any trace, or is it silent?

## Potential Bundle Assignment

- Layer 1 (support signal): **b1** — replaces visit interaction
- Layer 2 (ethics report): **b2** — needs moderation infrastructure
- Layer 3 (private experience signal): **b3** — needs critical mass of users to be meaningful
