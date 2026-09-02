# SocialUs — context pack for storyboarding the first-time-visitor experience

Read-only research pass over `socialus-web` (repo: `donlafranchi/socialus-web`, live at **socialus.org**, production Supabase project `socialus-db`). No code changed. Compiled 2026-09-02.

**Top-line finding, before the sections below: the app is mid-migration between two data models, and the nav sends new visitors straight into the old, dead one.** See §7 for detail — it reframes almost everything else here, so read it first if you only read one section.

---

## 1. Route map

All routes live under `web/src/app`. "Schema" column: **NEW** = queries the live Person/Item/Location/Group/Place tables; **OLD** = queries a vendor/market/business schema that **no longer exists in production** (verified — see §7); **n/a** = no direct queries (static, or delegates).

| Path | Auth | Schema | Renders | File |
|---|---|---|---|---|
| `/` | Anon | NEW | Home. Server component. Resolves a Place (signed-in home locality → `?place=` → default) and renders the locality feed, a "Make this yours" sign-up banner, and a locality scope picker. | `app/page.tsx` → `components/feed/LocalityFeed.tsx` |
| `/explore` | Anon | OLD (dead) | "Explore." Queries `businesses`/`vendor_categories`/`market_vendors` — none exist — so it always renders in "recruitment" mode: category slots reading "No one listed yet," one hardcoded example listing, "List here — it's free" CTAs. Looks intentional, not broken, but it's an accident of the queries failing (see §6). | `app/explore/page.tsx` → `components/ExplorePage.tsx` |
| `/you` | Gated | OLD + NEW mixed | Signed out: clean "Sign in to follow vendors…" card + "List your business" link. Signed in: header, an always-on Sell CTA (NEW), a "Your Market" row (OLD, dead `markets` table), a Following summary (NEW, F042/T108, self-hides if empty), Saved/Following/Settings tabs backed by dead OLD tables (always empty), and a RecruitmentGrid at the bottom if the member has no business Group. | `app/you/page.tsx` |
| `/you/following` | Gated | NEW | Following management — sections, Unfollow/Leave, undo (T109). | `app/you/following/page.tsx` |
| `/you/sell` | Gated | NEW | "Sell" index — lists the member's active business Group(s) with a per-Group composer row (product/service/gathering). Redirects out if no business Group. | `app/you/sell/page.tsx` |
| `/you/vendor` | Gated | OLD (dead) | Vendor dashboard — stats, follows, bulletins — all against dead `vendor_stats_daily`/`vendor_events`/`businesses` tables. | `app/you/vendor/page.tsx` |
| `/you/vendor/bulletins`, `/[id]`, `/new` | Gated | OLD (dead) | Vendor bulletin composer/list/detail against dead `vendor_bulletins`/`bulletin_deliveries`. | `app/you/vendor/bulletins/**` |
| `/following` | Anon-reachable | OLD (dead) | Old "who I follow" page against dead `follows`/`businesses`/`market_vendors`/`vendor_categories`/`markets`. | `app/following/page.tsx` |
| `/business/[slug]` | Anon | OLD (dead) | Old business detail page, queries `businesses`. | `app/business/[slug]/page.tsx` |
| `/vendors/[slug]` | Anon | OLD (dead) | Old vendor detail page, queries `businesses`/`market_vendors`/`vendor_categories`/`markets`. | `app/vendors/[slug]/page.tsx` |
| `/register-vendor` | Anon | OLD (dead) | Old vendor sign-up form, inserts into `businesses`/`vendor_categories`/`market_vendors`. | `app/register-vendor/page.tsx` |
| `/join` | Anon | n/a | QR-code / link page for a sign-up flow (not the onboarding wizard). Client component, checks auth state. | `app/join/page.tsx` |
| `/onboarding` | Gated | NEW | Three-step post-signup wizard (see §3). Redirects to `/` if the member already has a home locality. | `app/onboarding/page.tsx` |
| `/auth/login` | Anon | n/a | Magic-link email form ("Sign in to SocialUs"). | `app/auth/login/page.tsx` |
| `/auth/signup`, `/auth/password` | Anon | n/a | Auth sub-pages (not walked live this pass). | `app/auth/**` |
| `/auth/callback` | n/a | n/a | Supabase auth callback route handler. | `app/auth/callback/route.ts` |
| `/m/[handle]` | Anon (privacy-gated per member) | NEW | Public Member page — the one intentionally global namespace (ADR-20). Resolver returns render/tombstone/404 depending on the Member's discoverability + privacy settings. | `app/m/[handle]/page.tsx` |
| `/m/[handle]/p/[slug]` | Anon | NEW | Public product Item page (individual-seller path). | `app/m/[handle]/p/[slug]/page.tsx` |
| `/m/[handle]/s/[slug]` | Anon | NEW | Public service Item page. | `app/m/[handle]/s/[slug]/page.tsx` |
| `/m/[handle]/e/[slug]` | Anon | NEW | Public gathering/event Item page. | `app/m/[handle]/e/[slug]/page.tsx` |
| `/p/[...slug]` | Anon | NEW | Place-scoped catch-all URL (`/p/ca/sacramento/oak-park`, etc.), per ADR-20's place hierarchy. Flagged in its own header comment as structurally constrained — Next's App Router won't allow a static segment after a catch-all, so Groups/Locations/Items nesting under `/p/<place>/g/<group>` will have to fold into this same file later. | `app/p/[...slug]/page.tsx` |
| `/api/internal/auth-before-user-created`, `/api/internal/auth-signup` | Internal | n/a | Supabase auth hooks. | `app/api/internal/**` |
| `/(dev)/add-entity-demo`, `/(dev)/composer-demo` | Dev only | n/a | Component demo pages — **404 in production** (route group not deployed). Only reachable locally. | `app/(dev)/**` |

