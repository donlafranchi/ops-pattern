# Where the product actually is

**Built by hand, 2026-09-15**, from the code, the migrations, the GitHub issues and the branch state — not from the planning docs, several of which are stale. Every row carries its evidence. **This is a snapshot and it will rot; see the last section on whether to automate it.**

> **The single most important fact in this document: `main` has not moved since 12 September.** Seven tickets were closed as completed on 14–15 September. **None of that work is on `main`, so none of it is in production.** Each sits on a pushed branch with **no open pull request**. The issue tracker says shipped; production says three days ago.
>
> **What I could not verify:** I read the migration files, not the live database. The repo applies migrations on merge, so what is on `main` should be applied — but "should be" is the check I could not run. Nothing below claims a production database state I observed directly.

---

## 1. Built and live — what a person can do in production today

*Evidence is a route on `main` plus the tables it reads. `main` @ `3afe238`, 2026-09-12.*

| What a person can do | Evidence | Note |
|---|---|---|
| Browse a feed of things near them, without signing in | `/` → `locality_feed_items` → `discoverable_items` | No signup wall, as ratified |
| Search and filter, switch between list and map | `/explore` | Indexes **Items, not Pages** — the Pages rewrite is on an unmerged branch |
| Open any listing | `/m/[handle]/p/`, `/s/`, `/e/`, `/p/[...slug]` | `/p/[...slug]` dispatches five resolvers |
| Look at a person's public page | `/m/[handle]` | |
| Sign in by magic link | `/auth/login`, `/auth/callback` | **Two launch-blocking bugs open against it** — #67, #69 |
| Pick a hood and a metro after signing up | `/onboarding` | Finishes without ever saying what the product is for |
| Open a shop and list a product, a service, or a gathering | `/you/sell` + composers | Requires opening a shop first, which is the defect the launch exists to fix |
| See what they follow | `/you/following` → `member_follows` | Lists only; delivers nothing |

**Known broken in shipped code, not missing features:** nobody can say they are coming to a gathering (`item_responses` has four readers and no writer) · Browse offers a sort by a column that is always zero · following a business Page tells the app you own a shop · storage access rules have tests that have never run.

---

## 2. In progress

### Done, closed, and not in production — the seven

*All closed COMPLETED 14–15 Sep. All on pushed branches. **Zero open PRs.***

| What it is | Issue | Branch |
|---|---|---|
| Joining a metro waitlist from outside an open metro [F076] | #77 | `f076-t163-metro-waitlist` |
| Reporting a Page, and hiding its photo at once [F058] | #61 | `f058-t159-report-create` |
| The report control, and what the owner sees [F058] | #62 | `f058-t160-report-control` |
| The composer's category step becomes a tag step [F071] | #64 | `f071-t159-tag-step` |
| Browse reads Pages, not Items [F059] | #51 *(open)* | `f059-t154-browse-source` |
| The post table, and browse's post-grain source [F059] | #75 | `f059-t162-page-posts` |
| Nav gains a create action | #55 | `f059-t158-nav-create-action` — **not pushed to origin at all** |

**`chore-retire-surfaces` (29 commits) and `chore-copy-audit` (28) are the two largest unmerged branches** and have no issue closed against them.

### Open, ticketed, not built

