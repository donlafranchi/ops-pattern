---
id: how-plan-location-model-sequence
purpose: Sequence, bundle recommendation, and blocked-decision list for the location-model scenarios (F048–F053) ratified 2026-09-03.
layer: how
status: draft
---

# Location model — sequence, bundle, and what's blocked

Companion to `scenario-F048` … `scenario-F053` and `review-F048-F053-location-model.md`. Source decisions: [`decision-surfaces.md`](decision-surfaces.md).

---

## Two of your open questions are already answered in the record

You listed four questions you deliberately didn't answer. **Two of them the record answers**, in the same doc, under § Open questions → Resolved. Flagging so you're not deciding something twice, and so you can tell me if the record is ahead of you:

- **Is location a required field?** — *"yes, and the friction objection is answered by pre-filling it: the Member saves a set of hoods once, it pre-fills every creation, and they override per Item (2026-09-03)."* F051 is written on that answer.
- **When are members asked for their hood?** — *"both picked at signup, the metro explicitly rather than derived (2026-09-03). Supersedes the earlier first-creation lean."* F049 is written on that answer.

The other two are genuinely open and are below.

---

## The decomposition that makes this sequenceable

The seven decisions are not one dependency chain. They split three ways, and the split is what lets most of the work proceed while the blocked parts wait:

| Track | What's in it | Depends on the merge? |
|---|---|---|
| **Precondition** | F048 — distance removal + the address hand-off | **The merge depends on it** |
| **Write path** | F049 signup → F050 saved hoods → S-location-hierarchy → F051 composer entry | **No.** Nothing here touches the feed query. |
| **Read path** | F052 ranking, F053 metro switcher | **Yes.** Both rewrite the query and the switcher the merge owns. |

The write path and the merge can run in parallel. That is the main scheduling win available here.

---

## Substrate group S-location-hierarchy — geocode-once

**Not a scenario, deliberately.** Rebuild-phase rule 14 legalizes a substrate lane for work with no user-facing surface: `Scenario: substrate`, bound to a spec section instead of a Given/When/Then. Geocode-once is exactly that. Writing a persona around it would be inventing a story to justify a migration, which is the "surface beats schema" rule running backwards.

**Binds to:** `community-platform.md` § Location resolution — geocode once, store a hierarchy; `decision-surfaces.md` § Location resolution.

**What it has to do:**
1. Store resolved place levels **on the Item** — hood, city, county, metro, state — written once at creation.
2. Make those stored levels the only query path for proximity. Nothing computes at read time.
3. Retire `discoverable_items.nearest_location_id`, which today resolves to the **oldest** attached venue via `order by il.created_at asc limit 1` with no distance math anywhere in the derivation (migration `034`; migration `033` already annotates it as "first-location-only" and routes around it). The stored hierarchy removes the premise rather than fixing the query.
4. Decide where hood→metro resolution happens — **open question 8**, a build call: does the Item-side and hood-side path call `resolve_home_metro()` at geocode time, or is metro derived later from the stored hierarchy? It decides where the null-metro (rural) case is handled, which is why it is not purely cosmetic.

**Do not rebuild:** the `places` tree (`parent_id`, variable-depth, region/state/county/city/neighborhood), `locations.place_id` reverse-geocoded at create via `place_for_coords()`, the `metro_polygons` overlay and `members.home_metro_id` (migration `031`), and the community-awareness feed's existing ancestor traversal. All live.

**Does not change:** `location.md` § What does not ship at b1 defers address normalization and geocoding with a State-tagged Intent (Ratified 2026-05-23). **That deferral stands.** This resolves *coordinates to a place hierarchy*; it does not normalize, validate, or canonicalize a street address, and it stands up no normalized-address store.

---

## Sequence

```
  F048  distance removal + address hand-off
    │        (precondition — must be first)
    ├────────────────────────────┐
    ▼                            ▼
  HOME/EXPLORE MERGE          F049  hood + metro at signup
  (needs Q1 answered)            │
    │                            ▼
    │                         F050  saved hoods on profile ─┐
    │                            │                          │ ship together
    │                    S-location-hierarchy               │
    │                            │                          │
    │                            ▼                          │
    │                         F051  composer location entry ─┘
    │                            │
    └──────────────┬─────────────┘
                   ▼
              F052  hierarchy ranking      (blocked — Q1)
                   │
                   ▼
              F053  metro switcher         (blocked — Q2, Q3, Q4, Q5)
```

**F048 is first and it is not a preference.** Three reasons, in descending order of how much they'd cost to get wrong:

1. **It deletes the merge's hardest conflict.** The merge has to pick one ranking authority because Home ranks server-side (`locality_feed_items`) and Explore re-sorts client-side (`sortExploreItems`), with the client winning by running last. The sharpest case was `sort=nearest` — a client-side proximity ordering competing with the ratified server-side one, measured differently, and silently winning. F048 deletes `nearest`. The merge's decision goes from three-way to two-way, and stops being about proximity at all.
2. **Otherwise the merge ports dead code and then deletes it.** `src/lib/explore/*` moves under Home wholesale — that is what the merge *is*. Distance filtering, the great-circle helper, all of `origin.ts`, and the `originAvailable` plumbing would be ported first and removed second. Double work on the same files.
3. **Worse than double work: it would port a live defect into Home's ranking path.** `fetchExploreOrigin` calls `resolveFeedPlace(client, {})` with neither member place nor requested slug, so Explore's distance origin is always the launch-locality default while `LocalityFeed` resolves the member's actual place. On a merged surface, `?place=` would move the ranked feed while the distance measurement stayed put — with no visible symptom. `decision-surfaces.md` closes this by deletion. Merge first and you re-open it, in the surface that matters more.

**F049 → F050 → F051 is a hard order.** F051's pre-fill has no source without F050; F050's set has nothing to seed it without F049. And S-location-hierarchy must land before or with F051 — entry needs somewhere to resolve into.

**F050 and F051 ship together.** F050 alone gives a member a list that does nothing: no pre-fill (that's F051), no switcher (that's F053). Shipping it alone is a curation chore with no payoff. Note that F051 carries the two criteria that prove the copy-not-reference rule, because testing "editing the profile doesn't move Items" requires an Item with a copied hood to exist.

**F052 and F053 are last and currently blocked.** Both rewrite what the merge owns.

---

## Bundle recommendation — mostly b2, and one thing that *shrinks* b1

The active bundle has two unchecked rows: the near-me reach control (F031) and the two integration-test journeys. Everything else in b1 is built and merged. **These decisions are a re-architecture of something that already works** — the locality feed ships today on `locality_feed_items` + metro polygons. A better implementation of a working feed is the definition of not-MVP.

### b1 — two items, and one of them is a deletion

| Item | Why it's b1 |
|---|---|
| **F048 — distance removal + address hand-off** | It **closes the last open b1 feature row by deletion.** The reach control (F031) was a radius control; with distance out there is no width to adjust. b1 gets smaller. It is also the merge's precondition. The address affordance is small and non-optional — removing distance without it leaves a hole where a real question used to get a bad answer. |
| **F049 — hood + metro at signup** | Small delta on shipped work. Signup already collects a `primary_home` place interest and already derives a metro via `resolve_home_metro()`. What's new is asking for the metro explicitly and not overwriting it afterward. Roughly one screen change plus a substrate call. |

### b2 — everything else

| Item | Why it waits |
|---|---|
| **F050 + F051** — saved hoods and composer entry | New profile surface, an unresolved substrate call, an unratified cap, and a rework of every shipped composer's location field. **And the decision's most urgent case does not arrive at b1:** the venue-less kinds that most need member-entered location are ask, offer, wonder, and initiative — Offer/Ask are b2.1, Initiative is b2.2. Every shipped b1 kind (gathering, product, service) already attaches to a Location. |
| **S-location-hierarchy** | New columns on Items, a backfill, an MV rewrite, and an RPC rewrite, to replace a query that currently works. Real risk, no b1 hypothesis served. |
| **F052 — hierarchy ranking** | Blocked, and it is the payoff for substrate that isn't built. |
| **F053 — metro switcher** | Blocked on four questions, one of which (reference-data ownership) is an operations gap rather than a build task. |

### The one conditional

**If Wonder (b1.5) ships inside b1, F051 comes with it.** Wonder is the first b1 kind with no venue of its own — "one sentence, no date, no place, no commitment." It needs a location answer, and the ratified answer is member entry. The minimum viable form is narrow: pick your hood or pick Online, with the warning. The address-override path and the multi-hood picker can wait.

If Wonder slips to b2 — and `bundle-1-themes.md` open question 1 already floats moving it, in the other direction — this conditional dissolves and the whole write path is cleanly b2.

### What I cut and why

- **No scenario for the geocoding step.** It has no surface. It goes in the substrate lane per rebuild rule 14. Wrapping it in a persona would produce a scenario whose acceptance criteria are migration assertions.
- **No scenario for the rings.** Inner/outer boundaries aren't expressible in `metro_polygons` at CSA grain and nobody has said what they'd *do*. Two unknowns, zero shippable criteria.
- **No scenario for the "hood" copy sweep.** It's a copy change gated on your connotation check with real members. When it lands it's a `tidy` sweep against the naming table, not a feature. Reconcile `CLAUDE.md` § Naming conventions first — it's the source the other seven inconsistencies get swept against.
- **No scenario for inferring hoods from behaviour.** Recorded as **not agreed**, needs a per-member browse-tracking privacy posture the product has never taken, and the existing posture leans the other way.

---

## Where the location work sits relative to the Home/Explore merge

**Before, alongside, and after — in that order, and the split is the point.**

