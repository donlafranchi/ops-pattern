# T137: Findability follows what you've published

**Scenario:** `planning/now/scenario-F060-someone-starts-something-without-opening-a-shop.md` (bundled fix — PM-approved directly, 2026-09-07, alongside the findability ruling; rides F060's "a Page renders correctly wherever it's read" concern)
**Status:** Complete
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** none

**Serves:** the ratified findability rule — *Pages are findable; people who have published something are findable through what they made; people who have published nothing are not.* Safety default, not a feature: it protects someone who has put nothing forward.

**Spec contract:** `product/foundation/settled.md` § findability · `product/systems/member.md` § Privacy controls + § Prompt-on-acquisition (both superseded in part by this ticket).

## What is true today, and what is not broken

**Pages and Items are already findable with no opt-in.** The Page read requires active + listed + not dissolved; the browse index requires published + not deleted + a listed Page. **Neither consults the member flag.** A producer who signs up and creates a Page with a listing is in browse, in search and on the map immediately.

**The flag governs the bare person only** — whether `/m/[handle]` is indexed, whether they surface in a people-search that does not exist yet, and **whether their name on their own listing renders as a link or as plain text.**

**So this ticket is one derivation change, not a rescue.** The earlier "a producer could sign up and be invisible" reading was wrong and is recorded as such.

## Acceptance Criteria

- [x] The member-link decision on Item pages and the shop page derives from **whether the Member has published anything** — at least one active Page membership, or at least one published Item — rather than from the stored opt-in flag.
- [x] A Member who has published nothing renders as plain text, exactly as today. **No regression in the protective direction.**
- [x] A Member who has published something renders as a link **without having opted in to anything.**
- [x] The one-time discoverability prompt is **deleted, not built**: `maybeEnqueueDiscoverabilityPrompt`, its call sites in the Group create/join path, its test, and the `member_prompts` insert. *(Production carries zero rows; nothing to migrate.)*
- [x] `member_prompts` — **PM call at build time**: drop the table, or leave it as unused substrate for a future prompt of a different kind. Recommend dropping; it exists for exactly one prompt kind and that kind is gone.
- [x] `member_privacy.is_discoverable` is **left in place**, unread by this path. It still governs the not-yet-built people-search. **Do not delete a privacy column in the same ticket that changes a derivation.**
- [x] A test asserts the two directions: published → link; nothing published → plain text.

## Notes for the build

- **Four resolvers read the discoverability projection** — product, service, gathering and shop. They share one shape; change it once and call it from all four rather than editing four copies.
- **This removes the last reader of the `steward` role**, since the badge that read it is also being removed. That is expected, and the role value stays as a description of what someone does.
- **`profile_visibility` is a separate gate and is untouched** — it decides who may *view* a profile, not who can *find* it.

## Workflow gates

- [x] **M2 — `engineering:code-review`** before commit.
- [x] **M3 — accessibility**: N/A only if no new component; a link that appears where text was is a change in reading order and gets checked.
- [x] **DEVIATIONS.md entry** at close.

## Completion

Date: 2026-09-07
Commit: 4cbc492 (web) · merged to main via 0bf88df
Tests: 104 vitest GREEN across the touched suites (`has-published.test.ts` + `migrations-member-has-published.test.ts` new; four resolver suites + four public-page suites updated for the renamed field). Full suite: every failure is pre-existing on main — the known `EmailFirstSignup` red plus the ci-tooling suites that shell out to eslint and time out under parallel load; each passes or fails identically on `main` in isolation. tsc error count unchanged from main (3). eslint clean on touched files.
Deviations: `development/deviations/T137.md` — membership branch narrowed to explicit managing roles; `member_prompts` dropped per the ticket's recommendation; spec text routed Type A to `tidy`; follows-list tombstone observed, not changed.
Gates: M2 Approve (two findings, both fixed before commit — soft/joiner memberships were counted, and a stale reader count in a comment) · M3 N/A — no new component; both render states pre-exist from T095, only the predicate changed · M4 — migration 038 must be applied to production by hand (`npm run db:push` once T140 lands; `supabase db push` today).
