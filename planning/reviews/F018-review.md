# F018 review — Brian declares the Run Club

**Scenario:** [`planning/scenarios-backlog/F018-brian-declares-run-club.md`](../scenarios-backlog/F018-brian-declares-run-club.md) *(still in backlog — promote to `scenarios/` after this review)*
**Reviewer:** pipeline-review (worked example for the walk-through)
**Date:** 2026-05-08
**Bundle:** b1
**Verdict:** **PROCEED** *(re-reviewed 2026-05-08 after EXTEND items landed)*

**Re-review 2026-05-08.** All EXTEND items are now in tree:

- ✅ `product/systems/item.md` — `item.published` semantics documented (state transition, two listeners), `discoverable_items` synchronous-refresh trigger specced for b1 (async at T2), `GET /api/hashtags/suggest` endpoint specced.
- ✅ `product/ui/design-language.md` — new "Venue page" surface pattern (header + below-header primary CTA "Host something here" + sections), new "Recurrence picker" component recipe with RRULE output and reuse rule.
- ✅ Scope change earlier the same day: QR PDF action removed (QR reserved for vendor-booth only); gatherings share by URL. Item-page Share-link affordance uses existing button + clipboard / `navigator.share()` patterns — no new design work.

**Original EXTEND verdict (kept for trace):** *"Proceed only after one doc update lands. The scenario fits the Item primitive and the gathering child table cleanly. One gap must close before ticket writing: product/ui/design-language.md does not yet describe the venue-page primary CTA pattern that the scenario depends on."*

## Verdict summary

The scenario fits the Item primitive and the gathering child table cleanly. All architecture-side gaps closed in `item.md`; all design-side gaps closed in `design-language.md`. Ticket writing can begin.

**Next skill:** `pipeline-ticket` (write the tickets — already drafted as T036–T040; this re-review unblocks them) and `pipeline-eval` (write mode) in parallel. The PM should also promote the scenario from `scenarios-backlog/` to `scenarios/`.

## Architecture check

### Systems touched

- `product/systems/item.md` — Items spine + `item_gatherings` child table + `item.created` event log + `item_hashtags` join.
- `product/systems/discovery.md` — `discoverable_items` materialized view (gathering kind, locality+time scoring).
- (referenced, not extended) `product/foundation/primitives.md` — Person → Item(kind=gathering) → Location.

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | none | All needed tables (`items`, `item_gatherings`, `item_locations`, `item_hashtags`, `item_events`, `discoverable_items` view) are in the Phase-1 migration plan. |
| New columns required? | none | All scenario fields map to existing columns in the spine + child + relations tables. |
| New event types required? | one — `item.published` | The scenario implies a state transition from draft to published that should emit a distinct event from `item.created` so the discovery refresh + follower-fanout can listen on `published`. Add to `item.md`'s event list. |
| Forward-tier impact | clear | T2 RSVPs and T3 federation handoff both work with the planned schema. |

### Cross-system consistency

- **Item × Location.** `item_locations` join supports the venue-attached gathering. ✓
- **Item × Discovery.** `discoverable_items` view filters by kind + time + distance. The scenario's "appears within 60 seconds" requires the view to refresh on `item.published`. Make sure the migration's `013_discoverable_items.sql` includes the trigger or scheduled refresh. (Annotate in the relevant ticket.)
- **Item × hashtags.** `item_hashtags` autocomplete in the composer requires a query path that doesn't yet exist as a documented endpoint in any system spec. Small — recommend a one-liner in `item.md` naming the autocomplete endpoint.

### Architecture verdict

**PROCEED** — all three additions landed in `product/systems/item.md`:

- `item.published` event semantics paragraph (state transition, listeners: discovery refresh + follower fan-out, `publish_item()` helper).
- `discoverable_items` refresh trigger spec (synchronous at b1, async at T2; index requirement noted).
- `GET /api/hashtags/suggest?q={prefix}` endpoint specced (response shape, validation, caching).

No data-model changes were needed. ✓

## Design check

### Surfaces touched

- `/l/[slug]` (venue page) — **existing surface (referenced in `community-platform.md`), but the venue-page CTA pattern is not in `design-language.md`.** This is the gap.
- `/i/[slug]` (Item page) — existing surface, components defined.
- `/h/[hashtag]` (hashtag page) — existing surface (defined in the hashtags decision in JOURNAL).
- `/` (locality-first home) — existing surface.

### Components required

