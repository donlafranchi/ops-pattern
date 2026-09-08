# T138: Remove the standing badge

**Scenario:** substrate — bound to `planning/backlog/decision-standing-badge-requires-activity.md` (RULED 2026-09-07: the badge is removed, not fixed)
**Status:** Complete
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** none

**Serves:** the ruling under promise 3 — a badge derived from role alone tells people who counts, the same shape as ownership tiers and sourced-values badges, both already refused. No replacement is built: no activity counter, no interaction count, no "active since."

## What is true today

`web/src/lib/member/resolve-member-page.ts:176-182` queries `public.member_has_standing_presence` and sets `hasStandingPresence` on the page data. `web/src/components/member/MemberPublicPage.tsx:37-44` renders it as a chip, "Active in the community," on `/m/[handle]`.

## Acceptance Criteria

- [x] The "Active in the community" chip (and its `data-testid="member-standing-badge"`) is removed from `MemberPublicPage.tsx`.
- [x] `resolve-member-page.ts` no longer queries `member_has_standing_presence` or sets `hasStandingPresence` on the result. `ResolvedMemberPage` loses the field.
- [x] No other consumer of `hasStandingPresence` remains — confirmed by grep, plus M2 caught one the ticket didn't name: `evals/features/F032-*.spec.ts` (see Deviation 1).
- [x] The `member_has_standing_presence` **view itself is left in the migration, unwired** — no migration touched. **Flagged here explicitly so this doesn't get rediscovered later as mystery substrate:** `web/supabase/migrations/014_groups.sql:344-350` defines the view, `029_member_public_projections.sql` grants it, and as of this ticket **nothing in `web/src/` reads it.** It exists solely as the fossil of a removed feature. If it resurfaces in a future audit, this ticket (and `development/deviations/T138.md`) is why.
- [x] Existing test for the badge deleted/rewritten to assert its absence, not weakened.
- [x] BUILD-LOG.md updated.

## Notes

**No activity-based replacement.** The ruling is explicit: none was asked for, and none is built here. If a future ticket wants a real signal, it gets its own decision and its own ticket.

**Sequencing with T137.** T137 ("Findability follows what you've published") separately deletes the prompt-on-acquisition mechanism that reads the `steward` role for a different purpose (the one-time discoverability prompt). The two tickets touch different files and don't conflict, but land in either order — this one only removes the badge UI + its read; it does not touch `acquisition-prompt.ts`.

## Workflow gates

- [x] **M2 — `engineering:code-review`** before commit. Caught the F032 eval + fixture-comment gap outside the ticket's named files; fixed in the same pass.
- [x] **M4** — N/A, no migration (the view stays in place, unwired).
- [x] **DEVIATIONS.md entry** at close. `development/deviations/T138.md`.

## Completion

Date: 2026-09-07
Commit: 9e8430b (web) · merged to main via 60ad31c
Tests: 22 vitest GREEN (`resolve-member-page.test.ts`, `MemberPublicPage.test.tsx`). tsc clean on touched files. `evals/features/F032-*.spec.ts` corrected but not run live (needs a seeded Supabase instance — outside this session's tooling).
Deviations: `development/deviations/T138.md` — one Playwright eval and one fixture comment outside the ticket's named files still referenced the removed badge; fixed in the same pass.
Gates: M2 Approve (one finding, fixed) · M4 N/A.
