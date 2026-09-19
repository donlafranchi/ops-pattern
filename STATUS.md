# STATUS

> ## Generated 2026-09-19 · 18:05 UTC
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
> **Derived from this repo only** — `accepted-risks/*.json`,
> `planning/scenario-*.md` frontmatter and `ROADMAP.md`. Everything about
> the code repo is missing from this run; see the last section.
>
> **Answers "where is this project", not "what tickets exist."** The ticket
> list is `gh issue list`, which is always right; this is not a copy of it.

Launch **2026-10-30**, one metro. 41 days out.

## Scenarios, by status

| approved | building | draft | deferred | superseded |
|---|---|---|---|---|
| 13 | 4 | 19 | 1 | 1 |

**Building:**
- F060 (Someone starts something without opening a shop)
- F061 (Someone creates a Page worth showing people)
- F069 (A non-business Page resolves everywhere, and holding several is ordinary)
- F070 (Every Page has a face, even without a photo)

**`building` is frontmatter, not evidence** — nothing checks it against a
branch or a commit.

## Deferred on purpose — and therefore easy to forget

Ruled acceptable with a condition for looking again. The ruling itself is a
dated line in `DECISIONS.md`; the register is `accepted-risks/`.

- **observability: no error tracking in production** — review by 2026-10-16
  - If forgotten: A runtime error for a real member is invisible. Nobody is paged, nothing is logged where anyone looks, and the first signal is a person giving up and not saying why. The DATABASE_URL outage went four months unnoticed for exactly this reason.
  - Look again if: ANY of: a member outside the team signs up; a bug is reported that nobody can reproduce; or 2026-10-16 passes with this still open.
- **ci: playwright suite exists but no workflow runs it** — review by 2026-10-16
  - If forgotten: The end-to-end tests rot. Nobody runs them, they drift from the app, and the day someone needs them they no longer pass for reasons unrelated to the bug being chased — at which point they get deleted instead of fixed.
  - Look again if: ANY of: a regression reaches production that a browser test would have caught; the Playwright suite fails to run locally when someone next tries it; or 2026-10-16 passes with this still open.
- **storage: removed photo bytes stay fetchable by direct URL** — review by 2026-10-16
  - If forgotten: A photo the operator removed stays downloadable, indefinitely, by anyone who has or can guess its storage URL. For ordinary bad content that is tolerable. For illegal content it is not, and 'we kept it so it could be reversed' is not a defensible answer to a regulator, a police request, or the person in the photo.
  - Look again if: ANY of: the first report of illegal content reaches the review queue; a member asks for their own photo to be actually deleted rather than taken down; a takedown demand arrives from outside the platform; or 2026-10-16 passes (two weeks before launch) with this still open.
- **data: two rows in public.places share the slug 'sacramento'** — review by 2026-11-30
  - If forgotten: A scoped link resolves to the wrong geography and nobody notices, because both answers look plausible. The heuristic makes it deterministic and therefore silent.
  - Look again if: ANY of: a member reports results from the wrong area; a third row appears with the same slug; the Browse query rewrite (T156) starts reading places by slug; or 2026-11-30 passes.
- **schema: reports.reviewed_at/reviewed_by_member_id/outcome duplicate report_decisions** — review by 2026-11-30
  - If forgotten: Two sources of truth drift. A write path that updates the decisions log and forgets the projection leaves a report invisible in the queue or double-counted against a reporter's cap, and the bug looks like a UI fault rather than a schema one.
  - Look again if: ANY of: a third writer of report_decisions appears; delegated reviewers land (more writers, more chances to drift); the queue shows a report whose status disagrees with its history; or 2026-11-30 passes.

## Waiting on Don

Carried from the previous STATUS and **not re-verified by this run** — no
source in this repo proves these are still open.

- **Promise 1** — what "surplus goes back to the community" means. Three
  options in `DECISIONS.md`; the promise stays out of user-facing copy until
  one is picked.
- **The six-step Page composer**, judged as a set rather than step by step.
- **The ontology spike** — paused 2026-09-16 before any code, on two questions:
  which noun to model, and whether the address rule changes.
  `../socialus-ontology-spike/INTENT.md`.

## What this run could not verify

- **Everything about `socialus-web`** — open issues, merges, the ontology
  registry and CI's last word. No `socialus-web` checkout was available to this run.
- **Everything in the Waiting-on-Don list**, as stated there.
- **Whether any scenario marked `building` is actually in progress.**
  Frontmatter says `building`; nothing checks it against branches or commits.
- **The 19 drafts.** Status alone does not say which are waiting
  on Don and which are simply unfinished.

