---
purpose: Backlog scenario — Adaeze creates her Member public page.
layer: how
status: draft
---

# F025: A regular finds when Adaeze will be at the market next

**Bundle:** b1
**Loops:** 7 (Make and be found), 8 (Follow what you love), 9 (Find a local pro — adjacent)
**Canonical example:** [P3 — A producer with variable cadence (intermittent market sub-flavor)](../../product/needs/use-cases.md#p3-a-producer-with-variable-cadence-stays-findable-to-followers) — the Quarterly Dip Vendor is the anchor example.
**Primitive shape:** Person → `/m/[handle]` (read-only display of Member + their Items + Group memberships + Location affinities)
**Status:** draft — Phase 2 opener; awaiting `review` before promote.

> **ADR-20 reframe pending (2026-05-23).** ADR-20 (accepted) recommends F025's *slot* become the **Group public page** (`/p/[…place path]/g/[slug]`) — the heavier producer / business / event-anchored surface — with the Member public page (`/m/[handle]`, this scenario's current subject) split into a separate, lighter scenario. The `/m/adaeze` URLs below stay correct (Member handles are global per ADR-20); the `/g/[slug]` references need place-scoping to `/p/[…place path]/g/[slug]`. This is a `scope` reframing call for the PM — not yet applied. See ADR-0020 Action Item 6.

## The Person

Adaeze makes African-inspired dips and condiments. She doesn't have a website, doesn't run social, and shows up at Sacramento-area farmers markets when she has stock and time — not on a schedule. Her regulars want one thing: a page they can check that says when she'll be at the market next. Today they stalk the markets she's mentioned, ask vendors, or stumble into her. The Member public page is the surface that makes her intermittent presence persistent.

The viewer of the page is Maya — a regular who tried Adaeze's tamarind chutney at the Oak Park market three weeks ago and has been hoping to catch her again. Maya isn't trying to message Adaeze. She isn't trying to buy online. She just wants to know: *when, where, what's coming.*

## The Story

Maya opens the platform and types `adaeze` into the search bar (or clicks "Adaeze" on an Item card she saved). She lands on `/m/adaeze`.

The page tells her, in one screen:

1. **Who Adaeze is** — handle (`@adaeze`), display name, optional pronouns, bio paragraph, avatar.
2. **What she makes** — her active Items, grouped by brand label. Each Item card links to its kind-specific page (`/p/[slug]`). For products with active `item_locations`, the card shows the next attached Location + schedule. If Adaeze has tagged herself with a kind='business' Group (e.g., *Adaeze's Kitchen*), the Group's `display_name` resolves up: the section header reads "Adaeze's Kitchen" and links to `/g/[slug]`.
3. **Where she shows up** — her `member_location_affinities` of kind `lives` / `works` / `plays`, surfaced *publicly only when Adaeze has opted in*. Default is private (per ADR-9 opt-out default). For Maya's case, Adaeze has not opted in, so this surface is absent on the public page — Maya sees the Items + their attached Locations, which is what she came for anyway.
4. **The Groups Adaeze belongs to** — her active explicit memberships in `listed` Groups (per RLS). Family / private / unlisted Group memberships do not surface on the public page.
5. **A Follow CTA** — "Follow Adaeze" writes a `member_follows` row (composite PK, soft-unfollow). When Adaeze publishes a new Item, Maya sees it in her follow feed (b2 surface) and gets an email (b1 surface — `member.followed` event fires `notify.follower_published` at b2; substrate is wired at b1).

Maya taps the Follow button, sees the count tick up, and bookmarks the page. Next time Adaeze publishes a product with a market attachment, Maya finds out.

## Surfaces

- **Entry points:**
  - Direct URL — Maya knows the handle and types `mainstreet.market/m/adaeze`.
  - Item-card byline — clicking "by @adaeze" on any of her Items.
  - Group page member roster — clicking her name in *Adaeze's Kitchen*'s public Members list.
  - Search (b2 surface; not required at b1 — direct URL + Item byline cover the b1 path).
- **Anon vs auth:** the page is anon-readable per `members` RLS (listed Member, no soft-delete). Anon sees everything *except* the Follow CTA (which prompts sign-in with a return URL when tapped).
- **No write affordances** beyond Follow. No DM CTA on the public page — DMs require a shared Group per `policy.md` § anti-Nextdoor; Maya can't DM Adaeze unless they're in a Group together. If they are, the "Message" CTA surfaces on the page; if not, it's absent. (DM substrate ships at b1; DM surface ships at b2 — at b1 the CTA is absent for everyone.)
- **Resolve-up rendering** (per `item.md`): when an Item is filed under a kind='business' Group, the Item card shows the Group's `display_name` as the brand. When two Items share the same `brand_label` and same `member_id`, they cluster as "locally owned multi-location."
- **Privacy gates:**
  - `member_location_affinities` of any kind: hidden from the public page by default; opt-in surfaces via `member_privacy` (b2 toggle; b1 ships with the substrate + default-private).
  - Family / unlisted / private Group memberships: never surface publicly. RLS enforces.
  - Soft-deleted Member: 404 to anon + auth-other; visible only to the soft-deleted Member themselves (for restore).

## Data read (no writes from this scenario except Follow)

| User-visible field | Schema source | Privacy gate |
|---|---|---|
| Handle | `members.handle` | Public (gated by `members.deleted_at IS NULL`). |
| Display name | `members.display_name` | Public. |
| Bio | `members.bio` | Public. |
| Pronouns | `members.pronouns` | Public. |
| Avatar | `members.avatar_url` | Public. |
| Items list | `items WHERE member_id = $1 AND state='published' AND deleted_at IS NULL` (via the `discoverable_items` view for cheap reads) | Public-published only — drafts / withdrawn / private-group-filed Items absent. |
| Item card brand | `groups.kind='business' → group_businesses.display_name` (resolve-up) OR `items.brand_label` (fallback) | Public when Group is listed. |
| Active Group memberships | `group_memberships WHERE member_id = $1 AND left_at IS NULL AND source='explicit' AND group.discoverability='listed' AND group.dissolved_at IS NULL` | RLS gate. |
| Standing-presence badge (Seller / Producer / etc.) | `member_has_standing_presence` view | Public when TRUE. UI label per CLAUDE.md naming conventions (Seller generically; Producer in ag/food context). |
| Follow CTA state | `member_follows WHERE member_id (target) = $1 AND follower_member_id = auth.uid() AND left_at IS NULL` | Auth-only; anon sees the button but tapping prompts sign-in. |
| Location affinities | `member_location_affinities WHERE member_id = $1 AND affinity_kind IN (...)` | Hidden by default at b1; b2 toggle to opt in. |

## Acceptance Criteria

### Anon can land on the page

**Given** Maya is unauthenticated
**When** she navigates to `/m/adaeze`
**Then** the page renders with Adaeze's handle, display name, bio, pronouns, avatar, and her published Items list — no sign-in wall.

### Soft-deleted Member returns 404

**Given** Adaeze's `members.deleted_at IS NOT NULL`
**When** Maya (anon or auth) navigates to `/m/adaeze`
**Then** the page returns 404 — not a soft-deleted Member display.

### Items list reflects publish state

**Given** Adaeze has three Items: one `state='published'`, one `state='draft'`, one `state='withdrawn'`
**When** Maya loads `/m/adaeze`
**Then** only the published Item appears in the Items list. Drafts and withdrawals are not visible.

### Items filed under a private Group are absent from the public list

**Given** Adaeze has a published Item filed under a `kind='family'` Group
**When** Maya loads `/m/adaeze`
**Then** that Item is not in the Items list (privacy gate cascades from Group to Item).

### Brand label resolves up from kind='business' Group

**Given** Adaeze has an active membership in kind='business' Group *Adaeze's Kitchen* (`group_businesses.display_name = "Adaeze's Kitchen"`) and three published Items filed under that Group
**When** Maya loads `/m/adaeze`
**Then** the three Items appear under a section header labeled "Adaeze's Kitchen" linking to `/g/[adaeze-kitchen-slug]`. Items not filed under the Group appear under a different section (Adaeze's own listing).

### Standing-presence badge surfaces

**Given** Adaeze has an `owner` role in *Adaeze's Kitchen*
**When** Maya loads `/m/adaeze`
**Then** a "Seller" (or "Producer" if the ag/food context is detected) badge is visible near her display name, sourced from the `member_has_standing_presence` view.

### Follow CTA writes a `member_follows` row

**Given** Maya is authenticated and not currently following Adaeze
**When** she taps "Follow Adaeze"
**Then** a `member_follows` row is inserted with `(follower_member_id, target_member_id) = (Maya, Adaeze)`, `left_at IS NULL`. The CTA toggles to "Following." A `member.followed` event fires with `acting_member_id = Maya`.

### Anon tapping Follow prompts sign-in with return URL

**Given** Maya is unauthenticated
**When** she taps "Follow Adaeze"
**Then** she is redirected to the auth flow with a return URL of `/m/adaeze`. After auth, she lands back on the page with the Follow CTA preserved (single-tap-to-follow).

### Location affinities are hidden by default

**Given** Adaeze has `member_location_affinities` rows but has not opted into public display (the b1 default)
**When** Maya loads `/m/adaeze`
**Then** the "Where she shows up" section is absent. No affinity rows surface in the page DOM.

### Family / unlisted Group memberships are absent

**Given** Adaeze is a `steward` in a kind='family' Group and a `member` in an unlisted kind='interest' Group
**When** Maya loads `/m/adaeze`
**Then** neither Group appears in the Groups list. Only listed Group memberships surface.

### DM CTA absent when viewer and Member share no Group

**Given** Maya and Adaeze share no active Group memberships
**When** Maya loads `/m/adaeze`
**Then** no "Message" CTA appears on the page (per the anti-Nextdoor commitment in `policy.md`).

## Edge Cases

- **Handle case-insensitivity:** `/m/Adaeze` redirects (301) to `/m/adaeze` if `handle` is stored lowercase. The route resolver normalizes input.
- **Handle history:** if Adaeze previously held a handle and someone lands on the old URL, the route checks `member_handle_history` and 301-redirects to the current handle. (b2 surface; b1 ships the substrate via T053-style helpers but the redirect itself can defer to a separate ticket.)
- **No avatar / no bio / no pronouns:** the page renders with display name + handle + default avatar; absent fields don't show their headers.
- **Adaeze has zero published Items:** the Items section shows an empty state — "Adaeze hasn't posted anything yet." No 404.
- **Adaeze has 30+ published Items:** the list paginates or virtualizes; b1 ships paginate-or-load-more at a sensible page size (20). Sort order: most-recently-published first.
- **Follow + immediate unfollow:** `member_follows` uses soft-unfollow (`left_at` set on unfollow; re-follow nullifies). UI reflects.
- **Auth-self viewing own page:** Maya at `/m/maya` sees the same shape but with edit affordances ("Edit profile," "Manage items," etc.) — separate scenario for the `/you` editor. F025 only covers the public read.

## Assumptions

- The `members` row exists (created by the Phase 0 auth signup hook → `member.create` handler).
- Adaeze has set her handle, display name, and at least one published Item. (Composer scenarios — F027 onwards — handle the create path.)
- The `discoverable_items` materialized view is in place (T057, Phase 1).
- The `member_has_standing_presence` view is in place (T055, Phase 1).
- Design language tokens from `product/ui/design-language.md` are honored (color, typography, spacing).

## Out of Scope

- Editing the profile (the `/you` editor) — separate scenario.
- DM surface — substrate ships at b1, surface at b2.
- Follow feed reading — substrate ships at b1, surface at b2.
- Notification email when followed — `member.followed` event fires; downstream email pipeline is b2.
- Search by handle / display name — direct URL + Item-card byline cover b1 entry paths.
- Location affinities surfaced publicly — opt-in toggle is b2.
- The "Edit profile" / "Manage items" CTAs that surface only for auth-self viewing the page — separate ticket; this scenario covers the public read shape.
- QR card for the Member — QR cards are Item-level only per `qr-onboarding.md`, never Member-level.
- Block / report — `policy.md` complaint surface — separate scenario.

## Loop fidelity check (for pipeline-review)

- **Loop 7 (Make and be found):** ✅ Adaeze's Items are findable via her Member page once a viewer knows her handle or sees her on an Item. Her presence becomes persistent.
- **Loop 8 (Follow what you love):** ✅ The Follow CTA is the b1 surface for this loop. Substrate (`member_follows` + `member.followed` event) ships; downstream feed surfaces are b2.
- **Loop 9 (Find a local pro):** ⚠ Adjacent — the Member page surfaces services if Adaeze posts services. The locality-first index is the primary Loop-9 surface (Phase 3).
- **Loop 1 (Find your people):** ⚠ Adjacent — the Groups section surfaces affinity. Primary surface is `/g/[slug]` (F027).

## Shell-entity check (per CLAUDE.md § Project Facts — people-first)

- ❌ No Business entity surfaces. Adaeze is the Person; *Adaeze's Kitchen* is a kind='business' Group anchored to her. The brand resolves up from the Group's `display_name`, not from a business shell.
- ❌ No corporate-shell rendering. The page never says "View business profile" — it says "View Group" when linking to *Adaeze's Kitchen*.

## Open questions for `review`

1. **Pagination shape for the Items list.** Page-with-load-more, infinite-scroll, or numbered pages? `design-language.md` doesn't lock this. Probably load-more at 20-per-page mirroring typical mobile-first patterns; defer to design review.
2. **Standing-presence badge copy.** "Seller" vs "Producer" detection — what signals trigger Producer (ag / food category tags + business kind='business' Group)? Working answer: any active Item with `category` in a curated ag/food list OR `item_tags` containing one of `food-makers`, `farm`, `csa`, `producer`. Confirm at design review.
3. **Group section grouping.** All listed Group memberships in one section, or split by kind (business / interest / practice / place)? Working answer: one section, kind shown as a chip on each Group card.
4. **Follow CTA wording when auth-self viewing.** Adaeze viewing `/m/adaeze` — does the Follow button hide entirely, or render disabled? Working answer: hide (self-follow is meaningless; UI omits).
