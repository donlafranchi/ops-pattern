# T097: Locally Owned claim management widget + server actions (F037 surface)

**Scenario:** `planning/now/scenario-F037-maya-claims-locally-owned.md`
**Status:** Open
**Bundle:** b1 (sub-bundle b1.2 — Business Groups & makers)
**Depends on:** T096 (badge + owner-claim resolvers), T075 (`member.business_jurisdiction.set` / `.remove` handlers)

**Serves:** F037 beats 1–6 — the owner-only claim lifecycle (add / edit / remove + honest proximity feedback). Loop 7, Loop 9.

## Scope

The owner management surface on the Shop page. Three pieces:

1. **Server actions — `src/app/p/[...slug]/claim-actions.ts`** (`'use server'`). Thin wrappers over the T075 handlers, mirroring `src/app/you/sell/actions.ts`:
   - `setJurisdictionAction({ groupId, zip })` → resolves auth user, builds `ActionContext`, invokes `memberBusinessJurisdictionSet(ctx, { groupId, zip })`. Maps `ActionError` → serializable error. Used for both empty-state Add and Edit (the handler soft-replaces).
   - `removeJurisdictionAction({ groupId })` → invokes `memberBusinessJurisdictionRemove(ctx, { groupId })`.
   - Both require an authenticated member; `AuthorizationError` from the handler (non-owner) surfaces as a thrown error the client shows.

2. **Client widget — `src/components/group/LocallyOwnedClaim.tsx`** (`'use client'`). Renders below the Shop header, owner-only. Props: `{ groupId: string; claim: { zip: string | null; isProximal: boolean } }`. States:
   - **Empty** (`claim.zip === null`): copy "You haven't claimed Locally Owned yet — add your ZIP to display the badge" + `data-testid="claim-add"` ("Add ZIP") button revealing a single 5-digit ZIP field (`data-testid="claim-zip-input"`) + submit (`data-testid="claim-submit"`).
   - **Claimed + proximal** (`zip` set, `isProximal`): "Claimed local owner — ZIP on file: {zip}." + `data-testid="claim-edit"` + `data-testid="claim-remove"`.
   - **Claimed + non-proximal** (`zip` set, `!isProximal`): "ZIP on file: {zip}. This ZIP isn't in proximity to your Shop's anchor Location — the badge isn't currently displayed." (`data-testid="claim-not-proximal"`) + Edit + Remove.
   - **Edit**: reveals the same ZIP field pre-filled; submit calls `setJurisdictionAction`.
   - **Remove**: confirm (`data-testid="claim-remove-confirm"`), then `removeJurisdictionAction`.
   - Inline validation: non-5-digit input is rejected client-side (`data-testid="claim-zip-error"`), no server round-trip. After a successful action, `router.refresh()` to re-render the page (badge + widget reflect new state).

3. **Page wiring — `src/app/p/[...slug]/page.tsx` + `src/components/group/ShopPublicPage.tsx`.** The Group dispatch resolves `resolveOwnerClaim(...)` (passing the auth user id) alongside the existing badge/items/auth `Promise.all`, and passes the result to `ShopPublicPage` as `ownerClaim: { zip, isProximal } | null`. `ShopPublicPage` renders `<LocallyOwnedClaim>` in an owner-only section **only when `ownerClaim !== null`**; non-owners and anon never see it.

## Acceptance Criteria

- [ ] **Beat 1.** Owner viewing own Shop sees the claim widget (owner-only section, distinct from the public badge). Non-owner / anon viewing the same URL: widget absent.
- [ ] **Beat 2.** From empty state, Add ZIP → submit `95817` → `setJurisdictionAction` writes the row + event (T075 handler); page re-renders to the claimed+proximal state and the public badge appears.
- [ ] **Beat 3.** Edit → submit `95816` → row soft-replaced, badge persists (95816 still proximal).
- [ ] **Beat 4.** Remove → confirm → row soft-deleted; widget returns to empty state, badge disappears.
- [ ] **Beat 5.** Submit `90210` (non-proximal) → action accepts the write (no validation rejection); widget shows the honest "isn't in proximity" message; public badge does NOT render.
- [ ] **Beat 6.** Non-owner (Rosa) at the Shop URL: public surface only, no widget, no edit affordances.
- [ ] **Edge.** Non-5-digit input rejected inline (no server round-trip). Draft Group: owner can still set/edit (widget renders on the draft owner-preview).
- [ ] **Tests.** Vitest render tests for `LocallyOwnedClaim` (each state, inline validation). Full beat coverage in T098 eval.
- [ ] **a11y (M3).** Widget passes `design:accessibility-review` — field label, button names, `role="status"` on feedback, error association.
- [ ] **DLS.** `.btn-primary` / `.btn-secondary` / `.chip` recipes; no hardcoded tokens.
- [ ] **M2** `engineering:code-review` before commit. **DEVIATIONS** entry at close.

## Notes

- `member.business_jurisdiction.set` folds update into set (soft-replace, T075 deviation #4) — Edit and Add both call `setJurisdictionAction`; no separate update path.
- The handler authorizes owner-role itself (throws `AuthorizationError`); the widget's owner-gating is defense-in-depth + UX, not the security boundary.
- The proximity result is a render-time derivation — the platform never rejects a claim for being non-local (beat 5). The widget reports; it doesn't moralize.
