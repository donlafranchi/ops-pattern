---
purpose: The launch plan — repositions v1 as local discovery, names the three launch requirements, cuts everything else, and sequences eight weeks against a 2026-10-30 date.
layer: how
status: active
---

# Initiative — Launch

> **Supersedes the end-of-September date and the remaining scope in [`bundle-1.md`](bundle-1.md)** (PM instruction, 2026-09-07). The shipped floor recorded in [`bundle-1-checklist.md`](bundle-1-checklist.md) stands. What changes: the deadline moves to **2026-10-30**, the product is repositioned from a marketplace to a local discovery app, and the ten-workstream list is cut to three requirements.
>
> Child items file as `initiative-launch-{slug}.md` in [`../backlog/`](../backlog/). Launch-tier calls are logged in [`../DECISIONS.md`](../DECISIONS.md).

**Deadline: Friday 2026-10-30.** ~38 working days, solo.

---

## Positioning — local discovery, not commerce

**SocialUs is where you find out what is happening around you and who is doing it. Buy, sell, trade, and gather.** Gathering is not a fourth verb appended to three commerce verbs — it is the one with the lowest activation energy and the widest audience, and it is the reason a person who is not selling anything has a reason to open the app.

**The consequence for the build: gathering is first-class in the information architecture, the navigation, the create path, the empty states, and the copy.** Every place the product currently treats a gathering as something a shop does is a defect against this positioning, not a missing feature.

### Where the build reads as marketplace-only — verified, not assumed

| Signal | Evidence |
|---|---|
| **A gathering cannot exist without a shop** | The only route to the gathering composer is `/you/sell`. `AddGatheringButton` is rendered in exactly one file, in a per-business-Group composer row keyed on an active `kind='business'` membership. To host a run club, a person must first walk through Sell and open a shop. |
| The create affordance points at Sell | The ratified two-tab nav's `+` routes to `/you/sell`. |
| The producer door is a seller door | The one CTA on `/you` is labelled **Sell**; the walkthrough's own final button reads *"Create my shop"*; its steps are Brand name / Anchor Location / About / Locally owned. |
| The recruitment surface recruits sellers | `RecruitmentGrid`'s ten categories are hardcoded to Sacramento **and to selling** — no gathering lane, no service lane. |
| The public front door says "For vendors" | `/join` opens with `For vendors` and closes with *"Share with another vendor."* It is vendor recruitment, not an explanation of the product. |
| The build target says so | `BUILD-LOG.md` § Current reads **"Target: b1 MVP — Producer Marketplace."** |
| Nothing browses people or gatherings as such | Browse is an Item index. The map plots Items. There is no producer index, no organizer index, no "what's on this week." |
| Empty states offer a filter, never an invitation | Browse-empty says *"Nothing here yet — try another filter."* Feed-empty widens the locality. Neither ever says *host something.* |

**The schema is not the problem.** `items.group_id` is nullable, `item_gatherings` exists, and the member-filed gathering route `/m/[handle]/e/[slug]` is already built. The missing piece is a create path, not a data model.

---

## Launch scope — the three requirements

Anything not serving one of these is out.