- **F048 lands before the merge.** Precondition, for the three reasons above. This is the one ordering claim I'd defend hardest.
- **The write path (F049 → F050 → S-hierarchy → F051) runs alongside the merge.** It touches signup, the profile, and composers. It does not touch the feed query, the switcher, or the filter sheet. There is no file-level contention and no decision contention.
- **The read path (F052, F053) lands after the merge.** Both rewrite exactly what the merge owns — the ranking authority and the place switcher. Landing them first means doing that work twice, on two surfaces, one of which is about to stop existing.

**The merge does not need the stored hierarchy to proceed.** This is worth being explicit about, because it looks like a dependency and isn't. The hierarchy changes the **sort key**; it does not change the **architecture**. Once you've answered "which layer owns ranking," the merge can be built against today's `locality_feed_items` and re-pointed at the stored levels when they land. Blocking the merge on a substrate migration would be the expensive read of a decision that was meant to make things cheaper.

**What the merge does need is Q1 below** — and F052 needs the same answer. Answer it once, at merge scope. Answering it separately in two places is how the two surfaces ended up with two orderings the first time.

---

## Blocked — questions to you, plainly

Ordered by how much they're holding up.

### Q1 — Does the `sort` control survive, and which layer owns ranking?

`nearest` dies with F048. What survives is newest / starting soonest / most responses, all re-ordering the fetched page client-side, all discarding local-first — the one ordering the platform has committed to.

- **(a) Drop the control.** One ordering always. Loses "what's happening soonest," which is a real and different question.
- **(b) Server ranks, client re-sorts within a band.** Local-first inviolable; sort orders inside each band. The sort does less than its label promises.
- **(c) Sort is an explicit override, and the UI says so.** Honest; hands the member a switch that turns off the platform's strongest relevance signal.

**Blocks:** F052 entirely, and the Home/Explore merge. **This is the one to answer first**, and it should be answered at merge scope.

*Rider, not really a question:* filtering has to move server-side with the ranking (open question 12). Explore filters the first 100 rows, which on a ranked feed is *the hundred nearest* — so filtering to Online searches the rows least likely to contain any. Whichever way Q1 lands, this is a consequence to scope, not an option.

### Q2 — Can a member browsing another metro create there, or only read?

Read affordance or full context switch. `decision-surfaces.md` names the risk on the permissive side as "the beginning of remote spam" and the case on the other as someone who is moving there or hosting there.

**Blocks:** F053, and one beat of F051 (what the composer pre-fills while switched away). If F051 ships before F053 the case can't arise.

### Q3 — What is the rural / no-metro answer, now that distance is gone?

**You didn't list this one, and it's the sharpest thing today created.** `home_metro_id` is null outside every seeded CSA. F031's working answer was a radius scope, with the nearest metros ranked **by distance**. F048 deletes both mechanisms. `decision-surfaces.md` says whether the radius fallback survives is "unexamined" — so right now a rural member cannot complete signup and there is no ratified fallback.

- **(a)** Pick from a flat list of open metros — honest, no distance math, asks them to know which metro is theirs.
- **(b)** Seed coarser polygons covering the rural gaps — no new UI, but "metro" means something different in rural areas, and it lands on Q5.
- **(c)** Allow a null metro, center on the hood's parent city or county — no picker; needs the ranking rule to define "wider" with no metro band.

**Blocks:** one beat of F049. Doesn't block a Sacramento launch (entirely inside a CSA), so this is a launch-scope call, not a build one.

### Q4 — What happens to the active metro when a member adds a hood in a new one?

Switch, stay, or ask. F050 pins only that it must not happen silently.

**Blocks:** F053, and one criterion of F050.

### Q5 — Who owns metro boundary definition and maintenance?

This is now reference data the product depends on for its vantage point, its switcher entries, and its ranking bands, with no named owner and no update cadence. Today: a Census CSA seed with an approximated Sacramento polygon (`seed_method='approx_bbox'`).

**What it blocks is narrower than it looks.** It does *not* block a switcher on the existing seed — that ships fine for Sacramento. It blocks the two refinements ratified on top of it: `metro_polygons` holds one polygon per row at CSA grain, and CSAs are non-overlapping by construction, so **inner/outer rings aren't expressible and corridor overlap isn't expressible at all.** Both need schema and seed work.

**Blocks:** the ring behaviour (open question 7), which in turn blocks any F053 criterion that mentions ring membership. Also a standing operations gap that won't resurface on its own until something is wrong.

### Q6 — Small one: is five the right cap on saved hoods?

`member_place_interests` already caps `secondary` Places at five. Recommendation: adopt five rather than invent a second number. Say yes and F050's cap criterion is testable.

---

## Two things to record, not decide

1. **The ambient-versus-intentional distinction has now surfaced twice** — as the filter/search controls Home absorbed, and as metro switching. `decision-surfaces.md` says a third occurrence is evidence the merge is wrong and should trigger revisiting it on its merits. **Scoping F053 is a likely third.** Record it against that line if it happens rather than designing around it, which is the easy accident.
2. **F031's scenario file is now largely superseded** — its reach control is deleted by F048 and its rural picker ranks metros by distance. It should be archived or rewritten during `close`/`tidy`, not left in backlog reading as live.
