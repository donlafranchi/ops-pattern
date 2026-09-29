# STATUS

> ## Generated 2026-09-29 · 16:16 UTC
>
> **Disposable. Regenerating replaces this file wholesale** — nothing here is
> hand-maintained, and a hand-edit is lost on the next run. `git log -p
> STATUS.md` is the history.
>
> **Refreshed by `.github/workflows/status.yml`** — on every push to `main`
> here, daily at 13:05 UTC, and on demand from the Actions tab (*status →
> Run workflow*), which works from a phone. It commits only when the content
> moved, so a new revision of this file is never a bare heartbeat. Locally:
> `bash scripts/status.sh`.
>
> **Derived from:** `scripts/state.sh` against `socialus-web` @ `origin/main`
> `aa855d0` (2026-09-29); `accepted-risks/*.json`;
> `planning/scenario-*.md` frontmatter; `ROADMAP.md`.
>
> **Answers "where is this project", not "what tickets exist."** The ticket
> list is `gh issue list`, which is always right; this is not a copy of it.

Launch **2026-10-30**, one metro. 31 days out.

**21 of 22 approved and building scenarios are unverified** — no check is marked as discharging any
of their criteria. Unmarked is unverified, not verified. § Guard coverage.

**Native apps: 7 gaps for iOS, 6 for Android** — `PLATFORM-IOS.md`, `PLATFORM-ANDROID.md`.

## Scenarios, by status

| approved | building | draft | deferred |
|---|---|---|---|
| 18 | 4 | 17 | 1 |

**Building:**
- F060 (Someone starts something without opening a shop)
- F061 (Someone creates a Page worth showing people)
- F069 (A non-business Page resolves everywhere, and holding several is ordinary)
- F070 (Every Page has a face, even without a photo)

**`building` is frontmatter, not evidence** — nothing checks it against a
branch or a commit.

## In the code repo

**52 issues open** in `socialus-web`, 8 launch-blocking:
- #135 bug · A member cannot see the Pages they made
- #205 bug · Onboarding assigns every new member a fictional home place, with no picker
- #219 F077 · Real names only between people who actually interacted; display name everywhere else
- #220 F078 · Flagged content hides itself on the agent's call, and the poster is told why
- #221 F080 · No pictures of children, from anyone — detection point needs Don
- #222 F081 · One signup for everyone: four fields, and the zip sets the metro
- #223 F082 · One self-attestation before a first Page, selling and hosting alike
- #241 bug · A public Page hands a stranger the member ids behind it — two routes, both live in production

**72 PRs merged in the last fortnight.** The newest five:
- #238 2026-09-28 bug #232: a Page photo can be added from Safari and iPhone
- #236 2026-09-28 bug #232: a Page photo from Safari is encoded as WebP in the page
- #235 2026-09-28 bug #234: the Page photo control is a button that says what it does
- #233 2026-09-29 bug #231: saving a social link no longer throws
- #230 2026-09-28 F093 · T172 · One withheld announcement card per Page, with its photo

### Needs a look — not a claim that anything is wrong

*A commit naming a ticket is not proof the ticket is done: partial work
counts. Each row needs a look, not a close.*

- **#84 open, but T159 appears on main** — chore · T159 is two different tickets — renumber one in ops-pattern
- **#53 open, but T156 appears on main** — F059 · T156 · Browse renders Pages
- **#52 open, but T155 appears on main** — F059 · T155 · Feed vantage point becomes a metro
- **#51 open, but T154 appears on main** — F059 · T154 · Browse reads Pages, not Items
- **#30 open, but T149 appears on main** — chore · T149 · Retire vendor routes for real
- **#16 open, but T126 appears on main** — F056 · T126 · Edit shop — image, description, values
- **#15 open, but T125 appears on main** — F057 · T125 · You gains a producer state

### Still on main, meant to be gone

- `/following` still present — src/app/following/page.tsx
- `members.maker_mode_enabled` still in the schema

## The ontology — what is declared

- **13 link types declared**, 11 built. Registry schema 2.
- **Declared but not built (2)** - the relationship is named and nothing writes it yet:
  - a Member supports a Page
  - an Announcement is at a Location
