---
purpose: Provenance for DEV-PATTERN.md retirement.
layer: how
status: archived
retired_from: meta/cowork-pipeline/DEV-PATTERN.md
---

# DEV-PATTERN.md — retired 2026-05-30

Folded into `playbooks/DEVELOPMENT-PATTERNS.md` § Pipeline patterns + § Pipeline anti-patterns.

What carried forward (as pattern-doc entries):
- Cowork/Claude Code split
- Commit choreography (PM permission, no cross-commit)
- M-gates (M1 in review, M2 before commit, M3 in review, M4 before merge)
- Linear-default, parallel-on-independence
- Bundle lifecycle (kind suffix + status frontmatter)
- Atomize big plans with mixed-state items

What carried forward as anti-patterns:
- Commit-before-M2, Teaching to test, Sandbox git lock, Absolutist phrasing, One-stage-many-skills sprawl, Half-completed big plans

What dropped:
- The stages-and-where-they-run ASCII diagram (reference; will surface in AGENTS.md if needed)
- The "typical session" numbered walkthrough (reference; lives in skill workflows)
- Update log (per writing-docs.md: git is the change log)
