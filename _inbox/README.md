---
purpose: Triage queue for new docs whose home is not yet decided.
layer: how
status: active
---

# _inbox/ — untriaged drafts

> **The rule.** New docs whose home isn't obvious land here, not at repo root. Drained by `doc-home-finder`.
>
> **Why this exists.** Root-level docs are load-bearing (`CLAUDE.md`, `AGENTS.md`, `JOURNAL.md`, `MAP.md`, `TRACE.md`, `REGISTRY.md`, `BUILD-LOG.md` symlink). Anything else at root is sprawl. The pipeline-router drift check flags it on the next session.

## What goes here

- Brainstorm sketches that haven't found a system yet.
- Audit reports before they're absorbed.
- HTML mockups / design references.
- Anything pasted from elsewhere that needs a real home.

## What does NOT go here

- Active specs → `product/systems/` or `product/foundation/`.
- Scenarios → `planning/backlog/`.
- Tickets → `development/tickets/`.
- Pattern decisions → `playbooks/PLATFORM-PATTERNS.md` or `playbooks/DEVELOPMENT-PATTERNS.md`.
- Dated work-products on close → `_attic/YYYY-MM-DD-{slug}/`.
- Retired specs → `{owning-dir}/archive/YYYY-MM-DD-{slug}/`.

## Frontmatter

Every file in `_inbox/` should still carry frontmatter (purpose / layer / status) so `doc-home-finder` can read intent without guessing. If unsure, set `status: triage`.

## Lifecycle

1. Doc lands here.
2. PM invokes `doc-home-finder`.
3. Skill reads the doc, walks `REGISTRY.md` + the directory tree, proposes a home (or proposes folding into an existing doc).
4. PM ratifies; skill moves the file and updates references.
5. `_inbox/` is empty again.

`_inbox/` should usually be empty. A non-empty `_inbox/` older than ~1 week is flagged by the drift check.
