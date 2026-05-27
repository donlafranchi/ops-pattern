# Eval results template (run mode output)

Place at: `{app}/evals/results/F{NNN}-{YYYY-MM-DD}.md`

```markdown
# F{NNN} eval results — {YYYY-MM-DD}

**Scenario:** [`planning/scenarios/F{NNN}-{slug}.md`](../../planning/scenarios/F{NNN}-{slug}.md)
**Spec:** [`{app}/evals/features/F{NNN}-{slug}.spec.ts`](../features/F{NNN}-{slug}.spec.ts)
**Run by:** test (run mode)
**Build commit:** {git hash from latest BUILD-LOG.md entry}

## Summary

- **Total beats:** {count of test cases}
- **Passed:** {count}
- **Failed:** {count}
- **Skipped:** {count}
- **Verdict:** {PASS | FAIL | INCOMPLETE}

## Per-beat results

### {Story beat 1 — heading from scenario}

- **Given … | When … | Then …** — ✅ PASS / ❌ FAIL / ⏭ SKIP
  - {if FAIL: the exact assertion that failed and the observed value}
  - {if SKIP: why}

### {Story beat 2}

- **Given … | When … | Then …** — ✅ PASS

## Failures (if any)

For each failure:

- **Test:** {test name}
- **Expected:** {what the scenario said should happen}
- **Observed:** {what the run produced}
- **Suggested next step:** hand to `build` to fix forward, OR escalate to `scope` if the scenario itself is wrong.

## Hand off

- **On PASS:** PM picks the next scenario or ticket. Loop closes.
- **On FAIL where the implementation diverges from the scenario:** `build` fixes forward.
- **On FAIL where the scenario is wrong:** `scope` revises the scenario; cycle restarts at eval-write.
```
