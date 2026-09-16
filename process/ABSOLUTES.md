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

## Adding an absolute

Six is a result, not a cap. A new absolute needs a dated failure that a guideline
demonstrably didn't prevent, and must name which of the four harms it falls
under. If it can't, it's a guideline. Give it a slug, file it in whichever of the
two pages it belongs to, and cite it by that slug from its first use.
