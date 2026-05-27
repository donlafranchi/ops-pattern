# Hand-off to Claude Code

Single prompt to paste into a Claude Code session in `/Users/don/Projects/community/`. Does the mechanical directory work + a residual-name cleanup pass.

---

## The prompt

```
Read these three docs first so you understand the consolidation:
  _inbox/cowork-pipeline/README.md
  _inbox/cowork-pipeline/DEV-PATTERN.md
  _inbox/cowork-pipeline/DECISION-PATTERNS.md

Then read the just-updated AGENTS.md and CLAUDE.md to see the new
skill names referenced from the source-of-truth docs.

Your task is the mechanical consolidation. Do not invent new structure;
follow the merge map in README.md exactly.

==== Phase 1 — directory renames ====

In skills/, perform these renames (use `git mv` so history follows):

  pipeline-router            → orient
  pipeline-product           → explore
  pipeline-plan              → scope
  pipeline-review            → review
  pipeline-adr               → memo
  pipeline-ticket            → ticket
  pipeline-eval              → test
  pipeline-build             → build
  pipeline-scaffold          → scaffold

==== Phase 2 — merges (four → one, then three → one, then two folded into orient) ====

Create skills/weigh/ as the merged decision-discipline skill:
  - Source skills: pipeline-intent-check, pipeline-ratify-absolute,
    pipeline-member-advocate, pipeline-platform-advocate
  - The new SKILL.md describes weigh's trigger surface
    (combined from all four). See README.md table entry for the
    one question it forces.
  - workflow.md preserves the four sub-routines as explicit steps:
    scan → dialectic → ratify → stamp.
  - Apply the close-call lexicographic rule from DECISION-PATTERNS.md
    (member safety → platform health → data protection → mutual benefit
    with reversibility). Replaces the prior "Gate 1 platform survival
    → maximize net member benefit" framing.
  - After weigh/ exists and passes a sanity read, archive the four
    source dirs under _attic/2026-05-26/skills/.

Create skills/tidy/ as the merged housekeeping skill:
  - Source skills: doc-home-finder, doc-housekeeping, skills-housekeeping
  - SKILL.md describes the three modes (triage-inbox, sweep-docs,
    sweep-skills) and their triggers.
  - workflow.md sequences the three modes; each mode is a sub-routine
    callable independently.
  - Archive the three source dirs under _attic/2026-05-26/skills/.

Fold pipeline-prune and pipeline-bundle-resync into orient/:
  - orient's workflow.md gains two new steps:
    "prune JOURNAL if heavy" and "resync work-map if sub-bundle closed".
  - Each new step references the source workflow's logic verbatim where
    that logic is still correct.
  - Archive both source dirs under _attic/2026-05-26/skills/.

==== Phase 3 — install.sh ====

Update install.sh to reference the new directory names. The for-loop
that globs pipeline-*/, doc-*/, etc. needs updating since the
"pipeline-" prefix is gone. New globs:

  for skill in "$SKILLS_SRC"/orient/ "$SKILLS_SRC"/explore/ \
               "$SKILLS_SRC"/scope/ "$SKILLS_SRC"/weigh/ \
               "$SKILLS_SRC"/review/ "$SKILLS_SRC"/memo/ \
               "$SKILLS_SRC"/ticket/ "$SKILLS_SRC"/test/ \
               "$SKILLS_SRC"/build/ "$SKILLS_SRC"/tidy/ \
               "$SKILLS_SRC"/scaffold/ "$SKILLS_SRC"/loop-designer/; do

Run ./install.sh after the update and confirm every new name appears in
~/.claude/skills/ as a symlink. Old symlinks (pipeline-router, etc.)
should be removed manually after the new ones land.

==== Phase 4 — residual-name cleanup ====

Grep the repo for any remaining old skill names. CLAUDE.md and AGENTS.md
have already been hand-edited in the high-leverage sections, but
secondary references may remain:

  rg -l 'pipeline-(router|product|plan|review|adr|ticket|eval|build|intent-check|ratify-absolute|member-advocate|platform-advocate|prune|bundle-resync|scaffold)' \
    --glob '!_attic/**' --glob '!_inbox/cowork-pipeline/**'

For each match, apply the rename map from Phase 1+2. Use sed where the
match is clearly mechanical; read the surrounding paragraph if the
match is structural (e.g., a workflow rule that needs human judgment).

Also grep for doc-home-finder, doc-housekeeping, skills-housekeeping
and replace with `tidy` per the same rule.

==== Phase 5 — verification ====

Before commit:
  1. Run `ls ~/.claude/skills/ | grep -E '^(orient|explore|scope|weigh|review|memo|ticket|test|build|tidy|scaffold|loop-designer)$'`
     — should list all 12.
  2. Run `ls ~/.claude/skills/ | grep '^pipeline-'` — should be empty
     (old names removed).
  3. Open a fresh Claude Code session and type "what's the state of
     this project". The `orient` skill should auto-fire (not
     pipeline-router).
  4. Open AGENTS.md and confirm it reads cleanly with the new names.

==== Phase 6 — commit ====

Ask PM permission before each commit. Suggested sequence:

  Commit 1: parent repo
    docs(pipeline): consolidate 19 skill dirs into 12
    (files: AGENTS.md, CLAUDE.md, skills/*, _attic/2026-05-26/skills/*,
     install.sh)

  Commit 2 (optional, separate for clarity):
    docs(pipeline): residual rename pass — old names removed from
    secondary refs
    (only if Phase 4 produced edits to many files; otherwise fold
    into Commit 1)

Format reminder: T### prefix not used for these (no ticket); use
docs(pipeline): for the message.

==== Stop conditions ====

Stop and escalate to PM if:
  - Any skill's workflow.md contains decision-rule language that
    contradicts DECISION-PATTERNS.md (member safety → platform
    health → data protection → mutual benefit reversible).
    Don't auto-fix; surface the conflict.
  - A grep match in Phase 4 is in a JOURNAL.md or DEVIATIONS.md
    entry that is historical record (don't rewrite history).
    Leave those as-is and note the file paths in your final report.
  - install.sh fails to symlink any new skill. Surface the error;
    do not partial-deploy.

Final report back to PM should list:
  - Files renamed
  - Files merged + archived
  - Residual-name files touched
  - install.sh verification output
  - Any escalations
```

---

## After Claude Code reports done

1. Open a new Cowork session, type "what's the state of this project," and verify `orient` runs (not `pipeline-router`).
2. Pick the next F-scenario in `planning/scenarios-backlog/` and walk one full cycle: `orient` → `scope` → `weigh` (if close) → `review` → `memo` (if cross-cutting) → handoff → `ticket` + `test` → `build` → commit → `tidy`. If any stage doesn't behave as DEV-PATTERN says it should, file an entry in the anti-patterns log.
3. Once the cycle proves clean, lift `_inbox/cowork-pipeline/` + the consolidated `skills/` + `install.sh` into a new GitHub repo (`cowork-pipeline` or whatever you name it). Push. Drop `_inbox/cowork-pipeline/` from this repo afterward.
