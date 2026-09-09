---
purpose: Decision — how a test that cannot run in the environment that wrote it reaches a verified state. Storage RLS is the instance; the rule is the deliverable.
layer: how
status: ruled
---

# Decision: tests that can't run where they were written

> **RULED 2026-09-07.** **Fix the skip-reports-green defect first and independently** — T150, and it lands regardless of which verification route wins. **Widen the harness gate as scoped** — T151. **Verification waits for a Supabase branch**; no Docker install, no manual-once, because both verify a single day and the risk here is silent regression. Branching needs an account upgrade Don is willing to make; the setup list is in T151.
>
> **Operational consequence:** the storage substrate ticket is **reopened as *built, unverified*.** It may be built on, merged and depended on — the photo work continues on top of it — but **it does not close as done until those tests have run and passed.**
>
> **Both proposed rules adopted**, and they live in the ticket template's gates rather than here, so they are read at the moment they apply.
>
> **One line added to the rule at PM instruction:** this was the second time in one day that a check reported clean while structurally unable to fail — the gate check could not see an approved scenario with an open EXTEND, and the test suite could not see itself skipping. **Before trusting that a check passed, confirm it can fail.**

**Raised by:** the storage substrate ticket, logged in `development/DEVIATIONS.md`. **Re-scoped 2026-09-07** from *"is this an acceptable ship state"* to *"what is the rule"*, at PM instruction — the situation recurs and a one-off answer would be spent immediately.

## What is unverified, said plainly

**Whether one member can read, overwrite, or delete another member's uploaded files.**

Three tests are written and have never executed:

- A raw JPEG, an SVG, and a 40 MB file, each uploaded with a valid member token bypassing the client module, must be **rejected by the storage API** rather than by application code.
- **Member A writing under member B's path prefix must be refused by policy.**
- Size and MIME limits must hold at the bucket, not in the browser.

**These are the access rules for a public bucket.** The application-side path is tested and passes; **what is untested is the boundary that holds when someone ignores the application.** That is the only reason the boundary exists.

## The defect underneath the defect

**The suite does not fail when it cannot run. It skips, and the run reports green.**

So a ticket carrying the acceptance criterion *"rejected by the storage API"* can close with the box ticked, a passing test run, and **nothing whatsoever verified.** The gate reported success for a test that did not exist at runtime.

**This is worse than the missing Docker daemon and it is the part that generalises.** Whatever is decided about how to run these tests, **a test that cannot run must say so loudly at the moment its claim is made.**

## Options, with costs

**A. Install Docker locally, run `supabase start`.**
Free in money. **But it runs on the PM's machine, so no agent can do it**, it needs a few gigabytes and a working daemon, and the tests then run exactly when someone remembers to run them. **Verifies today's code; verifies nothing after the next migration.**

**B. Run against a Supabase branch.**
Branching exists on this project. A branch is an ephemeral copy, so a write-and-auth suite can point at it safely — which a real remote project cannot allow.
**But the harness cannot target one as written.** The gate is `isLocal(SUPABASE_URL)`, matching the hostname against `localhost`, `127.0.0.1` and `::1`. **A branch has a remote hostname and would skip exactly as the sandbox did.**
**Cost: about an hour to change the gate, plus branch running cost, which I have not confirmed for this plan and which the PM should check before committing.** The gate must widen to *"an instance it is safe to write to"* — an explicit signal such as a required `SUPABASE_TEST_EPHEMERAL=1` — **not merely a relaxed hostname check, which would let someone point a destructive suite at production.**

**C. Verify manually once and document it.**
Cheapest. **Verifies the state on one day and nothing afterwards.** Storage policies are precisely the thing that regresses silently, because nothing visibly breaks when they loosen — the app keeps working, and it works for the wrong people too.

**D. Ship unverified.**
No cost now. **The failure mode is members' uploaded files readable or overwritable across accounts, discovered by whoever finds it first.**

## Recommendation — B, and the harness change is the deliverable

**Not because a branch is elegant, but because it is the only option that runs again next time.** A and C both verify one moment; the risk here is regression, and a check that runs once does not address regression.

**About an hour of work**, and it makes every future storage or RLS test runnable by an agent rather than dependent on the PM's laptop having a daemon up.

**On the specific instance: I would not ship the bucket to production unverified.** The tested claim is that strangers cannot reach each other's files. That is not a claim to take on inspection, however carefully the test was written — and it was written carefully; correctness by inspection is exactly what everyone believes right up until it isn't.

**One honest caveat on cost:** I have confirmed branching exists as a capability on this project. **I have not confirmed what it costs on the current plan**, and did not check, because that meant touching the live project. **Confirm before committing to B.** If branching turns out to cost real money, **A once now plus B when the harness is touched anyway** is the fallback, and it should be recorded as a deliberate downgrade rather than drifting into C.

## The rule being proposed

**Adopt as a written rule, not a one-off ruling:**

1. **A test that cannot run in the current environment fails the run. It does not skip quietly.** A skipped test may not satisfy an acceptance criterion, and a criterion covered only by a skipped test is unmet.
2. **A ticket whose acceptance criterion depends on such a test does not close as verified.** It closes as *built, unverified*, naming what is unverified in one sentence a non-engineer can read.
3. **Write-and-auth-bound suites gate on "is this instance safe to write to", not "is this hostname local".** The signal is explicit and opt-in; a relaxed hostname check is not an acceptable substitute.
4. **Nothing that enforces an access boundary reaches production on inspection alone.** Storage policies, row-level security, and authorization checks all sit here. **Application-side tests do not substitute** — the boundary exists for the case where the application is bypassed.

## Not decided here

**The ruling is the PM's.** Recorded before the next storage or RLS ticket hits the identical gap, which it will — this is the second time in one day that something was reported as done and turned out to be conditional.
