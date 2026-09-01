---
id: what-design-language
purpose: Design tokens, component recipes, CTA patterns.
layer: what
status: active
---

# CDP Design Language System

> White canvas + photography + one signature accent. The chrome disappears so the content speaks.

## Principles

1. **One accent color, used sparingly.** Satin Pistachio (`#BACBB5`) is the brand mark. One or two shades appear on CTAs, active nav states, badges, and subtle accent lines — present enough to register the brand, restrained enough to never compete with photos. The full 50–900 ramp exists as a system resource but core surfaces only ever use one or two shades. Think Airbnb's Rausch Red: unmistakable, not ubiquitous.
2. **Dark neutral text, not brand-colored text.** Body text and headlines use a near-black (`#2D2D2D`). The brand color disappears from text roles entirely — it appears on interactive surfaces and accents, never on paragraphs or headings.
3. **White-dominant canvas.** Clean white (`#FFFFFF`) or near-white backgrounds, generous whitespace, minimal UI chrome. The feed breathes. No tinted backgrounds, no graduated greens across components.
4. **Photography is sacred.** No color pills, frosted badges, colored overlays, or tier markers over photo cards. Photos are clean — like Airbnb. Kind labels, featured tags, and metadata go in the text zone below the image only.
5. **No color block cards.** Items without photos use clean, text-forward editorial layouts (white bg, hairline border, editorial typography). Never solid-color rectangles or tinted card backgrounds.
6. **Hairlines over shadows.** Separation comes from 1px borders. Shadows are reserved for hover lift and overlays.
7. **Generous whitespace.** 24px page gutters mobile, 40–80px desktop. Components breathe.
8. **One typeface, restrained scale.** Inter, Book/Medium/SemiBold/Bold only. Type scale tops out at 32px in product surfaces.
9. **Bottom-anchored, thumb-reachable.** All primary controls anchor to the bottom of the viewport. Search bar at the bottom expands upward on focus; detail cards slide up from below; nav (when present) sits at the bottom. No top-anchored toolbars or search fields. Mobile-first; desktop adapts but is not the priority. Follow Google Maps / Apple Maps interaction patterns so users are instantly familiar.

## Tokens

### Color

Brand palette anchored on **Satin Pistachio** (`#BACBB5`) as the single signature color, paired with **dark neutrals** for text. The approach mirrors Airbnb: one unmistakable brand hue, everything else black/white/gray.

#### Pistachio ramp (system resource — edge cases only)

The full ramp exists for design-tool reference and rare edge cases. **Core surfaces use only `--pistachio-400` (brand mark) and `--pistachio-500` (CTA fill).** Do not reach for other ramp values in product UI without a specific reason.

| Token | Value | Notes |
|---|---|---|
| `--pistachio-50` | `#F5F7F2` | Reserved — not for page backgrounds |
| `--pistachio-100` | `#E8EDE3` | Reserved — selected-state fill only when pistachio context is already established |
| `--pistachio-200` | `#D5DECF` | Reserved |
| `--pistachio-300` | `#C7D6C2` | Reserved |
| `--pistachio-400` | `#BACBB5` | **Brand primary — Satin Pistachio.** Logo, brand mark, accent lines, active nav icon. |
| `--pistachio-500` | `#A0B49A` | **CTA fill.** Primary action button background. |
| `--pistachio-600` | `#869C7F` | CTA hover state. |
| `--pistachio-700` | `#6D8367` | Pressed/active state. |
| `--pistachio-800` | `#566952` | Reserved |
| `--pistachio-900` | `#3F4D3C` | Reserved — no longer used for text. |

