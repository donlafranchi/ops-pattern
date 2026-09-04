---
purpose: Architecture + design + accessibility review of F059, the Home/Explore merge. Verdict and the conditions on it.
layer: how
status: next
---

# F059 review — A newcomer browses one surface instead of two

**Scenario:** [`scenario-F059-newcomer-browses-one-surface.md`](./scenario-F059-newcomer-browses-one-surface.md)
**Reviewer:** `review`
**Date:** 2026-09-04
**Bundle:** b1 (SocialUs v1), workstream 4
**Verdict:** **REVISE** — architecture PROCEEDs with two named substrate conditions; design REVISEs on one clause. The more severe governs.

## Verdict summary

The merge fits the systems: no new table, no new event type, no RLS change, and the surviving Explore modules are genuinely surface-agnostic. Two architecture conditions attach — the metro vantage point is a hard dependency rather than a neighbour, and `locality_feed_items` needs a projection widened before Explore's controls can run against it at all.

The design check is where this stops. The scenario says the merged surface carries **"the shipped Explore chrome, unchanged in appearance."** That single clause ports a live violation of `design-language.md` principle 9 onto the platform's landing surface, and it is the clause that most needs changing before tickets open.

**Next skill:** `scope` for the one-clause revision, then `ticket`. The revision is small and named exactly below; it does not require a new cycle of scenario thinking.

---

## Architecture check

### Systems touched

- **`product/systems/discovery.md`** — the community-awareness feed. The merge changes *where* the feed renders and *what grain* it is scoped at; it does not change candidate generation.
- **`product/systems/location.md`** — the place hierarchy and the metro overlay. The vantage-point change is the whole of the architectural risk here.
- **`product/ui/community-platform.md`** — the T1 Home and T1 Explore specs, both of which describe surfaces that stop existing separately.
- **`product/systems/item.md`** — read-only, via `discoverable_items`. Untouched.

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | **none** | `metro_polygons` already exists (migration `031`) with geography, centroid, and a GiST index. This is the good news in an otherwise expensive dependency. |
| New columns required? | **none** | Every column the merged surface needs is already on `discoverable_items` — `description`, `starts_at`, `nearest_location_geography`, `photo_url`. |
| New functions required? | **two** | (1) `locality_feed_items` projection widened by three columns plus an optional kind predicate; (2) a metro-grain feed read. See conditions below. |
| New event types? | **none** | Pure read path. No writes, no `acting_member_id`, no same-transaction invariant to honour. |
| RLS impact | **none** | `discoverable_items` is the visibility gate and is already granted to `anon` + `authenticated`. The merge adds no new read surface. |
| Forward-tier impact | **clear, with one caution** | Removing `?sort=` is reversible; re-adding it as a server-side outer key in v2 is strictly easier than untangling the current two-authority arrangement. **Caution:** deleting `origin.ts` also deletes `decodeEwkbPoint`'s only production consumer outside the map. Confirm the map path keeps it before the delete lands. |
| Shell-entity smell | **clean** | No `*_id` pointing at a non-Person/non-Group entity. `metro_polygons` is reference geography, not an owner of Items. |
| Loop fidelity | **matched** | Loop 3's stated pain point is *"a person has just moved to a neighborhood and lost their network… wants to know what's happening within walking distance this week, that they could just show up to,"* and the surface it names is *"a no-login locality view."* The merge makes that view the app's front door instead of one of two front doors, and the ratified anonymous-browse commitment is what keeps the "no-login" half literally true. |
| Policy posture present | **n/a** | No data sharing, no monetary flow, no agent permission, no visibility change. The one privacy-adjacent element — anonymous browse — was ratified through `weigh` on 2026-09-04 and now carries a State-tagged Intent. |

### Condition A — the projection has to widen before anything else can be ported

`locality_feed_items` returns thirteen columns. Explore's controls need three it does not project:

| Control | Column it needs | In the RPC today? |
|---|---|---|
| Free-text search | `description` | no |
| Schedule filter (week / weekend) | `starts_at` | no |
| Map pins | `nearest_location_geography` | no |

So "adopt Home's ranking authority" is not a wiring change — **search, the schedule filter and the map are all dead on arrival until the function's `RETURNS TABLE` grows.** This is the single most under-estimated item in the merge, and it is a migration, which pulls M4 (`engineering:deploy-checklist`) onto the ticket that carries it.

Add the optional `p_kind` predicate in the same migration rather than a second one — kind already filters server-side on Explore's indexed path and would otherwise regress to client-side filtering, which is a real behaviour loss at any inventory density.

### Condition B — the metro vantage point is a dependency, not a neighbour

The scenario is right that this is expensive, and the sizing deserves to be explicit because it is the difference between a two-day merge and a week.

- `locality_feed_items(p_place_id …)` intersects **`places.geography`**.
- `places.kind` is constrained to `region / state / county / city / neighborhood` (migration `017`). **There is no metro value.**
- Metro is a separate overlay table with its own polygon (migration `031`), one approximate seeded Sacramento CSA (`seed_method='approx_bbox'`).

"Filter by metro" therefore means a **second function against a different table**, a resolution chain that terminates on a metro rather than a place, and a switcher fed from `metro_polygons`. None of that is a parameter change.

**Two rural holes, and the second one is not in the scenario.** `members.home_metro_id` is null outside every seeded CSA, and F031's radius answer to that is out of v1 with distance removed — the scenario names this. What it does not name: **`resolve_home_metro()` resolves from a Place centroid, and there is exactly one seeded metro.** A signed-out visitor with no place at all, or any Member outside Sacramento, has no metro. On a surface that filters by metro, "no metro" is a blank front door for everyone outside one CSA. The launch-default fallback (`the-good-place`) is a *place*, not a metro, so it does not fill this hole — it fills the old one.

**Recommendation:** the metro fallback chain is a decision, not an implementation detail, and it should be settled before the ticket rather than invented in it. The cheap answer is a designated default metro, seeded and named, that every unresolvable case lands on.

### Cross-system consistency

- `discovery.md` already ratified **metro as the default feed depth** (memo-0026, 2026-09-02). The merge is consistent with it and is in fact the first surface to honour it — the shipped feed resolves to neighborhood grain today.
- `location.md` § What does not ship at b1 defers address normalization and geocoding. Untouched: this scenario reads stored geography, it does not resolve addresses.
- `community-platform.md` § T1 Explore describes a surface that ceases to exist as a route. **It needs rewriting, not deleting** — its content is now the merged surface's spec. Flagged for `tidy`, not a blocker.

### Architecture verdict

**PROCEED**, conditional on A and B being ticketed as named substrate work rather than folded into the port. Folding them in is how a merge ticket becomes a fortnight.

---

## Design check

### Surfaces touched

- **`/`** — exists, gains the entire Explore control set.
- **`/explore`** — exists, becomes a redirect.
- **Bottom nav** — exists, loses a tab and gains a create affordance.

### The finding: the merge ports a DLS violation onto the front door

`design-language.md` principle 9, quoted in full because the conflict is verbatim:

> **Bottom-anchored, thumb-reachable.** All primary controls anchor to the bottom of the viewport. Search bar at the bottom expands upward on focus; detail cards slide up from below; nav (when present) sits at the bottom. **No top-anchored toolbars or search fields.**

`ExploreSearchBar` is `className="sticky top-0 z-30 …"`. It is a top-anchored search field. It shipped under T115, sourced to "thesis §5" rather than to the design language, and **F045 had no `review-F045.md` — so nothing ever put the thesis and the DLS in the same room.** This is the concrete cost of the two skipped reviews, found by running the gate they skipped.

The scenario's phrase *"the shipped Explore chrome, unchanged in appearance"* therefore does not mean "no design decision here." It means: relocate a DLS violation from a secondary tab onto the surface every Member and every visitor lands on.

**This is not an argument for building the new chrome now.** It is an argument that one clause of the scenario is claiming neutrality it does not have, and that the PM's already-requested follow-on — *search box above the nav, filter button at its right edge* — is **not a taste change reversing shipped work. It is the design language being restored.** That materially changes how the follow-on should be argued for and scheduled, and it is worth knowing before the merge rather than after.

### The revision this verdict asks for

One clause. In § Surfaces, replace *"the shipped Explore chrome, unchanged in appearance"* with an explicit statement of which of the two the merge is doing:

- **(a)** carry the chrome as-is and **record the principle-9 violation as knowingly accepted for one release**, with the follow-on chrome scenario named as the remedy and a note in DEVIATIONS; **or**
- **(b)** move the search row to the bottom as part of the merge, because the DLS already specifies where it goes and the surface is open anyway.

