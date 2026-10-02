---
id: what-surfaces
purpose: The surfaces — every screen the product has or will have, what each is for, and whether it works. Spine document: every entry carries its own status and holds both horizons, what ships now and what is intended later. The future version of a surface is a status on its entry here, never a second description elsewhere. Replaces community-platform.md.
layer: what
status: active
owns:
  - surface-index
  - surface-roles
---

# The surfaces

> **Superseded in part by [`model.md`](../foundation/model.md) (2026-09-10).** Don restated the model directly: there are no Items, and a post carries a time or it doesn't. The conflicts below are known and unfixed — this document has not yet been reconciled. Where the two disagree, `model.md` is right.

> **One of three tracking documents**, with [`../foundation/nouns.md`](../foundation/nouns.md) (what things are) and [`../foundation/verbs.md`](../foundation/verbs.md) (what may be done to each). **Together they track what this app does and will do — not only what ships on 30 October.**
>
> **A screen is never called a Page.** **Page is an entity** — an organization: a group, a business, or another organization. **A screen is a surface.** The document this replaces broke that rule throughout and said so in its own banner. Compound forms that name a screen for a specific noun — *the Item page*, *the venue page* — are the one exception and are avoided here anyway.
>
> **This document is where things show. `nouns.md` is what things are.** Conflating them is how the Sell door became the only create path.

**Evidence base:** [`../../planning/backlog/audit-route-inventory.md`](../../planning/backlog/audit-route-inventory.md) — the route-by-route read of `web/src/app` against the migrations. **That file is evidence and goes stale on every route change; this file is the spec and says what each surface is *for*.**

## Status vocabulary

- **● Live** — exists, works, on the current model.
- **◑ Live but hollow** — routable and on the navigation, with a data layer reading tables that do not exist.
- **⊗ Residue** — pre-rebuild, still routable, reads tables that do not exist. **Nobody arrives here by accident; nothing stops them arriving deliberately.**
- **○ Postponed** — the surface does not exist and is ruled in.

**Ten table names appear in shipped surface code and in no migration:** `businesses`, `follows`, `supports`, `user_preferences`, `vendor_categories`, `markets`, `market_vendors`, `vendor_bulletins`, `bulletin_deliveries`, `vendor_stats_daily`, `vendor_events`. **A surface reading any of them cannot work**, and in every case the error path falls through to a redirect or an empty state — which is why none of them look broken.

---

## Surface roles

**Three tabs and a create action: Home, Browse, You, and `+`.** This is what the code ships, and — since 2026-09-12 — what is ruled.

**The two-tab merge is rescinded** *(2026-09-12)*. Don: *"we rescinded that decision to make the launch date."* **A scope cut for 30 October, not a design conclusion** — the merge was not judged wrong on its merits. Anyone reviving it needs that context. `../../DECISIONS.md`.

**One thing in the nav is still missing: the create action.** Three tabs ship; the `+` does not. That was the half of the two-tab decision that was never about tab count.

| Slot | Job | The question it answers |
|---|---|---|
| **Home** | The locality feed | *What's happening near me?* |
| **Browse** *(route `/explore`)* | Search, filter, map | *I'm looking for something specific.* |
| **You** | The Member's own things | *What am I doing here, and what did I follow?* |
| **+** | Create | *I want to put something up.* |

**Browse is being rewritten around Pages** *(ruled 2026-09-09 — the existing scenario is rewritten, not replaced)*. Today it indexes Items only. **It is rewritten where it lives, not moved onto Home** — the merge is rescinded.

**Undecided: what address Browse lives at.** The merge would have put it at `/`; that is rescinded. It sits at `/explore` today. Whether it stays there, moves to `/browse`, or takes `/` with Home moving is **open, and nothing has ruled on it.** It is a naming and URL question, not a structural one — all three shapes ship the same three tabs.

**Home and Browse are two surfaces with two jobs** *(ruled 2026-09-12)*: **Browse is complete and not ranked by the member's interests; Home is personal.** The second exists so a member's interests are not buried in the first. `../foundation/model.md` § Why Home and Browse both exist, its one home — including the hard line that *personalized* means declared interests and place, never engagement.

**What browse indexes is everything the platform holds** *(ruled 2026-09-12)* — Pages and posts, flat, with posts as an instance rather than a separate rule. `../foundation/model.md` § Browse is everything.

