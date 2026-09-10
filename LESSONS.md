# Lessons — why this repo is the shape it is

Read before proposing any change to structure or process. Each lesson names the evidence. If a proposed change contradicts one, the proposal must say why the lesson no longer holds.

## What we learned, May–September 2026

1. **Docs checked against docs fail; docs checked against code hold.** Every gate compared a document to the one above it. Not one asked "is this still true." Explore had two tickets built after it was retired. — *retro 2026-09-03*
2. **A catalogue goes stale faster than what it catalogues.** REGISTRY, MAP, TRACE, STAGE-LEDGER, JOURNAL all retired within four months, each replaced by a smaller one. — *CLAUDE.md 2026-09-07*
3. **Absolutes multiply on their own.** 1,650 must/never/mandatory words in live docs by September; 15 numbered mandatory rules in the router; three gates to ratify the absolutes. Each one was reasonable alone. Agents obeyed the wording, not the intent. — *count 2026-09-09*
4. **"Mandatory" in one file and "optional" in the file that fires it means optional.** Review was mandatory in CLAUDE.md and optional in `review/workflow.md`. F044 and F045 shipped unreviewed. — *retro §2b*
5. **A gate judged by the party it constrains is not a gate.** M3 accessibility review was a build-time self-declaration. It was N/A'd. — *retro §2b*
6. **The reorg is the churn.** Six reorganisations May–September. Each left citations to the previous layout, which is what "stale vs current" confusion actually was. — *`_attic/2026-05-*`, `archive/2026-09-*`*
7. **Half-implemented documents confuse everyone.** A spec that describes the whole system with some of it built reads as truth to an agent. Split into as-built (matches code) and intent (a scenario with a status).
8. **Lane-by-directory needs a human to move files.** Four kanban dirs meant Don moved files on a Mac he wasn't at. State in a frontmatter field can be set from anywhere.
9. **Two agents in one working tree collide.** `index.lock` wedges, `clearlock`, commit lines handed to Don. Root cause was `web/` nested in the planning checkout, not git. Separate repos, separate clones.
10. **Nothing put work in front of Don.** Seventeen commits between pushes; five days of UI landed wrong at once. Push after every merge; a preview link beats an audit.
11. **What agents need is grep-able; what Don needs is one screen.** STATUS.md worked from day one because it is overwritten and short. Everything that appended, grew.
12. **Retired work is prior art, not a mistake.** The vendor model's analytics answered a question that came back in September. Git keeps it; the tree doesn't have to. — *writing-docs 2026-09-08*
13. **A pattern done by hand once is a pattern done differently next time.** The 2026-09-09 session classified work against PIPELINE.md, split an oversized scenario, folded reviews into the scenario's own frontmatter, trimmed `product/` to why-only, and regenerated README.md — all improvised, none written into a skill. The next session had no way to repeat any of it. — *skills sweep 2026-09-09*
14. **The principle arrived before the structure.** "Code is truth, three durable documents, everything else is a liability" was written 2026-09-07. This revamp is that principle applied, not a new idea.
15. **Skills that live nowhere load nowhere.** The six skills written 2026-09-09 sat in `ops-pattern/skills/`, which Claude Code does not read — it reads `.claude/skills/`. Meanwhile `~/.claude/skills/` held twelve symlinks into the retired `community` checkout, so every session in both repos loaded the retired pipeline (`orient`, `scope`, `weigh`, `atomize`, `tidy`) and none of the new one. Two of those links were already broken. Skills now live in `~/Projects/skills` and are symlinked per repo by `link.sh`. — *skills audit 2026-09-09*

## Guardrails for the next change

- Name the failure, with a dated example, before proposing the fix. No fixes for imagined failures.
- Small process fixes any time, with a named failure. Reorganising the tree is rare: one session, git tag first.
- Prefer deleting a doc to adding a rule. Prefer a status field to a directory. Prefer a check against code to a check against a doc.
- New absolute → a dated failure a guideline did not prevent, filed under one of the four harms in RULES.md.
- If Don had to do something at the Mac, that's a bug in the process.
- Every change lands here first as a lesson, then in the structure.
- A standard exists when lint or CI checks it, not before.

14. **One kind of work is not enough.** Bugs, UX changes and process fixes were forced through the scenario pipeline or fell outside it. — *2026-09-10*
15. **A rule with no hook is a wish.** Every guideline names the skill, lint, or Action that fires it. — *2026-09-10*
