# pipeline-clarify-absolutes — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | The target file (a foundation doc, system spec, ADR, or planning doc). Plus: [`../../planning/archive/intent-audit-2026-05-12.md`](../../planning/archive/intent-audit-2026-05-12.md) (the eight categories, especially Category 2), related foundation/system docs to read cross-spec context, recent JOURNAL entries (≤30 days) for related ratifications. |
| **Writes** | Directly to the target file: bullet text revisions (when original wording was misleading), `Intent:` annotations (always). Plus one JOURNAL entry per session at the end. |
| **Templates** | The `Intent:` annotation pattern from the archived intent audit (inline form for short statements, block-quoted form for structural decisions). |
| **Hands to** | nothing. PM owns what comes next. |

## Output

For each absolute statement: a bullet revision (only when original wording is misleading) + `Intent:` annotation landed in the source file. One JOURNAL entry per session.

## The principle

**There is no purely-categorical refusal in this project.** Every "Never / won't / doesn't / cannot / will not / refuses / always / must / no X / deliberately no X" is a stance with a *why* that belongs co-located with the *what*. The skill's job: surface each absolute, ask the questions that derive the *why*, propose a revision the PM ratifies, land the change.

This corrects the reading-(1) vs reading-(2) framing in the archived intent audit's addendum (which earlier allowed "categorical" as an outcome). With the clarification here, no absolute lands without an Intent. Period.

## Process

### 1. Scope — what are we clarifying?

Ask if not stated. Three shapes:

- **One file** — "clarify the absolutes in `groups.md`."
- **One ADR** — "clarify the absolutes in ADR-7."
- **A subset of one file** — "clarify the never-statements in the Money Flow section of `payments.md`."

If the target is unclear, ask once. Do not silently expand scope.

### 2. Detect candidates

Scan the target. Match these absolute-language shapes (case-insensitive, word-boundary):

- **Categorical refusals:** "never", "won't", "will not", "doesn't", "does not", "cannot", "can't", "refuses", "no longer", "not allowed", "forbidden", "prohibited", "disallow"
- **Categorical assertions:** "always", "must", "required to", "mandatory", "categorically", "unconditionally"
- **Negation patterns:** "no X table", "no X column", "no X surface", "deliberately no X", "we do not", "we never"
- **Section-header signals:** any `## No X`, `## What does not ship`, `## Why no Y`

For each match, check: does an `Intent:` annotation already exist immediately adjacent (next non-blank line under the same bullet, or in an adjacent block-quote)? If yes and substantive, skip. If no or shallow, queue for review.

A *substantive* Intent line tells a downstream agent **how to reason about the absolute when the literal wording doesn't cover the case in front of them**. "This is important" / "by design" / "for safety" is not substantive. "What's refused is *being the principal*; what's accepted is *being the rail*" is substantive.

Surface the queued count to the PM before starting the walk: "Found N absolutes needing clarification. Walking statement 1 of N now."

### 3. Walk one statement at a time

For each queued statement:

**3a. Read the local context.** The bullet, the surrounding section, any cross-spec reference the bullet makes ("per ADR-X", "see foo.md"), the most recent JOURNAL entry that touched this area.

**3b. Form a hypothesis.** Read the statement and ask:
- What is this *actually* refusing? The literal X, or a specific shape of X?
- What's the failure mode this refusal exists to prevent?
- What related affordance, if any, *is* allowed (the carve-out)?
- Has another spec or recent ratification already softened or qualified this?

