---
id: how-f037-maya-claims-locally-owned
purpose: Owner (Maya) sets, updates, or removes the Tier 0 self-attested ZIP that anchors her Shop's "Claimed local owner" badge.
layer: how
status: backlog
---

# F037: Maya claims Locally Owned

**Bundle:** b1
**Sub-bundle:** b1.2 — Business Groups & makers
**Work-map item:** b1.2 → 🟡 "Claim the 'Locally Owned' badge" (from `bundle-1-checklist.md`)
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Canonical example:** [P4 — A locally-owned, locally-made producer earns and displays both badges](../../product/needs/use-cases.md#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges) (jurisdiction half).
**Primitive shape:** Person(Maya, owner) → `member_business_jurisdictions`(ZIP, `verification_source='self_attested'`) → `public.zip_is_proximal_to_location()` → "Claimed local owner" badge on Group public surface.
**Status:** backlog
**Substrate gate:** S-jurisdictions (`member_business_jurisdictions` table + `public.zip_is_proximal_to_location()` function). This scenario cannot promote to `planning/next/` until that substrate ships.

> **Why this shape?** F036 ships the Shop. F035 renders the badge if a jurisdiction exists. F037 is the standalone claim lifecycle: an owner who skipped the locality step in the walkthrough returns later to add it, edits when she moves, or removes when the claim no longer applies. Small surface, large signal — the Locally Owned badge is the platform's most consequential discovery affordance.

## The Person

**Maya** — owner of Oak Park Sourdough. She finished the Sell walkthrough (F036) but skipped the optional "where is this business based?" step because S-jurisdictions substrate hadn't shipped yet. Now it has. She wants to add her ZIP and earn the badge so neighbors browsing locally-owned makers can find her.

She'll also use this surface in the future when she moves across town to a new Oak Park ZIP — the badge should follow her without breaking, because she's still local.

## The Story

Maya navigates to her Shop's owner view (via "Manage" or a gear affordance on her own Shop page). A "Locally Owned claim" section sits below the Shop header. It reads "You haven't claimed Locally Owned yet — add your ZIP to display the badge" with an "Add ZIP" CTA.

She taps it; a single-field form appears asking for her ZIP. She enters 95817. The form submits, writes a `member_business_jurisdictions` row with `verification_source='self_attested'`, and the page re-renders showing "Claimed local owner — ZIP on file: 95817. [Edit] [Remove]". The badge now displays on her Shop's public page (F035 beat 2 lights up).

A year later she moves to 95816 (still Oak Park, still within proximity). She returns to the same surface, taps Edit, enters 95816, submits. The badge persists because the proximity test still passes against Oak Park's anchor Location.

If she ever changes the ZIP to one outside the proximity threshold, the badge silently drops from her public page (computed at query time per `groups.md` line 323). The owner surface tells her honestly: "Your ZIP isn't in proximity to this Shop's anchor Location — the badge isn't currently displayed."

## Surfaces

- **Entry point:** Shop's owner view at `/p/[…place]/g/[slug]` when the viewer is an owner-role Member of the Group. The owner sees a "Locally Owned claim" management widget below the Shop header; non-owners see only the public badge (or its absence).
- **Primary action:** "Add ZIP" (empty state) / "Edit" (claim exists) / "Remove" (claim exists).
- **Composer / interaction:** Single-field form (ZIP, 5 digits, US-only at b1). Inline within the owner view, not a separate page.
- **Completion:** Same page re-renders with updated state — claim widget reflects new value, badge appears/updates/disappears on the public surface.
- **Discovery:** No discovery surface — this is owner-only management. The badge's effect surfaces on F035's public page.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| ZIP | `member_business_jurisdictions.zip` (text, 5-digit US) | yes |

Implicit (set by the surface):
- `member_business_jurisdictions.member_id` = the acting owner
- `member_business_jurisdictions.group_id` = the Shop's `id`
- `member_business_jurisdictions.verification_source` = `'self_attested'` (Tier 0 is the only verification source at b1)
- `member_business_jurisdictions.created_at` / `removed_at` (soft-delete pattern)
- `jurisdiction.set` / `jurisdiction.updated` / `jurisdiction.removed` event row (same-transaction with the row write per the action-layer invariant)

## Acceptance Criteria

### Story beat 1 — Owner sees claim widget on own Shop

**Given** Maya is logged in and viewing her own Shop's page at `/p/sacramento/oak-park/g/oak-park-sourdough`
**When** the page renders
**Then** a "Locally Owned claim" widget displays in an owner-only section, separate from the public surface. _Why: per `business-jurisdiction.md` T1 § Surfaces, "Group settings — Owners can edit/add/remove their jurisdiction record." The owner-view distinction is load-bearing because non-owners should never see claim management affordances. Eval verifies the widget renders for the owner AND does NOT render for an anonymous or non-owner-Member viewer of the same URL._

### Story beat 2 — Maya adds her ZIP (empty-state path)

**Given** Maya has no active `member_business_jurisdictions` row for this Group
**When** she taps "Add ZIP" and submits 95817
**Then** the action layer writes a `member_business_jurisdictions` row with `verification_source='self_attested'` and emits a `jurisdiction.set` event in the same transaction. _Why: per the action-layer invariant from `playbooks/PLATFORM-PATTERNS.md`, every state-changing write goes through the action layer with paired row+event in one transaction. Eval verifies both the row write AND the event row exist after submission, with matching transaction IDs._

**And then** the page re-renders showing "Claimed local owner — ZIP on file: 95817. [Edit] [Remove]"
**And then** Maya's Shop's public page (F035) renders the "Claimed local owner" badge.

### Story beat 3 — Maya edits her ZIP

**Given** Maya has an active jurisdiction row with ZIP 95817
**When** she taps "Edit" and submits 95816
**Then** the action layer updates the row (sets `removed_at` on the old, inserts a new active row, OR updates the existing row — per spec; both shapes are valid) and emits `jurisdiction.updated`.

**And then** the public badge persists because 95816 still passes proximity against Oak Park's anchor Location.

### Story beat 4 — Maya removes her claim

**Given** Maya has an active jurisdiction row
**When** she taps "Remove" and confirms
**Then** the action layer sets `removed_at` on the row and emits `jurisdiction.removed`. The widget returns to empty state ("You haven't claimed Locally Owned yet"). The badge disappears from the public surface.

### Story beat 5 — ZIP outside proximity → owner sees honest feedback, badge does not render

**Given** Maya submits a ZIP (e.g., 90210) that fails `public.zip_is_proximal_to_location()` against Oak Park's anchor
**When** the action layer accepts the row write (the proximity test is a render-time derivation, not a validation; the platform doesn't reject claims for being non-local — it just doesn't surface the badge)
**Then** the owner widget shows "ZIP on file: 90210. This ZIP isn't in proximity to your Shop's anchor Location — the badge isn't currently displayed." _Why: per `business-jurisdiction.md` and `groups.md` line 323 ("computed at query time"), the proximity test is dynamic. The widget tells Maya honestly so she understands why the badge isn't surfacing; the platform doesn't moralize about her claim, it just reports the proximity result._

**And** the public surface (F035) does NOT render the badge.

### Story beat 6 — Non-owner cannot access the management surface

**Given** Rosa (not an owner of Oak Park Sourdough) is logged in
**When** she navigates to the Shop's URL
**Then** she sees the public surface only — no claim widget, no edit affordances. _Why: per `business-jurisdiction.md` T1 § Surfaces and the RLS scoping in S-jurisdictions, claim management is owner-role-gated. Eval verifies that a non-owner Member's render of the same URL omits the claim widget entirely._

## Edge Cases

- **Non-5-digit input:** The form rejects with inline validation (no server round-trip required).
- **ZIP that doesn't exist in the US ZIP database:** Same — inline validation. The platform's ZIP lookup table per S-jurisdictions substrate is the source of truth.
- **Multiple owners (post-b1 scope):** Each owner can set their own jurisdiction. The badge renders if ANY active owner's ZIP passes proximity (OR-aggregation per `business-jurisdiction.md` line 50). At b1 with single-owner Shops, this case is trivial; the surface is shaped to support multi-owner without UI change.
- **Group is `draft`:** The owner can set/edit jurisdiction during draft state; it activates with the Group on F036 walkthrough completion.
- **Group is `dissolved`:** Owner view returns 404; jurisdiction rows persist for audit but cannot be edited (soft-delete pattern keeps the audit trail per b1 commitments).

## Assumptions

- **S-jurisdictions substrate is live.** Specifically: `member_business_jurisdictions` table with the schema in `business-jurisdiction.md` T1, RLS policies, the `public.zip_is_proximal_to_location()` SECURITY DEFINER function, the US ZIP lookup table, and action handlers `jurisdiction.set` / `jurisdiction.updated` / `jurisdiction.removed`. **This scenario cannot ship until S-jurisdictions ships.**
- F035 has shipped (so the badge has a public surface to appear on).
- F036's walkthrough optional locality step is wired to the same substrate (a Member who set their ZIP in the walkthrough sees the widget already populated when they reach F037's surface).