**The rewrite carries a second constraint** *(ruled 2026-09-12, extended 2026-09-13, **narrowed 2026-09-19**)*: **no category control on the results surface.** It began as "zero filter pills", became "search is the filter", and ended with categories retired entirely. **The retirement is reversed and the control ban is not:** a Page's owner now picks **collections** from a curated set of about ten (`../foundation/nouns.md` § Page), and **no surface renders them as a row of controls beside results** — narrowing happens in a modal that writes its selection into the search box as text (2026-09-19). `../foundation/model.md` § Search is the filter. Scenario: `../../planning/scenario-F071.md` (`draft`).

**The composer's category step becomes the tag step** *(ruled 2026-09-13)* — pick-or-create a tag, now on the draft Page: **creating a Page is one question, its kind, and lands on the draft Page** *(2026-10-01, F061)*. **It gains a collection picker** *(2026-09-19)*, which sits there too. **The edit form has two fields, name and description** — no tag or collection editing exists there at all. **Unbuilt:** it renders the twelve retired terms today. **Creators create their own tags, so nothing needs seeding** — the picker fills itself as they are used. Blocked only on report-and-takedown, per [member-content-takedown].

[open-question owner=don raised=2026-09-19] Which ten names are the collections, and does the picker suggest from a Page's tags? *(Narrowed 2026-09-19 — Don ruled membership is owner-set, so what is left is the list and the picker's helpfulness.)* The straw man is Food & Drink · Coffee · Brewery · Bakery · Makers · Fitness · Outdoors · Music & Nightlife · Services · Clubs & Groups, **not ratified**. A) **Ship the straw man as-is**, revise on evidence; cheapest, and the first ten Pages will show whether it fits. B) **Don edits the list first** — `planning/search-dictionary-draft.md` already exists for exactly this shape of task and its twelve reading-aid headings are close to these ten. C) **Derive the first version from the seed tag vocabulary** and have Don cut it down. *Recommend B, reusing the draft file he already has.* **Separately and cheaply: may the picker pre-tick a collection from what the owner typed as tags?** That is a suggestion, not membership, so it reverses nothing — but T159 called a tag suggester a progressive enhancement and left it out, so it is new work either way.


[open-question owner=don raised=2026-09-29] Are the store apps the site in a native shell, or native screens on the same database? A) **A shell around the site** (Capacitor-style): every screen and server action works as it does today, and the work is the gaps in `PLATFORM-IOS.md`. The risk is App Review 4.2, which rejects an app that is only a repackaged website, so it needs push or another native feature to pass. B) **Native screens**: the best phone experience, but every write goes through Next server actions that write with `pg`, which a native client cannot call. Each one needs an RPC or an API route first. C) **Wait**: ship the web app on 30 October and decide after launch, with the markers keeping the list current meanwhile. *Recommend C, then A.* Nothing native is on the launch list, and A reuses everything that exists.

---

## Page routes — 25

### Live

