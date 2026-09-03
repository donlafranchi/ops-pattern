---
purpose: Scope inventory for the vendor/market surface retirement — every file in the sweep, what is unsafe to delete, and the removal order.
layer: how
status: backlog
---

# Audit: the vendor/market retirement sweep

**Raised by:** T117 (`planning/backlog/decision-item-canonical-urls.md` § *Also folded in*), DEVIATIONS § T117 *Note — `MarketPill` is now orphaned*.
**Mode:** scope only. Nothing in this pass was deleted, edited, or committed.
**Method:** reverse-dependency graph over `web/src`, `web/tests`, `web/evals`, `web/scripts` (import + dynamic-import + require, `@/` and relative), then reachability from the live route entry-point set. Every table read in `src/` was mapped to its file and checked against migrations `001`–`036`.

---

## 1. Headline

**51 files delete. 11 files must be edited instead — deleting any of the 11 breaks something that ships today.** The database side is empty: no migration, RLS policy, RPC, grant, or index in the live lineage names a single one of these tables.

The known list in the brief was **13 items of 62**. It missed 25 components, 4 hooks, 3 libs, 5 tests, and 3 SQL files; and it named three things as deletable that are not.

---

## 2. What is NOT safe to delete — read this section first

Eleven files. Each one is either mounted in the live app or shared with a surface that ships.

### 2.1 `src/app/you/page.tsx` — **rewrite, never delete**

The riskiest file in the sweep, and it is on the brief's delete list.

`/you` is the **third tab of the bottom nav** — one of three destinations a Member can reach from the persistent nav. It is also the **sole live host of two shipped features**:

| Component | Ticket / scenario | Only importer |
|---|---|---|
| `components/sell/SellCta.tsx` | T073 — F036 three-branch sell routing | `src/app/you/page.tsx` |
| `components/follows/FollowingSummary.tsx` | T108 — F042 unified Following summary | `src/app/you/page.tsx` |

Delete the file and F036's sell entry point and F042's following summary leave the product with it — along with `SellWalkthrough`, `getDraftGroup`, and `FollowCard`, which have no other reachable path. The page's *other* half (saved vendors, followed vendors, market row, `RecruitmentGrid`, vendor-mode link, email-preference toggle) reads seven dead tables and is genuinely dead. This is a rewrite ticket, not a delete: keep `SellCta` + `FollowingSummary`, drop everything vendor-era, and decide what the Saved / Following / Settings tabs become.

### 2.2 `src/app/layout.tsx` — **edit; it is the root layout**

`MarketProvider` is mounted here, wrapping every page in the app:

```
src/app/layout.tsx:5   import { MarketProvider } from "@/components/MarketContext"
src/app/layout.tsx:30  <MarketProvider>
src/app/layout.tsx:36  </MarketProvider>
```

`MarketContext` is deletable, but **only after** this import and wrapper come out. Delete the component first and the entire app fails to build. The brief's framing — that Home consumes `MarketContext` — is wrong in a way that matters here: it is not Home, it is the root layout, which is strictly worse. The provider fires a `markets` query on **every page load in the app today**, including Home and Explore, and swallows the `PGRST205`.

### 2.3 `src/components/AuthCtaButtons.tsx` — **edit; live in the root layout**

Not on the brief's list at all, and it is live: `layout.tsx` → `TopNavDesktop` → `AuthCtaButtons` (`BottomNav` imports it too). It queries a dead table:

```
src/components/AuthCtaButtons.tsx:29  client.from('businesses').select('id').eq('user_id', uid)
```

The query fails silently, so `hasVendor` is permanently `false` and **every signed-in Member currently sees a "List your business →" link** that should have been suppressed for existing sellers. Removing the `hasVendor` branch is a copy + routing decision (where does that CTA point now that `kind='business'` Groups replaced `businesses`?), not a mechanical deletion.

### 2.4 `src/app/join/page.tsx` — **edit; live marketing page, four links into a route being deleted**

