---
purpose: Scope inventory for the vendor/market retirement + You rebuild — three live bugs, every file in the sweep, what is unsafe to delete, and the removal order.
layer: how
status: backlog
---

# Audit: the vendor/market retirement sweep + the You rebuild

**Raised by:** T117 (`planning/backlog/decision-item-canonical-urls.md` § *Also folded in*), DEVIATIONS § T117 *Note — `MarketPill` is now orphaned*.
**Mode:** scope only. Nothing in this pass was deleted, edited, or committed.
**Method:** reverse-dependency graph over `web/src`, `web/tests`, `web/evals`, `web/scripts` (import + dynamic-import + require, `@/` and relative), then reachability from the live route entry-point set. Every table read in `src/` was mapped to its file and checked against migrations `001`–`036`.

> **Scope ratified 2026-09-03.** The retirement sweep and the **You rebuild are one project**, not two. `/you` stays and becomes the producer/organizing surface: the nav goes from three tabs to two — Home is the consumption side (Explore folds into it entirely: search, kind pills, map toggle), You is the production side, with a persistent create **+** in the nav between them. You holds the Member's own listings, groups, drafts, responses, and the create path. Every "delete `/you`" instruction in earlier notes is void.

---

## 1. Three live bugs — fix these regardless of the sweep

These surfaced while tracing the cluster. They are **defects in shipped behaviour**, not cleanup, and they do not depend on any decision below.

### 1.1 ⚠️ `INFRASTRUCTURE.md` tells new developers to run a destructive script

`web/INFRASTRUCTURE.md` § *Database Schema* is the documented setup path for a new environment. Step 1 is:

> Run `001-create-tables.sql` — creates all tables, RLS policies, and indexes

`web/scripts/001-create-tables.sql` opens with:

```sql
drop table if exists reports cascade;
drop table if exists supports cascade;
drop table if exists businesses cascade;
```

…and then builds the **pre-rebuild** schema. A new developer — or the founder on a fresh machine, or anyone onboarding — following this doc against a live database runs three `cascade` drops and then creates tables that contradict the current model. The named tables don't exist today, so the drops are currently no-ops, but the doc is a loaded gun pointed at whatever schema is present, and the second half actively creates the wrong one.

**This is the dangerous one.** It wants a fix ahead of the rest of the sweep, and it is a two-line edit: the correct setup path is the migration set plus `supabase/seeds/the-good-place.sql`, both of which are already documented correctly in the block immediately below. § *Production Hardening* also ships four `create index` statements against `businesses` and `supports` that should go with it.

### 1.2 Dead query fires on every page load, app-wide

`MarketProvider` is mounted in the **root layout** (`src/app/layout.tsx:30`), wrapping every page. On mount it queries `markets`:

```
src/components/MarketContext.tsx:38   client.from('markets').select('*').order('name')
```

That table does not exist; PostgREST answers `PGRST205`; the provider swallows it and leaves `allMarkets` permanently `[]`. Every visitor to Home, Explore, a Member page, an Item page, or the onboarding flow pays a failing round trip. It is invisible to the user but real in the network tab and in Supabase's request counts.

Not "Home consumes MarketContext" — the root layout does, which is strictly broader.

### 1.3 Every signed-in Member sees "List your business"

`AuthCtaButtons` is live in the nav (`layout.tsx` → `TopNavDesktop` → `AuthCtaButtons`). It queries the dead `businesses` table to decide whether to *suppress* the CTA for Members who already sell:

```
src/components/AuthCtaButtons.tsx:29   client.from('businesses').select('id').eq('user_id', uid)
```

The query fails, `hasVendor` stays `false`, and the suppression branch never fires. **Result: the "List your business →" link shows to every signed-in Member**, including ones who already have a `kind='business'` Group. Wrong copy, wrong audience, pointing at a funnel (`/join` → `/register-vendor`) that is itself being retired.

---

## 2. Headline

**62 files. 51 delete, 11 must be edited instead.** The database side is empty: no migration, RLS policy, RPC, grant, or index in the live lineage names a single one of these tables.

The known list in the brief was **13 items of 62**. It missed 25 components, 4 hooks, 4 libs, 5 tests, and 3 SQL files; and it named three things as deletable that are not.

---

## 3. What is NOT safe to delete — read this section first

Eleven files. Each is either mounted in the live app or shared with a surface that ships.

