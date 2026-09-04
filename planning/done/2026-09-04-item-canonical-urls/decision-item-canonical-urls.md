---
purpose: Decision — how an Item's canonical URL resolves for Group-filed Items and for the four kinds with no detail page.
layer: how
status: done
---

# Decision: canonical Item URLs — Group-filed rows and the four missing kinds

**Raised by:** T117 (Explore rewired to `discoverable_items`) — DEVIATIONS § T117 What (1).
**Type:** B — a real architectural decision, not an authoring error.
**Blocks:** nothing at b1 today; degrades every browse surface.

## The observation

`itemHref` (`src/lib/feed/item-url.ts`, T088) builds one shape for every Item:
`/m/<handle>/<seg>/<slug>-<id8>`. Against the 16 seeded Items, 7 resolve and 9 return 404:

| Class | Rows | Why it 404s |
|---|---|---|
| Group-filed Items | 4 | The `/m/` path is the *individual-seller* path; the resolvers reject a row with a `group_id`. The canonical URL is the Group place-path (`/p/[…place]/g/[group]/…`), which `itemHref` does not build. |
| `ask` / `offer` / `wonder` / `initiative` | 5 | No route exists under `/m/[handle]/` for `/a/`, `/o/`, `/i/`, `/initiative/`. Only `/p/`, `/s/`, `/e/` shipped (T079 / T082 / T083). |

This is not new — the Home locality feed has emitted the same links since T088, and `item-url.ts` names the gap in its own header. T117 makes it visible on a second, higher-traffic surface.

## The decision to make

Two independent questions, and the second is really a scope call, not a design one:

1. **Group-filed Items** — does `itemHref` learn to resolve the Group place-path (needs the Group slug + its place ancestry, neither of which the MV carries today), or do the `/m/` resolvers accept Group-filed rows and redirect to the canonical Group URL? The second is cheaper and keeps one link shape; the first honours the URL table in `CLAUDE.md` § Naming conventions.
2. **The four kinds with no page** — ship `/a/`, `/o/`, `/i/`, `/initiative/` detail pages (four tickets on the T079/T082/T083 pattern), or have browse surfaces not link a kind that has no destination until its page lands.

## Also folded in — the vendor/market surface retirement

T117 removed Explore's market and day filters, which orphaned `MarketPill`. The wider sweep was deliberately left whole rather than fragmented:

- `MarketPill` — no consumer after T117.
- `MarketSelector`, `VendorCard`, `RecruitmentGrid` — all vendor-era; still rendered, but only on `/you`.
- `MarketContext` — reads `markets`, which returns `PGRST205`; `allMarkets` is always `[]`. The provider is mounted in the **root layout**, so this dead query fires on every page load app-wide. That sets the removal order.
- `HomeFeed` — reads `events`, `businesses`, `markets`; all three are gone. Orphaned dead code: T087/T088 unmounted it from `/` and nothing imports it now.
- `/you/vendor/*`, `/vendors/[slug]`, `/business/[slug]`, `/register-vendor` — vendor-era routes, deletable.
- `/you` — **not** in that list. It is a live nav destination hosting F036's sell CTA and F042's following summary; it needs its own rewrite ticket to drop the vendor-era reads it still carries.
- `Vendor` / `Market` / `VendorCategory` types in `src/lib/types.ts`.

Home is **not** in the position Explore was in before T117 — `/` renders `LocalityFeed` off `discoverable_items` (T087/T088). What remains is dead weight, not a broken surface: `HomeFeed` is unreachable, and the live vendor-era reads are confined to `/you`. The sweep is a deletion pass plus a `/you` rewire, and it can be sequenced independently of the canonical-URL question above.

## Resolved — 2026-09-04

Both questions ratified. The answers live as entries in [`playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md):
**"An Item's canonical URL is its Group place-path when filed, its Member path when not"** and
**"Browse surfaces link only Item kinds that have a detail page."**

**Q1 — Group-filed Items: neither option as stated.** The stub framed this as *build the Group place-path* vs *redirect from `/m/`*, with the first described as needing data the MV doesn't carry. Reading the code changed the question:

- The Group Item routes **already exist and already work** — `/p/[…place]/g/[group]/{p,s,e}/[item]` all dispatch and resolve. Nothing needed building; `itemHref` simply never emitted them.
- **The place segments are decorative.** Every resolver keys off the globally-unique Group slug and ignores the place path entirely. The F038 fixture says so in a comment: *"resolveShop() resolve by group slug alone; the place segments before /g/ are illustrative."*
- The place path **is** derivable and was never missing: `groups.anchor_location_id → locations.place_id → places`, walking `parent_id` and skipping the county tier per the URL convention. `locations.place_id` was added by T075.

So the redirect option buys nothing — it needs the same derivation and yields two URLs for one Item, which is the wrong answer for a shareable link. Build the real path.

**A third defect this stub did not find, and it is the one that actually blocks v1's Group events.** Attribution on the Group path reads `items.brand_label`, which is populated only from `group_businesses.display_name`. A gathering filed under a non-business Group has `brand_label = null`, and every resolver returns `null` on that branch — so the Repair Cafe 404s *twice*: once for the wrong link shape, and again at the resolver even when the link is right. Group events are in v1 scope and every Group event will be filed under a non-business Group. Attribution falls back to `groups.name`.

**Q2 — the four kinds with no page: withhold, do not stub.** Reasoning in the pattern entry. Their seed rows stay; only the browse surfaces change.

**Q3 — globally unique identifiers under locally-scoped names.** Already solved for Items (the `id8` fragment) and deliberately deferred for Groups (`groups.slug` keeps its global `UNIQUE` until local scoping ships in schema). State-tagged in the pattern entry.

**The vendor/market retirement folded in below is untouched** and still stands as its own sweep — see [`audit-vendor-market-retirement.md`](audit-vendor-market-retirement.md).

→ Scenario F054 · review-F054 · ticket T119.
