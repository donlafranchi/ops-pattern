---
id: how-trim-skill
name: trim
description: Act as the product-doc trimmer. Use on a periodic sweep of product/foundation, product/needs, product/systems, and product/ui to cut anything the code already answers — table, column, route, RLS policy, or tier-by-tier ticket list — leaving only why: invariants, refusals, and reasoning nobody would guess from the schema. Triggers on "trim the product docs", "why-only sweep", "this doc is describing the schema", "product docs are drifting long". Reads product/ and the code in socialus-web read-only. Writes product/ and one-line IMAGINE.md entries. Pauses for a yes/no before deleting anything from product/systems. Never writes scenarios, Issues, or code.
---

# trim

Product-doc trimmer. Keeps `product/` holding *why*, not *what the code already says*.

## The standard

A `product/` doc holds invariants, refusals, and reasoning nobody would guess from the schema. Anything describing a table, a column, a route, an RLS policy, or a tier-by-tier ticket list is code's job — the code is truth (`CLAUDE.md`), and a doc restating it goes stale the first time the code moves.

The test on any paragraph: **would a competent engineer reading `socialus-web` already know this?** Yes → cut. No → it's why; keep.

## When to use
- A periodic sweep — every few weeks, or when a doc has visibly grown.
- After a stretch of build that changed schema, leaving the docs describing it half-true.
- When `sync`'s sprawl check flags `product/` growth it can't fix mechanically.
- **Not for** writing a new invariant (that's `plan`), or for a doc that's wrong rather than long — fix that in the session you noticed it (`CLAUDE.md`), don't wait for a sweep.

## Constraints (hard)
- **Pause before deleting from `product/systems/` specifically.** These carry the densest ratified reasoning in the repo. List per file what stays and what goes, ≤3 lines per file, get a yes/no, then delete. The pause is a step, not a formality — don't skip it because it's now written down.
- **Anything genuinely speculative goes to `IMAGINE.md` first** — one line per idea, before it's deleted anywhere.
- Line budgets are a signal to look, never a quota to hit. Never pad to reach one; never cut real *why* to get under one.
- Read the code to check a claim; never write to `socialus-web`.
- Do not write scenarios, Issues, or `DECISIONS.md` lines. A ruling the sweep surfaces goes to `plan`.

## Workflow
See `workflow.md`.

**Produced:** trimmed `product/` docs, any `IMAGINE.md` lines rescued, one `docs:` commit, `scripts/lint.sh` clean.

**Next skill:** `plan`, if the sweep surfaced a question or a ruling that needs one.

## Related skills
- `plan` — writes `product/` to this standard as it goes; owns `DECISIONS.md`.
- `sync` — the mechanical sprawl sweep. `trim` is the judgment half; `sync` calls it when the docs need one.