1. **A producer or organizer signs up with minimal fumbling.**
2. **They get a profile** — social links, short about, what they sell or host, and how to find them (location, hours, where they'll be next).
3. **People can find them** — browse, search, and a map.

**Success is one sentence:** a stranger can open the app cold, see who and what is near them, tap through to a real person, and know where to find them this week.

---

## Current state — verified vs assumed

### Verified (read in the code, or queried against the production database on 2026-09-07)

**Works and is merged**

- Signup and onboarding — email/magic-link, one question (*"What should we call you?"*), locality defaulted server-side, lands in the feed.
- The five-step shop walkthrough, and the product, service and gathering composers behind it.
- Public pages for product, service, gathering, shop, venue and member; item links resolve (11 of 11 verified on production).
- Browse at `/explore` — search, seven kind pills, filter sheet with removable chips, inline list/map toggle, Mapbox map with real pins.
- The locality feed at `/`, anonymous-browsable with a signup banner.
- Follow across member / group / venue, with one unified following page.
- The "Claimed local owner" badge, end to end.
- Full substrate: members, groups (six kinds), items (seven kinds), locations, places, metro polygons, the action layer, the event log, partitioning, RLS.

**Broken in production right now**

- **`/you` — the only door to becoming a producer — queries seven tables that do not exist.** `businesses`, `user_preferences`, `supports`, `follows`, `vendor_categories`, `markets`, `market_vendors`. Confirmed absent from the live database, and absent from the migration lineage. This is requirement 1, and it is currently dead.
- `/register-vendor`, `/vendors/[slug]` and `/you/vendor/*` still build and ship against the same absent tables.
- `/following` is a live vendor-era duplicate of `/you/following`.
- One unit test is red on main (`EmailFirstSignup.test.tsx` — argument-count drift, not a product bug).

**Half-built**

- **Photos.** `items.photo_url` exists and the card renders a media block — and no photo can exist anywhere. Zero file inputs, zero storage buckets, zero storage calls in the app.
- **Profile.** `members.bio`, `members.avatar_url` and `group_businesses.public_description` all exist with **no editor anywhere**. There are 19 action handlers and every one is create-shaped — no `member.update_profile`, no `group.update_business`, no `item.update`, no `item.delete`. Everything set during signup or the walkthrough is permanent.
- **Categories.** `items.category` exists; the seed writes it; no composer collects it; browse ships a category filter over that empty dimension.
- **Content.** 16 items, 11 members, 3 groups, 4 locations, 22 places. The product is a working shell with almost nothing in it.
- **Link previews.** No page carries an OpenGraph block. Every link a member texts renders as a bare grey row — on a platform whose stated distribution channel is one person sending another a link.

**Specced, reviewed, ticketed, not built**

- The self-serve producer journey — photo upload, shop editing, the You producer state, the report path (F055–F058, T120–T126). Five of seven tickets are stopped at Gate B.
- The Explore-into-Home merge and the two-tab nav (F059, T127–T131). Unblocked and buildable.

**Specced, not scoped**

- Onboarding and storyboards — a journey list and one worked example; nothing ratified. Honest count in that doc: *six journeys b1 has, four it does not*, and the host journey is one of the four.

### Assumed (stated in the record, not independently re-verified here)

- Evals green on the shipped surfaces (last re-confirmed 2026-06-21).
- Production matches `main` — the record notes two commits that were unpushed by instruction on 2026-09-03.
- Supabase Pro egress headroom for photos (~200 MB storage / ~48 GB egress at 1,000 items and 10,000 feed loads; the pricing figures carry a "confirm" flag).
- The vendor retirement inventory (62 files, 51 deletable) — counted once, not re-counted.

---

## Gaps against the three requirements

### 1. Signs up with minimal fumbling

- **The producer door is dead** — `/you` fails against seven absent tables. Fixed by *You gains a producer state* [T125], which is unblocked today.
- **There is no organizer door at all.** No path to host a gathering that does not first open a shop. **Not scoped, not ticketed — the single largest gap against the new positioning.**
- Onboarding asks one question and explains nothing; a member finishes it without ever being told what the platform is for.
- `/join`, the one page that could explain the product, recruits vendors instead.

### 2. Profile

- No profile editor exists, for a member or for a shop. Scoped for the shop [T126]; **not scoped for the member**.
- **No social links column anywhere.** Not in `members`, not in `group_businesses`. Not scoped.
- No tagline — the one line every card, search result and link preview needs. Scoped [T126].
- No shop image, and no image upload for anything. Scoped [T120, T121, T126], all Gate-B blocked.
- **"Where they'll be next" — decided 2026-09-07: one free-text line, ≤140 characters, on the shop editor.** Rides the migration already adding the shop tagline and image. Structured recurring scheduling deferred; `location_recurring_temporary` stays unsurfaced. See [`../DECISIONS.md`](../DECISIONS.md).

### 3. Findability

- **Browse indexes Items, not people.** There is no way to browse or search producers, organizers or shops, and the map plots Items only. A consumer cannot answer *who is here*. **Not scoped — the largest gap against requirement 3.**
- No "what's on" view. Gatherings are one filter pill inside a mixed item grid.
- The category facet filters a dimension no producer can populate.
- Nothing is findable off-platform: no OpenGraph block on any route.
- 16 items is below the density at which browse, search or a map reads as a product rather than a demo.

---

## The cut list — what leaves

Named, with what each costs.

| Leaves | Why | What it costs |
|---|---|---|
| **The Explore-into-Home merge** [F059, T129–T131] | Largest single engineering item, five tickets, two migrations, and it reverses three tickets merged inside 48 hours. Serves none of the three requirements. | Three tabs stay. The `+` create affordance is kept and added to the existing nav as a small standalone piece — it is the IA vehicle for gathering being first-class, and it does not need the merge. |
| **The metro vantage point** [T128] | A second feed function against a different table, to filter a 16-item corpus in one seeded metro. | The existing place scope picker stays. Revisit when there is a second metro. |
| **The producer values declaration** — **CUT, confirmed 2026-09-07** | Serves none of the three requirements. Needs `weigh` on a permanent constraint, a new column, and a new handler, and as free text it is unfilterable so it does no discovery work at launch. | The v1 differentiator narrative goes quiet until after launch. **The never-sourced constraint survives the cut** — no schema added in the meantime may carry a source, provenance or import column. |
| **The category taxonomy** | Half a day to collect a category, against a browse surface that already filters by kind and searches by text. | **Drop the category facet from browse at launch.** Do not ship a filter over an empty dimension — that is the one option to avoid. |
| **The vendor deletion sweep** — phases 3–5, 51 files | No user-perceivable behaviour, and the retired code is reference material for three live tickets. | Dead code ships to production. Acceptable: it hangs off `/you` alone once T125 lands. Two carve-outs run now — the `/following` redirect, and the OpenGraph block lifted before anything is deleted. |
| **Support and oppose controls** | Already deferred. Stays deferred. | — |
| **The four unbuildable kinds; hoods and the location hierarchy; social import; the category top slider; preview deploys; bulletins; the growth dashboard** | Already deferred. Stay deferred. | — |
| **The item gallery, cropping, reordering; handle validation; oEmbed; a completeness score** | Gold plating on features that do not exist yet. | One image per item. Five booleans, not a score. URL-shape check only. |

**Protected — do not cut:**

- The report **write path** and the takedown handler. Policy parked 2026-09-07 — table, handler and form ship; no SLA, no queue, no moderation flow. The takedown handler still ships, because *never serve an image you cannot take down* is a constraint on the platform, not a promise to the reporter. **Copy must not imply a response.**
- Photo upload. It is the difference between a discovery app and a spreadsheet, and it is what makes a shared link look like a real place.
- The host-a-gathering door. Cutting it means launching the marketplace this plan exists to stop launching.
- Onboarding and copy. Highest value, least defined, and the thing that decides whether a stranger stays.

---

## The eight weeks

Four fortnights. Each ends with something a stranger could use.

### Fortnight 1 — Sep 7–18 · Unblock, and fix the dead door

**Ships: a producer can sign up, land on a page that works, and be recruited as a host or a seller.**

- **Day one, before any code:** run `weigh` on the two upload absolutes — metadata stripping, and takedown-before-upload. Two hours; they block nine days of work. **Cleared to proceed** — the report-policy park (2026-09-07) removed the operating decision that sat in front of them.
- Fix the dead `/you` — pre-producer and producer states, scoped as *someone who isn't selling yet finds the way in* [F057 / T125]. **Rewrite the recruitment categories with a gathering lane and a service lane as part of this ticket, not after it.**
- **Fork `/you/sell` into `/you/create`** — one producer entry point branching to sell or host, with hosting free of any shop requirement. New scenario; see § The two build tracks.
- Ship the report path as a write path only — table, handler, form. **No SLA, no queue, no moderation flow** [T123].
- Ship the image storage substrate and upload primitive [T120].
- Retitle the build target away from "Producer Marketplace"; add the `/following` redirect; lift the OpenGraph block out of the vendor code before anything is deleted; fix the red unit test.

### Fortnight 2 — Sep 21–Oct 2 · Photos, and the door that isn't Sell

**Ships: anyone can host a gathering without opening a shop, and what they post has a picture.**

- Photo on the product composer, plus the OpenGraph block on the three public item routes [T121] — released together with operator takedown [T122]; neither deploys without the other.
- Photo on the service and gathering composers [T124].
- **New — the host door.** A create affordance offering *Host a gathering · Sell something · Offer a service*, and a gathering composer that files under the member when there is no shop. Needs a scenario, a review and an accessibility pass.
- **New — the create button** in the existing three-tab nav.

### Fortnight 3 — Oct 5–16 · Who you are, and who's here

**Ships: a producer can describe themselves, and a stranger can browse people rather than listings.**

- Edit shop — image, tagline, about, **social links, hours, and where they'll be next** [T126, extended; values statement cut].
- **New — the member profile editor.** Name, bio, avatar, links. No update handler exists today; this is the ticket that adds one.
- **New — the people index.** Browse and search producers and organizers, and put them on the map alongside items. Hard boundary in the next section.

### Fortnight 4 — Oct 19–30 · Teach it, fill it, harden it

**Ships: the thing a stranger opens on launch day.**

- Onboarding, empty states and copy — four storyboards (curious stranger, newcomer signup, share recipient, responder). `/join` becomes what the product is, not a vendor pitch. Every empty state offers *host something* as well as *clear filters*.
- **The copy pass is now governed, not freehand.** [`role-language.md`](../../product/foundation/role-language.md) § Violations in the current surface is its checklist, and its § The copy section carries the actual strings. Three classes to clear: class nouns rendered on people (*vendor*, *business owner*, *vendor mode*), umbrella nouns in the spec layer (*consumer* — including in this file), and empty states that describe absence instead of inviting. Two things to decide rather than fix, because they aren't written yet: the gathering response reads **"Count me in,"** and no response counter goes on a person's own work.
- Seed content — **synthetic, display-only** (decided 2026-09-07). No owner, no target number, no pre-launch recruitment. Must be distinguishable to the operator, and **must not be reported as traction**.
- Launch hardening — accessibility pass on every new surface, deploy checklist, code review on each ticket before commit.
- **Three days of buffer, unallocated on purpose.**

---

## The five checks against this plan

- **Scope creep — the people index is the one that can grow without a floor.** "Browse who's here" invites a full profile system. **The boundary, set now: name, one photo, tagline, what they make or host, where to find them, a link to their page. Nothing else — no follower counts, no activity, no sort, no facets.** If it wants a seventh field, it is out of scope.
- **Gold plating — the profile editor and the map both invite it.** Cropping, galleries, reordering, oEmbed previews, handle validation, marker clustering, heat layers. One image, plain text fields, a URL-shape check, and the marker component that already ships.
- **Missing requirements — closed on the two that were open.** "Where they'll be next" is one free-text line; the create button's destination is `/you/create`, decided rather than answered by whoever shipped first. **The one that remains: the report path now ships a form that promises nothing, and copy is the whole of the risk** — one "we'll look into it" turns a parked policy into an unkept promise.
- **Unrealistic schedule — this fits, and now with more room than it had.** Roughly 38 working days against 28–34 days of listed work plus mandatory gates. Parking the report policy and cutting the values declaration took two decisions off the critical path and roughly a day and a half of work off the list. It still fits on one condition: **the merge and the values declaration stay cut rather than creeping back in October.** If either returns, say so on the day it happens, not on 30 October. Seed content is no longer a risk item — synthetic display data has no acquisition path to fail.
- **Communication — low, solo, with one live instance.** The repo currently carries two launch dates: end of September in the ratified bundle, and 30 October here. Until the bundle carries the pointer, any skill that reads it plans against the wrong date. Fixed by the banner on `bundle-1.md` landing with this file.

---

## The two build tracks

Both run as pipeline work — scenario, review, tickets, TDD. **B first: nothing else matters until the producer door opens.**

### B — the dead producer page

**Already scoped.** This is *someone who isn't selling yet finds the way in* [F057], reviewed PROCEED on 2026-09-04 and ticketed as *You gains a producer state* [T125]. It is the one significant ticket blocked on nothing. What it was missing is the table-by-table disposition, now added to the scenario as § Table disposition. **Before build it must move from `backlog/` to `next/`** — the build agent cannot read `backlog/`, and that firewall is load-bearing.

**Disposition summary: create nothing, repurpose one, remove six.** Detail lives in the scenario.

### A — one producer entry point

**Scoped 2026-09-07** as *someone starts something without opening a shop* [F060], in `backlog/`. **Review required before it advances** — rebuild rule 1, and no review file exists yet.

`/you/sell` forks into `/you/create`, which asks *"What are you starting?"* — something I make or sell · something I host · both — and then asks for its name, which the interface uses from that point on. **Hosting requires no business Group and no shop.** The entity's UI noun is **Page**, and it appears only in help text where no name is available.

**It is a conformance fix, not a design change** — `groups.md` already says a Member without a business Group sees the universal composer. Group kind turned out to be a label almost everywhere: no row-level security policy, neither feed function, no browse filter, no follow path and no URL derivation reads it. **Four branches are real and one is the wall** — item creation requires the filing Group to be a business, which is why a gathering cannot be filed under a run club. No migration to the kind enum; the neutral values are already there. The tagline, image and where-next columns move from the business child table to the Group spine so a run club can have a picture too — free now, rework once the shop-editor migration lands.

---

## Open questions — PM only

**Answered 2026-09-07** — logged in [`../DECISIONS.md`](../DECISIONS.md): report policy parked; seed content synthetic and display-only; values declaration cut; "where they'll be next" is one free-text line.

**Still open:**

1. **One metro at launch, or open to anywhere?** Decides whether the metro vantage point stays cut.
2. **Confirm the Explore-into-Home merge leaves.** Recommendation: yes — it buys roughly a week and preserves three tickets merged in September. It is one of the two cuts the schedule now depends on.
3. **Category — drop the browse facet, or buy the half-day?** Recommendation: drop the facet. Shipping neither is the only wrong answer.
4. **Is the date 30 October, or the first week of November?** Three days of buffer exist at 30 October and nothing beyond it.

---

## Non-negotiables — unchanged

Every ticket still upholds these; nothing in this plan relaxes them.

- Action layer is the only write surface; same-transaction row+event invariant; soft delete on every entity.
- No Business entity — personal businesses are `kind='business'` Groups.
- Groups are emergent, optional, never auto-assigned.
- A values statement is self-declared only — never sourced, never inferred. Deferring the feature does not weaken the constraint.
- No image is served that cannot be taken down.
