# atomize — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `_inbox/{name}.md` (the plan or parked decision), `_inbox/README.md`, `REGISTRY.md`, root `CLAUDE.md` (file-naming table), `planning/proposed/` (for grouping + slug collision checks) |
| **Writes** | `planning/proposed/{slug}.md` or `planning/proposed/{plan-slug}/*.md`, `_attic/YYYY-MM-DD-{parent-slug}/`, one `JOURNAL.md` paragraph |
| **Does NOT read** | `web/`, `development/tickets/`, `planning/scenarios/`, `planning/scenarios-backlog/`, system specs, `playbooks/` |
| **Hands to** | None directly. PM ratifies each stub, moves it to `planning/next/` or `planning/now/`, then invokes the `route:` skill. |

## Inputs you read

- `_inbox/{name}.md` — the file the user pointed at. If the user said only "atomize the inbox" without naming a file and `_inbox/` has multiple non-README files, list them and ask which to atomize first. One file per invocation.
- `_inbox/README.md` — for the lifecycle rules and the boundary between "atomize me" docs (plans, parked decisions, work items) and "tidy me" docs (specs, ideas, references).
- `REGISTRY.md` — to check whether any atom overlaps an existing doc that should be extended rather than newly proposed.
- Root `CLAUDE.md` — for the file-and-directory naming table. Stubs follow `kebab-case.md` for single atoms and `NN-kebab-case.md` (zero-padded if 10+) for grouped atoms.
- `planning/proposed/` — to check for slug collisions and to assign the next sequence number if grouping.

## Inputs you do NOT read

- `web/` code — atomize is upstream of any code.
- `development/tickets/` — tickets are downstream of `scope` → `ticket`; atomize never produces tickets directly.
- `planning/scenarios/` and `planning/scenarios-backlog/` — scenarios are `scope`'s output, not atomize's.
- System specs (`product/systems/`, `product/foundation/`, `product/needs/`) — atomize is shape-detection, not content; reading specs tempts the skill to start writing content for the downstream skill.
- `playbooks/` — atomize doesn't ratify decisions, so the patterns and memos aren't its input.

## Workflow

1. **Pick the target file.** If the user named a file, use it. If they said "atomize the inbox" and `_inbox/` has one non-README file, use it. If multiple, list them and ask. One file per invocation.
2. **Read the target.** Frontmatter first (`purpose`, `layer`, `status`), then body.
3. **Classify the shape.** One of:
   - **Multi-item plan** — body contains a list, table, or sequence of distinct items (5+ atomic units). Examples: a sequence draft, a reorg plan, a sprint plan, a multi-phase strategy doc.
   - **Single parked decision** — body is one question/posture/choice awaiting ratification. Examples: the two current `_inbox/` parked-decision files (`discoverability-default`, `platform-extensibility-posture`).
   - **Single-feature draft** — body sketches one new capability or surface that needs a spec or scenarios written. (Rarer — usually these go to `tidy:triage-inbox` for routing to `product/capabilities/` or `product/systems/`.)
   - **Wrong shape — reject.** Body is a system spec draft, a raw brainstorm, or a pasted reference. Stop. Tell the PM this is a `tidy:triage-inbox` case, not an atomize case. Do not produce stubs.
4. **For each atom, draft the stub.** Use the template in `SKILL.md` § Stub template. For each atom:
   - **Title** — verb + object. "Rotate DEVIATIONS for Phase 2," not "DEVIATIONS rotation."
   - **What this is** — one paragraph. The reader should know what gets ratified-and-executed without re-reading the parent plan.
   - **Actions** — concrete verb-led steps.
   - **Side effects** — what cites update, what JOURNAL/REGISTRY edits are needed, what downstream work it unblocks.
   - **Risk** — low / medium / high + one line of why. Mechanical moves are low; multi-spec migrations are medium; absolute-encoding decisions are high.
   - **`route:` field** — pick from the routing table in `SKILL.md`. Upstream-bias when in doubt (decisions before execution).
5. **Decide flat vs. grouped.**
   - **Flat** (`planning/proposed/{slug}.md`) — one atom from a single parked decision or single-feature draft.
   - **Grouped** (`planning/proposed/{plan-slug}/`) — 2+ atoms from a multi-item plan. The dir takes the parent plan's slug.
6. **Write the stubs.** One file per atom. Frontmatter complete. No placeholder text.
7. **Write the index README (grouped only).** At `planning/proposed/{plan-slug}/README.md`. Carry: source-plan pointer, table of atoms with `route:` column and risk column, batching/sequence hints if the parent plan had them, an "Open" section for any atoms whose route was ambiguous.
8. **Archive the parent plan.** Move `_inbox/{name}.md` to `_attic/YYYY-MM-DD-{parent-slug}/{original-filename}`. Add a one-line `RETIRED.md` in that archive dir with a pointer to `planning/proposed/{plan-slug}/` (or to the flat stub).
9. **JOURNAL entry.** One block at the top of `JOURNAL.md` (reverse-chron) in hybrid form — **plain-English headline + context + pointer**. Template:

   ```
   ## YYYY-MM-DD — Atomized {parent-plan plain-English name} into N work items

   Route distribution: weigh×W, scope×S, tidy×T, ticket×K, explore×E. {One sentence on what this unblocks downstream, if non-obvious.}

   → `planning/proposed/{plan-slug}/` (stubs); `_attic/YYYY-MM-DD-{parent-slug}/` (source).
   ```

   Headline-test it: a returning reader should know from the headline what was decomposed, without project jargon.
