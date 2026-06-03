---
id: how-t086-member-interests-add-handler
purpose: Add the member.interests.add action handler and register the onboarding write handlers (place_interest.add, place_interest.remove, interests.add) in the action registry.
layer: how
status: open
---

# T086 — `member.interests.add` handler + onboarding handler registration

**Scenario:** [F030 — A newcomer signs up and lands in the feed](../../planning/now/scenario-F030-newcomer-signs-up-and-lands-in-feed.md)
**Binds to:** `product/systems/member.md` § Interests · action-layer (ADR-7 row+event same transaction) · migration 010 (`member_interests`)
**Status:** Open
**Bundle:** b1 (b1.4 — Newcomer entry)
**Depends on:** T048 (member_interests table) · T062 (place-interest handlers exist, unregistered)
**Repo / branch:** web / `t-f030`

## Serves

- F030 Data-Captured: "Interest tags → `member_interests` rows" + implicit "`member.interest_added` per tag".
- Onboarding (T089) needs `member.place_interest.add` and `member.interests.add` callable through the registry.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Handler — `src/actions/member/interests-add.ts`

- [ ] `memberInterestsAddInput` zod: `{ tags: string[] }` — 1..20 tags, each `^[a-z0-9-]+$`, length 1..60 (mirrors the schema CHECK).
- [ ] `memberInterestsAdd = defineHandler('member.interests.add', …)` — inside one transaction, inserts each tag into `public.member_interests (member_id, tag)` with `on conflict (member_id, tag) do nothing`; emits one `member.interest_added` event per **newly inserted** tag (skip already-present tags). Refuses `actingMemberId === 'self-bootstrap'`.
- [ ] Returns `{ memberId, addedTags: string[] }` (only the tags actually inserted).

### Registry — `src/actions/index.ts` + `src/actions/member/index.ts`

- [ ] Barrel exports `memberInterestsAdd`, `memberInterestsAddInput`, types.
- [ ] Registry surfaces `member.interests.add`, `member.place_interest.add`, `member.place_interest.remove` (the last two exist since T062 but were never registered — onboarding needs `place_interest.add`).

### Tests — `tests/actions-t086.test.ts`

- [ ] File-shape: `member/interests-add.ts` exists.
- [ ] zod: valid single + multi tag; rejects empty array, uppercase, spaces, >60 chars, >20 tags.
- [ ] Registry: `getHandler('member.interests.add')`, `member.place_interest.add`, `member.place_interest.remove` all non-null; `listHandlers()` includes them.
- [ ] Source-shape: handler source contains `on conflict` + `do nothing` and emits `member.interest_added`.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG T086 line. STAGE-LEDGER F030 row → `building`.

## Notes

- No migration. `member.interest_added` is already in the `member_events` event_kind CHECK (010/018/024). DB behaviour (insert + event row) verified by the F030 Playwright eval — unit tests are file-shape/zod/registry/source-shape per the T077 split.

## Completion

Date: 2026-06-02
Commit: `b12fbd6` (branch `t-f030`, web repo; unmerged per task)
Status: Build complete. 11/11 T086 vitest GREEN; conformance OK; tsc/eslint clean.
Notes: New `src/actions/member/interests-add.ts` (`member.interests.add`, idempotent `on conflict do nothing`, one `member.interest_added` per new tag). Registered `member.interests.add` + `member.place_interest.add` + `member.place_interest.remove` in `src/actions/index.ts` (+ barrel + re-exports). No migration. M2 self-review PROCEED. DEVIATIONS 2026-06-02.