`/join` is reachable from the nav (via `AuthCtaButtons`) and from `/you`. Its entire purpose is funnelling to `/register-vendor` — including a **generated QR code** pointing at it:

```
src/app/join/page.tsx:23   const target = `${origin}/register-vendor`   ← QR code destination
src/app/join/page.tsx:53   href="/register-vendor"
src/app/join/page.tsx:60   href="/auth/login?next=/register-vendor"
src/app/join/page.tsx:111  href="/register-vendor"
```

Delete `/register-vendor` without touching `/join` and a live page's primary CTA — and a QR code that may already be printed on physical recruitment material — becomes a 404. `/join` either gets repointed at the F036 sell walkthrough or retires with the sweep. That is a PM call, not a build call.

### 2.5 `src/lib/slugify.ts` — **prune one function; do not delete the file**

```
uniqueSlug()   → reads `businesses`. Only importer: /register-vendor. DEAD.
toSlug()       → 9 live importers. LOAD-BEARING.
```

`toSlug` is used by `lib/feed/item-url.ts` (every Item link on Home and Explore), `lib/items/qr-card.ts`, `actions/group/create.ts`, `actions/group/update-draft.ts`, and the three `you/sell/*/actions.ts` handlers. Deleting this file breaks Item URLs, QR cards, and every composer. Remove `uniqueSlug` and the now-unused `createClient` import at line 1; keep the rest.

### 2.6 `src/lib/types.ts` — **prune ~14 types; do not delete the file**

Mixed file. Dead: `Business`, `Vendor`, `Market`, `MarketVendor`, `VendorCategory`, `Follow`, `EventType`, `EventHostType`, `EventStatus`, `PlatformEvent`, `VendorBulletin`, `BulletinDelivery`, `VendorEventName`, `VendorAnalyticsEvent`, `VendorStatsDaily`, `UserPreferences`, `Support`, `Report`, `WEEKDAYS`, `WeekdaySlug`, `REPORT_PILLARS`, `ReportPillar`, `OWNERSHIP_TIERS`.

**Must survive: `OwnershipTier`.** `lib/map-config.ts` imports it to type `PIN_COLORS`, and `map-config.ts` is live — `ExploreMap` (shipped in T117) reads `MAP_DEFAULTS` from it. Delete `types.ts` and Explore's map view stops building.

### 2.7 `src/lib/map-config.ts` — **keep as-is; verify, do not touch**

Live via `ExploreMap` → `MAP_DEFAULTS`. After the sweep, `PIN_COLORS` and `CLUSTER_CONFIG` have no runtime consumer — but `web/CLAUDE.md:43` explicitly **reserves** ownership-tier colours for badges and map pins and forbids reusing them as accents, and T117's own note repeats the reservation. Removing `PIN_COLORS` contradicts a standing convention. Recommend: leave the file whole, and if the reservation is stale, retire it deliberately in its own decision rather than as a side effect of this sweep.

### 2.8 `src/components/BottomNav.tsx` — **edit; live in the root layout**

Two stale route predicates:

```
src/components/BottomNav.tsx:11  p === '/map'                  ← no /map route exists (never did, post-rebuild)
src/components/BottomNav.tsx:12  p.startsWith('/following')    ← /following is in this sweep's delete list
```

Cosmetic (active-tab highlighting only), but it is the nav and it must not be left pointing at deleted paths.

### 2.9 `web/tests/map-config.test.ts` — **prune, do not delete**

`MAP_DEFAULTS` assertions cover live code. The `PIN_COLORS` and `CLUSTER_CONFIG` assertions cover code that is about to have no consumer. Keep the file, keep or drop those blocks in step with 2.7.

### 2.10 `web/INFRASTRUCTURE.md` — **edit**

§ *Database Schema* instructs the reader to run `001-create-tables.sql` then `seed-folsom-coffee.sql` — both in this sweep's delete list. § *Production Hardening* ships four `create index` statements against `businesses` and `supports`. Anyone following this doc today builds the pre-rebuild schema. The § *"The Good Place"* showcase-seed block immediately below it is current and correct; keep that.

