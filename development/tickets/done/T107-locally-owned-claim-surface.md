---
id: how-T107-locally-owned-claim-surface
purpose: Owner-view widget on the Shop page for setting, editing, and removing the Locally Owned ZIP claim.
layer: how
status: superseded
ticket: T107
scenario: planning/now/scenario-F037-maya-claims-locally-owned.md
system_spec: product/systems/business-jurisdiction.md
created: 2026-06-16
---

> **Superseded 2026-06-19.** F037 Locally Owned claim surface already shipped 2026-06-04 (T096/T097/T098 merged → main `944d6a5`). This ticket was a redundant re-ticket created after the feature shipped.

# T107: Locally Owned claim surface

**Scenario:** `planning/now/scenario-F037-maya-claims-locally-owned.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T075 (S-jurisdictions substrate — shipped), T074 (F035 Shop page — shipped)

**Serves:**
- **Loop:** 9 (Buy Close, Trade family) — the Locally Owned badge is the platform's most consequential discovery affordance; this ticket is the write surface that lets producers claim it.
- **Canonical example:** [P4 — A locally-owned, locally-made producer earns and displays both badges](../../product/needs/use-cases.md#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges) (jurisdiction half).
- **Primitive shape:** Person(Maya, owner-role) → `member_business_jurisdictions`(ZIP, self_attested) → `zip_is_proximal_to_location()` → badge on Group public surface. No shell entity; the Person holds the claim.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** — new owner-view section + inline form component.
- [ ] **M4 — `engineering:deploy-checklist`** — no new migration (T075 substrate already shipped), but verify existing migrations 025 (jurisdictions) are applied in prod before this surface goes live.
- [ ] **DEVIATIONS.md entry** at ticket close.

## Acceptance Criteria

### Owner-view section on Shop page

- [ ] `<OwnerTools>` section renders on the Group page (`/p/[…place]/g/[slug]`) **only** when the viewer is an active `role='owner'` member of the Group.
  _Why: per `business-jurisdiction.md` T1 § Surfaces — "Owners can edit/add/remove their jurisdiction record from the kind='business' Group's settings surface." Non-owners must never see claim management affordances (beat 6)._
- [ ] Non-owner Members and anonymous viewers see the public surface only — no `<OwnerTools>`, no edit affordances. Verified in test.
- [ ] The owner-view section is visually separated from the public surface (bordered container or equivalent) so the owner can distinguish "what I see" from "what everyone sees."

### ZIP claim form — empty state (beat 2)

- [ ] When no active `member_business_jurisdictions` row exists for (viewer, group), the widget shows: heading + "You haven't claimed Locally Owned yet" + "Add ZIP" CTA.
- [ ] Tapping "Add ZIP" reveals a single-field inline form: ZIP input (5-digit, numeric, US-only at b1).
- [ ] **Client-side validation:** rejects non-5-digit input before submission. Rejects ZIPs not present in `zip_metro_crosswalk`.
  _Why: the crosswalk is the source of truth for valid ZIPs (per `business-jurisdiction.md` § Proximity computation). A ZIP absent from the crosswalk can't be proximity-tested._
- [ ] On submit, calls `member.business_jurisdiction.set(group_id, zip)` server action (existing handler from T075). The handler writes the `member_business_jurisdictions` row + `member.business_jurisdiction_set` event in one transaction.
- [ ] On success, the widget re-renders to the populated state.

### ZIP claim form — populated state (beats 3, 4, 5)

- [ ] When an active row exists and the ZIP passes proximity: widget shows "Claimed local owner — ZIP on file: {zip}" + [Edit] + [Remove].
- [ ] When an active row exists and the ZIP **fails** proximity: widget shows "ZIP on file: {zip}. Your ZIP isn't close enough to display the badge right now. Update your ZIP if you've moved." + [Edit] + [Remove].
  _Why: per the scenario beat 5 and `groups.md` line 323 — the proximity test is dynamic, computed at query time. The platform reports the result honestly without moralizing about the claim._
- [ ] **Edit:** reveals the same inline form, pre-filled with the current ZIP. On submit, calls `member.business_jurisdiction.set` (the handler soft-replaces the active row per T075 implementation).
- [ ] **Remove:** confirmation prompt ("Remove your Locally Owned claim? The badge will disappear from your Shop page."). On confirm, calls `member.business_jurisdiction.remove(group_id)` (existing handler — soft-deletes the row + fires `member.business_jurisdiction_removed` event). Widget returns to empty state.

### Proximity check (client-side read)

- [ ] The widget reads the proximity result by calling `zip_is_proximal_to_location(zip, anchor_location_id)` (existing SECURITY DEFINER function from T075) or by joining the crosswalk client-side.
  _Why: `groups.md` line 323 — locality is computed at query time, not stored. The owner-view widget needs the live result to show honest feedback._
- [ ] The proximity result drives the conditional copy (proximal vs. non-proximal) and whether the public badge renders.

### Badge rendering (read-only — already wired)

- [ ] The "Claimed local owner" badge on the public Shop surface (F035 beat 2) renders when an active jurisdiction row exists AND the ZIP passes proximity. **No new public surface work** — F035 already checks this. Verify the badge appears after a successful ZIP submission and disappears after a Remove.

### DLS update

- [ ] Add an "Owner-view section" recipe to `product/ui/design-language.md`: a role-gated management section on a public page. Pattern: bordered container, "Owner tools" heading or equivalent, responsive stack. Note that this pattern recurs for future Group management surfaces (member management, Group settings, etc.).

### Tests

- [ ] Unit test: owner sees `<OwnerTools>` section; non-owner does not.
- [ ] Unit test: empty-state renders "Add ZIP" CTA; populated-state renders ZIP + Edit + Remove.
- [ ] Unit test: ZIP validation rejects 4-digit, 6-digit, non-numeric, and ZIPs not in crosswalk.
- [ ] Unit test: proximity pass shows "Claimed local owner" copy; proximity fail shows honest-feedback copy.
- [ ] Integration: `member.business_jurisdiction.set` round-trips (submit ZIP → row exists → widget shows populated state → badge renders on public surface).
- [ ] Integration: `member.business_jurisdiction.remove` round-trips (remove → row soft-deleted → widget shows empty state → badge disappears).
- [ ] BUILD-LOG.md updated.

## Notes

- **All substrate exists.** T075 shipped `member_business_jurisdictions`, `zip_metro_crosswalk` (90-row Sacramento seed), `zip_is_proximal_to_location()`, both action handlers, and event kinds. This ticket is pure surface — no migration.
- **F036 walkthrough overlap.** The Sell walkthrough (F036) has an optional "where is this business based?" step that calls the same `member.business_jurisdiction.set` handler. If Maya used that step, the widget here should show the populated state on first load. Test this path.
- **Crosswalk coverage.** The 90-row Sacramento seed should cover the launch market. If a real Sacramento-area ZIP is missing, the validator will reject a valid claim — worth a sanity check against a few test ZIPs (95817, 95816, 95814, 95831).
- **Encodes ratified absolutes:**
  - `business-jurisdiction.md` line 44: Tier 0 self-attested at b1 (Ratified 2026-05-23)
  - `business-jurisdiction.md` line 34: refuse parallel locality-derivation bypassing both signals (Ratified 2026-05-23)
  - `business-jurisdiction.md` line 50: OR across all active owners (Ratified 2026-05-31)
  - `groups.md` line 325: locality derived not stored (Ratified)
- **Loop number note.** The scenario header says "Loop 7 (Buy close), Loop 9 (Make a living locally)." The spec says Buy Close is Loop 9. Verify against `member-journey.md` and use the canonical numbering.
- **Review recommendations.** See `planning/now/review-F037.md` for the full review. Key points: all substrate clean, DLS owner-view pattern needed, softer proximity-feedback copy suggested.

## Completion

Date:
Commit:
