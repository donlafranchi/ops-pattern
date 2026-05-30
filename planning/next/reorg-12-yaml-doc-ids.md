---
purpose: Inject stable YAML `id:` fields into doc front-matter so REGISTRY.md becomes a reliable resolution table.
layer: how
status: ratified
risk: medium
---

# Stable YAML doc IDs (Phase A)

## Phase A — Inject `id:` into front-matter

- Script reads every `.md` file with front-matter under `product/`, `planning/`, `development/`, `standards/`, `playbooks/`, `skills/` (excluding `_attic/`, `_inbox/`).
- Generates `id:` based on layer + filename slug:
  - `why-{slug}` for foundation docs
  - `what-{slug}` for needs / systems / capabilities / ui / exploration
  - `how-{slug}` for planning / development / standards / playbooks
- Injects `id:` into each file's YAML front-matter.
- Rebuilds REGISTRY.md as the resolution table.
- No link conversion yet — both path refs and IDs coexist.

Phase B (convert refs in the 15 most-cited docs) and Phase C (convert remaining refs + add `tidy` check) remain deferred even if Phase A lands.

## Risk

Medium. Bulk YAML edits across many files; script needs to be idempotent.
