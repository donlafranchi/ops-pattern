---
id: how-f037-producer-claims-locally-owned
purpose: Backlog scenario — a producer claims the Tier 0 self-attested Locally Owned badge on their business Group.
layer: how
status: draft
---

# F037: A producer claims Locally Owned on their business Group

**Bundle:** b1
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Canonical example:** [P4 — A locally-owned, locally-made producer earns and displays both badges](../../product/needs/use-cases.md#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges) — the jurisdiction-claim half (Locally Owned). Locally Made is F039.
**Primitive shape:** Person(owner) → Group(kind='business') → `member_business_jurisdictions`(ZIP, Tier 0 self-attested) → derivation via `public.zip_is_proximal_to_location()` → "Claimed local owner" badge on Group page.
**Status:** backlog
**Replaces:** F026 partially — the jurisdiction-claim half. Group-creation half is F036.

## The Person

Maya has just created Oak Park Sourdough (F036) and skipped the locality step. Now she returns to it — she wants the "Claimed local owner" badge to surface for neighbors. She heard a friend talk about "Claimed local owner" badges and wants hers.

## The Story

From her Group page settings (or via F036's optional locality step), Maya enters a self-attested ZIP — her residential ZIP. The action layer writes `member_business_jurisdictions(member_id=Maya, group_id=her Group, zip='95820', verification_source='self_attested')`.

She returns to her Group page. For a viewer whose locality proximity test against ZIP 95820 passes (Oak Park resident, Sacramento resident, anyone whose `member_place_interests` resolves to a Place that contains or is contained by ZIP 95820's metro), the "Claimed local owner" badge surfaces in the header. For a viewer in Boise, no badge.

The label is exactly "Claimed local owner" — never "Verified." The evidence tier is honest. The viewer can tap the badge to see what tier it is and what the platform considers "claimed" vs. "verified."

She can edit or remove the claim from Group settings at any time.

Honest preview path: if Maya enters a ZIP that is outside the metro of her Group's anchor Location, the UI shows an honest preview ("This ZIP isn't in the same metro as Oak Park — your badge will only appear for viewers in your ZIP's area") and asks her to confirm. She can still write the claim; the badge derivation will hold accordingly.

No address is ever displayed. No street-level data. The doxxing-prevention design choice from `business-jurisdiction.md` lives in this scenario — the badge derives from ZIP + Place, not from `home_location_id`.

## Surfaces

- **Entry point:** Group page settings → "Locality claim" (primary). Secondary entry: F036 walkthrough step 4.
- **Primary action:** "Claim Locally Owned" (writes `member_business_jurisdictions`).
- **Composer / interaction:** Single ZIP input with honest-preview path on out-of-metro entry. Edit and remove controls in Group settings.
- **Completion:** Stays on Group settings; Group page refreshes to render the badge (or not, per viewer locality).
- **Discovery:** N/A — the badge is the discovery affordance; this scenario writes the claim, F035 reads it.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Your ZIP | `member_business_jurisdictions.zip` | yes |
| Your Group (auto) | `member_business_jurisdictions.group_id` | yes (implicit) |
| Evidence tier (auto) | `member_business_jurisdictions.verification_source = 'self_attested'` | yes (auto at b1) |

Implicit: `member_business_jurisdictions.member_id = <founder>`, `verified_at = NULL` at Tier 0 (only writes when community-attested or document-verified land at b2+). Events: `member.business_jurisdiction.claimed` (and `.removed` on remove).

## Acceptance Criteria

### Maya enters a ZIP and the claim writes

**Given** Maya is on her Group settings page
**When** she enters ZIP 95820 and taps "Claim Locally Owned"
**Then** in one transaction: `member_business_jurisdictions` row writes (`member_id`, `group_id`, `zip`, `verification_source='self_attested'`); `member.business_jurisdiction.claimed` event logs with `acting_member_id=Maya`; the settings page shows a "Claimed" state with edit + remove controls.

### Badge surfaces conditionally on viewer locality

**Given** Maya's claim exists for ZIP 95820 in Sacramento metro
**When** a viewer's locality proximity test against ZIP 95820 passes (via `public.zip_is_proximal_to_location()` derivation per `business-jurisdiction.md`)
**Then** the "Claimed local owner" badge renders in the Group page header for that viewer.

### Badge does not surface for distant viewers

**Given** Maya's claim exists for ZIP 95820 in Sacramento metro
**When** a viewer in Boise (or with locality not proximal to 95820) loads the Group page
**Then** no badge renders. The claim still exists; it just doesn't render for that viewer.

### Out-of-metro ZIP triggers honest preview

**Given** Maya is on her Group settings page; her Group's anchor Location is in Sacramento
**When** she enters a ZIP outside Sacramento's metro (e.g., a New York ZIP)
**Then** the UI surfaces an honest preview: "This ZIP isn't in the same metro as Oak Park — your badge will only appear for viewers in your ZIP's area." Maya can still confirm and write the claim; badge derivation will hold accordingly.

### Edit / remove flows work

**Given** a claim exists
**When** Maya edits the ZIP or taps "Remove claim"
**Then** edit path: existing row's `zip` updates, `member.business_jurisdiction.claimed` event logs again. Remove path: `removed_at` set (soft-delete), `member.business_jurisdiction.removed` event logs; badge stops rendering for any viewer.

### Label is "Claimed" not "Verified" at Tier 0

**Given** any badge rendering on the Group page header
**When** the page loads at b1
**Then** the badge label is exactly "Claimed local owner" — never "Verified." Tier 1 community-attested (b2+) and Tier 2 document-supported (b2+/b3) use different labels.

## Edge Cases

- **Invalid ZIP format:** inline validation; no write.
- **ZIP that resolves to no `places` row:** honest-preview path warns; write allowed but badge will never render.
- **Member is not the founder of the Group:** at b1, only the founder (operating owner) can claim. b2 multi-owner expansion may broaden.
- **Member removes the claim while a viewer is mid-page-load:** badge gracefully disappears on next page load; no stale render.
- **Multiple Groups one founder:** each Group has its own jurisdiction claim row; the founder may claim once per Group.

## Assumptions

- F036 (business Group exists) ships before this scenario.
- Substrate ticket S-jurisdictions ships: `member_business_jurisdictions` table + `verification_source` enum + `public.zip_is_proximal_to_location()` function + action handlers (`member.business_jurisdiction.add` / `.remove`).
- `places` table populated to ZIP-resolvable depth for Sacramento.
- The "Claimed local owner" badge label + tier-honesty rule is design-language-ratified.

## Out of Scope

- Tier 1 community-attestation surface (other members vouch) — b2+, paired with C5.
- Tier 2 document-supported verification (SOS filing, etc.) — b2+/b3.
- Locally Made badge (provenance on Items, not jurisdiction on Groups) — F039.
- Cross-claim aggregation surfaces ("show me all Locally Owned producers in my locality") — b2.
- Verification ladder UI explaining all three tiers — b2 documentation surface.

## Capabilities unlocked

- **3. Locality & Trust Signals** — "Claimed local owner" badge — Tier 0 self-attested ZIP on the business Group; badge surfaces when viewer's locality is proximal.
- **3. Locality & Trust Signals** — Badge labels reflect evidence tier honestly — "Claimed" at Tier 0, never "Verified."
- **3. Locality & Trust Signals** — Edit / remove jurisdiction claims in Group settings.
- **3. Locality & Trust Signals** — Doxxing prevention — no address or street-level data revealed; badges derive from ZIP and Place, not from `home_location_id`.