| Route | Surface | What it's for |
|---|---|---|
| `/` | Home | ● The anonymous, locality-defaulted feed. Reads `locality_feed_items` → `discoverable_items`. **Takes a place and interest tags. Takes no follow input** — see the announcement gap below. |
| `/explore` | Browse | ● Search, kind pills, secondary filters, list and map by width (F059 criterion 5, 2026-10-01) — **the pills and secondary filters are ruled out** *(2026-09-12, search is the filter)*. **A first-class surface, not a mode of Home** *(2026-09-12)* — though whether Browse keeps this address is undecided. **Indexes Items only**, and **its pill row is a ratified defect** — filtering controls move off the results surface (`design-language.md` principle 10). The surface the Pages rewrite lands on. [platform location: the map and the metro pill ask the device for its position (`Map.tsx`, `MarketPill.tsx`); Browse must still work when the member refuses] |
| `/auth/login` · `/auth/signup` · `/auth/password` | Auth | ● Email-first, with magic link secondary. [platform auth gap: redirects are built from `window.location.origin` and the PKCE verifier is a host-only cookie, so neither a magic link nor a Google sign-in can return to an app] [platform store=sign-in gap: Continue with Google is offered and Sign in with Apple is not] [platform store=age-rating gap: signup asks no age and states no minimum, and there are no terms] |
| `/onboarding` | Onboarding | ● Hood and metro pick, post-signup. Idempotent re-entry. **A person currently finishes this without ever being told what the product is for** — the copy pass is Fortnight 4. |
| `/m/[handle]` | Member | ● A Member's public surface. **The one deliberately global namespace** — the handle is the auth identity and must survive relocation. [platform link: `/m/<handle>`, a member's public surface] |
| `/m/[handle]/p/[slug]` · `/s/[slug]` · `/e/[slug]` | Item | ● Product / service / gathering, for Items not filed under a Page. |
| `/p/[...slug]` | The place-scoped catch-all | ● Places, Pages, Venues, and Group-filed Items — dispatches to five resolvers. **The most load-bearing route in the app**, and the only one whose URL shape matches the naming conventions. [platform link: `/p/<state>/<city>/…`, place addresses; legacy slugs redirect to the canonical Page] |
| `/g/[handle]` · `/g/[handle]/edit` | Page | ● **The canonical Page**, `/g/<slug>-<id>` (2026-09-21 ruling); its owner edits it at `/edit`. [platform link: `/g/<slug>-<id>`, the address every share, crawler and withheld-announcement anchor resolves to] [platform link gap: the site serves neither `apple-app-site-association` nor `assetlinks.json`, so no shared link can open an app] [platform photos: the owner picks a Page photo from the library; it is resized and re-encoded to WebP on the device, which strips its location data] [platform store=ugc: anyone signed in can report a Page, its photo hides at once, and the operator restores or removes it at `/admin/reports`] [platform store=ugc gap: announcements and member profiles cannot be reported, and no member can block another] |
| `/you/sell` | Seller index | ● The walkthrough's destination. |
| `/you/following` | Following | ● People / Groups / Venues, with unfollow and leave. **Management only — it lists who you follow and delivers nothing.** |
| `/join` | Shim | ● Redirects to `/you`, or to login first. Explicitly interim; replaced `/register-vendor`. |

### Live but hollow

| Route | Surface | State |
|---|---|---|
| `/you` | You | ◑ **The one to fix.** It renders the Sell CTA, which is live and correct. **Its own data layer queries seven tables that do not exist** — `businesses`, `user_preferences`, `supports`, `follows`, `vendor_categories`, `markets`, `market_vendors`. Consequences: the Your Market row, the follows list and the category rails are fed by dead reads, and **the "Switch to vendor mode" link is gated on a condition derived from the dead `businesses` query, so it can never render.** That gate is the only thing keeping the residue below unreachable. [platform store=privacy gap: no privacy policy or terms page exists anywhere in the app] |

### Residue

| Route | Was | Ticketed |
|---|---|---|
| `/vendors/[slug]` | The old vendor profile | **Yes** [T149] — redirect |
| `/business/[slug]` | The old business listing | **Yes** [T149] — redirect; share URLs exist in the wild |
| `/register-vendor` | The old producer signup | **Yes** [T149] — remove |
| `/following` | The old follows list | **No.** Five dead tables. **Fully orphaned — no inbound link anywhere.** The navigation's You tab still pattern-matches this path for its active state |
| `/you/vendor` | The old producer dashboard | **No.** Six dead tables. Links to `/api/vendor/followers/export`, which does not exist |
| `/you/vendor/bulletins` | Sent-announcement list, with delivered / opened / clicked | **No** |
| `/you/vendor/bulletins/new` | Announcement composer — *"Sent to all your active followers"* | **No.** POSTs to `/api/vendor/bulletins/publish`, which does not exist |
| `/you/vendor/bulletins/[id]` | One announcement's delivery detail | **No** |

### Dev

| Route | State |
|---|---|
| `/(dev)/add-entity-demo` · `/(dev)/composer-demo` | ● Correctly gated — the route-group layout calls `notFound()` unless `NODE_ENV === 'development'`. Recorded because a paren-group directory does not affect the URL, so without the gate these would render at `/add-entity-demo` and `/composer-demo` in production. |

## Route handlers — 3

| Route | State |
|---|---|
| `/auth/callback` | ● Auth redirect handler [platform link: `/auth/callback`, where a magic link or a Google sign-in returns] |
| `/api/internal/auth-signup` · `/api/internal/auth-before-user-created` | ● Supabase auth hooks |

**Referenced and absent:** `/api/vendor/bulletins/publish` and `/api/vendor/followers/export`. Neither 404s visibly, because neither calling surface can be reached.

---

## The surfaces that are coming

**None of these exists.** Listed because they are what the product is for, not because they are scheduled.

