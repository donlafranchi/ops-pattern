# One skill per living document — a design note

**2026-09-15. A design, not a build.** Don's ask: *"skills for each of these documents that we're counting on to keep us up to date, solely responsible for their one document, and hopefully hooks."*

**The headline: three skills, three retirements, and one hook that is actually reliable.** Writing a skill to maintain a document nobody reads costs more than deleting the document.

---

## The test each document has to pass

**Who reads it to be right?** That is `CLAUDE.md`'s own rule, and it is why REGISTRY, MAP, TRACE, STAGE-LEDGER and JOURNAL all died here. A file a person consults to settle a question goes stale between being written and being read, and then it lies. A file only a script compares is safe, because nothing believes it.

So: **a document earns a skill only if someone reads it to be right AND it cannot simply be generated.** If it can be generated, generate it. If nobody reads it, kill it.

---

## Build a skill — three

| Document | Why it earns one | What the skill does |
|---|---|---|
| **`WHERE-IT-IS.md`** *(ops-pattern)* | Don works from it. Two thirds is joins over data; one third is judgement no script has. | Runs `scripts/state.sh`, then reads code to write *What we're building toward* and the at-risk rows. Overwrites whole; never patches a row. |
| **`docs/copy-inventory.md`** *(socialus-web)* | It is the authority on every string the app shows, and F084 depends on it. **Already the right shape** — an extractor produced it. | Re-runs the extractor, diffs against the committed inventory, and reports what copy changed. Also runs the person-noun and em-dash checks from `nouns.md`. |
| **`product/` spine** | Already has one — `trim`. Named here so nobody writes a second. | Unchanged. |

**One skill, one document, and it overwrites.** A skill that appends is a skill that builds an archive nobody reads.

---

## Retire — three, and this is the more valuable half

**`STATUS.md` — kill it.** Its stated job is *"what is true now. One screen."* That is now `WHERE-IT-IS.md`'s job, done better and with evidence per row. It has been stale since 2026-09-08 and describes a product that predates the report path, the waitlist, tags, and every ruling of the past ten days. **Two documents answering one question is the exact failure this repo names as its own.** Fold anything still live into `WHERE-IT-IS.md` and delete it. Do not write a skill to maintain it.

**`HANDOFF.md` — killed 2026-09-16.** It was one line per approved scenario, every field derivable from scenario frontmatter plus `gh`, and it had already gone wrong on F076. Nothing replaced it: scenario frontmatter and the Issue list are the sources, and `STATUS.md` is now generated from them.

**`BUILD-LOG.md`'s index — kill the index, keep the per-ticket files.** The index still names the project `movers-makers-shakers/web` and points at `planning/now/bundle-1.md`, which does not exist. It is a hand-maintained index, the exact pattern lesson 2 killed. **The per-ticket files under `build-log/` are fine and need no skill** — they are append-only artifacts of work done, and nobody reads them to be right.

**`JOURNAL.md` — already dead**, and correctly. Nothing to do; named so it is not resurrected.

## Never skill these

`DECISIONS.md` and `LESSONS.md` are append-only and hand-written by design — regenerating either would destroy the record. `ROADMAP.md` is sequencing judgement, not derivable. `accepted-risks/` is already script-diffed and read by nothing that believes it.

---

## Hooks — what actually fires

**Be honest about which get skipped.**

| Hook | Reliable? | Verdict |
|---|---|---|
| **GitHub Action on PR to `socialus-web`** | **Yes.** Runs on every PR regardless of who opens it or what they have installed. | **Use this.** It is the only one that cannot be skipped. |
| **GitHub Action on push to `main`** | **Yes**, same reasoning. Both repos have remotes. | Use for regenerating facts after a merge. |
| **Local `post-merge` hook** | **No.** A squash-merge through the GitHub UI never touches anyone's machine, so it would not have fired for a single merge this week. | Do not build. |
| **Local `pre-commit`** | **Weak.** `core.hooksPath` can be committed, but every clone must opt in and `--no-verify` skips it. | Only as a fast local echo of a check CI already enforces. |
| **Scheduled Action** | Technically reliable. | **Amended 2026-09-19 — allowed, with one condition.** See below. |

**The scheduled-Action refusal, amended 2026-09-19.** It read: *"regenerating on a schedule produces a document that accumulates and rots between reads. On demand, overwritten."* **The second half was right and the first half was aimed at the wrong target** — and between them they talked this design out of the only hook that actually fires. `STATUS.md` is overwritten wholesale, so it cannot accumulate; the real risk named here is the other one, a file whose date says *today* when nothing in it moved. **So the condition is on the commit, not on the schedule: a scheduled run regenerates freely and commits only when the content changed.** A new revision of the file then always means something moved. Written up as a dated line in `DECISIONS.md`; built as `.github/workflows/status.yml`.

**What the refusal got right, and what it cost.** *"On demand"* was the correct instinct and the wrong mechanism: the on-demand path was a skill nobody installed, so the document was never regenerated at all (lesson 27). A refusal that leaves a document with no working trigger is worse than the rot it was guarding against.

**The important design point: the reliable hook is not "regenerate the doc." It is "fail the PR when a document's claim has become false."** That is the pattern this repo has already learned works — the person-noun lint, the migration drift check, `advisor-diff.sh`. A generated document nobody believes is safe; a check that blocks a merge is what actually holds a rule.

**Concretely, three CI checks worth having**, in order of value:

1. **Doc-claim check on PR.** If a PR closes an issue that a living document still lists as *to build*, fail with the line number. Cheap, and it would have caught the F076 drift the day it happened.
2. **String check on PR** — person-nouns, em dashes, "corner", corporate transitions. Already specified in `nouns.md`; unbuilt.
3. **Facts refresh on push to main.** Runs `state.sh`, commits the generated block. **Cross-repo write needs a token**, which is the one real obstacle — the alternative is `state.sh` running locally and the skill committing.

---

## Sequence

1. **`scripts/state.sh`** — the joins and the four method checks. *(Building now; `socialus-web` #96.)*
2. **Done 2026-09-16, differently; corrected 2026-09-19.** `HANDOFF.md` is deleted outright. `STATUS.md` is not retired but regenerated — a dated, disposable report built from `state.sh` plus scenario frontmatter, `accepted-risks/` and the ontology registry. **The `status` skill that was to produce it is deleted:** it was never installed, so it never ran, and its judgement is encoded in `scripts/status.sh` as rules a script cannot forget. `WHERE-IT-IS.md` absorbed neither.
3. **The `WHERE-IT-IS` skill**, wrapping the script.
4. **The string check on PR** — highest-value hook, already specified.
5. The copy-inventory skill.
