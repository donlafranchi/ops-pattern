# Process absolutes

How work is done. The member-facing absolutes are in
`../product/ABSOLUTES.md`; the test below governs both files.

**The test.** A rule is absolute only if breaking it once causes harm the next
session can't undo. Four kinds of harm qualify: harm to a member, loss or
exposure of production data, a public act that can't be unpublished, a decision
made without Don. Everything not on these two pages is a guideline — break it
when justified and say why in the PR or the scenario.

**Cite an absolute by its slug in brackets — `[production-asks-don]`, never
"rule 3".** Numbers renumber and citations to them rot silently; slugs do not.
`scripts/lint.sh` fails on any bracketed slug in the repo with no matching `###`
heading in one of these two files, so a rename breaks the build instead of
leaving a pointer that reads fine and means nothing.

## Production

### production-asks-don

Anything that reaches production or can't be undone — deploy to main,
destructive migration, deleting data, rewriting history — asks Don first.

## Public

### public-is-draft

Anything public — user-facing copy, a published page, a claim about what the app
does — is a draft until Don says otherwise.

## Authority

### don-decides

Don makes the calls. Scope changes and reversals of a prior ruling go to him as
options with a recommendation; agents recommend, they don't decide.

### ruling-is-dated-line

A ruling exists only when it is one dated line in `../DECISIONS.md`. The code
says how; `DECISIONS.md` says why; a doc that disagrees with either is the thing
that's wrong.

## Verification

### guard-proves-itself

**A check may not be relied on until it has been observed rejecting input that
should be rejected.** Until then it is inert, and an inert guard counts as
absent — not as weak, as *absent*. Green is not evidence: every guard below was
green throughout.

**What relying on it means:** citing it as the reason something is safe, letting
it gate a merge, or writing it into `CLAUDE.md` as a thing agents watch for.

**What discharges it.** A guard ships with a case that *makes it fail*, run by
the same job that runs the guard — a known-bad fixture the check must reject, so
the failure path executes on every run and not only on the day it matters. Where
that is genuinely impossible, the PR links a run where the guard actually
failed. **No link and no failing fixture means the guard is not yet a guard**,
and nothing may be built on it.

**The dated failures, all within two days, which is what makes this a category
rather than three bugs** *(2026-09-19 to 2026-09-21)*:

- **The migration preflight parser** never worked in CI at all. `supabase
  migration list` renders markdown when stdout is not a TTY, so every cell
  arrived backtick-wrapped and the parser required bare digits. It failed
  closed, correctly, every time — and **the first migration it ever guarded is
  the one it blocked.** Above it sat a green test asserting the script's *text*
  contained the right strings.
- **`migrations (check)`** was broken by an unpinned Supabase CLI. **Its absence
  is what let a merge land ahead of its migration and take production down on
  2026-09-21.**
- **`issue-lint`** cannot match across the `**` in `**Kind:**` that its own
  template emits, so every templated issue is judged non-compliant; and with no
  `permissions:` block the labelling call returns 403 and kills the run. **The
  `needs-fix` label that `CLAUDE.md` tells agents to watch for has never once
  been applied.**

**Which harm:** harm to a member, and production data. The 2026-09-21 outage is
the dated failure — members could not use the product, and no later session can
undo downtime that already happened. **A guideline did not prevent it**: lessons
28 and 29 each name one instance, both were written, and the third instance
happened anyway. **That is the argument for an absolute rather than a third
lesson** — the pattern had already been described twice in prose and described
again is not a hook (lesson 17).

## Adding an absolute

Six is a result, not a cap. A new absolute needs a dated failure that a guideline
demonstrably didn't prevent, and must name which of the four harms it falls
under. If it can't, it's a guideline. Give it a slug, file it in whichever of the
two pages it belongs to, and cite it by that slug from its first use.
