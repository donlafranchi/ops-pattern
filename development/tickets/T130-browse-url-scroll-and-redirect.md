# T130: The browse surface keeps its URL, its scroll, and its old address

**Scenario:** `planning/next/scenario-F059-newcomer-browses-one-surface.md`
**Status:** Open
**Bundle:** b1 (SocialUs v1), workstream 4
**Depends on:** T129

**Serves:**
- **Loop:** 3 (Land here) — the loop's surface is "a clean URL the organizer can text to a friend." A browse link that erases its own scope the moment it loads is not a shareable address, and a back button that loses the Member's place is the friction the locality view exists to remove.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → `discoverable_items` → browse. Navigation and URL state only; no data changes.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — required. Focus management on metro switch and back-navigation restore are accessibility behaviour, not just navigation behaviour.
- [ ] **M4** — no migration.
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation** at close.

## Acceptance Criteria

- [ ] `exploreQueryString` (renamed `browseQueryString`, `src/lib/explore/query.ts` → `src/lib/browse/query.ts`) **mutates a copy of the current `URLSearchParams`** rather than constructing a fresh one: it sets or deletes only the keys it owns and leaves every other key untouched
- [ ] A load of `/?place=midtown&kind=gathering` still carries `place=midtown` after the filter effect writes the URL back
- [ ] A load carrying an unrecognized parameter (e.g. `?utm_source=x`) still carries it after the same write
- [ ] `router.replace` targets `/`, never `/explore`
- [ ] `useScrollRestoration` is keyed on a value that includes the active metro (e.g. `browse:<metro-slug>`)
- [ ] `useScrollRestoration` **resets its `restored` guard when the key changes**, so a key change restores that key's position rather than restoring nothing
- [ ] Switching metro lands at the top of the new results, not at the previous metro's scroll depth
- [ ] Back-navigation from an Item restores scroll, metro and filters together
- [ ] `src/app/explore/page.tsx` is replaced by a **query-preserving** redirect to `/`; `/explore?kind=gathering&schedule=weekend` lands on `/?kind=gathering&schedule=weekend`
- [ ] `/explore` with no query redirects to `/` with no query
- [ ] Internal links repointed: `src/app/you/page.tsx`, `src/components/follows/FollowingManager.tsx` (and its test expectation)
- [ ] `src/components/HomeFeed.tsx` **deleted** — it has no importers and links to `/explore`
- [ ] `src/components/ExplorePage.tsx` and `src/app/explore/page.tsx`'s old body deleted; their tests removed or migrated to the new surface
- [ ] Tests: unknown-param preservation; `place` survives the first filter write; scroll key includes metro; guard resets on key change; redirect preserves query; redirect handles the empty-query case
- [ ] BUILD-LOG.md updated

## Notes

**Three separate defects, one ticket, because they are all "the surface loses state it should have kept."**

**1 — The serializer erases what it does not know.** `exploreQueryString` builds a fresh `URLSearchParams` from six known keys and `router.replace`s the result. On `/explore` the unknown-key set was empty, so this was invisible. On `/` it is `?place=` — the switcher's entire state. **Fix by construction, not by extending the known-keys list.** Adding `place` to the list fixes today's case and leaves the identical trap armed for the next parameter anyone adds.

**2 — Scroll restoration is keyed to a literal string and never re-arms.** `useScrollRestoration('explore', …)` uses one key for every scope, and `restored` is a `useRef(false)` that is never reset, so restoration fires at most once per mount regardless of the key. Both halves need fixing: keying alone converts "restores the wrong position" into "never restores at all." Test the switch path specifically — it is the case that has never existed before, because the shipped surface has restoration and no switcher.

**3 — The old address.** SEO cost is nil (no sitemap, no `robots.ts`, no route metadata on `/explore` — verified), so this is purely about not breaking live links. Internal links exist and members may have bookmarked filtered views. A bare `redirect('/')` silently discards their filters.

**Sequenced after T129 rather than with it** so the port can be reviewed as a port. Mixing a surface rewrite with three state-management fixes produces a diff where a regression in either is hard to attribute.

**Gate B — encodes ratified absolutes:** none beyond those already captured on T129. This ticket is navigation and state plumbing; it encodes no new refusal.
