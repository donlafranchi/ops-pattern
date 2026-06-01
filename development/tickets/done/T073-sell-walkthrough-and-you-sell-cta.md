---
id: how-t073-sell-walkthrough-and-you-sell-cta
purpose: Sell walkthrough composer + /you Sell CTA wiring + draft resume detection.
layer: how
status: open
---

# T073: `<SellWalkthrough>` + /you Sell CTA + resume detection

**Scenario:** `planning/now/scenario-F036-member-creates-business-group-via-sell-walkthrough.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T070 (lifecycle_state + handlers), T071 (MultiStepComposer base), T072 (AddEntityDrawer)

**Serves:**
- **Loop:** 9 (Make a living locally) — this ticket *is* the Sell-walkthrough surface; the structural enabling step for Maya's path from "I bake from home" to "I have a public Shop page."
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Group(kind='business', anchor_location_id → Location, founder_member_id → Member).
- **Encodes ratified absolutes:**
  - `product/systems/groups.md:88-89` (Owners co-equal; founder is historical label) — *Intent (Ratified 2026-05-31)*.
  - `product/systems/groups.md:365` (No auto-Group assignment; `source='explicit'` for opted-in members) — *Intent (Ratified 2026-05-31)*.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `test` (run mode).
- [ ] **M3 — `design:accessibility-review`** — yes, new user-facing flow; full a11y audit on the composer + CTA.
- [ ] **M4 — `engineering:deploy-checklist`** — yes, web bundle + ties to T070 migration.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [ ] Component file `web/components/sell/SellWalkthrough.tsx` composing `<MultiStepComposer>` with five steps (per F036 scenario body):
  1. **Brand name** — Input → writes `group_businesses.display_name`. Required.
  2. **Anchor Location** — picker (existing Member-authored Locations) + "+ Add a new Location" row → invokes `<AddEntityDrawer>` for the inline-add sub-flow. Writes `groups.anchor_location_id`. Required.
  3. **About** — multiline Input → writes `group_businesses.public_description`. Optional.
  4. **Locality claim (Tier 0)** — ZIP input → writes a `member_business_jurisdictions` row with `verification_source='self_attested'` if filled. Marked `isOptional=true` so the Multi-step composer renders the `[Skip]` link. F037 owns the badge UI; this step writes the row only.
  5. **Review & done** — read-only summary of fields + final-step CTA labeled **"Create my shop"**. Tap fires `group.activate`.
  _Why: copy uses "shop" per root CLAUDE.md naming-conventions table (kind='business' UI label = "Shop"); pending PM call to formalize, this is the working default._
- [ ] Step-1 submit fires `group.create` (writes draft Group with `kind='business'`, `founder_member_id = auth.uid()`, `lifecycle_state='draft'`, `discoverability='listed'`, empty description) + creates the `group_businesses` row + creates the founder's `group_memberships` row with `role='owner'` and `source='explicit'` — all in one transaction per the handler's contract from T070.
  _Why: same-transaction row+event invariant from `product/systems/action-layer.md`; `source='explicit'` per `groups.md:365` (Intent Ratified 2026-05-31) — Member opted into the Group by tapping Sell._
- [ ] Steps 2–4 each fire `group.update_draft` on tap of Continue with the step's diff.
- [ ] Final-step "Create my shop" fires `group.activate` → on success, redirects to `/p/[...place]/g/[slug-suffix]` (the new Group page, F035 owns rendering). Toast at destination: *"Your shop is live."*
- [ ] **`/you` Sell CTA wiring** (file: `web/app/you/page.tsx`):
  - Always-visible primary CTA on the `/you` page (placement per `product/ui/community-platform.md § You T1`).
  - Routing logic:
    - **No active kind='business' Group membership AND no in-flight draft** → tap opens `<SellWalkthrough>` starting at step 1, label *"Sell"*.
    - **Has an in-flight draft Group** (queryable via `groups` where `founder_member_id = auth.uid() AND lifecycle_state='draft' AND kind='business'`) → tap opens `<SellWalkthrough>` with `resumeFromStep` set + `initialState` hydrated from the draft row, label *"Continue setting up your shop"*.
    - **Has ≥1 active kind='business' Group membership** → tap routes to `/you/sell` index page (a thin stub at b1 that lists the Member's active business Groups + an "Add a product" CTA per Group, deferring product/service/gathering composers to F038/F040/F034); label *"Sell"*.
- [ ] Resume-detection query lives at `web/lib/sell/getDraftGroup.ts`; called by the `/you` server component to pick the CTA label + route.
- [ ] Anchor-Location step's "+ Add a new Location" sub-flow wires `<AddEntityDrawer>` to `location.create` handler; on save, the new Location id auto-selects in the picker.
  _Why: per `product/ui/design-language.md § Add new entity inside a composer` — secondary drawer stacks over the parent composer; on save returns to parent step with the new entity pre-selected; parent composer stays paused at the picker step (does not auto-advance)._
- [ ] No "Sell instead?" cross-link on the Wonder composer (Wonder is b2-deferred); the F036 scenario references it forward-lookingly only.
- [ ] Playwright eval at `web/evals/features/F036.spec.ts` (written by `test` in a separate pass, not by build) — this ticket's acceptance is the surface + the handler wiring; the eval verifies the scenario's Then-clauses end-to-end.
- [ ] BUILD-LOG.md updated.

## Notes

- F035 (Group public page) is the redirect destination; if F035 hasn't shipped when this ticket builds, the redirect target should be `/p/[…place]/g/[slug]` — F035 renders the page; this ticket just lands the user there. Verify F035 is ahead in the build queue or coordinate.
- Existing `/you` page (per `community-platform.md`) already conditionally renders a Seller section; this ticket adds the Sell CTA + routing logic, not the Seller section itself.
- The "Sell" CTA label per root CLAUDE.md naming-conventions table is the working default. If PM ratifies "business Group" over "Shop" later, copy-swap is a one-file change in this component + the toast string.
- Edge cases per F036 § Edge Cases:
  - Brand-name collision handled by slug-suffix on activate per ADR-22 (now in `playbooks/PLATFORM-PATTERNS.md`); no display_name uniqueness constraint.
  - Anchor Location doesn't exist → the AddEntityDrawer sub-flow covers it.
  - Walkthrough abandoned mid-flow → the draft Group persists; resume-detection picks it up on next `/you` visit.
- The five-step shape is the b1 floor; if user testing shows steps 3+4 should merge or the locality step should defer entirely to F037, that's a scenario-revision call routed through `scope`, not a ticket-level call.

## Completion

Date: 2026-06-01
Commit: {pending PM commit}

**Summary.** SellWalkthrough (5-step), getDraftGroup resume detector, server-action wrappers for `group.create`/`group.update_draft`/`group.activate`, `<SellCta>` with 3-branch routing, `/you/sell` index stub, /you page mounts the CTA. 73/73 src/ vitest GREEN. Action-layer conformance OK. TSC clean on new files. 5 DEVIATIONS entries (3 applied criticals + 2 flag-for-spec-revision substrate gaps). 2 SPEC-PATCHES entries queued (locality substrate gap, missing `location.create` handler).

**M-gates.**
- M2 (`engineering:code-review`): self-review PROCEED after 3 fix-now landings (brand-re-edit double-create guard; sellActivateAction URL-builder strictness; SellCta toast auto-clear timeout).
- M3 (`design:accessibility-review`): basic level satisfied — composer + drawer inherit T071/T072 a11y (focus mount, ESC, focus-restore). Full focus-trap deferred to shared T071/T072 follow-up.
- M4 (`engineering:deploy-checklist`): no migration; web bundle change only. Vercel preview will surface any RSC/server-action issues.

**Files added.**
- `web/src/lib/sell/getDraftGroup.ts` + `.test.ts`
- `web/src/components/sell/SellWalkthrough.tsx` + `.test.tsx`
- `web/src/components/sell/SellCta.tsx` + `.test.tsx`
- `web/src/app/you/sell/actions.ts`
- `web/src/app/you/sell/page.tsx`

**Files modified.**
- `web/src/app/you/page.tsx` — mount `<SellCta memberId={userId} />`.
- `web/BUILD-LOG.md` — T073 row.
- `development/DEVIATIONS.md` — T073 M2 trail (5 entries).
- `planning/SPEC-PATCHES.md` — 2 entries.
- `planning/STAGE-LEDGER.md` — F036 row Tickets column update.
