# sync — workflow

1. Pull the current Issue list and labels from `socialus-web` (`gh issue list -R donlafranchi/socialus-web --state all`).
2. **Retire shipped scenarios.** For each `planning/scenario-F###.md`, search every Issue on its F-number (`gh issue list --state all --search "F060"`). All closed → `git rm` the scenario file. **That file and nothing else** — there is no review file any more; `review` writes its verdict into the scenario's own frontmatter. Nothing is archived in-tree: git holds it (tag `archive-2026-09` plus every commit since). Any Issue still open → leave the scenario alone.
3. Rewrite `STATUS.md` from scratch against current reality — one screen, overwritten, never appended to.
4. Update `ROADMAP.md` (Now / Next / Later / Won't) and `HANDOFF.md` (approved-for-build list) to match.
5. **Run `scripts/view.sh`.** Mandatory whenever this session touched a scenario file or `ROADMAP.md`. It regenerates `README.md` from data:

   | README section | Source |
   |---|---|
   | Built | F-numbers whose Issues are all closed |
   | Building | F-numbers with an open Issue, not labeled `deferred` |
   | Next / Later | the matching sections of `ROADMAP.md` |
   | Deferred | F-numbers on an Issue labeled `deferred` |

   `README.md` is never hand-edited. A wrong README means a wrong Issue label, a wrong Issue title, or a wrong `ROADMAP.md` — fix the source and re-run. An Issue titled with an invented F-number shows up here as a phantom scenario; send it back to `ticket`.
6. **Sprawl sweep.** Every root `.md` is one of the nine in `CLAUDE.md`'s target tree (plus generated `README.md`); every `planning/*.md` has a `status:` field; no markdown link points at a path that doesn't exist. Fix, or flag the judgment calls to Don.
7. **Docs, not files.** `product/` docs that have drifted long, or that describe a table, column, route, or RLS policy, are out of scope here — that's a `trim` sweep. Name it in the report; don't improvise a trim inside `sync`.
8. Run `scripts/lint.sh`. Fix what it flags, or report the flag to Don if it's a judgment call.
9. Report per CLAUDE.md § How to talk to Don.
