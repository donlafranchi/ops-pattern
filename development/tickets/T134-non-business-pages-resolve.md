# T134: A non-business Page resolves everywhere it's looked up

**Scenario:** F060 — someone starts something without opening a shop
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`), track A
**Depends on:** none (independent of T132/T133 — these are read paths, not the authorization clause)

**Serves:**
- **Loop:** 1 (Gather), 7 (Make and be found) — a run club that cannot be linked to cannot be shared, and link-sharing is the platform's distribution channel.
- **Canonical example:** P1, and the run-club case it does not cover.
- **Primitive shape:** Person → Group (any kind) → public page. No new entity, no new table.

**Spec contract:** scenario § "What actually blocks this today," branches 2 and 3; scenario acceptance criterion "A non-business Page is a real page."

**The pattern already shipped, to copy exactly:** `src/lib/items/resolve-gathering.ts:206-213` — `const groupName = row.brand_label ?? scope.groupName; if (!groupName) return null`. `brand_label` is denormalized from `group_businesses.display_name` and is null for every non-business Group; falling back to the Group's own `name` is what unblocked gatherings. Every file below has the identical bug the gathering resolver used to have.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — only if a rendered page's structure changes when the business-specific fields are absent (e.g. a heading level shifts). Skip if the fix is purely data-layer.
- [ ] **M4** — no migration.
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation** at close.

## Acceptance Criteria

**`src/lib/groups/resolve-shop.ts`** (the Group's own public page — comment currently says `Resolves a kind='business' Group ("Shop")`):
- [ ] Line 110's `.eq('kind', 'business')` is removed from the Group lookup.
- [ ] `displayName` falls back to `groups.name` when no `group_businesses` row exists (currently derived only from the business row — verify exact field name at build time).
- [ ] Business-specific rendered fields (badge, owner claim) stay optional as they already are — no new required field for a non-business Page.
- [ ] A published non-business Group's public page renders (name, description, image, tagline, items filed under it) instead of 404ing.

**`src/lib/items/resolve-product.ts`** and **`src/lib/items/resolve-service.ts`**:
- [ ] Each file's `.eq('kind', 'business')` (product: line 123; service: line 106) on the owning-Group lookup is removed.
- [ ] Each adopts the `brand_label ?? scope.groupName` fallback for attribution, matching `resolve-gathering.ts`.
- [ ] A product (or service) filed under a non-business Group resolves at its public address instead of 404ing.

**`src/lib/locations/resolve-venue-items.ts`** (`resolveOwningGroup`, lines 24–40 — the venue/Location page's lookup of the Group that owns items hosted there):
- [ ] The `.select('id')` at line 30 becomes `.select('id, name')` (or equivalent) — today only `id` is fetched, so any caller needing a display name has nothing but a business-derived label to fall back to, which is null for non-business Groups.
- [ ] The `.eq('kind', 'business')` at line 32 is removed — a venue whose hosted items are filed under a non-business Group (e.g. items a run club posts) currently cannot resolve an owning Group at all.
- [ ] Existing shipped vendor-card rendering on venue pages (`033_venue_item_sections.sql`, `venue_hosted_items()`) is unchanged in what it renders — this ticket fixes the Group lookup underneath it, it does not add or remove vendor cards. **Do not touch `venue_hosted_items()` or the section rendering — out of scope for this ticket and for this bundle.**

- [ ] Tests: each of the four resolvers, given a non-business owning Group, returns a page that renders with the Group's own name rather than 404ing or rendering blank.
- [ ] BUILD-LOG.md updated.

## Notes

**Four files, one bug shape, one fix pattern — do not invent a second fallback convention.** If any file's exact field/column names differ from what's written above, use what the codebase actually has; the acceptance criteria describe the behavior, not a literal diff.

**Out of scope:** the standing badge (paused per `review-F060.md` Amendments), any change to `group_businesses` itself, vendor-card rendering or removal on venue pages, the people index.