### 3.1 `src/app/you/page.tsx` — **rewrite; ratified as the new production surface**

The riskiest file in the sweep, and it was on the brief's delete list.

Per the ratified scope, `/you` becomes one of **two** nav destinations and takes on the Member's listings, groups, drafts, responses, and the create path. It is also, today, the **sole live host of two shipped features**:

| Component | Ticket / scenario | Only importer |
|---|---|---|
| `components/sell/SellCta.tsx` | T073 — F036 three-branch sell routing | `src/app/you/page.tsx` |
| `components/follows/FollowingSummary.tsx` | T108 — F042 unified Following summary | `src/app/you/page.tsx` |

Delete the file and F036's sell entry point and F042's following summary leave the product with it — along with `SellWalkthrough`, `getDraftGroup`, and `FollowCard`, which have no other reachable path. Both are load-bearing for the surface `/you` is becoming: `SellCta` **is** the create path the rebuild formalises, and `FollowingSummary` is the seed of the responses view.

The page's *other* half — saved vendors, followed vendors, the market row, `RecruitmentGrid`, the vendor-mode link, the email-preference toggle — reads seven dead tables and is genuinely dead. The rewrite keeps two components, deletes the rest, and adds the new surface.

**Consequence for sequencing:** the sweep cannot finish without the You rebuild, because `/you` is what keeps `MarketSelector`, `VendorCard`, `RecruitmentGrid`, and `MarketContext` reachable. They are one project (§ 7, Phase 2).

### 3.2 `src/app/layout.tsx` — **edit; it is the root layout**

```
src/app/layout.tsx:5   import { MarketProvider } from "@/components/MarketContext"
src/app/layout.tsx:30  <MarketProvider>
src/app/layout.tsx:36  </MarketProvider>
```

`MarketContext` is deletable, but **only after** this import and wrapper come out. Delete the component first and the entire app fails to build. Fixes bug 1.2.

### 3.3 `src/components/AuthCtaButtons.tsx` — **edit; live in the root layout**

Not on the brief's list, and live in the nav. Fixes bug 1.3. Removing the `hasVendor` branch is a copy + routing decision — where does that CTA point now that `kind='business'` Groups replaced `businesses`, and now that the nav has a persistent create **+**? — not a mechanical deletion. Settle it alongside § 3.4.

### 3.4 `src/app/join/page.tsx` — ✅ **DONE 2026-09-03** (repointed at `/you`; QR removed)

> **Resolved.** The QR-durability question below is void — the PM ratified **no QR codes anywhere** on 2026-09-03 (`playbooks/PLATFORM-PATTERNS.md` § *No platform-generated QR codes; producer-generated business QR stays open*). With no printed artifact in the field, `/join` was repointed like any other link: `/you` when signed in, `/auth/login?next=/you` when not, marked interim in the file until the You rebuild lands. `/register-vendor` therefore **deletes outright — no redirect stub needed**, which settles the § 4.1 note. The original analysis is kept below as the record of why it was blocked.

### 3.4 (original analysis — superseded)

`/join` stays. Its four links and one **generated QR code** currently target `/register-vendor`, which is in the delete list:

```
src/app/join/page.tsx:23   const target = `${origin}/register-vendor`   ← QR code destination
src/app/join/page.tsx:53   href="/register-vendor"
src/app/join/page.tsx:60   href="/auth/login?next=/register-vendor"
src/app/join/page.tsx:111  href="/register-vendor"
```

**The QR code is the constraint.** A printed or shared code cannot be repointed after the fact — it resolves to whatever URL was baked in when it was generated. Any code already on a flyer, a table card, or in a message thread will keep resolving to `/register-vendor` forever. So `/join`'s new target must be a **durable URL** the platform commits to keeping: something stable enough to outlive the You rebuild, Phase 3, and the next naming pass. A URL chosen for convenience now becomes a dead code in the field later.

Two constraints on the choice, both flagged, neither decided here:

- **It must survive the rebuild.** `/you` is being restructured; a deep link into a sub-path of it is the least durable option available. `/you` itself, or a dedicated stable entry point, is safer than anything nested.
- **It cannot require auth to be meaningful.** The QR's job is to reach someone who is not yet a Member. Whatever it targets has to render something useful to an anonymous visitor and then route them into signup — which is what the current `?next=` pattern does at line 60 and what any replacement must preserve.

Worth checking before choosing: whether any code has already been generated and distributed. If yes, the old route may need a redirect rather than a deletion, and that changes § 4.1.

### 3.5 `src/lib/slugify.ts` — **prune one function; do not delete the file**

```
uniqueSlug()   → reads `businesses`. Only importer: /register-vendor. DEAD.
toSlug()       → 9 live importers. LOAD-BEARING.
```

`toSlug` is used by `lib/feed/item-url.ts` (every Item link on Home and Explore), `lib/items/qr-card.ts`, `actions/group/create.ts`, `actions/group/update-draft.ts`, and the three `you/sell/*/actions.ts` handlers. Deleting this file breaks Item URLs, QR cards, and every composer. Remove `uniqueSlug` and the now-unused `createClient` import at line 1; keep the rest.

### 3.6 `src/lib/types.ts` — **prune ~14 types; do not delete the file**

Mixed file. Dead: `Business`, `Vendor`, `Market`, `MarketVendor`, `VendorCategory`, `Follow`, `EventType`, `EventHostType`, `EventStatus`, `PlatformEvent`, `VendorBulletin`, `BulletinDelivery`, `VendorEventName`, `VendorAnalyticsEvent`, `VendorStatsDaily`, `UserPreferences`, `Support`, `Report`, `WEEKDAYS`, `WeekdaySlug`, `REPORT_PILLARS`, `ReportPillar`, `OWNERSHIP_TIERS`.

**Must survive: `OwnershipTier`.** `lib/map-config.ts` imports it to type `PIN_COLORS`, and `map-config.ts` is live — `ExploreMap` (shipped in T117) reads `MAP_DEFAULTS` from it. Delete `types.ts` and Explore's map view stops building. Note that the map toggle folds into Home under the ratified nav change, so this dependency moves but does not go away.

### 3.7 `src/lib/map-config.ts` — **keep as-is; verify, do not touch**

Live via `ExploreMap` → `MAP_DEFAULTS`. After the sweep, `PIN_COLORS` and `CLUSTER_CONFIG` have no runtime consumer — but `web/CLAUDE.md:43` explicitly **reserves** ownership-tier colours for badges and map pins and forbids reusing them as accents, and T117's own note repeats the reservation. Removing `PIN_COLORS` contradicts a standing convention. Recommend: leave the file whole, and if the reservation is stale, retire it deliberately in its own decision rather than as a side effect of this sweep.

### 3.8 `src/components/BottomNav.tsx` — **rewrite with the nav change**

Two stale route predicates today:

```
src/components/BottomNav.tsx:11  p === '/map'                  ← no /map route exists (never did, post-rebuild)
src/components/BottomNav.tsx:12  p.startsWith('/following')    ← /following is in this sweep's delete list
```

Under the ratified three-tabs-to-two change this file is rewritten wholesale anyway — Explore folds into Home, a persistent create **+** lands between the two remaining tabs. The stale predicates go with that rewrite rather than getting a separate patch. `TopNavDesktop` lives in the same file and needs the same treatment.

### 3.9 `web/tests/map-config.test.ts` — **prune, do not delete**

`MAP_DEFAULTS` assertions cover live code. The `PIN_COLORS` and `CLUSTER_CONFIG` assertions cover code that is about to have no consumer. Keep the file, keep or drop those blocks in step with § 3.7.

### 3.10 `web/INFRASTRUCTURE.md` — **edit; this is bug 1.1**

§ *Database Schema* and the § *Production Hardening* index block. The § *"The Good Place"* showcase-seed block immediately below is current and correct; keep that.

### 3.11 `web/TEST-CHECKLIST.md` — **edit**

Lines 16–56 (manual smoke tests F001 Map View / F002 Business Detail Card / F003 Business Registration / F004 Shareable Listing / F005 Community Signals) and lines 73–85 (a Playwright coverage table listing nine F001–F005 spec files **already deleted** in the 2026-06-21 pre-rebuild eval retirement) are entirely dead. Lines 57–71 (Auth, Cross-Cutting) are live and current.

---

## 4. The complete delete inventory — 51 files

Every entry below was verified unreferenced by tracing importers, not by assumption. "After" means: unreferenced once the eleven § 3 edits land.

### 4.1 Routes — 10 files

