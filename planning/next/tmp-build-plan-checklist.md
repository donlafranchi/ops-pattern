---
id: tmp-build-plan-checklist
purpose: Working build-order checklist for remaining b1 surface + substrate work. Derived from plan-b1-surface-sequence.md dependency order, reconciled with current ledger/BUILD-LOG state. Temporary — fold into the scoreboard once consumed.
layer: how
status: active
---

# b1 build plan — ordered checklist

> Source of order: [`plan-b1-surface-sequence.md`](../now/plan-b1-surface-sequence.md) (approval = dependency order).
> State reconciled against [`STAGE-LEDGER.md`](../STAGE-LEDGER.md), [`bundle-1-checklist.md`](../now/bundle-1-checklist.md), [`web/BUILD-LOG.md`](../../web/BUILD-LOG.md), and JOURNAL (through 2026-06-02).
> Status legend: **done** · **building** · **next** (buildable now / next in line) · **blocked** (waiting on a dependency or substrate gate) · **backlog** (drafted, not yet scoped/approved).
>
> **Pipeline reality check.** Only F035 + F036 have run the full scope→review→ticket→build→eval path. Every other F-number below is still a *draft scenario in `planning/backlog/`* — it must pass `scope` (backlog→next), `review`, and `ticket` before `build`. "next" here means next in the *dependency* chain, not "already approved."

---

## Substrate gates — build before the surfaces that depend on them

| Gate | Ticket | Status | Greens / unblocks | Notes |
|---|---|---|---|---|
| **S-jurisdictions** — `member_business_jurisdictions` Tier 0 + `zip_is_proximal_to_location()` + handlers | [`T075-member-business-jurisdictions-substrate.md`](../../development/tickets/T075-member-business-jurisdictions-substrate.md) | ☐ open (buildable now — all deps T055/T070/T060 done) | F037, F039; jurisdiction half of F036 `:266` | ⚠️ **Ticket-number collision** — see warning below |
| **Polygon/centroid seed** — Sacramento-region `places` polygons + `centroid` column | [`T075-places-polygon-centroid-seed.md`](../../development/tickets/T075-places-polygon-centroid-seed.md) | ☐ open (buildable now — deps T058/T066/T059 done) | polygon half of F036 `:266` locality step | ⚠️ **Ticket-number collision** — see warning below |
| **S-saved-search** — wire `member.saved_search.*` handlers + "Follow this venue" CTA (table exists, migration 019) | — (not yet ticketed) | ☐ blocked — needs ticket | F033, F042 | Surface enablement only; substrate already shipped (T063). |
| **S-metro** — `metro_polygons` table + Census CSA seed + `members.home_metro_id` | — (not yet ticketed) | ☐ blocked on ADR-24 ratification | F031 | Decision ratified per sequence doc; table not built; no ticket yet. |

> ⚠️ **Ticket-number collision (fix before building either).** There are **two** open tickets both numbered **T075** — `T075-member-business-jurisdictions-substrate` and `T075-places-polygon-centroid-seed`. They even target the same migration number (`024_*`). One must be renumbered (suggest the polygon-seed ticket → **T076**, and rebase its migration to `025_*` or later) before `build` opens either, or branches/commits/migrations will clash.

---

## Surface scenarios — dependency order

