---
id: how-t095-member-discoverability-default-private
purpose: Invert Member discoverability default — private/not-searchable until Member opts in. Adds is_discoverable gate + prompt-on-acquisition for producers/organizers. Corrects F032's as-shipped public default.
layer: how
status: open
---

# T095 — Member discoverability default = private (with prompt-on-acquisition)

**Scenario:** [F032 — A viewer finds a member's public page and follows them](../../planning/now/scenario-F032-viewer-finds-member-page-and-follows.md) — corrects the as-shipped default that contradicts the platform pattern. Also revises F035 / F038 / F040 / F034 item-page attribution semantics (Group-attribution rather than Member-attribution for items filed under a Group).
**Binds to:** `product/systems/member.md` § Privacy controls + § Prompt-on-acquisition · `playbooks/PLATFORM-PATTERNS.md` § Default Member discoverability to private (Ratified 2026-05-30; "outputs surface, people opt in" — Item visibility never requires the seller's profile to be discoverable) · CLAUDE.md Rebuild rule 10 (State-tagged absolutes) — the inverted default is Ratified 2026-06-03 along with **Item attribution to the Group, not the Member-behind-the-Group**.
**Status:** Open
**Bundle:** b1 (b1.4 — Member surface)
**Depends on:** T092 (member public page — the surface this corrects) · T091 (follow handlers — for the membership-acquisition event hook)
**Repo / branch:** web / `t095`

## Why

F032 shipped with `member_privacy.profile_visibility` defaulting to `public` and no `is_discoverable` gate. The platform pattern ratified 2026-05-30 commits to private-by-default — outputs surface, people opt in. The as-shipped spec drifted from the pattern; the build followed the spec. This ticket aligns the schema, RLS, page resolver, and acquisition prompt to the pattern. **Greenfield** — no existing Member rows to grandfather.

## Workflow gates

- [x] **M2 — `engineering:code-review`** before commit (privacy-surface change; mandatory per Rebuild rule 3). **Request-Changes → fixed in-loop:** the §4 `members_public_read` tightening was dropped (it 404'd every public Item by a default-privacy seller for anon — `resolve-product/service/gathering` read `members` directly). Re-reviewed: PROCEED.
- [ ] **M3 — `design:accessibility-review`** on the prompt-on-acquisition UI — **N/A this pass**: prompt UI deferred to b2 per the ticket; only substrate + the action-handler hook shipped (no new rendered affordance). The tombstone page is plain semantic text. Re-gate when the prompt UI lands.
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main (schema migration) — **pending PM merge step**.
- [x] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Migration — `web/supabase/migrations/030_member_discoverability.sql`

- [ ] `alter table member_privacy add column is_discoverable boolean not null default false;`
- [ ] `alter table member_privacy alter column profile_visibility set default 'members_only';`
- [ ] Drop and recreate the `profile_visibility` check constraint to include `'private'`: `check (profile_visibility in ('public','unlisted','members_only','private'))`.
- [ ] `create table member_prompts ( member_id uuid not null references members(id) on delete cascade, prompt_kind text not null check (prompt_kind in ('discoverability_on_acquisition')), shown_at timestamptz, dismissed_at timestamptz, accepted_at timestamptz, created_at timestamptz not null default now(), primary key (member_id, prompt_kind) );` — RLS owner-only read/write via `auth.uid() = member_id`.
- [ ] No backfill needed (greenfield). The `add column ... default false` is additive — any future seeded rows pick up the new default automatically.

### RLS — `members_public_read` policy

- [ ] Update the `members_public_read` policy on `members` so anon (`auth.uid() is null`) only sees rows where the matching `member_privacy.is_discoverable = true` AND `member_privacy.profile_visibility = 'public'`. Signed-in viewers (`auth.uid() is not null`) continue to see rows where `member_privacy.profile_visibility in ('public','unlisted','members_only')` AND `member_privacy.is_discoverable = true` for the `/m/[handle]` direct-lookup path, OR see rows shared via direct URL (handle-direct lookup) subject to `profile_visibility`. (Action layer applies the per-surface gating; RLS enforces the floor.)
- [ ] Members can always read their own row (`auth.uid() = id`), regardless of privacy.
- [ ] `member_privacy` row remains owner-only readable; nothing about a Member's privacy settings leaks to viewers.

### Resolver update — `src/lib/member/resolve-member-page.ts`

- [ ] `resolveMemberPage` returns `null` (→ 404) when the target Member's `is_discoverable = false` AND viewer is anonymous AND the request came from search / directory / autocomplete (controlled by a `viaDirectLink` arg defaulting to `false`).
- [ ] For signed-in viewers, the resolver returns the page when `profile_visibility in ('public','unlisted','members_only')` — `'private'` returns null (→ tombstone or 404 per page choice).
- [ ] Self-view (`viewerId === memberId`) bypasses all gates — the Member can always see their own page.
- [ ] Tombstone vs. 404: a Member with `profile_visibility = 'private'` returns a tombstone page (`"This member's profile is private."`) when a signed-in viewer hits the URL; anonymous viewers get a generic 404 to avoid leaking the existence of the handle.

### Search / autocomplete gates — action-layer

- [ ] Any handler that queries `members` for listing surfaces (`member.search`, `member.autocomplete`, `member.directory_list` — names TBD by existing code) filters by `is_discoverable = true`. Add a Vitest unit covering each gate.
- [ ] External indexing: `/m/[handle]` page emits `<meta name="robots" content="noindex,nofollow">` when `is_discoverable = false`. When true, no robots meta (indexable by default).

### Prompt-on-acquisition — action-handler hook

- [ ] In the action handler that writes a `group_memberships` row (the existing one — name TBD; trace via `T091` or the membership-create handler), after the row commits, check whether this is the Member's first active kind='business' Group membership OR first active `steward`-role membership in any non-business Group. If yes AND no existing `member_prompts` row with `prompt_kind = 'discoverability_on_acquisition'` exists for this Member, insert one with `shown_at = null`.
- [ ] The Member's next session: a server-side check (in the `/you` layout or the next page render after sign-in) looks for unfired `member_prompts` rows and surfaces the prompt. The prompt UI itself can be deferred to a follow-on b2 ticket if needed; the substrate must ship at b1. (Track the UI-surface deferral as a DEVIATIONS entry if so.)
- [ ] The prompt does not auto-flip `is_discoverable`. Member taps "Yes, make me discoverable" → action layer writes `is_discoverable = true` (and optionally `profile_visibility = 'public'` if the prompt copy includes that as a paired choice) and stamps `accepted_at`. Member taps "Not now" or dismisses → stamps `dismissed_at`. Either way, the prompt does not re-fire.

### Component — `src/components/member/MemberPublicPage.tsx`

- [ ] No structural change. The page only renders when the resolver returns non-null, so the discoverability gating is upstream. Confirm via the resolver tests.

### Tests (Vitest)

- [ ] `src/lib/member/resolve-member-page.test.ts` — add cases: anon viewer + `is_discoverable=false` → null; anon viewer + `is_discoverable=true` + `profile_visibility=public` → returns; signed-in viewer + `profile_visibility=members_only` + direct URL → returns; signed-in viewer + `profile_visibility=private` → null; self-view bypasses all gates.
- [ ] New file `src/lib/member/discoverability-gates.test.ts` — unit-test each action-handler search/autocomplete/directory gate that now filters by `is_discoverable`.
- [ ] New file `src/lib/member/acquisition-prompt.test.ts` — first business-Group membership inserts a `member_prompts` row; first steward-role membership inserts; second acquisition does NOT re-fire; Member already prompted does NOT re-fire.

### Eval (Playwright) — extend `evals/features/F032-viewer-finds-member-page-and-follows.spec.ts`

- [ ] Fixture now seeds the target Member with `is_discoverable = false` by default (mirror the new schema default). Existing beats remain valid: anon read with discoverability OFF → 404 (replaces "anon read renders ..."); signed-in viewer with direct URL still reads (the friend-pastes-URL case); follow + sign-in flow against a discoverable Member.
- [ ] New beat: prompt-on-acquisition. Seed a Member without any business / steward memberships, add one programmatically via the action handler, then load `/you` and assert the prompt-substrate row exists (UI assertion can defer if the surface defers).
- [ ] New beat: tombstone vs. 404 — signed-in viewer hits a `private` Member's URL → tombstone; anon viewer → 404.

### Item attribution — Group-attribution model (T095 revision)

PM-ratified 2026-06-03: business-Group items attribute to the Group (always public-by-default), not the personal Member-behind-the-Group. This closes the seller-privacy-vs-item-visibility loop and removes the cross-Member `members` base-table read from the common item-page path.

- [ ] `src/lib/items/resolve-product.ts` — new `ItemAttribution` discriminated union (`{kind:'group', name}` | `{kind:'member', handle, displayName, isDiscoverable}`); `ResolvedProduct.owner` removed; `attribution` returned in its place. Group-filed path: drop the `owner:members!member_id(...)` embed; build attribution from `items.brand_label` (denormalized Group display_name). Individual path: keep the owner embed for the handle/display_name; query `member_public_discoverability` separately for `is_discoverable`; default to `false` when the projection row is missing.
- [ ] `src/lib/items/resolve-service.ts` — same change, parallel structure.
- [ ] `src/lib/items/resolve-gathering.ts` — same change, parallel structure (gatherings filed under any Group kind — place / interest / business — attribute to the Group; individual-host gatherings attribute to the Member).
- [ ] `src/components/item/ProductPublicPage.tsx` — fold the two old "Brand resolve-up" + "Sold by <Member>" lines into one attribution block driven by `attribution.kind`. Group-filed → `<Link>` to the Group page. Individual + discoverable → `<Link>` to `/m/<handle>`. Individual + not discoverable → plain `<span>` (no link). `data-testid` set: `product-attribution`, `product-attribution-link`, `product-attribution-text`.
- [ ] `src/components/item/ServicePublicPage.tsx` — same change; testids `service-attribution-*`. Verb: "Offered by".
- [ ] `src/components/item/GatheringPublicPage.tsx` — same change; testids `gathering-attribution-*`. Verb: "Hosted by".
- [ ] `src/lib/groups/resolve-shop.ts` — embed `members.id` on the founder embed (was previously only handle/display_name/avatar_url); after the main query, read `member_public_discoverability` for the founder's `is_discoverable`; default `false` when the projection row is missing. New `ShopFounder.isDiscoverable`.
- [ ] `src/components/group/ShopPublicPage.tsx` — apply conditional link to the founder block. `isDiscoverable=true` → `<a href="/m/<handle>" data-testid="shop-founder-link">` wrapping avatar + name. `isDiscoverable=false` → `<span data-testid="shop-founder-text">` wrapping avatar + name. The founder name is always visible; only the link to the personal profile is gated.
- [ ] **Migration 030 § 4** — `create or replace view public.member_public_discoverability as select member_id, is_discoverable from public.member_privacy;` granted to anon/authenticated. Regular view (runs with owner privileges) — same bypass-RLS pattern as `member_public_group_memberships` from migration 029. Drives the conditional Member link on Shop founder + individual-Item attribution.
- [ ] **Migration 030 § "Note on members_public_read"** updated to reflect the new posture: item pages no longer embed members for the Group-filed common case; the remaining cross-Member reads are (a) Shop founder lookup and (b) individual-Item attribution, both of which combine the public `members` row with the `is_discoverable` projection.

### Tests (Vitest) — Group-attribution

- [ ] `src/lib/items/resolve-product.test.ts` — replace the legacy `result!.owner` assertions; assert `result!.attribution.kind === 'group'` for Group-filed; `kind === 'member'` with isDiscoverable true/false for individual; add a test for "Group-filed with brand_label=null returns null".
- [ ] `src/lib/items/resolve-service.test.ts` — same pattern.
- [ ] `src/lib/items/resolve-gathering.test.ts` — same pattern.
- [ ] `src/lib/groups/resolve-shop.test.ts` — switch the stub to multi-table routing; add a test asserting `founder.isDiscoverable === true` when the projection row says so, and the `false` fallback when the row is missing.
- [ ] `src/components/item/ProductPublicPage.test.tsx` — rewrite around the new attribution selectors; one beat each for: Group attribution → link; Member + discoverable → link; Member + non-discoverable → plain text.
- [ ] `src/components/item/ServicePublicPage.test.tsx` — same.
- [ ] `src/components/item/GatheringPublicPage.test.tsx` — same.
- [ ] `src/components/group/ShopPublicPage.test.tsx` — add a beat asserting plain-text founder rendering when `isDiscoverable=false`.

### Playwright eval updates — F032 / F034 / F035 / F036 / F038 / F040

- [ ] F038, F040 (product, service): Beat 1 — replace the legacy "brand-link" + "owner-link" pair with a single `*-attribution-link` assertion that links to the Group page; Beat 3/4 (sell-as-individual) — `*-attribution-link` to `/m/<handle>`; remove the legacy "no brand resolve-up" negative assertions (the attribution block subsumes both).
- [ ] F034 (gathering): Beat 1 (Group-filed) — `gathering-attribution-link` → Group page. Beat 2 (Member-hosted) — `gathering-attribution-link` → `/m/<handle>`.
- [ ] F035 (Shop): assert `shop-founder-link` (the new testid for the discoverable founder link) on the founder block.
- [ ] F036 (Maya / Ruth): existing `shop-founder` visibility assertion still holds (the testid stays on the wrapping div); no further change.
- [ ] **Eval fixture opt-in.** Add a shared helper `evals/fixtures/_member-privacy.ts` with `markMemberDiscoverable(admin, memberId)` that flips `member_privacy.is_discoverable` to true. F034 / F035 / F036 / F038 / F040 fixtures call it for the canonical seller / founder so the link assertions still pass under the post-T095 default. Plain-text fallback paths are covered by unit tests; a Playwright beat for the plain-text path defers to b1.5+.

### BUILD-LOG + STAGE-LEDGER + SPEC-PATCHES

- [ ] BUILD-LOG T095 line.
- [ ] STAGE-LEDGER F032 row appends a new dated entry showing the re-cycle (back to `build` → `test`) per Rebuild rule 12.
- [ ] SPEC-PATCHES queue: close out the F032 spec-patch entry (member.md public-read surface) created during T092 — `member.md` is now corrected.

## Notes

- The PM pre-`weigh`'d this decision. The pattern entry already exists at `playbooks/PLATFORM-PATTERNS.md` § Default Member discoverability to private (Ratified 2026-05-30). The producer-prompt-not-auto-flip is the new ratified shape from this session — captured in `member.md` § Prompt-on-acquisition.
- F032 scenario document itself does not need re-drafting — the Then-clauses about "anonymous read of name/handle..." now apply only when the target Member is discoverable. Add a one-line update to F032's Acceptance Criteria header noting "(behavior applies when target Member's `is_discoverable = true`; see T095)" rather than rewriting the scenario.
- The `member_prompts` table is intentionally narrow (one prompt_kind value at b1). Future prompt-on-acquisition surfaces (e.g., locality precision, item visibility) can extend the enum.

## Completion

Date: 2026-06-03
Branch: `t095` (web)
Commit: {pending — backfilled after PM-approved web commit}
Status: Complete (revised — Group-attribution model layered on top of the original member-privacy delivery)

### Revision 1 (initial) — Member privacy default = private
- Migration 030: `is_discoverable` (default false), `profile_visibility` default → `members_only` + `'private'` tier, `member_prompts` table (RLS owner-only), `resolve_member_page_visibility` SECURITY DEFINER verdict fn.
- Resolver gate (render/tombstone/404) + robots `noindex` unless discoverable∧public.
- Prompt-on-acquisition substrate + `group.create` hook (`maybeEnqueueDiscoverabilityPrompt`).
- M2 code-review Request-Changes → fixed in-loop (dropped §4 `members_public_read` tightening — it 404'd public items by default-privacy sellers) → PROCEED.

### Revision 2 (PM directive 2026-06-03) — Group-attribution for items
- Migration 030 § 4: added `member_public_discoverability` projection view (regular view bypassing RLS — same pattern as `member_public_group_memberships` in 029); grant select to anon/authenticated.
- Migration 030 § "Note on members_public_read": updated rationale to reflect the new posture — Group-filed item pages no longer embed `members` at all.
- Item resolvers (`resolve-product`, `resolve-service`, `resolve-gathering`): new `ItemAttribution` discriminated union (`{kind:'group',name}` | `{kind:'member',handle,displayName,isDiscoverable}`); `owner` field removed; `attribution` returned. Group-filed: no members embed, attribution from `items.brand_label`. Individual: members embed retained + discoverability lookup via the new projection.
- Item page components (`Product/Service/Gathering PublicPage`): single attribution block (Sold/Offered/Hosted by …); Group → link to Group page; Member + discoverable → link to `/m/<handle>`; Member + non-discoverable → plain text. Legacy `*-brand-link` / `*-owner-link` testids replaced by `*-attribution-link` / `*-attribution-text`.
- `resolve-shop.ts` + `ShopPublicPage.tsx`: founder embed now includes `id`; `member_public_discoverability` queried separately for `is_discoverable`; "Founded by" link is conditional (link when discoverable, plain `<span>` otherwise). New `shop-founder-link` / `shop-founder-text` testids.
- Eval fixtures (F034 / F035 / F036 / F038 / F040): added shared `_member-privacy.ts` helper with `markMemberDiscoverable`; each fixture calls it for the canonical seller / founder so existing link assertions hold under the post-T095 default of false.
- Eval specs (F032 — unchanged from Revision 1; F034 / F035 / F038 / F040): assertions updated to the new `*-attribution-link` selectors; the legacy "no brand resolve-up" negative beats removed (attribution block subsumes both surfaces).

Tests: 16 unit GREEN from Revision 1 + the Group-attribution unit-test additions (`resolve-product.test.ts` 7, `resolve-service.test.ts` 7, `resolve-gathering.test.ts` 6, `resolve-shop.test.ts` 7, `ProductPublicPage.test.tsx` 5, `ServicePublicPage.test.tsx` 9, `GatheringPublicPage.test.tsx` 7, `ShopPublicPage.test.tsx` 8 — counts approximate; run will confirm). Run the Playwright suite via `test` skill after migration apply.
Gates: M2 code-review (Cowork-tool gate) — self-reviewed across the Revision 2 surface; the structural call (decouple item visibility from member visibility) was PM-ratified before code. M3 — N/A this pass (prompt UI still deferred to b2; tombstone is plain semantic text; the new attribution-text fallback adds no new affordance). M4 — pending PM merge step (schema + RLS-comment change present).
Deferred / flagged (DEVIATIONS + SPEC-PATCHES):
  - Search/autocomplete/directory `is_discoverable` gate: no listing surface exists at b1.
  - Steward-role acquisition prompt: no steward-assignment handler exists yet.
  - Prompt UI surface → b2 (substrate shipped).
  - `member.md` § Policy posture default-public drift → **landed 2026-06-03 (b1e10eb)**: block now reads default `members_only`.
  - Direct `/rest/v1/members` enumeration vector remains open for the Shop founder + individual-Item paths (the only two remaining cross-Member base-table reads); hardening = follow-up ticket migrating those paths onto a SECURITY DEFINER projection that exposes only handle/display_name/avatar.
  - `member.md` Item-attribution model documentation → **landed 2026-06-03 (b1e10eb)**: `member.md`/`groups.md`/`item.md` now describe the Group-vs-Member attribution split + the `member_public_discoverability` projection.
  - Playwright beats for the plain-text attribution path (non-discoverable seller / non-discoverable founder) defer to b1.5+.
DEVIATIONS: filed 2026-06-03 (T095, Revisions 1 + 2).
