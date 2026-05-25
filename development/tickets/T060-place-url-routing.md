# T060: Place-scoped URL routing skeleton (`/p/[...slug]`)

**Scenario:** substrate
**Status:** Open
**Bundle:** b1 (b1.x — Substrate sprint, Lane A wave 1)
**Depends on:** T058

**Serves:**
- **Spec:** [`product/systems/places.md`](../../product/systems/places.md) § T1 — MVP Tier (URL routing bullet) + § Open questions (place-name aliases deferred to T3).
- **ADRs:** [ADR-0020](../../planning/adrs/ADR-0020-locality-scoped-urls.md) § *URL hierarchy*.
- **Sprint:** [`planning/bundles/b1x-substrate-sprint.md`](../../planning/bundles/b1x-substrate-sprint.md) § A3.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — the landing page is a new public surface.
- [ ] **DEVIATIONS.md entry** appended at close.

## Acceptance Criteria

- [ ] New module `web/src/lib/places/resolve-path.ts` exporting `resolvePlacePath(segments: string[]): Promise<{ place: PlaceRow; ancestors: PlaceRow[] } | null>`. Walks segments outermost-to-innermost: the first segment matches a row with `parent_id IS NULL` (or the seeded California root), each subsequent segment matches `(parent_id = previous.id, slug = segment)`. Returns null on any miss.
  _Why: ADR-20 § URL hierarchy — the path *is* the hierarchy walk. Doing the walk in app code (not a recursive SQL CTE) keeps the query plan predictable and the cache layer trivial; depth is bounded (≤5 levels per the kind enum)._
- [ ] New route `web/src/app/p/[...slug]/page.tsx` — catch-all route. Calls `resolvePlacePath(params.slug)`. On hit: renders a placeholder place landing page (`<h1>{place.display_name}</h1>` + breadcrumb of ancestors, all wired to their canonical paths). On miss: calls `notFound()`.
  _Why: the b1.x sprint ships the *routing skeleton*, not the curated landing page (places.md § T2). The placeholder is enough to prove resolution + 404 behavior; the rich landing is a b2 surface._
- [ ] Breadcrumb component `web/src/components/place-breadcrumb.tsx` — renders ancestor chain. Pure server component; no client JS. ARIA `nav[aria-label="Breadcrumb"]` + ordered list per WCAG 2.1.
- [ ] Redirect middleware is **out of scope** — the `*_url_history` tables are deferred (places.md § Slug-uniqueness rewrites + sprint doc § Scope boundary). Stub a TODO comment in `resolve-path.ts` citing `places.md § URL-history` so the next sprint knows where to hang it.
- [ ] Playwright eval: `web/evals/phase-1/place-routing.spec.ts` — (a) GET `/p/california/sacramento-roseville/sacramento/oak-park` → 200 with `<h1>Oak Park</h1>`; (b) GET `/p/california/sacramento` → 200 with `<h1>Sacramento</h1>` (depth-skip allowed because no MSA in between is required for resolution if the slugs chain); (c) GET `/p/california/sacramento-roseville/sacramento/oak-park` → breadcrumb has 4 links in order; (d) GET `/p/not-a-real-place` → 404; (e) GET `/p/california/sacramento/oak-park-illinois` → 404 (because `oak-park-illinois` is not a child of Sacramento — proves parent-scoped slug uniqueness at the URL level).
- [ ] Vitest: `tests/places-resolve-path.test.ts` — unit-level resolve with mocked DB rows.
- [ ] `npm run check:action-layer && npm run lint && npm test` green and `npm run eval -- --grep "place-routing"` green.
- [ ] `BUILD-LOG.md` updated.

## Notes

- The eval at (b) above tests "depth-skip" — Sacramento can be addressed as `/p/california/sacramento` (skipping MSA) **if** the seed inserts Sacramento with `parent_id = California` directly. The sprint's seeded row chain is California → MSA → Sacramento; the eval must reflect that. **Correct path for the seeded chain: `/p/california/sacramento-roseville/sacramento`.** Update the test if T058 ships the MSA in the chain.
- The catch-all route `/p/[...slug]` collides with no existing route (verified: existing `/p/` would only exist after this ticket).
- Outer `/p/` (place) vs inner `/p/` (product, future) is positionally unambiguous per `CLAUDE.md` § Naming conventions footnote — no special handling required here.
- The page should set `<title>` and `<meta name="description">` for crawler visibility. Default `<title>` = `{place.display_name} — {root ancestor display name}` (e.g., "Oak Park — California"). No JSON-LD at this ticket (deferred to T2 landing).

## Completion

Date:
Commit:
