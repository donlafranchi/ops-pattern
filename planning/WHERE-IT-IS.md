# Where the product actually is

**Built by hand, 2026-09-15**, from code, migrations, GitHub issues and merged PRs — not from the planning docs, several of which are stale. **Every row names the command that proved it.** This is a snapshot and it will rot; the last section says whether to automate it.

> **Corrected 2026-09-15, same day.** A first version of this document led with a false headline — that seven completed tickets were sitting unmerged and production was three days stale. **Two mistakes produced it: a local checkout that had not been fetched, and `git branch --no-merged`.** This repo squash-merges, so a squashed branch tip never becomes an ancestor of `main` and `--no-merged` lists it forever, merged or not.
>
> **Do not use `--no-merged` in this repo.** Use `gh pr list --state merged`, or `git merge-base --is-ancestor <sha> origin/main`. And `git fetch --all --prune` first, always.

**Baseline for everything below:** `origin/main` @ `4af5ca9`, 2026-09-15 07:59 PDT, after `git fetch --all --prune`. Production serves `main`. **What I did not do: query the live database.** Migrations apply on merge, so what is on `main` should be applied; "should be" is the check I could not run, and no row below claims otherwise.

---

## 1. Built and live — what a person can do in production today

*Proof: `git ls-tree -r origin/main` for the route and its code, plus the migration that created its tables.*

| What a person can do | Proof |
|---|---|
| Browse a feed near them without signing in | `/` → `locality_feed_items` → `discoverable_items` |
| Search, filter, switch list and map | `/explore` |
| **Browse Pages rather than individual listings** | `20260912224728_browse_pages.sql`; PR #60 merged |
| **See a metro-scoped feed** | `3b86abd` on `origin/main` |
| Open any listing | `/m/[handle]/p/`, `/s/`, `/e/`, `/p/[...slug]` |
| Look at a person's public page | `/m/[handle]` |
| Sign in by magic link | `/auth/login`, `/auth/callback` — **three launch-blocking bugs open**: #67, #69, #74 |
| Pick a hood and metro after signup | `/onboarding` |
| **Be asked for a metro at every signup, never skipped** | `37da590`; PR #86 merged 2026-09-15 |
| **Join a waitlist for a metro that is not open, and see where it stands** | `src/components/metro/MetroWaitlistStep.tsx`, `src/lib/metro/waitlist-standing.ts`, `20260914204920_metro_waitlist.sql`; PR #86 |
| Open a shop, list a product, a service, or a gathering | `/you/sell` + composers |
| **Pick or create a tag for a Page instead of a category** | `src/lib/groups/tags.ts`, `20260913211828_page_tags.sql`; PR #66 |
| **Report something, and have a reported Page's photo hidden at once** | `src/actions/report/create.ts`, `20260913211209_reports_and_photo_hiding.sql`; PRs #81, #82 |
| See what they follow | `/you/following` → `member_follows` |

