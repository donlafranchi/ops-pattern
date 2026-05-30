---
purpose: Triaged work waiting on PM ratify — the lane between `_inbox/` and `planning/next/`.
layer: how
status: active
---

# planning/proposed/ — triaged, awaiting PM ratify

> **The lane.** Stubs land here after `atomize` decomposes a plan or parked decision from `_inbox/`. PM ratifies one at a time and moves the file to `planning/next/` (queued), `planning/now/` (in flight), or `planning/later/` (parked) — or rejects it back to `_attic/`.

## Why this exists

`_inbox/` is for *untriaged* drops. `planning/next/` is for *PM-ratified queued work*. Without a lane in between, triaged-but-unratified items hid in `_inbox/` (noise mixed with raw drafts) or sprawled into parallel top-level dirs (the now-retired `housekeeping/`). This lane makes the PM-decision queue visible — the bottleneck deserves its own surface.

## Lifecycle

```
_inbox/{name}.md
  ↓ atomize
planning/proposed/{slug}.md           (flat — single atom)
planning/proposed/{plan-slug}/        (grouped — multi-item plan)
  ↓ PM ratifies
planning/next/ | planning/now/ | planning/later/
  ↓ route: skill (named in stub frontmatter)
weigh | scope | tidy | ticket | explore
```

## What goes here

- Output of `atomize` — stubs derived from `_inbox/` plans or parked decisions.
- Each stub carries a `route:` frontmatter field naming the downstream skill that picks it up after ratify.
- Stubs may be flat (`{slug}.md`) for single atoms or grouped under `{plan-slug}/` for multi-item plans (with an index `README.md`).

## What does NOT go here

- Raw drafts → `_inbox/`.
- PM-ratified queued work → `planning/next/`.
- Active in-flight work → `planning/now/`.
- Parked-but-known work → `planning/later/`.
- Specs, scenarios, tickets — those have their own homes per the file-naming table in root `CLAUDE.md`.

## Frontmatter

Every stub must carry:

```yaml
---
purpose: One-sentence what-this-is.
layer: how
status: proposed
route: weigh | scope | tidy | ticket | explore
source: _attic/YYYY-MM-DD-{parent-plan-slug}/{filename}.md
risk: low | medium | high
---
```

## Staleness

A stub older than ~2 weeks in this lane is a flag — either ratify it, reject it, or move it to `planning/later/`. `orient`'s drift check should surface stale entries.

## Related

- Producer: `atomize` (Claude Code).
- Consumers: `weigh`, `scope`, `tidy`, `ticket`, `explore` (named per-stub via `route:`).
- Sibling lanes: `_inbox/`, `planning/next/`, `planning/now/`, `planning/later/`, `planning/done/`.
