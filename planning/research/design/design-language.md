# SocialUs — Design Language

> **Reference, 2026-10-01 — a dated research note, not a second spec.** Rulings live in `DECISIONS.md`; the reasons in `product/ui/design-language.md`; the token values, once adopted, in `socialus-web` (design decision 7). Where this note disagrees with those, they win.

Oct 1, 2026 · @don

One shell, nine screen templates and twelve shared components cover all 152 inventoried screens from a 6" phone to a 16" laptop; a 27" monitor gets the same layout capped at 1680px and centred.

- **Mockups:** `socialus-design-language.html`, in Don's local socialus-owner-page-design folder, not in this repo.
- **Tokens for Code:** [`socialus-tokens.css`](socialus-tokens.css) beside this file, a Tailwind v4 `@theme` drop-in for `globals.css`. Compiles clean on Tailwind 4.3.3; holds no colours. Not adopted; the Code session picks it up when Don says so.
- **Mapping:** [`screen-template-map.csv`](screen-template-map.csv) beside this file holds the 152-row table in section 6 for filtering.
- **Built on:** the research doc [SocialUs — Who to Copy & Design Resources](../design-references.md), the screen inventory, `owner-page-spec.md`, `socialus-web` origin/main @ 7a78277, `ops-pattern` DECISIONS.md, `design-language.md` and `surfaces.md` on origin/main.
- **Verified:** token values, usage counts and component duplication (read in code); contrast ratios (computed); nav order rule (`surfaces.md`: the + sits between the tabs); front-door and "Event" rulings (DECISIONS.md 2026-09-30).
- **Inferred:** every per-band layout below is a proposal, none was built or tested on a device; 129 of 152 screens were read in code, not seen; precedents are from the research doc, partly help articles.

## 1. Foundations

Foundations are type, spacing, radius, shadows, layers, nav height, breakpoints and the shared components; colour is out of this pass by Don's ruling (2026-10-01). **Source of truth (decision 7 = A):** once `socialus-tokens.css` is adopted, the token values live only in the app's code; the tables below are reference until then, and afterwards this doc keeps only the reasons.

### Colour (unchanged)

Today's colour tokens in `globals.css` stay exactly as they are, and `socialus-tokens.css` defines no colours. Where this doc names a colour (accent, `fg`, `control-border`, error red) it means today's token. Left open for the later colour pass: the accent's contrast, the undefined `--color-danger`, the raw palette classes and the three selected-state colours.

### Radius

Four steps plus full, in order, so a bigger name is always a bigger corner (today `rounded-lg` 16px is larger than `rounded-xl` 12px).

| Token | Value | Use |
| --- | --- | --- |
| `radius-sm` | 6px | Badges, date box, small tags |
| `radius-md` | 12px | Buttons, inputs, cards, menus (inputs drop from 16 to 12 to match buttons) |
| `radius-lg` | 16px | Sheets (top corners), dialogs, owner panel groups, cover photo |
| `radius-xl` | 24px | Floating action bar, toast |
| `radius-full` | 9999px | Chips, List/Map pill, avatars |

### Type

Inter, four weights, nothing over 32px (design-language principle 7); the 27 arbitrary sizes (9–26px) go.

| Token | Size / line | Weight | Use |
| --- | --- | --- | --- |
| `display` | 32 / 38 | 700 | Page name at ≥1024 only |
| `title-1` | 24 / 30 (28 / 34 at ≥744) | 700 | One h1 per screen |
| `title-2` | 20 / 26 | 700 | Section heads (Events, Announcements) |
| `title-3` | 16 / 22 | 600 | Card titles, panel group heads |
| `body` | 16 / 24 | 400 | Reading text, descriptions |
| `body-sm` | 14 / 20 | 400 | UI text, form labels (500), buttons (600) |
| `caption` | 13 / 18 | 400 | Meta, hints, errors |
| `micro` | 12 / 16 | 500 | Nav labels, badges; the floor, nothing smaller |

Buttons are 600 everywhere (today 142 medium vs 121 semibold).

### Spacing, shadow, layers

- **Spacing:** 4px base; use 4, 8, 12, 16, 24, 32, 48, 64. Gutters 16 (phone), 24 (≥640), 32 (≥1024), 40 (≥1536).
- **Shadows, three only:** `shadow-lift` 0 6px 16px /.12 (card hover), `shadow-overlay` 0 12px 32px /.16 (sheets, dialogs, menus, floating pill and bar), `shadow-bar` 0 -4px 16px /.08 (bottom bars). Cards at rest have none (principle 6).
- **Layers:** sticky 30, nav 40, floating bar 45, panel overlay 50, sheet 60, toast 70 (today 40/50/[60] chosen per file).
- **Touch target:** `--tap` 44px, written one way (`min-h-tap`); small buttons are 36px inside a 44px row.

### Nav height

- `--nav-bottom-h` 56px, `--nav-top-h` 64px, `--action-bar-h` 64px.
- Everything that clears the bottom nav uses `--nav-clearance` = 56px + safe area (replaces `pb-24` ×12, `bottom-20`, 64px literals). Today's 44px bar with 9px labels is too small for labels plus a 44px target.

## 2. Layout

Five bands, five content widths and one shell; every template below says what it does in each band, and nothing changes above 1680px except the margins.

### Breakpoints and bands

| Band | From (px) | Tailwind | Devices | Columns | Gutter |
| --- | --- | --- | --- | --- | --- |
| Phone | 0 | base (`sm` 640 only adds a second card column) | 6" phones 360–440, landscape and foldables to 743 | 4 | 16 (24 from 640) |
| Tablet | 744 | `md` (moved from 768) | 8–11" iPads portrait | 8 | 24 |
| Laptop | 1024 | `lg` | iPad landscape, 11–13" windows | 12 | 32 |
| Desktop | 1280 | `xl` | 13–15" laptops (1280–1512) | 12 | 32 |
| Wide | 1536 | `2xl` | 15–16" laptops (1710, 1728), 24–27" monitors | 12 | 40 |
| Cap | 1680 | `--w-shell` | 27" at 2560 | content stops, centred | margins grow |

Design widths to test: 360, 390, 744, 1024, 1280, 1440, 1728, 2560.

### Content widths (12 become 5)

| Token | Max width | Used by |
| --- | --- | --- |
| `--w-auth` | 400 | Sign-in, check your email, password steps |
| `--w-form` | 560 | Wizards, onboarding, single forms, dialogs (md) |
| `--w-read` | 720 | Feed, settings, manage lists, Page main column, reading text (~70 characters) |
| `--w-detail` | 1128 | Detail pages: 720 main + 48 gap + 360 rail |
| `--w-shell` | 1680 | Header, footer, Explore list + map |

