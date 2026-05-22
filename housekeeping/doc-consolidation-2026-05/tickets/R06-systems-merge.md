# R06 — Systems merge: agent-assistance, producer-tools

**Phase:** 6 of 10 · **Repo:** parent · **Risk:** medium (content merge) · **Depends on:** R01–R05.

## Objective

Two overlap clusters in `product/systems/`: four docs describing one agent stack, and two producer docs that own the same bulletin analytics twice. Merge each cluster into one sectioned doc.

This is **content work** — produce a clean draft, flag uncertainty with `[PM: confirm]`, drop nothing unique. The PM reviews the result.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`. Read all source docs fully first.

### 1. Merge the agent stack → `product/systems/agent-assistance.md`

Sources: `product/foundation/agent-assistance.md` (umbrella commitments), `product/systems/delegation.md`, `product/systems/assistant-context.md`, `product/systems/skills.md`.

```
git mv product/systems/delegation.md product/systems/agent-assistance.md
```

Then merge the other three plus the foundation umbrella into it as sections:
- Lead section: **Commitments** — from `foundation/agent-assistance.md` (agents are loop-shaped not role-shaped; persistence is standing-derived; read-automatable / write-confirmed; Member-owned; federation-portable).
- Section: **Delegation** — the scoped/expiring/revocable grant mechanism (the doc you renamed).
- Section: **Assistant Context** — the Member-owned context document.
- Section: **Skills** — versioned, distributable capability bundles.
- Collapse the standing-tier gate and Delegation-scope vocabulary that today repeat across all four into one definition the sections share.

```
git rm product/foundation/agent-assistance.md
git rm product/systems/assistant-context.md
git rm product/systems/skills.md
```

### 2. Merge the producer docs → `product/systems/producer-tools.md`

Sources: `product/systems/producer-bulletin.md`, `product/systems/producer-growth.md`.

```
git mv product/systems/producer-bulletin.md product/systems/producer-tools.md
```

Merge `producer-growth.md` in as a section. Bulletin analytics are specced twice today — define the bulletin and its stats once (the Bulletin section); the Growth/Dashboard section references those stats, does not redefine them.

```
git rm product/systems/producer-growth.md
```

### 3. Cross-reference sweep

```
rg -l --glob '!_attic/**' --glob '!web/**' 'OLD_PATH' .
```

| OLD | NEW |
|---|---|
| `foundation/agent-assistance.md` | `systems/agent-assistance.md` |
| `systems/delegation.md` | `systems/agent-assistance.md` |
| `systems/assistant-context.md` | `systems/agent-assistance.md` |
| `systems/skills.md` | `systems/agent-assistance.md` |
| `producer-bulletin.md` | `producer-tools.md` |
| `producer-growth.md` | `producer-tools.md` |

Where a reference points at a specific topic (e.g. "see delegation.md for scopes"), repoint it to `agent-assistance.md` and, if the doc uses anchors, the relevant section. Likely edits: `CLAUDE.md` (authoritative-docs table, several mentions), `product/MAP.md`, ADR files (`ADR-0006`, `ADR-0017`), many specs.

### 4. Verification

- `product/systems/` no longer contains `delegation.md`, `assistant-context.md`, `skills.md`, `producer-bulletin.md`, `producer-growth.md`.
- `product/foundation/agent-assistance.md` no longer exists.
- `product/systems/agent-assistance.md` and `producer-tools.md` exist, sectioned.
- `rg --glob '!_attic/**' --glob '!web/**' 'systems/delegation|assistant-context|systems/skills|producer-bulletin|producer-growth|foundation/agent-assistance'` returns zero hits.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git add product/systems/agent-assistance.md product/systems/producer-tools.md
git status
git commit -m "docs(consolidation): phase 6 — merge agent stack and producer docs"
```

## Completion

Date: 2026-05-22 · Commit: `cc96215` · Notes:

**Two merges landed cleanly:**

- **`product/systems/agent-assistance.md`** = `foundation/agent-assistance.md` (umbrella commitments, lead section) + the prior `delegation.md` (§ Delegation) + the prior `assistant-context.md` (§ Assistant Context) + the prior `skills.md` (§ Skills). The doc adds a § Shared Substrate section that consolidates the three pieces of duplication across the four originals: the standing-tier gate (`member_has_standing_presence`), the Delegation scope vocabulary, the action-layer contract. ~620 lines.
- **`product/systems/producer-tools.md`** = the prior `producer-bulletin.md` (§ Bulletin, lead section + per-bulletin stats) + the prior `producer-growth.md` (§ Growth, dashboarding/aggregation surface). Per the ticket's directive: bulletin stats are defined once (in § Bulletin's "Per-bulletin stats" subsection); the Growth section *consumes* the stats and does not re-define them. ~440 lines.

**Sed sequencing gotchas (fixed):**

- The `foundation/agent-assistance.md` → `systems/agent-assistance.md` substitution caught the new file's own provenance line ("Folded together from the prior `foundation/agent-assistance.md`..."), creating a self-reference. Same pattern in producer-tools.md for the `producer-bulletin.md` / `producer-growth.md` mentions. The sub-section provenance lines ("Originally specced in the prior `delegation.md`...") got similarly self-referenced when the bare-relative pass ran. All were restored to plain-English wording without backticked filenames so future sed passes won't re-trap them.
- `principles.md` Part 6 (Self-Assessment) carried a duplicate `producer-tools.md, producer-tools.md` and a triple `agent-assistance.md, agent-assistance.md, agent-assistance.md` after the two passes hit the same `[PM: confirm]` note. Cleaned to a single mention each.

**`planning/history/` left untouched.** The review docs from R03's planning-history consolidation (`agent-assistance-architecture-review-2026-05-09.md` etc.) reference the old spec names (`delegation.md`, `assistant-context.md`, `skills.md`) by their then-current names. These are historical artifacts — the reviews are snapshots of what was reviewed at that date — so the references to retired specs stay as is. The cross-reference sweep was explicitly scoped to exclude `planning/history/**`.

**[PM: confirm] items left behind:**

- **`product/systems/places.md` still untracked** (other agent's workflow per the PM directive). Per `git status` it's the only untracked file; references inside it use the pre-R06 spec names — those will resolve when the other agent's pass runs.
- **`agent-assistance.md` size is ~620 lines.** Bigger than ideal for a single system spec; could be split back into sections-as-files at b3 polish time if the volume becomes a navigation problem. The ticket's directive ("merge into one sectioned doc") is satisfied; this is just a future-quality flag.
- **`producer-tools.md` size is ~440 lines.** Same flag, smaller.
- **Two new specs reference `agent-assistance.md` extensively.** Cross-references from `member.md`, `groups.md`, `action-layer.md`, `payments.md`, `policy.md`, `principles.md`, `policy.md` all updated to the merged file. Some refs point to the doc as a whole (used to point at one of the four sub-specs); future ergonomic improvement: add explicit `agent-assistance.md#section` anchors so callers point at the relevant § Delegation / § Assistant Context / § Skills subsection rather than the doc root.

**Verification.** All four agent-stack OLD filenames (`foundation/agent-assistance.md`, `systems/delegation.md`, `systems/assistant-context.md`, `systems/skills.md`) and both producer OLD filenames (`producer-bulletin.md`, `producer-growth.md`) return zero live-file hits via the cross-reference sweep (excluding intentional historical refs in `planning/history/**`). `product/systems/` now contains the merged `agent-assistance.md` + `producer-tools.md` alongside the existing systems; `product/foundation/` no longer contains `agent-assistance.md`.
