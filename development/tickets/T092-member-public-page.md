---
id: how-t092-member-public-page
purpose: Public Member page at /m/[handle] — resolver + page + MemberPublicPage component + FollowMemberButton client island + Playwright eval. The read+follow surface of F032.
layer: how
status: done
---

# T092 — Public Member page (`/m/[handle]`)

**Scenario:** [F032 — A viewer finds a member's public page and follows them](../../planning/now/scenario-F032-viewer-finds-member-page-and-follows.md)
**Binds to:** `product/systems/member.md` · `product/systems/groups.md` (standing-presence view) · ADR-20 (Member page is the one global namespace) · CLAUDE.md § Naming conventions
**Status:** Open
**Bundle:** b1 (b1.4 — Member surface)
**Depends on:** T091 (follow/unfollow handlers + server actions) · T074 (resolve-shop pattern) · T088 (item-url helper)
**Repo / branch:** web / `t-f032`

## Serves

- F032 Then-clauses: anonymous read of name/handle/photo/bio/pronouns/standing-badge/items/listed-groups; anon Follow tap → sign-in with return URL; auth'd Follow flips CTA to "Following"; privacy gates (only listed groups, never place-interests); soft-deleted Member → 404; self-view shows "Edit profile" not Follow.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (new public page — MANDATORY).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Resolver — `src/lib/member/resolve-member-page.ts`

- [ ] `resolveMemberPage(supabase, { handle, viewerId })` → resolves the `members` row by handle (RLS `members_public_read` already filters `deleted_at is null` + `login_disabled`, so a soft-deleted/system Member yields null → 404).
- [ ] Returns `{ memberId, handle, displayName, bio, pronouns, avatarUrl, hasStandingPresence, items: MemberItem[], groups: MemberGroup[], isSelf, isFollowing } | null`.
  - `items`: published, non-deleted `items` authored by the Member (`member_id`), each `{ itemId, kind, title, brandLabel, href }` via `itemHref`. Empty array → empty-state.
  - `groups`: active memberships (`group_memberships.left_at is null`) in non-dissolved groups with `discoverability = 'listed'` only → `{ slug, name, kind }`. Unlisted/private groups never surface. **Place-interests are never queried.**
  - `hasStandingPresence`: presence in `member_has_standing_presence` view.
  - `isSelf`: `viewerId === memberId`. `isFollowing`: an active `member_follows` row (`follower=viewerId, followed=memberId, unfollowed_at is null`); false for anon.

### Page — `src/app/m/[handle]/page.tsx`

- [ ] New route (the `/m/[handle]` index — siblings `/m/[handle]/p|s|e/[slug]` already exist). Server component: `resolveMemberPage` with the auth'd viewer id (null for anon); null → `notFound()`. Renders `<MemberPublicPage>`.
- [ ] `generateMetadata`: display name + handle in `<title>`.

### Component — `src/components/member/MemberPublicPage.tsx`

- [ ] Header: avatar (decorative img, graceful when null), display name (`data-testid="member-name"`), `@handle` (`data-testid="member-handle"`), pronouns + bio when set, standing-presence badge (`data-testid="member-standing-badge"`) only when `hasStandingPresence`.
- [ ] Follow zone (`data-testid` set per FollowMemberButton below). Self-view → "Edit profile" link to `/you` instead of Follow (`data-testid="member-edit-profile"`).
- [ ] Items section: list each item linking to its `href` (`data-testid="member-item"`); empty-state (`data-testid="member-items-empty"`, "Nothing posted yet") when none.
- [ ] Groups section: list listed memberships (`data-testid="member-group"` linking to the group); omit / empty-state when none. No place-interest surface anywhere.
- [ ] DLS classes only (mirror ShopPublicPage). Mobile-first (390px viewport).

### Client island — `src/components/member/FollowMemberButton.tsx`

- [ ] Props `{ loggedIn, isSelf, isFollowing, followedMemberId, handle }`.
- [ ] Anon: link "Follow" (`data-testid="follow-member-signin"`) to `/auth/login?next=/m/<handle>` (return URL).
- [ ] Auth'd, not self: button toggles between "Follow" (`data-testid="follow-member"`) and "Following" (`data-testid="following-member"`) — calls `followMemberAction` / `unfollowMemberAction`; optimistic flip with revert on error; unfollow via tap on the "Following" button.
- [ ] Self-view: render nothing (the page renders the Edit-profile affordance instead).

### Tests (Vitest)

- [ ] `src/lib/member/resolve-member-page.test.ts` — maps a mocked Supabase shape: items mapped with hrefs; only `listed` groups surface; isSelf/isFollowing logic; null member → null.
- [ ] `src/components/member/MemberPublicPage.test.tsx` — renders name/handle/bio; badge only when standing; self-view shows Edit-profile not Follow; empty-states.

### Eval (Playwright) — `evals/features/F032-viewer-finds-member-page-and-follows.spec.ts` + `evals/fixtures/F032-member-page.ts`

- [ ] Fixture seeds: a target Member (with bio/pronouns, ≥1 published item, an active listed group membership granting standing-presence, plus an unlisted group that must NOT surface) and a separate viewer Member with a hashed password (mirror F035 fixture `ensureIdentity`).
- [ ] Beats: (1) anon read renders name/handle/items/standing-badge, listed group present + unlisted group absent, place-interests absent; (2) anon Follow CTA links to `/auth/login?next=/m/<handle>`; (3) auth'd viewer taps Follow → flips to "Following" and a `member_follows` row exists (assert via admin client); tap again → Unfollow sets `unfollowed_at`; (4) self-view shows Edit-profile, no Follow; (5) unknown/soft-deleted handle → 404.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG T092 line. STAGE-LEDGER F032 row → `eval` (green) after the Playwright run passes.

## Notes

- Standing badge copy: short, e.g. "Active in the community" or a "Steward" / "Seller" label — keep within existing DLS chip styling; final microcopy is M3/ux-copy's call but must not invent a new component.
- Privacy: the b1 interpretation of "listed memberships" = group `discoverability = 'listed'`. `members.stakeholder_visibility` and per-membership visibility are reserved substrate (no surface yet) — log in DEVIATIONS that group-discoverability is the gate at b1.

## Completion

Date: 2026-06-02
Branch: web / `t-f032` (not merged — left on branch per PM)
Status: Build complete. `resolveMemberPage` (`src/lib/member/resolve-member-page.ts`) + page (`src/app/m/[handle]/page.tsx`) + `<MemberPublicPage>` + `<FollowMemberButton>` client island. Migration `029_member_public_projections.sql` (additive: grant standing view to anon + `member_public_group_memberships` projection). Privacy: only `discoverability='listed'` groups surface; place-interests never queried.
Tests: 6/6 resolver + 8/8 component + 6/6 F032 Playwright eval GREEN. tsc clean on new files; eslint clean; action-layer conformance OK.
Gates: M2 (code-review) — self-reviewed (Cowork plugin not invokable from Claude Code); M3 (accessibility) — basic (decorative avatar alt="", aria-pressed on toggle, role=alert on error, semantic headings); M4 (deploy-checklist) — defer to pre-merge. PM to run the formal Cowork M2/M3 gates before merge.
DEVIATIONS: 2026-06-02 — projection-view (029) + group-visibility-via-discoverability + self-view edit-link + pre-existing build breakage. SPEC-PATCHES: 2026-06-02 — member.md public read surface + listed-membership gate.
