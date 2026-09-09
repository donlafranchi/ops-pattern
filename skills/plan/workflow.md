# plan — workflow

1. Read `STATUS.md`, `ROADMAP.md`, `RULES.md`. Skim `planning/*.md` frontmatter (`status:`) for what's draft/approved/building.
2. If the session is research-shaped (a new problem, a system that needs a spec): read the relevant `product/` files, write or update the spec. If it's speculative, a few lines in `IMAGINE.md` instead — never a scenario.
3. If the session is scoping-shaped: write `planning/scenario-F###-{slug}.md`, frontmatter `status: draft`. Apply the 5 Deadly Sins filter (scope creep, gold plating, missing requirements, unrealistic timeline, poor communication) before Don sees it.
4. If a decision needs Don: state it as A/B/C, one line of tradeoff each, a recommendation. On his answer, append a dated line to `DECISIONS.md` — never edit a prior line; a reversal says what it replaces.
5. On approval, flip the scenario's `status: approved`, add its one-line entry to `HANDOFF.md`.
6. Update `STATUS.md` (overwrite, one screen) and `ROADMAP.md` (Now/Next/Later/Won't) if either changed.
7. Report per CLAUDE.md § How to talk to Don. `Status: Done|Blocked|Question — one sentence. Next: the ask.`
