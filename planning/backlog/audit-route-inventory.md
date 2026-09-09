---
purpose: Evidence file — every addressable route in web/, what it does, and whether it is live, retired-but-reachable, or a shell. Raw material for a surfaces document, not the surfaces document.
layer: how
status: draft
---

# Route inventory — 2026-09-09

> **What this is.** A read of `web/src/app` at commit `0592868`, route by route, against the migrations that define which tables exist. **It is evidence, not a spec** — nothing here is ratified and nothing here decides anything.
>
> **Why it exists.** The repo has a document that calls itself the surfaces document ([`../../product/ui/community-platform.md`](../../product/ui/community-platform.md) — **replaced 2026-09-09 by [`surfaces.md`](../../product/ui/surfaces.md), which this file is the evidence base for**) and it enumerates capabilities and tiers rather than screens. **No file in the repo lists what is actually addressable.** The cost of that showed up immediately: a full producer-bulletins UI has been sitting in the shipped app, reachable by URL, while the plan describes bulletins as unbuilt.
>
> **Correction to a count I gave on 2026-09-08.** I said 24 routes. **It is 25 page routes plus 3 route handlers** — I read a blank line in the output as a separator when it was `/`. Corrected below.

## Method, so the verdicts can be checked

Each route was read for the tables it queries, and each table name checked against `web/supabase/migrations/`. **A route that queries a table with no `create table` in any migration cannot work** — the query errors, and in every case below the error path falls through to a redirect or an empty state, which is why none of these look broken from the outside.

**Ten table names appear in shipped route code and in no migration:** `businesses`, `vendors`, `follows`, `supports`, `user_preferences`, `vendor_categories`, `markets`, `market_vendors`, `vendor_bulletins`, `bulletin_deliveries`, `vendor_stats_daily`, `vendor_events`.

**Verdicts used:** **LIVE** (current model, tables exist) · **RESIDUE** (pre-rebuild, routable, reads tables that do not exist) · **SHELL** (renders, but its write path or its data source is absent) · **DEV** (gated out of production).

---

## Page routes — 25

### Live — the current product

| Route | What it's for | Notes |
|---|---|---|
| `/` | Home — the anonymous, locality-defaulted feed | `LocalityFeed` → `locality_feed_items` → `discoverable_items`. **Takes a place and interest tags. Takes no follow input** — see the announcement finding below. |
| `/explore` | Browse — search, kind pills, filters, list/map toggle | Reads `discoverable_items`. **Indexes Items only.** The surface the browse rewrite lands on. |
| `/auth/login` · `/auth/signup` · `/auth/password` | Email-first auth | Live. |
| `/onboarding` | Post-signup hood/metro pick | `members`, `member_place_interests`. Idempotent re-entry. |
| `/m/[handle]` | A Member's public surface | The one deliberately global namespace. |
| `/m/[handle]/p/[slug]` · `/s/[slug]` · `/e/[slug]` | Member-attributed product / service / gathering | For Items not filed under a Page. |
| `/p/[...slug]` | The place-scoped catch-all — Places, Pages, Venues, and Group-filed Items | Dispatches to five resolvers. **The most load-bearing route in the app** and the only one whose URL shape matches the naming conventions. |
| `/you/sell` | Seller index — the walkthrough's destination | `group_memberships`, `locations`. |
| `/you/following` | Following management — People / Groups / Venues | Live [T108, T109]. **Management only: it lists who you follow and lets you unfollow. It delivers nothing.** |
| `/join` | Redirect shim → `/you` (or login) | Explicitly interim; comment names `/register-vendor` as the thing it replaced. |

### Live route, largely dead body

