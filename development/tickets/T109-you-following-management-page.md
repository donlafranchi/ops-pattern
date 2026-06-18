# T109: `/you/following` management page — sections, Unfollow/Leave, undo

**Scenario:** `planning/next/scenario-F042-member-follows-producer-group-venue.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T108 (unified follows reader — this page groups its output into sections)

**Serves:**
- **Loop:** 8 (Follow what you love) — "see what you follow, prune what you don't." The management page is what makes following safe to do liberally: easy to walk back.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) — the manage-your-follows tail of the search→follow loop.
- **Primitive shape:** Person → {Person, Group, Location} soft-delete writes via existing handlers. No shell entity.

## Workflow gates (mandatory during rebuild phase)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — new page with repeated interactive (Unfollow/Leave) rows + undo affordance. Required.
- [ ] **M4 — `engineering:deploy-checklist`** — only if merged to main with a migration; this ticket adds no migration.
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line.

## Acceptance Criteria

### Route + page

- [ ] Create `web/src/app/you/following/page.tsx` (authed; redirect to sign-in if anon, return URL `/you/following`).
- [ ] Page reads `getMemberFollows` (T108) and renders **three flat sections in this order: People, Groups, Venues**, each row showing `displayName` + `thumbnailUrl` (or placeholder/tombstone fallback).
  _Why: section labels match the naming-conventions table — People/Groups/Venues, no "Items," no schema jargon (review-F042 § Copy)._

### Affordances per section

- [ ] **People** rows show an **"Unfollow"** affordance → calls the existing `member.unfollow` handler (writes `member_follows.unfollowed_at`; `member.unfollowed` event logs).
- [ ] **Groups** rows show a **"Leave"** affordance → calls the existing `group.member_leave` handler (writes `group_memberships.left_at`; `group.member_left` event logs).
- [ ] **Venues** rows show an **"Unfollow"** affordance → calls the existing `member.saved_search.remove` handler (writes `member_saved_searches.removed_at`; `member.saved_search.removed` event logs).
  _Why: "Leave" vs "Unfollow" is intentional and substrate-accurate — Groups are named, addressable memberships you leave; People/Venues are asymmetric subscriptions you unfollow (review-F042 § Sibling-consistency, matching F035's `group.member_left` semantics). Test the two copy strings separately._
- [ ] All three affordances are destructive-secondary text links (not primary buttons), consistent with F032/F033.

### Inline update + undo

- [ ] On Unfollow/Leave, the row updates inline — disappears from the list (or shows an "Undo" affordance for a few seconds). The Member stays on `/you/following`.
- [ ] **Undo / re-follow re-activates the soft-deleted row** (clears `unfollowed_at` / `left_at` / `removed_at`) rather than inserting a duplicate.
  _Why: scenario edge case "Re-follow after unfollow → re-activate, not duplicate." The existing handlers already upsert-on-conflict for re-follow; the Undo path calls the same follow/join/save handler, not a fresh insert._

### Empty state

- [ ] When the Member has zero follows across all three substrates, render the empty state: "Nothing followed yet — start exploring." with a CTA linking to `/explore` (fallback `/`).

### Counts respect privacy

- [ ] Any per-Group "follower count" surfaced on a Group row reflects **listed memberships only**, matching the public Group page.
  _Why: reads the existing `member_public_group_memberships` projection (shipped T095) — the public count never exposes unlisted/private memberships. Don't count raw `group_memberships`; use the projection the Group page uses._

### Edge cases

- [ ] Followed Person non-discoverable or soft-deleted: row renders as a tombstone (from T108's reader), Unfollow still works to remove it. No error.
- [ ] Followed Group flips to `private`: row stays while the Member is still a listed member; otherwise hidden (handled by the reader's RLS-respecting join).

### Tests

- [ ] Test: `/you/following` renders People/Groups/Venues sections in order with correct per-section affordance labels ("Unfollow" / "Leave" / "Unfollow").
- [ ] Test: Unfollow on a People row calls `member.unfollow`; Leave on a Group row calls `group.member_leave`; Unfollow on a Venue row calls `member.saved_search.remove` — each writes the correct soft-delete column + logs the correct event.
- [ ] Test: Undo within the window re-activates the soft-deleted row (no duplicate insert).
- [ ] Test: zero-follow Member sees the empty state with an explore CTA.
- [ ] Test: Group-row follower count reflects listed memberships only.

### Build artifact

- [ ] BUILD-LOG.md updated with T109 status.

## Notes

- **No new server actions** (review-F042 § Recommendations) — all three soft-delete writes reuse handlers shipped by T091 (`member.unfollow`), T070 (`group.member_leave`), T102 (`member.saved_search.remove`). This page is client calls + list rendering over T108's reader.
- **Section grouping** is presentation over the same `getMemberFollows` union — partition T108's normalized list by `kind`. Don't write three separate queries here.
- **Undo pattern:** prefer the optimistic-remove-with-undo-window over a confirm dialog — lighter touch for a reversible action. If the build agent finds no existing undo primitive, a local timeout + re-activate call is acceptable; note it as a deviation if it warrants a DLS recipe.
- **Encodes ratified absolutes:** `member.md:368` (owner-only saved-search RLS, Ratified 2026-05-23, ADR-21); `groups.md:393` (`source='explicit'` addressability, Ratified 2026-05-31); count-privacy via `member_public_group_memberships` (shipped T095). All reuse — no new absolute introduced.
- **No migration.** Pure surface work over shipped substrate.

## Completion

Date: {YYYY-MM-DD}
Commit: {git hash}