**Recommended: (a).** The PM's standing instruction is that the merge lands first so chrome is not rebuilt twice, and that instruction is sound — but the violation has to be *written down as a violation*, not laundered through the word "unchanged." An accepted deviation with a named remedy is a different artifact from an unnoticed one, and only the first survives an audit.

### Components required

| Component | Exists? | Notes |
|---|---|---|
| `ExploreSearchBar`, `ExploreFilterSheet`, `ActiveFilterChips`, `KindFilterPills`, `ListMapToggle` | **yes** | All presentational, all prop-driven. Genuinely portable, as the earlier analysis claimed. |
| `MakeThisYoursBanner`, `FeedEmptyState`, `ScopePicker` | **yes** | The three small Home pieces. `ScopePicker` needs its options re-sourced to metros; the other two transfer intact. |
| Merged empty state | **new composition, no new pattern** | The scenario's call — Explore's "try another filter" wins, with widen-locality as a secondary line — is right. On a surface with filters, the filter is the likely cause. |
| Create affordance in nav | **no** | Not in the design language. It is a nav item, not a new pattern, so this is a DLS *addition* rather than an EXTEND — but `design-language.md` § CTA placement has no entry for a nav-embedded create action, and `decision-surfaces.md` § Open questions 1 (what carries the third slot's visual weight) is unresolved. **Ticket it last, and expect it to need a DLS line.** |

### Accessibility (M3)

Run against the composed surface, not the components in isolation — which is the check that catches all three of these.

1. **Two tablists, one panel, and now a third claimant.** `KindFilterPills` and `ListMapToggle` both `aria-controls="#explore-results"`. `decision-surfaces.md` already flagged that a third would break the arrangement. The merged surface adds the place/metro switcher — not a tablist, so it does not claim the panel, but it *does* change the panel's contents, which means the panel's `aria-labelledby` (currently the kind tab) no longer describes what is in it. **Recommendation: demote the results container from `tabpanel` to a labelled `region` whose accessible name includes the active metro.** "Events in Sacramento" is a truthful label; "Events" alone is not, once place is switchable.
2. **The hardcoded id is now wrong in name as well as scope.** `EXPLORE_RESULTS_ID = 'explore-results'` on a surface that is not Explore. Cosmetic, but it is exported and referenced from two components, so renaming it is cheapest now.
3. **`aria-live` on the result count fires on every keystroke.** `data-testid="result-count"` carries `aria-live="polite"` and the search input is uncontrolled-debounced-by-render, so a screen-reader user typing five characters hears five count announcements. Pre-existing under T115; the merge makes it the landing surface's behaviour. **Recommendation: debounce the announcement, or move `aria-live` to a status node that updates on settle.**
4. **Focus on place switch.** Changing metro replaces the entire results region. Nothing currently moves focus or announces the change; a screen-reader user gets a silent content swap. **Recommendation: announce the new scope in the same live region that reports the count.**

### Copy & tone

- "Nothing here yet — try another filter" is fine, and correctly avoids implying the locality is empty when the filter is the cause.
- The scenario does not specify the switcher's label. It currently reads "Showing [place]" — which stops being accurate when the value is a metro and the results are the whole metro. Minor; name it in the ticket.
- No Language & Framing conflicts. Nothing here touches market/consolidation vocabulary.

### Design verdict

**REVISE** — one clause, named above. Everything else in the design check is a recommendation the ticket writer can carry.

---

## Sibling-consistency findings

Siblings checked: **F044** (inline list/map toggle), **F045** (filter icon + sheet), **F046** (scroll-to-hide nav). All three are in `planning/next/`, all three are built, and **F044 and F045 have no review document** — their own ledger rows flag it.

1. **Shared base components.** No divergence. F059 consumes F044's and F045's components rather than paralleling them; there is no `<XComposer>` / `<YComposer>` split to extract.
2. **Vocabulary.** Consistent. All four use the naming table's UI labels (Events / Products / Services / Ideas / Offers / Asks).
3. **Loop-shape alignment.** No fork. F044/F045/F046 are density and reachability refinements; F059 is a surface consolidation. Same loop, same direction.
4. **State consistency.** One divergence, already handled: F059's empty state resolves Explore's and Home's competing empty states rather than adding a third.
5. **Standing inconsistency this review inherits, and the reason for the finding above.** F044 and F045 were both grounded in `design-research-thesis.md` §5 with no `design-language.md` cross-check, because neither ran this gate. The top-anchored search row is the visible result. **F059 is the first of the four to be reviewed, and it is inheriting the consequences of the other three not being.** Recommend a retroactive one-paragraph DLS reconciliation note on the thesis rather than back-filling two reviews for shipped work — the reviews would be archaeology; the reconciliation is the thing with forward value.

---

## Apple legibility

Three of four clean; one flag. Action-handler shape: **n/a** — pure read path, no writes. Entity exposure: **clean** — the merge surfaces no new entity type on a public page. App Intents candidates: **none** — no new entity, no new write action.

**Flagged — deep-linkable URL.** The merged surface's identity moves *into* query parameters: place/metro, kind, category, schedule and search term are all `?`-state on `/`. The check explicitly flags "any surface that relies on query params or client-side state for its identity," and after this merge the platform's primary browse surface does exactly that. It is the correct trade for v1 — a filtered browse genuinely is query state, and the alternative is a route explosion — but it means the browse surface will not produce Universal-Link-worthy URLs, and a future "open this metro in the app" deep link needs a path-shaped address (`/p/[metro]`) that does not exist. Advisory; does not gate.

---

## Recommendations for the ticket writer

1. **Sequence the two substrate items first and separately.** The RPC projection (Condition A) and the metro vantage point (Condition B) are prerequisites, not parts of the port. A merge ticket that contains a migration is a merge ticket that cannot be reverted cleanly.
2. **Do not re-derive `TOGGLE_AFTER_CARDS`.** The constant is layout-coupled and four does not complete a row at three columns — but the follow-on chrome replaces the inline toggle with a floating map button, so the constant is being deleted within weeks. Port it untouched and note it. Re-deriving a value that is scheduled for deletion is the exact shape of work this merge is supposed to avoid doing twice.
3. **`resolveFeedPlace`'s precedence inversion is a behaviour change, not a refactor.** Today a signed-in Member's stored home silently beats an explicit `?place=`. Inverting it means a Member who follows a link to another metro now goes there. That is correct and it is what makes the switcher work — but it is a *user-visible* change that belongs in the ticket's acceptance criteria, not in a diff.
4. **Preserve unknown query parameters by construction.** Fix the serializer to mutate the current `URLSearchParams` rather than build a fresh one. Building fresh and adding `place` to the known-keys list would fix today's case and leave the same trap armed for the next parameter.
5. **The scroll-restoration key needs both halves of the fix.** Keying on the metro is necessary but not sufficient — `restored` is a `useRef` that never resets, so a key change produces "no restore at all" instead of "wrong restore." Reset the guard when the key changes, and test the switch path specifically.
6. **`src/components/HomeFeed.tsx` has no importers.** Delete it in the same ticket that touches the nav. It links to `/explore` and would otherwise show up in a future grep as a live reference.
7. **The `/explore` redirect must preserve the query string.** A bare `redirect('/')` drops the Member's filters silently. Test with a populated query.
8. **M4 applies.** The projection widening is a migration, so `engineering:deploy-checklist` gates the merge to main.

---

## Decisions captured

Two candidates for `playbooks/` entries. Both are PM calls, not review calls.

**For `DEVELOPMENT-PATTERNS.md`:**

> **Decision:** A design decision sourced to the research thesis is not ratified until it has been reconciled with `design-language.md`.
> **Intent:** T115 shipped a top-anchored search row citing `design-research-thesis.md` §5, against `design-language.md` principle 9's "No top-anchored toolbars or search fields." Both documents are live, neither cites the other, and the scenario that chose between them (F045) skipped the review gate — so nothing in the pipeline ever put them in the same room. The thesis explores; the design language governs. Where they conflict, the DLS holds until a decision says otherwise.
> **Touches:** `product/ui/design-research-thesis.md` (needs a precedence banner).

**For `PLATFORM-PATTERNS.md`:**

> **Decision:** The browse surface is readable signed-out, in full — no wall, no gate, no truncated result set.
> **Intent:** Landed 2026-09-04 in `community-platform.md` § T1 with a State tag; recorded here because it is a platform-shaped commitment that will be re-encountered by every future surface, not a property of one page.
> **Touches:** `product/ui/community-platform.md` § T1.
