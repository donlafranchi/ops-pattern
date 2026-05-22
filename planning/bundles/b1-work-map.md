# b1 Work Map

**Status:** Drafted 2026-05-18 — pending PM review. Companion to [`bundle-themes.md`](bundle-themes.md) (the sub-bundle sequencer) and [`b1-primitives.md`](b1-primitives.md) (the bundle's scope definition).

**What this is.** A map of the work that makes up bundle 1, broken down to the **menu grain** — one level above the F### scenario and two levels above the T### ticket. Each 🟢 / 🟡 / ⚪ line is roughly one *intent unit* that the planner converts to a scenario (F###), which the ticket-writer then fans into 2–5 implementation tickets (T###). Use this to decide what's actually in your MVP. Full ticket specs (APIs, events, abuse vectors, acceptance criteria) get written by the `pipeline-ticket` skill once a scenario is approved; this doc is the menu the planner picks from.

**How to read it.** Each sub-bundle has:
- **What the user sees** — a plain-English description of what becomes possible
- **The work** — a flat list of intent units, each one line
- **MVP cut** — my suggested first-pass scope. Cut more if you want a faster ship; add less aggressively (these are already the trimmed list)

**Tags:**
- 🟢 **Core** — can't ship the sub-bundle without it
- 🟡 **Recommended** — the sub-bundle works without it but is meaningfully better with it
- ⚪ **Defer** — could ship later, in this bundle or a future one

---

## b1.x — URL pattern decision *(cross-cutting, lands with b1.0)*

Not a sub-bundle of its own. One decision that locks in URLs across everything that follows.

- 🟢 Decide and document the URL pattern: `/m/[handle]`, `/l/[slug]`, `/g/[location-slug]/[group-slug]` for locality-bound Groups, `/g/[group-slug]` for non-locality Groups, kind-specific item paths
- 🟢 Implement the slug-uniqueness rules so business Groups in different cities can share names

**MVP cut:** both. This is one decision and one constraint; it costs almost nothing to get right at the start and is expensive to fix later.

---

## b1.0 — Show up & be seen

**What the user sees.** They sign up, fill out a profile, set where they live, and can see other people and things in their area without logging in.

**The work:**
- 🟢 Auth flow (sign up + log in) — needs your decision on magic link / social / email-password
- 🟢 Profile editor (name, photo, bio, locality)
- 🟢 Public profile page at `/m/[handle]`
- 🟢 Set your home location (geolocate OR pick a city from a list)
- 🟢 Privacy controls panel — the b1 toggles for what's visible
- 🟢 City-scope browse (people and things visible to anyone, no login required)
- 🟡 Account deletion and full-history export
- ⚪ Profile completeness nudges ("add a photo to finish setting up")

**MVP cut:** the six 🟢 items. Skip the deletion/export at first launch only if you ship it within four weeks after; the people-first commitment requires it eventually. Skip the nudges entirely until you have data on what gets people stuck.

**Open decision:** auth method. Magic link is simplest and most respectful of password fatigue; social login (Google, Apple) is fastest for the user but introduces a dependency. Email+password is conventional and works without external dependencies.

---

## b1.1 — Groups people can join *(community-style)*

**What the user sees.** They can create a Group ("Curtis Park parents," "Sacramento sourdough club"), see it has a page, invite others, and join other Groups they find. Lightweight — not businesses, just people gathering around something.

**The work:**
- 🟢 Group creation form — pick a kind (place / interest / practice / event-anchored), name, one-line purpose, optional location anchor
- 🟢 Group public page (name, purpose, member count, "join" button)
- 🟢 Join and leave actions
- 🟢 Show a person's Group memberships on their profile (respecting their privacy toggle)
- 🟢 Group browse index `/g/`
- 🟡 The "steward" role — one or more members per Group can be marked as stewards
- ⚪ Family-kind Groups (private discoverability is more involved)

**MVP cut:** the five 🟢 items + the steward role. Drop family-kind until someone asks for it — the four other kinds cover everything `canonical-examples.md` slot #7 (Bumble BFF Refugees) needs.

**Why steward matters even at b1:** it's the seed of community-level governance without payments or legal entities. Per the stewardships theme later, the role needs to exist before stewardships can be declared.

---

## b1.2 — Business Groups & makers

**What the user sees.** A maker / sole proprietor / small business owner can declare themselves on the platform, claim their ZIP for the "locally owned" badge, and have a business page — even before they post a single product.

**The work:**
- 🟢 Create-a-business-Group flow — extends b1.1 with: founder identity, owner role, anchor location, ZIP for Tier 0 self-attestation
- 🟢 The "Claimed local owner" badge (Tier 0) on the business page
- 🟢 "Become a Maker" CTA on the regular profile
- 🟢 Maker mode toggle in profile settings (lets the user pause maker surfaces without leaving the Group)
- 🟢 Business Group public page
- 🟡 Founder = operating owner enforcement (the founder is immutably the operating owner per the existing groups spec)
- ⚪ Multi-owner / partnership business Groups (sole props cover the canonical examples)

**MVP cut:** the five 🟢 items. Partnership Groups can wait — Ferrari Fisheries, the dip vendor, the food truck are all sole props. Founder-as-operating-owner is structurally important but can be enforced in code without a separate ticket.

---

## b1.3 — Gather *(events, RSVP)*

**What the user sees.** Anyone can post an event ("Drake's Run Club, Thursdays 7pm"). It shows up on the locality page, on the Group page (if attached), and on the Location page. Other people RSVP.

**The work:**
- 🟢 Gathering composer (post an event — title, description, location, schedule)
- 🟢 Recurring-schedule support (weekly / monthly / custom)
- 🟢 Attach gathering to a Location (existing or new)
- 🟢 RSVP button + RSVP count
- 🟢 Gathering detail page at `/e/[slug]`
- 🟢 Show gatherings on home feed, Group pages, Location pages
- 🟡 Hashtag autocomplete in the composer (lives here; reused by all later composers)
- ⚪ Post-event check-in / attendance ping (deferred to b3+ per the existing item spec)

**MVP cut:** the six 🟢 items. Add hashtag autocomplete if you want it from day one (it's not free but the cost compounds across all later composers). Drop check-in entirely until you need it.

**Why this theme is the headline metric:** real-world meetings are the platform's reason for being. The first time someone shows up to an event they found on the platform is the moment that proves the whole thesis. Per `principles.md` Part 6 — "measure interactions that produce real-world meetings."

---

## b1.4 — Find & follow

**What the user sees.** Makers can post products and services. Anyone can follow a maker, save a product, follow a place. The "near me" browse shows everything in one feed.

**The work:**
- 🟢 Product composer (post a product — title, description, price-or-not, location attachment)
- 🟢 Service composer (post a service — title, description, service-area attachment)
- 🟢 Follow button on Member profiles
- 🟢 Save button on Items
- 🟢 Follow a Location (e.g. the park where outdoor concerts happen)
- 🟢 The "discover" page — locality-first browse across people, things, and places
- 🟡 QR card generator (Member can request a printable QR code for any Item they own)
- ⚪ Service-area polygon editor (vs. radius-from-point) — radius works for most cases at b1

**MVP cut:** the six 🟢 items. Add QR if the farmers-market wedge is going live within weeks — it's the load-bearing onboarding affordance for in-person signup at booths. Skip the polygon editor until a plumber asks for it.

---

## b1.5 — Wonder *(float an idea)*

**What the user sees.** Someone floats a low-commitment idea ("Would folks be into a Sunday coffee walk?"). Other people respond "I'd be in." The originator sees how many are interested before committing to host.

**The work:**
- 🟢 Wonder composer (post an idea — title, description, optional location, optional rough timeframe)
- 🟢 "I'd be in" response button
- 🟢 Wonder feed (locality-scoped)
- 🟡 Wonder → Gathering conversion (when interest accumulates, the Wonder becomes an actual event — the conversion event is recorded; the conversion surface lands at b2)
- ⚪ Per-Group Wonder scoping (depends on Group feeds, which are b2)

**MVP cut:** the three 🟢 items. The conversion substrate (event-only, no UI) is cheap — add it. Group scoping waits.

**Smallest sub-bundle by far** — could ship in a week. Worth considering whether to move it earlier in the sequence (alongside or before b1.3 Gather) so newcomers have a near-zero-friction first action.

---

## b1.6 — Stewardships *(the smallest ownership step)*

**What the user sees.** A Group can declare that it looks after a shared thing — a Little Free Library, a tool library, a community fridge, a seed library, a repair café, a Little Free Pantry, or a mutual aid pod. The platform points them at the proven external playbooks. Other people in the city can find stewardships near them.

**The work:**
- 🟢 Stewardship declaration form on a Group (template kind picker, description, link to upkeep gathering)
- 🟢 Template-content pages for each of the seven types (platform-authored intro copy + canonical external sources)
- 🟢 Template-kind filter on the Group browse index
- 🟢 "Stewardships here" section on Location pages
- 🟡 Archive flow with reason ("evolved into incorporated nonprofit," "stewards moved on," etc.)
- ⚪ Stewardship → business Group transition recorder (substrate-only; the actual transition is the founder creating a new business Group manually)

**MVP cut:** the four 🟢 items, with three to five of the seven templates rather than all seven at first launch. Repair café and tool library are the load-bearing two; Little Free Library and seed library are the smallest-footprint two. Pick three, ship the rest one at a time. Archive flow is needed within the first six months but doesn't gate launch.

**Why this is part of MVP rather than b2:** stewardships fill canonical example slot #11 (Steward what we built — Loop 12), which has been reserved with a specific framing waiting for a real instance. Without this theme, b1 doesn't have a credible answer to "how do people start owning things together." With it, b1 has the *first step* of that answer — and the headline thesis metric (stewardship → business Group transition rate) starts collecting data from day one.

---

## What's not in b1 at all

Listed here so the boundary is visible. None of these need work in b1; they're parked for later bundles:

- **Direct messages** — the toggle exists in privacy controls (b1.0) but the DM surface is b2
- **Producer Bulletin** (substack-light broadcast to followers) — b2.0
- **Offer / Ask** (mutual aid verbs) — b2.1
- **Initiatives** (coordinate forming something real) — b2.2 coordination-only; b3 with pledges
- **Locality verification Tier 1+** (SOS lookup beyond self-attested ZIP) — b2.3
- **Producer growth dashboard** (followers, profile health, peer benchmarks) — b2.4
- **Follow streams + notifications** — b2.5
- **Group feeds and discussion** — b2.6 with anti-Nextdoor guardrails
- **Confirmation flows** for staff claims in business Groups — b2
- **Payments, fees, money flow of any kind** — past b3
- **Cooperative governance tooling** (voting, treasury, distributions) — past b3; arguably never
- **Ratings of any kind** — never

---

## Rough size estimate

Counting the 🟢 work items only (the minimum MVP cut). Each 🟢 item is one intent unit (one F### scenario) that the ticket-writer fans into 2–5 T### implementation tickets.

- b1.x: 2 intent units
- b1.0: 6 intent units
- b1.1: 5 intent units + steward role (1)
- b1.2: 5 intent units
- b1.3: 6 intent units
- b1.4: 6 intent units
- b1.5: 3 intent units
- b1.6: 4 intent units + 3–5 template pages (each is ~½ unit of mostly content work)

**Total: ~38–40 intent units for the MVP cut.** At the planner's typical fan-out (2–5 tickets per scenario), expect roughly 80–160 T### tickets across b1. At a real pace of ~3–5 tickets per week for a solo engineer, that's roughly 8–12 weeks of build time, which matches the 6–10 week window allowing some buffer for scenario writing, review gates, and the inevitable surprises.

If you want a faster first ship, the cuttable items inside this MVP cut are:
- Account deletion + export (b1.0) — must come within 4 weeks of launch, but doesn't gate day-1
- Steward role (b1.1) — only matters if b1.6 ships in the same release; if b1.6 defers, steward defers with it
- Service composer (b1.4) — products alone cover Ferrari Fisheries, the dip vendor, the food truck; services serve canonical example slot #10 which is still a TODO
- 3–4 of the 7 stewardship templates (b1.6) — start with 3, add the others one at a time

That would bring you to roughly **28–32 intent units** for an even tighter first cut. That's a 6–8 week build window.

---

## How this connects to the pipeline

Each line above is one *intent unit* that flows through the pipeline:

1. PM picks which 🟢 / 🟡 items make the next sub-bundle's MVP cut (this doc is the menu)
2. `pipeline-product` ensures a system spec or feature note covers it
3. `pipeline-plan` writes a scenario (F###) with acceptance criteria, tagged to the active sub-bundle (`b1.N`)
4. `pipeline-review` checks the scenario against principles and ADRs (mandatory during the rebuild)
5. `pipeline-eval` writes Playwright tests from the scenario
6. `pipeline-ticket` breaks the scenario into 2–5 implementable tickets (T###)
7. `pipeline-build` implements each ticket via TDD
8. `pipeline-eval` verifies the scenario passes
9. At sub-bundle close (or after material drift), `pipeline-bundle-resync` re-tags / re-sequences this map against shipped reality

So one line in this doc — say, "Product composer" — becomes one scenario (F###) that the ticket-writer splits into 3–4 tickets (UI form, validation, save action, render-on-feed). The total ticket count when the pipeline finishes will be higher than the 38–40 above; what's listed here is the *intent grain*, not the final implementation grain.

Use this doc to scope. Use the pipeline to execute. Don't write the technical specs here — they belong in the system specs (`product/systems/*.md`) and the scenarios (`planning/scenarios/F###.md`), where the pipeline can find them.

---

## Vocabulary collision avoided

The intent grain here is **not** a T### ticket. The pipeline reserves `T###` for files in `development/tickets/`. The 🟢 / 🟡 / ⚪ items on this map are one level above that — closer to F### scenarios in size, but pre-acceptance-criteria. Renaming this doc from `b1-ticket-map.md` to `b1-work-map.md` on 2026-05-18 was the explicit fix.

---

**Buy close. Build community. Build the future together.**
