# STATUS

> ## Generated 2026-09-30 · 23:31 UTC
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
> `aba449d` (2026-09-30); `accepted-risks/*.json`;
> `planning/scenario-*.md` frontmatter; `ROADMAP.md`.
>
> **Answers "where is this project", not "what tickets exist."** The ticket
> list is `gh issue list`, which is always right; this is not a copy of it.

Launch **2026-10-30**, one metro. 30 days out.

**20 of 22 approved and building scenarios are unverified** — no check is marked as discharging any
of their criteria. Unmarked is unverified, not verified. § Guard coverage.

**Native apps: 7 gaps for iOS, 6 for Android** — `PLATFORM-IOS.md`, `PLATFORM-ANDROID.md`.

## Scenarios, by status

| approved | building | draft | deferred |
|---|---|---|---|
| 18 | 4 | 18 | 1 |

**Building:**
- F060 (Someone starts something without opening a shop)
- F061 (Someone creates a Page worth showing people)
- F069 (A non-business Page resolves everywhere, and holding several is ordinary)
- F070 (Every Page has a face, even without a photo)

**`building` is frontmatter, not evidence** — nothing checks it against a
branch or a commit.

## In the code repo

**54 issues open** in `socialus-web`, 11 launch-blocking:
- #205 bug · Onboarding assigns every new member a fictional home place, with no picker
- #219 F077 · Real names only between people who actually interacted; display name everywhere else
- #220 F078 · Flagged content hides itself on the agent's call, and the poster is told why
- #221 F080 · No pictures of children, from anyone — detection point needs Don
- #222 F081 · One signup for everyone: four fields, and the zip sets the metro
- #223 F082 · One self-attestation before a first Page, selling and hosting alike
- #246 bug · What one member can read about another: the signed-in half of #241, and four member tables open to anyone
- #252 F093 · T173 · the signed-out front door: name, photo, description and the card; no location or tags
- #253 bug · T174 · signed in, a visitor still reads founder, seller and host ids, and seller names on item cards
- #256 F072 · T175 · a timed announcement's card leads with its date and time; an untimed one says when it was posted; its place reads as its Page's
- #257 F091 · T176 · What's happening, today and this week

**71 PRs merged in the last fortnight.** The newest five:
- #251 2026-09-30 F080 #221: Don's short safety line at posting; the full one kept for the rules page
- #250 2026-09-30 F080 #221: ask members not to post anything sensitive, wherever they post
- #249 2026-09-30 bug #246: nobody reads another member; follows, interests, responses and location owners close
- #247 2026-09-30 bug #246: a business registration is never displayed; the badge is a boolean
- #245 2026-09-29 bug #241 (2 of 2): a public Page does not hand a stranger the member ids behind it

### Needs a look — not a claim that anything is wrong

*A commit naming a ticket is not proof the ticket is done: partial work
counts. Each row needs a look, not a close.*

- **#84 open, but T159 appears on main** — chore · T159 is two different tickets — renumber one in ops-pattern
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

- **`deploy-health.yml`** — success, 2026-09-30
  - Ontology declarations still match the code: success
  - Database reachable from the deployment: success
- **`ci.yml`** — success, 2026-09-30
  - Lint, types, build: success
  - Unit tests: success
  - Migrations applied to production: skipped

## Measured, not estimated

- Copy: 584 strings across 118 files — source `docs/copy-inventory.md` on origin/main
- Routes on origin/main: 23
- Migrations on origin/main: 63

## Deferred on purpose — and therefore easy to forget

Ruled acceptable with a condition for looking again. The ruling itself is a
dated line in `DECISIONS.md`; the register is `accepted-risks/`.

**3 need a look now.**

- **observability: no error tracking in production** — **due in 16 days**
  - If forgotten: A runtime error for a real member is invisible. Nobody is paged, nothing is logged where anyone looks, and the first signal is a person giving up and not saying why. The DATABASE_URL outage went four months unnoticed for exactly this reason.
  - Look again if: ANY of: a member outside the team signs up; a bug is reported that nobody can reproduce; or 2026-10-16 passes with this still open.
- **ci: playwright suite exists but no workflow runs it** — **due in 16 days**
  - If forgotten: The end-to-end tests rot. Nobody runs them, they drift from the app, and the day someone needs them they no longer pass for reasons unrelated to the bug being chased — at which point they get deleted instead of fixed.
  - Look again if: ANY of: a regression reaches production that a browser test would have caught; the Playwright suite fails to run locally when someone next tries it; or 2026-10-16 passes with this still open.
