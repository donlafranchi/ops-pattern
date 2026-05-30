---
purpose: Provenance for pending-ratifications.md retirement.
layer: how
status: archived
retired_from: planning/pending-ratifications.md
---

# pending-ratifications.md — retired 2026-05-30

Archived in full per the cleanup-pass-prompt F2/F6 escalation. 466 lines of grep dumps and per-row drift findings; §7a/§7b/§7c rows had landed via:
- ADR-0021 ratification (Member↔geography substrate split, 2026-05-23)
- b1.x SPEC-PATCHES drain (-0001 / -0002 / -0004 landed, -0003 rescinded, 2026-05-27)
- ADR-0022 + ADR-0023 ratification (2026-05-25)

The decision discipline this file carried is now load-bearing in `playbooks/DECISION-PATTERNS.md` § How to spot an unearned absolute. New absolutes get a State-tagged Intent line at the bullet, not a queue entry.
