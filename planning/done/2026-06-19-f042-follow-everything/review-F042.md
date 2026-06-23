---
id: how-review-f042
purpose: Mandatory rebuild-phase review for F042 (Member follows producer, Group, venue).
layer: how
status: active
---

# F042 review — Member follows producer, Group, venue

**Scenario:** [`scenario-F042-member-follows-producer-group-venue.md`](./scenario-F042-member-follows-producer-group-venue.md)
**Reviewer:** review
**Date:** 2026-06-18
**Bundle:** b1
**Verdict:** PROCEED

## Verdict summary

Architecturally clean — all three follow substrates (`member_follows`, `group_memberships`, `member_saved_searches`) and their handlers already exist. The two-level surface pattern (card scroll on `/you` + full page at `/you/following`) is new but straightforward. Three issues caught during review (column name, Leave vs Unfollow for Groups, route decision) resolved in scenario revision before this verdict.

**Next skill:** `ticket`.

## Architecture check

### Systems touched

- `product/systems/member.md` — `member_follows` substrate (follow/unfollow handlers, `unfollowed_at` soft-delete), `member_saved_searches` (venue follow via `location_id`).
- `product/systems/groups.md` — `group_memberships` (join/leave handlers, `left_at` soft-delete, `source='explicit'`).
- `product/systems/location.md` — venue as a followable entity via saved-search substrate.

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | none | All three substrates shipped in Phase 1 (T042–T053) + S-saved-search (T102). |
| New columns required? | none | `unfollowed_at`, `left_at`, `removed_at` all exist. |
| New event types required? | none | `member.unfollowed`, `group.member_left`, `member.saved_search.removed` all registered. |
| Forward-tier impact | clear | b2 follow-stream/notifications layer on top; nothing in this surface constrains it. |
| Shell-entity smell | clean | All follows point Person→Person, Person→Group, Person→Location. No shell entity. |
| Loop fidelity | matched | Loop 8 (Follow what you love): "I found something I like — I want to stay connected without effort." This scenario delivers the management surface that makes following useful — see what you follow, prune what you don't. |
| Policy posture present | n/a | No new data sharing, monetary flow, or agent permissions. Follow/unfollow is Member-initiated, Member-visible. |

### Cross-system consistency

- `member.md` and `groups.md` use different soft-delete column names (`unfollowed_at` vs `left_at`) and different event names (`member.unfollowed` vs `group.member_left`). The scenario now correctly uses substrate-specific terminology (Unfollow for People/Venues, Leave for Groups).
- `member_saved_searches` uses `removed_at` — consistent with the S-saved-search substrate (T102).
- The `/you` page already exists (F030 signup lands there). The "Following" section adds to it without conflicting with existing sections.

### Architecture verdict

PROCEED — no new schema, no new handlers, no cross-system conflicts.

## Design check

### Surfaces touched

- `/you` "Following" section — **new** (horizontal card scroll added to existing page).
- `/you/following` — **new** (full management page with three sections).

### Components required

| Component | Exists in design language? | Notes |
|---|---|---|
| Horizontal card scroll | no | Common pattern but not yet in DLS. Ticket writer should add a recipe. |
| Follow/unfollow row with affordance | no | List row + inline action. Simple — no DLS entry needed; follows existing list patterns. |
| "More" link at scroll end | yes | Standard text-link pattern. |

### CTA placement

| Surface | CTA | Established pattern | Match? |
|---|---|---|---|
| `/you` Following section | "More" → `/you/following` | Text link at scroll end; matches existing `/you` section patterns | yes |
| `/you/following` People row | "Unfollow" | Destructive-secondary text link; consistent with F032 | yes |
| `/you/following` Group row | "Leave" | Destructive-secondary text link; matches `group.member_left` event semantics | yes |
| `/you/following` Venue row | "Unfollow" | Destructive-secondary text link; consistent with F033 | yes |

### Copy & tone

- "Following" section heading is neutral and clear. "People / Groups / Venues" section labels match the naming conventions table (no jargon, no "Items").
- Empty state "Nothing followed yet — start exploring." is warm and action-oriented.

### Empty / loading / error states

- Empty state described (no follows → CTA to explore).
- Followed-entity-deleted tombstone described.
- Re-follow after unfollow described (re-activate, not duplicate).
- Loading state not described — standard skeleton pattern applies.

### Design verdict

PROCEED — the horizontal card scroll is a new component but doesn't need a DLS spec gate. Ticket writer should include the scroll recipe in the build.

## Apple legibility

Clean — no new flags. All writes go through existing named handlers (`member.unfollow`, `group.member_leave`, `member.saved_search.remove`). `/you/following` is a clean deep-linkable URL. No new entity types exposed. The unified follows list is an App Intents candidate for "show me what I follow."

## Sibling-consistency findings

**F032** (Member page + follow, in `now/`): F042 extends F032's Member-follow substrate to the management surface. No divergence — F042 reuses the same `member_follows` table and `member.unfollow` handler. The "Unfollow" CTA label matches F032's toggle.

**F033** (Venue page, in `next/`): F042 reads the venue-follow rows that F033's "Follow this venue" CTA writes. No divergence — same `member_saved_searches` substrate, same `member.saved_search.removed` handler for unfollow.

**F035** (Group page, in `now/`): F042 surfaces Group joins that F035's "Join" CTA writes. The scenario now correctly uses "Leave" (not "Unfollow") for Groups, matching F035's `group.member_left` event.

No shared-base extraction needed — each follow type has its own substrate and the unified list renders them as rows in sections, not as instances of a shared component.

## Recommendations for the ticket writer

- The `/you` card scroll is the main new UI work. Consider a single ticket for the scroll component + `/you/following` page together — they share the same data queries.
- Reuse existing follow/unfollow handlers from F032, F033, F035 — no new server actions needed, just client-side calls from the management page.
- The horizontal card scroll recipe should land in the DLS as part of the build (inline, not a blocking gate).
- Test the "Leave" copy for Groups separately from "Unfollow" for People/Venues — the distinction is intentional.

## Decisions captured

None — no new architectural or design decisions surfaced.
