---
purpose: Substrate ticket — install the Report Shape rule across pipeline-doc surfaces so every multi-step skill report opens with status + ask, withholds detail until the PM says "expand," and names items in plain English instead of by ID.
layer: how
status: active
---

# T067 — Report shape rule

**Scenario:** substrate
**Binds to:** `CLAUDE.md` § Report shape (new) · `playbooks/DEVELOPMENT-PATTERNS.md` § Pipeline patterns (new entry) · every active `skills/*/workflow.md`
**Repo / branch:** parent / `t67`

## Context

PM session 2026-05-30 surfaced that pipeline-skill reports bury the headline. The BATCH A close-out report led with play-by-play ("Now updating refs. Committing reorg-02."), buried the actual status ("Done, no conflicts, awaiting BATCH B go-ahead") mid-message, and named items by cryptic IDs (`reorg-04`, `reorg-12`) the PM does not remember. The default for every multi-step report is now:

```
Status: Done | Blocked | Question — <plain-English one-sentence summary>
Next: <the ask, or "none" if nothing's pending>
Want detail? Say "expand."
```

Detail (commit hashes, file lists, lane counts, item IDs, per-step trace) is withheld until the PM says "expand." Items are named in English; the ID can follow in parens if it matters. The rule applies to every Cowork or Claude Code response over ~50 words that reports completed work, and to every multi-step pipeline-skill close-out.

## Scope — what changes

**1. Root `CLAUDE.md`.** Add a top-level `## Report shape` section after `## Commit Rules` and before `## Language & Framing`. Contents: the three-line template, the withhold-detail rule, the plain-English-names rule, the drop-narration rule, the "expand" protocol, the rule-of-thumb ("if a fact wouldn't change the user's next move, withhold it"), and the scope ("multi-step reports from any pipeline skill, or any Cowork response over ~50 words reporting completed work").

**2. `playbooks/DEVELOPMENT-PATTERNS.md`.** Add a pattern entry under `## Pipeline patterns`, after "Route work through `_inbox/` → `planning/` kanban → `playbooks/`":

- **Title.** "Default to BLUF reports: status + ask, withhold detail until asked"
- **Decision.** One sentence — what the rule is.
- **Intent.** One paragraph — why play-by-play and ID-heavy reports fail the PM (buried headlines, ID amnesia, signal lost in narration trace).
- **Touches.** `CLAUDE.md` § Report shape + every `skills/*/workflow.md`.

**3. `AGENTS.md`.** Add a one-line reference under the existing "Pipeline patterns" or "Agent-response discipline" section (whichever fits): "Every multi-step report opens with the Report Shape template — see CLAUDE.md § Report shape." No other AGENTS.md changes.

**4. Skill workflows that produce multi-step reports.** Each gets a new `## Final report` section near the end of `workflow.md` (after the existing "Hand off" or "You produced" section) that says:

> Default report shape is three lines: `Status:` line, `Next:` line, `Want detail? Say "expand."` line. Drop running narration ("Now doing X." "Starting Y." "Committing Z."). Name items in plain English; put the ID in parens if it matters. Withhold commit hashes, file lists, lane counts, per-step trace until the PM says "expand." On "expand," return detail in priority order — ask → high-level outcomes → references → notes — stopping at each section for "more."