| Route | What it's for | Notes |
|---|---|---|
| `/you` | The You tab | **Mixed, and the worst of the three states.** It renders `SellCta` [T073], which is live and correct. **Its own data layer queries seven tables that do not exist** — `businesses`, `user_preferences`, `supports`, `follows`, `vendor_categories`, `markets`, `market_vendors`. Consequences: the "Switch to vendor mode" link is gated on `hasVendor`, which is derived from the dead `businesses` query, **so the condition can never be true** and the vendor tree is unreachable from navigation. The Your Market row, the follows list and the category rails are all fed by dead reads. |

### Residue — pre-rebuild, still routable

| Route | What it was for | Ticketed? |
|---|---|---|
| `/vendors/[slug]` | The old vendor profile | **Yes** [T149] — redirect. |
| `/business/[slug]` | The old business listing | **Yes** [T149] — redirect, because `BusinessDetailCard` builds share URLs from it. |
| `/register-vendor` | The old producer signup | **Yes** [T149] — remove. |
| `/following` | The old follows list | **No ticket.** Reads five dead tables. **Fully orphaned — no inbound link anywhere in `src/`.** Note that `BottomNav`'s You tab still pattern-matches `/following` for its active state. The retired `community-platform.md` C12 called this route deprecated; nothing deleted it. |
| `/you/vendor` | The old producer dashboard — followers, 14-day stats, market links, bulletin count | **No ticket.** Six dead tables. Links to `/api/vendor/followers/export`, **which does not exist**. |
| `/you/vendor/bulletins` | Sent-bulletin list with delivered / opened / clicked counts | **No ticket.** See the announcement finding. |
| `/you/vendor/bulletins/new` | Bulletin composer — title, body, "Sent to all your active followers" | **No ticket.** POSTs to `/api/vendor/bulletins/publish`, **which does not exist**. |
| `/you/vendor/bulletins/[id]` | One bulletin's delivery detail | **No ticket.** |

### Dev — gated out of production

| Route | Notes |
|---|---|
| `/(dev)/add-entity-demo` · `/(dev)/composer-demo` | `src/app/(dev)/layout.tsx` calls `notFound()` unless `NODE_ENV === 'development'`. **Correctly gated** [T071a]. Recorded because the paren-group directory does not affect the URL, so without the gate these would render at `/add-entity-demo` and `/composer-demo` in production. |

## Route handlers — 3

| Route | Verdict |
|---|---|
| `/auth/callback` | **LIVE** — auth redirect handler. |
| `/api/internal/auth-signup` · `/api/internal/auth-before-user-created` | **LIVE** — Supabase auth hooks. |

## Referenced and absent — two endpoints

Shipped UI points at two API routes that were never written:

- **`/api/vendor/bulletins/publish`** — the bulletin composer's submit target.
- **`/api/vendor/followers/export`** — a link on the vendor dashboard.

**Neither 404s visibly**, because neither surface can be reached to click.

## Three findings worth carrying forward

**1. The residue is more than double what is ticketed.** [T149] names three routes. **Eight are residue**, and the five unticketed ones (`/following` and the four under `/you/vendor`) include the entire producer-bulletins UI.

**2. [T149]'s reasoning rests on components that are themselves dead.** The ticket keeps `/vendors/[slug]` as a redirect rather than a deletion because **"four live components"** point at it. Checked: `VendorCard` is imported only by `/you`, whose own reads are dead; `EventCard` and `BulletinFeedCard` are imported only by `HomeFeed.tsx`, **which nothing imports at all.** The redirect may still be the right call — a share URL in someone's messages is invisible to us and that argument stands on its own — but **the "live components" premise does not, and the ticket should not be built on it unexamined.**

**3. Dead code and dead routes are the same finding.** `HomeFeed.tsx` is an orphaned pre-rebuild component with no importer. It was not visible to any process because nothing tracks components either. **A surfaces document that lists only routes would have missed it.**

## What this file is not

**Not the surfaces document.** That document has to say what each surface is *for* and which are canonical — a model question. This one only says what exists and whether it runs. **The two should not be merged**: this file goes stale every time a route is added, and a spec that goes stale weekly is the failure mode `CLAUDE.md` opens by naming.