| File | Dead tables it reads | Inbound links |
|---|---|---|
| `src/app/business/[slug]/page.tsx` | `businesses` | none |
| `src/app/business/[slug]/BusinessListingPage.tsx` | — | parent only |
| `src/app/vendors/[slug]/page.tsx` | `businesses`, `markets`, `market_vendors`, `vendor_categories` | `VendorCard`, `BulletinFeedCard` (both dead) |
| `src/app/vendors/[slug]/VendorProfilePage.tsx` | — | parent only |
| `src/app/register-vendor/page.tsx` | `businesses`, `markets`, `market_vendors` | **`/join` + a generated QR code — see 3.4** |
| `src/app/following/page.tsx` | `businesses`, `markets`, `market_vendors`, `vendor_categories`, `follows` | `BottomNav` predicate only (3.8) |
| `src/app/you/vendor/page.tsx` | `businesses`, `follows`, `markets`, `market_vendors`, `vendor_bulletins`, `vendor_events`, `vendor_stats_daily` | `/you` (3.1) |
| `src/app/you/vendor/bulletins/page.tsx` | `businesses`, `vendor_bulletins`, `bulletin_deliveries` | `/you/vendor` |
| `src/app/you/vendor/bulletins/new/page.tsx` | `businesses` | `/you/vendor` |
| `src/app/you/vendor/bulletins/[id]/page.tsx` | `vendor_bulletins`, `bulletin_deliveries` | `/you/vendor` |

`/register-vendor` may need a **redirect stub rather than a deletion** if QR codes are already in circulation — see § 3.4.

Note: `/you/following` (T109, F042) is a **different, live** route, and a candidate to fold into the rebuilt `/you`. Do not confuse it with `/following`.

### 4.2 Components — 25 files

**On the brief's list (6):** `HomeFeed.tsx` · `MarketContext.tsx` (after 3.2) · `MarketPill.tsx` · `MarketSelector.tsx` (after 3.1) · `VendorCard.tsx` (after 3.1) · `BulletinFeedCard.tsx`

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

### 4.3 Hooks — 4 files, all missed by the brief

`useMapBusinesses.ts` (reads `businesses`) · `useSearchSuggestions.ts` (reads `businesses`) · `useSupport.ts` (reads `supports`) · `useSupportCount.ts` (reads `supports`, zero importers already)

`hooks/useAuth.ts` **stays** — live via `MagicLinkForm` and `EmailFirstSignup`.

### 4.4 Lib — 4 files, all missed by the brief

`lib/categories.ts` (the `bread` / `produce` / `honey-jams` vendor taxonomy; all five importers are in this sweep) · `lib/market-dates.ts` + `lib/market-dates.test.ts` (market schedule formatting) · `lib/geocoding.ts` (Mapbox forward geocode; only importers are `/register-vendor` and `useSearchSuggestions`, both in this sweep) — take `tests/geocoding.test.ts` with it.

⚠️ If the rebuilt `/you` or the folded-in Home search wants forward geocoding, keep `lib/geocoding.ts`. It is dead *today* only because both its consumers are dying; it is not vendor-specific code.

`lib/supabase.ts` **stays** — live via `FollowingSummary` and `useAuth`.

### 4.5 Tests — 5 files

`tests/types.test.ts` (asserts `OWNERSHIP_TIERS` / `REPORT_PILLARS`) · `tests/report-pillars.test.ts` · `tests/ownership-badge.test.ts` · `tests/ownership-selector.test.ts` · `tests/geocoding.test.ts`

### 4.6 SQL and seeds — 3 files

`web/scripts/001-create-tables.sql` — **bug 1.1.** The pre-rebuild schema (`businesses`, `supports`, `reports`), opening with three `drop table … cascade`.
`web/scripts/seed-folsom-coffee.sql` — 22 coffee shops into `businesses`.
`web/supabase/seed-markets.sql` — Sacramento markets + mock vendors into `markets` / `businesses` / `vendor_categories`. Already known broken; the 2026-06-21 pre-rebuild eval retirement cites it erroring with `relation "markets" does not exist`.

---

## 5. Database side — nothing to remove

Checked all 36 migrations, `supabase/seeds/`, `supabase/tests/`, `supabase/test-helpers/`, and `supabase/snippets/`.

**No migration in the live lineage creates, alters, grants on, indexes, or writes an RLS policy against any of these tables:** `businesses`, `markets`, `market_vendors`, `vendor_categories`, `vendor_bulletins`, `bulletin_mutes`, `bulletin_deliveries`, `vendor_events`, `vendor_stats_daily`, `user_preferences`, `supports`, `reports`, `events`, `follows`.