#### Role tokens

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background — **pure white**. Clean, lets photography and content lead. |
| `--color-surface` | `#F7F7F7` | Subtle surface — hover states, text-forward card backgrounds, empty states. Neutral gray, not green-tinted. |
| `--color-fg` | `#2D2D2D` | **Body text** — dark neutral near-black. Not brand-colored. |
| `--color-fg-muted` | `#717171` | **Muted text** — secondary text, captions (matches Airbnb's secondary gray). |
| `--color-border` | `#EBEBEB` | Hairline separators — neutral gray. |
| `--color-brand` | `#BACBB5` | Brand mark / logo / accent lines — Satin Pistachio (`--pistachio-400`). Not a button color. |
| `--color-accent` | `#A0B49A` | Primary CTA button background (`--pistachio-500`); pair with white text. |
| `--color-accent-hover` | `#869C7F` | CTA hover (`--pistachio-600`). |
| `--color-heading` | `#2D2D2D` | Headline color — same dark neutral as body text. |
| `--color-focus` | `#2D2D2D` | Focus ring (2px) — dark neutral. |

**Removed tokens:** `--color-accent-tint` (was pistachio-100 wash — no longer used on core surfaces). If a selected-state fill is needed, use `--color-surface` or a 4% opacity overlay of `--color-accent`.

#### Semantics (earthy, not candy — system feedback only)

Semantic colors appear **only** in system feedback contexts (toasts, validation, alerts). They never appear decoratively in the feed, on cards, or as accent surfaces.

| Token | Value | Use |
|---|---|---|
| `--color-success` | `#2D6A4F` | Success / confirmed — **forest** |
| `--color-warning` | `#D89E4A` | Warning / caution — **honey** |
| `--color-danger` | `#B4513C` | Error / destructive — **terracotta** |
| `--color-info` | `#4A7C7E` | Info / neutral notice — **slate teal** |

### Ownership tier spectrum (badges + map pins only)

A single semantic axis: **green = local, gray/black = extractive.** Saturation and lightness encode alignment.

| Tier | Hex | Position |
|---|---|---|
| coop | `#0E6B2E` | Most aligned (worker/member owned) |
| independent | `#1B7A3D` | Locally owned & operated |
| mission-driven | `#5A8F66` | B Corp / PBC |
| local-franchise | `#97A89A` | Local owner, national brand |
| challenger | `#B0B0B0` | Pro-competition national |
| pe-corporate | `#2A2A2A` | Extractive — PE / corporate |

Listings tagged `pe-corporate` carry `data-extractive="true"`, which applies `grayscale(0.6)` + `opacity 0.78` so Wall Street fades into the background. Hovering restores full color (the user can still see the listing clearly when they choose to).

### Typography

- Family: **Inter** via `next/font/google`, fallback to system sans.
- Weights: 400 (Book), 500 (Medium), 600 (SemiBold), 700 (Bold). No italics.
- Scale (px): 12 / 14 / 16 / 18 / 22 / 26 / 32.
- Body line-height: 1.5. Heading line-height: 1.2.

### Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 8px | Inputs, small chips |
| `--radius-md` | 12px | Cards, buttons, images |
| `--radius-lg` | 16px | Modals, sheets |
| `--radius-full` | 9999px | Pills, search bar, filter chips |

### Shadow

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle lift |
| `--shadow-md` | `0 6px 16px rgba(0,0,0,0.12)` | Card hover, search bar, sheets |
| `--shadow-lg` | `0 12px 32px rgba(0,0,0,0.16)` | Modals |

### Motion

- Hover transitions: 200ms ease-out.
- Cards lift on hover: `transform: scale(1.02)` + `--shadow-md`.
- Links: underline on hover, no color change.

## Component recipes

### Button — primary
- Bg `--color-accent` (`--pistachio-500`), text `#FFFFFF` (white — AA-contrast on the darker pistachio-500 fill), radius `--radius-md`, height 48px, weight 600.
- Hover: bg `--color-accent-hover`. Focus: 2px `--color-focus` ring.

### Button — secondary
- Bg white, 1px `--color-border`, text `--color-fg`, radius `--radius-md`, height 48px, weight 500.
- Hover: bg `--color-surface`.

### Card
- Bg white, no border, no shadow at rest. Image uses `--radius-md` corners.
- Title 15px/600. Subtitle 14px/400 muted. Optional price 14px/600.
- Hover: `--shadow-md` + slight scale.
- **Photo cards: no overlays.** No pills, badges, tier markers, or any colored element over the image. Heart/save icon is the only overlay (white stroke, dark fill, shadow — same as Airbnb). All metadata goes below the image in the text zone.
- **No-photo cards:** white background with `1px --color-border`, editorial layout. Uppercase category label in 11px/600 `--color-fg-muted`, large title, meta line. Optional thin accent line (2px `--color-brand`) as a subtle brand mark. No tinted backgrounds, no colored badges, no decorative emoji circles.

### Horizontal card scroll
A single-row, snap-scrolling strip of compact cards for an at-a-glance summary that links onward to a full page. First consumer: the `/you` "Following" summary (F042 / T108); use it for any "here's a peek, see all →" surface.
- **Scroll container.** `flex` row, `overflow-x-auto`, `gap-3`, `snap-x snap-mandatory`; bottom padding (`pb-2`) leaves room for the scrollbar without clipping hover shadow. No fixed height — cards set it.
- **Card.** Fixed width (`w-28`), `shrink-0`, `snap-start`; reuses the `card-hover` recipe. Vertical layout: 64px round thumbnail (or initial-letter placeholder on `--color-bg-muted` when no image), then a 2-line-clamped name in 12px/500.
- **Placeholder.** When the entity has no image (Groups, Venues, tombstoned People), show the first initial in a neutral circle — never a broken image or colored badge (consistent with no-photo cards).
- **Overflow affordance.** Native horizontal scroll; the partial last card peeking past the right edge is the affordance — no arrows at b1.
- **Terminal "More" link.** A standard text link (CTA pattern, `--color-accent`) in the section header, right-aligned, navigating to the full page. Header carries the section title left, "More" right.
- **Empty state.** Omit the entire section when there's nothing to show — the empty-state-with-CTA lives on the destination full page, not the summary strip.

### Pill / chip
- Radius `--radius-full`, 1px `--color-border`, padding `8px 14px`, 14px text.
- Selected: bg `--color-fg` (dark neutral), text white, no border.

### Search bar
- Single white pill with `--shadow-md`. Internal sections separated by 1px dividers, not gaps.
- 56px tall on desktop, 48px on mobile.

### Input
- Radius `--radius-sm`, 1px `--color-border`, 12px padding.
- Focus: 2px `--color-focus` ring, no color change to border.

### Recurrence picker
A friendly UI for the Member to express a repeating schedule. The picker emits an [RFC 5545 RRULE](https://www.rfc-editor.org/rfc/rfc5545) string, which is what the schema stores (`item_gatherings.recurrence_rule`). The Member never sees the RRULE.

**Inputs the picker presents to the Member:**
- **Frequency** — segmented control: `Once` / `Daily` / `Weekly` / `Monthly`. Default `Weekly` when invoked from the gathering composer; `Once` for one-time events.
- **Day(s)** — visible only when frequency is `Weekly`. Pill row of `Sun Mon Tue Wed Thu Fri Sat` (multi-select); the Member can pick one or more days.
- **Time** — single time input (24h on desktop, native time picker on mobile). Defaults to the current hour rounded up.
- **Until** — radio: `Ongoing` (no end date) or `Until [date]`. Default `Ongoing` for recurring; not shown for `Once`.

**Output:**
- The component emits both the RRULE (for the schema) and a human-readable preview line that it renders below the inputs in `--color-fg-muted`: e.g., *"Every Thursday at 6:00 PM"* or *"Every Tue and Thu at 5:30 PM, until Jun 30."* The preview is what the Member visually verifies.

**Layout:**
- All inputs stack vertically inside whatever container invoked the picker (drawer, modal, or inline form section). Width fills the container.
- Spacing: 16px between rows. The preview line sits 8px below the last input.

**Validation:**
- For `Once` and the first occurrence of any recurring rule, the resolved start datetime must be ≥ now + 5 minutes. Past times produce an inline error: *"Start time is in the past."*
- For `Weekly`, at least one day must be selected.

**Reuse:**
- This component is the canonical recurrence input across all composers that need scheduling (gathering today, future class series, future recurring offers). Do not invent a second one. If a new composer needs scheduling fields the current picker doesn't cover (e.g., monthly-on-the-second-Tuesday), extend this picker — don't fork it.

### Multi-step composer

The canonical shape for any flow that gathers several pieces of information from a Member in a guided sequence before committing — the Sell walkthrough (F036), the gathering composer (F034), the product composer (F038), the service composer (F040). One recipe, four (and growing) consumers; do not fork.

**When to use a multi-step composer over a single-form composer:**
- ≥3 distinct decisions, OR
- The flow includes an optional branch the Member can skip (e.g., the Tier 0 locality step in Sell), OR
- One step requires a nested sub-flow (see § Surface patterns / Add new entity inside a composer).

If none of those hold, use a single-form composer (one screen, one submit, validated on submit). Multi-step machinery costs the Member attention; only spend it when the sequence buys clarity.

**Structure.**
- **Container.** Bottom-anchored drawer on mobile (per Principle #6 — primary controls reach the thumb); modal on desktop. The drawer/modal occupies up to 90% of viewport height and slides up over the originating surface (the `/you` page for Sell, the venue page for gather). Background dims with `--color-overlay` at 40% opacity. Tap-outside-to-dismiss is **off** for in-flight composers — see partial-state preservation below.
- **Step indicator.** Top of the drawer/modal. Horizontal row of `N` dots (`--color-fg` filled for completed + current, `--color-border` hollow for upcoming). Counter text to the right reads *"Step k of N"* in 14px / 500 / muted. Tappable dots jump to any previously-completed step (back-edit allowed); upcoming dots are inert. Skipped optional steps render as completed (filled) with a small *"(skipped)"* affordance on the dot's tooltip.
- **Step body.** One step per scroll-region. Step title in the 22px / 600 slot at the top of the body; one-sentence helper in 14px / 400 / muted directly below. Inputs use the existing `Input` recipe; pickers use existing recipes (Recurrence picker, search bar). Each step holds **one decision class** — don't pack two unrelated fields into one step.
- **Navigation row (bottom of drawer/modal).** Three-zone layout: `[← Back]` (text link, left) · `[Skip this step]` (text link, center, **only on optional steps**) · `[Continue]` (Button — primary, right). The primary advances when the step's required fields validate; otherwise it's disabled with inline error rendering at the field. The final step's primary CTA reads the destination verb — *"Create my shop"* / *"Host the gathering"* / *"List the product"* — never *"Submit"* or *"Done"*.
- **Step 1 special-case.** Step 1 has no Back; the left zone is empty. The primary CTA on step 1 reads *"Get started"* or the verb-specific equivalent.
- **Progress write-on-advance.** Each step commits its partial state to the substrate when the Member taps Continue, so the parent entity (Group, gathering, product) exists from step 1 onward and subsequent steps update fields. The composer is in *edit mode against a half-built thing*, not *buffered input waiting for a final submit*. This is what makes the partial-state preservation contract honest.

**Partial-state preservation (the contract).**
- The Member can close the drawer (X button, top-right) or navigate away at any point. Their work is not lost. Re-entering the composer (via the same originating CTA) resumes at the last step they were on, with all prior fields populated from the substrate.
- Tap-outside-to-dismiss is intentionally disabled inside the composer; abandonment requires an explicit X tap, and the X surfaces a confirmation toast ("Saved as draft — pick up where you left off"). No "Are you sure you want to lose your changes?" modals; there's nothing to lose.
- Resume detection: on entry, the composer checks the substrate for an in-flight half-built entity owned by this Member and, if found, jumps to `last_completed_step + 1`. The originating CTA's label flips to *"Continue setting up your shop"* (or the kind-specific equivalent) when a draft exists.
- Implementation note: the half-built entity carries a `draft` state in the substrate (`groups.lifecycle_state='draft'` for the Sell case; analogous for other composers). Promotion to `active` happens on final-step submit. The discovery layer must filter out `draft`-state rows from all public surfaces.

**Progressive validation.**
- Validate field-level on blur. Validate step-level on Continue tap (don't block typing).
- Don't pre-validate later steps from a current step (the Member hasn't seen them).
- Surface validation errors inline at the field, not in a top-of-form summary.

**Completion redirect.**
- Final-step primary CTA fires the promote-to-active write, then redirects to the canonical destination URL for the created entity. The drawer/modal collapses on completion; no interstitial success page. A toast at the destination URL reads *"Your shop is live"* / *"Your gathering is scheduled"* — kind-specific.
- If the destination has its own primary CTA the Member would naturally tap next (e.g., "Add a product" on the new Group page), surface that CTA prominently above the fold.

**Empty / loading / error states.**
- **Loading on submit:** Continue button disables, shows a 16px spinner inside the button, button text stays visible. Other navigation disables for the duration of the network call.
- **Submit error:** inline error below the navigation row in 14px / `--color-danger`; navigation re-enables; partial state still preserved on the substrate. Never destroy the Member's input on error.
- **Network offline:** the composer's Continue still writes locally to the substrate (per the action layer's retry semantics); offline indicator surfaces in the helper area at top.

**Reuse.**
- All multi-step composers in the platform use this recipe. If a composer needs a step type not yet covered (e.g., a payment-collection step at b2), extend the recipe here rather than forking. A new top-level composer that doesn't match this shape needs a `weigh` call before it ships — the cost of two composer recipes is high and goes up with every new one.

## CTA placement patterns

Modeled on Airbnb's two-audience pattern (guest + host). The Project has two member types — **shoppers** (consumers) and **producers** (vendors/businesses) — and signup is the #1 product goal.

### 1. Persistent top-right primary
- Logged out: `[Sign up]` (filled accent) + `[Log in]` (text link)
- Logged in: avatar / "You" entry
- Always visible — never more than one click from converting a browser

### 2. Two-track parallel entry
Producer onboarding gets its own persistent slot in the nav, visually quieter than consumer signup so they never compete.
- Quiet form: text link `List your business →` next to Sign up
- Loud form: full-width editorial section at the bottom of Home / Explore (photo + headline + primary CTA)

### 3. Progressive commitment (peak-intent signup)
Don't ask for signup before the user has felt value. Gate at the moment of intent.
- Browse map / view listings → free, no auth
- **Tap Support / Follow / Save** → opens an auth-gate modal with contextual copy: "Sign up to support [Vendor]"
- This converts engaged users at the moment they want to commit, not before

### 4. One primary per screen
Only one accent-filled button visible at a time. Everything else is `secondary` (white + border) or text link. Two competing primaries is a smell.

### 5. Sticky mobile CTA on profiles
Business and vendor profile pages render the primary action (Support / Follow) sticky at the bottom on mobile, above the BottomNav. Same pattern as Airbnb's reserve bar.

### 6. Hero CTA = the search bar
On Explore, the search bar IS the primary CTA. No competing button. Keeps the surface calm.

### 7. Trust microcopy adjacent to primary CTAs
Place a friction-remover line directly under or next to a primary CTA: "Free, takes 2 minutes" / "No fees, ever" / "You keep every customer." Airbnb pairs CTAs with trust phrases like "Free cancellation."

### 8. Auth modal vs auth route
Use a modal for in-context auth gating (Follow, Support, Save). Use the full `/auth/login` route only for cold starts (clicking Sign in from nav). Modals preserve the user's place; routes lose it.

### Anti-patterns (don't do)
- Two filled-accent buttons side-by-side
- Primary buttons in destructive contexts (delete, remove) — use bordered red instead
- Routing to `/auth/login` from a card action — always modal at peak intent
- Producer recruitment as the loudest CTA on the homepage — it's a smaller audience; consumer signup wins the visual hierarchy

## Surface patterns

Surfaces are pages or recurring page-region templates. Each surface fixes header layout, primary-CTA placement, and the components allowed in its primary scan zone, so the same kind of page feels the same everywhere.

### Venue page (`/l/[slug]`)

The page anyone lands on for a Location — Drake's, the brewery, the community garden, the library. Anonymous-readable. The public face of a place: most visitors come to browse and follow, not to create.

> URL note: the venue page lives at `/p/[…place]/l/[slug]` (place-scoped). Next.js forbids a static segment after a catch-all, so the `/l/` dispatch folds into the `app/p/[...slug]/page.tsx` catch-all alongside the `/g/` Group dispatch (T060 deviation) — not a standalone `l/[slug]/page.tsx` route.

**Header (top of page).**
- Hero image — 16:9 on desktop, 4:3 on mobile. `--radius-md` corners. No border, no shadow. Photography-first per design principle #3. `alt` text is the venue name ("Photo of Drake's"). If the Location has no image, the hero space collapses entirely — no empty container, no ARIA role on an absent element.
- Venue name in the 26px / 700 type slot.
- Address in 14px / 400 muted, single line. Distance from the viewer (if locality is set) appears on the same line, separated by `·`. Distance derives from the viewer's primary-home Place centroid (`member_place_interests` `scope_kind='primary_home'` → `places.centroid`), not from a raw Location coordinate. Omitted for anonymous visitors and for auth'd Members with no primary-home Place interest.
- Hairline (`--color-border`, 1px) below the address row.

**Primary CTA — below the header, above any content sections.**
- Single primary-accent button using the `Button — primary` recipe (height 48, `--color-accent`). One per page (per CTA placement pattern #4).
- Copy: **"Follow this venue"** (flips to **"Following"** once active). Follow is the primary action because most venue-page visitors are consuming — browsing, following — not creating. Follow serves Loop 8 (Follow what you love): the standing relationship that turns a one-time visit into recurring awareness. Per `principles.md` people-first, the primary CTA serves the majority visitor.
- For auth'd Members: tapping writes a `member_saved_searches` row scoped to the Location; the button flips to "Following" with an unfollow affordance and communicates state via `aria-pressed`.
- For unauthenticated visitors: the CTA still renders; tapping routes to sign-in with a return URL (`/auth/login?next=<venue path>`). After auth, the visitor lands back on the venue page.

**Secondary CTA.**
- **"Host something here"** using the `Button — secondary` recipe (white bg, border). Host is the minority action — surfaced, not primary.
- Tapping opens the gathering composer with this Location pre-attached. For unauthenticated visitors, routes to sign-in with a return URL carrying `action=host`; after auth, the composer opens with the Location still pre-attached.

**Sections below the CTAs (in order):**
1. **What's happening here** — Items hosted by the venue's owning kind='business' Group (resolved via `groups.anchor_location_id`), scoped to those also attached to this Location (`item_locations.location_id`). This is the venue's own storefront: it shows what the venue itself hosts (Host = `items.group_id`), not everything that happens at the venue's coordinates. Empty state: *"Nothing scheduled yet."* — honest, with no call-to-action pushing the viewer to host (the venue owner creates their own content). *(Section content ships in T105.)*
2. **What's happening nearby** — an expandable, secondary section (`<details>`/`<summary>`) listing public Items by proximity, excluding the venue's owning Group. Collapsed/secondary by default so it never competes with the venue's own content. *(Section content ships in T105.)*
3. **About** — venue description, accessibility notes, and the Location kind tag (permanent / recurring-temporary / area). Renders even when the description is empty (kind tag still shows).

**Minimal-page variant.** A Location with no anchored kind='business' Group (a public park, a community center, a bar that hasn't created a business Group) renders without "What's happening here" — there is no owning Group to scope against. "What's happening nearby" may still appear; both CTAs still render.

**What this surface does not have:**
- Two competing primary CTAs. "Follow this venue" is the one primary; "Host something here" is secondary.
- "Be the first."-style empty-state copy that pushes the viewer to host. The venue owner creates the venue's content; the viewer's most useful action on an empty venue is to follow.
- Producer-recruitment copy. This surface is for hosts and visitors, not for venue-owner onboarding (that's a separate flow).
- Reviews or ratings (per `principles.md`'s no-reviews stance).

### Add new entity inside a composer (inline sub-flow)

The shape for "I need to pick a Location from a list, but the Location I need doesn't exist yet" — and any analogous case where a composer step references an entity the Member hasn't created. First user: the anchor-Location step in F036's Sell walkthrough. Reusable wherever a composer step references an entity the Member may need to create on the spot.

**Shape.**
- The picker step in the parent composer (e.g., "Where is your shop anchored?") renders a search/select component listing the Member's existing relevant entities (Locations they've authored, Items they own, etc.), plus a quiet *"+ Add a new Location"* row at the bottom of the result list. Always at the bottom, never at the top; the default-path behavior is "pick existing."
- Tapping the *+ Add* row slides a **secondary drawer** in over the parent composer (stacked surfaces; the parent stays mounted underneath at -8 vertical offset and 60% opacity to signal it's paused, not gone). The secondary drawer is a single-form composer (use the standard Input recipe; do not nest a multi-step composer inside another — that's a smell).
- The secondary drawer header reads *"Add a Location"* (or kind-specific equivalent). Bottom navigation row: `[Cancel]` (text link, left) · `[Add and select]` (Button — primary, right). No Continue / no skip; this is a single decision: create-and-pick or back-out.
- On save: the secondary drawer's submit writes the new entity to the substrate, dismisses the secondary drawer, and **returns to the parent composer's picker step with the new entity pre-selected**. The parent composer's step indicator does not advance — the Member still needs to tap Continue to commit the picker choice and move forward.
- On cancel: the secondary drawer dismisses, the parent composer returns to its picker step with whatever selection (if any) was already there, no side effects. The Member can search/pick existing or tap *+ Add* again.

**Never nest deeper.** The parent composer can open a secondary drawer; the secondary drawer cannot open a tertiary. If a referenced entity creation itself needs a sub-reference (e.g., adding a Location requires picking a Place), that's a sign the entity model needs simplification or the sub-entity should be defaulted at creation — escalate to `weigh`, do not stack drawers.

**State preservation.**
- The parent composer's partial-state contract (per Multi-step composer recipe) holds across the secondary-drawer detour. Cancelling the secondary drawer never affects the parent's saved state.
- The secondary drawer does NOT itself have a draft-resume contract — its decision is atomic (add or cancel); abandonment loses the in-progress entity input. If a referenced entity needs its own multi-step setup, route the Member to the standalone composer for that entity (with return-to-parent on completion) rather than embedding it.

**Out of scope for this pattern.**
- Picking from someone else's entities (e.g., picking another Member's Group). That's a search-and-link interaction, not an add-inline. Different pattern; not in scope here.
- Editing an existing entity from inside a composer. The picker shows existing entities for selection only; "edit this Location" lives on the Location's own surface, not inside another composer's flow.

### Owner banner (role-gated management strip)

When the viewer is an owner-role Member of the entity they're looking at (a Shop page, a Group page, a venue they anchor), a management banner renders at the top of the page, above the public content. The owner sees the page exactly as every other visitor does, with management affordances layered on top in a visually distinct strip.

**Shape.** A single bordered container (`--color-border`, 1px, `--radius-md`) spanning the content width, sitting between the page header and the first public section. Background `--color-surface` (white) — no tint, no accent color. Interior padding matches the page gutter (24px mobile, 40px desktop).

**Contents.** One or more management widgets stacked vertically inside the banner. Each widget is a self-contained unit: a heading (14px / 600, `--color-text-muted`), a status line, and inline action affordances (Edit / Remove as text links, Add as a secondary button). At b1 the only widget is the Locally Owned claim (F037); future widgets (edit Group name, manage members, producer dashboard links) stack below it in the same banner.

**Collapsible.** The banner uses `<details>`/`<summary>` with the summary line reading "Owner tools" (or the entity-specific equivalent). Default state: **expanded** when the banner contains an action the owner hasn't completed (e.g., no ZIP claimed); **collapsed** when all widgets are in a steady state. The collapse is a convenience, not a gate — the owner can always expand.

**What this pattern is not.**
- Not a separate "manage" page or tab. The owner sees the real public page with the banner on top.
- Not a drawer or modal. Management affordances are inline, not overlaid.
- Not visible to non-owners. The entire banner is role-gated; anonymous and non-owner-Member viewers never see it.

**Accessibility.** The banner carries `role="region"` with `aria-label="Owner tools"`. The `<details>` toggle communicates expanded/collapsed state. Action links inside meet the 44px touch-target minimum.

### Other surfaces (cross-reference)

- **Member page (`/m/[handle]`)** — the Member's public page (per [`../systems/member.md`](../systems/member.md)); when the Member has ≥1 active kind='business' Group membership OR any kind='product'/'service' Item, the page surfaces selling-tool affordances. Header layout follows the same pattern: hero image → name → tagline → primary CTA below the header (label varies by Member context — *"Drop something now"* for irregular Sellers, etc.). The kind='business' Group page (`/g/[slug]`) follows the same pattern with Group identity as the header anchor (per [`../systems/groups.md`](../systems/groups.md)).
- **Item pages (kind-specific URLs: `/e/[slug]` Event · `/p/[slug]` Product · `/s/[slug]` Service · `/i/[slug]` Idea · `/o/[slug]` Offer · `/a/[slug]` Ask · `/initiative/[slug]` Initiative — per [`../../CLAUDE.md`](../../CLAUDE.md) § Naming)** — quiet header (no hero image at b1; reserved for T2 photo-upload), with title in the 26px slot, kind-specific detail rows below. Primary CTAs vary by kind (RSVP for gathering at b2, Follow for product, etc.). At b1 the primary action on a gathering Item is the Share-link affordance.
- **Hashtag page (`/h/[hashtag]`)** — list view of Items carrying that hashtag. No hero. No primary CTA — the search bar at the top is the primary surface (per pattern #6).

## Decisions encoded here

This file is the live home for the following architectural decision. See [`../../playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) for the cross-cutting register; this spec's Principles section *is* the load-bearing ratification.

| Decision | Status | What lives here |
|---|---|---|
| Bottom-anchored UI | Accepted | Bottom-anchored, mobile-first, thumb-reachable UI. Primary controls anchor to the viewport bottom; search bar expands upward; detail cards slide up; nav (when present) sits at the bottom. No top-anchored toolbars or search fields. Mobile-first; desktop adapts but is not the priority. Follow Google Maps / Apple Maps interaction patterns. See Principles #6 and Surface patterns throughout. |
