# T129: One browse surface at `/`

**Scenario:** `planning/next/scenario-F059-newcomer-browses-one-surface.md`
**Status:** Open
**Bundle:** b1 (SocialUs v1), workstream 4
**Depends on:** T127, T128

**Serves:**
- **Loop:** 3 (Land here) — the loop's surface is "a no-login locality view organized around what's happening near me." Two tabs rendering the same catalog taught the Member the app repeats itself; this makes the locality view the front door rather than one of two.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → `discoverable_items` (via `metro_feed_items`) → browse. Read-only; no Item ownership changes, no shell entity.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — **required.** An existing component set lands on a route that did not previously render it, and receives a new data shape. Per `playbooks/process-checklists.md` § 4, "no new component" is not a valid N/A here.
- [ ] **M4** — no migration in this ticket; M4 rides on T127/T128 in the merge to main.
- [ ] **DEVIATIONS.md entry** at close — **must include the design-language principle 9 deviation named below.**
- [ ] **Close-out reconciliation** at close.

## Acceptance Criteria

- [ ] `src/app/page.tsx` renders a server component that resolves auth, the Member's interest tags, and the active metro (via T128's `resolveFeedMetro`), reads the first page through `getMetroFeed`, and passes results + auth state + metro list to a client body
- [ ] New `src/components/browse/BrowseSurface.tsx` (client) holds the control state — query, kind, secondary filters, view — and renders `ExploreSearchBar`, `ActiveFilterChips`, `KindFilterPills`, `ListMapToggle`, `ExploreFilterSheet`, and the results grid
- [ ] `MakeThisYoursBanner` renders above the results for a signed-out visitor and is absent for a signed-in Member
- [ ] A signed-out visitor sees the full result set — no redirect, no sign-in wall, no truncation
- [ ] Kind refetches go through a server action so the metro and the Member's interest tags stay server-resolved; the previous page stays on screen until the next resolves (preserves T114's "instantly" criterion)
- [ ] The request-race guard (`requestRef` monotonic counter) survives the port — a slow earlier response never overwrites a newer one
- [ ] **The sort control is removed:** `SORT_OPTIONS`, `SortOrder`, `sortExploreItems`, the `sort` key on `SecondaryFilters`, its chip, its sheet section, and `?sort=` parsing all deleted. Filtering preserves server order
- [ ] **Distance is removed:** `DISTANCE_OPTIONS`, the `distance` key and chip, the great-circle helper (`toRad`, `distanceMiles`) and the distance branch of `applySecondaryFilters`; all of `src/lib/explore/origin.ts` and its test; `ExploreFilterSheet`'s `originAvailable` prop and every control it disabled
- [ ] `decodeEwkbPoint` and `src/lib/explore/ewkb.ts` are **retained** — the map path consumes them; only `origin.ts` goes
- [ ] `ScopePicker` options come from T128's `listFeedMetros`; selecting one navigates to `/?place=<metro-slug>` and the feed re-ranks around it, for signed-in Members as well as signed-out visitors
- [ ] Empty state: Explore's "Nothing here yet — try another filter" + Clear filters wins; the widen-locality CTA appears as a secondary line beneath it
- [ ] The no-resolvable-scope state (`data-testid="feed-no-place"`) still renders, with the controls suppressed
- [ ] Results container is a labelled `region` (not `tabpanel`) whose accessible name includes the active metro; `aria-controls` on both tablists points at it
- [ ] `EXPLORE_RESULTS_ID` renamed to `BROWSE_RESULTS_ID` with the id value `browse-results`; both consuming components updated
- [ ] The result-count `aria-live` announcement is debounced so a five-character search announces once on settle, not five times
- [ ] Switching metro announces the new scope in the same live region
- [ ] `TOGGLE_AFTER_CARDS` ported **unchanged at 4** — do not re-derive
- [ ] Desktop keeps a kind filter (the pill row is `md:hidden` today)
- [ ] Tests: signed-out sees banner + full results; signed-in sees no banner; filtering preserves order; no `sort` param is ever written; metro switch re-ranks for a signed-in Member; race guard drops a stale response
- [ ] BUILD-LOG.md updated

## Notes

**The port direction, so nobody rebuilds the wrong half.** The surviving *tab* is Home; the surviving *implementation* is Explore's. `ExplorePage` and `src/lib/explore/*` hold the filtering, URL state, MV read and map; Home contributes the ranking authority, the auth branch, and three small presentational pieces. This is Explore's code rendering under Home's name and Home's ranking — not a rewrite of either.

**Transfers with no rework:** `filters.ts` (minus distance and sort), `query.ts`, `items.ts`, `ewkb.ts`, `kinds.ts`, and the three presentational components. None reads page state.

**Why the sort control goes rather than moving server-side.** `nearest` died with distance. The three survivors — newest, soonest, most responses — each discard local-first, which is the one ordering the platform has committed to, and all three re-order a fetched page client-side, which would contest the server ranking the merge just picked. The schedule filter already does the job "starting soonest" was doing for events. Reversible: `?sort=` can return in v2 as a server-side outer key without re-opening the merge. Confirms `decision-surfaces.md` § Open questions 15.

**Filtering stays client-side, deliberately, with a recorded ceiling.** Category, schedule and free text still refine a fetched page (`EXPLORE_LIMIT = 100`). At v1 inventory the page *is* the corpus, so this is correct rather than merely tolerable. **Record the ceiling in DEVIATIONS:** when a metro's published Item count approaches the page limit, filtering has to move server-side, because at that point "the first 100" stops being "everything" and starts being "the 100 highest-ranked" — and filtering to a rare category would search the rows least likely to contain it.

**The known design deviation — log it, do not launder it.** `ExploreSearchBar` is `sticky top-0`. `product/ui/design-language.md` principle 9: *"All primary controls anchor to the bottom of the viewport… No top-anchored toolbars or search fields."* Porting it to `/` moves that violation onto the landing surface. It is **accepted for one release** — the follow-on chrome scenario is the remedy and rebuilding chrome twice costs more — but it gets an explicit DEVIATIONS entry naming principle 9. An accepted deviation and an unnoticed one look identical in git and completely different in an audit.

**Screenshot at 375×812 into the Completion section** (checklist 4), and one line in DEVIATIONS about appearance. "No appearance change" is only valid if the screenshot says so.

**Gate B — encodes ratified absolutes:**
- `product/ui/community-platform.md` § T1 — browse without authentication: no redirect, no signup wall, no gated or truncated result set (Ratified 2026-09-04).
- `product/ui/community-platform.md` § T1 — locality + recency + declared-tag boost; no behavioural ranking (Ratified 2026-09-04).
- `planning/backlog/decision-surfaces.md` § Distance is out — nothing measures or displays miles (Ratified 2026-09-03).
- `planning/backlog/decision-surfaces.md` § The two-tab model — Home absorbs Explore entirely (Ratified 2026-09-03).
- **Not owed a tag:** `design-language.md` principle 9 carries no State tag, and `decision-durability-register.md` § 6 already classifies all nine DLS principles as bets rather than commitments. No ratification is outstanding; the deviation above is a bet knowingly not taken this release.
