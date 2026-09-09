# sync — workflow

1. Pull the current Issue list and labels from `socialus-web` (`gh issue list -R donlafranchi/socialus-web`).
2. For each `planning/scenario-F###-*.md` with `status: building`: if every Issue tied to it is `shipped`, delete the scenario and its review — the tag `archive-2026-09` plus every commit since holds the history. If any Issue is still open, leave it.
3. Rewrite `STATUS.md` from scratch against current reality — one screen, overwritten, never appended to.
4. Update `ROADMAP.md` (Now/Next/Later/Won't) and `HANDOFF.md` (approved-for-build list) to match.
5. Check every root `.md` file is one of the eight named in `CLAUDE.md`'s target tree; check every `planning/*.md` has a `status:` field; grep for markdown links pointing at paths that don't exist.
6. Run `scripts/lint.sh`. Fix what it flags, or report the flag to Don if it's a judgment call.
7. Report per CLAUDE.md § How to talk to Don.
