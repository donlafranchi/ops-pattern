---
id: how-memo-skill
name: memo
description: Walks the PM through writing or superseding a reversal memo following the project's `playbooks/memos/` conventions. Use when the user says "reverse this decision", "user feedback contradicts {pattern entry}", "supersede {memo}", "what's the next memo number", or after a `explore` / `scope` / `review` session surfaces that a decision in force needs to be reversed. Allocates the next memo number, drafts from the template, runs `weigh` on the draft, and updates the affected pattern-doc entry's status. Reads `playbooks/memos/`, `playbooks/PLATFORM-PATTERNS.md`, `playbooks/DEVELOPMENT-PATTERNS.md`, and the spec/foundation files the memo will touch. Writes one new file under `playbooks/memos/` and updates the reversed pattern-doc entry. Refuses to write code or implementation tickets — that's `ticket` / `build`.
---

# memo

Project-resident skill for writing and superseding **reversal memos** — the only document the project writes when a prior decision in force needs to be reversed by user feedback. New decisions land directly as pattern-doc entries in `playbooks/PLATFORM-PATTERNS.md` (what the platform IS or refuses to be) or `playbooks/DEVELOPMENT-PATTERNS.md` (how we build); this skill is **not** for those. It fires only when an existing pattern entry must be overturned.

## When to use

- User says "reverse this decision" / "user feedback contradicts {pattern entry}" / "we need to overturn X."
- User says "supersede memo-NNNN with a new decision."
- User says "what's the next memo number" — read `playbooks/memos/` and return the next free number.
- After `explore` / `scope` / `review` surfaces that a decision currently in force can no longer stand and must be formally reversed.

## When NOT to use

- For **new** decisions that don't reverse anything — those land directly as a pattern-doc entry in `playbooks/PLATFORM-PATTERNS.md` or `playbooks/DEVELOPMENT-PATTERNS.md` (per the routing rule in `CLAUDE.md`). No memo needed.
- For *implementation* decisions inside a single ticket — those live in the ticket itself or in `development/DEVIATIONS.md`.
- For scenario acceptance criteria — those are `scope`'s output.
- For UI microcopy or design-language extensions — those go directly into `product/ui/design-language.md` per `design-system` (Cowork plugin skill).

## Constraints (hard)

- Allocate the next free memo number by scanning `playbooks/memos/`. Numbering continues from **memo-0024**. **Never reuse a number.**
- Write exactly one new file: `playbooks/memos/memo-{NNNN}-{slug}.md`. Use the format in [`templates/adr.md`](templates/adr.md).
- Update the reversed pattern-doc entry in `playbooks/PLATFORM-PATTERNS.md` / `playbooks/DEVELOPMENT-PATTERNS.md`: mark the entry superseded and cross-reference the memo.
- When the memo supersedes an earlier memo, update both the new memo's `Supersedes:` header and the old memo's `Superseded by:` header. Both arrows or none.
- Run `weigh` on the draft before flipping Status to Accepted. Category-1–8 statements need `Intent:` annotations.
- Do NOT write code, implementation tickets, or scenarios. That's `ticket` / `build` / `scope`.
- Do NOT edit accepted memos. Supersede with a new memo if the decision changes again.

## Workflow

See [`workflow.md`](workflow.md).

## Templates

- [`templates/adr.md`](templates/adr.md) — the canonical memo shape. Status / Date / Deciders / Scope / Touches / Supersedes? / Decision / Options / Trade-offs / Consequences / Action Items.

## Hand off

**You produced:** a new file at `playbooks/memos/memo-{NNNN}-{slug}.md` with `Status: Proposed`, plus a superseded-marker + cross-reference on the reversed pattern-doc entry.

**Next step (PM ratifies):** PM reviews; if accepted, flip Status from Proposed → Accepted; commit. After ratification the file is immutable.

**Next skill (intent gap detected):** `weigh` — already wired into this skill's workflow; if it surfaces missing Intent annotations, PM lands them before the Accepted flip.

**Next skill (architectural concern surfaced during drafting):** `weigh` if the memo is encoding a Category-2 absolute (a "never / always / no X / must" claim); `explore` if the reversal requires extending a system spec first.

**On supersession:** the old memo stays in `playbooks/memos/` with Status: Superseded and a `Superseded by: memo-M` header line. The file does not move to archive — the Status banner is the indicator.

## Related skills

- `weigh` — gates memo ratification; runs automatically per workflow.
- `explore` — invoked when the reversal can't be ratified without extending a system spec first.
- `orient` — periodic retro of pattern entries + memos; flags ones that need supersession or promotion.
