---
purpose: Two tabs plus a create action (Home, +, You) — what each surface does, what Explore's retirement absorbs, how the merged Home ranks, and what You has to become.
layer: what
status: ratified
---

# Decision: Surface Responsibilities — Home / + / You

Two tabs and a create action. Canonical tab specs live in `product/ui/community-platform.md`; this doc names the problems in production, the fixes, and the You-tab redefinition.

**Superseded 2026-09-03:** this doc previously specified a three-tab model (Home / Explore / You) in which Home was feed-only, Explore owned search and filtering, and You was the follow-graph payoff surface. All three claims are retired. The two-tab model below replaces them.

---

## The two-tab model — RATIFIED

PM ratified 2026-09-03. The bottom nav carries **two tabs and one persistent create action**: Home, +, You.

| Slot | Job | Mental model | Primary loops |
|---|---|---|---|
| **Home** | The consumption side — everything a Member browses, searches, or filters. | "What's out there, and can I find the one thing I want?" | 1, 3, 4, 7, 8, 9 |
| **+** | Create. Always present, never nested. | "I want to put something into this." | 2, 3, 4 |
| **You** | The production/organizing side — what a Member has put into the community and how they manage it. | "What's mine, and what's happening with it?" | 2, 3, 7 |

**Home absorbs Explore entirely.** Search, the kind-filter pills (F045), and the list/map toggle all move onto Home. Home keeps its locality and interest ranking — absorbing the controls does not make Home a neutral catalog. Ambient browsing and intentional searching are the same posture over the same cards; the controls are how a Member narrows, not a second place to go.

**Explore is retired as a tab.** Home and Explore render the same cards over the same catalog; Explore only added controls on top. At current inventory density both tabs show a Member nearly the same thing, which reads as a duplicate rather than as a second mode.
Intent (Ratified 2026-09-03): A second tab has to earn its slot by showing different content, not the same content with a filter bar. Until inventory density is high enough that "browse what's near me" and "find this specific thing" return visibly different results, two tabs over one catalog costs a nav slot and teaches the Member that the app repeats itself. Reversible — if density grows, the filter controls on Home are the seed of a re-split.

**You is not the account page.** It is where a Member creates, organizes, and manages what they've put into the community. Settings live there because they have to live somewhere, not because settings are the tab's job.

---

## Create is first class — RATIFIED

A persistent **+** in the nav, sitting between the two tabs. Not a button buried on You, not a contextual affordance in the Home header.
Intent (Ratified 2026-09-03): We want people to create, and nav placement is the signal. A + in the nav says making things is a first-class act; a + you have to navigate to says creating is something you go somewhere to do. The platform's whole thesis is that Members declare things — the nav should read that way at a glance.

---

## Feed ranking — distance bands, nothing excluded — RATIFIED

PM ratified 2026-09-03. Items on the merged Home surface rank by **distance band**: nearest first, each successive band lower, online / non-physical Items last.

**This is a ranking rule, not a filter rule.** A distant Item and a place-less Item are both still present in the feed — they sit below the local ones. Nothing is excluded from the catalog for being far away or for lacking a physical place.
Intent (Ratified 2026-09-03): Proximity is the strongest relevance signal the platform has, so it should drive *order*. It should not drive *presence*. At launch density, exclusion is the more expensive error — a feed that hides rows looks like a dead platform, while a feed that runs local → distant → online teaches the Member where the edge of their locality actually is and that there is more beyond it. Ranking is also the reversible choice: bands are a sort key we can retune per market as inventory density grows, and the Member can see and scroll past the falloff. A filter that never returned the row is a decision the Member can neither see nor undo.

**What this resolves.** The open question *"do Items with no Location appear?"* — one of the three blocking the Home/Explore merge. **Answer: yes, ranked last.** `product/ui/community-platform.md` § T1 previously deferred it the other way ("Items with no Location — do not appear in the proximity index; keyword-search path at b2"). That line is retired and corrected in place; do not cite it.

### Consequence — "Online" as a first-class location option is implied, NOT ratified

Ranking place-less Items last implies a band for them, and a band implies a name a Member can see and possibly choose at declare-time. That is a *separate decision* and has not been made. Do not read it as ratified by the ranking rule above.

Why it matters more than an edge case: several Item kinds — **ask, offer, wonder, initiative** — may have no physical place *by nature*, not by omission. If that holds, place-less Items are not a tail; they are a large share of the catalog, and "ranked last" becomes a rule governing the bulk of what a Member sees rather than a footnote. That changes the question from "what do we do with a missing field" to "is Online a place a Member picks."

**A separate session is currently checking the Item location data model** — which kinds carry a Location, which cannot, and whether the absence is structural or incidental. **Fold its findings in here when they land**; they decide whether this is the tail case or the main case, and they gate the "Online" decision.

### Unresolved — hard boundary vs. graded falloff

Not resolved by this decision. The merged Home surface carries two geographic mechanisms at once:

- a **Place polygon** with a hard in/out boundary (point-in-polygon containment, per [`product/systems/places.md`](../../product/systems/places.md) § Reverse-geocoder), and
- a **distance radius measured from that polygon's centre** (the 1/5/10/25 mi filter, `ST_DWithin` against `discoverable_items`).

A hierarchy of distance bands has to reconcile with both, and it is not obvious how a hard boundary and a graded falloff coexist — whether the polygon gates the candidate set and bands only sort within it, whether bands cross the boundary freely and the polygon is merely a label, or whether centroid-radius retires in favour of pure band distance. Open.

---

## Anti-patterns per surface

