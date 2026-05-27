---
name: doc-home-finder
description: Drains the _inbox/ — reads each untriaged doc and proposes its real home (which directory, what filename, or whether to fold into an existing doc instead of standing it up alone). Use when the user says "triage the inbox", "where should this doc go", "find a home for this", "drain the inbox", "is this a new doc or does it fold into X", "what's in _inbox", "name this properly", or when a new doc lands at repo root and needs to be filed. Reads the target doc(s) in _inbox/ plus REGISTRY.md, CLAUDE.md authoritative-docs table, MAP.md, TRACE.md, and any candidate parent docs. Writes nothing without PM ratification; on ratify, moves the file with git mv and updates references. One doc at a time — never batch.
---

# doc-home-finder

Project-resident maintenance skill. Decides where a new untriaged doc belongs in the repo, or whether it should be folded into an existing doc instead of standing on its own.

## When to use

- `_inbox/` is non-empty and the user wants it drained.
- User pastes a new doc (HTML, markdown, scratch notes) and asks "where does this go."
- A doc lands at repo root that isn't load-bearing — drift-check flagged it.
- A new system spec is being considered and you need to decide: new file under `product/systems/`, or a section in an existing system, or split across multiple.
- User says "is this its own thing or part of X."

## When NOT to use

- The doc is clearly an active spec / ADR / ticket / scenario — those have explicit homes already; just write them there.
- The doc is a code file — wrong skill entirely.
- The doc is a draft of an ADR — invoke `pipeline-adr` instead.
- During an open pipeline phase — drain `_inbox/` between phases, not during build.

## Workflow

See `workflow.md`.

## Related skills

- `pipeline-router` — orient first; the drift check tells you whether `_inbox/` is non-empty.
- `doc-housekeeping` — periodic sweep that may also surface inbox-like sprawl; this skill drains a single doc at a time.
- `pipeline-adr` — if the doc is an architectural decision, route there instead of finding a home.
- `pipeline-product` — if the doc is a new system spec proposal, route there to write it properly.

## Hand off

**You produced:** one doc moved from `_inbox/` (or root) to its real home, with frontmatter cleaned up, references updated, and `REGISTRY.md` row added/updated. Or: a ratified decision to fold the doc into an existing one — content merged, source file archived under `housekeeping/YYYY-MM-DD-{slug}/`.

**Next skill:** none. The PM continues their work.
