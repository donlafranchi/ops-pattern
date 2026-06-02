# Pipeline telemetry

Token / cost / time telemetry for the agent pipeline, parsed straight from Claude Code
transcript JSONL. Three scripts: **collect** (parse) → **report** (per-F) → **summary** (cross-F).

No frameworks. Only dep is [`tsx`](https://github.com/privatenumber/tsx) as the TS runner.

## Setup

```bash
cd _audit
npm install      # installs tsx
```

## 1. Collect — `collect.ts`

Reads transcripts from `~/.claude/projects/-Users-don-Projects-community/*.jsonl`
(plus `*/subagents/*.jsonl` sidechains), segments each session by `Skill` tool-call
markers, attributes every Claude API call to an F-number, skill, and surface, and writes
`_audit/F###/run.jsonl` — one JSON record per call. Re-runnable; overwrites existing buckets.

```bash
npm run collect                          # scan everything, bucket by F-number
npx tsx collect.ts --f F035              # only write the F035 bucket (still scans all)
npx tsx collect.ts --sessions a,b,c      # restrict input to session files matching a/b/c
npx tsx collect.ts --exclude 9b5e64d7    # drop session(s) matching (comma-sep)
```

> **Self-attribution caveat.** The collector scans the live transcript dir, including any
> in-progress session. A session doing *audit/tooling* work mentions feature F-numbers
> heavily and gets session-dominant-attributed to whichever feature it cites most. The
> committed F032–F035 backfill snapshot was produced with `--exclude 9b5e64d7` (the audit
> session itself, which otherwise folded ~88 low-confidence calls into F035). Pass your own
> session id to `--exclude` when snapshotting.

**Per-call record schema:**

```json
{
  "timestamp": "2026-06-02T14:31:50.829Z",
  "f_number": "F035",
  "skill": "test",
  "parent_skill": null,
  "surface": "claude-code",
  "model": "claude-opus-4-8",
  "input_tokens": 17148,
  "output_tokens": 630,
  "cache_creation_input_tokens": 22888,
  "cache_read_input_tokens": 16596,
  "duration_ms": 8894,
  "request_id": "req_011Cb…",
  "is_sidechain": false,
  "notes": "attribution: high (scenario/review-file)",
  "session": "34ee58d3-…",
  "attribution_confidence": "high",
  "attribution_basis": "scenario/review-file"
}
```

### How attribution works

Attribution is **segment-level** (two passes per transcript). Each top-level `Skill`
tool-call marker opens a segment; pass 1 collects the strongest local F-signal for that
segment, pass 2 emits one record per usage-bearing turn using its segment's signal.

- **Skill** — last `Skill` tool-call marker seen in the session. A pipeline skill
  (`build`/`test`/`ticket`/`scope`/`review`/`orient`/…) replaces the active segment;
  a plugin / M-gate skill (anything with a `:`, e.g. `engineering:code-review`,
  `design:accessibility-review`) nests, and its `parent_skill` is the pipeline skill it
  fired under.
- **Surface** — derived from the skill→tool firewall in `CLAUDE.md`
  (`build`/`ticket`/`test`/`atomize` → `claude-code`; `orient`/`scope`/`review`/… →
  `cowork`), falling back to the transcript `entrypoint`.
- **F-number** — resolved per segment with a confidence tier (recorded in
  `attribution_confidence` + `attribution_basis`):
  | Tier | Basis | Signal |
  |---|---|---|
  | `high` | `skill-args` | F-number in the segment's `Skill` args |
  | `high` | `scenario/review-file` | a *single* `scenario-F###` / `review-F###` file referenced in the segment |
  | `medium` | `segment-sole-mention` | exactly one distinct F mentioned inside the segment |
  | `medium` | `segment-dominant` | one F is ≥2 mentions and >50% of the segment's F-mentions |
  | `low` | `session-dominant` | most-mentioned F across the whole transcript (weakest — flagged per call) |
  | `none` | — | no signal → bucketed as **`unattributed`**, never guessed |
  This is why a feature that appears only inside backlog-scan / sequence-table contexts
  (e.g. F032, F033) gets **no bucket** — its mentions stay attributed to the feature that
  actually owns each segment rather than being force-bucketed.
- **Duration** — gap between the previous transcript line and the assistant turn, i.e.
  approximate request latency. Gaps over 10 minutes are flagged as likely idle time.
- **Sidechain** — `isSidechain=true` or a `subagents/` transcript.

### Schema-drift probe

Each transcript is checked for usage-bearing turns missing `requestId` / `model` /
`timestamp`. Findings are written to `_audit/drift-notes.json` and surfaced in every
report's *Backfill notes → Schema drift* section. The parser tolerates the entire
2026-05-25 → 2026-06-02 range with no drift; missing fields (if any) are defaulted, never fixed.

### Segmentation notes

Ambiguities (skills nested in skills, M-gates with no parent, idle-time gaps, unresolved
F-numbers) are written per-record in the `notes` field **and** aggregated into
`_audit/segmentation-notes.json`, which the report renders in its *Segmentation notes* section.

## 2. Report — `report.ts`

Reads `_audit/F###/run.jsonl`, renders `_audit/F###/report.html` — inline CSS, no deps,
click-to-sort tables. Sections: cost-per-F (tokens + dollar estimate, by skill and surface),
bottleneck distribution with a Pareto call-out, skill ROI (sortable by tokens-per-invoke and
total tokens; flags skills that spent tokens but produced no output), **backfill notes**
(attribution-confidence mix, basis breakdown, data window, schema-drift findings), and
segmentation notes.

Backfill targets that produced no confidently-attributable calls (F032, F033) get a
hand-written `report.html` stub explaining the gap instead of a fabricated `run.jsonl`;
the `summary.html` cross-links them in its *Backfill gap* call-out.

```bash
npx tsx report.ts F035     # one F-number
npm run report             # every F### with a run.jsonl
```

## 3. Summary — `summary.ts`

Reads every `_audit/F###/run.jsonl`, renders `_audit/summary.html` — one sortable row per
F-number: total tokens, cost, wall time, skill count, dominant skill by tokens, dominant
skill by time. Each F-number links to its full report.

```bash
npm run summary
```

## Everything at once

```bash
npm run all     # collect → report → summary
```

## Pricing

USD per 1M tokens (current Claude pricing, Jan 2026), in `lib.ts`:

| Family | Input | Output | Cache write (5m) | Cache read |
|---|---|---|---|---|
| Opus   | $15 | $75 | $18.75 | $1.50 |
| Sonnet | $3  | $15 | $3.75  | $0.30 |
| Haiku  | $1  | $5  | $1.25  | $0.10 |

Long pipeline sessions are cache-read-dominated, so the dollar estimate leans heavily on the
cache-read rate. Adjust the `PRICING` table in `lib.ts` if rates change.
