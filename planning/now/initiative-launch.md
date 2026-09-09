---
purpose: The launch plan — what ships by 2026-10-30, in four fortnights, with the running total, the cut list, and what is knowingly broken.
layer: how
status: active
---

# Launch plan — 30 October

> **Rebuilt 2026-09-08.** The first version was written on 2026-09-07 and was one day old when a full day of decisions superseded it. **Adding new work to a plan that no longer described reality would have been worse than not planning at all**, so this is a rebuild rather than an amendment. The superseded version is in git.

## The headline

**It fits, with bulletins in — and the margin is the whole story.**

- **~26.5 days of work against ~37 working days.** Roughly **ten days of slack, about 28%.**
- **That is a real buffer and it is not a comfortable one.** Three things can eat it, named below, and **two of them are unknowable today.**
- **First on the cut list: bulletins.** If anything slips, that is the answer, and it is decided in advance so the next overrun is a lookup rather than an argument.

**One honesty note that belongs on the first page, not in a footnote.** **I mis-priced two things today, both the same way** — costing work against a database column that nothing populates. Both were caught by reading the code, not by anyone challenging the estimate. **Treat the buffer as smaller than it looks.**

## The three launch requirements — unchanged

1. A producer signs up with minimal fumbling.
2. A producer has a Page worth finding — who they are, what they offer, how to find them.
3. Consumers can find producers — browsing, searching, and on a map.

**Everything below serves one of those three, or it is on the cut list.**

## What changed on 2026-09-07 — the model, restated

- **Pages are the unit of discovery. Individual products are not.** Browse is Pages and gatherings; a Page declares which categories of thing it offers.
- **Location is a precedence, resolved at read time**, not a stored point: an active appearance at a venue wins, otherwise the Page's own anchor — **an address if it gave one, an area if it gave a neighbourhood.**
- **A point asserts presence.** A club with nothing scheduled is *of* an area, not *at* a place.
- **Ordering is community signal within a metro**, not proximity.
- **Photos are for Pages.** Item photos are deferred; every Page without one shows generated art derived from its own id.
- **Demand is measured before it is built** — categories, roadmap, and eventually ideas.

## The four fortnights

Named by **what a person can do at the end of each**, not by what got built.

### Fortnight 1 — 8–19 September · *A producer can make a Page worth showing someone*

Real address **or** neighbourhood; one category from twelve, with free text when none fit; a photo, or art that admits it isn't one; and a create flow that says it saves.

| Work | Days |
|---|---|
| Page identity migration — category, photo, event types, the demand-signal table, the response constraint. **One migration, one hand-applied push** | 0.5 |
| Location step — address search wired to the existing geocoder, neighbourhood mode, and the position resolver returning typed placements | 2.5 |
| Category step, with the *Other* capture | 0.5 |
| Photo step and Page-photo takedown | 1.5 |
| Default art | 0.5 |
| Composer resume fix and honest save copy | 0.5 |
| **The dead producer page and the create entry point** — approved and ticketed since 7 Sept | 2.5 |
| **Fortnight total** | **8.5** |

**The dogfood test is the gate on this fortnight, not a milestone after it.** Don makes his own Page with a real address, a real category and his own photos. **If any of it embarrasses him, the fortnight is not finished.**

### Fortnight 2 — 22 September–3 October · *A stranger can find that producer*

One mixed feed of Pages and gatherings, searchable by name and category, ordered by what the community responds to.

| Work | Days |
|---|---|
| Search, Pages only | 2 |
| Browse rebuilt around Pages and gatherings — the feed's source changes, not just its chrome | 2.5 |
| Popularity ordering with the reserved share for new Pages | 0.5 |
| Report path and operator image takedown — **no photo is accepted in production until this is live** | 1.5 |
| Metadata rewrite; retired vendor routes redirected or removed | 0.75 |
| **Fortnight total** | **7.25** |

**Metro scoping is not here.** It was cut once for filtering a sixteen-item corpus and displaced again by neighbourhood mode, which carries the launch market on its own. **Its ticket is written and unbuilt; it returns when there is a second metro.**

### Fortnight 3 — 6–17 October · *People can respond, and producers can reach them*

| Work | Days |
|---|---|
| **The response path** — RSVP, withdraw, one per person | 0.75 |
| Signal capture — not-built-yet taps, and the *Other* half already migrated in F1 | 0.5 |
| **Follows simplification** — one table, three subjects | 1.5 |
| **Bulletins** — post to followers, lands in their feed, one reaction, owner sees a count | 2.25 |
| Test harness: skips that cover a criterion fail the run; the write-safe instance gate | 0.75 |
| Migration drift check — remaining half | 0.25 |
| **Fortnight total** | **6** |