The rebuild did not *drop* them — it started a clean migration set that never contained them. The only two hits anywhere in `supabase/migrations/` are the word "markets" inside a comment (`017_places.sql:280`, about b1 launch localities) and an ADR filename (`015_items.sql:19`). Both are prose; leave them.

Consequences worth stating plainly:

- **No migration to write.** No `drop table`, no policy cleanup, no MV rebuild. The sweep is a code-and-docs change only, which is why it needs no M4 deploy-checklist gate on schema grounds. The You rebuild may need one on its own merits.
- **`discoverable_items` is untouched.** The MV depends on `items` / `members` / `locations` / `groups` — none of them in this sweep.
- **`tests/rls-coverage.test.ts` is unaffected.** It queries `pg_tables` live; the dead tables are not there to fail on.
- **`member_follows` (migration 010) is live** and must not be confused with the dead `follows`. Same for `member_saved_searches` vs `supports`.

## 6. Evals — nothing to remove

All 11 feature specs and all 15 phase-0/phase-1 specs are clean. No eval references a dead table or a dead route. The specs that match on "vendor / market / business" (F035, F036, F037, F042) are about `kind='business'` **Groups** — the current model, not the vendor era. The pre-rebuild F001–F005 specs were already retired on 2026-06-21; only the stale coverage table in `TEST-CHECKLIST.md` still lists them (§ 3.11).

The nav change and the You rebuild **will** need new evals — F036 and F042 both assert against `/you` as it exists today, and Explore's specs assume `/explore` is a route.

---

## 7. Recommended order — order matters

Six phases. The rule behind the ordering: **detach live code from the cluster before deleting any of the cluster**, and fix the live bugs before the cleanup that would otherwise bury them.

> **Phase 0 closed 2026-09-03.** `/join` is repointed (§ 3.4), `TEST-CHECKLIST.md` is rewritten (§ 3.11), the three live bugs are fixed and merged, and `map-config.ts` / `tests/map-config.test.ts` / `BottomNav.tsx` were verified to need no edit. **Two corrections to the plan below.** (1) **Phases 3 and 4 swap.** The `slugify.ts` and `types.ts` prunes cannot run before the deletes — removing an export while an importing file is still on disk breaks the build. Verified empirically: pruning `uniqueSlug` errors on `/register-vendor`; pruning `types.ts` to `OwnershipTier` alone produces 65 errors across 26 files. (2) **`/you` is now the single tether.** With `MarketProvider` unhooked from the root layout, `HomeFeed.tsx` and `MarketPill.tsx` are at zero importers, and everything else in the cluster hangs off `src/app/you/page.tsx` alone — so the `HomeFeed` / `MarketPill` / `EventCard` subtree is deletable without waiting on the You rebuild.

**Phase 0 — the one remaining open question (PM)** ✅ *closed 2026-09-03*
Where does `/join` point? Constraints and the durability problem in § 3.4; check first whether QR codes are already in circulation, since that decides whether `/register-vendor` deletes or becomes a redirect. Blocks Phases 1 and 4.
*(The `/you` question is settled — see the scope note at the top.)*

**Phase 1 — the three live bugs (5 files, no deletions)**
`INFRASTRUCTURE.md` § Database Schema + index block (bug 1.1) → `layout.tsx`, dropping `MarketProvider` (bug 1.2) → `AuthCtaButtons.tsx`, dropping the `businesses` read (bug 1.3) → `join/page.tsx` per Phase 0.
*Why first:* these are defects, not cleanup, and 1.1 in particular should not wait on a rewrite. Unhooking `MarketProvider` here is also what makes `MarketContext` deletable at all in Phase 4. Ship this on its own; it stands alone and it is small.

**Phase 2 — the You rebuild + the nav change (2 files rewritten, no deletions)**
`you/page.tsx` and `BottomNav.tsx`. Three tabs to two, Explore folds into Home, persistent create **+**. Keep `SellCta` and `FollowingSummary`; add listings, groups, drafts, responses.
*Why second:* `/you` is what keeps `MarketSelector`, `VendorCard`, `RecruitmentGrid`, and `MarketContext` reachable — nothing in Phase 4 is safely deletable until this lands. **This is the phase that needs `scope` + `review`.** It touches two shipped scenarios (F036, F042), both nav components, and the primary information architecture. It is a feature, not a cleanup, and it is where the effort in this project actually sits.

