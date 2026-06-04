---
id: how-deviations-dir
purpose: Per-ticket implementation drift log. Each file is a single ticket's deviations; parallel sessions don't collide because each writes only its own file.
layer: how
status: active
---

# deviations/ — per-ticket implementation drift log

> Atomized from the legacy `development/DEVIATIONS.md` monolith on 2026-06-03 to remove the parallel-session write-conflict class. Phase 1 entries live in `archive/DEVIATIONS-phase-1.md`; Phase 2+ entries live here as one file per ticket.

## How this directory works

**One file per ticket.** Filename: `T{NNN}.md` (e.g. `T076.md`, `T095.md`). If a ticket has multiple deviation entries on different dates (M2 fold-ins, fix-forwards), they all live in the same file — the parallel-session firewall is per-ticket, not per-date.

**Empty deviation entries are still mandatory.** Per CLAUDE.md rebuild rule 6, every ticket close gets a deviations file even when there's nothing to log. A one-line "no deviations" with a `Why:` qualifies.

## File format

```markdown
---
id: deviation-T{NNN}
purpose: Implementation drift log for T{NNN}.
layer: how
status: active   # or `closed` once the ticket is shipped + no further entries expected
ticket: T{NNN}
created: 2026-06-03
last_entry: 2026-06-03
---

# T{NNN} — {ticket title}

## {YYYY-MM-DD} — {short title of the deviation or "no deviations"}

**What:** {one sentence on what diverged from the spec.}

**Why:** {one to two sentences on the constraint that forced the deviation — the implementation surprise, the spec ambiguity, the upstream-system property the spec didn't account for. Anchor to the file / handler / memo that constrains the choice.}

**Disposition:** {one of: accepted-as-is | flag-for-spec-revision | flag-for-ticket-rewrite | revert-on-next-pass.}

**Impact:** {what changes for downstream — optional, include when non-obvious}

**Escalation:** {if escalated to scope/explore — link the scenario or memo}

**Resolution:** {how the deviation was resolved — optional, include when shipped}
```

Multiple entries on different dates stack as sibling `## YYYY-MM-DD — {title}` headers within the same file.

## Disposition values

| Disposition | Meaning |
|---|---|
| `accepted-as-is` | Deviation stands; no follow-up needed |
| `flag-for-spec-revision` | The spec is wrong — append a SPEC-PATCHES entry; `explore` drains the queue |
| `flag-for-ticket-rewrite` | A future ticket will revisit this — name the ticket or the trigger |
| `revert-on-next-pass` | Temporary workaround; revert when the upstream dep ships |

## Reading the log (aggregation)

`orient` and `tidy` glob this directory and surface:

- Any file with a `flag-for-spec-revision` entry that doesn't have a corresponding SPEC-PATCHES file (broken return path)
- Any file marked `status: active` where the ticket is in `development/tickets/done/` (close the loop)
- Oversize files (>200 lines suggests the ticket sprawled — splitting recommendation surfaces)

## Co-locate why with what

Every entry carries its **why** alongside its **what** — mandatory per CLAUDE.md rebuild rule 6. The `Why:` line records the *constraint that forced the path*: implementation surprise, spec ambiguity, upstream-system property the spec didn't account for. Without it, future agents re-derive the constraint from code — lossy and drift-prone.

## Migration provenance

- Legacy monolith: [`../DEVIATIONS.md`](../DEVIATIONS.md) — retains all Phase 2 entries through the migration cutover (2026-06-03) and links the Phase 1 archive.
- New files in this dir were migrated 2026-06-03 from the legacy "Phase 2 entries" section. Ticket-by-ticket header structure is preserved; only the file boundary changed.

## Maintenance

- **One file per ticket — no splitting.** Even multi-revision tickets like T095 (Revisions 1 + 2) keep all entries in `T095.md`.
- **Status flips at close.** When a ticket fully closes and no further fix-forward is expected, set `status: closed` in frontmatter.
- **Old single-file edits are forbidden post-cutover.** New work writes here; the monolith is read-only.