| Component | Exists in design language? | Notes |
|---|---|---|
| Venue-page header + below-header primary CTA | **NO** | This is the gap. The pattern is implied by F018 but the design language doc doesn't yet describe it. Recommend `pipeline-product` extends `design-language.md` with a "venue page" section before ticket writing. |
| Composer drawer/sheet for new gathering | partial — drawer pattern exists, gathering composer not specced | The drawer pattern is in design-language.md; the specific gathering composer (recurrence picker, what-to-bring field, etc.) needs a small section in the same doc. |
| Recurrence picker | **NO** | Not in the inventory. Either: (a) build a custom one as part of the F018 ticket and document it, or (b) extend design-language.md first. Recommend (b) for a primitive this commonly used. |
| Item-page header + actions | yes | Exists. |
| ~~QR PDF action button~~ Share-link affordance | yes (button) | **Scope change 2026-05-08:** QR PDF action removed (QR is vendor-booth-only). Replaced with a "Share link" affordance: clipboard copy + native share sheet on mobile. Existing button + iconography patterns suffice; no new design-language additions needed. |
| Hashtag chip | yes | Defined in the hashtags decision. |

### CTA placement

| Surface | CTA | Established pattern | Match? |
|---|---|---|---|
| Venue page | "Host something here" | **No established pattern documented.** The pattern needs to be added — see the components row above. | n/a (gap) |
| Item page | "Share link" | Existing action-button pattern in `design-language.md` § Buttons. | yes |

### Copy & tone

- "Host something here" — verb-first, surface-anchored. Matches the people-first stance and the language guidance in root `CLAUDE.md` ("Take back / reclaim" energy). ✓
- "What to bring" — friendly, non-formal. ✓
- "Share link" — utilitarian and clear. ✓

### Empty / loading / error states

- **Slug collision** — scenario specifies append-suffix behavior (`-2`, `-3`). Good.
- **Recurrence in the past** — scenario specifies validation error. Good.
- **Drake's doesn't exist as a Location yet** — scenario explicitly defers to a separate scenario (declare-at-new-Location). Good defer.
- **Loading** — not specified. Recommend the ticket include a loading state for composer submit (~1s spinner with "Publishing…" text). Minor.
- **Network failure on publish** — not specified. Recommend the ticket include retry + error toast. Minor.

### Design verdict

**PROCEED** — both additions landed in `product/ui/design-language.md`:

- New "Surface patterns" section with **Venue page** entry: hero image, name, address row, hairline, primary CTA "Host something here" below the header, sections "What's happening here" / "About" / "Items here," anti-pattern callouts.
- New **Recurrence picker** component recipe under Component recipes: friendly inputs (frequency, day(s), time, until), RRULE output + human-readable preview, validation rules, reuse-not-fork directive.

QR PDF format spec was the third gap; now obsolete because QR was removed from gathering scope. ✓

## Recommendations for the ticket writer (assuming the doc updates land)

- **Reuse, don't reinvent:** the composer drawer, the action button, the hashtag chip, and the Item-page header all exist. Don't redefine them in tickets.
- **Tickets to include:**
  - `T036` — `item_published` event + `discoverable_items` refresh trigger (schema + migration).
  - `T037` — `/l/[slug]` venue page CTA "Host something here" (UI; depends on the design-language extension).
  - `T038` — Composer drawer (gathering) with recurrence picker, all gathering-specific fields, slug generation, validation. Writes spine + `item_gatherings` + `item_hashtags` + `item.published` event.
  - `T039` — `/i/[slug]` Item page rendering + share-link affordance (QR PDF action removed per the 2026-05-08 scope change).
  - `T040` — `discoverable_items` filter on kind=gathering for "this week" surfaces (Drake's venue page list under "What's happening here," locality-first index this-week filter).
- **Test data:** the existing fixtures don't have a "Drake's" Location with `kind=permanent`. Add a fixture so eval-write has a stable seed.

## Decisions captured

Add to `planning/DECISIONS.md`:

```
## ADR — Surface-shaped composers, not /new

**Decision.** New Items are created from surface-specific CTAs (venue page → "Host something here", Maker page → "Drop something now") rather than a generic /new composer. The unified composer is deprecated.

**Why.** F018 lesson — a generic kind picker forces the data taxonomy on the user. Surface-specific entries let the surface pick the kind, keeping the user in the verb-shaped frame ("I'm hosting at this venue"). See product/foundation/people-first.md and the Brian/Aaron/Maya scenario set.

**Consequences.** Multiple composer entry points; the composer component itself can be one drawer that varies its fields by the surface that invoked it. The Item primitive is unchanged.
```