Page composer with six steps and honest resume [F061 · #28] · photo at creation and takedown [F070 · #26] · default Page art [F070 · #27] · `/you/create` entry point [F060 · #25] · multi-Page holding [F069 · #24, #22] · Browse rendering Pages [F059 · #52, #53, #54] · people saying they're coming [F063 · #34] · not-built-yet signal capture [F064 · #33] · edit an existing shop [F056 · #16] · `/you` gains a producer state [F057 · #15] · the operator reviews a report on their phone [F058 · #12, **launch-blocking**].

### Bugs blocking launch

Magic link fails at the callback, PKCE verifier missing [#69] · sign-in rejected, invalid PKCE challenge characters [#67] · magic link template and redirect allowlist [#74]. **All three are on the only way into the product.**

---

## 3. Not built yet

### Approved, no implementation

| What it is | Size on record |
|---|---|
| Signing up: legal name, email, zip, and the zip suggests a metro [F081] | 8 tickets sequenced, T161–T168 |
| Becoming a creator by saying so, nothing checked [F082] | *(in the same eight)* |
| Real names between people who actually dealt with each other [F077] | none recorded |
| Flagged content hides itself and the poster is told why [F078] | none |
| Nothing about a child without a stronger-verified account [F080] | none |
| Someone follows something [F065] · someone asks for something not built [F064] | none |

### Draft, awaiting Don

`/join` as a pitch page, not a second door [F085] · the signed-in identity surface [F086] · premise copy placement [F083] · every string into one copy module [F084, **~3–4 days, ~458 strings across 93 files**] · a stranger searches and finds someone [F071] · a Page owner posts [F072–F075] · the map shows areas [F062] · a follower and a member are different things [F067] · a Page owner sees who noticed [F068] · the address not the mileage [F048] · hood and metro at signup [F049, **overlaps F081 — needs reconciling or retiring**] · bulk review actions [F079, deliberately unscheduled].

---

## 4. Retired or to be removed

| What | Evidence | Ticketed |
|---|---|---|
| The old vendor funnel — `/register-vendor`, `/vendors/[slug]`, `/business/[slug]` | live routes on `main` | #91 |
| The producer dashboard — `/you/vendor` and three bulletin screens | live routes, six dead tables | #92 |
| The shadowed `/following` route and orphaned components | no inbound links | #93 |
| The vendor-era report form | `src/components/ReportForm.tsx` | #63 |
| Four vendor-era components | alive only because `/you` imports them | none — gated on F086 |
| Bulletins as originally written [F066] | superseded 2026-09-13 | replaced by F072–F075 |
| `members.maker_mode_enabled` | **still in the schema, written by nothing** | none |
| `role-language.md` | retired 2026-09-14, kept as a tombstone | n/a |

---

## 5. What someone can actually offer today

*For the `/join` copy. **The page must not promise what is not there.***

**Real, today, in production.** A person can open a shop and then list **a product**, **a service**, or **a gathering** with a time and place. That is the whole list. Composers for all three are on `main`.

**Real but awkward, and this is the thing to be careful about.** **Hosting a gathering requires opening a shop first.** Someone who only wants to convene a run club is asked to become a business to do it. The fix is ticketed [F060 · #25] and not built. **Copy that invites people to host will land them in a selling flow.**

**Close, but not in production.** Reporting something and having a photo come down [branch, unmerged] · picking or creating a **tag** for what you make instead of a category [branch, unmerged] · joining a waitlist for a metro that is not open [branch, unmerged].

**Not real. Do not imply any of it.**

- **Nobody can say they are coming to anything.** The responses table has readers and no writer. An event page cannot collect an RSVP today.
- **No photographs.** Upload substrate exists; no listing carries a face, and rule 1 bars photos from production until takedown ships.
- **No messaging of any kind.** No substrate at all. Nobody can contact anybody.
- **No ideas, offers, asks, or volunteering.** Named in the model, no composer, no surface.
- **No posts or announcements from a Page.**
- **No metro beyond the first.** Metro scoping is written and unbuilt.
- **No badges, no verification, no "locally owned" marks.** Substrate only.
- **No payments of any kind.**

**The honest sentence:** *you can list what you make, what you do, and when people can come — and they can find you.* Everything past that is not there yet.

---

## Where the docs and the code disagree

**These are the most valuable rows in this document.**

1. **`main` is three days behind the issue tracker.** Seven completed tickets, no open PRs, nothing merged since 12 Sep. Every doc describing those as shipped is wrong.
2. **`HANDOFF.md` lists F076 as approved-awaiting-build. It is built** — #77 closed, branch pushed, not merged.
3. **`surfaces.md` calls `/join` "a redirect shim."** It is a 178-line pitch page. #90 records this; the doc is unfixed.
4. **`surfaces.md` says the composer's category step "renders the twelve retired terms today."** True on `main`; the tag step exists on an unmerged branch.
5. **`STATUS.md` is dated 2026-09-08 and describes a world before F076, F077–F082 and the voice guide.** It is the file that is supposed to say what is true now.
6. **`BUILD-LOG.md` still names the project "movers-makers-shakers/web" and targets "b1 MVP — Producer Marketplace"**, pointing at `planning/now/bundle-1.md`, a path that does not exist in this repo.
7. **A member has no zip and no legal name column** — F077 and F081 both need one. But **`zip_metro_crosswalk` and `metro_polygons` already exist** (migrations 025, 031), so the zip-to-metro lookup has substrate and T162 is smaller than its ticket implies.
8. **`issue-lint` is failing on `main`** and has been for seven of the last eight runs.

---

## Should this be a skill?

**Yes for about two thirds of it, and the automatable two thirds is the part that rots fastest.** Splitting it honestly:

**Fully automatable, and worth it.** Sections 2, 3 and 4 are joins over data that already exists: scenario frontmatter `status` in this repo, `gh issue list` state and labels, `git branch` versus `main`, `gh pr list`, routes from `find src/app -name page.tsx`, tables from the migration files. **The seven-closed-tickets-not-on-main finding came out of exactly one comparison** — closed issue dates against `main`'s last commit date — and a script would have caught it the day it happened rather than three days later. The conflict list is the same shape: doc claims versus observed state, each one a diff.

**Not automatable, and shouldn't be faked.** Section 1 ("what a person can actually do") and section 5 ("what someone can offer") require reading code and judging whether a feature works for a person. No script knows that a gathering composer existing means hosting requires opening a shop first. **Those two sections are the reason Don asked**, and they need an agent reading, every time.

**The honest recommendation: build the boring half as a script, keep the interesting half as a skill that runs it.** A `scripts/state.sh` emitting the joins as facts, and a skill that runs it, reads the code for sections 1 and 5, and writes the prose. That split matters because of this repo's own lesson: a hand-maintained file that a person reads to be right goes stale and then lies. **A generated fact table nobody believes is safe; a prose summary an agent rewrites each time is safe; a hand-edited status document is the thing that has died here five times already.**

**What would make it worthless:** regenerating it on a schedule and letting it accumulate. It should be produced on demand, overwritten, never appended — the same discipline `STATUS.md` has and has not kept.

**One thing to fix first, whatever is decided:** the seven unmerged branches. A status document is a poor substitute for merging work that is finished.
