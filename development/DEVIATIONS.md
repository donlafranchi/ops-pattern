---
id: how-deviations
purpose: Per-ticket log of implementation-vs-spec drift across the build.
layer: how
status: active
---

# DEVIATIONS.md — Implementation Drift Log

When implementation diverges from spec, log it here with context.

## Rotation policy

Fulfills `pipeline-process-audit-2026-05-22.md` **R6** — the audit's E2 finding (605-line single file, unreadable in one pass, no archive policy). Mirrors `JOURNAL.md`'s pattern.

- **Live file** carries entries for the **current rebuild phase** only.
- **At each phase boundary**, the PM rotates closed-phase entries to `development/archive/DEVIATIONS-phase-{N}.md` and resets the live file's TOC.
- **Soft cap on live file:** ~400 lines. `pipeline-router` flags above that.
- **Empty entries are still mandatory** per the rebuild rule — a one-line "no deviations" with a `Why:` qualifies as an entry.
- **Archive index:** a short table below links every archived phase file.

## Archive

| Phase | Tickets covered | File |
|---|---|---|
| Phase 1 (substrate floor + b1.x sprint close) | T041 → T066 | [`archive/DEVIATIONS-phase-1.md`](archive/DEVIATIONS-phase-1.md) |

---

## Phase 2 entries

## 2026-05-30 — T067 — No deviations

**Deviation:** None against spec. All 12 listed workflow.md files updated with identical Final Report block; CLAUDE.md § Report shape, playbook entry, and AGENTS.md cross-ref landed exactly as scoped.

**Why:** No skill needed a custom report shape — the template applies uniformly. The build/workflow.md "You produced" replacement preserved the surrounding Hand off context. No drift surfaced during execution.

---

**Format:**

```markdown
## {Date} — {Ticket} — {Title}

**Deviation:** {What differs from spec}

**Reason:** {Why}

**Impact:** {What changes for downstream?}

**Escalation:** Escalated to {Planning / Product}

**Resolution:** {How was it resolved?}
```

(Log entries as they occur)
