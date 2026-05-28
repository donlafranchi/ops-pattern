# F026: Maya claims Locally Owned on her business Group

**Bundle:** b1
**Sub-bundle:** b1.2 — Business Groups & makers
**Work-map item:** b1.2 → 🟢 "Create-a-business-Group flow … self-attested ZIP for Tier 0 jurisdiction" + 🟢 "The 'Claimed local owner' badge (Tier 0)"
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Canonical example:** Maya at Oak Park Sourdough — [`use-cases.md` #13](../../product/needs/use-cases.md)
**Primitive shape:** Person(Maya, owner) → Group(kind=`business`, anchored at Oak Park) → `member_business_jurisdictions`(ZIP, source=`self_attested`)
**Status:** backlog

## The Person

Maya bakes sourdough at home in Oak Park and sells at the Sacramento farmers market on Saturdays. She wants neighbors discovering her Group on the platform to know she's a local owner — *the money goes to a Sacramento household, not an out-of-state corporate shell* — without having to publish her home address. Her LLC is registered to a commercial agent's office in midtown; that ZIP is the one she's willing to surface as her business's locality.

## The Story

Maya is in the **Sell walkthrough** — she just tapped the **Sell** verb on the universal composer for the first time, and the walkthrough is creating her kind='business' Group ("Oak Park Sourdough"). The walkthrough has already collected her display name, an anchor Location (her Saturday market stall at Cesar Chavez Plaza), and her owner role. The next step is *optional locality*: "Where is your business based?"

She enters her registered-agent's ZIP (`95814`, midtown Sacramento). The walkthrough tells her, plainly, that this is *self-attested at Tier 0* and shows the badge she'll get: **"Claimed local owner"**. It doesn't ask for documents, doesn't ask for a street address, doesn't ask for her home ZIP. She taps **Confirm**.

She lands on her new Group's public page at `/p/sacramento/oak-park/g/oak-park-sourdough`. Below the Group header, a green "Claimed local owner" badge is visible — the badge that the locally-owned-and-operated index will pick up. Anywhere in Group settings, she can edit or remove this jurisdiction. The Tier 1 path ("Community-confirmed" — buyers attest, b2+) is mentioned as an upcoming ladder step she'll earn as her community interacts with her Group; not something she does today.

## Surfaces

- **Entry point:** The Sell walkthrough (reached by tapping **Sell** in the universal composer). Locality step appears after display name + anchor Location are confirmed. _Why: per `groups.md` business-Group creation flow + ADR-12 supersession — selling tools surface from Group state, never from a Member-level toggle, so the "Become a Maker" entry retired with the toggle._
- **Primary action:** A single field labeled **"Business ZIP"**, a one-line explainer ("This is a public claim of where your business is based — not your home address"), and a primary button **"Confirm locality"** + a tertiary "Skip for now."
- **Composer / interaction:** One ZIP input (5-digit numeric, US ZIP regex), a help link to "Why we ask," and a preview line that updates live: "You'll be shown as **Claimed local owner** in Sacramento." If the ZIP fails the proximity test against the Group's anchor Location, the preview swaps to "This ZIP isn't in the same metro as your anchor Location; no badge will surface." _Why: surface honesty — the seller shouldn't be told they got a badge they didn't qualify for; ADR-21's first-signal posture is publicly evidence-tiered, not opt-in falsely._
- **Completion:** Group public page at `/p/sacramento/oak-park/g/oak-park-sourdough` with the "Claimed local owner" badge rendered below the Group header. Group settings has an "Edit business jurisdiction" affordance for changes / removal.
- **Discovery:** The Group surfaces in locality-first browse with the "Claimed local owner" badge. The locally-owned filter (when it ships in `discovery.md`) includes this Group.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Business ZIP | `member_business_jurisdictions.zip` | optional (skip = no badge) |
| Maya's Member ID (the owner declaring) | `member_business_jurisdictions.member_id` | yes (implicit; auth.uid()) |
| Maya's Group ID (her kind='business' Group) | `member_business_jurisdictions.group_id` | yes (implicit; the walkthrough's Group) |

Implicit (set by the surface, not asked of the user):
- `verification_source = 'self_attested'` (per `business-jurisdiction.md` T1)
- `verified_at = NULL` (Tier 0 has no external verification timestamp)
- `state`, `legal_entity_name`, `source_document_id` — all NULL at Tier 0
- `member.business_jurisdiction_set` event fires with `{group_id, zip, verification_source: 'self_attested'}`

## Acceptance Criteria

### Setting a Tier 0 jurisdiction during the Sell walkthrough

**Given** Maya is mid-Sell-walkthrough, has confirmed her Group's display name and anchor Location (Cesar Chavez Plaza, Sacramento), and is signed in as the founder of her kind='business' Group
**When** she enters a Sacramento ZIP (`95814`) in the "Business ZIP" field and taps "Confirm locality"
**Then** a `member_business_jurisdictions` row is created with `(member_id=Maya, group_id=her Group, zip='95814', verification_source='self_attested', removed_at=NULL)`. _Why: substrate per `business-jurisdiction.md` T1; the action handler `member.business_jurisdiction.set` is the only write path per ADR-7._
**And** the walkthrough advances to its next step (or completes); she does not see any external-verification or document-upload UI. _Why: Tier 0 b1 floor per ADR-21 — community-attestation and document-supported tiers are b2+._
**And** the `member.business_jurisdiction_set` event is appended to `member_events` in the same transaction. _Why: same-transaction row+event invariant per ADR-7._

### Badge surfaces on the Group public page