### 2.11 `web/TEST-CHECKLIST.md` — **edit**

Lines 16–56 (manual smoke tests F001 Map View / F002 Business Detail Card / F003 Business Registration / F004 Shareable Listing / F005 Community Signals) and lines 73–85 (a Playwright coverage table listing nine F001–F005 spec files **already deleted** in the 2026-06-21 pre-rebuild eval retirement) are entirely dead. Lines 57–71 (Auth, Cross-Cutting) are live and current.

---

## 3. The complete delete inventory — 51 files

Every entry below was verified unreferenced by tracing importers, not by assumption. "After" means: unreferenced once the eleven Section-2 edits land.

### 3.1 Routes — 10 files

| File | Dead tables it reads | Inbound links |
|---|---|---|
| `src/app/business/[slug]/page.tsx` | `businesses` | none |
| `src/app/business/[slug]/BusinessListingPage.tsx` | — | parent only |
| `src/app/vendors/[slug]/page.tsx` | `businesses`, `markets`, `market_vendors`, `vendor_categories` | `VendorCard`, `BulletinFeedCard` (both dead) |
| `src/app/vendors/[slug]/VendorProfilePage.tsx` | — | parent only |
| `src/app/register-vendor/page.tsx` | `businesses`, `markets`, `market_vendors` | **`/join` — see 2.4** |
| `src/app/following/page.tsx` | `businesses`, `markets`, `market_vendors`, `vendor_categories`, `follows` | `BottomNav` predicate only (2.8) |
| `src/app/you/vendor/page.tsx` | `businesses`, `follows`, `markets`, `market_vendors`, `vendor_bulletins`, `vendor_events`, `vendor_stats_daily` | `/you` (2.1) |
| `src/app/you/vendor/bulletins/page.tsx` | `businesses`, `vendor_bulletins`, `bulletin_deliveries` | `/you/vendor` |
| `src/app/you/vendor/bulletins/new/page.tsx` | `businesses` | `/you/vendor` |
| `src/app/you/vendor/bulletins/[id]/page.tsx` | `vendor_bulletins`, `bulletin_deliveries` | `/you/vendor` |

Note: `/you/following` (T109, F042) is a **different, live** route. Do not confuse it with `/following`.

### 3.2 Components — 25 files

**On the brief's list (6):** `HomeFeed.tsx` · `MarketContext.tsx` (after 2.2) · `MarketPill.tsx` · `MarketSelector.tsx` (after 2.1) · `VendorCard.tsx` (after 2.1) · `BulletinFeedCard.tsx`

**Missed by the brief (19):**

| File | Why it is in this sweep |
|---|---|
| `EventCard.tsx` | `HomeFeed`'s only consumer; exports `buildHostMaps(vendors, markets)` |
| `RecruitmentGrid.tsx` | `HomeFeed` + `/you`; the "become a vendor" recruitment grid |
| `FollowButton.tsx` | reads `follows`; consumers are `VendorCard`, `/following`, `VendorProfilePage`. Superseded by `FollowMemberButton` / `FollowVenueButton` / `FollowShopButton` |
| `BusinessDetailCard.tsx` | `Map.tsx` only |
| `SearchBar.tsx` | `Map.tsx` only |
| `Map.tsx` | zero importers already; the pre-rebuild business map |
| `MapPreview.tsx` | dynamic-imported by `BusinessListingPage` only |
| `CategoryInput.tsx` | zero importers; reads `businesses` |
| `Sparkline.tsx` | `/you/vendor` analytics only |
| `SupportButton.tsx` | reads `supports`; `BusinessListingPage` + `BusinessDetailCard` |
| `ReportForm.tsx` | reads `reports`; same two consumers |
| `PillarSelector.tsx` | `ReportForm` only |
| `OwnershipBadge.tsx` | `Map` + `BusinessListingPage` |
| `OwnershipSelector.tsx` | test-only importer |
| `Toast.tsx` | `BusinessListingPage`, `BusinessDetailCard`, `FollowButton` — all three in this sweep |
| `AuthGateModal.tsx` | same three consumers |
| `AuthButton.tsx` | zero importers already |
| `admin/MarketForm.tsx` | zero importers; the `admin/` dir empties out |
| `admin/VendorForm.tsx` | zero importers |

