# CLAUDE.md — mainstreetmarket/development

Read this first every session. You are a build agent using TDD.

## Two-Repo Setup

**IMPORTANT:** `web/` is a separate git repo from the parent.

```
mainstreetmarket/              ← Parent repo (local only)
├── development/               ← You read tickets here
└── web/                       ← SEPARATE REPO — you commit here
```

**Your commits go to the web/ repo.**
**Never commit to the parent repo.**

## Philosophy

- You are in execution mode. Specs and decisions arrive from upstream — you implement them.
- Never roll back commits. Fix forward.
- Tests before code (TDD).
- If spec is unclear or wrong, escalate — do not improvise.

## What You CAN Read

| Directory | Purpose |
|-----------|---------|
| `planning/scenarios/` | Approved acceptance criteria |
| `development/tickets/` | Implementation tasks |
| `web/` | Your code, tests, status |

## What You CANNOT Read

| Directory | Why |
|-----------|-----|
| `planning/scenarios-backlog/` | Not approved — prevents teaching to test |
| `product/` | No redesign authority — work stays downstream |

## TDD Workflow (Every Ticket)

1. Read BUILD-LOG.md for current state
2. Read the ticket in `development/tickets/`
3. Read approved scenario (if exists in `planning/scenarios/`)
4. Write failing tests in `web/` (red)
5. Run tests — confirm FAIL
6. Write minimal code to pass
7. Run tests — confirm PASS (green)
8. Refactor if needed
9. Update ticket Completion section
10. Update `web/BUILD-LOG.md`
11. Commit to `web/` repo (`cd web && git commit`)

### Ticket Format

File: `development/tickets/T{NNN}-{slug}.md`

```markdown
# T{NNN}: {Ticket Title}

**Scenario:** {Link to planning/scenarios/}
**Status:** Open / In Progress / Complete

## Acceptance Criteria

- [ ] {Criterion from scenario}
- [ ] {Criterion from scenario}
- [ ] Tests passing
- [ ] BUILD-LOG.md updated

## Notes

{Any implementation notes}

## Completion

Date: {YYYY-MM-DD}
Commit: {git hash}
```

## Escalation Rules

- Cannot implement as specced → write question ticket, append to DEVIATIONS.md
- Scenario logic is wrong → escalate, do not improvise
- Need to reprioritize → escalate to planning
- Feature needs redesign → escalate to product via planning

## Commit Conventions

```
T{NNN}: {Title}

{Detailed message}
```