- **storage: removed photo bytes stay fetchable by direct URL** — **due in 16 days**
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


**Waiting on Don** (28)

- 26d · "Neighbours, not strangers or creators" vs. "everyone who posts is a creator." A) the north star's refusal is scoped to the word "creator" as a label only —… — [product/foundation/role-language.md:34](product/foundation/role-language.md#L34)
- 23d · Promise 1 — what "surplus returns to the community" actually means. A) a fixed percentage, decided annually by the founder. B) a member vote or board process… — [product/foundation/goals.md:46](product/foundation/goals.md#L46)
- 23d · The flourishing thresholds (40 discretionary hours/week, 1.5× adequacy margin). A) adopt as the literal north-star targets everywhere. B) keep them illustrat… — [product/foundation/metrics.md:16](product/foundation/metrics.md#L16)
- 18d · What triggers the LLM pass, and who approves its output? A) a scheduled job, proposals landing in a queue Don reviews. B) on demand, run when someone looks.… — [planning/scenario-F071.md:37](planning/scenario-F071.md#L37)
- 18d · Are public creator tags moderated before or after they appear? A) after — visible immediately, removed on report, which matches how the rest of the platform… — [planning/scenario-F071.md:39](planning/scenario-F071.md#L39)
- 17d · How does the search dictionary grow? A) from tags creators create — every new tag is a word a real person chose for their own thing. B) from logged zero-resu… — [planning/scenario-F071.md:41](planning/scenario-F071.md#L41)
- 15d · Where do the premise strings live, given Don expects to update them often? Copy is inline in the components today — roughly 458 user-facing strings across 50… — [planning/scenario-F083.md:37](planning/scenario-F083.md#L37)
- 14d · Which noun does the paused ontology spike model first — Item or Page? The spike lives outside this repo, at `../socialus-ontology-spike/INTENT.md`. — [product/foundation/nouns.md:233](product/foundation/nouns.md#L233)
- 11d · What makes a thing "free", now that the free-things lens has nowhere to read from? Surfaced by the browse query rewrite (`socialus-web` T156, 2026-09-19), wh… — [planning/scenario-F059.md:46](planning/scenario-F059.md#L46)
- 11d · Which ten names are the collections, and does the picker suggest from a Page's tags? *(Narrowed 2026-09-19 — Don ruled membership is owner-set, so what is le… — [product/ui/surfaces.md:61](product/ui/surfaces.md#L61)
- 11d · Does the collection picker widen step 3 or add a seventh step — and is the six-step composer judged as a set rather than step by step? — [product/ui/surfaces.md:63](product/ui/surfaces.md#L63)
- 1d · Are the store apps the site in a native shell, or native screens on the same database? A) A shell around the site (Capacitor-style): every screen and server… — [product/ui/surfaces.md:65](product/ui/surfaces.md#L65)
- 1d · May a Page's runner see *who* follows them, or only how many? The 2026-09-08 ruling says "may see its own audience"; the `verbs.md` matrix says numbers only;… — [#248](https://github.com/donlafranchi/socialus-web/issues/248)
- 1d · Is there an audience between "Anyone" and "Members": announcements only followers can read? The recommendation says no, because a followers-only tier makes a… — [#248](https://github.com/donlafranchi/socialus-web/issues/248)
- 1d · What do `private`, `community_only` and `public` mean to a signed-in member looking at someone else, and who counts as "community" for `community_only`? — [#246](https://github.com/donlafranchi/socialus-web/issues/246)
- 1d · Which one setting is a member's visibility: stakeholder_visibility (private | community_only | public) or member_privacy.profile_visibility (public |… — [#246](https://github.com/donlafranchi/socialus-web/issues/246)
- 1d · Is a Page's founder, or an item's seller, part of the thing's front door (shown to everyone), or a person, and so subject to their own setting? — [#246](https://github.com/donlafranchi/socialus-web/issues/246)
- 1d · Who may see that someone RSVP'd to, or bought, an item: anyone, the organiser or seller, other attendees, or nobody? — [#246](https://github.com/donlafranchi/socialus-web/issues/246)
- 1d · May a signed-in member see who belongs to a Page, or who founded it, when they have never interacted with them? (The draft above suggests a roster is behind… — [#246](https://github.com/donlafranchi/socialus-web/issues/246)
- 1d · Which of a member's fields may a signed-in stranger read? Today it is all of them, home location and home metro included. — [#246](https://github.com/donlafranchi/socialus-web/issues/246)
- 1d · Is the follow graph (who follows whom) visible to anyone, to signed-in members, or only to the two people in it? — [#246](https://github.com/donlafranchi/socialus-web/issues/246)
- 1d · Are a member's interest tags public, and if so, public without their member id? — [#246](https://github.com/donlafranchi/socialus-web/issues/246)
- 0d · Does the widening reach text and reports, or images only? Don's words are *"anything related to children, animals/pets"*; the 2026-09-27 ruling says a photo… — [planning/scenario-F080.md:29](planning/scenario-F080.md#L29)
- 0d · What are the final words of criterion 5's signup line? B4's placeholder holds until then. Don, 2026-09-30: the 2026-09-14 wording was not good enough, and di… — [planning/scenario-F081.md:40](planning/scenario-F081.md#L40)
- 0d · How do we verify a person? Every member is verified as a person, to discourage anonymous behaviour (Don, 2026-09-30); the method is open. Phone is one candid… — [planning/scenario-F081.md:46](planning/scenario-F081.md#L46)
- 0d · For counsel: the privacy policy must disclose that we collect legal names, verified emails, and whatever person verification collects (California privacy dut… — [planning/scenario-F081.md:48](planning/scenario-F081.md#L48)
- 0d · When "near me" returns, how does finding by neighbourhood fit "local = the whole metro" and "no distance shown"? A) A place filter the member types, not a ra… — [planning/scenario-F095.md:28](planning/scenario-F095.md#L28)
- 0d · How is a Page placed on the signed-out map without sending its location? Any pin at the stored point reveals the address. A) Pin at the Page's Place centroid… — [#252](https://github.com/donlafranchi/socialus-web/issues/252)

**Cowork owes an answer** (1)

- 4d · Is the national HUD-USPS crosswalk in scope here, or a data chore first? Today's seed covers Sacramento only. — [#222](https://github.com/donlafranchi/socialus-web/issues/222)

**Code owes an answer** (2)

- 0d · Signed out, browse_feed returns no post rows. Does a signed-out *today* row show withheld cards for Pages posting something today, through announcements_w… — [#257](https://github.com/donlafranchi/socialus-web/issues/257)
- 0d · Item URLs. An item posted without a Page lives at `/m/<handle>/p/…`, so its URL carries its poster's handle. Removing that is a route change with redirects,… — [#253](https://github.com/donlafranchi/socialus-web/issues/253)

## Guard coverage

**20 of 22 approved and building scenarios are unverified — no check is marked
as discharging any criterion of theirs, so a contradiction in them cannot surface here.** Unmarked
is unverified, not verified: nothing says a check exists, and under `[guard-proves-itself]` that
counts as absent. A **partial** criterion has checks that cover only part of it, named with what
they leave out; parts never add up to covered. Full map: `python3 scripts/markers.py coverage`.

- **F080** · 1 of 5 covered · unclaimed: 1, 2, 3, 4
- **F093** · 4 of 12 covered · **partial: 4, 5, 6, 9** · unclaimed: 8, 10, 11, 12
- **Unverified — no marked check at all** (20): F056, F057, F058, F059, F060, F061, F063, F064, F065, F069, F070, F072, F074, F076, F077, F078, F081, F082, F091, F092

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
- **F078** (approved) · #220 open
- **F080** (approved) · #221 open
- **F081** (approved) · #222 open
- **F082** (approved) · #223 open
- **F093** (approved) · #252 open, #215 closed

**Rulings that bind code: 74.** Each names its Issue or scenario, or says it has nothing to build;
the lint fails one that does none of the three — the identity leaks sat eight days with no Issue.

- **Nothing to build** (10), by their own tag: 2026-09-30 Visibility currently defaults to social norms: what people w…; 2026-09-30 We are careful and supportive of our members, and we ask the…; 2026-09-30 The platform comes first, then its members, and every ruling…; 2026-09-30 Between members, we currently show a display name and avatar…; 2026-09-27 When a newer decision contradicts an older one, the newer on…; 2026-09-27 Cross-cutting documents are generated from inline markers, n…; 2026-09-27 Grep-built, never hand-kept: a fact lives inline where it is…; 2026-09-27 An open question is an inline marker where it was raised, no…; 2026-09-21 [guard-proves-itself] is the sixth process absolute: a check…; 2026-09-21 plainlanguage.gov governs user-facing copy, alongside voice.…

## What this run could not verify

- **The 18 drafts.** Status alone does not say which are waiting
  on Don and which are simply unfinished.

