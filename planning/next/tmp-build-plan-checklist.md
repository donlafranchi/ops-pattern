---
id: tmp-build-plan-checklist
purpose: Working build-order checklist for remaining b1 surface + substrate work. Derived from plan-b1-surface-sequence.md dependency order, reconciled with current ledger/BUILD-LOG state. Temporary — fold into the scoreboard once consumed.
layer: how
status: active
---

# b1 build plan — ordered checklist

> Source of order: [`plan-b1-surface-sequence.md`](../now/plan-b1-surface-sequence.md) (approval = dependency order).
> State reconciled against [`STAGE-LEDGER.md`](../STAGE-LEDGER.md), [`bundle-1-checklist.md`](../now/bundle-1-checklist.md), [`web/BUILD-LOG.md`](../../web/BUILD-LOG.md), and JOURNAL.
> Status legend: **done** · **building** · **next** (buildable now / next in line) · **blocked** (waiting on a dependency or substrate gate) · **deferred** (intentionally postponed — not blocked).
>
> **State as of 2026-06-11.** The build sprint shipped most of the surface set — all merged to main with green evals. What remains is the saved-search / metro-blocked tail (F033, F042, F031) plus the F043 integration test that gates b1 close. F039 (Locally Made) is deferred, not blocked — branch preserved, scenario marked deferred.

---

## Substrate gates — build before the surfaces that depend on them

| Gate | Ticket | Status | Greens / unblocks | Notes |
|---|---|---|---|---|
| **S-jurisdictions** — `member_business_jurisdictions` Tier 0 + `zip_is_proximal_to_location()` + handlers | [`T075-member-business-jurisdictions-substrate.md`](../../development/tickets/T075-member-business-jurisdictions-substrate.md) | ☑ **done** (merged to main) | F037 ✅, F039 (deferred); jurisdiction half of F036 | Shipped. |
| **Polygon/centroid seed** — Sacramento-region `places` polygons + `centroid` column | [`T076-places-polygon-centroid-seed.md`](../../development/tickets/T076-places-polygon-centroid-seed.md) | ☑ **done** (merged to main) | polygon half of F036 locality step | Shipped. Seeds county/city/neighborhood tree rows only — no metro/region row (per D3); the Sacramento metro polygon belongs to S-metro (CSA grain). |
| **S-saved-search** — wire `member.saved_search.*` handlers + "Follow this venue" CTA (table exists, migration 019) | — (not yet ticketed) | ☐ **blocked** — needs ticket | F033, F042 | Surface enablement only; substrate already shipped (T063). The remaining gate for the F033/F042 tail. |
| **S-metro** — `metro_polygons` table + Census CSA seed + `members.home_metro_id` | — (not yet ticketed) | ☐ **next** — needs ticket | F031 | Unblocked: metro-polygon overlay decisions all ratified 2026-06-02 in PLATFORM-PATTERNS. Table not built; needs a ticket. **Owns the Sacramento metro geometry** (CSA grain, wider than the four-county MSA). |
| **T095 substrate** — member discoverability default-private | [`T095-member-discoverability-default-private.md`](../../development/tickets/T095-member-discoverability-default-private.md) | ☑ **done** (merged to main) | — | Shipped alongside the F037 build. |

---

## Surface scenarios — dependency order

