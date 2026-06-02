---
id: how-t082-service-composer-surface
purpose: Service composer surface — <ServiceComposer> on MultiStepComposer + createServiceAction wrapping item.create + the /you/sell "Add a service" entry.
layer: how
status: open
---

# T082 — Service composer surface (`<ServiceComposer>` + server action + /you/sell wiring)

**Scenario:** [F040 — A producer lists a service](../../planning/now/scenario-F040-producer-lists-service.md)
**Binds to:** `product/ui/design-language.md` § Component recipes → Multi-step composer · F040 § Surfaces
**Status:** Open
**Bundle:** b1 (b1.3 — Item composers)
**Depends on:** T081 (service arm) · T071 (MultiStepComposer) · T072 (AddEntityDrawer) · T080 (data-driven /you/sell COMPOSERS row)
**Repo / branch:** web / `t-f040`

## Serves

- F040 Then-clauses: "Add a service reachable from Group page + /you"; "Composer writes Item + child in one transaction"; "No Locally Made step on services".

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (new composer surface — MANDATORY).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Server action — `src/app/you/sell/service/actions.ts`

- [ ] `'use server'`. `createServiceAction({ groupId?, title, description, rateModel, rateCents, centerLocationId, radiusMeters })` resolves the auth user (`requireMemberId` pattern), resolves the center Location's coords (`st_y`/`st_x`) for the service-area circle, calls `item.create` with `kind:'service'`, `publish:true`, `locationId = centerLocationId`, and the three `serviceArea*` fields, returning `{ itemId, destinationUrl }`.
- [ ] `destinationUrl`: filed under a Group → `/p/[…place]/g/[group-slug]/s/[item-slug]`; sold as individual → `/m/[handle]/s/[item-slug]`. Item slug = `toSlug(title)-<first 8 of itemId>` (mirror T078). Reuse the place-path walk from `product/actions.ts`.
- [ ] Map `ActionError → SellActionError`.

### `<ServiceComposer>` — `src/components/sell/ServiceComposer.tsx`

- [ ] `'use client'`. Built on `<MultiStepComposer>`. `dialogLabel="Add a service"`.
- [ ] Steps:
  1. **Details** — title (required), description (required).
  2. **Pricing** — rate-model select (`hourly`/`flat`/`quote`/`membership`), a "Free" toggle, and a rate input (dollars). Rate input hidden when Free or when model is `quote`. Free → `rateCents: null`; quote → `rateCents: null`; else `rateCents = dollarsToCents`.
  3. **Service area** — center Location picker (reuse the AddEntityDrawer inline-add pattern from ProductComposer's PickupLocationStep) + a radius input (miles). Required: a center Location and a positive radius. finalLabel "Publish service".
- [ ] **No "Where is this made?" step** — services are excluded from the Locally Made provenance flow (F040 § No Locally Made step).
- [ ] `onComplete` converts miles→meters (×1609.34), calls `createServiceAction`, returns `{ destinationUrl }`; caller redirects.

### `/you/sell` wiring

- [ ] Add a `service` entry to the `COMPOSERS` array in `src/app/you/sell/page.tsx` rendering `<AddServiceButton>` (the one-line array change T080 set up). Keep the product entry untouched.
- [ ] `<AddServiceButton>` mirrors `<AddProductButton>`: `role=button`, accessible name `/Add a service/i`, opens `<ServiceComposer>` for that Group (passing groupId + anchorLocationId as the default center).

### Tests — `src/components/sell/ServiceComposer.test.tsx`

- [ ] Renders step-1 title/description; blocks Continue on empty.
- [ ] Pricing step: Free toggle hides the rate input; quote model hides the rate input.
- [ ] Service-area step: requires a center Location + radius; reaches publish.
- [ ] `createService` argument shape: rateModel, rateCents (null when free), centerLocationId, radiusMeters (miles converted) — asserted via a mocked action spy.
- [ ] No `made` step rendered.

### BUILD-LOG

- [ ] BUILD-LOG T082 line.

## Notes

- **Anchor Location doubles as the service-area center** at b1 (DEVIATION): the scenario allows a pure area-only service with no anchor, but a center point is required to generate the circle. We require one center Location, which is also written as the `item_locations` anchor. Pure area-only (no anchor) deferred.
- Photo / richer fields out of scope (F040 § Out of Scope).
