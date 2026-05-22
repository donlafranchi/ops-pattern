# pipeline-adr — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `planning/DECISIONS.md` (pointer index — next number, existing ADRs), `planning/adrs/README.md` (format, lifecycle), `planning/adrs/*.md` (existing ADRs for cross-reference), spec/foundation files the new ADR will touch |
| **Writes** | `planning/adrs/ADR-{NNNN}-{slug}.md` (new) · `planning/DECISIONS.md` pointer line (update) · spec/foundation home-doc cross-reference (when applicable) · superseded ADR's `Superseded by:` header (when applicable) |
| **Templates** | `templates/adr.md` |
| **Does NOT read** | `web/` (code), `development/tickets/`, `planning/scenarios/`, `planning/scenarios-backlog/` |
| **Hands to** | PM for ratification; `pipeline-intent-check` runs automatically during the draft phase |

## Workflow

### 1. Clarify scope

Ask the PM three questions before drafting:

- **What is the decision?** One sentence. If you can't compress it, the decision isn't ready.
- **What does it touch?** One or more of: a system spec, a foundation/UI/ops doc, no single home (cross-cutting). This determines whether the ADR is spec-resident, foundation-resident, or fully cross-cutting.
- **Does it supersede an existing ADR?** If yes, which one — and what specifically changes?

If any answer is unclear, stop. Escalate to `pipeline-product` (if the decision needs more product thinking) or `pipeline-review` (if it needs an architecture pass first).

### 2. Allocate the next number

Read `planning/DECISIONS.md` pointer index. Take the highest existing ADR number and add one. **Never reuse a number** — if a draft was previously rejected, that number is retired.

If two pipelines are landing ADRs concurrently, the *first* to commit wins the number; the second re-allocates. Concurrent ADR writes are rare in practice (solo founder) but the rule is in place for future federation.

### 3. Decide the home

Three patterns (from `planning/adrs/README.md` § "What belongs here vs. elsewhere"):

1. **Cross-cutting** — touches many specs, no single owner. Full text lives in the ADR file. Examples: ADR-15, ADR-16, ADR-17, ADR-18, ADR-19.
2. **Spec-resident** — shapes one primitive or system. Long-form text lives in the system spec; ADR file carries summary + cross-reference. Examples: ADR-5 (`item.md`), ADR-7 (`action-layer.md`), ADR-13 (`groups.md`), ADR-14 (`location.md`).
3. **Foundation/UI/ops-resident** — *is* a foundational principle, UI principle, or tech-stack reality. Long-form text lives in the home doc; ADR file carries summary + cross-reference. Examples: ADR-1 (`web/CLAUDE.md`), ADR-2 (`design-language.md`), ADR-6 (`agent-assistance.md`), ADR-9 (`policy.md`).

Pick one. The decision determines how much text goes in the ADR file vs. the home doc.

### 4. Draft the ADR

Copy `templates/adr.md` (or `planning/adrs/_template.md` — identical content) to `planning/adrs/ADR-{NNNN}-{slug}.md`.

Fill in:

- **Header**: Status: Proposed · Date: today (use `bash date +%Y-%m-%d` or just YYYY-MM-DD format) · Deciders: PM · Scope: one sentence · Touches: comma-separated list of files/specs/directories · Supersedes: ADR-N (if applicable)
- **Decision**: Terse. State the *current* shape only. No "we considered X, Y, Z" preamble.
- **Options considered**: Optional but recommended. Table form preferred. List the chosen option and the rejected ones with brief verdicts.
- **Trade-offs**: Why the chosen option won. What's hard about it. What rejected options would have cost.
- **Consequences**: Each consequence is one bullet. Be specific — name files, name specs, name the constraint. Include foreclosures (what this rules out, and at what cost to reverse).
- **Action Items**: Concrete follow-ups. Include the pointer-index update and cross-reference updates.

For spec/foundation-resident ADRs: keep the file lean. The Decision section can be one paragraph; the load-bearing prose lives in the home doc, not duplicated here.

### 5. Run `pipeline-intent-check` on the draft

