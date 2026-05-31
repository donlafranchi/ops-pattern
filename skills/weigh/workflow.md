# weigh — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | The target file (foundation doc, system spec, planning doc) or a named statement. Plus: `product/foundation/principles.md`, `product/foundation/policy.md`, related foundation/system docs for cross-spec context, `playbooks/DECISION-PATTERNS.md` (the rule), recent JOURNAL entries (≤30 days). |
| **Writes** | Directly to the target file: bullet revisions (only when wording is misleading), `Intent (State YYYY-MM-DD): {why}` lines on every ratified statement. Plus one JOURNAL entry per session. For Intent-scan mode (no ratification): one review file at `planning/reviews/intent-{target}-{YYYY-MM-DD}.md`. For Rejected outcomes: removes the bullet entirely. |
| **Sub-routines** | scan → dialectic → ratify → stamp. Chain depends on mode. |
| **Hands to** | nothing. PM owns what comes next. |

## Scope — confirm at start

Three shapes:

- **One statement** — "weigh this" / "ratify this absolute" (PM pasted or pointed to one bullet).
- **One file / ADR / section** — "ratify the absolutes in `groups.md`", "intent check on systems/X".
- **A pair of options** — "weigh option A vs B" (no scan; jump to dialectic + ratify on the chosen call).

Do not silently expand scope. If unclear, ask once.

## The close-call rule (apply lexicographically)

When the choice isn't close: pick the option serving the most parties that stays reversible. Default.

When the choice IS close (candidates within ~10% on merit but materially differ in spirit, or irreversible consequence):

1. **Member safety.** If one option exposes Members to physical / financial / reputational / psychological harm and the other doesn't, safe option wins. Always.
2. **Platform health.** The platform's continued ability to keep serving Members. A choice that compromises that loses.
3. **Member data protection.** Minimization, consent, control, deletion.
4. **Mutual benefit with reversibility.** Fall back to the default.

Only move to level N+1 when level N can't separate the options. State which level decides, inline, in the ratification reasoning.

**The one absolute overrides every level.** Wealth circulation over wealth extraction. When implicated, no further weighing — the circulating option wins.

---

## Sub-routine 1 — Scan (locate candidates)

Use when the target is a file or section. Skip when the target is a single statement or a named pair of options.

Walk the target top-to-bottom. Match two surface families:

**Absolute-language shapes (case-insensitive, word-boundary).** Refusals: never, won't, will not, doesn't, cannot, can't, refuses, not allowed, forbidden. Assertions: always, must, required to, mandatory, categorically, unconditionally. Negations: no X table, deliberately no X, we do not. Headers: `## No X`, `## Why no Y`. → **Category 2 — refusal/absolute.**

**The other seven Intent categories (from the archived intent audit).** 1: numeric thresholds / caps / defaults; 3: schema/URL/UI naming splits; 4: tier assignments (T1/T2/T3); 5: required vs optional vs nullable; 6: boolean defaults / opt-in vs opt-out; 7: cross-doc commitments stated locally; 8: "mirrors / parallels / same as" claims.

For each match, check whether an Intent annotation is adjacent (next non-blank line, indented under same bullet, or in the same `> ` block):

- `Intent (Ratified ...)` or `Intent (Deferred ...)` → terminal, skip.
- `Intent: {why}` without parenthetical → drafted, queue for ratification.
- `Intent: {vacuous}` ("this is important", "for safety", "by design") → shallow, queue for ratification.
- absent → unratified de-facto, queue for ratification.

Surface the count to the PM: "Found N candidates in {target}: M Category-2 absolutes, K other-category Intent gaps. Walking statement 1 of N now."

### Scan-only mode (no ratification)

If the PM asked for an "Intent check" / "audit Intent annotations" rather than ratification, **stop after scan**. Write a review file at `planning/reviews/intent-{target}-{YYYY-MM-DD}.md` with verdict **CLEAN** / **PROPOSE** / **ESCALATE** / **BLOCK**, one entry per flagged statement with file:line + category + proposed Intent shape. Do not call the dialectic; do not edit the target file. PM ratifies the proposed lines in a follow-up weigh session.