Cards size themselves with container queries (`@container`), so the same card works in a 1-column phone list, a 2-column list beside a map and a 4-column wide grid.

### Page shell

Every routed screen renders inside one `AppShell`; templates fill its main slot.

- **Header (≥744):** 64px, sticky, white, hairline bottom, capped at `--w-shell`. Logo left, then the nav in the same order as the phone bar, avatar on the right.
- **Bottom nav (<744):** 56px + safe area, fixed, hides on scroll down and returns on scroll up (as today).
- **Page title:** one `PageHeader` component: optional back link, h1 at `title-1`, one optional secondary action on the right; also sets the tab title to "&lt;screen> · SocialUs" (today every tab says "SocialUs" and h1 comes in 5 sizes). Explore keeps a visually hidden h1.
- **Main:** the template, inside its width token, gutters per band.
- **Footer:** one line at the end of scrolling pages, capped at `--w-shell`: © SocialUs · About · Terms · Privacy (decision 8 = B). Shown on Explore list (at the end of the list pane from 1024), Page, Owner Page (above the owner bar's clearance on phone), You, Edit Page, Not found and the text pages. Hidden wherever the nav is hidden (sign-in, onboarding, admin, wizards, full-height sheets) and on Explore map view.
- **Skip link** first in tab order, landing on main.

## 3. Navigation

The nav reads **Explore · Create · You** at every size, left to right, which is what `surfaces.md` already rules ("the + sits in the navigation between the tabs"); only the desktop bar is out of line today (Explore · You · Create).

| Band | Form | Create looks like |
| --- | --- | --- |
| Phone <744 | Bottom bar, 3 equal slots, icon + 12px label, active = `fg` icon + label, inactive `fg-muted` | + in the centre slot, no fill |
| ≥744 | Header: logo, Explore, Create, then You (avatar) on the right | "+ Create" as a secondary button, so it never competes with a screen's primary |

- **Create goes straight to the create walkthrough**, not to `/you/sell` and back to `/you` (inventory problem 4). Signed out, it opens the sign-in sheet.
- **You** is the avatar when signed in, "Sign in" text when signed out; it stays active on every `/you/*` route.
- **Hidden on:** `/auth/*`, `/onboarding`, `/admin/*` (as asked), and **also inside full-page wizards and full-height sheets** so a half-made Page can't be abandoned with one stray tap. Those screens get a top bar with Back and Close instead. The last one is new; see decision 4.
- **On detail pages (phone)** the floating action bar sits above the nav; when the nav hides on scroll the bar drops to the bottom edge (decision 2).

## 4. Screen templates

Nine templates (T9 Text page added by decision 8) hold 128 of the 152 screens; the other 24 are redirects and APIs (18), dev pages that 404 in production (4) and two shell pieces (nav, toast). Counts are screens mapped in section 6.

| Template | Screens | Copy from |
| --- | --- | --- |
| Form / wizard | 33 | GOV.UK (error summary, task list), Shopify Save Bar, Apple HIG compose sheets |
| Empty / error / loading | 32 | design-language principle 11, GOV.UK error pages |
| Detail | 18 | Airbnb listing (rail, sticky section links), AllTrails floating action bar, Luma event |
| Manage (owner panel, lists) | 14 | Shopify theme editor + Atlassian layout panel, Google Business Profile entry, Luma people queue, Airbnb Today |
| Auth | 13 | Luma and Airbnb email-first sign-in, one modal at peak intent |
| Browse (list + map) | 10 | Airbnb search, AllTrails sticky map, Zillow floating pill |
| Feed | 4 | Luma calendar, Substack follow feed |
| Settings | 4 | GOV.UK summary list, Airbnb account settings |

### T1 Browse (list + map) — Explore

| Band | Layout | Sticky | Primary action |
| --- | --- | --- | --- |
| Phone | Search bar (area pill · search · Filter), 1-column cards (2 from 640), list first | Search bar; floating **Map** pill bottom-centre above nav | None; results are the content |
| Tablet | 2-column cards, one view at a time | Same pill | None |
| Laptop 1024 | List 55% (2 columns) beside map 45% | Map fills height under header; collapse chevron on the seam; expand icon on map; no pill | None |
| Desktop / Wide | Same split, 3 list columns from 1536; whole thing capped at 1680, map may run to the edge | Same | None |

- Filters open the filter sheet and write the result into the search box as text (ruling 2026-09-19); no chip row on results (principle 10).
- Signed in: a "Following" row of announcement and event cards sits above results (ruling 2026-09-17).
- Map pin tap: a peek card at the bottom on phone, a popover on laptop. Map position goes in the URL (AllTrails).
- If an owner panel is ever open beside browse at 1280–1439, the map collapses and a List | Map switch docks in the search bar.

### T2 Detail — Page, member, venue, event, product, service, /join

| Band | Layout | Sticky | Primary action |
| --- | --- | --- | --- |
| Phone | Cover photo full-bleed 4:3, name block, sections stacked | Floating action bar (64px, radius-xl) above nav | In the bar: Follow / Join / "Sign up to see what's happening" |
| Tablet | One 720 column, cover inside it | Same bar, centred, max 480 wide | Same |
| Laptop+ | 720 main + 360 rail inside 1128, cover across both | Section links (Events · Announcements · About · Products & services) under the header; rail sticky | Top of rail card: Follow plus Get directions, Visit site, Add to calendar as secondary |

- **Signed-out front door** is a variant, not a separate page: name, default photo, description and the withheld card saying "Sign up to see what's happening". No location, tags, founder, map or rail. Production currently also shows Products & services signed out (owner spec ruling 5).
- **Event cards lead with date and time** ("Sat, Oct 4 · 7:30 AM"), then title, place, who's going (never a zero), Add to calendar.
- Owner never sees Follow or Report on their own Page; their bar and rail are the owner tools (T4).

**What launch is (Don, 2026-10-01):** a rich-context yellow pages of organizations, not people, with pictures. A Page is an organization: a group, a business or an organization. Events are posts a Page makes; there is no separate event page.

**Launch framing (Don, 2026-10-01): "a modern yellow pages with links and contact info."** So the Page leads with a **contact block** for signed-in viewers: address or area (with Get directions), phone (tap to call), website and social links, and hours when the owner has set them. On phone it sits right under the name and description, above Events and Announcements; the floating action bar carries Call and Directions next to Follow. From 1024 it is the top of the rail card. The signed-out front door shows none of it (no location, per the front-door rule) and keeps only name, photo or default art, description and "Sign up to see what's happening".

- **Today (read in code, origin/main @ 5837e85):** the Page shows its placement as one grey line and social links as a row, both mid-page; website is one of the social-link keys (`groups.social_links`).
- **Phone on a Page: doesn't exist.** The only phone in the code is the member's, collected at signup and private by ruling. **Hours on a Page: don't exist.** The only `hours` column is on service items (`item_services.hours`), which R2 defers.
- **Ruled in (A, 2026-10-01), launch scope, queued in the build:** a **public business phone** on the Page, separate from the member's private phone and shown only because the owner adds it, and **weekly hours** on the Page. Each needs a field on `groups`, a migration, a Contact section in Edit Page and display in the contact block. In the contact block the phone is tap-to-call and hours show today's line first ("Open today 8 AM to 2 PM"), with the full week on tap; both are optional and neither is required to publish.

### T3 Form / wizard — create Page, composers, onboarding, report

| Band | Layout | Sticky | Primary action |
| --- | --- | --- | --- |
| Phone | Full-page route, one question per step; nav hidden | Top bar: Back · "2 of 6" · Close; footer with Continue | Full-width Continue / Publish at the bottom |
| Tablet+ | Centred 560 card on `surface` | Footer inside the card | Continue bottom-right, Back as quiet link left |
| Desktop+ (later) | 560 form + live card preview on the right | Preview sticky | Same |

- Short forms (report, add a location, area) use the sheet, never a full page; long flows never use a sheet (NN/g).
- Errors: summary box at top linking to each field, plus inline message with icon (GOV.UK). Progress saves on each step (design-language rule).
- Edit forms that aren't wizards use the Save bar instead of a footer.

### T4 Manage — owner panel on the Page, /you, Following, Your shops, admin queue

| Band | Owner panel on a Page | List pages (/you, Following, admin) |
| --- | --- | --- |
| Phone | Owner bar (64px) in the action-bar slot: **Announce** · People · Add · Settings; each opens one sheet; Tell people is full height | 1 column 720 max, rows with action on the right |
| Tablet | Same bar; groups open as a 400 side sheet over the Page | Same |
| Laptop 1024 | Same as tablet: owner bar and sheets, no rail (ruling 6) | Same, centred |
| Desktop 1280 | **Push panel 360**, docked right, full height, collapsible; the Page moves over, not under | Admin: queue 400 left, selected report right |
| Wide 1536 | Panel 400 | Same |

- Two cues that you're editing: a tinted owner line ("This is your Page.") and "See it as: You · Signed in · Signed out".
- Group order: Tell people · People (badge for requests) · Add to your Page (each component with its one-line why) · Page settings. Announce is the only accent button.

### T5 Feed — Following strip, locality feed, legacy following

| Band | Layout | Sticky | Primary action |
| --- | --- | --- | --- |
| All | One 720 column of announcement and event cards, newest-relevant first | Header only | None; per-card Add to calendar |

All four feed screens are orphaned or legacy today; the template exists so a revived feed matches the Following row on Explore.

### T6 Settings — /you settings, Edit Page

| Band | Layout | Sticky | Primary action |
| --- | --- | --- | --- |
| Phone | Grouped summary rows: label, value, Change | Save bar when something changed | Save in the bar |
| Laptop+ | 220 section list left + 720 rows | Section list sticky | Same |

Edit Page also lives in the owner panel's Page settings group at ≥1280; on phone it is this template as a full page.

### T7 Auth — sign in, check email, password, gates

| Band | Layout | Sticky | Primary action |
| --- | --- | --- | --- |
| All | Logo, 400 card centred (full width minus gutters on phone); nav and footer hidden | None | Continue, full width in the card |

- Gates at peak intent (Follow, Create, Map signed out) open one **sign-in sheet** with one sentence of why and the same email field; not a page jump. One wording pattern, "Sign in to &lt;what they tapped>", replaces today's five.

### T8 Empty / error / loading

| State | Layout | Action |
| --- | --- | --- |
| Empty (in a template) | Replaces the content region: glyph 40, `title-3` heading, one line | One secondary button; primary only if it's the screen's only action |
| Owner's own empty | Invites, never counts ("Nobody's in yet", principle 11) | Add or Announce |
| Not found / error page | Full shell with nav, h1 "We couldn't find that", one line | Go to Explore |
| Loading | Skeleton in the template's shape; no "Loading…" text | None |
| Inline error | `danger` text + icon, `role="alert"` | Try again |

### T9 Text page — About, Terms, Privacy (decision 8 = B)

| Band | Layout | Sticky | Primary action |
| --- | --- | --- | --- |
| All | PageHeader (h1, "Updated &lt;date>" line), then prose in one 720 column (`body` 16/24, `title-2` section heads, plain links); nav and footer shown | Header only | None |

- One screen type, three routes: `/about`, `/terms`, `/privacy`. Content is Markdown kept beside the copy module so wording changes without touching layout.
- Copy is Don's and a placeholder ([public-is-draft]); Terms and Privacy likely need legal review before launch, and use "we currently…", never "never".

## 5. Shared components

Twelve components replace about 40 duplicates; each row says what it replaces so Code can delete the old ones.

| Component | Spec | Replaces | Copy from |
| --- | --- | --- | --- |
| **Card** | One `Card` with kinds Page, Event, Announcement, Withheld, Row. Media block always renders (photo or deterministic default art), text below the photo, never on it. **Event leads with date and time** in `title-3`, then title, place, going count only when above zero. Container query: stacked under 360px wide, side-by-side row above. Hover: `shadow-lift`. Signed out: no location, tags or seller on any card | 12 card styles incl. EventCard, ItemFeedCard, TileCard, PageDetailCard, MarketSelector option | Airbnb listing card, Luma event row |
| **Sheet** | One build, prop `placement`: phone = bottom sheet (half or full height, grab handle, visible Close, Back and swipe dismiss); ≥744 = centred dialog (sm 400 / md 560) or side sheet (right, 360 / 400). One scrim, layer 60, focus trapped, returns focus. No sheet on a sheet; switches at 744 for all | ~10 builds switching at sm or md | Apple HIG sheets, Material 3 side sheet, NN/g bottom sheets |
| **Toast** | One, bottom-centre above nav and action bar (`--nav-clearance` + 16), max 1 at a time, 5s, optional Undo, `role="status"` (`alert` for errors), radius-xl, `fg` fill | Toast + 5 inline toasts | Material snackbar |
| **Follow button** | One `RelationshipButton`: Follow / Following, or Join / Asked / Joined on a private Page. Primary when not following (it's the screen's primary), secondary when following. Signed out opens the sign-in sheet. Not rendered for the owner | FollowButton, FollowPageButton, FollowMemberButton, FollowVenueButton | Luma Follow, Substack |
| **Area picker** | One `AreaPicker` sheet: zip or city search, "Near you" then other areas, uncovered area shows the not-covered state with waitlist. Trigger is the area pill in the search bar | ScopeSheet, MarketSelector, ScopePicker, MarketPill | Airbnb "Where" |
| **Button** | Primary (accent fill, one per screen), Secondary (white, `control-border`), Quiet (underlined text), Danger (secondary with danger text; danger fill only inside a confirm dialog), Icon (44 circle). Sizes md 44, sm 36 in a 44 row. 600 weight, radius-md | `.btn-primary` + ~21 hand-rolled accent buttons, charcoal sheet CTAs | GOV.UK buttons |
| **Chip** | 36 high, radius-full, `control-border`; selected = `fg` fill. Used inside the filter sheet and for tags on signed-in detail, never as a row on results | `.chip` + 5 hand-rolled pills | Baymard applied filters |
| **Form fields** | Label above (body-sm 500), input 44 high, radius-md, `control-border`, focus ring 2px `fg`; hint `caption` muted; error `caption` danger + icon; error summary at top. Switch has `role="switch"` and a one-line why | `.input` at 16px radius with hairline border, 3 error reds | GOV.UK |
| **Save bar** | Appears when a non-wizard form is dirty: "Unsaved changes" · Discard (quiet) · Save (primary). Phone: above nav; ≥744: sticky at the bottom of the content column. Leave-page prompt while dirty | Save + "Done" that drops changes | Shopify Save Bar |
| **List/Map pill** | 44 high, radius-full, `fg` fill, white text and icon, `shadow-overlay`, bottom-centre at `--nav-clearance` + 16. Reads "Map" in list, "List" in map. Gone from 1024 when both show | ListMapToggle that scrolls away after card 4 | Airbnb "Show map", Zillow |
| **Floating action bar** | Detail pages on phone and tablet: 64 high, radius-xl, white, `shadow-overlay`, inset 12 from the edges; holds one primary plus up to two icon actions (Directions, Share) | Inline buttons that scroll away | AllTrails "Save · Get directions" |
| **PageHeader** | Back link, h1, one secondary action, sets the tab title | 5 h1 sizes, no shared header | GOV.UK page heading |

## 6. Screen-to-template map

All 152 inventory rows plus the 2 new launch screens, grouped by template; "Launch screen" is the one of 23 it merges into (section 7). Same data, with each row's previous rollout, in `screen-template-map.csv`.

| ID | Screen | Template | Launch screen | Rollout |
| --- | --- | --- | --- | --- |
| S006 | Recruitment grid (orphaned) | Browse | — | After launch |
| S008 | Explore / Browse (signed out) | Browse | L01 Explore | Launch |
| S009 | Explore (signed in) – Following row | Browse | L01 Explore | Launch |
| S010 | Explore search expanded | Browse | L01 Explore | Launch |
| S012 | Explore map view | Browse | L01 Explore | Launch |
| S013 | Map pin popup | Browse | L01 Explore | Launch |
| S016 | Filter sheet | Browse | L02 Filter sheet | Launch |
| S017 | Scope sheet – Choose your area | Browse | L03 Area picker | Launch |
| S018 | Metro standing dialog | Browse | L05 Waitlist count popup | Launch |
| S050 | Place landing (placeholder) | Browse | — | After launch |
| S028 | Page (signed out) | Detail | L06 Page | Launch |
| S029 | Page (signed in, not following) | Detail | L06 Page | Launch |
| S030 | Page (follower) | Detail | L06 Page | Launch |
| S031 | Page (member, private Page) | Detail | L06 Page | Launch |
| S032 | Report sent confirmation | Detail | L07 Report sheet | Launch |
| S034 | Page overflow menu | Detail | L07 Report sheet | Launch |
| S039 | Join – vendor pitch (signed out) | Detail | — | After launch |
| S040 | Join – signed in | Detail | — | After launch |
| S041 | Member profile (visitor) | Detail | — | Retired |
| S042 | Member profile – self view | Detail | L21 You | Moved into launch |
| S046 | Member-hosted gathering | Detail | — | Retired |
| S047 | Member product | Detail | — | Retired |
| S048 | Member service | Detail | — | Retired |
| S053 | Page-filed gathering (Event detail) | Detail | — | Deferred (R3 = A, ruled 2026-10-01) |
| S054 | Page-filed product | Detail | — | After launch |
| S055 | Page-filed service | Detail | — | After launch |
| S056 | Venue (signed out) | Detail | — | After launch |
| S057 | Venue (signed in) | Detail | — | After launch |
| N001 | Before you publish: agree to the rules (F082) | Form | L14 Before you publish | Launch (new) |
| S035 | Report sheet | Form | L07 Report sheet | Launch |
| S063 | LocationPlaceFields (address / neighbourhood) | Form | L15 Edit Page (Page settings) | Launch |
| S064 | PagePhotoPicker | Form | L15 Edit Page (Page settings) | Launch |
| S066 | MultiStepComposer shell | Form | L10 What are you starting? | Launch |
| S068 | MarketForm (admin) | Form | — | After launch |
| S069 | ReportForm confirmation | Form | — | After launch |
| S071 | ReportForm sheet (legacy) | Form | — | After launch |
| S103 | Onboarding: What should we call you? | Form | L20 Signup details | Launch |
| S104 | Onboarding: Where are you, and why? | Form | L20 Signup details | Launch |
| S105 | MetroStandingDialog (waitlist count) | Form | L05 Waitlist count popup | Launch |
| S106 | Onboarding name error | Form | L20 Signup details | Launch |
| S118 | Sell walkthrough: What are we creating? | Form | L10 What are you starting? | Launch |
| S119 | Sell walkthrough: Name your (noun) | Form | L15 Edit Page (Page settings) | Launch |
| S120 | Sell walkthrough: Anchor Location | Form | L15 Edit Page (Page settings) | Launch |
| S121 | Sell walkthrough: What you do (tags) | Form | L15 Edit Page (Page settings) | Launch |
| S122 | Sell walkthrough: About (+photo, links) | Form | L15 Edit Page (Page settings) | Launch |
| S123 | Sell walkthrough: Review | Form | — | Retired (R1: no review step) |
| S124 | MarketSelector sheet | Form | — | Deferred (was launch) |
| S125 | Add a Location drawer | Form | L15 Edit Page (Page settings) | Launch |
| S135 | Product composer: details | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| S136 | Product composer: Pickup point | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| S137 | Product composer: Where is this made? (placeholder) | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| S138 | Product composer: Review | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| S139 | Service composer: details | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| S140 | Service composer: Pricing | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| S141 | Service composer: Service area | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| S142 | Service composer: Review | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| S143 | Gathering composer: kind | Form | L16 Event form | Launch |
| S144 | Gathering composer: Details | Form | L16 Event form | Launch |
| S145 | Gathering composer: When | Form | L16 Event form | Launch |
| S146 | Gathering composer: Review | Form | L16 Event form | Launch |
| S147 | Product composer: Add a Location drawer | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| S148 | Service composer: Add a Location drawer | Form | — | Deferred (R2 = A, ruled 2026-10-01) |
| N002 | Hidden-content notice + one explanation (F078) | Manage | L09 Hidden-content notice | Launch (new) |
| S033 | Page, owner view (owner-page-spec.md) | Manage | L08 Owner Page | Launch |
| S073 | Reports review queue | Manage | L22 Review queue | Moved into launch |
| S074 | Report entry card | Manage | L22 Review queue | Moved into launch |
| S075 | Reason picker | Manage | L22 Review queue | Moved into launch |
| S111 | You (signed in) | Manage | L21 You | Moved into launch |
| S114 | Sell CTA row | Manage | L21 You | Moved into launch |
| S115 | Your Pages grid | Manage | L21 You | Moved into launch |
| S116 | Following summary strip | Manage | L21 You | Moved into launch |
| S117 | Sell success toast | Manage | — | Retired |
| S128 | Following (manage) | Manage | L21 You | Moved into launch |
| S129 | Follow row removed (Undo) | Manage | L21 You | Moved into launch |
| S132 | Your shops (sell index) | Manage | — | Retired |
| S133 | Add product / service / gathering buttons | Manage | — | Retired |
| S134 | Add-item success toast | Manage | — | Retired |
| S002 | Home feed (orphaned) | Feed | — | After launch |
| S003 | Locality feed (orphaned) | Feed | — | After launch |
| S022 | Following (legacy vendors list) | Feed | — | Retired |
| S025 | Follow toast | Feed | — | Retired |
| S097 | Edit Page | Settings | L15 Edit Page (Page settings) | Launch |
| S098 | Change address | Settings | L15 Edit Page (Page settings) | Launch |
| S099 | Edit saved / error | Settings | L15 Edit Page (Page settings) | Launch |
| S152 | Settings tab | Settings | L21 You | Moved into launch |
| S023 | Following – signed out | Auth | — | Retired |
| S026 | Auth gate modal (Follow) | Auth | — | Retired |
| S070 | SignInPrompt | Auth | L19 Sign-in sheet | Launch |
| S082 | Sign in (magic link) | Auth | L17 Sign in | Launch |
| S083 | Check your email (link sent) | Auth | L18 Check your email | Launch |
| S085 | Magic link validation/send error | Auth | L17 Sign in | Launch |
| S086 | Password sign-in (email step) | Auth | — | Deferred (was launch) |
| S087 | Magic link sent (password flow) | Auth | — | Deferred (was launch) |
| S088 | Confirm your email | Auth | — | Deferred (was launch) |
| S089 | Set a password (new account) | Auth | — | Deferred (was launch) |
| S090 | Welcome back (enter password) | Auth | — | Deferred (was launch) |
| S095 | AuthGateModal | Auth | — | Retired |
| S113 | You (signed out) | Auth | L21 You | Moved into launch |
| S001 | Global not-found | Empty/error | L23 Not found | Launch |
| S004 | Locality feed – no place | Empty/error | — | After launch |
| S005 | Feed empty state | Empty/error | — | After launch |
| S011 | Explore loading fallback | Empty/error | L01 Explore | Launch |
| S014 | Metro not covered panel (signed out) | Empty/error | L04 Not-covered panel | Launch |
| S015 | Metro not covered panel (signed in) | Empty/error | L04 Not-covered panel | Launch |
| S019 | Explore – no area resolvable | Empty/error | L26 Empty / error state | Launch |
| S020 | Explore – no results | Empty/error | L26 Empty / error state | Launch |
| S021 | Explore – load error | Empty/error | L26 Empty / error state | Launch |
| S024 | Following – loading | Empty/error | — | Retired |
| S027 | Following – empty | Empty/error | — | Retired |
| S036 | Page – nothing listed | Empty/error | L26 Empty / error state | Launch |
| S037 | Page not found | Empty/error | L23 Not found | Launch |
| S043 | Member profile – nothing posted | Empty/error | — | Retired |
| S044 | Private profile tombstone | Empty/error | — | Retired |
| S045 | Member not found | Empty/error | — | Retired |
| S049 | Member item not found | Empty/error | — | Retired |
| S051 | Place not found | Empty/error | — | After launch |
| S058 | Venue – nothing scheduled | Empty/error | — | After launch |
| S059 | Venue not found | Empty/error | — | After launch |
| S060 | Page item not found | Empty/error | — | After launch |
| S076 | Reports empty | Empty/error | L22 Review queue | Moved into launch |
| S084 | Sign-in link error (from callback) | Empty/error | L17 Sign in | Launch |
| S100 | Edit 404 (not owner / signed out) | Empty/error | L23 Not found | Launch |
| S107 | Metro list failed to load | Empty/error | L20 Signup details | Launch |
| S112 | You (loading) | Empty/error | L21 You | Moved into launch |
| S126 | Your Pages (loading/empty) | Empty/error | L21 You | Launch |
| S127 | Composer field/submit errors | Empty/error | L15 Edit Page (Page settings) | Launch |
| S130 | Following empty | Empty/error | L21 You | Moved into launch |
| S131 | Follow row error | Empty/error | L21 You | Moved into launch |
| S150 | Following tab (empty) | Empty/error | L21 You | Moved into launch |
| S151 | Saved tab (empty) | Empty/error | — | Retired |
| S061 | BottomNav / TopNavDesktop | Shell | L24 Nav | Launch |
| S065 | Toast (shared) | Shell | L25 Toast | Launch |
| S007 | Root redirect | System (no screen) | — | No UI |
| S038 | Page stale-handle redirect | System (no screen) | — | No UI |
| S052 | Legacy Page path redirect | System (no screen) | — | No UI |
| S062 | proxy (session refresh) | System (no screen) | — | No UI |
| S077 | db health | System (no screen) | — | No UI |
| S078 | schema health | System (no screen) | — | No UI |
| S079 | auth-before-user-created | System (no screen) | — | No UI |
| S080 | auth-signup | System (no screen) | — | No UI |
| S081 | Auth callback | System (no screen) | — | No UI |
| S091 | Legacy sign-up redirect | System (no screen) | — | No UI |
| S092 | Legacy business redirect | System (no screen) | — | No UI |
| S096 | Config redirect | System (no screen) | — | No UI |
| S101 | Legacy manage redirect | System (no screen) | — | No UI |
| S102 | Legacy map redirect | System (no screen) | — | No UI |
| S108 | Onboarding gate redirects | System (no screen) | — | No UI |
| S109 | QR redirect | System (no screen) | — | No UI |
| S110 | Legacy register redirect | System (no screen) | — | No UI |
| S149 | Sell index redirects | System (no screen) | — | No UI |
| S067 | Dev route gate | Dev (404 in prod) | — | No UI |
| S072 | AddEntityDrawer demo | Dev (404 in prod) | — | No UI |
| S093 | Card gallery | Dev (404 in prod) | — | No UI |
| S094 | MultiStepComposer demo | Dev (404 in prod) | — | No UI |

## 7. Launch screens: 74 → 23

**Final: 24 launch screens** (R1–R4 ruled; phone and hours ruled in and add no screens). From the 74 launch rows: 56 merge into 19 screens, 17 wait until after launch and 1 is retired (create review, R1). 17 rows move in because launch needs them (review queue 4, You 13), and 3 screens are new (rules agreement, hidden-content notice, and the text page behind About, Terms and Privacy). R4 also retires 20 rows that were after launch: the public member profile and member-hosted items, legacy `/following`, Your shops and the Saved tab.

### What each launch screen covers

| # | Launch screen | Inventory rows it replaces | How it merges |
| --- | --- | --- | --- |
| L01 | Explore | S008, S009, S010, S011, S012, S013 | One screen: signed in adds the Following row; search, loading skeleton, map and pin card are states of it. Signed out is list only (ruling 5) |
| L02 | Filter sheet | S016 | Kept (ruling 2026-09-19) |
| L03 | Area picker | S017 | One AreaPicker; MarketSelector defers with /you hub |
| L04 | Not-covered panel | S014, S015 | One panel; signed in hides the email field |
| L05 | Waitlist count popup | S018, S105 | Same dialog in two places; F076.7 requires a popup |
| L06 | Page | S028, S029, S030, S031 | One Detail screen with viewer variants: front door, signed in, follower, member. Signed in leads with the contact block (address or area, phone, website and links, hours) |
| L07 | Report sheet | S034, S035, S032 | Menu item opens the sheet; sent = toast. Carries F078's reason and misuse warning |
| L08 | Owner Page | S033 | Owner bar and sheets below 1280, panel from 1280 (ruling 6). A draft shows a banner and a "Before you publish" checklist; Publish sits in the bar or panel |
| L09 | Hidden-content notice | new (F078.3–4) | Owner notice on the Page + one-explanation sheet |
| L10 | What are you starting? | S118, S066 | **One question (R1):** the kind, each with its one-line purpose and default components; creates the draft and lands on it |
| L14 | Before you publish | new (F082) | Rules agreement, opened by Publish on the draft Page |
| L15 | Edit Page (Page settings) | S097, S098, S099, S119, S120, S121, S122, S125, S063, S064, S127 | Where the work happens: name, where (address, neighbourhood or online, Add a location), tags, description, photo, a Contact section (public business phone and weekly hours, ruled in 2026-10-01, both optional), website and links. A sheet per section on phone, the panel's Page settings from 1280; Save bar; errors use the shared form pattern |
| L16 | Event form | S143, S144, S145, S146 | One form (kind, details, when) opened from Tell people; no separate review |
| L17 | Sign in | S082, S084, S085 | Link-expired and send errors are states of the sign-in page |
| L18 | Check your email | S083 | Kept |
| L19 | Sign-in sheet | S070 | One sheet for every gate (Follow, Create, Map) |
| L20 | Signup details | S103, S104, S106, S107 | F081: one form, display name + zip (metro shown, not picked) |
| L21 | You | S111, S113, S115, S126, S152 | Currently not visible to others (R4): Pages you manage (drafts included, with Start something), Pages you follow (Unfollow with Undo), zip and metro, sign out. Also takes S042, S112, S114, S116, S128–S131, S150 |
| L22 | Review queue | S073, S074, S075, S076 | One screen: list, entry, reason sheet, empty state (F058, F078) |
| L23 | Not found | S001, S037, S100 | One page for every missing or not-yours URL |
| L24 | Nav | S061 | Shell |
| L25 | Toast | S065 | Shell |
| L26 | Empty / error state | S019, S020, S021, S036 | One component, copy varies |

L11–L13 (the old create steps 2–4) are gone; their fields are in L15 and the review step (S123) is retired.

### The 24, by template

| Template | Launch screens |
| --- | --- |
| Browse (4) | L01 Explore · L02 Filter sheet · L03 Area picker · L05 Waitlist count popup |
| Detail (1) | L06 Page (contact block signed in; front door signed out; events are posts on it) |
| Form (5) | L07 Report sheet · L10 What are you starting? · L14 Before you publish · L16 Event form · L20 Signup details |
| Manage (4) | L08 Owner Page · L09 Hidden-content notice · L21 You · L22 Review queue |
| Settings (1) | L15 Edit Page (Page settings) |
| Auth (3) | L17 Sign in · L18 Check your email · L19 Sign-in sheet |
| Empty / error (3) | L04 Not-covered panel · L23 Not found · L26 Empty / error state |
| Text page (1) | L27 Text page: About, Terms, Privacy (3 routes) |
| Shell (2) | L24 Nav · L25 Toast |
| Feed (0) | None at launch |

L27 Text page covers new rows N003 About, N004 Terms and N005 Privacy (decision 8 = B); they are in the CSV.

### Create: one question (R1, 2026-10-01)

Creation asks only what kind of thing someone is starting. A kind is a preset: it switches on default components, and any component can be added or turned off later. Copy is placeholder ([public-is-draft]); it avoids the word "Page" (Don's ruling in `purpose.ts`), person-nouns and "never".

**Heading:** What are you starting?

**Line under it:** This just gets things started. Next you'll add a name, where it is and anything else people should know. Nothing is public until you publish.

| Kind (as the person picks it) | One-line explanation | Comes with |
| --- | --- | --- |
| Opening a shop | For selling things you make, grow or carry. People can keep up with what you have. | Following, Announcements |
| Offering a service | For work you do for people, paid or free. People can find you and hear when you're open. | Following, Announcements |
| Creating a group for meetups | For people who get together, once or often. People ask to join and say when they're coming. | Joining, with your OK; Events people can say they're going to; Announcements |

**Line under the choices:** You can add or turn off any of these later.

**Button:** Start (creates the draft and opens it).

- The three kinds are the ones in the code today (`src/lib/sell/purpose.ts`). No event kind: Don dropped the one-time event kind (Later, 2026-10-01). A Page is an organization (group, business or organization) and events are posts it makes.
- Products & services is not a default yet: whether it is a component is still owner-spec ruling 3.
- "Joining, with your OK" assumes join approval exists; owner-spec ruling 4 says the code joins immediately today.
- A draft has no name until the owner adds one, so the owner sees a placeholder such as "Your new shop"; whether the database allows a nameless draft needs checking in code.

### Publishing (ruled 2026-10-01)

A Page publishes only with a **name, a location (an address, or an area or neighbourhood) and a description**; a photo is optional. The draft's "Before you publish" checklist shows these three with a tick each, and Publish stays disabled with the missing ones named until all three are in. Then Publish opens the rules agreement (F082).

- **Open question:** does "online" count as a location? The cards treat online as a valid location today (`TileCard`), but Don's list names only an address or an area.

### Default art when there's no photo

Every Page shows deterministic art when it has no photo: a neutral field with the kind's line icon, the same on every load for every viewer. No new colours: it reuses the four neutral tones `PersonMark` already uses, picked by a hash of the Page's id.

| Kind | Icon (monoline, 1.5px stroke) | Card and cover (4:3 / 16:9) | Small mark (avatar, pin card, owner lists) |
| --- | --- | --- | --- |
| Opening a shop | Storefront with awning | Neutral tone by id, icon centred at 40% of the short side | Page's initial on the same tone, as `PersonMark` does for people |
| Offering a service | Hand holding a tool | Same | Same |
| Creating a group for meetups | Three circles in a loose ring | Same | Same |
| Event post (no photo) | None; events are posts, not a kind | The card leads with its date box | The Page's own mark |
| Draft with no name yet | The kind's icon | Same | The kind's icon in place of an initial |

This follows `design-language.md` ("a neutral field with the kind's glyph — never a color, never an emoji, never a per-kind palette") and F070.4 (art derived from the Page's own id). The tones stay inside today's palette, so no colour decision is made.

**The gap today** (read in code, origin/main @ 18948ae):

- **Cards show one emoji, 🌱, for every Page with no photo** (`TileCard` default), on the surface colour. This breaks the design-language rule and F070.4.
- **The Page itself shows no cover image**, photo or default: `ShopPublicPage` uses the photo only to decide whether to show the hidden-photo notice. The only images it draws are 32px founder avatars.
- **There's no Page-level art.** `PersonMark` (initial on a neutral tone) exists for people only and hashes the name, not an id.
- **No kind icons exist**, and the kind isn't stored: the create choice changes words only and doesn't set `groups.kind`. **Per-kind art, and per-kind default components, need the kind saved on the Page.**
- Legacy accent-tint→amber gradients on the orphaned `EventCard` and `/following` go after launch.

### Rulings and scenarios this changes

- **`surfaces.md`**: delete "walkthrough stays six steps" (written by an agent, per Don) and the step-specific lines (tag step, collection picker); replace them with R1 and the publishing ruling.
- **F060** (start something without opening a shop): criterion 2 holds (the first question is what they're starting). Criterion 4 now means "start another" is one tap from the draft Page. F060.1's "F082 is made once before this flow" conflicts with F082 (before each publish), so the newer F082 wins and the line is pruned.
- **F061** (create a Page worth showing people): **this scenario is `building`.** Criteria 1–3 (address resolves with a pin, neighbourhood option, tag) move from create steps to Page settings. Criterion 5 (resume returns to review) is retired: the draft Page is the resume point. Add the publish requirements (name, location, description). **The Code session needs a stop note before more step work.**
- **F070** (every Page has a face): criterion 1 ("the composer completes without a photo") becomes "a Page publishes without a photo". Criterion 4 gains "a neutral tone and the kind's icon", which needs the kind stored.
- **F082** (rules before publishing): unchanged; Publish on the draft triggers it after the three requirements are met.
- **F087** (draft, the create flow asks what you're making): criterion 4 ("the choice changes the tools") becomes real: kinds are presets of components. Criterion 6 (no permanent kind) holds, because any component can be added later; the kind is stored only as the starting preset and the art.

### Deferred until after launch (17 rows)

- **Password sign-in** S086, S087, S088, S089, S090: `/auth/password` is linked from nowhere in the app (checked in code); magic link is the launch path.
- **Product and service composers** S135–S142, S147, S148: no launch-gating scenario needs them; a selling Page publishes without items (ruling R2).
- **Event detail page** S053: ruled out as a separate page (R3 = A); an event is a post on its Page, and its card carries date, time, place, going and Add to calendar.
- **MarketSelector** S124: only `/you` uses it (checked in code); markets are a retired vendor idea.

### Moved into launch (8 rows)

- **Review queue** S073–S076: F058 (reports reach a person, decisions reversible) and F078 (mobile review view) both gate launch.
- **You** S042, S111–S116, S128–S131, S150, S152: R4 makes You, currently not visible to others, the home for Pages you manage and follow, your zip and sign out; F081.4 needs the zip change there.

### Retired by R4 (2026-10-01)

You is currently not visible to others, and there is currently no public member profile; someone who wants to be followed creates a Page. A visible profile (like TikTok's) may come later.

- **Member profile and member items** S041, S043–S049: `/m/*` shows Not found.
- **Legacy `/following`** S022–S027, S095: shadowed by the redirect; Pages you follow live in You.
- **Your shops** S132–S134 and the Sell success toast S117: Pages you manage live in You; listings wait (R2).
- **Saved tab** S151: no Saved list at launch.
- **Not in Don's list for You:** changing display name and the email-updates toggle (today in the Settings tab). Both are left out at launch unless Don adds them.

### New (2 screens, not in the inventory)

- **Before you publish** (F082, gates launch).
- **Hidden-content notice** (F078.3–4, gates launch).

### Order

1. **Foundations:** tokens (no colour), AppShell + nav, Toast, Empty/error state, Not found, Sheet, Button, Card, form fields.
2. **Explore** L01–L05 · **Page** L06–L09 · **Create and edit** L10, L14–L16 · **Sign-in and You** L17–L21 · **Review queue** L22, in parallel once foundations merge.
3. **After launch:** the 48 rows already there plus the 17 deferred.

Already done today in `socialus-web`: Create opens the create flow (#275) and Edit asks before leaving with unsaved changes (#277).

## 8. Decisions for Don

Don ruled on 2026-10-01: colour is out of this pass, and 2–5 are accepted as recommended; 6 is ruled C, 7 is ruled A and 8 is ruled B. R1–R4 are new, from cutting the launch screens.

| # | Decision | Status |
| --- | --- | --- |
| 1 | Accent colour | Withdrawn: no colour decisions now; today's colours stay |
| 2 | Phone detail action bar | **Ruled:** sits above the nav, drops when the nav hides on scroll |
| 3 | Nav to the top | **Ruled:** at 744px |
| 4 | Nav hidden | **Ruled:** inside wizards and full-height sheets, plus sign-in, onboarding and admin |
| 5 | Signed-out Explore map | **Ruled:** list only; the Map pill opens sign-in |
| 6 | Owner panel at 1024–1279 | **Ruled C (2026-10-01):** below 1280 the owner gets the phone owner bar and sheets; the panel appears only from 1280 |
| 7 | Where the design language lives | Ruled A (2026-10-01): tokens in the app code are the single source; this doc and design-language.md keep only the reasons |
| 8 | Footer links | Ruled B (2026-10-01): the footer links About, Terms and Privacy; the three pages are launch scope (L27) |

### Open rulings from the screen cut

| # | Decision | A | B | C | Recommend / status |
| --- | --- | --- | --- | --- | --- |
| R1 | Create walkthrough | — | — | — | **Ruled 2026-10-01:** one question, the kind; lands on the draft Page; everything else is added in editing (section 7) |
| P | What publishing needs | — | — | — | **Ruled 2026-10-01:** name, location (address or area) and description; photo optional; default art when there's no photo |
| R2 | Product and service composers | Ruled A, 2026-10-01: product and service listings wait until after launch; launch is "a modern yellow pages with links and contact info" | — | — | **A** |
| R3 | Event detail page | Ruled A, 2026-10-01: no separate event page; an event is a post on its Page and shared links land on it there | — | — | **A** |
| R4 | You at launch | Ruled 2026-10-01: You is currently not visible to others (Pages you manage, Pages you follow, zip and metro, sign out); no public member profile for now, a visible one may come later | — | — | **A**; with R1 the drafts list matters more, since it's how an owner gets back to a draft |

Also open: whether "online" counts as a location for publishing (section 7).

**Next action:** Don has ruled on everything here; the foundations step (no colour) goes to the Code session as one ticket with `socialus-tokens.css` attached.

## 9. Built to change

Don will bring in a professional designer and wants them to change and play with the design easily (2026-10-01). Six rules make a change made in one place show up everywhere.

| Rule | What it means | Where it stands today (origin/main @ 5837e85) |
| --- | --- | --- |
| One token file | Every visual value (type, spacing, radius, shadow, layer, breakpoint and, later, colour) lives in one token file. Screens never use one-off values such as `text-[15px]` or `shadow-[0_8px_24px…]` | Not yet: 27 arbitrary text sizes, 9 arbitrary shadows, 348 raw palette classes. `socialus-tokens.css` is ready to adopt (decision 7 = A: the code is the source) |
| Components built once | Each shared component in section 5 exists once and every screen uses it | Not yet: ~10 sheet builds, 6 toasts, 4 Follow buttons, 4 area pickers |
| Copy in the copy module | Every user-facing string lives in `src/lib/copy.ts` (F084, draft), so wording changes in one file | Started: the module exists with 4 keys and 6 importers; most copy is still written inside components. At launch, the 23 launch screens move theirs; the rest follows after |
| Templates from components | The eight templates are layouts made of shared components, with no styling of their own, so changing a component or token changes every screen using it | New with this design |
| A playground | A dev-only route showing every token and every shared component in each state, at each breakpoint, so a designer sees and tweaks it all in one place | Partly there: `/card-gallery` already sits behind the dev gate (`src/app/(dev)/gate.ts`, 404 in production) |
| A check that enforces it | A CI check that fails on raw colour or size values outside the token file. Per `[guard-proves-itself]`, it is first seen failing on a fixture that breaks the rule | New. Because today's code would fail it hundreds of times, it starts as a ratchet: it records today's count and fails any PR that raises it, or any new file that has one |

- **Playground: in-app route, not Storybook (recommended).** An in-app route (`/(dev)/playground`) reuses the existing dev gate, the real app styles and the existing `card-gallery`, with no new build tool; a breakpoint switcher shows each component at 390, 744, 1024, 1280 and 1536. Storybook adds isolated stories, visual testing add-ons and a hosted catalogue a designer can open without the app running, but it means a second build and its own upkeep. Revisit Storybook when the designer is hired, if they want it.
- **New launch scope (small, flagged):** the playground route and the token check. Both fit in the foundations ticket. Moving every string to the copy module is bigger; at launch it covers only the 23 launch screens.
- **Colour exception:** colour is out of this pass, so until the colour ruling the check counts raw colours but blocks only new ones (the ratchet).

## Sources

[SocialUs — Who to Copy & Design Resources](../design-references.md) (precedents, breakpoints, owner panel, List/Map) · `socialus-screen-inventory.xlsx`, `screen-inventory-summary.md`, `owner-page-spec.md` (socialus-owner-page-design folder) · `socialus-web` origin/main @ 7a78277 (`src/app/globals.css`, `src/components/BottomNav.tsx`) · `ops-pattern` origin/main: `DECISIONS.md` (2026-09-30 component, front-door and visibility rulings; 2026-09-19 filter modal; 2026-09-17 Browse showcase), `product/ui/design-language.md`, `product/ui/surfaces.md`, `process/LIVING-DOCS.md`.
