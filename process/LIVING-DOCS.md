# Living documents — the patterns

This repo is read and written by agents, not maintained by people. **A fact lives inline at the one place it is true; anything that spans the project is generated from markers when asked; authored documents are pruned; git holds the history.** Each pattern below names the failure it answers. A pattern whose problem has stopped happening is a candidate for deletion.

**Shared by all of them.** Markers are checked by `python3 scripts/markers.py lint`, run from `scripts/lint.sh`, which first proves the checker rejects every bad fixture in `scripts/fixtures/markers/` — a marker without a lint is decoration ([guard-proves-itself]). A generated file says in its header that it is generated, and the lint fails if it does not or if it has drifted from its sources. **Out of scope by design:** a marker that restates what a filename or directory already encodes (it has nothing to check), and a generated document nobody has a reason to read (it has nobody to be right for). Adding a marker kind: name who asks the question it answers, then its grammar in `markers.py`, a bad and a good fixture, and the lint seen failing.

### Generated on demand
- **Problem.** Don kept asking questions that span the project, and each answer was a fresh sweep of issues, scenarios and decisions. The one kept answer, `WHERE-IT-IS.md` (built by hand 2026-09-15), described itself as stale the moment anything merged.
- **Does.** `markers.py` scans and prints the answer. A result is committed only when something must read it without running a script: `STATUS.md` for Don on a phone, `constraints/` for an agent at session start.
- **Not when.** The answer is judgement, not facts: `ROADMAP.md`'s sequencing, a lesson.

### Prune, don't annotate
- **Problem.** Documents grew and never shrank. `DECISIONS.md` kept the 2026-09-22 no-count ruling beside the 2026-09-23 ruling reversing it, "kept rather than struck"; F093 carried a section restating the F059 clause it overrode; superseded scenarios sat beside the one that absorbed them. A reader had to work out which half was current.
- **Does.** The superseded entry, clause, scenario or note is deleted. Its replacement names it in one `[replaces …]` tag, enough for `git log -S`. Reasoning that still matters moves forward; reasoning that only explained the old position goes with it.
- **Not when.** The document is a record whose point is sequence: `LESSONS.md`.

### Newer decision wins
- **Problem.** Conflicting rulings stalled work. `socialus-web` #220 asked Don to confirm a 2026-09-14 ruling over a 2026-09-13 one; he named it on 2026-09-27 as something he hits repeatedly.
- **Does.** `[newer-decision-wins]`: the newer ruling wins and work continues. Because superseded text is pruned and `constraints/` is generated from live rulings only, an agent never sees the conflict.
- **Not when.** Two *live* rulings conflict and neither replaces the other. That is the one case for Don, as an open-question marker, never a blocking message.

### Guard coverage
- **Problem.** Checks passed while inert: the migration preflight parser, `migrations (check)`, `issue-lint`, and on 2026-09-27 this repo's own open-question lint (`pipefail` swallowed its failure). Separately, F093 required every criterion be discharged by a check seen failing, and nothing could say which check discharged which.
- **Does.** `[guards F093.4]` on the check; `markers.py coverage` maps criteria to checks, and `STATUS.md` names the unclaimed ones. F093 criteria 8, 10, 11 and 12 are visible as unclaimed, not assumed.
- **Partial is a state, not a rounding.** The map first knew only claimed or not, so a check covering half a criterion read as covering it: F093's checks prove the withheld card's photo, name and count at the database, and nothing checks its copy, its call to sign in, or the Page an anchor lands on. `[guards F093.4 partial: what it leaves unchecked]` says so on the check. A criterion is **covered** only when one check claims all of it; partial claims never add up to covered, because nobody checks that the halves meet.
- **An unmarked scenario is unverified, not verified.** 21 of 22 approved and building scenarios had no marked check on 2026-09-29, and the map said nothing about them, so a contradiction in any of them could not surface. `STATUS.md` now states that count at the top. Silence about a scenario is not evidence it holds.
- **Not when.** The check has never been seen failing. Marking it claims a guard that does not exist.

