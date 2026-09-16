# STATUS

> ## Generated 2026-09-16 · 21:55 UTC
>
> **Disposable. Regenerating replaces this file wholesale** — nothing here is
> hand-maintained, and a hand-edit is lost on the next run. `git log -p
> STATUS.md` is the history. Ask for **`status`** to refresh it.
>
> **Derived from:** `scripts/state.sh` against `socialus-web` @ `origin/main`
> `ed2200d` (2026-09-16) — open issues, PRs merged in the last 14 days, and
> tickets whose numbers appear on main; `planning/scenario-*.md` frontmatter;
> `ROADMAP.md`; the newest lines of `DECISIONS.md`.
>
> **Answers "where is this project", not "what tickets exist."** The ticket
> list is `gh issue list`, which is always right; this is not a copy of it.

Launch **2026-10-30**, one metro. 44 days out.

## Scenarios, by status

| approved | building | draft | deferred | superseded |
|---|---|---|---|---|
| 13 | 4 | 18 | 1 | 1 |

**Building:** F060 (start something without a shop), F061 (a Page worth showing
people), F069 (a non-business Page resolves everywhere), F070 (every Page has a
face).

**41 issues open** in `socialus-web`, one labelled launch-blocking: **#12 — the
operator reviews a report on their phone.** No photograph goes to production
before it.

## Shipped in the last fortnight

14 PRs merged, the newest six all on 2026-09-16: CI now runs lint, types, build
and the full test suite on every PR (#120); the merge rule is written down and
lives in one place (#117, #118); sign-in follows the browser's host rather than
the canonical one (#116); a Page owner can post (#115); one search finds a
street, a city or a neighbourhood (#113).

## Needs a look — not a claim that anything is wrong

Five issues are open while a commit naming their ticket is already on main. A
commit naming a ticket is not proof the ticket is done; partial work counts.
Each needs a look, not a close: **#51** and **#52** (browse reads Pages; feed
vantage becomes a metro), **#30** (retire vendor routes), **#16** (edit shop),
**#15** (You gains a producer state).

## Waiting on Don

Carried from the previous STATUS and **not re-verified by this run** — no
source in the repo proves these are still open:

- **Promise 1** — what "surplus goes back to the community" means. Three
  options in `DECISIONS.md`; the promise stays out of user-facing copy until
  one is picked.
- **The six-step Page composer**, judged as a set rather than step by step.
- **The ontology spike** — paused 2026-09-16 before any code, on two questions:
  which noun to model, and whether the address rule changes.
  `../socialus-ontology-spike/INTENT.md`.

## What this run could not verify

- **Whether any scenario marked `building` is actually in progress.** Frontmatter
  says `building`; nothing checks it against branches or commits.
- **The 18 drafts.** Status alone does not say which are waiting on Don and
  which are simply unfinished.
- **Anything in the Waiting-on-Don list above**, as stated there.