| Surface | Status | What it's for | Blocked on |
|---|---|---|---|
| **Announcement composer** | ○ | A creator tells followers and group members what they have upcoming — a sale, an appearance, a new item | Nothing structural. The shape is ruled: `page_posts`, members not followers as the audience. **A shell of this exists as residue and is not a head start** — no table, no endpoint. |
| **Feed delivery of announcements** | ✕ *cut* | The announcement arriving somewhere a member will see it | **Cut from the launch list 2026-09-20** to pay for recurrence — `ROADMAP.md` § Cut. **The feed function takes no follow input.** This is the missing half, and it is larger than the composer, which is why it was the affordable thing to drop. **Not the same as gone:** announcements from followed Pages still reach a signed-in reader on Explore under F059 criterion 2b, and **that is the only reason the cut is survivable**. [platform push: an announcement from a Page the member follows or belongs to; nothing sends email or push today] |
| **Page board** | ○ | Replies under an announcement — the coordination half of a group | Board increment one. One level of reply, not a tree. |
| **Join control** | ○ | The control that lets someone join a Group | **Nothing.** The rules are specced, the handler ships, the read paths exist. **Only the control is missing** — so today a member can re-join something they left and cannot join anything else. In scope, 0.75 day, unticketed. |
| **Response control** | ○ | A member says they are coming to an occurrence — the tap itself | Nothing structural; the noun is ruled. **No occurrence exists to respond to** — the post mechanism is upstream of it. |
| **Response list** | ○ | The organizer reads who is coming and who isn't — two lists, with names and faces | **`members.avatar_url` has no write path.** There is no avatar upload surface, so the list would render faceless. That work is upstream of this screen. |
| **Idea composer** | ○ | Put a new thing to the neighbourhood and see who wants it before it exists | Mechanic undesigned — threshold, signalling, conversion. Substrate shipped. |
| **Volunteering composer** | ○ | Offer and ask | A reply channel. **Tractable inside a group the moment the board ships; blocked across the neighbourhood.** |
| **Direct messages** | ○ | One person writing to another | Everything. No substrate at all. |
| **Item photos** | ○ | A face on a listing | Deferred — the Page is the unit that carries a face. Upload substrate already built; about half a day when it resumes. |
| **Retire a Page, retire an Item** | ○ | Taking your own thing down | **No handler for either.** Five read paths already handle a retired Page; nothing writes the state. A producer cannot withdraw their own listing. |
| **Operator takedown** | ○ | Removing someone else's content | **No operator concept in the code** — no role, no flag, no check. |
| **Full-screen map** | ○ | The map as a destination rather than a toggle | Deferred. Area rendering is separately scoped [F062]. |

---

## Commitments that live on these surfaces

Carried forward with their ratification intact. **These bind whatever the surfaces become.**

**Browse is everything.** *(Ratified 2026-09-12.)* Browse is the universal surface and carries everything the platform holds. **The default is inclusion; anything excluded needs a reason, recorded.** Stated in [`../foundation/model.md`](../foundation/model.md) § Browse is everything, which is its one home. What remains open is how a mixed result list reads and orders — never what may enter it.

**Anonymous browse — no signup wall.** *(Ratified 2026-09-04.)* Browsing works without authentication: no redirect, no wall, **no gated or truncated result set.**

> **Intent:** The landing surface has to be readable by someone who has never signed up, because the platform's first job is to show a stranger that their neighbourhood is already on it. A wall in front of an empty-looking catalog converts nobody and costs the only demonstration the product has. **The signup banner stays a banner, above the results, never in front of them.** Overturned by: evidence that anonymous browse suppresses rather than seeds signup.

**Ordering is locality and recency, with the Member's own declared interest tags as a boost — and may also carry genuine community response.** *(Amended 2026-09-12 on Don's instruction; see `DECISIONS.md`.)* **Ordering doesn't favour a member because of payment, size or follower count** (2026-09-30).

> **Removed from this entry, 2026-09-12:** the "No engagement-derived ranking" commitment that stood here. Don's ruling is that earned attention is the intended mechanism, not a loophole — *"if they're doing well in the community and the community loves them then we need to share that."* The provenance of the removed commitment is in the PR that removed it. What survives from it, and is not in dispute, is the foundation wording: ranking may use where you are and what you said you like; **it may never use what keeps you scrolling.**

