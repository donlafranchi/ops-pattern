---
purpose: What tidy's sweep-docs mode looks for. Ten findings, each with a trigger and a disposition.
layer: how
status: active
---

# Repo tidying

The `tidy` skill's sweep-docs mode reads this to know what to look for. Each finding has a name, a trigger, and a disposition. `tidy` surfaces findings to the PM; the PM ratifies in batches; `tidy` executes ratified dispositions.

## Findings

### F1 — Stale Questions

**Trigger.** A doc contains an "Open questions" section. One or more items reference a date, an ADR, or a fact that lands the answer.

**Disposition.** Convert resolved items to fact statements in the body. Remove from the questions section. If every item resolves, remove the section.

### F2 — Closed Queue Carrying History

**Trigger.** A queue file has more rows in "Landed" / "Rescinded" than in "Open." Or every row in Open is older than the most recent bundle close.

**Disposition.** Move Landed/Rescinded to the archive of the sprint that drained them. The queue file holds open items only.

### F3 — Mixed-State Ledger

**Trigger.** A tracking table contains rows marked `deferred`, `archived`, or `superseded` mixed with active rows.

**Disposition.** Split the table into Active and Retired sections, or move Retired rows to a sibling history file. Escalate when uncertain whether a row is genuinely retired.

### F4 — Convention Preamble

**Trigger.** A doc's "how this works" section is more than 3× the actual content of the doc.

**Disposition.** Move convention to a playbook. Keep the file to its content plus a one-line link. If the file is mostly empty, escalate.

### F5 — Done-but-Still-Live

**Trigger.** A doc with frontmatter `status: done` sits outside `archive/`, `done/`, or the appropriate dated archive directory.

**Disposition.** Move to `{owning-dir}/archive/YYYY-MM-DD-{slug}/` per the directory-local archive rule.

### F6 — Grep-as-Content

**Trigger.** A doc contains a section with 10+ entries that look like raw search results (file:line citations, repeated structural patterns).

**Disposition.** Escalate. The raw dump needs processing (decisions per item) before it can be discarded.

### F7 — Touches Bloat

**Trigger.** An ADR or decision file lists 6+ cross-references in "Touches:", "See also:", or "Affects:".

**Disposition.** Trim to files that genuinely co-evolve with the decision (typically 1–3). Mechanical; no escalation needed.

### F8 — Decision Archaeology

**Trigger.** A status line, header field, or body paragraph contains a parenthetical editorial trail — "(refined by N, softened YYYY-MM-DD, narrowed by M)".

**Disposition.** Strip the parentheticals. If a refinement matters, it lands in the body as current state.

### F9 — Verdict-with-Prose

**Trigger.** A file with `status: one-shot` or equivalent meta-content sits outside the archive. Or a review file's only durable value is a single-word verdict.

**Disposition.** Land the verdict in the target spec or capability. Archive the review. Confirm any concrete patches landed before archiving.

### F10 — Split-Home Drift

**Trigger.** A doc claims its content "lives primarily in {other file}" but contains significant non-pointer content of its own.

**Disposition.** Pick one home (usually the capability or spec). The other becomes a 3-line pointer or gets deleted. Escalate — this is a judgment call.

## Output shape

For each hit, surface one line:

```
F# | {file} | {one-line summary of what's firing}
```

Group findings by file when one file fires multiple — the file may need restructuring rather than per-finding fixes.

## Escalation rules

**Escalate to PM** (don't auto-resolve) when:

- A capability spec doesn't exist for the affected work — moving the content needs a PM call on where it goes.
- Multiple findings on the same file — flag for restructuring, not per-finding fixes.
- A finding is on a file last touched within the current session — it might be in flight.
- The disposition would delete content that is the only copy of the intent.
- F4 or F10 fires — these always need a judgment call.

**Auto-resolve** (no PM ratification needed) when:

- F5 fires on a file at `status: done` for >7 days.
- F7 fires (Touches Bloat is mechanical).
- F8 fires on a parenthetical editorial trail (strip is mechanical).
- F9 fires on a review file whose frontmatter literally says `status: one-shot` or `consume and archive`.
