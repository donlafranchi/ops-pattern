---
id: how-t102-saved-search-surface-enablement
purpose: Surface enablement for member_saved_searches — server-action wrappers + FollowVenueButton component. Unblocks F033 (venue page) and F042 (unified following).
layer: how
status: open
---

# T102 — `member_saved_searches` surface enablement (Follow this venue CTA)

**Scenario:** substrate
**Binds to:** `product/systems/member.md` § Saved searches · `product/systems/location.md` § Saved searches scoped to a Location · ADR-21
**Status:** Open
**Bundle:** b1 (STAGE-LEDGER row `S-saved-search`)
**Depends on:** T063 (`member_saved_searches` schema, RLS, indexes, action handlers — all shipped)
**Repo / branch:** web / `t102`

**Serves:**
- **Loop:** 1 + 2 (Discover / Wonder) — the saved-search row is the notification primitive; "Follow this venue" is the lowest-friction entry point. Without this, a viewer at a venue page has no way to subscribe to future activity there.
- **Spec sections:** `member.md` § Saved searches — "The 'Follow this venue' UI affordance on a Location page creates a saved-search row with `location_id` set and a default label derived from the venue's name." `location.md` § Saved searches scoped to a Location.
- **Primitive shape:** Member → saved_search(location_id) → Location. No shell entity.
- **Failure mode this prevents:** F033 and F042 cannot ship — the venue page's "Follow this venue" CTA and the `/you/following` list both require a callable surface for saved-search create/remove.

## What already exists (T063 — do not rebuild)

T063 shipped migration 019 (`member_saved_searches` table, CHECK constraints, three indexes, owner-only RLS, `updated_at` trigger, event-kind CHECK extension) and three action handlers (`saved-search-create.ts`, `saved-search-update.ts`, `saved-search-remove.ts`) with barrel exports. **All of this is done.** This ticket builds the thin server-action layer and the reusable CTA component that sit on top.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — yes, this ticket introduces a new interactive component (`FollowVenueButton`).
- [ ] **M4 — `engineering:deploy-checklist`** — no new migrations; assess at merge time whether the server-action surface warrants a gate.
- [ ] **DEVIATIONS.md entry** at ticket close — even one line saying "no deviations."

## Acceptance Criteria

### Server-action wrappers — `web/src/app/_actions/saved-search-actions.ts`

- [ ] `'use server'` module exporting `followVenueAction` and `unfollowVenueAction`.
  _Why: shared location (not route-scoped) because both F033 (venue page) and F042 (`/you/following`) consume these. Mirrors the colocation pattern but at the shared `_actions/` level since two routes need it._
- [ ] `followVenueAction({ locationId: string, venueName: string })`:
  - Resolve auth via `createClient()` + `getUser()`. Throw if anon (caller handles the auth gate in the component).
  - Build the default label: `"Following ${venueName}"` (truncated to 80 chars if needed, per the label CHECK).
  - Call `memberSavedSearchCreate(ctx, { label, locationId })` via `resolveActionContext`.
  - Return `{ ok: true, savedSearchId: string }`.
  - Wrap `ActionError` into a plain `Error` for the client boundary (same pattern as `m/[handle]/actions.ts`).
- [ ] `unfollowVenueAction({ savedSearchId: string })`:
  - Resolve auth. Throw if anon.
  - Call `memberSavedSearchRemove(ctx, { id: savedSearchId })`.
  - Return `{ ok: true }`.
- [ ] **Do not wrap `.update` here.** The edit-filters composer is a b2 surface. At b1, the CTA creates and removes only.

### `FollowVenueButton` component — `web/src/components/venue/FollowVenueButton.tsx`

- [ ] `'use client'` component. Props: `{ loggedIn: boolean, locationId: string, venueName: string, existingSavedSearchId: string | null }`.
  _Why: the parent page (F033) server-renders the initial follow state by querying `member_saved_searches` for the current user + location. Passing `existingSavedSearchId` avoids a client-side fetch on mount._
- [ ] Three viewer states, mirroring `FollowMemberButton` (T092):
  - **Anon** — renders `<a href="/auth/login?next={currentPath}">Follow this venue</a>` (return URL so they land back on the venue page after signup).
    _Why: auth gate is a link, not a modal, matching the member-follow pattern established in T092._
  - **Auth'd** — toggle button: "Follow this venue" ⇄ "Following". Optimistic update with revert on error.
  - No self-exclusion logic needed (unlike member-follow, you can follow your own venue).