No `proxy.ts` (Next 16's rename of `middleware.ts`) enforces auth on any of the above — it only refreshes the Supabase session cookie on every request. Page-level auth is each route's own job (see §6).

---

## 2. The logged-in screens

**This section is incomplete — flagging plainly rather than guessing.** I captured the anonymous states directly (below). Capturing signed-in states hit two real blockers this pass:

1. **The built-in browser's magic-link sign-in is broken for this app.** Confirmed by Don: "PKCE code verifier not found in storage" — the code verifier gets written in one browser context and the callback lands in another, which `@supabase/ssr`'s PKCE flow can't reconcile. Not a bug in the app so much as a mismatch with how the built-in browser pane isolates tabs.
2. **Claude in Chrome (the path to use Don's real, already-signed-in Chrome) reported the browser extension not connected** for the rest of this session — needs a restart/reinstall check on Don's end.

Also worth stating plainly: given the live counts in §5 (1 member, 0 items, 0 locations, 0 groups), there is close to nothing a signed-in screenshot would show that the anonymous screenshots don't already cover in spirit — the richest signed-in-only thing to see is the **onboarding wizard**, which is genuinely invisible from outside. That's the one screen worth a follow-up session once Chrome reconnects.

### Captured (anonymous, socialus.org, mobile viewport ~800×920)

**Home (`/`).** "Make this yours — sign in to set your home locality" banner top-right ("Sign in" button). "Near Sacramento" heading, a locality dropdown currently reading "Sacramento" (options: Sacramento, Land Park, Curtis Park, Oak Park, Midtown, East Sacramento — confirmed via the page's accessibility tree). Body: "No matches near you yet" / "Browse nearby Places to see what's around" / "Widen to Sacramento" button. Bottom tab bar: Home (active) · Explore · You.

**Explore (`/explore`).** Not the "stuck on Loading…" state the original brief assumed — it fully renders, just in a cold-start "recruitment" mode: "We're looking for makers in Sacramento," one large example card ("Clara's Kitchen," a fictional sourdough baker, marked EXAMPLE LISTING), then nine emoji-headed categories (Food Makers, Growers, Home & Body Goods, Textile & Fiber, Wood & Metal Makers, Repair & Restoration, Traditional Trades, Teachers & Workshops, Animal Products, Local Service Providers), each with three named sub-roles all reading "No one listed yet in Sacramento — List here, it's free," plus one more fictional example per category. Toggle for List/Map view, filter chips (market/category/day), search bar. This entire screen is static/hardcoded copy — it isn't reading real category or vendor data, it's a recruitment funnel dressed as a directory.

**You, signed out (`/you`).** Clean, minimal: "You" heading, "Sign in to follow vendors and save your market. We email you a link — no password," a "Sign in" button, then a divider and "Are you a business owner? → List your business."

**Sign in (`/auth/login`).** "Sign in to SocialUs," "Enter your email and we'll send you a link. No password — new here or not, this is the way in," an email field, "Email me a sign-in link" button.

### Not captured — needs a follow-up pass

- Home, signed in, with a home locality set (moot right now — no items exist to differ)
- Home, signed in, brand-new account with nothing followed
- The full onboarding wizard, step by step — **highest-value gap**, entirely invisible from outside
- `/you` signed in (Sell CTA, Your Market row, Following summary, tabs)
- A Member page (`/m/[handle]`) — there's exactly one member in production; worth loading once to see the real shape
- A Place page (`/p/...`)
- Any error state

---

## 3. Onboarding, exactly as it exists

Post-signup wizard at `/onboarding` (component: `OnboardingFlow.tsx`, T089/F030), gated: redirects anonymous visitors to `/auth/login?next=/onboarding`, and redirects a member who already has a home locality straight to `/`. Three steps on a shared `MultiStepComposer`:

1. **"Tell us who you are."** Fields: name (required), handle (required — 4–30 lowercase letters/numbers/hyphens, validated client-side, with a suggestion chip row if the chosen handle collides), bio (optional), pronouns (optional). Helper text: "Your name and handle are public. The rest is optional." Saves via a server action on Continue.
2. **"Where's home?"** A single dropdown of neighborhoods/cities from the live `places` table (kind = neighborhood or city, up to 40). **Not skippable** — the step won't advance without a selection, because "the feed needs a locality." Helper text: "We'll show you what's happening nearby. You can change this later." Saves via a server action on Continue.
3. **"What are you into?"** A chip grid of interest tags (`INTEREST_VOCAB`), pick a bounded range or none. **Skippable** — button reads "Show me my feed" either way. Helper text: "Pick N–M, or skip — your feed leans on your locality either way."

On completion (or on abandon, via an explicit abandon handler), the user lands on `/`. Each step's data writes to the database on that step's own Continue, not just at the end — so a user who backs out partway through leaves a partial-but-real record (name/handle saved even if they never pick a locality... except locality is required to finish, so in practice a fully-abandoned run means at least a display name saved with no locality).

---

## 4. The data model, in plain language

The live schema (queried directly against the `socialus-db` Supabase project) is organized around four primitives — this matches the platform's own documentation (`product/foundation/primitives.md`) almost exactly, which is a good sign that the schema and the product thinking haven't drifted from each other, even though the *app code* has drifted from the schema (§7).

**Member** — a real, named human. `members` (1 row live). Related tables: `member_privacy` (opt-out privacy controls, one row per member, auto-created on signup), `member_handle_history` (old handles redirect for 90 days after a change), `member_interests` (public tag list), `member_follows` (who follows whom — members, groups, or venues; public by default), `member_self_records` (an opt-in context document for AI-assistant use, only present for members who've opted in), `member_delegations` (scoped, expiring permission grants to a non-human actor — an assistant, a Skill, a federation peer), `member_place_interests` (a member's home place plus up to 5 secondary places of interest — owner-only visibility), `member_saved_searches`, `member_business_jurisdictions` (a self-attested claim that a member's business serves a given locality), `member_prompts` (one-time UI nudges, e.g. "you just got your first business Group — want to be discoverable?").

**Item** — anything a member declares: a product, service, gathering, or "wonder" (a floated idea/ask) at b1; offer/ask/initiative are reserved for later. `items` (0 rows live) plus a kind-specific child table (`item_products`, `item_services`, `item_gatherings`, `item_wonders`). Five-state lifecycle: draft → published → withdrawn/fulfilled/closed. Items attach to one or more Locations (`item_locations`), get tagged two ways — a curated vocabulary (`item_tags`) and free-form hashtags (`item_hashtags`) — and collect uniform responses (`item_responses`: interest/rsvp/follow/save/pledge/purchase/support).

**Location** — a physical place: permanent (a venue), recurring-temporary (a market that happens Saturdays), or an area (a stretch of road, a park). `locations` (0 rows live) plus `location_permanent`, `location_recurring_temporary`, `location_areas`.

**Group** — a named, self-selected set of members organized around something. `groups` (0 rows live), six kinds (place / interest / practice / event-anchored / family / business — family defaults to private). A business Group (`group_businesses`) is how a personal business is represented; there is deliberately no "business as its own legal actor" primitive — every business traces back to the member(s) who run it (`group_memberships`).

**Place** — the platform-curated geographic hierarchy that everything else hangs off of (state → county → city → neighborhood). `places` (16 rows — Sacramento and its neighborhoods). Writes are curator/service-role only, not member-driven. `metro_polygons` and `zip_metro_crosswalk` support metro-scope discovery and business-jurisdiction proximity checks but never appear in URLs.

Every mutable table above (`member_events`, `location_events`, `group_events`, `item_events`, `place_events`) has a matching, monthly-partitioned, append-only event-log table — a full audit trail is a first-class design decision here, not bolted on. Every one of them is also documented as "writes only via the action layer" — no direct table access from routes, by design (see §7's action-layer rule).

One live security note surfaced while pulling this, unrelated to the migration issue: `public.spatial_ref_sys` (a PostGIS system table) has Row Level Security disabled, which technically exposes it to the anon/authenticated roles. It's PostGIS's own reference table (coordinate system definitions, not user data), so the practical risk looks low, but flagging it since it's the one thing Supabase's own advisor called "critical." Not fixed — read-only pass.

---

## 5. Actual content volume (production, queried directly)

| Metric | Count |
|---|---|
| Registered members | **1** (has a handle set) |
| Items (any state) | **0** |
| Published items | **0** |
| Locations | **0** |
| Groups (any kind) | **0** |
| Business Groups | **0** |
| Items with a location attached | **0** |
| Active follows | **0** |
| Members with a home locality set | **0** |
| Member interest-tag rows | **0** |
| Places (platform-seeded, not member content) | **16** — Sacramento + Land Park, Curtis Park, Oak Park, Midtown, East Sacramento (the neighborhoods) |

Report it straight rather than hedge it: **there is no member-generated content in production yet.** The single registered member has a handle but no home locality set (didn't finish onboarding, or onboarded before the locality step existed) and no interests, items, locations, or groups. Every "empty state" you'll design around isn't a hypothetical edge case here — it's the *only* state the product is currently in, everywhere, for every visitor. Sacramento is the only locality with anything at all, and what it has is 5 curated neighborhood names, nothing else.

---

## 6. Why the sign-in gate exists

Mixed answer, and worth being precise about it rather than picking one:

- **`/you` is a real, deliberate gate.** The page checks `supabase.auth.getUser()` client-side and explicitly renders a sign-in card when there's no user — clean, immediate, no hang.
- **`/explore` is not gated at all, and its "stuck" appearance in the original brief isn't quite right either.** It's fully anonymous-reachable and renders content for everyone. What actually happens: it queries three tables (`businesses`, `vendor_categories`, `market_vendors`) that **don't exist in the current production schema** (confirmed both by a direct schema check and by live console 404s from the Supabase REST layer on that page). The queries fail, the code's `?? []` fallbacks kick in, `vendors.length` is 0, and the component's built-for-cold-start "recruitment grid" branch renders — which happens to look intentional. It would render *exactly the same* whether those tables existed with 0 rows or don't exist at all. So: not an auth gate, and not really "broken" in a way a visitor would notice — but it's not reading real data either, and never will until someone either restores those tables or rewires the page to the new Item/Group schema.
- **Content could render for a logged-out visitor already, and mostly does** — Home, Explore, Member pages, and Place pages are all anonymous-reachable today. The place that's genuinely locked behind auth by design is `/you` (a personal dashboard) and `/onboarding` (needs an identity to attach to). That's a reasonable, deliberate split, not an accident.

---

## 7. What's built vs. what's stubbed

**The headline finding of this whole pass:** this codebase is mid-migration between two generations of the data model, and both are live in the route tree at once.

- **Old generation** (routes: `/explore`, `/you`'s saved/following/settings tabs and Your-Market row, `/you/vendor` + bulletins, `/following`, `/business/[slug]`, `/vendors/[slug]`, `/register-vendor`; components: `ExplorePage`, `MarketContext`, `VendorCard`, `BusinessDetailCard`, `OwnershipBadge/Selector`, `PillarSelector`, `RecruitmentGrid`) queries a vendor/market/business schema — `businesses`, `markets`, `vendor_categories`, `market_vendors`, `vendor_bulletins`, `bulletin_deliveries`, `vendor_stats_daily`, `vendor_events`, `follows` (old shape), `supports`, `user_preferences`. **None of these eight-plus tables exist in the live database** — verified directly (`to_regclass` returns null for all of them). This isn't unfinished work; it's the previous product generation ("Movers, Makers & Shakers" — a farmers-market vendor directory), superseded by a schema migration to the generalized Member/Item/Location/Group model, with the old routes and components never removed.
- **New generation** (routes: `/`, `/onboarding`, `/m/[handle]` + its `/p`, `/s`, `/e` sub-routes, `/p/[...slug]`, `/you/sell`, `/you/following`; components under `components/feed`, `components/member`, `components/item`, `components/group`, `components/onboarding`, `components/sell`, `components/follows`, `components/venue`) queries the live `members`/`items`/`locations`/`groups`/`places` schema through a documented "action layer" (server actions and `lib/` functions, not inline queries — enforced by a CI rule in `CLAUDE.md`: no bare Supabase client outside `src/actions/_lib`). This is the actively-developed, well-documented half — every file in this generation carries a ticket number, a spec reference, and often an ADR citation in its header comment.
- **The primary nav — Home / Explore / You — is exactly one old-generation route (`/explore`) and one hybrid route (`/you`, mixing both generations on the same page) out of three tabs.** A brand-new visitor's first two taps after Home go somewhere that cannot show real data no matter what gets seeded, until that page is either rewired to the new schema or retired.
- `/join` generates a QR/link for something (not the onboarding wizard) and wasn't fully traced this pass — worth a closer look before the designer treats it as either generation.
- Almost no TODO/FIXME comments in the codebase (one, in `lib/places/resolve-path.ts`, about a future redirect-middleware layer) — this isn't a codebase riddled with incomplete stubs in the usual sense; the debt is structural (two schemas, one route tree), not a pile of unfinished individual features.
- The design-spec doc (`product/ui/design-language.md`) and the shipped CSS (`globals.css`) disagree on the brand color — see §8. Same category of drift as the schema issue: documentation and implementation moved independently.
- `/(dev)/composer-demo` and `/(dev)/add-entity-demo` — component showcase pages — exist in the repo but return 404 in production (the dev route group isn't deployed), so I couldn't pull component screenshots from them.

---

## 8. Design system

Tokens live in `web/src/app/globals.css` (Tailwind v4, `@theme inline` block) — this is what's actually shipped and rendering at socialus.org right now:

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#ffffff` | Page background |
| `--color-surface` | `#f7f6f2` | Subtle surface |
| `--color-fg` | `#1a1a1a` | Body text |
| `--color-fg-muted` | `#6b6b6b` | Secondary text |
| `--color-border` | `#e5e3dd` | Hairline separators |
| `--color-accent` | `#0fab8e` | Brand accent — a teal ("Tide") — CTA fill |
| `--color-accent-hover` | `#0a8a72` | CTA hover |
| `--color-accent-tint` | `#e8f7f2` | Light accent wash |
| `--radius-sm / md / lg` | 8px / 12px / 16px | Inputs & chips / cards & buttons / modals & sheets |
| `--shadow-sm / md / lg` | `0 1px 2px rgba(0,0,0,.04)` / `0 6px 16px rgba(0,0,0,.12)` / `0 12px 32px rgba(0,0,0,.16)` | Subtle lift / hover & sheets / modals |
| Ownership-tier spectrum | coop `#0e6b2e` → independent `#1b7a3d` → mission-driven `#5a8f66` → local-franchise `#97a89a` → challenger `#b0b0b0` → pe-corporate `#2a2a2a` | Green→gray/black spectrum for badges + map pins only; `data-extractive="true"` listings render `grayscale(0.6)` + 78% opacity, full color on hover |

Typography: **Inter** (via `next/font/google`), weights 400/500/700 loaded. Component recipes defined as plain CSS classes (not `@apply`, deliberately — a comment in the file notes Tailwind v4 drops arbitrary-value color utilities inside `@apply`): `.input`, `.btn-primary`, `.btn-secondary`, `.card`, `.card-hover`, `.chip`, `.chip-selected`.

**Flag: the written design spec disagrees with the shipped code.** `product/ui/design-language.md` (marked `status: active`, and cited in `web/CLAUDE.md` as the non-negotiable source of truth) specifies a completely different palette — brand color "Satin Pistachio" `#BACBB5`/`#A0B49A` (sage green), body text `#2D2D2D`, a much fuller token set (semantic colors, a 12–32px type scale, named shadow/radius/motion specs) — none of which matches what's actually in `globals.css`. Whichever one is "correct" for the storyboard is a call for Don, not me; I'd default to the shipped CSS since that's what a visitor actually sees, but the spec doc reads like it was written with real intention (it's detailed and principled — "photography is sacred," bottom-anchored controls, Airbnb-style restraint) and may reflect where the design is *headed* rather than where it is.

No live component-showcase page was reachable (see §7 — the dev demo routes 404 in production), so no isolated component screenshots this pass; the closest available "component gallery" is the Explore page's recruitment cards, captured in §2.

---

## 9. Founder's own words

**`web/README.md` (currently live in the repo, unchanged since before the SocialUs rename):**

> "Map-based platform helping consumers find independently owned local businesses and distinguish them from PE-acquired or corporate-owned competitors."

That's the *old* positioning — worth flagging since it's the first thing anyone opening the repo reads, and it no longer matches either the product name or the platform-promise doc below.

**`web/src/app/layout.tsx` (live meta description, socialus.org):**

> "Follow the makers you meet at your local farmers market. Every dollar you spend here stays here."

**`product/foundation/platform-promise.md` (status: active — the most deliberate prose in the repo; excerpts):**

> "A member platform built to strengthen the communities who build it with us. We connect neighbors to makers, growers to kitchens, communities to each other, and we turn that connection into durable local prosperity."

> "Our loyalty is to our members — the makers, growers, sellers, buyers, and communities who partner with us. Not to shareholders, not to investors, not to anyone whose interests aren't aligned with the people who make the platform worth using."

> "A member isn't a user or a customer — they're a partner in what we're building."

> On producers specifically: "Producers... are the spear of this platform. Their work keeps wealth in the community... **You will leave the platform stronger than you arrived.**... **Your relationships with your customers belong to you.**... **You will never pay for visibility.**"

> On aspiring producers: "The platform is also for people who haven't started yet — anyone who wants to make money from what they make, grow, cook, or know how to do, instead of taking a job that extracts their time for someone else's margin."

> Closing line: "**Buy close. Build community. Build the future together.**"

This last document is the clearest statement in the repo of who it's for and what problem it solves, and it's notably broader than either the README or the meta description: it's explicitly not just a commerce/discovery tool. It frames the platform as relationship infrastructure first (neighbors, shared projects, mutual aid, an educational layer, eventual shared institutions like banking/insurance/equipment co-ops) with commerce as the sustaining mechanism, not the point — consistent with how Don's framed the project's intent directly: a catalyst for communities to build real things together — businesses, social groups, third spaces — with commerce as what sustains it, not what defines it. Worth handing this doc to the designer directly rather than paraphrasing further; it's short, well-written, and clearly the platform's own voice.

---

## What this means for the storyboard, in one paragraph

The designer is going to be storyboarding a genuinely early, thin product: one real member, zero real content, anywhere. The good news is the newest-built surfaces (Home's locality feed, onboarding, Member pages, Place pages) are coherent, well-documented, and clearly designed around the cold-start problem on purpose (empty states with real next-actions, not dead ends). The bad news is two of the three primary nav tabs (`Explore`, half of `You`) lead into a retired product generation that can't be fixed by seeding data — it needs either a rewrite against the current schema or a decision to retire those tabs. That's a product/roadmap call, not a storyboarding detail, but the designer should know it before treating Explore's current look as an intentional design to build from.
