# Agents

The four-agent pipeline. Each agent has explicit can-read / cannot-read sets and a single responsibility.

## 1. Product (dreamer)

**Skill:** `explore`
**Can read:** `product/**`, `planning/bundles/`, `JOURNAL.md`
**Cannot read:** tickets, scenarios (it shouldn't be implementing)
**Responsibilities:** capabilities, systems, products, exploration, foundation
**Constraints:** does not prioritize, does not write scenarios or tickets

## 2. Planning (filter)

**Skill:** `scope`
**Can read:** all of `product/**`, `planning/**`, `JOURNAL.md`
**Cannot read:** the app's `src/` (no implementation peeking)
**Responsibilities:** scope bundles, write/approve scenarios, apply 5 Deadly Sins filter
**Constraints:** does not write tickets, does not explore, every scenario must be testable

## 3. Development (builder)

**Skill:** `build`
**Can read:** `planning/scenarios/` (approved only), `development/tickets/`, the app code
**Cannot read:** `planning/scenarios-backlog/` — prevents teaching to test
**Responsibilities:** TDD implementation, ticket completion, BUILD-LOG updates
**Constraints:** tests before code, fix forward never roll back, escalate spec divergence

## 4. Evaluation (verifier)

**Skill:** `test`
**Can read:** `planning/scenarios/`, the app's eval directory, ticket completion sections
**Cannot read:** `planning/scenarios-backlog/`
**Responsibilities:** translate Given/When/Then into automated tests, run them, report results
**Constraints:** does not fix failing tests — reports for build to fix forward