### Expiring risks
- **Problem.** Accepted risks were accepted and forgotten. Entries carried `review_by` dates of 2026-10-16 and 2026-11-30, and nothing enforced them; `risks-due.sh` spoke only when someone ran it.
- **Does.** Every `accepted-risks/*.json` has an `owner` and a `review_by`. The lint fails the day a date passes: argue it again with a new dated line and date, or delete the entry.
- **Not when.** The finding is fixed rather than accepted, or refused for good. A permanent refusal is a ruling, not a risk.

### Per-tier constraints
- **Problem.** Ratified decisions did not reach the agents they bound. F076 criterion 2 forbade a pre-filled home since 2026-09-14, and the code kept `DEFAULT_HOME_PLACE_ID`, setting every member's home unseen (#205). The ruling was right; the tier it bound never read it.
- **Does.** Each ruling ends with `[binds tiers=<planning,code|none> surfaces=…]`. `constraints/<tier>.md` is generated from the tags, the lint fails when it is stale, and each tier's `CLAUDE.md` points at its own file and no other. The firewall stays in which files an agent reads.
- **Not when.** Rulings before 2026-09-21 are untagged; absent from a constraints file is not the same as not binding. Planning still reads `DECISIONS.md` whole, since it writes it.

### Gating claims
- **Problem.** Five approved scenarios gating launch — F077, F078, F080, F081, F082 — had no Issue until #219–#223 on 2026-09-26, found only because someone went looking. `ROADMAP.md` said they gated launch in prose, and nothing checked it.
- **Does.** `gates: launch` in the scenario's frontmatter. `markers.py gating` lists each gating scenario against the Issues naming it, in `STATUS.md`, and flags an approved one with none. The lint checks the field's value.
- **A ruling that binds code gates the code too.** The 2026-09-21 identity-leak ruling bound code and sat eight days with no Issue, because the gating check read scenarios only. Now a ruling whose `[binds …]` names `code` must name its Issue (`#N`) or its scenario (`F###`), or carry `build=none` when it governs how code agents work and there is nothing to build. Anything else fails the lint. On 2026-09-29 eleven failed; the identity leaks became #240, four others named the Issues that built them, and six are conduct rules marked `build=none`. `STATUS.md` lists the `build=none` ones, so the escape hatch stays visible.
- **Not when.** A draft. It is expected to have no Issue yet.

### Open questions inline
- **Problem.** Open questions lived wherever they were raised. F080's detection question stood in `DECISIONS.md` § Open, in F080 and in #221 at once; F071 routed its questions to `DECISIONS.md` because the scenario format had no room; others lived only in chat. Nothing reviewed them.
- **Does.** `[open-question owner=… raised=…]` in the file the answer will change, indexed in `STATUS.md`, oldest first. Placement and closing rules: `process/PIPELINE.md` § Open questions.
- **Not when.** You will answer it this session. Answer it.

### Status backed by code
- **Problem.** Four scenarios claimed `building` and nothing checked it. F069 had no commit, file or branch naming it.
- **Does.** `markers.py building` counts what names each one in `socialus-web`, in `STATUS.md`. It is a report, not a lint: what a false claim means is a status decision.
- **Not when.** Draft and approved scenarios make no claim about code.

### Evidence behind a change — marker defined, view deferred
- **Problem.** Not yet observed. After launch, *what has member feedback actually changed* would otherwise be reconstructed from git. Named now so the first real instance has a shape.
- **Does.** `[evidence YYYY-MM-DD from=<source>: what was seen]` on a ruling a member's action or words changed. The lint checks its shape and never requires it. The view is deferred until there is something to scan: the lint fails the day the first tag lands, telling whoever added it to build the view.
- **Not when.** A judgement call, which is every ruling before launch and most after. **An empty evidence field on every decision is the failure this rules out.**