**Bulletins depends on follows and cannot be built first** — the audience *who follows this Page* has no substrate at all today. **3.75 for the pair, shown together so the dependency is not lost when one of them is discussed alone.**

### Fortnight 4 — 20–30 October · *The product explains itself to someone who has never seen it*

| Work | Days |
|---|---|
| Onboarding, empty states, and the copy pass — **a person currently finishes signup without ever being told what this is for** | 2.5 |
| Seed content — synthetic, display-only | 0.5 |
| **What the dogfood loop surfaces** — held open deliberately | 2 |
| **Fortnight total** | **5** |

**The empty states carry the positioning.** At launch nearly every surface is empty, so they are the product on day one — and *"help shape a better future"* means an empty state that invites you to be first, not one that apologises for being empty.

## The running total

| | Days |
|---|---|
| Fortnight 1 | 8.5 |
| Fortnight 2 | 7.25 |
| Fortnight 3 | 6 |
| Fortnight 4 | 5 |
| **Committed** | **26.75** |
| **Available to 30 October** | **~37** |
| **Slack** | **~10 days (28%)** |

### The three things that eat the buffer

1. **The unverified storage rules.** Whether one member can read or overwrite another's uploaded files has never been tested — the tests exist and have never run. **Verification waits on a Supabase branch, which waits on an account upgrade.** If that lands late, **photos cannot go to production**, and photos are in Fortnight 1.
2. **What the dogfood test surfaces.** Two days are held for it. **That number is a guess about unknown defects and it is the least reliable figure in this plan.**
3. **My estimating record today.** Two mis-prices, both from costing work against data that does not exist. **The buffer should be read as partly spent already.**

## The cut list — in order, decided in advance

**Do not re-litigate when the time comes. Take the top item.**

1. **Bulletins — 2.25 days.** Newest, and the only committed item that serves none of the three launch requirements directly. *(Follows stays even if bulletins goes — it fixes a live bug.)*
2. **Popularity ordering — 0.5.** Ship recency-ordered browse; the reserved-share rule is what makes it fair, and without responses it does nothing anyway.
3. **Signal capture — 0.5.** The deferred features hide instead of asking.
4. **Default art down to its simplest form — 0.25.** A flat tint and a letter instead of a gradient pair.
5. **Search narrows to name only, dropping category matching — 0.5.**
6. **Seed content — 0.5.** Launch with what is real.

**Below the line and not cuttable:** the location step, the category step, the report path, the response path, the entry point. **Each is load-bearing for a launch requirement or is a defect.**

## Known broken — defects in shipped code, not missing features

**These render as though they work. That is what makes them defects.**

- **Nobody can say they are coming to a gathering.** The response table has four readers and no writer, and no unique constraint. *(Fortnight 3.)*
- **Browse offers a sort by responses that orders by a column that is zero for every row, always.** The control works; the ordering is a no-op; nothing tells the member. *(Fixed by the same work.)*
- **Following a business Page would tell the app you own a shop.** The Sell routing check filters kind and lifecycle but **not role**. Live today, independent of any follow work. *(Fortnight 3, and it should not slip with follows.)*
- **Storage access rules are unverified.** Not known-broken — **known-unchecked**, which is worse to leave silent.

## What has no rules written anywhere

**Recorded so it is not rediscovered as a gap in three weeks.**

- **Join / leave a Group** — handlers shipped and in production, no scenario, no rules. **And joining is what the following list currently misreads as a follow.**
- **Save** — in the response vocabulary, never built, never specced, and now homeless.
- **Retire a Page** — five read paths handle it; the handler was never written.
- **Appear at a venue** — ruled, but the rules live in a decision doc with no scenario.
- **Two people cannot message each other at all.** No messages, threads or comments exist. **This is why volunteering has no reply channel**, and it is a known hole rather than an oversight.

## Deferred past launch, with the reason

- **Item photos** — the Page is the unit that carries a face. Substrate already built; about half a day when it resumes.
- **Volunteering** — the *offer* and *ask* kinds exist with no composer, **and an ask with no reply channel is a dead end.** Blocked by messaging, not by the composer.
- **The idea mechanic** — put something to the neighbourhood and see who wants it. **Fully specced, substrate shipped, only the composer and page missing.** The most distinctive thing in the pitch and the hardest deferral on this list. *(Both of these get a not-built-yet tap so people can ask for them.)*
- **Metro scoping** — ticket written, returns with a second metro.
- **Page-level appearances** — 1.5 days, the honest next candidate once item-level appearances stopped making sense.
- **Merging the follow substrates fully, and the map's area rendering** — both scoped, both post-launch.
