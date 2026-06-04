---
id: how-spec-patches-dir
purpose: Per-patch Build → Product return queue. Each open patch is one file; explore drains as a gate before each phase opens.
layer: how
status: active
---

# spec-patches/ — Build → Product return queue

> Atomized from the legacy `planning/SPEC-PATCHES.md` monolith on 2026-06-03 to remove the parallel-session write-conflict class. Landed patches stay in `landed.md` (or roll into the next sprint's archive); open patches live here as one file per patch.

## How this directory works

**One file per open patch.** Filename: `SP-{YYYY-MM-DD}-{slug}.md` — date the patch was filed plus a short slug naming the concept (e.g. `SP-2026-06-02-locations-place-id.md`, `SP-2026-06-03-members-rls-narrowing.md`).

**Open is the default; landed patches move out.** When `explore` patches the spec, the file is moved to `landed/{YYYY-MM-DD}-{slug}.md` (or appended to a sprint-close `landed.md` aggregator) and removed from the live directory.

## File format

```markdown
---
id: spec-patch-{YYYY-MM-DD}-{slug}
purpose: Spec patch — {one-line description}.
layer: how
status: open   # or `landed` (after move) / `rescinded`
filed: 2026-06-02
caught_by: T077
deviation_pointer: 2026-06-02 — T077
target_spec: planning/now/scenario-F038-producer-lists-product.md
target_section: § Data Captured (Pickup point row)
---

# {one-line title}

**What's wrong:** {one paragraph explaining the divergence}

**The fix:** {one paragraph naming the spec edit needed — file:section, what to change}

**Caught by:** T### during {build / review / test}

**Deviation pointer:** [`development/deviations/T###.md`](../../development/deviations/T###.md) § {YYYY-MM-DD entry}

## Resolution

{filled in when explore patches the spec — append the commit hash and date}

- Landed YYYY-MM-DD ({commit hash}): {short description of the spec edit}
```

## Reading the queue (aggregation)

`orient` and `explore` glob this directory and surface:

- Patch count per target spec (multiple patches to one spec → batch them)
- Patches older than 14 days (drain or rescind)
- Patches without a deviation pointer (orphans — re-trace before draining)

`explore` MUST drain this directory as a gate before any new phase opens — that's the Build → Product return invariant from CLAUDE.md rebuild rule 13.

## Landed patches

When a patch lands:

1. `explore` (or PM) edits the target spec.
2. Append a `## Resolution` block to the patch file with `landed YYYY-MM-DD ({commit hash})`.
3. Move the file from `spec-patches/SP-*.md` to `spec-patches/landed/{YYYY-MM-DD}-{slug}.md`.
4. At sprint close, the landed/ dir may be archived to `_attic/YYYY-MM-DD-{sprint}/spec-patches-landed/`.

## Rescinded patches

A patch may be rescinded if the spec is right and the deviation should revert. In that case:

1. `weigh` or PM writes a rationale in the patch file's `## Resolution`.
2. Set `status: rescinded` in frontmatter.
3. Move the file to `landed/` alongside landed patches — the trail stays for audit.

## Migration provenance

- Legacy monolith: [`../SPEC-PATCHES.md`](../SPEC-PATCHES.md) — retains "Open" entries through the migration cutover (2026-06-03); landed entries (checked boxes) remain there as historical record.
- New files in this dir were migrated 2026-06-03 from the legacy "Open" list. Each open entry becomes one file with its original filed-date and caught-by ticket preserved.

## Maintenance

- **Empty is the desired state at phase boundaries.** `explore` drains before opening a new phase.
- **No backfill of landed entries.** The legacy monolith keeps landed history; the new directory is for live drain work.
- **No silent rescissions.** Every rescinded patch carries a written rationale.