For Category-2 flags, do **not** propose Intent in the review file — list under "Category 2 escalations" and direct the PM to invoke weigh in ratify mode on each. Category-2 requires the interactive walk; scan-only cannot resolve it.

---

## Sub-routine 2 — Dialectic (Member view + Platform view)

Use when a queued statement has Member-shaped tension. Skip when the statement is internal-consistency, naming convention, or schema invariant (no dialectic needed — propose Intent directly).

**Detect tension shape.** Ask: *Does this decision pit an individual Member's interest against the broader Member community's interest?*

- **No** → Member-vs-platform tension. Produce one Member-view bullet + one Platform-view bullet.
- **Yes** → one-Member-vs-many-Members tension. Produce **two** Member-view bullets (individual + community) + one Platform-view bullet (which typically aligns with the community-protective Member bullet — name the alignment).

### Member view — the lens

- **P1** Members materially better off · **P3** more agency, no externalities (including between Members) · **P6** default-private, opt-in expansion · **P7** built so bad actors fail.
- No costume, no role-as-identity, no engagement-optimization, no pay-for-visibility, no over-collection.

Output format:

> **Member view{ — individual / — community if split}:** {1–2 sentences. What the Member loses if the platform errs the other way. Anchor to a specific concern: privacy, autonomy, attention, reputational cost, exploitation risk, exposure to gaming.}

Name *which* Member is being advocated for in each bullet when split.

### Platform view — the lens

**Utility — can the platform do its job?** P5 federation, P8 agent-native navigability, locality verification, producer growth, payments. The platform exists to serve Members; if it can't function, it can't serve them.

**Financial durability — can the platform afford to exist?** No-VC posture (revenue from product use, not rounds). Multi-source revenue. Earn-before-extract. Refusing a revenue line that doesn't violate principles, in the name of purity, is the failure mode this lens guards against.

Output format:

> **Platform view:** {1–2 sentences. What the platform — utility OR financial durability — loses if it errs toward Member-protection here. Anchor to a specific concern: a function blocked, a revenue line foreclosed, a federation handoff broken, a signal made unavailable.}

### Expansion on PM request

If the PM asks for "more" / "full position", produce 150–250-word position papers per lens, structured:

- **Concern (1 sentence)** — the specific interest at stake.
- **What's at risk (2–3 sentences)** — what's lost if the platform errs the other way; anchor to a foundation-doc principle.
- **Test for the absolute (1–2 sentences)** — the question the PM should ask to gauge whether the proposed wording adequately addresses this lens.

For one-Member-vs-many cases: one paper per pole (individual + community), plus a closing "trade-off shape" paragraph naming what's being chosen between.

**Never produce one lens without the other.** The dialectic requires both poles.

---

## Sub-routine 3 — Ratify (apply the close-call rule)

For each queued statement (or chosen option pair):

**3a. Read the local context.** Bullet, surrounding section, cross-spec references, most recent JOURNAL touching this area.

**3b. Surface the dialectic bullets to the PM** (if Sub-routine 2 ran).

**3c. Apply the close-call rule.** State the reasoning inline; do not hide it.

```
Level 1 — Member safety: {does this expose Members to harm? if yes, safe option wins; stop.}
Level 2 — Platform health: {does the safer option compromise the platform's ability to keep serving? if no, proceed; if yes, name the conflict.}
Level 3 — Data protection: {between options still tied, which asks for less / gives Members more control?}
Level 4 — Mutual benefit + reversibility: {fall back to default; pick reversible.}
```

Name the level that decides. If two levels conflict (e.g., Level 1 favors A but Level 2 favors B), surface explicitly — that is a PM escalation, not an auto-resolution.

**Override:** if the wealth-circulation absolute is implicated, name it and short-circuit the rule. The circulating option wins.

**3d. Propose the outcome.** Two parts:

- **Revised bullet text** (only when wording is misleading or overreaches given the close-call analysis).
- **`Intent` line with State tag** (always, except Reject).

For Deferred outcomes, the trigger must be **observable** (MAU > N, federation peer live, partnership signed, behavior observed ≥3×, bundle gate), **specific** (not "when we know more"), and **bounded** (review horizon attached — "or 12 months from b1 ship, whichever first"). If no trigger can be stated, the decision cannot be deferred — Ratify, Revise, or Reject now.

**3e. PM ratifies via AskUserQuestion.** Four options:

1. **Ratify** (with proposed wording if revised).
2. **Defer** (with proposed trigger and review horizon).
3. **Revise differently** (PM provides correction; iterate).
4. **Reject** (PM removes the absolute entirely).

Implicit fifth via "Other": leave unratified. If chosen, flag in the JOURNAL closing note: "PM left {statement} unratified — re-queues at next scan."

---

## Sub-routine 4 — Stamp (land the change)

On PM ratification:

- **Ratify or Defer** → write the (possibly revised) bullet + State-tagged `Intent` line directly to the source file with `Edit`. Re-read surrounding 5–10 lines to confirm rendering.
- **Reject** → delete the bullet entirely; capture removal in JOURNAL with `file:line` pointer.
- **Revise** → produce new wording with State tag; same write as Ratify.

Move to the next statement. Do not batch. Surface progress: "Statement N of M done. Moving to statement N+1."

### Close the session

Append a JOURNAL entry at the top of the active `JOURNAL.md` in hybrid form — **plain-English headline + context + structured detail**. Headline names the decision in human terms; no F-numbers, schema column names, or `file:line` references in the headline itself.

```
## YYYY-MM-DD — Decided {plain-English headline naming what changed about {target}}

{1–2 sentences of context: what was the call, what changes downstream, why a returning reader would care.}

N statements walked: X ratified, Y deferred, Z revised, W rejected.

- **Ratified:** `{file}:{line}` — {one-line summary} (Intent landed)
- **Deferred:** `{file}:{line}` — until {trigger}, review by {horizon}
- **Revised:** `{file}:{line}` — {one-line summary of what changed}
- **Rejected:** `{file}:{line}` (removed) — reason: {one-line}
- **No change (unratified):** `{file}:{line}` — re-queues on next scan

→ `{target file}` § {section}; commit {hash}.
```

Headline-test it before landing: if the sentence only makes sense to someone with full project context loaded, rewrite it.

Flag any PM override (ratified despite a Level-1 or Level-2 conflict surfaced in 3c): "PM override — ratified despite {level} conflict: {reason supplied}."

### Verify before declaring done

- Every queued statement walked or explicitly skipped (no silent skips).
- Every landed change wrote at the expected line; re-read confirms Intent renders with correct State tag.
- JOURNAL entry exists and points to changes by `file:line`.
- No edits made without per-statement PM ratification.

---

## Hard constraints

- **No batch landing.** Per-statement walk only.
- **No dialectic skipping on Member-shaped tension.** Both lenses or neither.
- **No Defer without trigger + horizon.** "Decide later" is a punt.
- **No conflicting-level auto-resolution.** When Level 1 and Level 2 conflict, escalate; do not pick.
- **No silent state changes.** PM ratification per statement, written with appropriate State tag.

## What this skill does NOT do

- Edit code, BUILD-LOG.md, scenarios, tickets, or evals.
- Decide for the PM. Skill structures the adjudication; PM ratifies.
- Remove an existing `Intent (Ratified ...)` line without explicit PM request to re-ratify.
- Run during an open ticket implementation. Out-of-band only.

## Final report

Default report shape is three lines:

    Status: Done | Blocked | Question — <plain-English one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."

Drop running narration ("Now doing X." "Starting Y." "Committing Z."). Name items in plain English; put the ID in parens if it matters. Withhold commit hashes, file lists, lane counts, per-step trace until the PM says "expand." On "expand," return detail in priority order — ask → high-level outcomes → references → notes — stopping at each section for "more."
