# T150: A test that cannot run fails the run

**Scenario:** substrate — no user-facing surface. Test-harness correctness.
**Status:** Open — buildable, and **the priority.**
**Bundle:** launch
**Depends on:** nothing. **Blocks:** T151, and the verified close of T120.

**Serves:**
- **Loop:** none directly. **This is a correctness fix to the thing that tells us whether the other work is correct.**
- **Canonical example:** n/a — harness.
- **Primitive shape:** none.

## The defect

**A suite that cannot run today skips, and the run reports green.**

The storage tests carry the acceptance criterion *"rejected by the storage API."* They are gated on a local Supabase instance, the sandbox has no Docker daemon, so `describe.skipIf` skipped them and the run passed. **The ticket closed with the box ticked, a green test run, and nothing verified.**

**The missing Docker is a symptom. This is the defect** — the harness reported success for a test that did not exist at runtime.

## Second instance of the same shape, today

**Worth stating because it is what makes this general rather than a one-off.**

- **The gate check reported clean** while structurally unable to see an approved scenario carrying an open EXTEND from its own review. It answered *"does a review file exist"* and was read as *"has this been reviewed."*
- **The test suite reported green** while structurally unable to see itself skipping.

**Twice in one day, a check passed because it could not fail.** That is the pattern this ticket exists to close, and the rule it lands is broader than the one suite.

## What changes

### 1. Skips that cover an acceptance criterion become failures

**Not all skips.** A test skipped because a feature is deliberately out of scope is fine. **A test skipped because the environment could not run it is not** — that is an unmet criterion wearing a passing badge.

Introduce one shared helper — name it plainly, `requireRunnable` or similar — used by every environment-gated suite:

- **When the environment is present**, the suite runs as it does today.
- **When it is absent, the suite fails** with a message naming what could not be verified in one sentence a non-engineer can read, and what would make it runnable.
- **One escape hatch, explicit and loud:** an env var such as `ALLOW_UNVERIFIED=1` downgrades the failure to a warning **and prints the list of unverified claims at the end of the run.** For a local iteration loop, not for a close-out. **It is never set in a merge or a close.**

### 2. Apply it to every environment-gated suite, not just the storage one

Known today: the storage-API suite, the RLS coverage suite, and the migration suites. **Re-derive the list rather than trusting this one** — `grep` for `skipIf` and for hand-rolled `RUNNABLE` constants.

### 3. The run says what it did not check

At the end of a run with skips, print a short block: **each unverified claim, one line each.** The failure alone is not enough — someone needs to see *what* is unverified without reading the test source.

### 4. Prove the check can fail

**Do not ship this without a test that the failure path fires.** A guard against silently-passing checks that itself silently passes is the joke writing itself. **Point the helper at a deliberately absent environment and assert the run goes red.**

## Acceptance Criteria

- [ ] A shared helper exists and is used by every environment-gated suite.
- [ ] With no local Supabase and no escape hatch, `npm test` **exits non-zero**, naming the storage-RLS claims as unverified.
- [ ] The message is readable by someone who does not know the codebase, and says what would make it runnable.
- [ ] `ALLOW_UNVERIFIED=1` downgrades to a warning **and** prints the unverified list.
- [ ] **A test asserts the failure path actually fails.** Not that the helper was called — that the run goes red.
- [ ] Every `skipIf` and hand-rolled runnable-gate in the repo has been found and either converted or explicitly justified in the ticket.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3** — does not fire. No page or component. **Stated, not waived.**
- [ ] **M4** — does not fire. No migration.
- [ ] **DEVIATIONS entry**, naming how many gated suites were found.

## Notes

- **Do not make this clever.** One helper, one message, one escape hatch. A configurable severity matrix is how the next person turns it off.
- **The escape hatch matters** — without it someone deletes the guard the first time it blocks them at 11pm. Make the sanctioned way out loud rather than making the guard removable.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
