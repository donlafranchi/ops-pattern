# STATUS

**Where the project is, right now. 2026-09-08.**

> **Overwritten, never appended — `git log -p STATUS.md` is the history. Hard limit: one screen**; if it stops fitting, something has stopped being current, so cut rather than scroll.
>
> **Nothing is published.** Every user-facing string in the repo is a draft; what gets published is the PM's call.
>
> **One of three durable documents**, with [`DECISIONS.md`](DECISIONS.md) (what's ruled out, and why) and [`nouns.md`](product/foundation/nouns.md) (the nouns). Everything else has a lifecycle or is a liability. **New rulings** land in [`DECISIONS.md`](DECISIONS.md); **build detail** lives as Issues and PRs in `socialus-web`.

---

## What's true right now

SocialUs is a local discovery app — buy, sell, trade, and gather — launching **30 October** to one metro. The substrate is finished. Anyone can browse a feed and a map, search it, and open any listing. Producers can create a shop through a five-step walkthrough and list products, services and gatherings under it. There are 16 items, 11 people and 3 groups, all seeded.

**The model changed on 7 September and the build is catching up.** **Pages are the unit of discovery, not products** — browse is Pages and gatherings, a Page declares its categories, and photos belong to Pages. The producer entry point is still dead and a gathering still requires opening a shop first, which is the marketplace-only defect the launch exists to correct. Nothing carries a photo and no shared link shows a preview.

## In flight

- **A Page worth showing people** — the current stretch, judged by Don creating his own Page: a real address *or* a neighbourhood, one category, a photo, generated art on every Page without one. **In build, seven tickets, nothing blocking.**
- **The launch plan was rebuilt 2026-09-08** after a day of decisions superseded it. **~26.5 days of work against ~37 available — it fits, with about 28% slack.** First on the cut list is bulletins. [`ROADMAP.md`](ROADMAP.md).
- **Fixing the dead producer page** — approved, ticketed, buildable today. Create nothing, reuse one query, remove six dead reads. *Blocked on nothing.*
- **The producer entry point** — `/you/sell` forks into `/you/create`, letting people host without opening a shop. Reviewed and ticketed.
- **The report path and image takedown** — approved. **No photograph is accepted in production until this is live**, so it runs alongside the Page work rather than after it.
- **Item photos** — **deferred.** The Page is the unit that carries a face. The upload substrate moved to the Page work; when Items resume it is a composer field, about half a day.

## Known broken — shipped code, not missing features

- **Nobody can say they're coming to a gathering.** The response table has four readers and no writer.
- **Browse offers a sort that orders by a column that is always zero.** The control works; the ordering does nothing.
- **Following a business Page would tell the app you own a shop** — a routing check filters kind and lifecycle but not role. Live today.
- **Storage access rules are unverified** — the tests exist and have never run. Not known-broken; known-unchecked.

## Waiting on Don

- **The Page composer is now six steps** — name, address, category, photo, about, review — against a launch requirement of *minimal fumbling*. Three are new and each earns its place, but nobody has judged them as a set. **Not blocking: the first tickets are substrate.** Options in the F061 review.
- **The 84 cleanup rulings** and the unsure list from the doc consolidation — folded into this revamp; nothing outstanding blocks build.
- **Whether "members share in what they help build" means profit or ownership.** It decides whether that candidate competes with the surplus promise for the same money or draws on something else entirely — the single clarification that most changes the shape of the promise set.
- **Promise 1 — what "surplus goes back to the community" actually means.** Who decides the number, over what period, and what returning it looks like. Three options in [`product/foundation/promises.md`](product/foundation/promises.md); **the promise stays out of user-facing copy until this is picked.**
- **Two contradictions and one never-ratified claim left** in [`DECISIONS.md`](DECISIONS.md) — the creator-framing conflict, the top-anchored search row, and the flourishing thresholds.
- **Whether the follows simplification and bulletins are scheduled.** Both are written and reviewed, deliberately sitting in the draft lane. **3.75 days for the pair**; bulletins is first on the cut list.

## Next — the four fortnights, in one line each

1. **A producer can make a Page worth showing someone** — real address or neighbourhood, a category, a photo. *(Gated on Don making his own.)*
2. **A stranger can find that producer** — search, and browse rebuilt around Pages and gatherings.
3. **People can respond, and producers can reach them** — RSVP, follows, bulletins.
4. **The product explains itself** — onboarding, empty states, and whatever the dogfood loop surfaces.

Detail, days and the cut list: [`ROADMAP.md`](ROADMAP.md).
