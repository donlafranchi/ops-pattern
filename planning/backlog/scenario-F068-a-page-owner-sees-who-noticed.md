---
purpose: Scenario — a Page owner sees how many people saw the Page and its posts, and how many interacted. Carries the counts-or-names question for the PM.
layer: how
status: backlog
---

# F068: A Page owner sees who noticed

> **Written, not scheduled. One product decision inside it is the PM's and is not resolved here — see § Counts or names.**

**Bundle:** launch ([`initiative-launch.md`](../now/initiative-launch.md))
**Loops:** 9 (Make a living locally)
**Primitive shape:** viewer → Page or post. **New capture; nothing counts anything today.**
**Spec contract:** [`promises.md`](../../product/foundation/promises.md) · [`decisions.md`](../../product/foundation/decisions.md) §§ 4, 5
**Status:** backlog.

## Confirmed: nothing counts views today

**Verified in the code, not assumed. There is no view counter, no impression row, no analytics table in the current schema.**

**But this was built once.** The retired vendor model carried a `vendor_analytics_events` shape — **with a user id on every event** — and a daily rollup with `profile_views`, `support_clicks`, `new_follows`, `unfollows`, `shares`, `bulletin_opens`. **The types and some UI survive on disk as prior art; the tables do not exist in the rebuilt schema.**

**The precedent is worth naming, because it already answered the question below implicitly: the old product stored who and displayed how many.**

## The PM's words

> *"Anyone with a Page can see who and how many people have seen their Page — and that includes seeing a post from the Page owner. That can be compared to how many people interacted."*

## What it needs

- **A capture row per view** — the Page or post, the viewer if signed in, when. **Deduplicated per person per day**, or the number measures reloads rather than people.
- **A daily rollup** — views and interactions per Page per day. **Counting from raw rows at read time gets slow at exactly the moment it starts mattering.**
- **Anonymous views have no viewer.** So the count is *"people who were signed in, plus visits we could not attribute."* **The owner must not be shown one number that silently blends both.**
- **A surface on the Page, owner-only** — seen, interacted, and the comparison between them. **That comparison is the whole point:** a hundred views and two responses tells you something a hundred views alone does not.

## Counts or names — the PM's decision, presented not resolved

**This is a product decision, not an implementation one, and it sits against things already ratified.**

**The important technical fact first, because it changes the shape of the question:**

> **Counts and names are the same work plus a decision.** **To count *people* rather than page loads, you must store who viewed.** A counter that does not know identity measures reloads. **So identity is captured either way — the decision is only what the owner is shown.**

**Option A — counts only.** *"Forty-one people saw this. Six responded."*

- **Looking stays private.** A person browsing a neighbourhood is not creating a record anyone can read about them.
- Consistent with **the platform never labels or ranks a person**, and with the reasoning behind *findability follows what you have published* — **a person who has published nothing is not discoverable, and a named viewer list would make them discoverable by the act of looking.**
- The owner still gets the comparison that matters — reach against response.

**Option B — names.** *"Forty-one people saw this, including Rae, Sam and 39 others."*

- **Genuinely useful to a small local seller.** Knowing that the person who runs the café down the road looked at your Page is real information, and this is a know-your-neighbours product.
- **But it makes looking a public act.** Someone deciding whether to visit a business is watched while deciding. **A person may reasonably browse a Page they do not want the owner to know they browsed** — a competitor, an ex-employer, somewhere they are nervous about going.
- **Most platforms do not do this for posts**, and the ones that do are professional networks where being seen looking is the point.

### DEFERRED, not decided — 2026-09-08

**The PM reversed an earlier lean to counts, on the grounds that it was chosen for a simplicity that does not exist** — identity is stored either way. **This is an open decision. Today: numbers. Later: possibly names, and only ever to the Page owner.**

### And "names" means something much weaker than I argued against

> *"First names or nicknames — not identifiable full names. This is a locals app. We should know of each other even if only on a first/nickname basis."*

**My privacy argument assumed a list that identifies a person. It does not apply at this strength**, and I should not have framed it as though it did. **"Three people called Rae, Sam and Jo looked at your Page" is close to how people know each other at a market** — recognisable to someone who already knows them, opaque to someone who does not.

**What survives of the objection, narrower and worth keeping:** in a small neighbourhood, a first name plus a Page can still identify someone to the person who runs it. **The disclosure is weaker, not absent.** So the question becomes *is being recognised by a shopkeeper you already half-know a cost or the point* — and that is a product judgment, not a privacy absolute.

**The display-name model already supports this** — see below. **Nothing needs building to make names first-name-shaped; the field is already whatever the person chose to be called.**

## The display-name model — checked, and it already supports this

**There is no legal-name field anywhere.** No full name, no first/last split, no verification. **`display_name` is free text, one to sixty characters, chosen by the member at signup**, and it is what renders publicly everywhere — the member page, item attribution, the following list.

**So a member can already be known as *Rae* or *the bread guy*, and nothing prevents it.**

**The gap is not the field. It is that nothing tells them what it is for.** The onboarding prompt reads *"Add a name (1–60 characters)"* — which a person reads as *your name*, not *what you would like neighbours to call you.* **Under this ruling that is a copy gap, and it belongs in the onboarding and copy pass already in the plan.** Nothing structural.

**One consequence worth stating: if names are ever shown, it is this field, and it is already whatever the person chose.** No migration, no new column, no separate nickname. **The decision above is genuinely only about display.**

## Acceptance criteria

**Given** any view of a Page or a post
**When** it is recorded
**Then** at most one row per person per day, and anonymous views are recorded as anonymous rather than dropped.

**Given** a Page owner
**When** they open their own Page
**Then** they see how many people saw it, how many interacted, and the two side by side.
**And** attributed and unattributed views are distinguishable, not blended into one figure.

**Given** anyone who is not the Page's manager
**When** they view the Page
**Then** **no view or interaction figure is visible to them.** *(An audience count is not a public metric — the same reasoning that keeps a reaction roster private.)*

**Given** a member viewing any Page
**When** they view it
**Then** **nothing about their viewing is shown to anyone**, pending the decision above.

## Out of scope

Referrers, sessions, funnels, time-on-page, retention cohorts, week-over-week trends, any exportable report. **A local seller needs to know whether people are looking and whether it is working. Everything past that is a dashboard, and a dashboard is a different product.**
