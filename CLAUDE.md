# SocialUs — planning repo

Local discovery app: buy, sell, trade, gather. Launching 2026-10-30 to one metro. App code lives in the sibling repo `socialus-web` (Vercel deploy on push to main; Supabase project `socialus-db`). This repo is planning only.

## Read first, every session

1. `STATUS.md` — what is true now. One screen. **Generated, never hand-edited** — see *Generated files* below.
2. `ROADMAP.md` — Now / Next / Later / Won't.
3. `process/ABSOLUTES.md` and `product/ABSOLUTES.md` — the six absolutes, four process and two product. The four-harms test and the rule that admits a seventh are stated once, in the process file. Cite an absolute by its slug in brackets (`[public-is-draft]`), never by number. Everything else is a guideline; break one if you can say why.
4. `process/PIPELINE.md` — the five kinds of work and how each moves.
5. `constraints/planning.md` — every ratified decision that binds this tier, one line each. Generated from the `[binds …]` tags in `DECISIONS.md`; never edit it.

## Where truth lives

- **How the system works:** the code in `socialus-web`. If the code can answer it, read the code, don't write it down.
- **Why it is that way:** `DECISIONS.md`. One dated line per ruling. Append, never edit.
- **What is decided but not built:** `planning/` scenarios with `status: approved`, and `ROADMAP.md`.
- **Anything that spans the project** — open questions, which check guards which criterion, which ruling binds which tier, which risk is due — **is generated from inline markers, never maintained.** The pattern, and what it refuses: `process/LIVING-DOCS.md` § Grep-built, never hand-kept.
- **What is not yet decided:** an `[open-question owner=… raised=…]` marker, inline where the question was raised — in the file its answer will change. Never a list: the index is `STATUS.md` § Open questions, generated. Grammar, placement and what closes one: `process/PIPELINE.md` § Open questions; `scripts/lint.sh` enforces it.
- **What might be built someday:** `IMAGINE.md`. Nothing there is a commitment. Scenarios may not cite it.
- **What the product is:** `product/foundation/model.md` — Don's own statement of the model. Every other product document answers to it; where one disagrees, the other is the thing to fix.
- **The product model:** `product/` — nouns, verbs, surfaces, systems. Must match the code and `model.md`. If it doesn't, fix the doc in the same session you notice.
- **What may never be broken:** `process/ABSOLUTES.md` (process) and `product/ABSOLUTES.md` (member-facing). Two files, one test — the test lives in the process file.
- **How work moves, and what went wrong before:** `process/` — `PIPELINE.md` (the five kinds), `LESSONS.md` (append-only), `LIVING-DOCS.md` (the design note behind the generated docs), `ABSOLUTES.md`, and `SETUP.md` (standing up a second machine; read once per machine, never per session).

**A concept lives in exactly one place.** Two documents describing the same thing is how this repo has failed before, so routing it is a rule, not a preference:

- **`product/` — nouns, verbs, surfaces — is the spine.** Every entry carries its own status, so one line holds both horizons: *"responses: thumbs up now, four states later."* **The future version of a thing is a status on its existing entry, never a second description somewhere else.**
- **`IMAGINE.md` is a waiting room, not a parallel library.** It holds only ideas that do not yet have a noun, a verb, or a surface.
- **When an idea acquires one, it moves into the spine and leaves `IMAGINE.md`.** Entries move out. They are never copied out — a copy is two descriptions, which is the thing this rule exists to prevent.

**`product/systems/` is depth, not a competing status.** Systems docs describe *how* a concept works. **They never state whether it ships.** The spine owns status; systems own detail. That is why they are not a fourth tracking layer and why the one-place rule does not make them redundant — they are not a second answer to the same question, they are the answer to a different one. A systems doc that starts declaring what ships has drifted, and the fix is to move that sentence to the spine, not to delete the doc.

**The test: does it have a shape — a noun, a verb, or a surface? Then the spine. If not, `IMAGINE.md`.** Worked example: *responses* have a noun and a verb, so the eventual four-state design is a status line on the response entry in `nouns.md`. *The Ticketmaster thesis* has none of the three — it is a claim about a market, not a shape — so it stays in `IMAGINE.md` until something about the product gives it one.

If a directory isn't listed here, don't read it. Anything not in the tree is not current — git history is the archive (`git log`, tag `archive-2026-09`).

## Generated files

`STATUS.md`, `README.md` and `constraints/` are written by scripts and **committed by a workflow, not by a person**. A hand-edit to either is lost on the next run.

| File | Written by | Runs |
|---|---|---|
| `STATUS.md` | `scripts/status.sh`, wrapping `scripts/state.sh` and `scripts/markers.py` | `.github/workflows/status.yml` — push to `main`, daily 13:05 UTC, and *Actions → status → Run workflow*, which works from a phone |
| `README.md` | `scripts/view.sh` | the same workflow |
| `constraints/planning.md`, `constraints/code.md` | `python3 scripts/markers.py constraints` | by hand after a `DECISIONS.md` change — `scripts/lint.sh` fails until it is run |

