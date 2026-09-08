# T124: Service and gathering composers get the same photo field

**Scenario:** `planning/backlog/scenario-F055-producer-puts-a-photo-on-what-they-sell.md` — **DEFERRED with its scenario.**
**Status:** **DEFERRED 2026-09-07.** Not open, not blocked — held by PM ruling.

> **Deferred with its scenario.** Pages get photos now, Items get photos later. The scenario returned to `planning/backlog/`, so this ticket points outside the approved lanes **by design** — the gate check reports it as a deferred pair, not as a firewall breach. **Do not start.**
>
> **The substrate this depended on is no longer blocked** — T120 re-bound to F061 and is buildable. When this resumes, the bucket (renamed `media`), the upload module, the metadata strip and the picker recipe all already exist, and what remains is a composer field.
**Bundle:** b1 (v1 workstream 10)
**Depends on:** T121

**Serves:**
- **Loop:** 7 (Buy close) and 4 (Gather regularly) — a gathering with a photograph of the place is a different invitation from a line of text.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Item(kind='service' | 'gathering') with one image on `items.photo_url`.

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/next/review-F055-F058-self-serve-producer.md`.
- [ ] **Gate B — ⛔ NOT CLEAR** via T120's A1.
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec last-changed date.** `product/systems/item.md` — `Thu Sep 3 17:13:47 2026 -0700`.
- [x] **Governing DLS recipe named.** The image-picker recipe landed for T121. **No new component.**

## What changes

Two files. `ServiceComposer`'s `details` step and `GatheringComposer`'s `details` step each gain the same `ImagePickerField`, and their server actions pass the URL to `item.create`.

**This ticket is small on purpose.** It is the cheapest ticket in the set — the same component, the same handler input, the same column — and it triples the surface area of the feature. It is listed separately so it can be dropped without dropping T121 if the month runs out.

## Acceptance Criteria

- [ ] `ServiceComposer` `details` step renders `ImagePickerField`. Field is optional. Step count unchanged (four).
- [ ] `GatheringComposer` `details` step renders `ImagePickerField`. Field is optional. Step count unchanged (four).
- [ ] Both server actions pass the URL into `item.create` → `items.photo_url`. **No per-kind child column is touched** — `item_services` and `item_gatherings` have no photo column and must not gain one; the spine column is exactly the general slot migration `036` created for this.
- [ ] Both public pages (`ServicePublicPage`, `GatheringPublicPage`) render the hero image when present, with `alt` = the Item title.
- [ ] Both kinds' cards render the photo in the feed.
- [ ] Composer tests assert the field is present and optional in both.
- [ ] Screenshot at 375×812 of a gathering card with a photo.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **Gate B** — blocks the start.
- [ ] **Checklist 4** — fires. All five items.
- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3 `design:accessibility-review`** — fires. **Existing component on surfaces that did not previously render it** — the exact clause that makes "no new component" an invalid N/A.
- [ ] **M4** — does not fire. No migration, no schema change. Stated, not waived.
- [ ] **DEVIATIONS entry.**
- [ ] **Close-out reconciliation.**

## Notes

Resist adding a photo to the four withheld kinds. `item.create`'s Zod enum rejects `wonder` / `offer` / `ask` / `initiative` and they have no composer; adding a field for them would be building surface for kinds v1 deliberately does not ship.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