**Home must not contain:** recruitment pitches, profile management, or management controls for the Member's own Items (those belong on You). Home may now contain search, filter pills, the list/map toggle, and discovery rails — the former "feed-only" prohibition is retired.

**You must not contain:** recruitment banners or campaigns (the "Sell" CTA is a quiet affordance, not a pitch), empty category directories ("Events: 0, Products: 0"), a duplicate of the Home catalog, or general locality discovery content. You shows what the Member has made and manages, not what the locality is doing.

---

## Production problems and their fixes

**Problem 1 — Recruitment pitch on Explore.** Resolved by Explore's retirement. The quiet "Sell" CTA lives on You only, visible when the Member has no active business Group.

**Problem 2 — Static rails on Home.** Category grids, "Sellers near you," and "Markets near you" were slated to move to Explore. With Explore retired they stay on Home, as discovery aids or empty state alongside the search and filter controls. Home is no longer feed-only.

**Problem 3 — You tab has no reason to exist.** The You tab currently reads as a settings page with a recruitment grid stapled to the bottom. **Fix:** rebuild it as the production/organizing surface (see below).

---

## What You has to become

As the producer surface, You needs:

- **The Member's own listings** — everything they've declared, across kinds, with state (live / draft / past).
- **Their groups** — the Groups they belong to and the ones they steward, with the management path.
- **Drafts** — unfinished declarations, resumable.
- **Responses / inbound interest** — who replied, who's coming, who asked. The payoff for having made something.
- **The create path** — the same destination the nav **+** reaches, present in context.

**Almost none of this is built.** Today's You is a settings page plus a recruitment grid. This is a rebuild, not a retention — the listings view, the drafts view, the groups management view, and the responses inbox do not exist in any form today.

**Note — follow-graph payoff moves.** The earlier plan made "Upcoming from your follows" the primary You section. Under the two-tab model that content is consumption, and it belongs to Home's ranking. Scenario F047 (`scenario-F047-member-opens-you-and-sees-whats-coming-up.md`) is written against the retired definition and needs rescoping before it advances.

---

## You and the vendor/market retirement are one project

You is the tab still reading pre-rebuild vendor data — Saved, Following, the market picker, the vendor-mode link. Retiring that data guts most of what is currently on the page. Stripping the old vendor surface out of You and rebuilding it as the producer side is **a single coherent piece of work**, not two sequential ones.

Scope inventory: `planning/backlog/audit-vendor-market-retirement.md` — see § 2.1, which already flags `src/app/you/page.tsx` as rewrite-never-delete and names `SellCta` (T073/F036) and `FollowingSummary` (T108/F042) as the two shipped features it solely hosts.
Intent (Ratified 2026-09-03): Sequencing them apart means either a stripped You that shows a Member nothing for a release, or a producer surface built on top of vendor-era reads we are about to delete. One ticket lane, one rewrite.

---

## TikTok top-slider pattern — RATIFIED

PM ratified 2026-09-02 via `weigh` (Option B with amendments). The top slider is a **category-based intent switcher within Home only**, shipping at b2.

**What it is.** A horizontal swipeable tab bar at the top of the Home viewport, segmenting the feed by activity intent: Buy (products/services), Do (events/gatherings), Learn (classes/workshops), with additional categories as the Item taxonomy earns them.
Intent (Ratified 2026-09-02): Category-based ("things to buy, to do, to learn") rather than feed-mode toggle ("For You / Following") because the platform's value is *what's available locally*, not algorithmic personalization. Intent-first navigation matches the Member's opening question ("what can I do this weekend"). A For You / Following toggle implies algorithm density and follow-graph density that won't exist at b2.

**Why Home only.** You's sections are heterogeneous — a slider implies parallel views of the same content type.

**Slider vs. the absorbed Explore controls.** Home now carries both the slider and the kind-filter pills, search, and the list/map toggle. The slider segments intent; the pills filter kind within that segment. Their coexistence is unresolved at the layout level — see open questions.

**Why not a bottom-nav replacement.** The bottom nav is the structural backbone and stays. TikTok itself keeps a bottom nav *and* top tabs — the top slider is a view-mode toggle within a tab, not a replacement. The bottom nav is furniture for the less-digitally-native audience this platform serves.

**Nav proportions (b1).** The bottom nav shrinks from 52px to 44px (compact, TikTok-proportioned, icon-dominant). Full spec in design-research-thesis.md §2.

---

## Open questions

Raised by the two-tab decision, not answered by it.

1. **Visual balance of the third slot.** The nav previously held three peer tabs. With two tabs and a centered **+**, what carries the third slot's weight — is the + visually dominant (raised, filled, larger), a peer of the two tabs, or does the nav re-center around two wide targets? Affects the 44px proportion decision above.
2. **What the + opens.** A bottom sheet (kind picker, stays in context, cheap to dismiss) or a full page (room for the composer, but a harder exit). The choice sets the cost of abandoning a half-made declaration.
3. **Signed-out You.** You's purpose changed from "your follows and settings" to "what you've made." A signed-out visitor has made nothing. What does the tab show — a sign-in wall, a pitch for creating, or does the nav render differently when signed out?
4. **Is "Online" a first-class location option?** Implied by the distance-band ranking rule but not ratified — see § Feed ranking → Consequence. Needs its own decision, gated on the Item location data-model findings.
5. **How do the Place polygon's hard boundary and the distance radius's graded falloff coexist?** Raised by the distance-band ranking rule and not answered by it — see § Feed ranking → Unresolved.

**Resolved.** *Do Items with no Location appear?* — yes, ranked last (2026-09-03). See § Feed ranking.