Apply to these workflows:
- `skills/build/workflow.md` — replace the "You produced" paragraph in § Hand off with the Final Report section. The TDD loop body keeps its narration discipline as before; the rule governs the *final* report only.
- `skills/orient/workflow.md` — append. Orient's drift-check output is a prime offender.
- `skills/tidy/workflow.md` — append.
- `skills/scope/workflow.md` — append.
- `skills/review/workflow.md` — append.
- `skills/weigh/workflow.md` — append.
- `skills/memo/workflow.md` — append.
- `skills/explore/workflow.md` — append.
- `skills/atomize/workflow.md` — append.
- `skills/ticket/workflow.md` — append (ticket-writer's close-out report, not the ticket file itself).
- `skills/test/workflow.md` — append (test-run report only; the spec-write mode keeps its current shape).
- `skills/scaffold/workflow.md` — append.

**5. Skill SKILL.md files.** Not touched. Descriptions stay as-is.

## Acceptance criteria

- Root `CLAUDE.md` contains a `## Report shape` section placed between `## Commit Rules` and `## Language & Framing`. The section names: the three-line template, the withhold-detail rule, the plain-English-names rule, the drop-narration rule, the "expand" protocol, the rule-of-thumb, and the scope.
- `playbooks/DEVELOPMENT-PATTERNS.md` contains a new pattern entry with Decision / Intent / Touches lines, formatted to match the existing entries in § Pipeline patterns.
- `AGENTS.md` contains one cross-reference line to the new CLAUDE.md section.
- Every workflow.md listed in scope item 4 contains a `## Final report` section with the template language.
- `grep -l "Final report" skills/*/workflow.md | wc -l` returns 12 (the count of active skills enumerated above).
- `grep -E "Status: (Done|Blocked|Question)" skills/*/workflow.md` returns at least 12 lines.
- No grep hit for `Now (updating|committing|doing|starting|moving)` in any workflow's instructions-to-the-agent prose (existing examples illustrating *the old wrong way* are allowed only inside fenced code blocks).
- Existing pattern entries, scenarios, ADRs, and unrelated workflow.md content are unchanged.

## Out of scope — do not touch

- `web/` code. This is a pipeline-doc ticket — no schema, no migration, no test changes.
- The retired `_attic/2026-05-26/skills/skills-housekeeping/workflow.md` and `_attic/2026-05-26/skills/doc-housekeeping/workflow.md` that already mention "Status:" — these are archived; leave them.
- Skill `SKILL.md` files. Descriptions are routing surface, not report surface.
- Skill `templates/` subdirectories. The template a skill *emits* keeps its shape; only the skill's own close-out report changes.
- Memo numbering. This is not a reversal — no `memo-NNNN-` file is required.
- The global `~/.claude/CLAUDE.md` and the Cowork user preferences. PM is patching those by hand; not Claude Code's surface.

## Close-out

1. Log a `DEVIATIONS.md` entry — even if "no deviations," one-line Why anchored to "all 12 workflow.md files updated with identical Final Report block; no skill needed custom shape."
2. No evals to run — pipeline-doc only.
3. Lock pre-flight: confirm `.git/index.lock` and `web/.git/worktrees/*/index.lock` are clear before any git step.
4. Produce a commit summary — repo (parent), branch (`t67`), file list, suggested message `T067: install report shape rule` — for the PM to run. Do not `git add` / `git commit`.
5. Stamp `planning/STAGE-LEDGER.md` substrate-table row for T067 to `done`.
6. Spec patch queue: none. This ticket *is* the spec change.

## Completion

**Files changed (16):**
- `CLAUDE.md` — new `## Report shape` section between `## Commit Rules` and `## Language & Framing`.
- `playbooks/DEVELOPMENT-PATTERNS.md` — new pattern entry "Default to BLUF reports: status + ask, withhold detail until asked" under § Pipeline patterns.
- `AGENTS.md` — one cross-reference line in the intro block.
- `skills/atomize/workflow.md`, `skills/build/workflow.md` (replace), `skills/explore/workflow.md`, `skills/memo/workflow.md`, `skills/orient/workflow.md`, `skills/review/workflow.md`, `skills/scaffold/workflow.md`, `skills/scope/workflow.md`, `skills/test/workflow.md`, `skills/ticket/workflow.md`, `skills/tidy/workflow.md`, `skills/weigh/workflow.md` — `## Final report` section added.
- `planning/STAGE-LEDGER.md` — Substrate-Retired row added for T067.
- `development/DEVIATIONS.md` — T067 entry added under § Phase 2 entries.

**Acceptance criteria verified:**
- `grep -l "Final report" skills/*/workflow.md | wc -l` → 12 ✓
- `grep -E "Status: (Done|Blocked|Question)" skills/*/workflow.md` → 12 hits ✓
- No grep hit for `Now (updating|committing|doing|starting|moving)` in workflow instruction prose ✓

**Commit summary (for PM):**

```
Repo:    parent (community)
Branch:  t67 (or main, per PM preference)
Message: T067: install report shape rule
Files:   16 (see list above)
```

**DEVIATIONS:** `development/DEVIATIONS.md` § Phase 2 entries → "2026-05-30 — T067 — No deviations."

**STAGE-LEDGER:** T067 row stamped `done` in § Substrate — Retired.