**Phase 3 — prune the three shared files (3 files, no deletions)**
`slugify.ts` (remove `uniqueSlug`) → `types.ts` (keep `OwnershipTier`) → `tests/map-config.test.ts`.
*Why third:* after Phases 1–2 nothing live needs the dead exports, and the typecheck passes at every step.

**Phase 4 — delete the code (48 files)**
Leaves-first, so the tree typechecks after each commit: hooks and libs → leaf components (`Toast`, `AuthGateModal`, `PillarSelector`, `Sparkline`, `OwnershipBadge`, `OwnershipSelector`, `SearchBar`, `MapPreview`, `BusinessDetailCard`, `SupportButton`, `ReportForm`, `CategoryInput`, `EventCard`, `RecruitmentGrid`, `FollowButton`, `VendorCard`, `BulletinFeedCard`, `MarketPill`, `MarketSelector`, `MarketContext`, `HomeFeed`, `AuthButton`, `admin/*`) → routes (`/you/vendor/**` deepest-first, then `/following`, `/register-vendor` or its redirect stub, `/vendors`, `/business`) → the 5 tests.
*Why after 1–3:* every one of these is provably unreferenced only once the edits above land.

**Phase 5 — the SQL files and the remaining docs (4 files)**
Delete the 3 SQL files, then rewrite `TEST-CHECKLIST.md` lines 16–56 and 73–85.
*Why last:* `INFRASTRUCTURE.md` stops citing the SQL files back in Phase 1, so by here nothing points at them.

**Sequencing note.** Phase 1 is a small standalone bug-fix ticket. Phase 2 is the real project. Phases 3–5 are mechanical and reviewable in bulk. Splitting them is the point — if anything regresses, it regresses in a half you can read.

---

## 8. Doc corrections — all applied

The six line-level corrections identified in this audit are **already applied on disk** and verified:

| File | Line | State |
|---|---|---|
| `development/tickets/T117-explore-items-rewire.md` | 36 | ✅ `MarketContext` correctly attributed to `/you`, with Home explicitly excluded |
| `development/tickets/T117-explore-items-rewire.md` | 73 | ✅ `HomeFeed.tsx` correctly described as orphaned, unmounted at T087/T088 |
| `development/DEVIATIONS.md` | 769 | ✅ names the root-layout mount and excludes Home |
| `development/DEVIATIONS.md` | 781 | ✅ `RecruitmentGrid` now "in use on `/you`; its other importer, `HomeFeed`, is orphaned dead code" |
| `planning/backlog/decision-item-canonical-urls.md` | 37–41 | ✅ `/you` split out of the deletable-routes list with its own line; `MarketContext`'s root-layout mount named |
| `planning/backlog/decision-item-canonical-urls.md` | 43 | ✅ replaced — Home correctly described as rendering `LocalityFeed` off `discoverable_items` |

**Ground truth, for the record:** `src/app/page.tsx` is eleven lines and imports exactly one thing — `LocalityFeed`. It has never imported `HomeFeed` post-T088. `HomeFeed.tsx` has **zero importers anywhere in the repo**; the only surviving mention is a historical line in `web/build-log/archive-pre-rotation.md`. `MarketContext` is consumed by `layout.tsx` (provider), `/you`, `MarketSelector`, `MarketPill`, and `HomeFeed` (dead) — not by Home.

The stub's § *Also folded in* still frames `/you` as needing "its own rewrite ticket to drop the vendor-era reads it still carries." That is now an understatement — `/you` is the production surface of a two-tab nav. Worth updating when the You rebuild gets its scenario.

---

## 9. Noted in passing, not part of this sweep

Flagging without claiming — orphan candidates from other eras that want their own pass:

- `src/lib/system-member.ts`, `src/lib/onboarding/interest-vocab.ts`, `src/lib/places/reverse-geocode.ts` — no importers found in `src/`. Places/onboarding-era, not vendor-era. Not verified to the standard of § 4.
- `web/package.json` still names the project `movers-makers-shakers`; `INFRASTRUCTURE.md` and `layout.tsx` metadata say "SocialUs". Pre-rebuild identity drift — see `PROJECT.md`.
- `web-t115/` is an uncommitted worktree shadow at the parent level carrying its own copy of every file above, `INFRASTRUCTURE.md` included. Whatever this sweep changes in `web/`, that tree will still hold the old version until it is merged or removed.
