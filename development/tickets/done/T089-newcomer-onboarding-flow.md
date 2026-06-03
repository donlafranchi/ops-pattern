---
id: how-t089-newcomer-onboarding-flow
purpose: Post-auth three-step onboarding (profile · locality · interests) built on MultiStepComposer, each step writing immediately, landing the new Member back on the populated feed.
layer: how
status: open
---

# T089 — Newcomer onboarding flow (profile · locality · interests)

**Scenario:** [F030 — A newcomer signs up and lands in the feed](../../planning/now/scenario-F030-newcomer-signs-up-and-lands-in-feed.md)
**Binds to:** `src/components/composer/MultiStepComposer.tsx` (T071) · T086 (interests/place-interest handlers) · `product/systems/member.md` (profile fields)
**Status:** Open
**Bundle:** b1 (b1.4 — Newcomer entry)
**Depends on:** T086 (registered handlers) · T071 (composer) · T044 (auth signup → member.create)
**Repo / branch:** web / `t-f030`

## Auth-method decision (gate resolved)

The scenario blocked `ticket` on the auth-method choice. **Resolved for b1: magic-link is the primary auth method** (passwordless, lowest friction, already the `/auth/login` default); social login deferred to b2; email/password retained as the eval/test path. No new auth code — `member.create` already fires from the T044 signup hook. New signups route to `/onboarding` via `?next`.

## Serves

- F030 AC "Signup → profile → locality → interests onboarding flow" — three sequential steps, locality required, each step's row written on submit (back-out leaves a partial, not aborted, record).
- F030 AC "Feed re-renders against the chosen scope" — completion lands on `/`.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (new page — MANDATORY).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Server actions — `src/app/onboarding/actions.ts` (`'use server'`)

- [ ] `saveProfileAction({ displayName, handle, bio?, pronouns?, avatarUrl? })` → updates the acting Member's `members` row via the session-bound client (owner-update RLS). On `handle` unique-violation (23505) returns `{ ok:false, field:'handle', suggestions:[…] }` from `suggestHandles(handle)`; else `{ ok:true }`.
- [ ] `setHomeLocalityAction({ placeId })` → invokes `member.place_interest.add` (`scopeKind:'primary_home'`) through the action layer (resolveActionContext → invoke), mirroring `createProductAction`. Returns `{ ok:true }`.
- [ ] `addInterestsAction({ tags })` → invokes `member.interests.add`. Returns `{ ok:true, addedTags }`. Empty tags is a valid skip (no-op).

### Helpers — `src/lib/onboarding/handles.ts`

- [ ] `suggestHandles(base)` → up to 3 deterministic candidates (`base-2`, `base-3`, `base-<4hex-of-base>`); pure.
- [ ] `validateHandle(h)` → mirrors the `members.handle` regex/length.

### Flow — `src/components/onboarding/OnboardingFlow.tsx` (client) + `src/app/onboarding/page.tsx`

- [ ] `/onboarding` server page: redirect unauthenticated → `/auth/signup?next=/onboarding`; redirect a Member who already has an active `primary_home` → `/` (idempotent re-entry). Otherwise mount `<OnboardingFlow>` with the Member's current handle/display_name prefilled.
- [ ] `<OnboardingFlow>` uses `MultiStepComposer` with 3 steps: **Profile** (name, handle req; bio/pronouns/photo optional), **Home locality** (Place picker, required — not skippable), **Interest tags** (2–6 from controlled vocab, skippable). `onAdvance` fires the matching server action per step so each row writes before the next step. `onComplete` → `router.push('/')`.
- [ ] Handle-collision: profile step surfaces inline error + suggestion chips from `saveProfileAction`.

### Post-auth redirect

- [ ] `src/app/auth/signup/page.tsx` (or callback) defaults new-signup `next` to `/onboarding` when no explicit `next` is set. (Login keeps `/`.)

### Tests

- [ ] `src/lib/onboarding/handles.test.ts` — `suggestHandles` shape/determinism; `validateHandle` accept/reject.
- [ ] `src/components/onboarding/OnboardingFlow.test.tsx` — renders 3 steps; locality step not skippable, interests skippable; advancing calls the injected action; collision surfaces suggestions.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG T089 line. STAGE-LEDGER F030 row → `eval` after the F030 commit.

## Notes

- No `member.update` handler exists; profile fields (display_name/handle/bio/pronouns/avatar) are not declarations and write directly through the owner-update-RLS client without an event. DEVIATIONS + SPEC-PATCHES (`member.md` — decide whether profile edits emit `member.updated`).
- Interest-tag controlled vocabulary: initial set inlined from `b1-themes.md` as `src/lib/onboarding/interest-vocab.ts`.

## Completion

Date: 2026-06-02
Commit: `b12fbd6` (branch `t-f030`, web repo; unmerged per task)
Status: Build complete. 9/9 T089 vitest GREEN (handles + OnboardingFlow integration); tsc/eslint/conformance clean.
Notes: `src/app/onboarding/{page,actions}.ts` + `src/components/onboarding/OnboardingFlow.tsx` + `src/lib/onboarding/{handles,interest-vocab}.ts`; signup `next` defaults to `/onboarding`. Locality + interests go through the action layer (events); profile writes directly (no `member.update` handler/event). Auth-method gate resolved (b1: magic-link primary). M2 self-review PROCEED; M3 deferred (shares the composer a11y follow-up). DEVIATIONS + SPEC-PATCHES 2026-06-02.
