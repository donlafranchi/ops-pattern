# memo — workflow

> Writes **reversal memos** only — the document the project produces when a decision in force must be overturned. New decisions land directly as pattern-doc entries in the playbooks (see `CLAUDE.md` routing rule); they do not come through this skill.

## Cheat sheet

| | |
|---|---|
| **Reads** | `playbooks/memos/` (existing memos — next number, cross-reference), `playbooks/PLATFORM-PATTERNS.md` + `playbooks/DEVELOPMENT-PATTERNS.md` (the pattern entries in force, one of which is being reversed), spec/foundation files the memo will touch |
| **Writes** | `playbooks/memos/memo-{NNNN}-{slug}.md` (new) · the reversed pattern-doc entry (superseded marker + cross-reference) · spec/foundation home-doc cross-reference (when applicable) · superseded memo's `Superseded by:` header (when applicable) |
| **Templates** | `templates/adr.md` |
| **Does NOT read** | `web/` (code), `development/tickets/`, `planning/backlog/`, `planning/next/` |
| **Hands to** | PM for ratification; `weigh` runs automatically during the draft phase |

## Workflow

### 1. Clarify scope

Ask the PM three questions before drafting:

- **What decision is being reversed?** Name the pattern-doc entry in force. One sentence on what it currently says.
- **What does the reversal touch?** One or more of: a system spec, a foundation/UI/ops doc, no single home (cross-cutting).
- **Does it supersede an existing memo?** If yes, which one — and what specifically changes?

If any answer is unclear, stop. Escalate to `explore` (if the reversal needs more product thinking) or `review` (if it needs an architecture pass first).

### 2. Allocate the next number

Scan `playbooks/memos/`. Take the highest existing memo number and add one. Numbering **continues from memo-0024** (ADR-1 through 0025 retain their original numbers for git citation stability). **Never reuse a number** — if a draft was previously rejected, that number is retired.

### 3. Decide the home

Two patterns:

1. **Cross-cutting** — the reversal touches many specs, no single owner. Full text lives in the memo file.
2. **Spec/foundation/UI-resident** — the reversed decision shaped one primitive, system, or principle. Long-form text lives in the home doc; the memo carries summary + cross-reference, and the home doc's pattern reference is updated.

Pick one. The decision determines how much text goes in the memo file vs. the home doc.

### 4. Draft the memo

Copy `templates/adr.md` to `playbooks/memos/memo-{NNNN}-{slug}.md`.

Fill in:

- **Header**: Status: Proposed · Date: today (YYYY-MM-DD) · Deciders: PM · Scope: one sentence · Touches: comma-separated list of files/specs/directories · Supersedes: memo-N or the pattern entry being reversed
- **Decision**: Terse. State the *new* shape only. No "we considered X, Y, Z" preamble.
- **Options considered**: Optional but recommended. Table form preferred.
- **Trade-offs**: Why the reversal wins now. What changed since the original decision. What it costs.
- **Consequences**: One bullet each. Name files, specs, the constraint. Include foreclosures (what this rules out, at what cost to reverse).
- **Action Items**: Concrete follow-ups, including the pattern-entry update and cross-reference updates.

### 5. Run `weigh` on the draft

Per rebuild-phase rule #9, every memo is intent-checked before merging. The check scans for Category-1–8 statements (refusals, absolutes, irreversible forecloses) that lack `Intent:` annotations.

- Verdict **CLEAN** → proceed to step 6.
- Verdict **PROPOSE** → PM lands the proposed Intent lines in the draft, then re-run intent-check.
- Verdict **BLOCK** → load-bearing decision shipped without rationale. Pause; PM clarifies; re-run.
- Verdict **ESCALATE** → invoke `weigh` for interactive ratification (Category-2 candidates).

Do not flip Status to Accepted until the verdict is CLEAN.

### 6. Update the reversed pattern-doc entry

In `playbooks/PLATFORM-PATTERNS.md` or `playbooks/DEVELOPMENT-PATTERNS.md`, find the entry being reversed. Mark it superseded and cross-reference the memo (e.g. add `Superseded by memo-{NNNN}` to the entry's Decision line). The pattern docs remain the home for decisions in force; the memo is the audit trail of the reversal.

### 7. Cross-reference home doc (if spec/foundation-resident)

If the reversal is spec-resident, update the system spec's:

- Status banner (if the reversal changes the system's b1 commitment)
- Any prose section that previously referenced the reversed decision

If foundation/UI/ops-resident, update the home doc prose where the decision was described. If fully cross-cutting, this step is a no-op.

### 8. Handle supersession (if applicable)

If the new memo supersedes an earlier memo:

- Add `Superseded by: memo-{new}` to the old memo's header; set its Status to `Superseded`.
- Confirm the new memo's `Supersedes: memo-{old}` header is present.
- The old memo file **stays in `playbooks/memos/`** — it is not moved to archive. The Status banner is the indicator.

### 9. Hand off to PM

Present the draft to the PM:

- Path to the new memo file
- The pattern-doc entry that was marked superseded
- List of cross-reference updates (if any)
- The intent-check verdict
- A one-line summary: "memo-{NNNN} drafted as Proposed; ready for PM ratification."

PM reviews. On accept, PM flips Status from Proposed → Accepted and commits. The skill does not commit — per the root `CLAUDE.md` § Commit Rules, the PM owns commits.

### 10. After ratification

- File is immutable. Any change is a new (superseding) memo.
- Update `JOURNAL.md` with a one-line entry: "Ratified memo-{NNNN}: {title}."

## Final report

Default report shape is three lines:

    Status: Done | Blocked | Question — <plain-English one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."

Drop running narration. Name items in plain English; put the ID in parens if it matters. Withhold commit hashes, file lists, per-step trace until the PM says "expand." On "expand," return detail in priority order — ask → high-level outcomes → references → notes — stopping at each section for "more."
