---
purpose: Decision — how an Item's canonical URL resolves for Group-filed Items and for the four kinds with no detail page.
layer: how
status: backlog
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
- `MarketSelector`, `VendorCard`, `RecruitmentGrid` — still rendered, all vendor-era.
- `MarketContext` — reads `markets`, which returns `PGRST205`; `allMarkets` is always `[]`.
- `HomeFeed` — reads `events`, `businesses`, `markets`; all three are gone.
- `/you`, `/you/vendor/*`, `/vendors/[slug]`, `/business/[slug]`, `/register-vendor` — vendor-era routes.
- `Vendor` / `Market` / `VendorCategory` types in `src/lib/types.ts`.

Home is in the same position Explore was in before T117: querying tables that do not exist. That is the sharper end of this stub and probably wants its own scenario.

## Next step

PM ratifies the two questions above, then `scope` writes the scenario(s). `explore` should drain this before Phase 3 opens.
