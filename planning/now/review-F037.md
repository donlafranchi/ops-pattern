---
id: how-review-f037
purpose: Pre-ticket architecture and design review for F037 (Locally Owned claim).
layer: how
status: active
---

# F037 review — Maya claims Locally Owned

**Scenario:** [`scenario-F037-maya-claims-locally-owned.md`](./scenario-F037-maya-claims-locally-owned.md)
**Reviewer:** review
**Date:** 2026-06-16
**Bundle:** b1
**Verdict:** PROCEED

## Verdict summary

The scenario fits existing schema and substrate cleanly — all required tables, columns, functions, event types, and action handlers already shipped (T075 S-jurisdictions substrate, merged to main). The surface is narrow: an owner-only inline widget on the existing Shop page (F035), a single-field form, and badge rendering that F035 already wired to check. One design note: the DLS needs an "owner-view section" pattern before the ticket writer builds; this can land as a doc-only pre-ticket or inline in the first ticket's deliverable.

**Next skill:** `ticket` — reads both the approved scenario and this review.

## Architecture check

### Systems touched

- `product/systems/business-jurisdiction.md` — the primary system. F037 exercises the T1 (b1) self-attested ZIP flow: `member.business_jurisdiction.set`, `member.business_jurisdiction.remove`, badge derivation via `public.zip_is_proximal_to_location()`. All substrate shipped (T075).
- `product/systems/groups.md` — the locality-derivation pseudocode (lines 304–318) is the badge-render path. `groups.anchor_location_id` is the proximity target. F035 (Shop page) already wired beat 2 to check for a jurisdiction row; F037 is what lets producers create one.
- `product/systems/member.md` — the owner-role membership check that gates access to the claim widget. `group_memberships.role = 'owner'` + `ended_at is null` is the auth predicate. Existing.
- `product/systems/action-layer.md` — both handlers (`member.business_jurisdiction.set`, `.remove`) follow the action-handler contract: named handler → typed input → row write + event in same transaction. Scoped capabilities, Member-on-self only, never delegable.

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | **none** | `member_business_jurisdictions` + `zip_metro_crosswalk` shipped (T075). |
| New columns required? | **none** | All columns exist: `zip`, `verification_source`, `removed_at`, etc. |
| New event types required? | **none** | `member.business_jurisdiction_set` + `member.business_jurisdiction_removed` registered (T075). |
| New action handlers? | **none** | `member.business_jurisdiction.set` + `.remove` shipped (T075). |
| New RPC/function? | **none** | `public.zip_is_proximal_to_location()` shipped (T075). |
| Forward-tier impact | **clear** | T2 community-attestation layers on top of Tier 0 without schema change — the `verification_source` column accommodates all three tiers. Multi-owner OR-aggregation (line 304–318 pseudocode) supports future owner additions without surface change. |
| Shell-entity smell | **clean** | No new entity. Jurisdiction is a property of a (Member, Group) pair, resolved via existing FKs. The widget reads `group_memberships` (person) + `member_business_jurisdictions` (claim) + `groups.anchor_location_id` (proximity target). No vendor/merchant/establishment introduced. |

### Cross-system consistency

- **business-jurisdiction ↔ groups:** The locality pseudocode in `groups.md` lines 304–318 queries `member_business_jurisdictions` joined through `group_memberships` — exactly the path F037's badge render will take. The "computed at query time" commitment (line 323) means no stored `is_locally_owned` flag; the badge re-derives on every page load. Consistent.
- **F035 (Shop page) ↔ F037:** F035 beat 2 already checks for a jurisdiction row and renders the badge when it exists. F037 is the write surface that creates/edits/removes that row. The two scenarios partition cleanly: F035 reads, F037 writes.
- **F036 (Sell walkthrough) ↔ F037:** F036's walkthrough has an optional "where is this business based?" step that writes the same `member.business_jurisdiction.set` handler. F037's story ("Maya skipped the optional step and comes back later") is the complementary entry point. Both write through the same handler; no divergence.
- **RLS consistency:** `member_business_jurisdictions` SELECT is public for `removed_at IS NULL` rows (per spec: the claim is intentionally public). INSERT/UPDATE/DELETE goes through action handlers only. The owner-view widget reads the public row (the owner can see their own claim because everyone can); the write is handler-gated to owner-role Members. Consistent with the private-geography / public-claim split.

