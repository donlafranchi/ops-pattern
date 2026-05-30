---
id: how-atomize-skill
name: atomize
description: Bridge between Cowork strategy and Claude Code execution. Reads a plan or parked-decision doc in `_inbox/`, decomposes it into ratify-and-execute stubs in `planning/proposed/`, archives the parent. Triggers on "atomize the inbox", "atomize `_inbox/{name}.md`", "decompose this plan", "break this plan into proposed items", "materialize the inbox", "intake the plan". Reads only `_inbox/`, `REGISTRY.md`, `CLAUDE.md`, the file-naming table, and the file the user pointed at. Writes only into `planning/proposed/` and archives the parent to `_attic/YYYY-MM-DD-{slug}/`. Does not ratify decisions, does not write scenarios, does not write tickets — produces the proposed stubs that PM ratifies and downstream skills (`weigh`, `scope`, `tidy`, `ticket`) pick up.
---

# atomize

Project-resident pipeline-front skill. Translates `_inbox/` plans and parked decisions into atomic, ratify-and-execute stubs in `planning/proposed/` — the lane between untriaged drafts and PM-ratified queued work.

**The one question.** *What are the smallest independent items this plan should become, and which downstream skill picks each one up?*

## When to use

- A multi-item plan sits in `_inbox/` (a sequence draft, a reorg plan, a strategy doc) that needs decomposition before anything downstream can act on it.
- A single parked decision sits in `_inbox/` that needs a proposed-lane stub so PM can ratify it through `weigh` or route it to a system spec.
- The PM has been thinking in Cowork (via `explore`, `weigh`, `scope`) and the output is a plan-shaped doc that needs to become work items.
- An item is sitting in `_inbox/` that is *clearly a work item* (not a raw draft, not a spec) and needs a home in the kanban lanes.

## When NOT to use

- The doc in `_inbox/` is a draft system spec or capability — route to `explore` instead.
- The doc is a raw idea, a brainstorm sketch, or a pasted reference — route to `tidy:triage-inbox` to find its home (which may or may not be a planning stub).
- The doc is an architectural decision reversal — route to `memo`.
- An already-approved scenario sits in `planning/scenarios/` and needs tickets — that's `ticket`'s job, not atomize.
- A ratified item sits in `planning/proposed/` waiting to move — PM moves it manually to `next/` or `now/`; atomize does not orchestrate lane progression.

## Constraints (hard)

- Read only `_inbox/`, the file the user pointed at, `REGISTRY.md`, root `CLAUDE.md` (for the file-naming table), and `planning/proposed/` (to assign sequence numbers if grouping).
- Write only into `planning/proposed/` and `_attic/YYYY-MM-DD-{slug}/` (when archiving the parent plan).
- Never read or write `web/` code, `development/tickets/`, `planning/scenarios/`, `planning/scenarios-backlog/`, or any system spec — atomize is a routing skill, not a content skill. The downstream verb skill produces the actual content.
- Every stub carries a `route:` frontmatter field naming the single downstream skill that picks it up after PM ratify: `weigh`, `scope`, `tidy`, `ticket`, or `explore`.
- One pass per parent plan. If the plan contains items that don't fit any downstream route, surface them in the index README's "Open" section — do not invent a route.
- Do not ratify, do not execute, do not invoke the downstream skill. Atomize stops at proposed-lane handoff.

## Workflow

See [`workflow.md`](workflow.md).

## Output shape

For a multi-item plan, atomize produces a sub-directory in `planning/proposed/` named after the parent plan, containing one stub per atom plus an index README:

```
planning/proposed/
└── {plan-slug}/
    ├── README.md              # index: what's here, source plan, route map
    ├── 01-{slug}.md           # atom 1, with route: tag
    ├── 02-{slug}.md           # atom 2
    └── ...
```

For a single parked decision or single-feature draft, atomize produces a flat stub:

```
planning/proposed/
└── {slug}.md                  # one atom, with route: tag
```

## Stub template

Every stub carries this frontmatter and section structure:

```markdown
---
purpose: One-sentence what-this-is.
layer: how
status: proposed
route: weigh | scope | tidy | ticket | explore
source: _attic/YYYY-MM-DD-{parent-plan-slug}/{filename}.md (or in-place if archived later)
risk: low | medium | high
---

# {Title}

## What this is

One paragraph. The atomic unit — what gets ratified-and-executed as a single thing.

## Actions

- Concrete steps to execute once PM ratifies.
- Each one a verb + object.

## Side effects

- What else has to update (cites, REGISTRY, JOURNAL).
- What downstream work this unblocks.

## Risk

One line. Why low / medium / high.

## Source

Pointer back to the parent plan (its archived path or the in-place link).
```

## Routing rules

| Shape of atom | `route:` | Downstream behavior |
|---|---|---|
| Architectural decision, close-call, or unratified absolute | `weigh` | PM invokes `weigh` to ratify with State-tagged Intent |
| Feature scope decision (which Then-clauses, which canonical example) | `scope` | PM invokes `scope` to write scenarios |
| Mechanical doc move, rename, dir reorg, frontmatter sweep | `tidy` | PM invokes `tidy:sweep-docs` to execute |
| Direct schema/code work with no new scenario surface (substrate lane) | `ticket` | PM invokes `ticket` to write substrate tickets bound to a system spec |
| Net-new system or capability that needs a spec written | `explore` | PM invokes `explore` to write the system spec |

If an atom genuinely fits two routes (e.g., it's both a decision and a rename), pick the upstream one — decisions before execution. PM can re-route when ratifying.

## Hand off

**You produced:**
- One or more stubs in `planning/proposed/` (flat or grouped under `{plan-slug}/`).
- An index README at the group level if grouped.
- The parent plan archived to `_attic/YYYY-MM-DD-{parent-slug}/` with a pointer to where its atoms went.
- A JOURNAL.md entry (one paragraph) naming the plan that was atomized, the atom count, and the route distribution.

**Next skill:** none. PM ratifies one stub at a time:
- PM reads the stub, agrees or revises.
- PM moves the file from `planning/proposed/` to `planning/next/` (queued) or `planning/now/` (in flight).
- PM invokes the `route:` skill, which picks up the file from its new lane.

**The proposed lane is not parked work.** A stub older than ~2 weeks in `planning/proposed/` is a flag — either ratify it, reject it, or move it to `planning/later/`. Atomize does not enforce this; `orient`'s drift check should.

## Related skills

- `tidy:triage-inbox` — drains `_inbox/` for docs that are NOT plans (specs, drafts, ideas). Atomize handles plan-shaped and decision-shaped inbox items; tidy handles everything else.
- `weigh`, `scope`, `tidy`, `ticket`, `explore` — the downstream verb skills that each `route:` tag names.
- `orient` — surfaces stale entries in `planning/proposed/` during the drift check.
