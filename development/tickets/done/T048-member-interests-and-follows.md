# T048 — Member interests + member follows (`010_member_interests_follows.sql`)

**Scenario:** `notes/migration-to-primitives.md` § Phase 1 — Member surface (`007b_member_interests.sql` + `007c_member_follows.sql` in the plan; consolidated into `010_*` per the renumbering).
**Status:** Complete
**Completed:** 2026-05-12T08:21:48-07:00
**Bundle:** b1
**Depends on:** T047 (`members` augmentation must land first so the bootstrap trigger pattern is established and the FK fortification is in place).

**Serves:**
- **Loop:** Loop 8 (Follow people) directly — `member_follows` is the substrate. Loop 2 (Wonder) and the locality-first index indirectly via `member_interests` (Items use it for relevance and Group suggestion at onboarding).
- **Canonical example:** Two threads — Aaron's pickup followers (Loop 8 substrate; Aaron's followers see his pickup gatherings); the Concerts-in-the-Park taste profile (Members declare `live music`, `summer`, `outdoor` interests via `member_interests` and the index uses them for relevance scoring).
- **Primitive shape:** Person → Person (follow) and Person → tag-vocabulary. No shell entity in between.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode).
- [x] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — applies.
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations."

## Acceptance Criteria

### Migration `web/supabase/migrations/010_member_interests_follows.sql`

**`public.member_interests` (per `member.md` line 230):**

- [ ] Table: `member_id uuid not null references public.members(id) on delete cascade`, `tag text not null check (char_length(tag) between 1 and 60 and tag ~ '^[a-z0-9-]+$')`, `created_at timestamptz not null default now()`, composite PK on `(member_id, tag)`.
- [ ] Index `idx_member_interests_tag on public.member_interests (tag)` — supports the inverse lookup ("which Members declare interest in `live-music`?") for the Group-suggestion query at onboarding.
- [ ] RLS enabled. Policies:
  - [ ] `member_interests_public_read` — `for select using (true)`. Interests are public-by-default; the `member_privacy.show_following` toggle is for the follow surface, not interests. The Member's interests inform their feed and the Group suggestions surfaced TO them — public visibility powers Item discoverability ("I love crafts; show me Items that match").
  - [ ] `member_interests_owner_write` — N/A (action-layer-only). No INSERT/UPDATE/DELETE policy.

**`public.member_follows` (per `member.md` line 243):**

- [ ] Table: `follower_member_id uuid not null references public.members(id) on delete cascade`, `followed_member_id uuid not null references public.members(id) on delete cascade`, `created_at timestamptz not null default now()`, `unfollowed_at timestamptz`, composite PK on `(follower_member_id, followed_member_id)`, CHECK `(follower_member_id <> followed_member_id)`.
- [ ] Indexes (per `member.md` lines 255-258):
  - [ ] `idx_follows_followed_active on public.member_follows (followed_member_id) where unfollowed_at is null` — "who follows X" surface (Loop 8).
  - [ ] `idx_follows_follower_active on public.member_follows (follower_member_id) where unfollowed_at is null` — "who does X follow" surface.
- [ ] RLS enabled. Policies — these are the trickiest in this batch because `member_privacy.show_followers` / `show_following` gates visibility per-Member:
  - [ ] `member_follows_self_read` — `for select using (follower_member_id = auth.uid() or followed_member_id = auth.uid())`. A Member can always see their own follow relationships regardless of any privacy setting.
  - [ ] `member_follows_public_read` — `for select using (` exists subquery for both endpoints' privacy: a row `(A, B)` is publicly readable only when both `A.show_following = true` and `B.show_followers = true`. Implement as a single policy with two exists subqueries on `member_privacy`. Don't conflate with `member_follows_self_read` — both can fire; row is visible if either matches.
  - [ ] No INSERT/UPDATE/DELETE policy — action-layer-only.

### Tests / build-side assertions

- [ ] `web/tests/migrations-t048.test.ts` — file-shape suite (~20 assertions: directory state has 010, member_interests shape + index + RLS, member_follows shape + soft-unfollow column + CHECK preventing self-follow + two partial indexes + the two SELECT policies + privacy-conditional EXISTS subqueries, no INSERT/DELETE policies on either table).
- [ ] Sandbox `node` smoke run matches the Vitest suite.
- [ ] `supabase db reset` runs cleanly with all nine migrations (001, 002, 004, 005, 006, 007, 008, 009, 010).
- [ ] Studio smoke verification (after build):
  - [ ] `select count(*) from public.member_interests;` — returns 0.
  - [ ] `select count(*) from public.member_follows;` — returns 0.
  - [ ] Attempt to insert a self-follow row directly — verify CHECK rejects.
  - [ ] `select polname from pg_policies where tablename = 'member_follows';` — confirms `member_follows_self_read` and `member_follows_public_read` both present.