### Loop fidelity

The scenario tags **Loop 7 (Buy close)** and **Loop 9 (Make a living locally)**.

**Note:** The `business-jurisdiction.md` spec tags "Buy Close" as Loop 9 (Trade family), not Loop 7. The `member-journey.md` loop numbering should be canonical. The scenario's mechanics clearly serve the Trade family — enabling the "locally owned" signal that makes local-money-stays-local visible in discovery. Whether the label is Loop 7 or Loop 9, the mechanic matches: the ZIP claim → proximity test → badge is the structural answer to "how does the platform know a business is local." **Recommendation:** ticket writer should verify the loop numbers against `member-journey.md` and correct the scenario header if needed (cosmetic, not blocking).

### Policy posture

**Present and thorough.** `business-jurisdiction.md` carries a full three-filter analysis for all three tiers (§ Policy posture). Key points relevant to F037's b1 surface:

- Tier 0 self-attested ZIP: helpful (locality discovery), not harmful (ZIP ≠ address; no street address ever collected), abuse-limited (public "Claimed" label + one-active-row-per-Group constraint + out-of-metro fudge fails proximity).
- The doxxing-prevention posture is load-bearing and honored (per [`business-jurisdiction.md`](../../product/systems/business-jurisdiction.md)): Maya can enter her accountant's ZIP, a PO Box ZIP, or any ZIP she chooses — the platform never asks for or stores a street address.
- `member_business_jurisdictions` is intentionally public (contrast with the owner-only `member_place_interests`). The jurisdiction claim is meant to be visible; this is consistent with the substrate split.

### Architecture verdict

**PROCEED.** All substrate shipped. No new schema. The surface exercises exactly the handlers, tables, and derivation paths that T075 built. Clean fit.

---

## Design check

### Surfaces touched

| Surface | Exists? | Notes |
|---|---|---|
| Shop page (public) | **yes** (F035) | Badge renders when a jurisdiction row passes proximity — already wired in F035 beat 2. No new public surface. |
| Shop page (owner view) | **new** | An inline management section visible only to owner-role Members of the Group. First scenario to introduce owner-only affordances on a public page. |

### Components

| Component | In DLS? | Notes |
|---|---|---|
| "Claimed local owner" badge | **yes** | Ownership tier spectrum in DLS: green axis for local/independent. Badge rendering rules already documented. |
| Owner-view section | **no** | Conditional section on the Shop page, rendered when viewer is owner-role. Needs a DLS entry: layout pattern, visual separation from the public surface (e.g., a bordered section with a "Shop settings" or "Owner tools" heading), responsive behavior. |
| Single-field inline form (ZIP input) | **partial** | The DLS has composer patterns (multi-step) but not a single-field inline edit form. The ZIP form is trivial (one `<input>` + submit), but the pattern of "inline edit on a management surface" will recur (edit Group name, edit description, etc.). A lightweight DLS entry avoids ad-hoc styling. |
| Edit / Remove inline actions | **partial** | Standard destructive/edit affordance pair. The DLS has CTA patterns but not a "management action pair" recipe. Low risk — standard UI, but worth a one-liner in the DLS. |

### CTA placement

The scenario's CTAs are within the owner-view section, not competing with the public surface's primary CTA ("Follow this venue" from F033). The owner-view section is role-gated — non-owners never see it. Within the owner view, "Add ZIP" is the primary action (empty state) and "Edit" / "Remove" are secondary (populated state). This follows the "one primary per screen section" principle.

### Tone & copy