- [x] **F036 — Member creates business Group via Sell walkthrough** · status: **done** · tickets: T070–T073b · *Shipped and merged to main, green evals. The Sell walkthrough end-to-end.*
- [x] **F035 — Viewer finds Group public page (Shop)** · status: **done** · tickets: T074 · *Shipped and merged to main, green evals. Shop public page.*
- [x] **F038 — Producer lists a product** · status: **done** · tickets: T077–T079, T080 · *Shipped and merged to main, green evals. Product composer end-to-end + place-scoped Item URL.*
- [x] **F040 — Producer lists a service** · status: **done** · tickets: T081–T083 · *Shipped and merged to main, green evals. Service composer (product-only Locally Made step omitted).*
- [x] **F034 — Member hosts recurring gathering** · status: **done** · tickets: T084–T085 · *Shipped and merged to main, green evals. Gathering composer — the wedge demo.*
- [x] **F030 — Newcomer signs up and lands in feed** · status: **done** · tickets: T086–T090 · *Shipped and merged to main, green evals. Newcomer signup + feed + email/password auth.*
- [x] **F032 — Viewer finds Member page and follows** · status: **done** · tickets: T091–T092 · *Shipped and merged to main, green evals. Member page + follow CTA writing `member_follows`.*
- [x] **F041 — Producer generates QR card for Item** · status: **done** · tickets: T093–T094 · *Shipped and merged to main, green evals. Print-quality PNG resolving to canonical URL. Farmers-market wedge.*
- [x] **F037 — Producer claims Locally Owned (Tier 0)** · status: **done** · tickets: T096–T098 · gate: S-jurisdictions ✅ · *Shipped and merged to main, green evals. Maya scenario. Jurisdiction claim.*
- [~] **F039 — Producer claims Locally Made (Tier 0)** · status: **deferred** · deps: F038 ✅, S-jurisdictions ✅ · *Intentionally deferred — too much product-specific nuance (per close-out ef8797b). Branch `t-f039` preserved (not merged); scenario marked deferred. Not blocked.*
- [ ] **F033 — Viewer finds venue page** · status: **blocked** · deps: F034 ✅ · gate: **S-saved-search** (needs ticket) · *"Follow this venue" writes a default `member_saved_searches` row; needs handlers wired. Not yet ticketed.*
- [ ] **F042 — Member follows producer, Group, venue** · status: **blocked** · deps: F032 ✅, F035 ✅, F033 · gate: **S-saved-search** · *Unified `/you/following`. Also needs group-follow substrate (`member_follows` is member→member only today). Not yet ticketed.*
- [ ] **F031 — Member manages place-interest scope** · status: **blocked** · deps: F030 ✅ · gate: **S-metro** (needs table build + ticket; ratified, so unblocked at the decision level) · *Metro-polygon "wider scope" opt-in; secondary place-interest cap (≤5). Not yet ticketed.*
- [ ] **F043 — Newcomer completes journey under target** · status: **blocked** · deps: all above (F033, F042, F031) · gate: — · *Integration test; gates b1 close. 90s is a smell target, "no getting stuck" is the load-bearing form.*

---

## What's next (the answer)

The shippable surface set is done. The remaining tail is gated on two substrate tickets that **don't exist yet**:

1. **Ticket + build S-saved-search** — wire `member.saved_search.*` handlers + the "Follow this venue" CTA (table already shipped at T063, migration 019). This is the single gate blocking **F033** (venue page) and, with F033, **F042** (unified following).
2. **Ticket + build S-metro** — `metro_polygons` table + Census CSA seed + `members.home_metro_id`. The metro-overlay design is ratified, so this is unblocked at the decision level — it just needs the table built and a ticket. Gates **F031** (place-interest scope).

Recommended immediate sequence:
1. Ticket + build **S-saved-search**, then scope → review → ticket → build **F033**.
2. Ticket + build **S-metro**, then scope → review → ticket → build **F031**.
3. With F033 + F031 done, scope → review → ticket → build **F042**.
4. Last: **F043** integration test — gates b1 close.

F039 (Locally Made) stays deferred; its branch is preserved if it's revived later.

---

## No longer applicable / archived

- **`scenario-F037-producer-claims-locally-owned.md`** + **`scenario-F039-producer-claims-locally-made.md`** (both formerly in `planning/backlog/`) — superseded by the Maya-persona redrafts (`scenario-F037-maya-claims-locally-owned.md`, `scenario-F039-maya-claims-locally-made.md`). **Archived 2026-06-02** to [`planning/done/2026-06-02-superseded-producer-scenarios/`](../done/2026-06-02-superseded-producer-scenarios/).
- **`scenario-F035-viewer-finds-group-page.md`** (backlog) — the business-kind flavor shipped via `scenario-F035-rosa-finds-mayas-shop.md` (done). The community-kind (Run Club) flavor it also covered is a candidate for a `tidy` pass — split out the community flavor or retire.