### Platform readiness
- **Problem.** Taking the app to the App Store and Google Play needs a view of what each screen and capability needs from a native platform. Don asked for an iOS view, then asked whether Android needs a second one. **Two hand-kept inventories would be the accumulation problem this file exists to stop:** each would drift from the code and from each other, and every new scenario would have to be remembered twice.
- **Does.** One marker, `[platform <need>[=<topic>][ gap]: what and why]`, on the spine entry, scenario or ruling where the fact is true. The needs are push, link, camera, photos, location, background, auth, key and store; store names one review topic: account-deletion, sign-in, ugc, age-rating, privacy or payments. `gap` means a native build or a review needs this and the code does not have it. `markers.py platform` writes `PLATFORM-IOS.md` and `PLATFORM-ANDROID.md` from the same markers. The platforms differ only in one table in `markers.py`, which says what each need costs on each. A store topic nobody has marked shows as **not assessed**, never as fine. The lint fails when either view is stale.
- **The key rulings travel.** The withheld-announcements design (F093) and the identity-leak ruling both assume a web client that ships a publishable key. A native app ships the same key, so both apply unchanged. Each carries `[platform key: …]` and heads both views.
- **Who marks it.** A scenario approved from 2026-09-29 on carries at least one platform marker, or `[platform none]`, and the lint fails one that does not. When sync deletes a shipped scenario, its markers move to the spine entry for what shipped. Scenarios are deleted, so a need recorded only on one would go with it.
- **Deferred: a skill that reviews each scenario or ticket and adds markers.** Don's idea, and he is not building it now. Assessed on 2026-09-29. The durable part is not a skill. The need is best known when the scenario is written, so the marker belongs to its author, and the lint above makes that the default without anyone remembering. A skill running over tickets would mark after the fact, and a skill fires only when someone invokes it (lessons 15 and 27). One part does want a skill: a **one-off retro-scan** of the 22 approved and building scenarios written before the rule, which both views count as not assessed. The scenarios alone are not enough for that scan. Some needs live only in code (the auth redirect, the storage path), so it would read `socialus-web` as well. **Build it when** a native build is scheduled: a ruling or a scenario commits to shipping to a store. Until then a hand pass per scenario as it is next touched is cheaper, and the count shows what is left.
- **Not when.** Anything the web app does identically on a phone. The marker records what differs natively, not the web app again.

**Considered, not built: deviation markers in code.** A PR that differs from its scenario stops and asks; a marker would give the divergence somewhere to live instead.

## Hooks — what actually fires

**Be honest about which get skipped.**

| Hook | Reliable? | Verdict |
|---|---|---|
| **GitHub Action on PR to `socialus-web`** | **Yes.** Runs on every PR regardless of who opens it or what they have installed. | **Use this.** It is the only one that cannot be skipped. |
| **GitHub Action on push to `main`** | **Yes**, same reasoning. Both repos have remotes. | Use for regenerating facts after a merge. |
| **Local `post-merge` hook** | **No.** A squash-merge through the GitHub UI never touches anyone's machine, so it would not have fired for a single merge this week. | Do not build. |
| **Local `pre-commit`** | **Weak.** `core.hooksPath` can be committed, but every clone must opt in and `--no-verify` skips it. | Only as a fast local echo of a check CI already enforces. |
| **Scheduled Action** | Yes. | Allowed when it commits only if the content moved, so a new revision always means something changed. |

**The important design point: the reliable hook is not "regenerate the doc." It is "fail the PR when a document's claim has become false."** That is the pattern this repo has already learned works — the person-noun lint, the migration drift check, `advisor-diff.sh`. A generated document nobody believes is safe; a check that blocks a merge is what actually holds a rule.

**Concretely, two CI checks worth having**, in order of value:

1. **Doc-claim check on PR.** If a PR closes an issue that a living document still lists as *to build*, fail with the line number. Cheap, and it would have caught the F076 drift the day it happened.
2. **String check on PR** — person-nouns, em dashes, "corner", corporate transitions. Already specified in `nouns.md`; unbuilt.
