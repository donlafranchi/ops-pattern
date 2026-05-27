# pipeline-ratify-absolute — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | The target file (foundation doc, system spec, ADR, or planning doc). Plus: `product/foundation/principles.md`, `product/foundation/policy.md`, `product/foundation/principles.md`, related foundation/system docs for cross-spec context, recent JOURNAL entries (≤30 days), [`_attic/2026-05-19/planning/intent-audit-2026-05-12.md`](../../_attic/2026-05-19/planning/intent-audit-2026-05-12.md) (the eight categories — Category 2 is the absolute-refusal shape this skill handles). |
| **Writes** | Directly to the target file: bullet text revisions (only when original wording is misleading), `Intent (State YYYY-MM-DD): {why}` lines (always, on every ratified statement). Plus one JOURNAL entry per session. For Rejected outcomes: removes the bullet entirely. |
| **Invokes** | `pipeline-member-advocate` and `pipeline-platform-advocate` on every statement with Member-shaped tension. Never short-circuits by skipping an advocate. |
| **Hands to** | nothing. PM owns what comes next. |

## Scope

Three shapes — confirm at start if not stated:

- **One statement** — "ratify this absolute" (PM pasted or pointed to one bullet)
- **One file or ADR** — "ratify the absolutes in `groups.md`" / "ratify ADR-7"
- **One section** — "ratify the never-statements in `payments.md` § Money Flow"

Do not silently expand scope. If unclear, ask once.

## The State marker

Exactly one of four states is encoded co-located with every absolute:

```
- Members cannot be auto-assigned to a Location group.
  Intent (Ratified 2026-05-19): the Nextdoor failure mode is geographic auto-membership creating in-group/out-group dynamics members never opted into; the refusal targets that mechanism, not voluntary Location-based affiliation, so Group joining via search/discovery is allowed.
```

```
- Platform will not custody Member funds.
  Intent (Deferred until first CDFI partnership ratified; review by b2 entry): interim posture is closed-loop ledger only; revisit when chartered partner relationship is signed because custody-via-partner is materially different from platform-as-custodian.
```

| Tag | Use when |
|---|---|
| `Intent (Ratified YYYY-MM-DD): {why}` | PM ratified the absolute as written (or as revised). Terminal. |
| `Intent (Deferred until {trigger}; review by {date \| bundle gate}): {interim posture}` | PM deferred. Trigger must be observable; review date must be set. |
| `Intent: {why}` (no parenthetical) | Drafted but not yet PM-ratified. Should not exist after a ratify session closes on the statement. |
| (no `Intent:` line) | Unratified de-facto. Should not exist after a ratify session closes on the statement. |

Rejected absolutes: the bullet itself is deleted with a one-line tombstone in the JOURNAL entry only. No `Intent (Rejected)` tag.

## Process

### 1. Identify candidates

Scan the target. Match absolute-language shapes (case-insensitive, word-boundary):

- **Refusals:** "never", "won't", "will not", "doesn't", "does not", "cannot", "can't", "refuses", "not allowed", "forbidden", "prohibited", "disallow", "no longer"
- **Assertions:** "always", "must", "required to", "mandatory", "categorically", "unconditionally"
- **Negations:** "no X table", "no X column", "no X surface", "deliberately no X", "we do not", "we never"
- **Headers:** any `## No X`, `## What does not ship`, `## Why no Y`

For each match, read the line immediately under the bullet (and any adjacent block-quote):

- `Intent (Ratified ...)` or `Intent (Deferred ...)` → **terminal state. Skip.**
- `Intent: {why}` without a parenthetical tag → **drafted. Queue for ratification.**
- Nothing → **unratified de-facto. Queue for ratification.**

Surface the count to the PM before starting: "Found N unratified absolutes in {target}. M already ratified. Walking statement 1 of N now."

### 2. Walk one statement at a time

For each queued statement:

**2a. Read the local context.** The bullet, the surrounding section, any cross-spec reference the bullet makes, the most recent JOURNAL entry that touched this area.

**2b. Detect tension shape.** Before drafting anything, classify:

- **Member-vs-platform** — a single Member interest opposes platform utility or durability. Surfaces: data collection, visibility defaults, opt-in vs. opt-out, monetization shape, agent permissions, federation infrastructure.
- **One-Member-vs-many-Members** — individual interest pits against community interest. Surfaces: locality verification, moderation severity, reputation/review systems, dispute resolution, content visibility.
- **None** — internal-consistency, naming conventions, schema invariants. No dialectic needed; ask 1–2 free-form context questions and propose Intent directly. The lexicographic rule is trivial when there's no tension.

**2c. If tension is present, invoke the dialectic.** Call `pipeline-member-advocate` and `pipeline-platform-advocate` with the statement + local context.

- Member-vs-platform shape: member-advocate returns one bullet; platform-advocate returns one bullet.
- One-Member-vs-many-Members shape: member-advocate returns two bullets (individual + community); platform-advocate returns one bullet that typically aligns with one Member view — name the alignment explicitly.

Surface the bullets to the PM:

> **Member view{ — individual / — community if split}:** {advocate's bullet}
>
> **Platform view:** {advocate's bullet}

**2d. Apply the lexicographic decision rule.** State the reasoning inline; don't hide it.

**Gate 1 — Platform survival (hard).** Does ratifying this absolute as drafted threaten the platform's ability to exist — its utility OR its financial durability (no-VC posture per `principles.md`)? Read the platform-advocate's bullet. If **yes** to any of:

- Forecloses a revenue line the platform needs to remain durable
- Prevents a function the platform must perform (federation, agent-native navigability, business-jurisdiction verification, payments)
- Makes the platform unable to deliver on P1 / P4 / P5 over a horizon longer than the deferral window allows

→ the absolute fails Gate 1. Available outcomes: **Revise** (find wording that preserves the Member protection without foreclosing platform durability) or **Reject** (mission-incompatible as drafted). **Cannot Ratify or Defer as-is — a deferred Gate-1 failure is still a future kill.**

If **no** → proceed.

**Maximize net member benefit.** Among options that pass Gate 1, which choice maximizes net member benefit with neither lens (individual or community) taking significant unrecoverable harm?

- Clear member benefit, no significant offsetting platform harm → **Ratify**.
- Helps members but wording overreaches and causes avoidable platform-utility loss → **Revise** with proposed wording.
- Member benefit depends on facts not yet knowable → **Defer** with observable trigger and bounded review horizon.
- Every option causes significant harm to one lens → choose the option where the harm is **reversible** over the option where it isn't.
- Still tied → **Defer** is honest. State explicitly: *the trade-off cannot be resolved without {signal X}; re-open when {trigger}*.

**2e. Propose the outcome.** Two parts:

- **Revised bullet text** (only when the original wording is misleading or overreaches per Gate 1)
- **`Intent` line with State tag** (always, on every outcome except Reject)

For Deferred outcomes, the trigger must be:

- **Observable.** A real-world signal — MAU > N, first federation peer goes live, ≥3 instances of behavior observed, partnership signed.
- **Specific.** Not "when we know more." Common shapes for this platform: user-base size, capability shipped, partner milestone, market signal, bundle gate (decide at b2 / b3).
- **Bounded.** A fallback review horizon attached — "or 12 months from b1 ship, whichever first."

If no trigger can be stated, the decision cannot be deferred — Ratify, Revise, or Reject now.

**2f. Ratify via AskUserQuestion.** Four options:

1. **Ratify** (with proposed wording if revised) — recommended when Gate 1 passes and net benefit is clear.
2. **Defer** (with proposed trigger and review horizon) — recommended when net benefit depends on unknown signal.
3. **Revise differently** — PM provides correction; iterate.
4. **Reject** — PM removes the absolute entirely.

Implicit fifth via "Other": no change, leave unratified. If chosen, flag in the JOURNAL closing note: "PM left {statement} unratified after walk — re-queues at next scan."

**2g. Land the change.** On PM ratification:

- Ratify or Defer → write the (possibly revised) bullet + State-tagged `Intent` line directly to the source file with `Edit`. Re-read the surrounding 5–10 lines to confirm rendering.
- Reject → delete the bullet entirely; capture the removal in the JOURNAL entry with `file:line` pointer to the prior location.
- Revise → produce the new wording with the State tag; same write as Ratify.

**2h. Move to the next statement.** Do not batch. Surface progress: "Statement N of M done. Moving to statement N+1."

### 3. Close the session

When all queued statements are walked, append a JOURNAL entry at the top of the active `JOURNAL.md`. Format:

```
### Ratified absolutes in {target} — YYYY-MM-DD
N statements walked: X ratified, Y deferred, Z revised, W rejected.

- **Ratified:** `{file}:{line}` — {one-line summary} (Intent landed)
- **Deferred:** `{file}:{line}` — until {trigger}, review by {horizon}
- **Revised:** `{file}:{line}` — {one-line summary of what changed}
- **Rejected:** `{file}:{line}` (removed) — reason: {one-line}
- **No change (unratified):** `{file}:{line}` — PM declined to ratify; re-queues on next scan
```

If any statement was a Gate-1 failure that the PM still chose to Ratify (override), flag it explicitly: "PM override — ratified despite Gate-1 risk: {reason supplied}." This is the only case where the decision-rule recommendation is overridden in writing.

### 4. Verify before declaring done

- Every queued statement walked or explicitly skipped (no silent skips)
- Every landed change wrote at the expected line; re-read confirms the Intent renders in context with the correct State tag
- JOURNAL entry exists and points to changes by `file:line`
- No edits made without per-statement PM ratification

## Hard constraints

- **No batch landing.** Per-statement walk only.
- **No advocate skipping.** Member-shaped tension always invokes both advocates.
- **No Defer without trigger + horizon.** "Decide later" is a punt.
- **No Gate-1 deferral.** Gate-1 failures Revise or Reject; PM override permitted but logged.
- **No scalar scores.** Surface tension texture, not numbers.
- **No silent state changes.** PM ratification per statement, written to source file with appropriate State tag.

## What this skill does NOT do

- Edit code, `BUILD-LOG.md`, scenarios, tickets, or evals.
- Decide for the PM. Skill recommends; PM ratifies.
- Remove an existing `Intent (Ratified ...)` line without explicit PM request to re-ratify.
- Handle Category 1 (numeric thresholds), Category 5 (required/optional), Category 6 (boolean defaults) — those are different Intent shapes; route to `pipeline-intent-check`.