**Substrate landed, no surface yet:** `page_posts` and the post-grain browse source [PR #85] — the table and read path exist; nothing writes a post.

**Known broken in shipped code:** nobody can say they are coming to a gathering (`item_responses`, four readers and no writer) · Browse sorts by a column that is always zero · following a business Page tells the app you own a shop · storage access tests have never run.

---

## 2. In progress

*Proof: `gh issue list --state open`.*

**Landed but the issue is still open — bookkeeping, not build:** Browse reads Pages [#51] and the feed's metro vantage point [#52]. Both merged; both issues open. **Close them or the tracker keeps lying.**

**Ticketed, open, not built:** six-step composer with honest resume [F061 · #28] · photo at creation and takedown [F070 · #26] · default Page art [F070 · #27] · `/you/create` entry point [F060 · #25] · multi-Page holding [F069 · #24, #22] · Browse renders Pages, keeps URL and scroll [F059 · #53, #54] · Browse drops past gatherings [F059 · #23] · people saying they're coming [F063 · #34] · not-built-yet signal capture [F064 · #33] · edit an existing shop [F056 · #16] · `/you` gains a producer state [F057 · #15] · operator reviews a report on their phone [F058 · #12, **launch-blocking**].

**Bugs blocking launch, all three on the only way in:** magic link fails at the callback [#69] · PKCE challenge rejected [#67] · magic link template and redirect allowlist [#74].

---

## 3. Not built yet

### Approved, no implementation

| What it is | Size on record |
|---|---|
| Signing up: legal name, email, zip, zip suggests a metro [F081] | 8 tickets, T161–T168 |
| Becoming a creator by saying so, nothing checked [F082] | *(in the same eight)* |
| Real names between people who actually dealt with each other [F077] | none |
| Flagged content hides itself and the poster is told why [F078] | none |
| Nothing about a child without a stronger-verified account [F080] | none |
| Someone follows something [F065] | none |

### Draft, awaiting Don

`/join` as a pitch page, not a second door [F085] · the signed-in identity surface [F086] · premise copy placement [F083] · every string into one copy module [F084, **~3–4 days**] · a stranger searches and finds someone [F071] · a Page owner posts [F072–F075] · the map shows areas [F062] · follower and member are different things [F067] · a Page owner sees who noticed [F068] · the address not the mileage [F048] · hood and metro at signup [F049, **overlaps F081 — reconcile or retire**] · bulk review actions [F079, unscheduled].

---

## 4. Retired or to be removed

*Proof: route present in `git ls-tree -r origin/main`, plus the issue covering it.*

| What | Still live on main | Ticketed |
|---|---|---|
| Vendor funnel — `/register-vendor`, `/vendors/[slug]`, `/business/[slug]` | yes | #91 |
| Producer dashboard — `/you/vendor` + three bulletin screens | yes | #92 |
| Shadowed `/following` route and orphaned components | yes | #93 |
| Vendor-era report form — `src/components/ReportForm.tsx` | yes, **alongside the new `src/actions/report/`** | #63 |
| Four vendor-era components alive only via `/you` | yes | none — gated on F086 |
| Bulletins as originally written [F066] | n/a | superseded by F072–F075 |
| `members.maker_mode_enabled` | **still in the schema, written by nothing** | none |
| `role-language.md` | n/a | retired, kept as a tombstone |

---

## 5. What someone can actually offer today

*For the `/join` copy. **The page must not promise what is not there.***

**Real, today, in production.** Open a shop, then list **a product**, **a service**, or **a gathering** with a time and place. Give the Page **a tag** in your own words. **Report something** that shouldn't be there. If your metro isn't open yet, **join its waitlist** and see how far off it is.

**Real but awkward — be careful here.** **Hosting a gathering still requires opening a shop first.** Someone who only wants to convene a run club is asked to become a business to do it. Ticketed [F060 · #25], not built. **Copy inviting people to host will land them in a selling flow.**

**Not real. Do not imply any of it.**

- **Nobody can say they are coming to anything.** The responses table has readers and no writer.
- **No photographs on listings.** Substrate exists; takedown now exists too, but no composer attaches a photo.
- **No messaging.** No substrate at all. Nobody can contact anybody.
- **No posts or announcements from a Page** — the table landed, nothing writes to it.
- **No ideas, offers, asks, or volunteering.** Named in the model, no composer.
- **No second metro.** Metro scoping written, unbuilt.
- **No badges, verification, or "locally owned" marks.** Substrate only.
- **No payments.**

**The honest sentence:** *you can list what you make, what you do, and when people can come — and they can find you.* Everything past that is not there yet.

---

## Where the docs and the code disagree

1. **`HANDOFF.md` lists F076 as approved-awaiting-build. It is live** — PR #86 merged 2026-09-15.
2. **Issues #51 and #52 are open against work that shipped.**
3. **`surfaces.md` calls `/join` "a redirect shim."** It is a 178-line pitch page [#90].
4. **`surfaces.md` says the composer renders the twelve retired category terms.** The tag step shipped [PR #66].
5. **`STATUS.md` is dated 2026-09-08** and predates the report path, the waitlist, tags, and everything ruled since.
6. **`BUILD-LOG.md` still names the project "movers-makers-shakers/web"**, targets "b1 MVP — Producer Marketplace", and points at `planning/now/bundle-1.md`, which does not exist.
7. **A member still has no zip and no legal-name column** — F077 and F081 both need one. But **`zip_metro_crosswalk` and `metro_polygons` already exist** (migrations 025, 031), so the zip-to-metro lookup has substrate and **T162 is smaller than its ticket implies.**
8. **The vendor-era report form and the new report action both live on `main`.** Two report paths, one ticketed for deletion [#63].
9. **The only transactional email a member receives is not in version control** — it is a Supabase dashboard template [#74], outside review. And `FOLLOW_EMAIL_FROM` still reads *Movers, Makers & Shakers*.

---

## Should this be a skill?

**Yes for about two thirds, and the automatable two thirds is the part that rots fastest — and the part that produced today's false headline.**

**Fully automatable, and worth it.** Sections 2, 3 and 4 are joins over data that already exists: scenario frontmatter in this repo, `gh issue list`, `gh pr list --state merged`, routes from the `origin/main` tree, tables from the migrations. **A script would not have made today's mistake**, because it would have fetched first and asked GitHub whether a PR was merged rather than asking git whether a branch tip was an ancestor. The conflict list is the same shape: doc claim versus observed state, each one a diff.

**Not automatable, and shouldn't be faked.** Sections 1 and 5 need an agent reading code and judging whether a thing works for a person. No script knows that a gathering composer existing still means hosting requires opening a shop first. **Those two sections are why Don asked.**

**Recommendation: script the boring half, keep the judgement as a skill that runs it.** A `scripts/state.sh` emitting the joins as facts; a skill that runs it, reads the code, and writes sections 1 and 5. That split matters because of this repo's own rule: a hand-maintained file a person reads to be right goes stale and lies. A generated fact table nobody believes is safe. **A hand-edited status document is the thing that has died here five times.**

**Three checks the script must encode, each from a mistake already made:** fetch before reading anything · never `--no-merged` in a squash-merge repo · an issue's state is not proof of what is on `main`, and what is on `main` is not proof of an issue's state.

**Produce on demand, overwrite, never append. Do not schedule it.**
