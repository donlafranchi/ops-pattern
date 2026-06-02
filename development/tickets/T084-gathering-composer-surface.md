---
id: how-t081-gathering-composer-surface
purpose: Gathering composer surface — <GatheringComposer> on MultiStepComposer + createGatheringAction wrapping item.create(kind='gathering') + /you/sell "Add a gathering" button.
layer: how
status: open
---

# T084 — Gathering composer surface (`<GatheringComposer>` + server action + /you/sell wiring)

**Scenario:** [F034 — A member hosts a recurring gathering](../../planning/now/scenario-F034-member-hosts-recurring-gathering.md)
**Binds to:** `product/ui/design-language.md` § Component recipes → Multi-step composer · F034 § Surfaces
**Status:** Open
**Bundle:** b1 (b1.3 — Item composers)
**Depends on:** T080 (item.create gathering arm) · T071 (MultiStepComposer) · T078 (product composer pattern)
**Repo / branch:** web / `t-f034`

## Serves

- F034 Then-clauses: "Composer asks what kind in user language"; "Recurring gathering writes Item + child + events in one transaction".
- **Loop:** 1 (Find your people), 4 (Gather regularly).

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (new composer surface).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### `item.create` gathering arm — `src/actions/item/create.ts`

- [ ] Add `whatToBring?` (string) to `itemCreateInput`; include it in the `item_gatherings` insert. (F034 owns the gathering arm per the T080 generalization comment.)

### Server action — `src/app/you/sell/gathering/actions.ts`

- [ ] `'use server'`. `createGatheringAction({ groupId?, title, description, gatheringKind, startsAt?, recurrenceRule?, capacity?, costCents?, whatToBring?, locationId? })` resolves the auth user (`requireMemberId`), builds an ActionContext, calls `item.create` with `kind:'gathering'`, `publish:true`, maps `gatheringKind → scheduleKind` (one_time→one_time / recurring→recurring / open_meetup→ongoing), returns `{ itemId, destinationUrl }`.
- [ ] `destinationUrl`: filed under a Group → `/p/[…place]/g/[group-slug]/e/[item-slug]` (mirror product `/p/` action, `/e/` resource segment); individual → `/m/[handle]/e/[item-slug]`. Slug = `toSlug(title)` + `-` + first 8 chars of item id.
- [ ] Map `ActionError → GatheringActionError`.

### `<GatheringComposer>` — `src/components/sell/GatheringComposer.tsx`

- [ ] `'use client'`. Built on `<MultiStepComposer>`. `dialogLabel="Host a gathering"`.
- [ ] Steps:
  1. **Kind** — three options: one-time event / recurring gathering / open meetup (NOT a four-kind picker). Required.
  2. **Details** — title (required), description (required).
  3. **Schedule** — for one-time/recurring: day + time required, must be in the future; recurring shows derived "Repeats every <weekday>". Open meetup: no fixed time. Optional capacity, optional cost (blank = free), optional what-to-bring.
  4. **Review** — finalLabel "Publish gathering" → `createGathering` → redirect.
- [ ] Location pre-attached from a prop (the venue/anchor); no picker step at b1.

### `/you/sell` wiring

- [ ] `<AddGatheringButton>` appended to the `COMPOSERS` array in `src/app/you/sell/page.tsx`. Accessible name `/Host a gathering/i`.

### Tests — `src/components/sell/GatheringComposer.test.tsx`

- [ ] Step 1 renders the three kind options; Continue blocked until one is picked.
- [ ] Recurring path: schedule step derives the weekly recurrence; past date blocks Continue.
- [ ] Submit shape: `createGathering` called with kind, derived recurrenceRule, startsAt, locationId; cost blank → costCents null.

### BUILD-LOG

- [ ] BUILD-LOG T084 line.

## Notes

- Mirror `ProductComposer` / `AddProductButton`. Photo upload + hashtag UI out of scope (F034 § Out of Scope).
- Venue (`/l/<location>/e/`) entry is F033 territory — at b1 the composer is reached from the `/you/sell` shop row and files under the Group (or Member when no anchor). Log the venue-URL deferral in DEVIATIONS.

## Completion

(filled at close)
