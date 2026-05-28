---
purpose: Backlog scenario — integration test of the Phase 2 exit criterion. A newcomer completes the full journey in under the working target (~90 seconds) across two paths.
layer: how
status: draft
---

# F043: A new member completes the full journey in under the target

**Bundle:** b1
**Loops:** Cross-cutting integration — Loops 1 / 3 / 7 / 9 / 4 (the full Phase 2 surface set).
**Canonical example:** Cross-cutting — exercises [O1](../../product/needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place) (gathering host path) and [P1](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services) (producer sell path).
**Primitive shape:** End-to-end across `members`, `member_place_interests`, `member_interests`, `groups`, `group_memberships`, `items`, `item_locations`, `item_gatherings`, `item_products`, all underlying action handlers + events.
**Status:** backlog
**New scenario** — no existing F-number. Integration test of every scenario from F030–F040; depends on all of them.

> **Working target note.** The "~90 seconds" framing is the working test target carried forward from `rebuild-plan.md` Phase 2 exit. Per [`housekeeping/2026-05-28-repo-reorg/reorg-plan.md`](../../housekeeping/2026-05-28-repo-reorg/reorg-plan.md) §5, the specific 90-second number is flagged as arbitrary (no user testing yet). Treat as a *qualitative test* — "the new Member can complete the full journey without getting stuck or abandoning" — with 90 seconds as the working numeric proxy. If real user testing later moves the number to 60 / 120 / 180, the qualitative spirit holds.

## The Person

Two test personas — one organizer, one producer — each going from "never used the platform" to "Item published with shareable URL" without abandoning.

- **Organizer path:** A Run Club regular wants a shareable URL for the Thursday gathering at Drake's.
- **Producer path:** A new neighborhood baker wants a brand page + their first product listed.

## The Story

**Organizer path.** New Member taps signup → magic link or social auth → profile (name, handle) → home locality (geolocated) → at least one interest tag → lands on `/` with feed. Taps a venue card for Drake's → loads `/p/[…]/l/drakes-suffix` → taps "Host something here" → composer opens with Drake's pre-attached → picks "recurring gathering" → fills title, day, time → publishes → lands on `/p/[…]/l/drakes-suffix/e/run-club-suffix` with Share link. Total elapsed: target ≤90s.

**Producer path.** New Member taps signup → magic link or social → profile → home locality → interest tag → lands on `/`. Taps "Sell" → walkthrough creates kind='business' Group → lands on Group page. Taps "Add a product" → composer opens → fills title, description, price, pickup point → publishes → lands on product page with brand resolve-up. Total elapsed: target ≤90s.

Both paths produce a public Item with a shareable URL. Both paths exercise every Phase 2 substrate write at least once. The test fails if any path takes >90s in the qualitative happy-path test, OR if any sub-step abandons / errors / loops.

## Surfaces

- **Entry points:** `/` (signup CTA) for both paths.
- **Primary actions:** Sign up; locality; interest tag; venue page → Host; (organizer) gathering composer; (producer) Sell walkthrough → Group; Add product → product composer.
- **Composer / interaction:** Each composer the Member encounters along the way.
- **Completion:** Organizer ends on gathering Item page with Share link. Producer ends on product Item page with brand resolve-up + Share link.
- **Discovery:** N/A — this scenario tests the path, not the discovery of the produced artifacts.

## Data Captured

(No new data captured beyond what F030–F040 already capture; the integration test exercises the existing writes.)

## Acceptance Criteria

### Organizer path completes under target

**Given** a fresh test account (no prior `members` row, no follows, no Items)
**When** the test agent walks through: signup → profile → locality → interest tag → land on `/` → tap Drake's venue → tap "Host something here" → fill gathering form → publish
**Then** the journey completes in ≤90 seconds (working target) without any error toast, redirect loop, or step abandonment; the resulting gathering Item has `kind='gathering'`, `state='published'`, an `item_gatherings` row with RRULE, an `item_locations` row attaching Drake's, and a public URL that loads.

### Producer path completes under target

**Given** a fresh test account
**When** the test agent walks through: signup → profile → locality → interest tag → land on `/` → tap "Sell" → complete Sell walkthrough (brand, anchor, about) → land on Group page → tap "Add a product" → fill product form → publish
**Then** the journey completes in ≤90 seconds (working target) without error; the resulting product Item has `kind='product'`, `state='published'`, `group_id` filed to the new business Group, brand resolve-up, and a public URL.

### Both paths produce shareable URLs

**Given** either path completes
**When** the test agent taps the Share affordance on the final Item page
**Then** a URL copies to clipboard (or the native share sheet invokes on mobile) and the URL, opened in a separate session, loads the public Item page successfully.

### Qualitative happy-path test passes alongside timing

**Given** the test runs
**When** measured as a qualitative test ("the new Member completed without getting stuck or abandoning")
**Then** the test passes IF: every step's primary CTA is visible, the input fields are clearly labeled, no error blocks progress, and the final landing page renders within reasonable time. Timing target of 90s is the secondary measurement; qualitative pass is the primary.

### Audit-field invariant holds across all writes

**Given** the path completes
**When** the test agent inspects the resulting event log
**Then** every event row has `acting_member_id` populated correctly (the new Member's ID), `via_delegation_id` is NULL (no delegation in this happy path), and timestamps are monotonically increasing per the action sequence.

## Edge Cases

- **Test account name collision:** test fixtures use a randomized handle to avoid collision; cleanup script removes test accounts post-run.
- **Geolocation denied:** the test environment seeds a fixed locality (Sacramento) to make the test deterministic; production behavior on geolocation-denial is tested elsewhere.
- **Magic link delivery delay:** test environment uses a stubbed magic-link endpoint that returns immediately.
- **One path passes, the other fails:** report independently; the overall scenario fails if EITHER path fails.

## Assumptions

- All of F030–F040 are shipped and pass their own acceptance tests independently.
- Test environment can seed a fresh `members` row + simulate auth + geolocation.
- The 90-second target is a working number — if user testing later changes it, the qualitative spirit (no getting stuck, no abandonment) is the load-bearing test.
- A Playwright suite or equivalent harness can drive both paths headlessly with timing instrumentation.

## Out of Scope

- A/B testing different onboarding flows for time-to-first-Item — b2+ if at all.
- Cold-cache vs. warm-cache timing variance — captured in instrumentation; not gated.
- Mobile-vs-desktop timing parity — separate test (this scenario tests on the canonical platform target only).
- Accessibility-mode timing (screen reader) — separate accessibility scenario (b2+ per `standards/accessibility.md`).
- Tests of every Phase 2 path beyond the two named here — covered by F030–F042 individually.

## Capabilities unlocked

(Integration test — no new producer-facing capabilities unlocked. The test validates the end-to-end coherence of capabilities already unlocked by F030–F040.)
