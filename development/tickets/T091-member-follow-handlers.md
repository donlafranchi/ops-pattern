---
id: how-t091-member-follow-handlers
purpose: member.follow / member.unfollow action handlers + server-action wrapper + registry wiring — the write side of F032.
layer: how
status: done
---

# T091 — member.follow / member.unfollow handlers

**Scenario:** [F032 — A viewer finds a member's public page and follows them](../../planning/now/scenario-F032-viewer-finds-member-page-and-follows.md)
**Binds to:** `product/systems/member.md` § Follows substrate · ADR-7 (action-layer-only writes) · ADR-10 (same-transaction row+event)
**Status:** Open
**Bundle:** b1 (b1.4 — Member surface)
**Depends on:** T048 (member_follows table + indexes + RLS — shipped) · T043 (action layer)
**Repo / branch:** web / `t-f032`

## Serves

- F032 Then-clause "Authenticated follow writes a row + event": a `member_follows` row writes with `(follower_member_id, followed_member_id)`; `member.followed` event logs; soft-unfollow sets `unfollowed_at`.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Handler — `src/actions/member/follow.ts`

- [ ] `memberFollow(ctx, { followedMemberId })` — inside `withTransaction`:
  - Reject self-follow (`followedMemberId === ctx.actingMemberId`) with `ValidationError` (the DB CHECK also guards, but fail early with a clean code).
  - Verify the target Member exists and is not soft-deleted (`deleted_at is null`); else `NotFoundError`.
  - Upsert `member_follows (follower_member_id, followed_member_id)` — `on conflict (follower_member_id, followed_member_id) do update set unfollowed_at = null` (re-follow revives a soft-unfollowed row; created_at preserved).
  - `appendEvent('member_events', { member_id: actingMemberId, event_kind: 'member.followed', payload: { followed_member_id } })`.
  - Returns `{ followerMemberId, followedMemberId, following: true }`.
- [ ] `memberUnfollow(ctx, { followedMemberId })` — sets `unfollowed_at = now()` on the active row (no-op if already unfollowed / absent); emits `member.unfollowed`; returns `{ ..., following: false }`.
- [ ] Both reject the `'self-bootstrap'` sentinel actingMemberId (mirror place-interest-add guard).

### Wiring

- [ ] Barrel export in `src/actions/member/index.ts`.
- [ ] Registry entries `member.follow` / `member.unfollow` in `src/actions/index.ts`.

### Server action — `src/app/m/[handle]/actions.ts`

- [ ] `'use server'` module. `followMemberAction({ followedMemberId })` / `unfollowMemberAction({ followedMemberId })`:
  - Resolve the auth'd user id (`createClient().auth.getUser()`); throw "You must be signed in." if anon.
  - `resolveActionContext({ actingMemberId })` → invoke the handler; map `ActionError` → `throw new Error(err.message)` (mirror onboarding/actions.ts).
  - Returns `{ ok: true; following: boolean }`.

### Tests — `src/actions/member/follow.test.ts`

- [ ] Unit (mocked tx client): self-follow → ValidationError; missing/deleted target → NotFoundError; happy path issues the upsert + appendEvent with `member.followed`; unfollow issues the update + `member.unfollowed`. (Follow the existing handler-test mock style; if none exists, assert on the `ctx.db.query` calls via a fake PoolClient.)

### STAGE-LEDGER

- [ ] STAGE-LEDGER F032 row advances to `build` (handler half).

## Notes

- Event attribution: `member_events.member_id` = the **follower** (acting Member), payload carries `followed_member_id` — mirrors `member.place_interest_added` (target = acting Member). `acting_member_id` is injected by `appendEvent`.
- No migration: `member_follows`, its partial indexes, RLS public-read, and the `member.followed`/`member.unfollowed` event_kinds all shipped in T048 / 002_members.sql.

## Completion

Date: 2026-06-02
Branch: web / `t-f032` (not merged — left on branch per PM)
Status: Build complete. `memberFollow` / `memberUnfollow` (`src/actions/member/follow.ts`) — self-follow + sentinel guards pre-transaction; upsert-revive on re-follow; soft-unfollow via `unfollowed_at`; `member.followed` / `member.unfollowed` events. Barrel + registry wired. Server actions in `src/app/m/[handle]/actions.ts`. 12/12 `tests/actions-t091.test.ts` GREEN; row+event behaviour verified by the F032 Playwright eval (6/6). No migration (substrate from T048).
DEVIATIONS: 2026-06-02 — none specific to the handlers (the projection-view + build-breakage entries are filed under T092).
