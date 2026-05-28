# F029: Maya manages her place-interest scope

**Bundle:** b1
**Sub-bundle:** b1.0 — Show up & be seen
**Work-map item:** b1.0 → 🟢 "Place-interest scope" (the management surface for primary_home + secondaries)
**Loops:** 1 (Find your people), 3 (Land here), 8 (Follow what you love)
**Canonical example:** Maya at Oak Park Sourdough — [`use-cases.md` #13](../../product/needs/use-cases.md). Maya lives in Oak Park, sells at the Saturday market downtown, has a son in school in Davis. Three Places matter to her awareness; one is home, two are secondary.
**Primitive shape:** Person(Maya) → `member_place_interests` (one `primary_home` Place + up to 5 `secondary` Places) → community-awareness feed reads the scope
**Status:** backlog

## The Person

Maya from F026/F027. Her awareness life isn't one Place — it's a small set. **Home** is Oak Park (her neighborhood). **Work-ish** is downtown Sacramento (where she sells Saturdays, where she has friends, where she takes her son to the library). **Family** is Davis (where her sister lives and her son goes to school two days a week). Three Places, three different reasons, none of them "follow this Location" — they're places she belongs to, with different intensity. The platform's awareness feed should honor all three without making her pick one.

## The Story

Maya is on the **`/you/locality` settings page**. The top of the page shows her current `primary_home`: a card labeled **"Home — Oak Park"** with a thumbnail (place hero image), the parent path (Sacramento ← Sacramento–Roseville MSA ← California), and an "Edit" affordance.

Below that, a section labeled **"Other places you care about"** lists her secondaries — currently empty. A primary CTA, **"Add a place,"** opens a Place picker. Maya picks **Sacramento (city-level)** and confirms; a card appears with "Secondary — Sacramento" and a small ↑ "Promote to home" affordance. She picks **Davis** next; a second secondary card appears.

She decides her real *home* feels more like Sacramento-the-city than Oak-Park-the-neighborhood (her awareness is broader than her single block). She taps "Promote to home" on the Sacramento card. The Oak Park card animates to the secondary section; Sacramento becomes the primary; an atomic swap happens in the database (no in-between state where there are two primaries). Her awareness feed (per F028) re-reads on the next visit and now centers on Sacramento.

Months later, Maya's son finishes school in Davis. She opens the locality settings again, taps the X on the Davis secondary card, and confirms removal in a one-tap modal ("Remove Davis from your awareness scope?"). The Davis card disappears; her feed stops surfacing Davis-anchored Items.

## Surfaces

- **Entry point:** The `/you` page → "Locality" section → "Manage your places" → opens `/you/locality`. Also reachable from the home feed via a "Tune your scope" affordance below the feed header. _Why: locality is a recurring tuning surface; per ADR-4 it must be accessible from any locality-dependent surface in one tap, and the awareness feed is the most locality-dependent surface there is._
- **Primary action (add a secondary):** The "Add a place" button opens a Place picker (same shape as the F027 product-composer picker — type-ahead over `places` rows ordered most-specific-first, with hierarchy breadcrumbs in suggestions). Maya picks; confirms.
- **Primary action (promote):** A small ↑ "Promote to home" affordance on every secondary card. Tap → confirmation modal: "Make Sacramento your primary home? Oak Park will become a secondary place." → atomic swap.
- **Primary action (remove):** A small ✕ on every secondary card → one-tap confirmation modal → remove.
- **Primary action (change primary_home granularity without promote):** Tap "Edit" on the primary_home card → Place picker (same shape) → Confirm. Different from "Promote a secondary" because the Member might want to *change the granularity of their primary_home* (Oak Park → Sacramento) without first having Sacramento as a secondary. The handler treats this as a soft-delete-then-insert at the primary_home scope_kind, same atomic guarantee.
- **Composer / interaction:** No free-text fields; everything is Place picker driven (per ADR-20 — `places` is platform-curated, Members can't declare new Places from this surface).
- **Completion:** State updates inline; the page re-renders cards in the new arrangement. A small toast confirms each action ("Sacramento promoted to primary home" / "Davis removed from your scope"). _Why: low-friction tuning is the point; the page is the dashboard, not a wizard._
- **Discovery:** Indirect — the awareness feed (F028) reads `member_place_interests` and updates accordingly on next read. No public surface exposes Maya's scope to other Members. _Why: per ADR-21, `member_place_interests` is owner-only at the row level._

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Primary home Place | `member_place_interests` row, `scope_kind='primary_home'` (unique active per Member) | yes — Member always has exactly one |
| Secondary Place(s) | `member_place_interests` row(s), `scope_kind='secondary'`, ≤5 per Member | optional (0–5) |

Implicit (set by the surface, not asked of the user):
- `removed_at` on prior rows when promoting / demoting / removing
- `created_at` on new rows
- Events on every transition (see below)

Events fired:
- `member.place_interest_added` — when a new row lands (add a secondary; or first-time primary_home from onboarding)
- `member.place_interest_removed` — when an active row gets `removed_at` set (remove a secondary; or demote prior primary as part of a promote-swap)
- `member.place_interest_promoted` — when a secondary becomes the primary (atomic swap; carries `{from_place_id, to_place_id}`)
- `member.place_interest_demoted` — fires alongside `_promoted` on the prior primary (carries `{from_place_id}` — the demoted row)

## Acceptance Criteria

### Adding a secondary Place

**Given** Maya is signed in, on `/you/locality`, with `primary_home=Oak Park` and zero secondaries
**When** she taps "Add a place" and picks "Sacramento" (the city Place) from the picker and confirms
**Then** a `member_place_interests` row is inserted with `(member_id=Maya, place_id=Sacramento, scope_kind='secondary', removed_at=NULL)`. _Why: ADR-21 substrate — secondaries are additive at action-layer up to the ≤5 cap; the action handler `member.place_interest.add` enforces the cap._
**And** `member.place_interest_added` is appended to `member_events` with `{place_id: Sacramento, scope_kind: 'secondary'}`. _Why: same-transaction row+event invariant per ADR-7._
**And** a card "Secondary — Sacramento" renders below the primary_home card; the secondary count display reads "1 of 5."

### Secondary cap is enforced

**Given** Maya already has 5 active secondary rows
**When** she taps "Add a place"
**Then** the picker opens, but the Confirm button is disabled with the message "You've reached the limit of 5 secondary places. Remove one to add another." _Why: per ADR-21 Place-interest Intent — the cap exists to bound the awareness-feed candidate-set cost; the action layer enforces it (not DDL), so the cap is tuneable without migration if Members consistently hit it._
**And** the action handler rejects any direct call from another surface (defense-in-depth — the cap is layered).

### Promoting a secondary to primary_home (atomic swap)

**Given** Maya has `primary_home=Oak Park` + secondary `Sacramento`
**When** she taps "Promote to home" on the Sacramento card and confirms
**Then** in a single transaction: Oak Park's primary_home row's `removed_at` is set, a new row is inserted with `(member_id=Maya, place_id=Oak Park, scope_kind='secondary', removed_at=NULL)`, Sacramento's secondary row's `removed_at` is set, and a new row is inserted with `(member_id=Maya, place_id=Sacramento, scope_kind='primary_home', removed_at=NULL)`. _Why: the unique partial index `ux_place_interests_primary_home` forbids two active primaries — the transaction must remove the prior before inserting the new; per ADR-21 Intent on the unique-primary-home constraint._
**And** the events `member.place_interest_promoted {from: Sacramento-secondary, to: Sacramento-primary}` and `member.place_interest_demoted {from: Oak Park-primary, to: Oak Park-secondary}` fire in the same transaction.
**And** the page re-renders with Sacramento at the top (primary_home card) and Oak Park in the secondary list. _Why: the Member's mental model is "I swapped them"; the surface should reflect that swap explicitly._

### Changing primary_home granularity without going through a secondary

**Given** Maya has `primary_home=Oak Park` and no secondaries that include the desired new granularity
**When** she taps "Edit" on the primary_home card, picks "Sacramento MSA" from the picker, and confirms
**Then** in a single transaction: Oak Park's primary_home row's `removed_at` is set; a new row is inserted with `(place_id=Sacramento MSA, scope_kind='primary_home', removed_at=NULL)`. The prior Oak Park is **not** auto-demoted to secondary unless Maya explicitly opts in. _Why: the Member's intent is to change granularity, not to keep both — auto-demoting the prior would silently bloat the secondary set and violate the cap as a side effect; explicit beats implicit._
**And** an inline affordance below the picker offers "Also keep Oak Park as a secondary place?" with a checkbox. _Why: low-friction recovery — the Member can change their mind in one tap without a multi-step flow._

### Removing a secondary

**Given** Maya has secondary `Davis`
**When** she taps the ✕ on the Davis card and confirms removal in the modal
**Then** the Davis row's `removed_at` is set; `member.place_interest_removed` fires; the card animates out. _Why: ADR-21 reversibility — opt-in scope, opt-out removal._
**And** the next read of the awareness feed no longer includes Davis-anchored Items (other than via Sacramento MSA if Maya has MSA-depth opt-in on her primary_home).

### Empty-secondaries state is graceful

**Given** Maya has `primary_home=Oak Park` and no secondaries
**When** she views `/you/locality`
**Then** the "Other places you care about" section renders an empty-state explainer: "Add places you spend time in but don't live in — your work city, your hometown, anywhere you'd like to know what's happening." with the "Add a place" CTA. _Why: people-first onboarding tone; the explainer names *what* secondaries are for, not just that the slot is empty._

### Primary_home cannot be removed (only changed)

**Given** Maya has `primary_home=Oak Park`
**Then** there is no ✕ affordance on the primary_home card. The only way to change it is "Edit" (granularity change) or "Promote a secondary to home" (swap). _Why: per ADR-21 Intent on unique-primary-home — there's always exactly one active primary_home; removing without replacing would leave the awareness feed with no candidate-set starting point._

## Edge Cases

- **Optimistic-UI race** (Maya taps "Promote" on a secondary while another tab adds a new secondary that would push past the cap): the atomic swap on Promote doesn't touch the cap; the new-secondary insert in the other tab is independently capped. No interaction.
- **Place hierarchy ambiguity** (Maya picks "Oak Park" but there are two Oak Parks — Sacramento neighborhood and an Illinois city): per ADR-20 + `places.md`, slug uniqueness is parent-scoped; the picker surfaces both options with disambiguating breadcrumbs ("Oak Park, Sacramento, CA" vs "Oak Park, Cook County, IL"). The Member picks one. _Why: parent-scoped slug uniqueness preserves clean slugs; the picker disambiguates at the surface._
- **Promoting the current primary_home to itself** (UI bug — shouldn't be possible, but defense-in-depth): the action handler detects the no-op and returns success without writing anything. No event fires.
- **Maya is in a federated peer Place** (T3): out of scope at b1; this scenario assumes US-only `places` per `places.md` b1 scope.
- **Maya's `primary_home` Place is later superseded** by the platform (a place curation correction — e.g., the Place row gets merged with another): out of scope at b1; deferred to the same flow that handles `place.superseded` / `place.merged` events at b2+.

## Assumptions

- F028 has landed (or lands alongside) — F029's "promote / demote" operations meaningfully change the awareness feed only because the feed reads from `member_place_interests`.
- The Place picker UI component is shared with F027 (product composer's "Where is this made?") and the onboarding locality step. One component, three entry points.
- `member_events` accepts the four new event kinds (`place_interest_added` / `_removed` / `_promoted` / `_demoted`) per `rebuild-plan.md` Phase 1 (007 series).
- The unique partial index `ux_place_interests_primary_home (member_id) where scope_kind='primary_home' and removed_at is null` is created in the schema migration (007i per ADR-21).

## Out of Scope

- **Cross-Place navigation surfaces** ("show me the awareness feed *only* for my Folsom secondary, like a filter") — a refinement that could land at b1.4 / `discovery.md` but isn't a `/you/locality` concern.
- **Sharing scope with another Member** (a couple's joint awareness scope) — there's no canonical case requesting this; defer.
- **Bulk import of place-interests** from external profiles — no canonical case; defer.
- **Place-interest aggregate insight surfaces** ("how many Members opted into Sacramento?") — per ADR-21 + ADR-21's Intent on private-substrate aggregates, lands as a named SECURITY DEFINER function when a consumer surface earns it. Not at b1.
- **Cap tuning beyond 5** — the ≤5 cap is action-layer-enforced and the Intent explicitly says revisit when Members consistently hit it; the *measurement story* that informs the revisit isn't a b1 scenario.