- [x] **F036 — Member creates business Group via Sell walkthrough** · status: **done** · deps: — · *eval 5/9 (4 forward-deps red); shipped T070→T073b. Marked done per build order; full-green pending F035/F038/F040/F034 + S-jurisdictions + polygon seed. Already merged to main.*
- [x] **F035 — Viewer finds Group public page** · status: **done** · deps: F036 (business flavor shipped directly per PM; F038/F040 dep relaxed for read surface) · *eval 8/8 PASS; T074 merged `294f6ab`. Community-Group (Run Club) flavor deferred to same F-number, different slug, after F034.*
- [ ] **F038 — Producer lists a product** · status: **next** · deps: F036 ✅ · gate: — · *Next in the chain. Product composer end-to-end; provenance-step skip path tested here. Greens part of F036 `:224`. Unblocks F039 + F041. Still in backlog — needs scope→review→ticket.*
- [ ] **F040 — Producer lists a service** · status: **next** (parallel with F038) · deps: F036 ✅ · gate: — · *No Locally Made step (product-only). Greens part of F036 `:224`.*
- [ ] **F034 — Member hosts recurring gathering** · status: **next** (parallel with F038/F040) · deps: F036 ✅ · gate: — · *The wedge demo. Unblocks F033 + F030. Greens part of F036 `:224`. Uses the multi-step composer (T071).*
- [ ] **F033 — Viewer finds venue page** · status: **blocked** · deps: F034 · gate: **S-saved-search** · *"Follow this venue" writes a default `member_saved_searches` row; needs handlers wired.*
- [ ] **F030 — Newcomer signs up and lands in feed** · status: **blocked** · deps: F036 ✅, F038, F040, F034 · gate: — · *Consumer entry; lands after the feed has content. Anonymous `/explore` + place-interest feed math.*
- [ ] **F032 — Viewer finds Member page and follows** · status: **blocked** · deps: F030 · gate: — · *Follow CTA writes `member_follows`.*
- [ ] **F037 — Producer claims Locally Owned (Tier 0)** · status: **blocked** · deps: F036 ✅ · gate: **S-jurisdictions** (ticketed, T075) · *Maya scenario is the live draft; producer version superseded + archived (see below). Greens jurisdiction half of F036 `:266`.*
- [ ] **F039 — Producer claims Locally Made (Tier 0)** · status: **blocked** · deps: F038, **S-jurisdictions** (made-at column + places seed) · *Maya scenario is the live draft; producer version superseded + archived. Greens provenance half of F036 `:266`. Two gates: S-jurisdictions AND F038 (the composer the field lives on).*
- [ ] **F042 — Member follows producer, Group, venue** · status: **blocked** · deps: F032, F035 ✅, F033 · gate: **S-saved-search** · *Unified `/you/following`. Also needs group-follow substrate (flagged in T074 SPEC-PATCHES — `member_follows` is member→member only today).*
- [ ] **F031 — Member manages place-interest scope** · status: **blocked** · deps: F030 · gate: **S-metro** (blocked on ADR-24 + table build) · *Metro-polygon "wider scope" opt-in; secondary place-interest cap (≤5).*
- [ ] **F041 — Producer generates QR card for Item** · status: **blocked** · deps: F038 (any Item kind) · gate: — · *Print-quality PNG resolving to canonical URL. Farmers-market wedge.*
- [ ] **F043 — Newcomer completes journey under target** · status: **blocked** · deps: all above · gate: — · *Integration test; gates b1 close. 90s is a smell target, "no getting stuck" is the load-bearing form.*

---

## What's next (the answer)

**F038 — Producer lists a product** is the next surface scenario in the dependency chain (only dependency F036 is done; no substrate gate). It should run scope → review → ticket → build next, ideally alongside its siblings **F040** (service) and **F034** (gathering), which share the same single dependency (F036) and no gate. All three green the remaining `:224` forward-dep in F036's eval.

**In parallel, the two open substrate tickets (`T075` ×2) are buildable right now** — their dependencies (T055/T058/T059/T060/T066/T070) all shipped. Landing them greens both halves of F036's `:266` eval and unblocks F037/F039. Renumber the collision first.

Recommended immediate sequence:
1. Fix the T075 collision (renumber polygon-seed → T076, rebase its migration off `024_*`).
2. Build both substrate tickets (jurisdictions + polygon seed) — no scenario approval needed (substrate lane).
3. Scope → review → ticket → build **F038**, then **F040** + **F034**.
4. Re-run F036 eval after substrate + F038/F040/F034 land → expect it to flip from partial-pass to full green, then flip the ledger row to `done`.

---

## No longer applicable / archived

- **`scenario-F037-producer-claims-locally-owned.md`** + **`scenario-F039-producer-claims-locally-made.md`** (both in `planning/backlog/`) — superseded by the Maya-persona redrafts (`scenario-F037-maya-claims-locally-owned.md`, `scenario-F039-maya-claims-locally-made.md`, drafted 2026-06-01 per JOURNAL). **Archived 2026-06-02** to [`planning/done/2026-06-02-superseded-producer-scenarios/`](../done/2026-06-02-superseded-producer-scenarios/).
- **`scenario-F035-viewer-finds-group-page.md`** (backlog) — the business-kind flavor shipped via `scenario-F035-rosa-finds-mayas-shop.md` (done). The community-kind (Run Club) flavor it also covers is still pending under the same F-number after F034. **Left in place** but flagged for a `tidy` pass — split out the community flavor or retire once F034 lands.

## planning/next/ note

`planning/next/` was empty (only `.gitkeep`) before this checklist landed. No approved scenarios are currently gated for build — every surface scenario is still a draft in `planning/backlog/`. The surface-sequence doc and bundle artifacts live in `planning/now/`, not `next/`.
