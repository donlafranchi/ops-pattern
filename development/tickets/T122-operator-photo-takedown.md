# T122: The operator can remove a photo

**Scenario:** `planning/next/scenario-F058-a-member-reports-an-image-and-the-operator-takes-it-down.md` — the takedown half.
**Status:** Open — **BLOCKED, Gate B. Not buildable.**
**Bundle:** b1 (v1 workstreams 9 + 10)
**Depends on:** T120
**Blocks:** the production deploy of T121. See T121 § Release gate.

**Serves:**
- **Loop:** 11 (Steward what we built) — a place where something wrong can be made right is part of what makes a place liveable.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) — the ordinary browsing member is who encounters this.
- **Primitive shape:** Person (operator) → Item, clearing one column. **No new entity.**

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/next/review-F055-F058-self-serve-producer.md`. PROCEED on F058.
- [ ] **Gate B — ⛔ NOT CLEAR.** This ticket **is** the code encoding of **A2**:
  > *"The platform never serves an image it cannot take down. A takedown path exists before the first upload is accepted."*
  `decision-photo-upload.md` § 4, `Intent (NEEDS WEIGH)`. Route to `weigh`. Same deliberate-deviation record as T120.
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec last-changed dates.** `product/systems/action-layer.md` — `Sun Jun 21 18:27:51 2026 -0700`. `product/systems/item.md` — `Thu Sep 3 17:13:47 2026 -0700`.
- [x] **Governing DLS recipe named.** `design-language.md` § *Button* (destructive variant) + the existing confirm pattern. **No new component.** The ⋯ menu ships in T123 with the report affordance; this ticket renders a single inline control on the Item page for the operator only.

## What changes

One action handler, one registry line, one conditional control.

`item.remove_photo` — clears `items.photo_url`, deletes the storage object, emits `item.photo_removed` in the same transaction, refreshes `discoverable_items`. Rendered on the Item page **for the operator only.**

## Acceptance Criteria

- [ ] `src/actions/item/remove-photo.ts` following the shape of `src/actions/item/publish.ts`: Zod input `{ itemId, actingMemberId }`, `withTransaction`, `appendEvent`.
- [ ] Registered as `'item.remove_photo'` in `src/actions/index.ts`.
- [ ] Nulls `items.photo_url`. **Also clears `item_products.photo_urls`** if populated — a takedown that leaves the image reachable through the fallback path is not a takedown, and `discoverable_items` coalesces `photo_url` then `photo_urls[1]`.
- [ ] Deletes the storage object via T120's `deleteImage`.
- [ ] Emits an `item_events` row, `event_kind = 'item.photo_removed'`, **in the same transaction**, with `acting_member_id` set to the operator. *(`bundle-1.md` § Non-negotiable data-model commitments — binding on every write, and a moderation action is exactly the kind that has to be reconstructable later.)*
- [ ] `discoverable_items` refreshes so the card reverts to the kind glyph. **Verify the refresh actually fires for this event kind** — the trigger is on `item_events` and may be scoped to specific kinds. Extend it if so.
- [ ] **Authorization is in the handler, not the UI.** A non-operator calling it — including the Item's own owner — gets an `AuthorizationError`. Absence of a button is not authorization.
- [ ] **Operator identity is resolved and written down.** There is no operator role today; there is a seeded System Member for platform-emitted events. **A single env-configured operator member id is an acceptable v1 answer if the ticket records it as one.** Do not invent a roles table.
- [ ] The control renders on the Item detail page for the operator only, is a destructive-variant button, and **requires confirmation** — it appears on every Item the operator browses.
- [ ] The Item is otherwise untouched: still published, still listed, title/price/description unchanged. **The proportionate action for the common case is removing the picture, not the listing.**
- [ ] Tests: handler happy path; non-operator rejected; owner rejected; object deleted; event row written; MV reflects the change; `photo_urls` also cleared.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **Gate B** — blocks the start.
- [ ] **Checklist 4** — fires (`src/app/…` Item page changes). All five items.
- [ ] **M2 `engineering:code-review`** before commit. **Ask it specifically about the authorization check** — this is the project's first operator-privileged write and it sets the pattern for every later one.
- [ ] **M3 `design:accessibility-review`** — fires. New control, destructive, with a confirm.
- [ ] **M4 `engineering:deploy-checklist`** — fires if the MV trigger changes.
- [ ] **DEVIATIONS entry**, naming how operator identity was resolved and that it is a v1 shortcut.
- [ ] **Close-out reconciliation.**

## Notes

- **Removal is not editing.** This handler nulls one column under operator authority. It is not a general `item.update` and must not grow into one — producer-side photo editing is explicitly out of v1 (`F055` § Out of Scope), and the MV-refresh constraint is the reason.
- Removing a **shop** image (`group_businesses.image_url`) is the same handler shape and is deliberately deferred (`F058` § Out of Scope). Add it if T126 lands first and time allows.
- The escalation ladder — a producer who re-uploads the same image — does not exist and is not v1. Record it as a known limit.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
