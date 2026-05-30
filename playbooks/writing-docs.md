---
purpose: How any agent producing written output for this project should write.
layer: how
status: active
---

# Writing docs

Read this whenever you're authoring or editing a doc. The rules are short; the discipline is in not breaking them when the work feels small.

## The orienting principle

Capabilities are the truth. Plans, decisions, tickets, journals, and reviews are trace. When you write a summary or an update, ask first whether the value belongs in the capability spec; if it does, write it there and let the trace stay short.

Provenance lives in git. The capability spec doesn't recapitulate "who decided this and when." It says what's true today and what protects that.

## Where things live

The repo has a small set of stable homes. Use the existing one before creating a new doc.

- `product/capabilities/` — what each feature does, today. Source of truth for any "how does X work" question.
- `product/foundation/` — principles, primitives, design philosophy. Slow-moving.
- `product/systems/` — system-level specs (member, item, location, group, etc.).
- `playbooks/PLATFORM-PATTERNS.md` — platform decisions in force, with their intent.
- `playbooks/DEVELOPMENT-PATTERNS.md` — development decisions in force, with their intent. Includes pipeline patterns.
- `playbooks/DECISION-PATTERNS.md` — the decision rule + the one absolute. How we decide new things.
- `playbooks/writing-docs.md` — this file.
- `playbooks/repo-tidying.md` — what `tidy` looks for.
- `JOURNAL.md` — recent session pointer log. Never load-bearing. See JOURNAL contract below.
- `planning/now/` `next/` `later/` `done/` — active work queue.
- `planning/initiatives/` — non-bundle work packages.
- `development/tickets/` — ticket-grain work.

If a doc doesn't fit one of these, the doc is wrong before its content is.

## Style rules

**Write current state, not the path to it.** "The feature works like X" beats "We tried Y, then revised to Z, now X." History lives in git; current state lives in the doc.

**Preserve intent, drop history.** When a decision matters, name what it protects against. One sentence. Drop the play-by-play of how it was reached.

**Link sparingly.** Mention a file by name only when the reader genuinely needs to open it. Lists of "Touches:" or "See also:" rot. The capability spec is the navigation hub, not the cross-reference graph.

**One home per fact.** Don't restate the same fact in three docs. If you find yourself writing "per ADR-N, per the spec, per the journal," all three are wrong — pick the load-bearing copy.

**No update logs.** Don't append "Update log" sections to doc bodies. Git is the change log.

**No superseded markers in headers.** Status is binary: live or archived. If a decision is no longer in force, archive the file; don't decorate its header with a supersession trail.

**No "Touches:" link farms.** If a decision genuinely touches one file, name it. Beyond that, the reader navigates from the capability.

## Anti-patterns

Ten patterns describe most ways docs decay. The first six are tidying patterns — places where signal got drowned. The last four are writing patterns — habits that produce the decay.

| Pattern | When it fires |
|---|---|
| Stale Questions | An "Open questions" section contains items already resolved by a fact stated elsewhere. |
| Closed Queue Carrying History | A queue file (open / landed / rescinded sections) drowns the open queue under its archive tail. |
| Mixed-State Ledger | A tracking table holds active and retired rows together. |
| Convention Preamble | The "how this works" section in a file is larger than the file's actual content. |
| Done-but-Still-Live | A doc marked `status: done` sits in the live directory instead of `archive/`. |
| Grep-as-Content | Raw search results get dumped as a task list and never get processed. |
| Touches Bloat | Header fields ("Touches:", "See also:") accumulate 6+ cross-references that read as a mini-registry. |
| Decision Archaeology | Status lines or body prose narrate the editorial history of how a decision evolved. |
| Verdict-with-Prose | A single-purpose review file whose only durable value is one word, wrapped in many paragraphs of justification. |
| Split-Home Drift | The same decision lives "primarily" in two files. Both pretend to be the load-bearing copy. They drift. |

When you're about to write something, ask which pattern you're about to fire. If you can't name it, the writing is probably fine. If you can, restructure first.

## Templates

### Capability spec

The most important shape in the project. One file per capability under `product/capabilities/`.

```
---
purpose: One sentence — what this capability is.
layer: what
status: active
---

# {Capability name}

## What this is

One paragraph. Current state only.

## How it works

The mechanism. Names of primitives, fields, surfaces. Diagrams or pseudocode where helpful.

## Intent

Why this shape was chosen. One short paragraph. Name what it protects against.

## Surfaces

Where a user sees or touches this. Bullets, one line each.

## Interactions

What this capability talks to. Bullets, one line each.

## Open questions

Only genuinely open ones. Each is a question, not an answered question kept as a question.
```

### Pattern-doc entry

A section in `PLATFORM-PATTERNS.md` or `DEVELOPMENT-PATTERNS.md`.

```
### {Decision name — verb-led}

**Decision.** What we decided. One sentence.

**Intent.** What this protects against. One short paragraph.

**Touches.** {file or capability that owns the implementation — one entry}
```

No status field. The decision is live by virtue of being in the doc. If a decision becomes inoperative, the entry comes out.

### JOURNAL entry

**Contract.** JOURNAL is a pointer log. Never the load-bearing copy of any decision or fact. If a session produced a fact that needs to be true next quarter, the fact lives in its capability, pattern, or system spec; the JOURNAL line just notes that the file changed. Older entries rotate without loss because nothing here is load-bearing in the first place.

One block per session, newest at top:

```
## YYYY-MM-DD — {one-line title}

Two to three sentences naming the durable docs that changed. Commit hash.
```

No "next session pickup" block. The active work queue lives in `planning/now/`.

Rotation: anything older than 30 days moves to a monthly archive.
