---
id: how-t083-service-item-page
purpose: Public service Item page — resolve-service + ServicePublicPage + dispatch for /g/<group>/s/<item> in the /p catch-all + the /m/<handle>/s/<item> individual route.
layer: how
status: open
---

# T083 — Public service Item page

**Scenario:** [F040 — A producer lists a service](../../planning/now/scenario-F040-producer-lists-service.md)
**Binds to:** `product/systems/item.md` · ADR-20 (place-scoped URLs) · ADR-22 · CLAUDE.md § Naming conventions (`/s/[slug]` for services)
**Status:** Open
**Bundle:** b1 (b1.3 — Item composers)
**Depends on:** T081 (writes the rows) · T082 (composer builds the URL) · T079 (resolve-product split pattern) · T060 (place catch-all)
**Repo / branch:** web / `t-f040`

## Serves

- F040 Then-clauses: "Item URL follows place-scoped + random-suffix pattern"; "Item page shows brand + service area + pricing"; "No Locally Made step on services".

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (new public page — MANDATORY).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Resolver — `src/lib/items/resolve-service.ts`

- [ ] `splitServiceSlug(segments)` — like `splitItemSlug` but the inner marker is `s`: matches `…/g/<group>/s/<item>` → `{ placeSegments, groupSlug, itemSlug }`; null otherwise.
- [ ] `resolveService(supabase, { groupSlug?, handle?, itemSlug })` → resolves the published `items` row (kind='service', state='published', deleted_at null) by id-fragment match, joining `item_services` (rate_model, rate_cents, service_area_geography presence), the owner Member, the Group brand_label, and the optional anchor `item_locations`→`locations` label. Returns null → 404. RLS is the gate. Reuse `parseIdFragment` (re-export or import from resolve-product).
- [ ] Returns `{ itemId, title, description, rateModel, rateCents, hasServiceArea, areaLabel, brandLabel, owner:{handle,displayName}, anchor:{label}|null }`.

### Dispatch — `src/app/p/[...slug]/page.tsx`

- [ ] Add a `splitServiceSlug` check (before the Group split, alongside the existing product split): when it matches, `resolveService` → `<ServicePublicPage>`; null → `notFound()`. `generateMetadata` mirrors the product branch.

### Individual path — `src/app/m/[handle]/s/[slug]/page.tsx`

- [ ] New route. Resolves a service sold as individual by `handle` + `itemSlug`; renders `<ServicePublicPage groupHref={null}>`; null → `notFound()`.

### `<ServicePublicPage>` — `src/components/item/ServicePublicPage.tsx`

- [ ] Renders title, description, rate (formatted by model: hourly `$X / hr`, flat `$X`, membership `$X / mo`, quote `Request a quote`, null non-quote `Free`), a service-area section (static text at b1 — "Serves a local area" when `hasServiceArea`), brand resolve-up (links Group when filed), owner link to `/m/<handle>`.
- [ ] **No Locally Made badge slot** — services are excluded by kind.
- [ ] `data-testid` on title, rate, brand-link/brand, owner-link, service-area.

### Tests

- [ ] `src/lib/items/resolve-service.test.ts` — `splitServiceSlug` returns the split for `…/g/<g>/s/<i>`, null for product `/p/` paths and bare group; `resolveService` maps a mocked row (free, quote, hourly variants; group vs individual).
- [ ] `src/components/item/ServicePublicPage.test.tsx` — renders each rate-model format; service-area section present when `hasServiceArea`; brand link vs plain; owner link.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG T083 line. STAGE-LEDGER F040 row → `eval` after merge.

## Notes

- **Service-area map circle deferred to a static representation at b1** (DEVIATION): the resolver reports `hasServiceArea` (geography non-null); rendering the actual Mapbox circle is deferred, mirroring the product page's static pickup marker. The geography's load-bearing job (feed-area intersection) is exercised by the F040 eval against live DB.
- Item slug id-fragment addressing (no `slug` column on `items`) — same as T079.
