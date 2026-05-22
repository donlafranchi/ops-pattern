# pipeline-bundle-resync — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `web/BUILD-LOG.md`, `development/tickets/done/T*.md` (last sub-bundle's worth), `development/DEVIATIONS.md`, `JOURNAL.md` (last 4 weeks), `planning/scenarios/F*.md` (active sub-bundle), `planning/bundles/{active}.md`, `planning/bundles/bundle-themes.md`, `planning/bundles/b{N}-work-map.md`, `planning/DECISIONS.md` (header status only) |
| **Writes** | `planning/bundles/bundle-themes.md` (re-tag / re-sequence), `planning/bundles/b{N}-work-map.md` (re-tag / add entries), `JOURNAL.md` (one entry per run) |
| **Does NOT write** | `product/`, `web/`, `development/tickets/`, `planning/scenarios/`, `planning/DECISIONS.md` |
| **Hands to** | nothing on CLEAN / RE-TAG / RE-SEQUENCE. `pipeline-plan` on EXPAND. `pipeline-product` / `pipeline-adr` on ESCALATE. |

## Process

### 1. Frame the sync

Ask the PM (or confirm from invocation):

- **Which sub-bundle just closed?** (`b1.0`, `b1.3`, etc.) If mid-sub-bundle, name the trigger (DEVIATION landed, PM said "where are we").
- **Mode:** *close-of-sub-bundle* (full sync of the just-closed sub-bundle + a look at the next), *mid-flight* (single deviation / question), or *full-bundle audit* (rare — usually at bundle close).

Pick the mode. Do not silently expand scope.

### 2. Inventory what shipped vs. what the map said would ship

Build a small table mentally — or in a working scratch — comparing:

| Work-map item (predicted) | Tag predicted | Tag at ship | Tickets it produced | Deviations |
|---|---|---|---|---|
| (e.g.) b1.3 → Gathering composer | 🟢 | 🟢 | T012, T013, T014 | none |
| (e.g.) b1.3 → Recurring schedule | 🟢 | 🟢 | T015, T016 | DEV-04 (RRULE library swap) |
| (e.g.) b1.3 → Hashtag autocomplete | 🟡 | dropped | — | dropped at PM call mid-sub-bundle |

The columns that surface drift are the right-most three: ticket fan-out (was it 2–5 like the map assumed?), deviations (did the map miss a constraint?), drop / add (did the PM cut or add work mid-flight that the map doesn't reflect?).

### 3. Diagnose the drift — what kind of resync is this?

For each row with drift, classify:

- **Tag drift.** Predicted 🟡, shipped as 🟢 (or vice versa). Map's scope opinion was wrong. → **RE-TAG**.
- **Sequence drift.** Item shipped in a different sub-bundle than the map placed it. Map's dependency claim was wrong. → **RE-SEQUENCE** (only if no hard-dependency violation in `bundle-themes.md`'s graph).
- **Hidden work.** Tickets implemented something not on the map (typically surfaced via DEVIATIONS). Map under-predicted. → **EXPAND** — propose new line(s), PM ratifies.
- **Phantom work.** Map predicted work the sub-bundle didn't ship and didn't formally drop. → flag for PM; if dropped legitimately, retire the line; if forgotten, escalate to `pipeline-plan` to schedule it.
- **Structural drift.** A ticket produced an ADR-shaped decision the map's themes don't accommodate (e.g. a new event type, a new scope, a new primitive use). → **ESCALATE** to `pipeline-adr` / `pipeline-product`.

If every row is CLEAN, log it and stop.

### 4. Propose the edits — never quietly apply structural changes

For each drift, draft the edit in a short list and present to the PM before writing:

- **RE-TAG** edits: bullet line in `b{N}-work-map.md` flips its tag emoji. One-line annotation: `(re-tagged 2026-MM-DD: {reason})`.
- **RE-SEQUENCE** edits: bullet line moves between sub-bundle sections in both `bundle-themes.md` (theme description) and `b{N}-work-map.md` (work list). The dependency graph in `bundle-themes.md` updates if the move changed any arrow.
- **EXPAND** edits: new 🟢 / 🟡 / ⚪ line under the right sub-bundle in `b{N}-work-map.md`. Includes a one-line rationale pointing to the DEVIATION / ticket / scenario that surfaced the need.
- Where appropriate, add the *date and reason* inline so future-PM can audit the resync history without leaving the file.

CLEAN runs skip this step.

### 5. PM ratifies, then apply

PM accepts / revises / rejects each proposed edit. Apply the accepted edits with Edit tools. Then write the JOURNAL entry:

```
## 2026-MM-DD — pipeline-bundle-resync: b{N}.{M} close

**Mode:** close-of-sub-bundle.
**Verdict:** CLEAN | RE-TAG | RE-SEQUENCE | EXPAND | ESCALATE.

**Drift:**
- {one line per drift, with the resolved edit or hand-off}

**Files touched:**
- planning/bundles/bundle-themes.md ({what changed})
- planning/bundles/b{N}-work-map.md ({what changed})

**Hand-off:** none | pipeline-plan (F### needed for new EXPAND line) | pipeline-adr (drift surfaced an ADR-shaped decision)
```

### 6. Confirm the next sub-bundle's readiness

Before closing the skill, glance at the *next* sub-bundle's section of `b{N}-work-map.md`:

- Are its dependencies satisfied by what just shipped?
- Did this resync invalidate any of its assumptions (e.g. a re-tagged 🟢 that became ⚪ moved scope into the next sub-bundle)?
- Is the canonical-example claim still honest in light of what shipped?

If anything looks off, note it in the JOURNAL entry and recommend a fresh resync after the next sub-bundle's first scenario lands. The map is allowed to be wrong; pretending it isn't is the failure mode.

## Triggers — the project-specific phrases that route here

From `CLAUDE.md` § Agent routing:

- "resync the work map"
- "what's drifted since last sub-bundle"
- "is `b1-work-map.md` still right"
- "what changed after T###"
- "scope sync"
- "did the menu shift"

Plus the implicit trigger: any DEVIATIONS.md entry that names a work-map item by phrase.

## Hand-offs

| Verdict | Next step |
|---|---|
| CLEAN | None. JOURNAL entry only. |
| RE-TAG | None. PM is the audience. |
| RE-SEQUENCE | None for the skill. The next scenario written by `pipeline-plan` will pick up the new order. |
| EXPAND | `pipeline-plan` to write F### for any new 🟢 line that the PM elevated to active. |
| ESCALATE | `pipeline-adr` (structural decision) or `pipeline-product` (new system / capability). The resync pauses; restart it after the upstream hand-off resolves. |