- **7 object types declared**: Member (live), Page (live), Item (live), Location (live), Place (live), Announcement (live), Tag (live).
- **Rejected as nouns (6)** - named so they stay rejected: Person, Creator, Organizer, Follower, Patron, Vendor.
- **28 handlers, of which 17 write no declared link.**
  Not a fault on its own - a handler may legitimately touch no relationship -
  but an undeclared link lives here if it lives anywhere:
  - group.member_join
  - group.member_leave
  - group.post_edit
  - item.publish
  - member.business_jurisdiction.remove
  - member.business_jurisdiction.set
  - member.create
  - member.interests.add
  - member.place_interest.add
  - member.place_interest.remove
  - member.saved_search.remove
  - member.saved_search.restore
  - metro.waitlist_join
  - metro.waitlist_join_anonymous
  - report.create
  - report.decide
  - report.reverse

## What CI last said

- **`deploy-health.yml`** — success, 2026-09-29
  - Database reachable from the deployment: success
  - Ontology declarations still match the code: success
- **`ci.yml`** — success, 2026-09-29
  - Unit tests: success
  - Lint, types, build: success
  - Migrations applied to production: skipped

## Measured, not estimated

- Copy: 584 strings across 118 files — source `docs/copy-inventory.md` on origin/main
- Routes on origin/main: 23
- Migrations on origin/main: 59

## Deferred on purpose — and therefore easy to forget

Ruled acceptable with a condition for looking again. The ruling itself is a
dated line in `DECISIONS.md`; the register is `accepted-risks/`.

**3 need a look now.**

- **observability: no error tracking in production** — **due in 17 days**
  - If forgotten: A runtime error for a real member is invisible. Nobody is paged, nothing is logged where anyone looks, and the first signal is a person giving up and not saying why. The DATABASE_URL outage went four months unnoticed for exactly this reason.
  - Look again if: ANY of: a member outside the team signs up; a bug is reported that nobody can reproduce; or 2026-10-16 passes with this still open.
- **ci: playwright suite exists but no workflow runs it** — **due in 17 days**
  - If forgotten: The end-to-end tests rot. Nobody runs them, they drift from the app, and the day someone needs them they no longer pass for reasons unrelated to the bug being chased — at which point they get deleted instead of fixed.
  - Look again if: ANY of: a regression reaches production that a browser test would have caught; the Playwright suite fails to run locally when someone next tries it; or 2026-10-16 passes with this still open.
- **storage: removed photo bytes stay fetchable by direct URL** — **due in 17 days**
  - If forgotten: A photo the operator removed stays downloadable, indefinitely, by anyone who has or can guess its storage URL. For ordinary bad content that is tolerable. For illegal content it is not, and 'we kept it so it could be reversed' is not a defensible answer to a regulator, a police request, or the person in the photo.
  - Look again if: ANY of: the first report of illegal content reaches the review queue; a member asks for their own photo to be actually deleted rather than taken down; a takedown demand arrives from outside the platform; or 2026-10-16 passes (two weeks before launch) with this still open.
- **data: two rows in public.places share the slug 'sacramento'** — review by 2026-11-30
  - If forgotten: A scoped link resolves to the wrong geography and nobody notices, because both answers look plausible. The heuristic makes it deterministic and therefore silent.
  - Look again if: ANY of: a member reports results from the wrong area; a third row appears with the same slug; a browse or scope read starts resolving places by SLUG rather than by id; or 2026-11-30 passes. (The T156 browse query rewrite landed 2026-09-19 and takes place and metro IDs, never slugs, deliberately — so that trigger did NOT fire and this stays a live tripwire for the next read that does.)
- **schema: reports.reviewed_at/reviewed_by_member_id/outcome duplicate report_decisions** — review by 2026-11-30
  - If forgotten: Two sources of truth drift. A write path that updates the decisions log and forgets the projection leaves a report invisible in the queue or double-counted against a reporter's cap, and the bug looks like a UI fault rather than a schema one.
  - Look again if: ANY of: a third writer of report_decisions appears; delegated reviewers land (more writers, more chances to drift); the queue shows a report whose status disagrees with its history; or 2026-11-30 passes.

## Open questions

Every open-question marker, found by scanning — nobody maintains this list.
Oldest first. Rule and grammar: `process/PIPELINE.md` § Open questions.


**Waiting on Don** (27)

