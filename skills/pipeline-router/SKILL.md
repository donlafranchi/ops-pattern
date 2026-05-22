---
name: pipeline-router
description: Orient at the start of a session in any project using the agent pipeline (Product → Planning → Development → Evaluation). Use when the user says "where are we", "what's the state of this project", "what needs attention", or at the start of any pipeline work to determine which downstream skill applies. Reads the project's root CLAUDE.md, JOURNAL.md, and current bundle to ground the conversation.
---

# pipeline-router

Project-agnostic orientation skill. Routes work to the right pipeline role.

## When to use
- Start of any session in a project that uses the four-agent pipeline.
- User asks "what's going on", "what's next", "where did we leave off".
- Before invoking `pipeline-product`, `pipeline-plan`, `pipeline-build`, or `pipeline-eval` — confirm the right role first.

The session-start check includes a **registry-conformance step** (per `workflow.md` step 9): if the project has a `REGISTRY.md` at the root, verify that every narrative `.md` carries front-matter (`purpose` + `layer` + `status`), has a row in the registry, and that no row points at a missing file. Surface gaps as flags — lightweight orientation, not enforcement.

## Workflow
See `workflow.md`.

## Related skills
- `pipeline-product` — exploration, systems, capabilities
- `pipeline-plan` — scenarios, scope, approval
- `pipeline-review` — architecture + design pre-flight on approved scenarios
- `pipeline-ticket` — break approved scenarios into implementable tickets
- `pipeline-build` — TDD ticket implementation
- `pipeline-eval` — acceptance test authoring + execution
- `pipeline-scaffold` — set up a new project with this pipeline

## Hand off

**You produced:** orientation — what's going on, what needs attention, which downstream skill to invoke.

**Next skill:** whichever the routing table in `workflow.md` points to. Do not implement; route and hand off.
