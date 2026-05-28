---
purpose: Reorg item — inject stable `id:` fields into doc front-matter so REGISTRY.md becomes a reliable resolution table.
layer: how
status: stub
---

# Reorg Item 12 — YAML `id:` field — stable doc IDs

## What this is

Every doc gets a stable `id:` in its YAML front-matter. REGISTRY.md becomes a reliable resolution table (`id → current path`). When files move, only REGISTRY updates — refs by `id` still resolve.

## Phasing

Three phases proposed in the original reorg-plan; this stub is **Phase A only** (the proven-value-first cut).

### Phase A — Inject `id:` into front-matter (do this first)

- Script reads every `.md` file with front-matter under `product/`, `planning/`, `development/`, `standards/`, `meta/`, `skills/` (excluding `_attic/`, `housekeeping/`, `_inbox/`).
- Generates `id:` based on layer + filename slug:
  - `why-{slug}` for foundation docs
  - `what-{slug}` for needs / systems / capabilities / ui / exploration
  - `how-{slug}` for planning / development / standards / meta
- Injects `id:` into each file's YAML front-matter.
- Rebuilds REGISTRY.md as the resolution table.
- **No link conversion yet** — both path refs and IDs coexist.

### Phase B — Convert internal references in the 15 most-cited docs (defer)

Only do this after Phase A demonstrates value. Risk: `[[id]]` syntax isn't standard Markdown; GitHub rendering shows raw `[[id]]` text. Alternative: `[text](registry:what-item)` with a custom resolver. Open question.

### Phase C — Convert remaining refs + add tidy check (defer)

Wait until Phase B's approach is validated.

## Actions (Phase A only)

1. Write the script that walks `*.md`, reads front-matter, generates ID, injects.
2. Run on a single doc as a smoke test before bulk.
3. Bulk-run; verify by spot-checking.
4. Rebuild REGISTRY.md with ID column.
5. Commit as `docs(reorg): inject stable doc IDs into front-matter (Phase A)`.

## Risk

Medium. Bulk YAML edits across many files. Script needs to be idempotent. Backup before running.

## Advance this by

1. PM ratifies Phase A only (defer Phase B/C until value proven).
2. Decide ID format (layer-prefix vs. flat slug; collision handling).
3. Decide scope (every dir or just the load-bearing ones).
4. Script + smoke-test.
5. Bulk-run.

## Source

Reorg-plan.md §12.
