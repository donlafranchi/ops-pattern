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

### newer-decision-wins

**When a newer decision contradicts an older one, the newer one wins and work
continues.** Do not stop to ask Don which is true — he answered when he made the
newer one. Build to the newer ruling; where the older survives in part, build to
the part that survives.

**Structural, not remembered** — a rule agents must recall is a guard nobody runs:

- **Every decision names what it supersedes.** Each `DECISIONS.md` line from
  2026-09-21 on ends with `[supersedes 2026-09-22: headline]`,
  `[supersedes-part F059.2b]` (a criterion, or `F072 story`, or a whole `F073`),
  or `[supersedes none]`.
- **The superseded thing is marked in place, pointing forward** —
  `[superseded-by …]` or `[superseded-in-part-by …]` on the old decision line,
  criterion or section. **Nothing is deleted**: the history is why the current
  direction makes sense.
- **`constraints/<tier>.md` carries only live decisions.** An agent reading its
  own constraints file cannot see the conflict, so the question never arises.
- **`scripts/lint.sh` fails** on a supersede whose target does not exist or does
  not point back, on a forward pointer nothing names, and on a decision since
  2026-09-21 that does not say. It proves itself on
  `scripts/fixtures/markers/supersede-bad/` every run ([guard-proves-itself]).

**Found a contradiction nobody wired?** If the dates differ, the newer wins:
add the supersede tag to the newer line and the forward pointer to the older,
in one commit, and carry on. Wiring a supersession Don already made is
bookkeeping, not a ruling.

**The one case worth raising: two live decisions that conflict and neither
supersedes the other** — the same date, or two rulings on different things that
a case needs both of. Then: mark `[open-question owner=don raised=…]` where the
conflict bites, with A/B and a recommendation; build everything the conflict
does not touch; **never block on a chat message** — it reaches Don through
`STATUS.md` § Open questions. **What an agent never does is split the
difference:** a third position neither ruling took is a decision made without
Don.

**Beside `[don-decides]`, not against it.** That one governs *making* a ruling —
agents recommend, Don decides. This one governs *reading* them: once he has
decided twice, the later one is the decision.

**Which harm:** a decision made without Don — the agent who splits the
difference makes one — and the cost Don named on 2026-09-27: *he has hit this
repeatedly.* **The dated failures:** `socialus-web` #220 (2026-09-26) asked him
to confirm that F078's 2026-09-14 ruling meant what it said over the 2026-09-13
hide-on-report line; F093 (2026-09-23) spent a paragraph arguing it *"reaches a
question the 2026-09-18 ruling did not reach rather than reversing it"* and left
F059 criterion 2b's contradicted clause live, restated in a section of its own.
**A guideline existed and did not prevent either** — `DECISIONS.md`'s header
already said *a reversal is a new line that says what it replaces*.

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

Eight is a result, not a cap. A new absolute needs a dated failure that a guideline
demonstrably didn't prevent, and must name which of the four harms it falls
under. If it can't, it's a guideline. Give it a slug, file it in whichever of the
two pages it belongs to, and cite it by that slug from its first use.