### 3.3 Hooks — 4 files, all missed by the brief

`useMapBusinesses.ts` (reads `businesses`) · `useSearchSuggestions.ts` (reads `businesses`) · `useSupport.ts` (reads `supports`) · `useSupportCount.ts` (reads `supports`, zero importers already)

`hooks/useAuth.ts` **stays** — live via `MagicLinkForm` and `EmailFirstSignup`.

### 3.4 Lib — 4 files, all missed by the brief

`lib/categories.ts` (the `bread` / `produce` / `honey-jams` vendor taxonomy; all five importers are in this sweep) · `lib/market-dates.ts` + `lib/market-dates.test.ts` (market schedule formatting) · `lib/geocoding.ts` (Mapbox forward geocode; only importers are `/register-vendor` and `useSearchSuggestions`, both in this sweep) — take `tests/geocoding.test.ts` with it.

`lib/supabase.ts` **stays** — live via `FollowingSummary` and `useAuth`.

### 3.5 Tests — 5 files

`tests/types.test.ts` (asserts `OWNERSHIP_TIERS` / `REPORT_PILLARS`) · `tests/report-pillars.test.ts` · `tests/ownership-badge.test.ts` · `tests/ownership-selector.test.ts` · `tests/geocoding.test.ts`

### 3.6 SQL and seeds — 3 files

`web/scripts/001-create-tables.sql` — the pre-rebuild schema (`businesses`, `supports`, `reports`). Opens with `drop table … cascade` on all three; **running it against the current database is destructive-adjacent and it is still cited as the setup path in `INFRASTRUCTURE.md`.**
`web/scripts/seed-folsom-coffee.sql` — 22 coffee shops into `businesses`.
`web/supabase/seed-markets.sql` — Sacramento markets + mock vendors into `markets` / `businesses` / `vendor_categories`. Already known broken; the 2026-06-21 pre-rebuild eval retirement cites it erroring with `relation "markets" does not exist`.

---

## 4. Database side — nothing to remove

Checked all 36 migrations, `supabase/seeds/`, `supabase/tests/`, `supabase/test-helpers/`, and `supabase/snippets/`.

**No migration in the live lineage creates, alters, grants on, indexes, or writes an RLS policy against any of these tables:** `businesses`, `markets`, `market_vendors`, `vendor_categories`, `vendor_bulletins`, `bulletin_mutes`, `bulletin_deliveries`, `vendor_events`, `vendor_stats_daily`, `user_preferences`, `supports`, `reports`, `events`, `follows`.

The rebuild did not *drop* them — it started a clean migration set that never contained them. The only two hits anywhere in `supabase/migrations/` are the word "markets" inside a comment (`017_places.sql:280`, about b1 launch localities) and an ADR filename (`015_items.sql:19`). Both are prose; leave them.

Consequences worth stating plainly:

- **No migration to write.** No `drop table`, no policy cleanup, no MV rebuild. The sweep is a code-and-docs change only, which is why it needs no M4 deploy-checklist gate on schema grounds.
- **`discoverable_items` is untouched.** The MV depends on `items` / `members` / `locations` / `groups` — none of them in this sweep.
- **`tests/rls-coverage.test.ts` is unaffected.** It queries `pg_tables` live; the dead tables are not there to fail on.
- **`member_follows` (migration 010) is live** and must not be confused with the dead `follows`. Same for `member_saved_searches` vs `supports`.

## 5. Evals — nothing to remove