**Distance is out.** *(Ratified 2026-09-03.)* **Nothing in the product measures or displays miles.** No radius filter, no mile count, no distance sort. Ordering is hood → metro → wider → online. **How "how far is it" gets answered: hand off** — the address opens in the phone's map app on mobile and is copyable on web, because the map app knows the roads. **That affordance is load-bearing; it is the only path to a distance answer.**

**Location is entered once, at creation, and resolved to a stored hierarchy.** *(Ratified 2026-09-03.)* Coordinate math runs when an address is entered. Nothing computes distance at read time.

**Online is a first-class location option, and the warning rides with it.** *(Ratified 2026-09-03.)* The composer **must warn at the point of choice that online ranks last**, and **online Items never render on the map** — no pin, no fallback coordinate. **The warning is the honesty mechanism that makes ranking-last acceptable**, not a nice-to-have.

**Metro is the feed's vantage point.** *(Ratified 2026-09-03; amended 2026-09-04 — v1 filters by metro.)* The feed is scoped to one metro at a time. **No cross-metro union feed.** The browse switcher is a metro switcher. **Metro scoping is written and unbuilt** — displaced by neighbourhood mode, which carries the launch market on its own; it returns when there is a second metro.

**A Member picks a hood *and* a metro at signup.** *(Ratified 2026-09-03.)* The metro explicitly, not derived from the hood — an unambiguous default that handles both the near-a-boundary hood and the Member who wants a different metro.

**Create is first class.** The `+` sits in the navigation between the tabs. *(A bet about nav placement serving a commitment about declaring things — not itself binding.)*

**The empty states carry the positioning.** At launch nearly every surface is empty, so they are the product on day one. *"Help shape a better future"* means an empty state that invites you to be first, **not one that apologises for being empty.**

---

## Concordance — where the old sections went

**Inbound citations were rewritten to this path on 2026-09-09; their `§` section names were not**, because the old document's sections do not map one-to-one. Anything citing `community-platform.md § X` resolves as follows.

| Old section | Now |
|---|---|
| § T1 Home · § Home | § Surface roles, and the `/` row |
| § T1 Explore · § Explore T1 | § Surface roles, and the `/explore` row. **The filter and control detail is in the tickets** [T114–T118] and in the shipped code, which is the source of truth for it |
| § You · § You T1 | The `/you` row — **and read it as a defect report, not a spec** |
| § Distance is out · § Ranking · § Location resolution · § Online is a location option · § Metro is the feed's vantage point · § The Member picks a hood and a metro at signup | § Commitments that live on these surfaces. **Full entries with their reasoning remain in [`../../planning/backlog/decision-surfaces.md`](../../planning/backlog/decision-surfaces.md)**, which is untouched |
| § Build note — this is a default, not inheritance | [`../../planning/backlog/decision-surfaces.md`](../../planning/backlog/decision-surfaces.md) § Location is entered at creation |
| § Venue page pattern | Not carried. The venue surface's layout lives in [`design-language.md`](design-language.md) and [`../systems/location.md`](../systems/location.md) |
| C1–C13 capability IDs | **Not carried.** The capability table was six-thirteenths struck through and tracked nothing the tickets did not. Retired copy: [`../archive/2026-09-09-nouns-surfaces-rewrite/community-platform.md`](../archive/2026-09-09-nouns-surfaces-rewrite/community-platform.md) |
| § T2 · § T3 tier lists | **Not carried as tiers.** What survives is in § The surfaces that are coming, with the postponed reason rather than a tier letter |

**Why the tiers went.** T1/T2/T3 said *when* without saying *whether*, and by 2026-09-07 the tier list and the launch plan disagreed in four places. **A status per surface says the same thing and cannot drift from itself.**

## Two findings this document exists to prevent recurring

**1. A full announcement UI shipped and nobody knew.** Four residue routes under `/you/vendor` include a composer, a sent list and delivery analytics — while the launch plan described announcements as unbuilt. **No document listed what was addressable, so nothing could have caught it.**

**2. Dead code and dead surfaces are the same finding.** `HomeFeed.tsx` is an orphaned pre-rebuild component that nothing imports; `EventCard` and `BulletinFeedCard` are imported only by it. **A surfaces document that listed only routes would have missed all three** — which is why the ticket to retire `/vendors/[slug]` justifies a redirect on the grounds of "four live components" that are themselves dead.
