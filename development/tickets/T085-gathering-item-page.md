---
id: how-t082-gathering-item-page
purpose: Public gathering Item page — resolveGathering + <GatheringPublicPage> (next-occurrence + recurrence + Share-link) + /e/ dispatch in the /p catch-all + /m/[handle]/e/[slug] route.
layer: how
status: open
---

# T085 — Public gathering Item page

**Scenario:** [F034 — A member hosts a recurring gathering](../../planning/now/scenario-F034-member-hosts-recurring-gathering.md)
**Binds to:** `product/systems/item.md` · place-scoped URLs · CLAUDE.md § Naming conventions (`/e/` Item URL column)
**Status:** Open
**Bundle:** b1 (b1.3 — Item composers)
**Depends on:** T080 (handler writes the rows) · T079 (product-page dispatch pattern) · T060 (place catch-all)
**Repo / branch:** web / `t-f034`

## Serves

- F034 Then-clauses: "Item URL follows place-scoped + random-suffix pattern"; "Item page shows next occurrence + Share-link".

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (new public page).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Resolver — `src/lib/items/resolve-gathering.ts`

- [ ] `splitGatheringSlug(segments)` — like `splitItemSlug` but the inner marker is `e`: matches `…/g/<group>/e/<item>`, null otherwise.
- [ ] `describeRecurrence(rrule)` — `FREQ=WEEKLY;BYDAY=TH` → "Every Thursday"; null → null.
- [ ] `nextOccurrence(startsAt, rrule, now)` — non-recurring → startsAt; weekly recurring with a past start → the next future weekly occurrence.
- [ ] `resolveGathering(supabase, { groupSlug?, handle?, itemSlug })` → published kind='gathering' row joined to `item_gatherings` + owner + brand + location label. Returns `{ itemId, title, description, startsAt, recurrenceRule, capacity, costCents, whatToBring, brandLabel, owner, location }`.

### Dispatch — `src/app/p/[...slug]/page.tsx`

- [ ] `splitGatheringSlug` checked alongside the product split (before the Group split); render `<GatheringPublicPage>` on match; null → `notFound()`. `generateMetadata` covers it.

### Individual path — `src/app/m/[handle]/e/[slug]/page.tsx`

- [ ] New route. Resolves a gathering hosted by a Member (no group) → `<GatheringPublicPage>`.

### `<GatheringPublicPage>` — `src/components/item/GatheringPublicPage.tsx`

- [ ] Renders title, description, next-occurrence as a human date, recurrence in human terms, location with a map-pin, cost (or "Free"), capacity + what-to-bring when present, owner link to `/m/<handle>`, and a `<ShareLinkButton>` (copies the canonical URL / native share).

### Tests

- [ ] `src/lib/items/resolve-gathering.test.ts` — split, describeRecurrence, nextOccurrence, resolveGathering row mapping.
- [ ] `src/components/item/GatheringPublicPage.test.tsx` — title/recurrence/cost/share-link; "Free" when costCents null.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG T085 line. STAGE-LEDGER F034 row.

## Notes

- id8-fragment addressing (no `slug` column on `items` at b1) — same as T079.

## Completion

(filled at close)
