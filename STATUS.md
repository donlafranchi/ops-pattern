# STATUS

**Where the project is, right now. 2026-09-07.**

> **This file is overwritten, never appended.** It always describes the present. Git holds every previous version, so nothing is lost by rewriting it in place — `git log -p STATUS.md` is the history.
>
> **Hard limit: one screen.** The limit is the mechanism, not a style note. If this file stops fitting, something in it has stopped being current — cut that thing rather than scrolling.
>
> **Nothing is published.** The app is not launched; every user-facing string in the repo is a draft. Nothing here has been said to anyone, and what gets published is the PM's call.
>
> **If a line doesn't answer "where are we," it belongs somewhere else.** Decisions → [`planning/DECISIONS.md`](planning/DECISIONS.md). Constraints → [`product/foundation/settled.md`](product/foundation/settled.md). Build detail → [`BUILD-LOG.md`](BUILD-LOG.md). The narrative log this file replaced → [`planning/archive/JOURNAL.md`](planning/archive/JOURNAL.md).

---

## What's true right now

SocialUs is a local discovery app — buy, sell, trade, and gather — launching **30 October** to one metro. The substrate is finished and the consumer half works: anyone can browse a feed and a map of what's nearby, search it, filter it, open any listing, and follow a person, a shop or a venue. Producers can create a shop through a five-step walkthrough and list products, services and gatherings under it, each with a public page that resolves at a real address. There are 16 items, 11 people and 3 groups in the database, all seeded.

**Two things are badly wrong and both are the launch.** The page a producer lands on after signing up queries seven database tables that do not exist, so it renders empty — the door to becoming a producer is dead. And a gathering cannot be created without first opening a shop, which makes the whole product read as a marketplace with events bolted on. Nothing anywhere carries a photo, and no shared link shows a preview.

## In flight

- **Fixing the dead producer page** — approved, ticketed, buildable today. Create nothing, reuse one query, remove six dead reads. *Blocked on nothing.*
- **The producer entry point** — `/you/sell` forks into `/you/create`, which asks *what are you starting?* and lets people host without opening a shop. **Blocked on: a review, which needs Don's go-ahead.**
- **Photo upload, link previews, and the report path** — scoped and ticketed. **Blocked on: `weigh` running on two commitments — stripping location data out of uploaded photos, and having a takedown path before the first upload.** Two hours of work; nine days sit behind it.
- **Repo cleanup** — 26 files archived, 84 flagged for a ruling. *Done; awaiting rulings.*

## Waiting on Don

- **Go-ahead to review the producer entry point.** Blocks the entire host-without-a-shop track — the change the repositioning rests on.
- **The 84 cleanup rulings**, in [`planning/CLEANUP.md`](planning/CLEANUP.md). The two that block work: whether the spec-patch backlog gets drained, and whether two launch-adjacent decisions (profile edits needing an update handler, the accent colour failing contrast) get promoted into the plan.
- **Whether "members share in what they help build" means profit or ownership.** It decides whether that candidate competes with the surplus promise for the same money or draws on something else entirely — the single clarification that most changes the shape of the promise set.
- **Promise 1 — what "surplus goes back to the community" actually means.** Who decides the number, over what period, and what returning it looks like. Three options in [`product/foundation/promises.md`](product/foundation/promises.md); **the promise stays out of user-facing copy until this is picked.**
- **Two contradictions and one never-ratified claim left** in [`product/foundation/settled.md`](product/foundation/settled.md) — the creator-framing conflict, the top-anchored search row, and the flourishing thresholds.
- **Four launch scope questions** in [`planning/now/initiative-launch.md`](planning/now/initiative-launch.md): one metro or anywhere; confirm the Explore-into-Home merge stays cut; drop the category filter or buy the half-day; and whether the date is 30 October or early November.

## Next

1. **Profiles worth finding** — a shop editor and a member profile editor: image, tagline, bio, links, hours, where they'll be next. Nothing is editable today; every field set at signup is permanent.
2. **A way to browse people** — browse and search producers and organizers, and put them on the map. Today browse indexes listings only, so a stranger cannot answer *who is here*.
3. **Teaching the product** — onboarding, empty states, and the copy pass. A person currently finishes signup without ever being told what the platform is for.