- [ ] BUILD-LOG.md updated.

## Notes

**Why interests are public-by-default.** Interests power Item relevance and Group suggestion. Making them private breaks the feed quality immediately and forces every relevance-scoring query to JOIN through `member_privacy`. The Member's *follow graph* is privacy-gated (per `member_privacy.show_following` / `show_followers`); their *taste profile* (interests) is not. Members who want to hide an interest just remove it. This matches `member.md`'s framing of interests as "embedding-context input" — public-by-default in the same sense item hashtags are public.

**Privacy-conditional RLS pattern.** The `member_follows_public_read` policy needs to JOIN to `member_privacy` for both endpoints of the relationship. Pattern: two `exists` subqueries within a single policy. Slight perf cost on every public follow-query; cheap to optimize at T2 if hot.

**No bootstrap trigger.** Neither table needs a row-per-Member on signup — interests and follows are zero-cardinality at signup. Members add them via action handlers (`member.interests.add`, `member.follow`) when ready.

**Tag vocabulary.** `member_interests.tag` is enforced as lowercase alnum + hyphen at the column. The full controlled vocabulary lives in the action layer (`member.interests.add` validates against a stable list before insert). Free-form tags are rejected by the handler, not the schema — this lets the vocabulary evolve without migrations.

**`member.followed` / `member.unfollowed` events.** Already in T042's `member_events` event_kind CHECK enum. No event-log changes needed in this ticket; the action handlers will emit them when they ship.

**Soft-unfollow vs hard delete.** Unfollow sets `unfollowed_at`; the row stays for analytics and "you previously followed X" surfaces. Re-following clears `unfollowed_at` and updates `created_at`. Hard delete is admin-only.

## Completion

Date: 2026-05-11
Commit: (web/) T048 — see web repo HEAD

**Files shipped:**
- `web/supabase/migrations/010_member_interests_follows.sql` — two tables in one migration. `member_interests` (composite PK, tag CHECK, idx_member_interests_tag, public-read RLS). `member_follows` (composite PK, no-self-follow CHECK, soft-unfollow via `unfollowed_at`, two partial indexes, single `member_follows_public_read` policy `using (true)` per the 2026-05-11 product re-scope on follow visibility — see DEVIATIONS).
- `web/tests/migrations-t048.test.ts` — 19 file-shape Vitest assertions across 3 describe blocks.

**Build-side verification:**
- Plain-node smoke run (sandbox): 19/19 passing. Mirrors the Vitest suite one-for-one (sandbox can't run Vitest due to rolldown's darwin-vs-linux binding mismatch — same pattern as T047).

**M2 code review (engineering:code-review, 2026-05-11) — REQUEST CHANGES → resolved in-place pre-commit:**
The original migration gated `member_follows_public_read` on `member_privacy.show_following` + `show_followers` via dual EXISTS. M2 caught a critical RLS bug: the EXISTS subqueries are blocked by `member_privacy`'s own owner-only RLS, so the policy returned false in every non-owner case. The PM used the review window to push back on the privacy posture itself — follow graph is community-fabric; the real privacy work belongs on `member_location_affinities` (T049, where `lives`/`works` rows go through SECURITY DEFINER functions per `member.md` lines 295-298). Migration updated in-place to `using (true)`; the `show_following` / `show_followers` columns from T047 remain as reserved substrate. Recorded in DEVIATIONS; flagged in `member.md` under the `member_privacy` section for `pipeline-product` to memorialize.

**Runtime verification (deferred to local + eval):**
- `supabase db reset` with all nine migrations — user runs locally.
- Studio smoke: `select count(*) from public.member_interests` = 0; `select count(*) from public.member_follows` = 0; attempt self-follow INSERT — CHECK rejects; `select polname from pg_policies where tablename = 'member_follows'` returns `member_follows_public_read` only.

**Workflow gates:**
- [x] **M2 — `engineering:code-review`** — REQUEST CHANGES 2026-05-11; resolved in-place pre-commit (privacy gate dropped per PM product decision; member.md flagged for product memorialization).
- [x] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — pending; invoke before any merge to main.
- [x] **DEVIATIONS.md entry** — appended at ticket close (full entry — schema deviates from spec's strict opt-out posture for follow visibility).