**Given** Maya has completed the walkthrough; her Group is anchored at a Location whose `place_id` resolves to Sacramento (city)
**When** any visitor (signed-in or anonymous) navigates to her Group's public URL
**Then** a "Claimed local owner" badge is visible below the Group header. _Why: locality-first index commitment per `principles.md` Loop 7 — the platform's most consequential commercial affordance for kind='business' Groups; the badge surfaces conditional on the proximity test in `groups.md` Locality and promotion._
**And** the badge label is exactly "Claimed local owner" (not "Verified" or "Documented"). _Why: ADR-21 evidence-tier honesty — the public signal differentiates climbers from non-climbers; misrepresenting the tier collapses the badge's meaning._
**And** the badge has no clickable revelation of Maya's ZIP, address, or any identifying detail. _Why: doxxing-prevention per `policy.md` and ADR-21 — public jurisdiction means the ZIP is *evidence*, not surface content._

### Out-of-metro ZIP does not earn the badge

**Given** Maya is in the locality step of the walkthrough; her Group's anchor Location resolves to Sacramento
**When** she enters a Phoenix ZIP (`85001`) and taps "Confirm locality"
**Then** the live preview reads "This ZIP isn't in the same metro as your anchor Location; no badge will surface" and the Confirm button remains active (the platform doesn't *block* the claim — it tells her honestly what will happen). _Why: ADR-21 evidence-tier honesty — the seller decides whether to record the jurisdiction; the platform decides what badge to render. Honest preview prevents post-hoc surprise._
**When** she taps Confirm anyway
**Then** the row is written with `zip='85001', verification_source='self_attested'` and **no badge** renders on the Group page. _Why: `public.zip_is_proximal_to_location()` returns false; the derivation per `groups.md` Locality and promotion correctly skips this Group._

### Editing and removing the jurisdiction record

**Given** Maya has a Tier 0 jurisdiction set
**When** she opens Group settings → "Edit business jurisdiction" and changes the ZIP to a different in-metro ZIP (`95818`, Land Park)
**Then** the existing row is soft-replaced: the prior row's `removed_at` is set, a new active row is inserted with the new ZIP, and `member.business_jurisdiction_set` fires with `{previous_zip: '95814', new_zip: '95818'}`. _Why: audit-trail per ADR-6 — the event log is the audit chain for "you claimed local in month X, then in month Y — when did you update?"_
**And** the badge remains visible (both ZIPs pass the Sacramento proximity test).

**When** she opens Group settings → "Remove business jurisdiction"
**Then** the active row is soft-deleted (`removed_at` set), `member.business_jurisdiction_removed` fires, and the badge disappears from the public Group page. _Why: ADR-21 reversibility — the claim is opt-in; removal is one tap._

### Skip-during-walkthrough is honored

**Given** Maya is in the locality step
**When** she taps "Skip for now"
**Then** no `member_business_jurisdictions` row is created; the walkthrough completes; her Group has no "Claimed local owner" badge; she sees a one-line note on Group settings: "You haven't claimed a business locality yet. Add one to earn the Locally Owned badge." _Why: ADR-21 opt-in — Members aren't punished for being at Tier 0 (no badge), nor for being at no-tier (also no badge); the platform is transparent about what hasn't been claimed._

## Edge Cases

- **Multiple owners on the Group:** each owner-role Member can hold their own jurisdiction row per (`member_id`, `group_id`). The Group qualifies as locally owned if **any** owner's row passes the proximity test (per `business-jurisdiction.md` *Multiple owner-role Members*). b1 surface only exposes Maya's own jurisdiction; the multi-owner badge-aggregation is a thin extension at b1 (no UI changes; the badge derivation already reads "any owner") — additional owners' walkthroughs land their own rows independently.
- **Maya changes the Group's anchor Location** (e.g., she moves the market booth to Folsom): the badge re-evaluates on next read because the derivation is computed at query time (per `groups.md`). If the new anchor's Place falls outside Maya's ZIP's metro, the badge silently drops; Maya sees a one-line note in Group settings telling her so.
- **Non-US ZIP entered:** the ZIP regex check rejects at the action layer with a clear error ("Currently we only support 5-digit US ZIPs"); the row is not created. Federation horizon (T3) extends to non-US locality tokens; not at b1.
- **Maya already has a different active jurisdiction for this Group from an earlier session:** the action handler soft-replaces (sets the prior row's `removed_at`, inserts a new active row). The unique partial index `ux_jurisdiction_member_group_active` enforces one active row per (member, group). _Why: substrate per `business-jurisdiction.md` Data model implications._

## Assumptions

- The Sell walkthrough already exists (per b1.2 work-map "Create-a-business-Group flow"). This scenario adds the locality step inside the existing flow; it does not introduce a standalone composer.
- The Group's anchor Location is set earlier in the walkthrough; the `place_id` on the Location is resolved at create-time per `places.md`.
- `public.zip_is_proximal_to_location(zip, location_id)` is available per `business-jurisdiction.md` Data model implications; the b1 ticket sequence includes the `zip_metro_crosswalk` table and the function.
- `member_events` table + `acting_member_id` + `via_delegation_id` columns ship at b1 per ADR-6 / ADR-7 / `rebuild-plan.md` Phase 1.

## Out of Scope

- **Tier 1 community-attestation surface + threshold worker** — b2+ per ADR-21 (`business-jurisdiction.md` T2).
- **Tier 2 document upload** — b2+/b3 per `business-jurisdiction.md` T3.
- **Public "locally-owned" filter on the discovery surface** — b1.4 has a 🟢 "discover" page; the filter dimension lands there or in a later sub-bundle, not in this scenario.
- **Multi-owner walkthrough flows** — sole-prop case covers Maya, Ferrari Fisheries, the dip vendor, the food truck (per b1.2 MVP cut).
- **Federation-aware jurisdiction (non-US ZIPs, peer-platform attestation)** — T3 per `business-jurisdiction.md` Open Question 7.