**Nothing here asks you to remember to run anything.** A skill for this was written and never installed, so it never ran once and `STATUS.md` went stale naming the wrong launch blocker — the whole point is that the refresh does not depend on anyone thinking of it (lesson 27, and lesson 15 before it). To refresh by hand anyway: `bash scripts/status.sh`.

**Reading the code repo needs a token.** Both repos are private, so the workflow cannot see `socialus-web` without the `SOCIALUS_WEB_TOKEN` secret. Without it `STATUS.md` still regenerates and says, at the top and at the bottom, exactly what is missing.

## State

- A scenario's state is its frontmatter `status`: `draft` → `approved` → `building`. Shipped scenarios are deleted at sync.
- A ticket's state is its Issue label in `socialus-web`. Tickets never live here.
- What is approved for build is the scenario frontmatter (`status: approved`) plus the Issues in `socialus-web`. There is no separate bridge document — one existed, restated both sources, and went wrong.

## Who does what

| Who | Owns | Never |
|---|---|---|
| Don | rulings, judgment, domain knowledge — may open Issues in `socialus-web` directly | reads more than STATUS + ROADMAP unless he asks |
| Cowork — `plan` `review` `sync` `trim` | this repo: scenarios, STATUS, ROADMAP, DECISIONS, `product/`; may open Issues in `socialus-web` | commits code to `socialus-web`; hand-edits `README.md` |
| Code — `ticket` `build` | `socialus-web`: architecture notes, issues, code, PRs; branches, PRs and merges here too | writes scenarios, STATUS, ROADMAP or rulings here |

Code is the architect. Any ticket touching schema, RLS, or routes starts with a ≤20-line architecture note in the Issue. Cowork reviews it in a comment. Don sees it only if they disagree.

## How to talk to Don

- Bullets, one line each. No preamble, no recap, no narration.
- Name things in plain words; a number in brackets after, if useful.
- Questions reach him as A/B/C with one-line trade-offs and a recommendation. Ask only when a fact only he has is missing, or the call affects the deadline.
- Reports open: `Status: Done | Blocked | Question — one sentence. Next: the ask.` Detail on "expand".
- Email is not the best route to reach him — in-app is better; faster channels are TBD.
- End with the next action, not a summary.

## Commits

- Cowork commits and pushes its own doc changes here. Message: `docs: what`.
- Code commits in `socialus-web`, branch per ticket. Who merges and when Don looks: `process/PIPELINE.md` § Who checks what. A merge to main there deploys to production.
- Anything bigger than a doc touch-up goes by branch and PR here. **Whoever does the work merges it, Code or Cowork** — self-merge is fine, and needs no approval and no second reviewer.
- Never cross-commit (guideline — the two-repo split enforces it). Never rewrite history ([production-asks-don]).

## Sessions

Two sessions in one working tree collide (lesson 9). Two rules, both cheap:

- **Every session's cwd is its own worktree — never the repo root.** The one-session-per-cwd guard keys on cwd, so a repo root shared by two sessions wedges both. This holds for read-only sessions too: reading is what takes the lock.
- **Worktrees live beside the repo, not inside it:** `../worktrees/{repo}/{branch}`. Inside the checkout, dozens of them make `.gitignore` load-bearing, bloat every tree walk, and leave stale metadata behind a crashed session (`git worktree prune`). Outside, the repo stays one repo.
- **A session that isn't committing uses `git --no-optional-locks status`.** Plain `git status` writes `.git/index.lock` to refresh the index, and a sandboxed session can't always unlink it afterwards — the next session then finds a stale lock. The flag skips the write.

## Naming

Schema names are durable; UI labels translate them. The table is in `product/foundation/nouns.md`. Language is pro-competition, for all Americans — see `product/foundation/what-this-is.md`.

- **Issue title:** `F060 · T142 · plain name`. Bugs/changes/chores: `bug · plain name` (or `change ·`, `chore ·`), with `Scenario: F###|none` in the body.
- **Branch:** `f060-t142-slug`. **Commit:** `F060/T142: what`.
- **Bugs/changes/chores carry the Issue number, not a ticket number** — they have no `T###`. Branch `bug-36-slug`, commit `bug #36: what` (likewise `change-`/`chore-`). Process work has no Issue (`process/PIPELINE.md`), so it dates instead: branch `process-YYYY-MM-DD-slug`, commit `docs: what`. Every branch name carries something unique that needs no central counter — dozens of agents must be able to name a branch without asking anything.
- **Provenance is git:** `git log --grep F060` is everything built for that scenario.
- **No hand-maintained indexes.** A file a person reads to find out what is true goes stale between the moment it is written and the moment it is read, and then it lies — REGISTRY, MAP, TRACE, STAGE-LEDGER and JOURNAL all died of this (lesson 2). The test is *who reads it to be right*, not what format it is in: a file only a script compares is fine, because nothing believes it and drift shows up as diff noise on the next run. `accepted-risks/` is that — generated from advisor exports, read by `scripts/advisor-diff.sh`, never consulted to settle a question. `DECISIONS.md` settles questions.