10. **Hand off.** Print the list of stubs created and their routes. Tell PM the next move: ratify each stub (in whatever order), move from `proposed/` to `next/` or `now/`, then invoke the `route:` skill.

## Shape-detection heuristics

The classification step (#3) is the judgment call. Defaults:

- A doc with a top-level table that lists 5+ work items → multi-item plan.
- A doc whose H1 reads as a question or a posture statement and body is recommendation + rationale → single parked decision.
- A doc that sketches *one* new user-facing capability with example flows → single-feature draft (usually misclassified — verify with PM before producing a stub; this often wants `tidy:triage-inbox` to land it in `product/capabilities/`).
- A doc that drafts a system spec (data model, schema, RLS) → wrong shape. Route to `tidy:triage-inbox` → `product/systems/`. Atomize does not produce system specs.
- A doc that is a raw brainstorm or pasted reference → wrong shape. Route to `tidy:triage-inbox`.

## Routing — pick one upstream-biased route per atom

Re-stated from `SKILL.md` § Routing rules. Order tightens to "what does this atom need next":

1. Does it carry an unratified absolute or a close-call decision? → `weigh`.
2. Does it propose a new system, capability, or substrate that has no spec? → `explore`.
3. Does it propose a user-facing surface that already has a spec but needs scenarios? → `scope`.
4. Is it a mechanical doc move, rename, or directory reorg with the destination already decided? → `tidy`.
5. Is it a substrate-only code change (schema, RLS, action-handler) with a system spec already in place? → `ticket`.

If two rules fire, take the lower number. Decisions before execution. PM can re-route in `proposed/` if the call was wrong.

## Sizing — when to split an atom

A stub should be:
- **One ratify-and-execute unit** — PM can read it, agree or revise, and the downstream skill picks it up without further decomposition.
- **One downstream invocation** — `weigh` once, or `tidy:sweep-docs` once, or `scope` writing one scenario.
- **Reversible alone** — backing it out doesn't require touching other stubs.

If a stub would need 3+ downstream invocations of different skills, it's still a mini-plan. Split it.

## Anti-patterns

- **Writing content for the downstream skill.** Atomize names the route and writes a stub. It does not write the scenario, the memo, the ticket, or the spec. The downstream skill does that work with its own discipline.
- **Inferring routes the parent plan didn't justify.** If the parent plan didn't argue for a specific decision, the stub doesn't either. The stub captures the *question* for `weigh`; `weigh` produces the *answer*.
- **Skipping the archive.** If the parent plan stays in `_inbox/`, the next session will re-atomize the same doc. Archive on first pass.
- **Producing stubs without a route.** Every stub needs a `route:` field. If you can't pick one, the atom doesn't belong in `proposed/` — it belongs in the parent plan's "Open" section.
- **Atomizing a plan that's already been atomized.** Check `planning/proposed/` for an existing dir matching the parent plan slug. If found, stop and tell PM.

## Escalation

| Situation | Action |
|---|---|
| File in `_inbox/` is a system spec or raw brainstorm | Stop. Tell PM this is `tidy:triage-inbox`, not atomize. |
| Multi-item plan has items that don't fit any `route:` | Produce stubs for the routable items; surface the rest in the index README's "Open" section. |
| Parent plan slug collides with an existing dir in `planning/proposed/` | Stop. PM decides: merge or rename. |
| Atom looks like both a scenario and a substrate ticket | Take the upstream route (`scope`). Substrate is for floor under surfaces, not a backdoor around scoping. |
| Two stubs would be near-duplicates | Fold into one before writing. One doc, one home. |

## Hand off

**You produced:**
- One or more stubs in `planning/proposed/` (flat or grouped).
- An index README (grouped only).
- The parent plan archived to `_attic/YYYY-MM-DD-{parent-slug}/`.
- A JOURNAL.md paragraph.

**Next skill:** none. PM ratifies stubs one at a time and invokes the named `route:` skill for each.

**Commit choreography (Claude Code).** Atomize runs in Claude Code; it commits its own work. After writing the stubs, archiving the parent, and updating JOURNAL, ask the PM:

> *Ready to commit atomization of `{parent-plan}` on branch `main`?*
> *Message: `docs(pipeline): atomize {parent-plan-slug} into N proposed stubs`*
> *(y/n)*

On y, run the commit (parent repo only; never cross-commit). On n, PM amends or defers.

**Lock pre-flight.** Before any read-or-write work, run `ls .git/index.lock .git/worktrees/*/index.lock 2>/dev/null`. If anything prints, stop and ask the PM to run `clearlock` first.

## Final report

Default report shape is three lines:

    Status: Done | Blocked | Question — <plain-English one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."

Drop running narration ("Now doing X." "Starting Y." "Committing Z."). Name items in plain English; put the ID in parens if it matters. Withhold commit hashes, file lists, lane counts, per-step trace until the PM says "expand." On "expand," return detail in priority order — ask → high-level outcomes → references → notes — stopping at each section for "more."