Per rebuild-phase rule #9, every new ADR is intent-checked before merging. The check scans for Category-1–8 statements (refusals, absolutes, irreversible forecloses, etc.) that lack `Intent:` annotations.

- Verdict **CLEAN** → proceed to step 6.
- Verdict **PROPOSE** → PM lands the proposed Intent lines in the draft, then re-run intent-check.
- Verdict **BLOCK** → load-bearing decision shipped without rationale. Pause; PM clarifies; re-run.
- Verdict **ESCALATE** → invoke `pipeline-ratify-absolute` for interactive ratification (Category-2 candidates).

Do not flip Status to Accepted until the verdict is CLEAN.

### 6. Update `planning/DECISIONS.md` pointer index

Add one row to the pointer-index table. Include: ADR number, status, canonical file link, home doc (if spec/foundation-resident), one-line shape summary.

The pointer-index table is in alphanumeric ADR order — insert the new row in the right spot.

### 7. Cross-reference home doc (if spec/foundation-resident)

If the ADR is spec-resident, update the system spec's:

- Status banner (if the decision changes the system's b1 commitment)
- "Decisions encoded" header line (add `ADR-{NNNN}`)
- Any prose section that previously referenced the decision

If the ADR is foundation/UI/ops-resident, update the home doc to reference `ADR-{NNNN}` in its prose where the decision is described.

If the ADR is fully cross-cutting, this step is a no-op.

### 8. Handle supersession (if applicable)

If the new ADR supersedes an existing one:

- Add `Superseded by: ADR-{new}` to the old ADR's header.
- Update the old ADR's Status to `Superseded`.
- Confirm the new ADR's `Supersedes: ADR-{old}` header is present.
- Update the old ADR's pointer-index row in `DECISIONS.md` to show **Superseded by ADR-{new}**.
- The old ADR file **stays in `planning/adrs/`** — it is not moved to `archive/`. The Status banner is the indicator.

### 9. Hand off to PM

Present the draft to the PM:

- Path to the new ADR file
- Path to the updated pointer index in DECISIONS.md
- List of cross-reference updates (if any)
- The intent-check verdict
- A one-line summary: "ADR-{NNNN} drafted as Proposed; ready for PM ratification."

PM reviews. On accept, PM flips Status from Proposed → Accepted and commits. The skill does not commit — per the root `CLAUDE.md` § Commit Rules, the PM owns commits.

### 10. After ratification

- File is immutable. Any change is a new (superseding) ADR.
- Update `JOURNAL.md` with a one-line entry: "Ratified ADR-{NNNN}: {title}."
- If the ADR introduces schema, events, components, or absolutes that scenarios will encode, `pipeline-plan` / `pipeline-ticket` will read it as part of their normal flow — no manual hand-off required.

## Special cases

### Drafting an ADR for a decision the user is still working out

If the PM is brainstorming, escalate to `pipeline-product` (for product/system shape) or `pipeline-review` (for architectural fit) first. Don't allocate a number to a decision that hasn't crystallized. ADR numbers are scarce *only* in the sense that they shouldn't be wasted on rejected drafts — but the spirit is: write the ADR when the decision is ready, not before.

### Promoting a notes/ doc to an ADR

When a `notes/` doc has matured into architectural decisions that downstream agents will reference, promote it. Workflow:

1. Read the notes/ doc end-to-end.
2. Extract the architectural decisions (some notes/ docs hold mostly operational content; only the decision-shaped parts get promoted).
3. Draft an ADR file per steps 4–8 above. The notes/ doc may remain as the long-form prose home (spec/foundation-resident pattern) or be retired.
4. Add a redirect/pointer to the notes/ doc if it's retiring.

Precedent: ADR-19 (clean-slate rebuild) promoted `planning/rebuild-plan.md` while leaving the notes/ doc in place as the long-form phase plan.

### Multi-decision ADRs

Sometimes two decisions are tightly coupled and benefit from being ratified together. Pattern: one ADR file with two `## Decision` sections, each with its own Options / Trade-offs / Consequences. Precedent: ADR-18 (eval helpers — folder boundary + failure-injection strategy).

Use sparingly. If the decisions can stand alone, prefer two ADRs.
