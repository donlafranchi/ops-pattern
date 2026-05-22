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

Date: {YYYY-MM-DD} · Commit: {hash} · Notes: {list every [PM: confirm] left behind}