**3c. Ask 1–2 free-form context questions to the PM** *unless* the statement has member-vs-platform tension (see 3c-bis below). Examples (pick the relevant shape — don't ask all of them):

- "This statement reads as a categorical refusal of X. Is the actual stance categorical, or is it refusing a specific *shape* of X (e.g., X-when-impersonal, X-as-leaderboard, X-without-Member-confirmation)?"
- "What's the failure mode this refusal exists to prevent? (Yelp / Angi pattern, Nextdoor pattern, prompt injection, off-platform legal entanglement, something else?)"
- "Is there a related affordance that *is* allowed — the shape-specific carve-out the bullet doesn't currently mention?"
- "Does this contradict or get softened by anything in {related spec / recent ratification}?"

Skip the questions if the answer is obvious from cross-spec context the PM has already established. Don't ask for ratification of facts the PM has clearly stated elsewhere.

**3c-bis. Member-shaped tension detection (two distinct shapes).** Before asking free-form context questions, check whether the statement touches member-shaped tension. There are **two distinct shapes** the dialectic handles — recognize which one applies:

1. **Member-vs-platform tension.** A single Member interest opposes the platform's utility or sustainability. Surfaces include: data collection / privacy (Members lose privacy / platform gains signal), visibility / discovery defaults, opt-in vs. opt-out defaults, monetization shape, agent permissions, signal availability, federation infrastructure.

2. **One-Member-vs-many-Members tension.** A decision pits an individual Member's interest against the broader Member community's interest. Surfaces include: locality verification (individual privacy vs. community protection from gaming), moderation severity (one Member's speech vs. many Members' freedom from harassment), reputation / review systems (individual reputational cost vs. community treatment-transparency), dispute resolution, content visibility, anything where "protecting the community" intersects "protecting the individual."

If the statement touches *either* tension shape, **invoke the dialectic** instead of (or in addition to) the free-form questions:

1. Invoke [`pipeline-member-advocate`](../pipeline-member-advocate/SKILL.md) with the statement + local context. It returns **one bullet for Member-vs-platform** shape, or **two bullets (individual + community) for one-Member-vs-many-Members** shape. The skill detects which shape applies and adapts its output format.
2. Invoke [`pipeline-platform-advocate`](../pipeline-platform-advocate/SKILL.md) with the same input. It returns one bullet (1–2 sentences) on what the platform loses (utility OR financial durability). On one-Member-vs-many-Members surfaces, the platform-advocate's bullet often *aligns* with the community-protective side — that's a useful signal to surface in the next step.
3. Surface the bullets to the PM as the clarifying material. Two presentation formats:

   **Member-vs-platform shape (two bullets total):**
   > **Member view:** {member-advocate's bullet}
   >
   > **Platform view:** {platform-advocate's bullet}

   **One-Member-vs-many-Members shape (three bullets total):**
   > **Member view — individual:** {member-advocate's individual bullet}
   >
   > **Member view — community:** {member-advocate's community bullet}
   >
   > **Platform view:** {platform-advocate's bullet — typically alignment with one of the Member views; name the alignment explicitly}

4. The PM adjudicates — picks a position, picks a middle ground, or requests expansion ("expand the Member view" / "expand the individual view" / "expand the platform view" → the relevant advocate produces a 150–250 word position paper).
5. Once adjudicated, proceed to 3d (propose the revision incorporating the PM's chosen balance).

Most statements don't have member-shaped tension and only need the free-form context questions. The dialectic is for the ones that do.

**When in doubt about tension.** If you can name *any* tension between Member interests (whether individual vs. community, or Member vs. platform), invoke the dialectic — the skill detects the shape. If no real tension exists in either direction, free-form questions are enough.

**3d. Propose the revision.** Two parts:

- **Revised bullet text** (only if the original wording was misleading — e.g., "platform never moves money" when `payments.md` exists). If the original wording is fine, skip the revision and propose the Intent only.
- **Intent annotation** (always). Inline form for short statements; block-quoted form for structural decisions. Match the audit's voice: declarative, anchored in *what failure mode this prevents*, gives the agent a way to break ties when the literal rule doesn't cover the case.

**3e. Ratify via AskUserQuestion.** Present three options:
- (1) the proposed revision (bullet text if changed + Intent) — recommended;
- (2) Intent only, no bullet revision — when the original wording is acceptable but the Intent is missing;
- (3) revise differently — PM provides correction; iterate to 3d.

Plus an implicit fourth option (the user picks "Other" and writes their own answer): no change. If chosen, record the decision so future runs know not to re-flag, but flag in the JOURNAL closing note that an absolute was left without Intent at PM direction.

**3f. Land the change.** If ratified: write directly to the source file with `Edit`. Re-read the surrounding 5–10 lines after the write to confirm the Intent renders in context.

**3g. Move to the next statement.** Do not batch. Surface progress: "Statement N of M done. Moving to statement N+1."

### 4. Close the session

When all queued statements are walked:

- Append a JOURNAL entry at the top of the active `JOURNAL.md` (under today's date if a date heading already exists for today; otherwise create a new heading). Format: count of statements processed, count revised vs. Intent-only vs. no-change, `file:line` pointers for each, brief summary of any cross-spec implications surfaced.
- If any statements were left as "no change" without the PM supplying a *why* for the lack of revision, flag at the bottom of the JOURNAL entry as "PM ratified no-change without supplying rationale — revisit if pattern emerges."

### 5. Verify

Before declaring done:

- Every queued statement has been walked or explicitly skipped by the PM (no silent skips).
- Every landed change wrote to the source file at the expected line; re-read confirms the Intent renders in context.
- The JOURNAL entry exists and points to the changes by `file:line`.
- No edits were made without per-statement PM ratification (the contract — interactive only).

## What this skill does NOT do

- Batch-process absolutes without ratification. Per-statement walk only.
- Land changes the PM hasn't ratified.
- Edit code, `BUILD-LOG.md`, scenarios, tickets, or evals.
- Decide *for* the PM whether a refusal is shape-specific or categorical. The PM decides; the skill asks the questions and proposes wording.
- Remove an existing Intent line, even if it's shallow. Propose a stronger one; let the PM choose.
- Handle Category 1 (numeric thresholds), Category 5 (required/optional), Category 6 (boolean defaults) — those are different Intent shapes; route to `pipeline-intent-check`'s general scan.
