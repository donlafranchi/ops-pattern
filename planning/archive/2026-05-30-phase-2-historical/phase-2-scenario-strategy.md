---
purpose: Strategy for structuring Phase 2 scenarios — the 14 scenarios F030–F043, ordered by member-journey progression and dependency.
layer: how
status: active
---

# Phase 2 Scenario Strategy

**Date:** 2026-05-27 (drafted) · 2026-05-28 (PM-ratified; promoted to active)
**Status:** Active. F030–F043 are the canonical Phase 2 scenario set. `scope` writes each in order per [§ Dependency chain](#dependency-chain). Phase 3 scenarios (`/explore` anonymous, Wonder, `/why` thesis page, Group browse/create, stewardships) await a separate strategy pass (see [§ Open decisions for PM](#open-decisions-for-pm) #2).

> **Supersedes:** the Phase 2 + Phase 3 sections of `rebuild-plan.md` (archived 2026-05-28). The "<90 second" exit metric below was flagged by [`housekeeping/2026-05-28-repo-reorg/reorg-plan.md`](../housekeeping/2026-05-28-repo-reorg/reorg-plan.md) §5 as arbitrary — treat as a working target, not a contract. See `pending-ratifications.md` for the ratification slot.

---

## What Phase 2 covers

Per `rebuild-plan.md`, Phase 2 ("Cluster 1 surfaces — Standing presence") ships the first user-facing routes and composers on top of the Phase 1 schema floor. The exit test: **a new Member can sign up, create an Item of any b1 kind, attach a Location, and reach a public page in <90 seconds.**

**In scope (Phase 2):**

- Auth + onboarding flow (signup → profile → locality → interests)
- Home feed / awareness feed (the signed-in member's landing surface)
- Member public page (`/m/[handle]`)
- Location/venue public page (`/p/.../l/[slug]`)
- Group public page (`/p/.../g/[slug]`)
- Gathering composer (venue-page entry: "Host something here")
- Product composer (with optional Locally Made claim)
- Service composer
- Sell walkthrough → kind='business' Group creation + Locally Owned claim
- Follow CTA on Member/Group/Location pages
- Item-level QR card affordance
- Place-interest management surface (`/you/locality`)

**Out of scope (Phase 3):**

- `/explore` — the no-login locality-first index
- `/g` browse index + `/g/new` Group create flow (non-business)
- Wonder composer
- `/why` thesis page
- Anonymous Loop 3 path
- Onboarding Group suggestion step
- Saved-search composer + fan-out worker (substrate only at b1)

---

## Ordering rationale

Scenarios are ordered by **member journey progression**: a new member arrives, browses, follows, organizes, then produces. This mirrors the ascending commitment pattern in `member-journey.md` (Gathering → Sharing → Trade) and means each scenario can assume the surfaces from prior scenarios exist.

The ordering also respects the dependency chain — you can't host at a venue before the venue page exists, and you can't claim Locally Owned before the business Group exists.

---

## The 14 scenarios

### Layer 1 — Arrive and Orient (Consumer baseline)

**S1. A newcomer signs up and lands in the awareness feed**
- **Replaces:** F028 (rewrite — drop "Sam" persona)
- **Use cases:** C1 (search/follow/feed), the newcomer-to-Sacramento situation
- **Covers:** Auth flow → profile creation → locality step (sets `primary_home` Place via `member_place_interests`) → interest tags → home feed renders with locality-matching Items. Anonymous fallback (IP-geolocated feed with signup banner). Empty-state handling when no Items match.
- **Why first:** Everything else depends on a signed-in member with a locality. This is the platform's front door.
- **Dependencies:** None (first scenario).
- **Key change from F028:** Drop persona name. Anchor to the use-case *situation* ("someone who just moved to Sacramento"), not to a named character. Also: F028 referenced `member_location_affinities` — replace with `member_place_interests` throughout. Trim the MSA-depth opt-in acceptance criteria (it's a setting detail, not core to the newcomer arc — fold into S2 or defer).
- **Capabilities unlocked:** Sign up (any auth method). Create a profile (name, handle, photo, bio, pronouns). Set home locality + pick interest tags. See a home awareness feed of locality-matching Items. Anonymous-visitor IP-geolocated fallback feed with signup banner.

**S2. A member manages their place-interest scope**
- **Replaces:** F029 (rewrite — drop "Maya" persona)
- **Use cases:** C2 (organizes awareness across multiple Places)
- **Covers:** The `/you/locality` management surface — add secondary Places, promote a secondary to primary, change primary granularity, remove a secondary. The awareness feed updates to reflect the new scope.
- **Why second:** Logically follows "you've arrived" with "you tune where you look." The management surface is a thin layer on top of the onboarding that S1 established.
- **Dependencies:** S1 (member exists with a primary_home).
- **Key change from F029:** Drop persona. Scenario is structurally sound — mostly a name scrub. Consider trimming the promote/demote atomic-swap acceptance criteria to the minimum testable assertion rather than the full transaction-log shape (that detail belongs in the ticket, not the scenario).
- **Capabilities unlocked:** Add up to 5 secondary Places to awareness scope. Promote a secondary to primary_home (atomic swap). Change primary_home granularity (neighborhood → city). Remove a secondary Place. Awareness feed updates to reflect scope changes.

### Layer 2 — Browse and Follow (Consumer deepening)

**S3. A viewer finds a member's public page and follows them**
- **Replaces:** F025 (rewrite — drop "Adaeze"/"Maya" personas, narrow scope)
- **Use cases:** C1 (follow what you love), P3 (variable-cadence producer — the viewer side)
- **Covers:** `/m/[handle]` read surface — who they are, what they make/host, which Groups they belong to, standing-presence badge. Follow CTA (auth + anon paths). Privacy gates (soft-deleted member → 404, private Group memberships hidden, location affinities hidden by default).
- **Why here:** The member page is the lightest "browse another person" surface. Needed before we can test producer flows that land on it.
- **Dependencies:** S1 (member exists); Items and Groups exist in schema (Phase 1).
- **Key changes from F025:** Drop personas. Remove all `member_location_affinities` references — replace with `member_place_interests` (private, not surfaced on public page at b1). The ADR-20 reframe note in F025 said to split Member page from Group page into separate scenarios — **this scenario takes the Member page; Group page becomes S6.** Narrow F025's "Adaeze as a dip vendor" framing to a generic "a producer with Items" situation.
- **Capabilities unlocked:** View any member's public page at `/m/[handle]`. See a member's Items, Group memberships (respecting privacy), and standing-presence badge. Follow a member (auth + anon paths). Privacy gates on soft-deleted members and hidden memberships.

**S4. A viewer finds a venue page and sees what's happening there**
- **New scenario** (no existing F-number)
- **Use cases:** O1 (group meets at a regular time and place — viewer side), O2 (venue's recurring program findable)
- **Covers:** `/p/.../l/[slug]` — the Location/venue public page. Header (name, address/distance, hero image). "What's happening here" section (Items attached to this Location). "Host something here" CTA (the gathering composer entry point — links to S5). Optional "Follow this venue" CTA (writes a `member_saved_searches` row per ADR-21; surface-only at b2 but the substrate write happens here). "About" section.
- **Why here:** The venue page is the entry point for the gathering composer (S5). It's also the surface that answers "what's happening near me" at the Location grain — the complement to the awareness feed's Place-grain answer.
- **Dependencies:** S1 (member exists), Locations exist in schema (Phase 1).
- **Notes:** This scenario is entirely new — no existing backlog scenario covers the venue page read surface. The Drake's venue page was assumed-to-exist in F018 but never specified.
- **Capabilities unlocked:** View any venue's public page at `/p/.../l/[slug]`. See "What's happening here" (Items at this Location). "Host something here" CTA (entry to gathering composer). Follow a venue (writes `member_saved_searches` substrate row). View venue "About" section.

**S5. A member hosts a recurring gathering at a venue**
- **Replaces:** F018 (rewrite — drop "Brian" persona)
- **Use cases:** O1 (Run Club at Drake's)
- **Covers:** Gathering composer entered from the venue page "Host something here" CTA. Location pre-attached. Kind selection in user language (one-time event / recurring gathering). Title, description, recurrence (RRULE), time, optional hashtags. Publish → lands on `/p/.../e/[slug]`. Share-link affordance. Item appears on venue page under "What's happening here" and in the awareness feed.
- **Why here:** The organizer arc. A member who has browsed (S3, S4) now creates something. The gathering composer is the simplest Item composer (no Group required, no business walkthrough).
- **Dependencies:** S4 (venue page exists with the CTA).
- **Key changes from F018:** Drop "Brian." Fix the three review blockers from the 2026-05-18 REVISE verdict: (1) `item.md` state-enum reconciliation, (2) design-language component recipes for kind picker / share-link / event-page recurring surface, (3) `/i/` → `/e/` URL + kind-label harmonization. The slug URL in the old scenario (`/i/unofficial-run-club-drakes`) becomes `/p/.../e/unofficial-run-club-abc` per ADR-20 + ADR-22.
- **Capabilities unlocked:** Host a one-time event at a venue. Host a recurring gathering (RRULE — weekly/monthly/custom). Attach a gathering to an existing Location. Add hashtags to a gathering. Share a gathering via URL/native share sheet. RSVP button + RSVP count. Gathering appears on venue page + awareness feed.

### Layer 3 — Browse Groups (Organizer adjacent)

**S6. A viewer finds a group's public page**
- **New scenario** (split from F025 per ADR-20 reframe)
- **Use cases:** O1 (the Group that emerges from regulars), P1 (the business Group page)
- **Covers:** `/p/.../g/[slug]` — the Group public page. Header (name, kind chip, anchor Location). Members list (respecting privacy — listed memberships only). Items filed under the Group. Join CTA for community-kind Groups. For kind='business' Groups: `group_businesses.display_name` as brand, "Claimed local owner" badge (if jurisdiction passes proximity test), Items resolve-up with brand.
- **Why here:** Bridges the organizer and producer arcs. The Group page is where a gathering organizer's Group and a producer's business Group both live. Needed before S7 (Sell walkthrough) so the business Group page can be tested.
- **Dependencies:** S3 (member page exists — Group page links to member pages), Groups exist in schema (Phase 1).
- **Notes:** Covers both community-kind and business-kind Group rendering in one scenario, since the page template is shared. The Join CTA writes `group_memberships` with `source='explicit'`. The "Claimed local owner" badge rendering is read-side — the claim itself is S7's write.
- **Capabilities unlocked:** View any group's public page at `/p/.../g/[slug]`. See Group members list (respecting privacy). See Items filed under the Group. Join a community-kind Group. For kind='business' Groups: see brand name, "Claimed local owner" badge, branded Items.

### Layer 4 — Produce

**S7. A member creates a business Group through the Sell walkthrough**
- **Replaces:** F026 partially (the Group-creation half; jurisdiction claim splits to S8)
- **Use cases:** P1 (producer creates profile)
- **Covers:** The Sell walkthrough — member taps "Sell" CTA (on `/you` or as secondary CTA on composers) → creates a kind='business' Group (display name, anchor Location, owner role as founder). The walkthrough offers the jurisdiction step but the member can skip it (jurisdiction claim is S8's territory). Lands on the new Group public page (S6). First-time seller path: one Group, one owner, sole-prop shape. CTA placement documented: `/you` "Sell" affordance + secondary CTA on gathering/wonder composers.
- **Why here:** The Sell walkthrough is the gateway to all producer flows. Must exist before product or service composers can file Items under a business Group. Separated from the jurisdiction claim because creating a business Group and claiming locality are distinct capabilities — a producer can sell without claiming a badge.
- **Dependencies:** S6 (Group public page — where the new Group renders).
- **Key changes from F026:** Drop "Maya." Extract the Group-creation walkthrough from F026 as a standalone scenario. F026's jurisdiction-specific acceptance criteria move to S8.
- **Capabilities unlocked:** Create a kind='business' Group via the Sell walkthrough. Set display name, anchor Location, owner role as founder. CTA placement on `/you` + secondary CTAs on composers. Land on the new business Group public page.

**S8. A producer claims Locally Owned on their business Group**
- **Replaces:** F026 partially (the jurisdiction-claim half)
- **Use cases:** P4 (Locally Owned badge — jurisdiction substrate)
- **Covers:** The Tier 0 jurisdiction claim — during or after the Sell walkthrough, member enters a self-attested ZIP → "Claimed local owner" badge surfaces on the Group public page. Out-of-metro ZIP → honest preview ("This ZIP isn't in the same metro…"), no badge. Skip → no badge, nudge in Group settings. Edit/remove jurisdiction in Group settings. Badge label is exactly "Claimed local owner" (evidence-tier honesty per ADR-21). No clickable revelation of ZIP or address (doxxing prevention).
- **Why here:** Logically follows S7 — the business Group must exist before a jurisdiction claim attaches to it. Keeping the claim separate from Group creation means the scenario tests the badge lifecycle (set, edit, remove, out-of-metro rejection) without also testing the Group walkthrough flow.
- **Dependencies:** S7 (business Group exists).
- **Key changes from F026:** Drop "Maya." F026's jurisdiction acceptance criteria land here intact. The walkthrough entry path is S7's concern; this scenario can be entered from Group settings as well as from the walkthrough's jurisdiction step.
- **Capabilities unlocked:** Claim Locally Owned (Tier 0 self-attested ZIP → "Claimed local owner" badge). Edit/remove jurisdiction in Group settings. Out-of-metro ZIP rejection with honest preview. Badge label reflects evidence tier (never "Verified" at Tier 0). Doxxing prevention (no address revealed).

**S9. A producer lists a product**
- **New scenario** (product composer extracted from the prior S8 broadening of F027)
- **Use cases:** P1 (lists products), P3 (variable cadence — the Item is the unit of findability)
- **Covers:** Product composer end-to-end — title, description, price (or free), location attachment, optional Group filing (kind='business' Group from S7). The Item page at `/p/.../g/[group-slug]/p/[slug]` (or `/m/[handle]/p/[slug]` if no Group). Resolve-up rendering (brand from Group, owner link to Member page). Item appears in the awareness feed. The provenance step ("Where is this made?") appears in the composer but the claim itself is S10's territory — S9 tests the skip path.
- **Why here:** The first product-specific composer. Separated from the Locally Made claim because listing a product and claiming provenance are distinct capabilities — a producer can sell without earning a badge.
- **Dependencies:** S7 (business Group — optional), S4 (Location page for pickup).
- **Capabilities unlocked:** List a product (title, description, price/free, location attachment). File a product under a business Group (optional — can sell as individual). Product page at kind-specific URL. Product appears in awareness feed. Provenance step appears in composer (skip path tested here; claim tested in S10).

**S10. A producer claims Locally Made on their product**
- **Replaces:** F027 (rewrite — drop "Maya"/"Carol"/"Dave" personas)
- **Use cases:** P4 (Locally Made badge — provenance substrate)
- **Covers:** The provenance step in the product composer — Place picker for `made_at_place_id` → "Claimed locally made" badge. Viewer-side badge rendering conditional on place-interest proximity (neighbor sees badge; out-of-metro viewer doesn't). Badge label is exactly "Claimed locally made" (evidence-tier honesty). Skip → no badge, non-blocking nudge. Edit/remove provenance in Item management. kind='product' constraint enforced (services don't get the step).
- **Why here:** Follows S9 — the product must exist before a provenance claim attaches to it (or the claim lands during composition, but the test surface is the badge lifecycle).
- **Dependencies:** S9 (product exists).
- **Key changes from F027:** Drop personas. F027's acceptance criteria land here intact — this is F027's original focused scope, not the broadened version.
- **Capabilities unlocked:** Claim Locally Made on a product (Tier 0 self-attested Place → "Claimed locally made" badge). Viewer-side badge rendering conditional on place-interest proximity. Edit/remove provenance in Item management. kind='product' constraint enforced (services excluded).

**S11. A producer lists a service**
- **New scenario** (no existing F-number)
- **Use cases:** P1 (lists services), P5 (service provider — b1 substrate only)
- **Covers:** Service composer — title, description, service area (radius-from-point at b1), pricing model (flat/hourly/per-session/free), Location attachment (optional — services may be area-wide). The Item page at the service URL slot. No Locally Made step (kind='product' only per `item.md`).
- **Why here:** Completes the three b1 Item composers (gathering, product, service). Structurally simpler than the product composer — no provenance, no badge.
- **Dependencies:** S7 (business Group — optional; a member can list a service without a Group).
- **Notes:** Keep this scenario lean. The service-Item shape at b1 is minimal — richer fields (appointment availability, scope of work, prerequisites) are b2+ per P5's deferral. The b1 surface is "post a service, be findable."
- **Capabilities unlocked:** List a service (title, description, service area as radius-from-point, pricing model). Service page at kind-specific URL. No Locally Made step (kind='product' only). Service appears in awareness feed.

**S12. A producer generates a QR card for their item**
- **New scenario** (no existing F-number)
- **Use cases:** P2 (posts bulletins — adjacent), P3 (variable cadence — the farmers market wedge)
- **Covers:** Post-create screen on any Item composer offers "Get a QR card for this." Tap → `item.qr_card.request` action handler → generates print-quality PNG → downloadable. The QR resolves to the Item's kind-specific canonical URL. Available for any Item kind (product, service, gathering).
- **Why here:** The QR card is the farmers-market onboarding affordance — the thing a seller chalks on a board or tapes to a booth. It's cross-cutting (works for any Item kind) but most meaningful for producers.
- **Dependencies:** Any Item exists (S5, S9, or S11).
- **Capabilities unlocked:** Generate a print-quality QR card for any Item (product, service, gathering). QR resolves to the Item's canonical URL. Downloadable PNG.

### Layer 5 — Cross-cutting verification

**S13. A member follows a producer, a group, and a venue**
- **New scenario** (no existing F-number — Follow CTA tested in S3 for members, but Group and Location follows aren't covered)
- **Use cases:** C1 (follow what you love)
- **Covers:** Follow CTA on Member pages (S3 already covers the member-to-member follow — this scenario covers Group and Location follows). Group follow writes `group_memberships` with `source='explicit'`. Location "Follow this venue" writes a `member_saved_searches` row per ADR-21. "Things you follow" management surface on `/you`. Unfollow flows for all three target types.
- **Why here:** The follow substrate is the connective tissue between all the surfaces built in S1–S12. Testing it as a cross-cutting scenario after all surfaces exist is cleaner than scattering follow tests across every surface scenario.
- **Dependencies:** S3 (member page), S4 (venue page), S6 (Group page).
- **Capabilities unlocked:** Follow a Group (writes `group_memberships`). Follow a venue (writes `member_saved_searches` substrate row). "Things you follow" management surface on `/you`. Unfollow for all three target types (member, Group, venue).

**S14. A new member completes the full journey in under 90 seconds**
- **New scenario** (no existing F-number — this is the Phase 2 exit criterion as a scenario)
- **Use cases:** Cross-cutting — the <90s exit test
- **Covers:** Two timed end-to-end paths: (1) auth → profile → locality → land on feed → tap "Host something here" on a venue → fill the gathering composer → publish → land on public page with a shareable link. (2) auth → Sell → business Group → product composer → publish → public page. Both paths under 90 seconds.
- **Why last:** This is the integration test. Every prior scenario builds a surface; this scenario tests the seams between them.
- **Dependencies:** All of S1–S12.
- **Capabilities unlocked:** (Integration test — no new capabilities. Validates that the full journey from signup to published Item with shareable link completes in <90 seconds across both the organizer path and the producer path.)

---

## What happens to the existing six scenarios

| Old F# | Old title | Disposition | New slot(s) | Key changes |
|---|---|---|---|---|
| F018 | Brian declares the Run Club | **Rewrite as S5** | Layer 2 — Organizer | Drop "Brian." Fix 3 review blockers. `/i/` → `/e/`. |
| F025 | Adaeze's Member public page | **Split into 2** | S3 (Member page) + S6 (Group page) | Drop "Adaeze"/"Maya." ADR-20 reframe splits Member page from Group page. Replace `member_location_affinities` refs. |
| F026 | Maya claims Locally Owned | **Split into 2** | S7 (Sell walkthrough) + S8 (jurisdiction claim) | Drop "Maya." Group creation and locality claim are distinct capabilities; split so each scenario tests one. |
| F027 | Maya claims Locally Made | **Rewrite as S10** | Layer 4 — Producer | Drop "Maya"/"Carol"/"Dave." F027's focused provenance-claim scope stays intact. Product composer extracted to S9. |
| F028 | Sam lands in awareness feed | **Rewrite as S1** | Layer 1 — Arrive | Drop "Sam." Replace `member_location_affinities` refs. Trim MSA-depth details. |
| F029 | Maya manages place-interest scope | **Rewrite as S2** | Layer 1 — Arrive | Drop "Maya." Mostly a name scrub — structurally sound. |

**Split rationale.** The PM directed "more scenarios, not fewer" and "look for opportunities to split where a scenario covers multiple distinct capabilities." Three splits applied:

1. **F025 → S3 + S6.** The ADR-20 reframe note already flagged this. Member page and Group page are different surfaces with different data shapes and different CTAs.
2. **F026 → S7 + S8.** Creating a business Group (the Sell walkthrough) and claiming a jurisdiction badge are independent actions — a producer can sell without claiming locality. Splitting lets each scenario test one lifecycle (Group creation vs. badge set/edit/remove/out-of-metro).
3. **F027 broadening reversed → S9 + S10.** The prior strategy broadened F027 to cover the full product composer. That bundled two distinct capabilities (listing a product and claiming provenance). Splitting restores F027's original focused scope as S10 (provenance claim) and gives the product composer its own scenario (S9).

---

## Dependency chain

```
S1 (signup + feed)
├── S2 (place-interest management)
├── S3 (member public page + follow)
│   └── S6 (group public page)
│       └── S7 (sell walkthrough / business Group)
│           ├── S8 (locally owned claim)
│           ├── S9 (product composer)
│           │   └── S10 (locally made claim)
│           └── S11 (service composer)
├── S4 (venue public page)
│   └── S5 (gathering composer)
├── S12 (QR card — depends on any Item from S5/S9/S11)
├── S13 (follow cross-cutting — depends on S3/S4/S6)
└── S14 (90-second integration — depends on all)
```

**Parallel tracks.** After S1, two independent tracks can run concurrently:

- **Browse → Produce track:** S3 → S6 → S7 → S8, S9 → S10, S11
- **Venue → Gather track:** S4 → S5

These converge at S12/S13/S14.

---

## F-number assignment

The existing F018, F025–F029 numbers are retired with the rewrite. New scenarios get fresh F-numbers starting from F030. The old files in `scenarios-backlog/` get archived to `_attic/` with a note pointing to the replacement.

| Slot | F# | Title (working) |
|---|---|---|
| S1 | F030 | A newcomer signs up and lands in the awareness feed |
| S2 | F031 | A member manages their place-interest scope |
| S3 | F032 | A viewer finds a member's public page and follows them |
| S4 | F033 | A viewer finds a venue page and sees what's happening there |
| S5 | F034 | A member hosts a recurring gathering at a venue |
| S6 | F035 | A viewer finds a group's public page |
| S7 | F036 | A member creates a business Group through the Sell walkthrough |
| S8 | F037 | A producer claims Locally Owned on their business Group |
| S9 | F038 | A producer lists a product |
| S10 | F039 | A producer claims Locally Made on their product |
| S11 | F040 | A producer lists a service |
| S12 | F041 | A producer generates a QR card for their item |
| S13 | F042 | A member follows a producer, a group, and a venue |
| S14 | F043 | A new member completes the full journey in under 90 seconds |

---

## Open decisions for PM

1. **F-number gap:** F019–F024 were scrapped. F025–F029 are being retired. Fresh numbering from F030 avoids confusion. Confirm.
2. **Phase 3 scenarios:** This strategy covers Phase 2 only. Phase 3 scenarios (explore page, Wonder, thesis page, Group browse/create, stewardships) need a separate strategy pass. The awareness feed (S1) and venue page (S4) are prerequisites for Phase 3's `/explore` and anonymous Loop 3 path.
3. **Account deletion + export:** Listed as b1.0 🟡 in the work map. Not covered by any Phase 2 scenario. If it must ship within 4 weeks of launch, it needs a scenario (S15?) or a substrate-only ticket. PM call on timing.
4. **Auth method:** The work map flags magic link vs. social vs. email-password as an open decision. S1 needs an answer before writing starts.
5. **Hashtag autocomplete:** Listed as b1.3 🟡. It cross-cuts every composer (S5, S9, S11). If included, it should be mentioned in S5 (the first composer) and inherited by later ones. PM call on whether it's in Phase 2.