## Out of Scope

- **Tier 1 community-attestation.** Per `business-jurisdiction.md` T2, that's b2+ — depends on the interaction graph reaching density. F037 is Tier 0 only.
- **Tier 2 document-uploaded verification.** b3 optional per the bundle plan.
- **Address-as-locality.** The platform never asks for a street address. ZIP is the locality token at b1.
- **Locally Made badge.** That's the product-provenance sibling, scoped at F039 (gates on S-jurisdictions substrate's `made_at_place_id` column + F038 product composer).
- **Standalone Shop settings page.** F037 surfaces the widget on the Shop's owner view inline. A dedicated `/you/shop/settings` page (or equivalent producer dashboard) is b2 producer tooling per `producer-tools.md`.
- **Bulk-edit multi-Shop claim management.** Multi-Shop owners managing many Shops' claims in one place is a b2+ producer dashboard surface.

## Capabilities unlocked

- **Producer locality claim (jurisdiction half).** Completes the P4 jurisdiction-claim lifecycle. Realizes the `business-jurisdiction.md` T1 § Surfaces "Group settings — Owners can edit/add/remove their jurisdiction record" capability.
- **Buy Close discovery affordance** (downstream). The Locally Owned badge is the visible signal for the platform's most consequential discovery commitment; F037 is what lets producers claim it.

## Gate A summary (Cowork pre-flight)

Spec sections cited and their absolutes' ratification state:

| Spec section | Absolute(s) cited | State |
|---|---|---|
| `business-jurisdiction.md` § T1 § Behavior | Tier 0 self-attested at b1 (no auto-promotion) | ✓ Ratified 2026-05-23 (Intent line 44) |
| `business-jurisdiction.md` § Two-signal extension | refuse parallel locality-derivation bypassing both signals | ✓ Ratified 2026-05-23 (Intent line 34) |
| `business-jurisdiction.md` § OR-aggregation | OR across all active owners; no founder-privileged source | ✓ Ratified 2026-05-31 (Intent line 50) |
| `groups.md` § Locality and promotion | locality derived not stored | ✓ Ratified (Intent line 325) |
| ZIP-not-address commitment (`policy.md` doxxing-prevention) | "Locality (ZIP, state) is separated from address (street, building) by design" | ✓ Ratified — load-bearing in `business-jurisdiction.md` Purpose and Intent line 34 |

**Gate A verdict: PASS.** All cited absolutes carry State-tagged Intent lines. **Substrate gate blocks promotion** — the scenario stays in `planning/backlog/` until S-jurisdictions substrate ships, at which point it promotes directly without further weigh work.
