---
name: pipeline-prune
description: Periodically prune JOURNAL.md and DECISIONS.md so the live files stay scannable, while memorializing any silently-load-bearing decisions before they fall off. Use when the user says "prune the journal", "the journal is heavy", "prune decisions", "DECISIONS.md needs trimming", "rotate the journal", "what should we memorialize before pruning", "what's safe to archive", "this file is getting heavy", or at the end of any session that produced an unusually dense entry. Reads JOURNAL.md, DECISIONS.md, MAP.md, and the foundation + system specs. Writes to those same files and to archives under _attic/2026-05-19/planning/. Out-of-band — does not run during an open pipeline phase.
---

# pipeline-prune

Project-resident maintenance skill. Keeps JOURNAL and DECISIONS at scannable weight by archiving the play-by-play, *but* memorializes silently-load-bearing decisions before they get archived so they don't get forgotten.

## When to use

- User says "prune the journal", "decisions is heavy", "rotate the journal", "this file is getting heavy."
- End-of-month maintenance pass.
- After a dense session that produced a long entry, asking "what's worth memorializing?" before the entry ages.
- When MAP.md's alignment checks feel incomplete relative to recent decisions.

## When NOT to use

- During an open scenario phase or pre-ticket review — surface the request, defer until the phase closes.
- When the user is asking about a specific recent decision (read the entry directly, don't prune).
- When BUILD-LOG.md is stale — surface that first; build state has priority over doc weight.
- When DEVIATIONS.md has open un-escalated entries — surface those first.

## Workflow

See `workflow.md`.

## Related skills

- `pipeline-router` — orient before invoking this; confirm no open phase is in flight.
- `consolidate-memory` (Cowork) — the analogous pattern for auto-memory files; runs out-of-band the same way.

## Hand off

**You produced:** lighter JOURNAL and/or DECISIONS files; new entries in `_attic/2026-05-19/planning/`; memorialized invariants landed in MAP.md alignment checks / foundation doc footers / system spec footers / a new short foundation doc (only if no other home fits).

**Next skill:** none. The PM reviews the result. If the prune surfaced an unresolved question about whether a commitment is load-bearing, escalate per AGENTS.md.