- 25d · "Neighbours, not strangers or creators" vs. "everyone who posts is a creator." A) the north star's refusal is scoped to the word "creator" as a label only —… — [product/foundation/role-language.md:34](product/foundation/role-language.md#L34)
- 22d · Promise 1 — what "surplus returns to the community" actually means. A) a fixed percentage, decided annually by the founder. B) a member vote or board process… — [product/foundation/goals.md:46](product/foundation/goals.md#L46)
- 22d · The flourishing thresholds (40 discretionary hours/week, 1.5× adequacy margin). A) adopt as the literal north-star targets everywhere. B) keep them illustrat… — [product/foundation/metrics.md:16](product/foundation/metrics.md#L16)
- 17d · What triggers the LLM pass, and who approves its output? A) a scheduled job, proposals landing in a queue Don reviews. B) on demand, run when someone looks.… — [planning/scenario-F071.md:37](planning/scenario-F071.md#L37)
- 17d · Are public creator tags moderated before or after they appear? A) after — visible immediately, removed on report, which matches how the rest of the platform… — [planning/scenario-F071.md:39](planning/scenario-F071.md#L39)
- 16d · How does the search dictionary grow? A) from tags creators create — every new tag is a word a real person chose for their own thing. B) from logged zero-resu… — [planning/scenario-F071.md:41](planning/scenario-F071.md#L41)
- 14d · Where do the premise strings live, given Don expects to update them often? Copy is inline in the components today — roughly 458 user-facing strings across 50… — [planning/scenario-F083.md:37](planning/scenario-F083.md#L37)
- 13d · Which noun does the paused ontology spike model first — Item or Page? Its other question, the address rule, is the residence question in § Page. The spike li… — [product/foundation/nouns.md:178](product/foundation/nouns.md#L178)
- 10d · What makes a thing "free", now that the free-things lens has nowhere to read from? Surfaced by the browse query rewrite (`socialus-web` T156, 2026-09-19), wh… — [planning/scenario-F059.md:46](planning/scenario-F059.md#L46)
- 10d · Which ten names are the collections, and does the picker suggest from a Page's tags? *(Narrowed 2026-09-19 — Don ruled membership is owner-set, so what is le… — [product/ui/surfaces.md:61](product/ui/surfaces.md#L61)
- 10d · Does the collection picker widen step 3 or add a seventh step — and is the six-step composer judged as a set rather than step by step? — [product/ui/surfaces.md:63](product/ui/surfaces.md#L63)
- 8d · Is a private residence's address withheld, and from whom? *(Raised 2026-09-21 while scoping the answering layer, which was about to be told to enforce a rule… — [product/foundation/nouns.md:117](product/foundation/nouns.md#L117)
- 2d · What record is "a completed sale" and "a recorded attendance"? Neither exists; criteria 6–7 need a row with a date and two members on it. Until that noun exi… — [planning/scenario-F077.md:50](planning/scenario-F077.md#L50)
- 2d · What tells Don it is time to raise a metro's bar — a queue size, a daily report count, time spent reviewing? Nothing raises it automatically (Not this), so w… — [planning/scenario-F078.md:40](planning/scenario-F078.md#L40)
- 2d · Which content is reportable at launch — Page photos only, as today (`reports.subject_kind` admits `group` alone), or posts too? This decides whether F078 wid… — [planning/scenario-F078.md:42](planning/scenario-F078.md#L42)
- 2d · What is a "credible threat"? Criterion 5 routes on it and it is not one of criterion 1's six categories — a seventh category, a score threshold inside one, o… — [planning/scenario-F078.md:44](planning/scenario-F078.md#L44)
- 2d · Where is a picture of a child caught before anyone sees it — human review before visible (A), the uploader's word per photo (B), once in F082's pre-publish s… — [planning/scenario-F080.md:30](planning/scenario-F080.md#L30)
- 2d · What does a zip the crosswalk does not know do? It holds Sacramento only, and one zip maps to exactly one metro. — [planning/scenario-F081.md:35](planning/scenario-F081.md#L35)
- 2d · Which grain is "the metro" for a zip — the crosswalk's MSA 40900 (four counties) or the polygon's CSA 472 (six)? A Sutter or Yuba zip is inside the polygon a… — [planning/scenario-F081.md:37](planning/scenario-F081.md#L37)
- 2d · May a person override the metro their zip decided, through criterion 4's every-metro control? — [planning/scenario-F081.md:39](planning/scenario-F081.md#L39)
- 2d · What are the exact words of criterion 5's two lines — no sale, and real names between people who interact? Don's words ([public-is-draft]); a builder can wir… — [planning/scenario-F081.md:41](planning/scenario-F081.md#L41)
- 2d · Is the step free text in the member's own words, or fixed statements they affirm? If free text: is it stored, and who may read it — the operator only? — [planning/scenario-F082.md:44](planning/scenario-F082.md#L44)
- 2d · Are members who already own a live Page asked before their next one, or treated as having taken the step? — [planning/scenario-F082.md:46](planning/scenario-F082.md#L46)
- 2d · Does "local means metro" govern who sees a thing but not how precisely it is placed? Criterion 3 and every "no change — describing" row above rest on that re… — [planning/scenario-F094.md:56](planning/scenario-F094.md#L56)
- 2d · What replaces the venue page's "X mi away" label once there is no home place finer than the metro — drop it, or measure from something else? — [planning/scenario-F094.md:58](planning/scenario-F094.md#L58)
- 2d · Does the house voice drop "near you", "Browse nearby" and "Someone nearby will see it" from `voice.md`'s samples, and what replaces them? Replacement copy is… — [planning/scenario-F094.md:60](planning/scenario-F094.md#L60)
- 0d · Are the store apps the site in a native shell, or native screens on the same database? A) A shell around the site (Capacitor-style): every screen and server… — [product/ui/surfaces.md:65](product/ui/surfaces.md#L65)

**Cowork owes an answer** (1)

- 3d · Is the national HUD-USPS crosswalk in scope here, or a data chore first? Today's seed covers Sacramento only. — [#222](https://github.com/donlafranchi/socialus-web/issues/222)

## Guard coverage

**21 of 22 approved and building scenarios are unverified — no check is marked
as discharging any criterion of theirs, so a contradiction in them cannot surface here.** Unmarked
is unverified, not verified: nothing says a check exists, and under `[guard-proves-itself]` that
counts as absent. A **partial** criterion has checks that cover only part of it, named with what
they leave out; parts never add up to covered. Full map: `python3 scripts/markers.py coverage`.

- **F093** · 8 of 12 covered · unclaimed: 8, 10, 11, 12
- **Unverified — no marked check at all** (21): F056, F057, F058, F059, F060, F061, F063, F064, F065, F069, F070, F072, F074, F076, F077, F078, F080, F081, F082, F091, F092

## Is `building` backed by code?

Each scenario whose frontmatter says `building`, against what names it in `socialus-web`: commits
and files on main, and branches. Frontmatter is a claim; this is the evidence.

- **F060** · 0 commits on main · 5 files naming it · 0 branches
- **F061** · 0 commits on main · 12 files naming it · 0 branches
- **F069** · **nothing in the code names it** — no commit, file or branch
- **F070** · 6 commits on main · 14 files naming it · 0 branches

## Gating launch — does each have an Issue?

Every scenario whose frontmatter says `gates: launch`, against the `socialus-web` Issues
naming it. Five approved gating scenarios once had none, and nothing noticed.

- **F058** (approved) · #62 closed, #61 closed, #13 closed, #12 closed
- **F076** (approved) · #194 closed, #193 closed, #77 closed
- **F077** (approved) · #219 open
- **F078** (approved) · #220 open
- **F080** (approved) · #221 open
- **F081** (approved) · #222 open
- **F082** (approved) · #223 open
- **F093** (approved) · #215 closed

**Rulings that bind code: 26.** Each names its Issue or scenario, or says it has nothing to build;
the lint fails one that does none of the three — the identity leaks sat eight days with no Issue.

- **Nothing to build** (6), by their own tag: 2026-09-27 When a newer decision contradicts an older one, the newer on…; 2026-09-27 Cross-cutting documents are generated from inline markers, n…; 2026-09-27 Grep-built, never hand-kept: a fact lives inline where it is…; 2026-09-27 An open question is an inline marker where it was raised, no…; 2026-09-21 [guard-proves-itself] is the sixth process absolute: a check…; 2026-09-21 plainlanguage.gov governs user-facing copy, alongside voice.…

## What this run could not verify

- **The 17 drafts.** Status alone does not say which are waiting
  on Don and which are simply unfinished.