- "You haven't claimed Locally Owned yet — add your ZIP to display the badge" — clear, action-oriented, no moral judgment. ✓
- "Claimed local owner — ZIP on file: 95817" — factual, matches the spec's "Claimed" language. ✓
- "This ZIP isn't in proximity to your Shop's anchor Location — the badge isn't currently displayed" — honest feedback per spec. Could soften slightly: "Your ZIP isn't near enough to display the badge — try updating it if you've moved." Either way, no moral judgment about the claim itself. ✓
- "Add ZIP" / "Edit" / "Remove" — standard action verbs. ✓

### Empty / loading / error states

| State | Described? | Notes |
|---|---|---|
| Empty (no claim) | **yes** | "You haven't claimed Locally Owned yet" with Add ZIP CTA. |
| Populated (proximal) | **yes** | ZIP on file + badge renders. |
| Populated (non-proximal) | **yes** | Honest feedback about proximity failure. |
| Loading | **not described** | Inline form submission — show a brief loading indicator on the submit button. Trivial; ticket writer can spec. |
| Validation error (non-5-digit) | **described** | Inline validation, no server round-trip. |
| Invalid ZIP (not in lookup) | **described** | Inline validation against `zip_metro_crosswalk`. |

### Design verdict

**PROCEED with note.** The DLS needs an "owner-view section" pattern before the first ticket opens. This is a lightweight addition (a bordered/separated conditional section for role-gated management affordances) that will be reused by future owner surfaces (Group settings, member management, etc.). The ticket writer can bundle this as the first deliverable or as a doc-only pre-ticket.

---

## Apple platform legibility check

Apple legibility: clean — no new flags.

1. **Action-handler shape:** Both handlers (`member.business_jurisdiction.set`, `.remove`) follow the named-handler contract with typed input → output → event. Map 1:1 to App Intents actions (e.g., "Claim locally owned for my shop at ZIP 95817").
2. **Entity exposure:** No new entity. The Shop (Group) page already exists and will carry schema.org `LocalBusiness` data. The badge is a derived property, not a new entity.
3. **Deep-linkable URL:** The owner view lives on the same URL as the public Shop page (`/p/[…place]/g/[slug]`). Clean place-scoped URL.
4. **App Intents candidate:** `member.business_jurisdiction.set` is a strong App Intent candidate — typed, scoped, low-risk, meaningful via voice ("Claim my shop is locally owned at ZIP 95817"). Note for the Apple integration doc.

---

## Sibling-consistency findings

F039 (Locally Made) is the sibling in the same loop family — same badge shape, different signal (provenance vs. jurisdiction). **F039 is deferred** (status: deferred 2026-06-06, branch `t-f039` unmerged). No active sibling to check against.

When F039 un-defers, the ticket writer should verify: same owner-view section layout, same inline form pattern, same Edit/Remove action pair, same honest-feedback copy pattern for non-proximal claims. The DLS "owner-view section" pattern (noted above) should be shaped to accommodate both badges' management surfaces.

---

## Recommendations for the ticket writer

1. **DLS update first.** Add an "owner-view section" recipe to `design-language.md` — a role-gated management section on a public page. Keep it minimal: bordered container, "Owner tools" heading, responsive stack. This pattern recurs for future Group management surfaces.
2. **Loop number verification.** The scenario headers say Loop 7 + Loop 9; the spec says Buy Close is Loop 9. Verify against `member-journey.md` and correct if needed.
3. **ZIP validation.** The scenario assumes inline validation against `zip_metro_crosswalk`. T075 shipped the crosswalk with a 90-row Sacramento seed. The ticket should confirm the crosswalk covers the launch market adequately — if a real Sacramento ZIP is missing, the validator will reject a valid claim.
4. **Proximity feedback copy.** The honest-feedback message when a ZIP is non-proximal could benefit from a softer framing. Consider: "Your ZIP isn't close enough to display the badge right now. If you've moved, update your ZIP." vs. the more technical "isn't in proximity to your Shop's anchor Location."
5. **F035 beat 2 already checks the badge.** The public-side badge rendering is already wired in F035. F037 only needs the write surface (owner-view widget) + the read-after-write re-render showing the badge. No new public surface work.