- [ ] On follow: call `followVenueAction({ locationId, venueName })`. Store the returned `savedSearchId` in component state for the unfollow path.
- [ ] On unfollow: call `unfollowVenueAction({ savedSearchId })`. Clear the stored ID.
- [ ] `aria-pressed` on the button for screen readers. `data-testid="follow-venue"` / `data-testid="following-venue"`.
- [ ] Error state: brief inline `<p role="alert">` below the button, same as `FollowMemberButton`.

### Tests

- [ ] Vitest for `followVenueAction`:
  - Auth'd user, valid locationId → returns `{ ok: true, savedSearchId }`, row exists in `member_saved_searches` with default label.
  - Anon caller → throws.
  - Label truncation: venue name > 80 chars → label is truncated to 80 and does not throw.
- [ ] Vitest for `unfollowVenueAction`:
  - Owner removes → returns `{ ok: true }`, row has `removed_at` set.
  - Non-owner → throws (collapses to NotFoundError per the handler's privacy posture).
- [ ] Component test for `FollowVenueButton`:
  - Anon → renders login link with correct return URL.
  - Auth'd, not following → renders "Follow this venue" button.
  - Auth'd, already following → renders "Following" button with `aria-pressed="true"`.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG.md updated with T102 ship line.
- [ ] STAGE-LEDGER row `S-saved-search` stamped `building` on start, `built` on commit. F033 + F042 rows annotated that their substrate gate is closed (do **not** auto-promote scenarios — PM moves files).

## Notes

- **No venue page layout.** F033 owns the venue page route, data fetching, and layout. This ticket lands the callable surface so F033 can drop `<FollowVenueButton>` into the page.
- **Action-handler conventions.** The server-action wrappers follow `web/src/app/m/[handle]/actions.ts` (T092) — `createClient()` → `getUser()` → `resolveActionContext()` → handler call → catch `ActionError`.
- **`_actions/` directory.** If `web/src/app/_actions/` doesn't exist, create it. The underscore prefix marks it as a non-route segment in Next.js App Router. This is the first shared server-action file; future cross-route actions land here too.
- **Default label.** `"Following ${venueName}"` matches the spec's "default label derived from the venue's name." The label is private to the Member (owner-only RLS) and editable at b2 via the saved-search composer.
- **Gate B (ratified-intent pre-flight).** No new absolutes encoded by this ticket. The owner-only RLS and at_least_one_filter CHECK are already shipped in migration 019. The "Follow this venue" affordance is described in `member.md` § Saved searches line 167 alongside a Ratified Intent (line 166). Pass.
- **What's deliberately deferred:** `.update` server-action wrapper (b2 composer), notification fan-out worker (b2), saved-search list/edit UI (b2), group-follow substrate for F042 (separate ticket — `member_follows` is member→member only today; F042 will need `member_group_follows` or an expansion of saved-search to cover Groups).

## Completion

Date: 2026-06-11
Commit: d85a54c (web, branch `t102`)

**Built on branch `t102` (off main `944d6a5`).**

- `web/src/app/_actions/saved-search-actions.ts` — `followVenueAction` / `unfollowVenueAction` + exported `buildVenueFollowLabel` helper (default label `"Following ${venueName}"`, truncated to 80). `.update` deliberately not wrapped (b2).
- `web/src/components/venue/FollowVenueButton.tsx` — three-state client component (anon login link with `usePathname` return URL; auth'd toggle with optimistic update + revert; `aria-pressed`, `role="alert"` error, `data-testid` follow-venue / following-venue / follow-venue-signin).
- `web/src/actions/index.ts` — root barrel re-exports `memberSavedSearchCreate` / `memberSavedSearchRemove` (matches the T092 import pattern).
- Tests: `saved-search-actions.test.ts` (9) + `FollowVenueButton.test.tsx` (5) = **14 GREEN**. Full suite **911 passed / 1 skipped** (the 4 subprocess-spawning CI-enforcement suites are green when run serially — they race under Vitest parallelism, pre-existing). `next build` clean. `check:action-layer` OK; eslint clean.
- **DB-row assertions delegated to the F033 Playwright eval** per the T091/T075 no-live-DB-Vitest convention (see DEVIATIONS T102 §1).

**Gates:** M2 Approve · M3 pass at component level (two pre-existing `.btn-primary` DLS findings spun out to a separate task) · M4 deferred to merge (no migration / RLS / env change). DEVIATIONS T102 filed.

**Substrate gate closed for F033 + F042** — `<FollowVenueButton>` is droppable into the venue page. STAGE-LEDGER `S-saved-search` stamped `built`. F033 / F042 rows annotated (not auto-promoted).