All 11 feature specs and all 15 phase-0/phase-1 specs are clean. No eval references a dead table or a dead route. The specs that match on "vendor / market / business" (F035, F036, F037, F042) are about `kind='business'` **Groups** — the current model, not the vendor era. The pre-rebuild F001–F005 specs were already retired on 2026-06-21; only the stale coverage table in `TEST-CHECKLIST.md` still lists them (§ 2.11).

---

## 6. Recommended order — order matters

Six phases. The rule behind the ordering: **detach live code from the cluster before deleting any of the cluster**, and settle the two open product questions before the code that depends on the answers.

**Phase 0 — decide two things (PM, before any code)**
1. What does `/you` become? Which tabs survive, and what replaces Saved / Following / Settings.
2. Does `/join` retire, or get repointed at the F036 sell walkthrough? This also settles where `AuthCtaButtons`' CTA goes.

Both block Phases 1 and 4. Neither is a build decision.

**Phase 1 — detach the root layout and the nav (4 files, no deletions)**
`layout.tsx` (drop `MarketProvider`) → `AuthCtaButtons.tsx` (drop the `businesses` read) → `BottomNav.tsx` (fix `/map`, `/following`) → `join/page.tsx` per the Phase 0 answer.
*Why first:* until `MarketProvider` is out of the root layout, `MarketContext` cannot be deleted at all. Doing this first also stops a failing query on every page load in the app, which is a user-visible win independent of the rest of the sweep.

**Phase 2 — rewrite `/you` (1 file, no deletions)**
Keep `SellCta` and `FollowingSummary`. Drop the vendor-era half.
*Why second:* `/you` is what keeps `MarketSelector`, `VendorCard`, `RecruitmentGrid`, and `MarketContext` reachable. Nothing in Phase 4 is safely deletable until this lands. **This is the ticket that needs review — it touches two shipped scenarios (F036, F042) and a primary nav destination.**

**Phase 3 — prune the three shared files (3 files, no deletions)**
`slugify.ts` (remove `uniqueSlug`) → `types.ts` (keep `OwnershipTier`) → `tests/map-config.test.ts`.
*Why third:* after Phases 1–2 nothing live needs the dead exports, and before Phase 4 the typecheck still passes at every step.

**Phase 4 — delete the code (48 files)**
Leaves-first, so the tree typechecks after each commit: hooks and libs → leaf components (`Toast`, `AuthGateModal`, `PillarSelector`, `Sparkline`, `OwnershipBadge`, `OwnershipSelector`, `SearchBar`, `MapPreview`, `BusinessDetailCard`, `SupportButton`, `ReportForm`, `CategoryInput`, `EventCard`, `RecruitmentGrid`, `FollowButton`, `VendorCard`, `BulletinFeedCard`, `MarketPill`, `MarketSelector`, `MarketContext`, `HomeFeed`, `AuthButton`, `admin/*`) → routes (`/you/vendor/**` deepest-first, then `/following`, `/register-vendor`, `/vendors`, `/business`) → the 5 tests.
*Why after 1–3:* every one of these is provably unreferenced only once the edits above land.

**Phase 5 — the SQL files and the docs (5 files)**
Delete the 3 SQL files, then rewrite `INFRASTRUCTURE.md` § Database Schema + § Production Hardening indexes and `TEST-CHECKLIST.md` lines 16–56 and 73–85.
*Why last:* `INFRASTRUCTURE.md` is the only thing still citing the SQL files; fixing the doc and deleting the files in the same commit keeps the repo internally consistent at every point. Deleting the SQL first leaves a doc pointing at nothing.

**Sequencing note.** Phases 1–3 are eleven surgical edits with no deletions; Phase 4 is a large mechanical delete. Splitting them is the point — if anything regresses, it regresses in the small, reviewable half. Phase 2 deserves its own ticket and its own `review`.

---

## 7. Two factual errors — already corrected on disk, one still open

The brief flagged two false claims. Both had **already been rewritten on disk** by the time this pass read the files, and both now read correctly:

- `development/tickets/T117-explore-items-rewire.md:36` now reads *"`MarketContext` itself is untouched — `/you` still consumes it (Home does not; Home renders `LocalityFeed` off `discoverable_items` per T087/T088)."* ✅
- `development/tickets/T117-explore-items-rewire.md:73` now correctly describes `HomeFeed.tsx` as *"orphaned dead code since T087/T088 replaced it with `LocalityFeed`, still querying `events` / `businesses` / `markets` but rendered by nothing."* ✅
- `development/DEVIATIONS.md:769` now reads *"the provider stays mounted in `layout.tsx` and `/you` still consumes it. Home does not — `page.tsx` renders `LocalityFeed` off `discoverable_items` (T087/T088)."* ✅ — and is now more precise than the brief, which still attributed the consumption to Home rather than the root layout.
- `development/DEVIATIONS.md:783` now scopes the sweep correctly. ✅

**Ground truth, for the record:** `src/app/page.tsx` is eleven lines and imports exactly one thing — `LocalityFeed`. It has never imported `HomeFeed` post-T088. `HomeFeed.tsx` has **zero importers anywhere in the repo**; the only surviving mention is a historical line in `web/build-log/archive-pre-rotation.md`. `MarketContext` is consumed by `layout.tsx` (provider), `/you`, `MarketSelector`, `MarketPill`, and `HomeFeed` (dead) — not by Home.

### Still wrong — needs rewriting

**`development/DEVIATIONS.md:781`** (T117 What (5), on `RecruitmentGrid`):

> "The component stays in use on Home and `/you`."

False. `RecruitmentGrid`'s two importers are `/you/page.tsx` and `HomeFeed.tsx`, and `HomeFeed` is rendered by nothing. It is in use on `/you` only. Should read: *"The component stays in use on `/you`; its other importer, `HomeFeed`, is orphaned dead code."*

**`planning/backlog/decision-item-canonical-urls.md`** — four lines in § *Also folded in*:

| Line | Current text | Problem |
|---|---|---|
| 37 | "`MarketSelector`, `VendorCard`, `RecruitmentGrid` — still rendered, all vendor-era." | Rendered on `/you` only, not on Home. Say where. |
| 38 | "`MarketContext` — reads `markets`, which returns `PGRST205`" | Accurate but understated — omits that the provider is mounted in the **root layout**, so this query fires on every page load app-wide. That is the fact that sets the removal order (§ 6, Phase 1). |
| 40 | "`/you`, `/you/vendor/*`, `/vendors/[slug]`, `/business/[slug]`, `/register-vendor` — vendor-era routes." | **This is the line that generated the bogus work item.** `/you` is not a vendor-era route to be deleted — it is a live nav destination hosting F036's sell CTA and F042's following summary. It needs its own rewrite ticket. Split it out of this list. |
| 43 | "Home is in the same position Explore was in before T117: querying tables that do not exist." | **False.** Home renders `LocalityFeed` off `discoverable_items` and has since T088. The file that queries dead tables is `HomeFeed.tsx`, which Home does not render. Replace with: *"`HomeFeed.tsx` is orphaned dead code — it queries `events` / `businesses` / `markets`, but nothing imports it. The live app-wide dead read is `MarketContext`, mounted in the root layout."* |

---

## 8. Noted in passing, not part of this sweep

Flagging without claiming — these are orphan candidates from other eras and want their own pass, not this one:

- `src/lib/system-member.ts`, `src/lib/onboarding/interest-vocab.ts`, `src/lib/places/reverse-geocode.ts` — no importers found in `src/`. Places/onboarding-era, not vendor-era. Not verified to the standard of § 3.
- `web/package.json` still names the project `movers-makers-shakers`; `INFRASTRUCTURE.md` and `layout.tsx` metadata say "SocialUs". Pre-rebuild identity drift — see `PROJECT.md`.
- `web-t115/` is an uncommitted worktree shadow at the parent level carrying its own copy of every file above, `INFRASTRUCTURE.md` included. Whatever this sweep changes in `web/`, that tree will still hold the old version until it is merged or removed.
