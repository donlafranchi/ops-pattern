# T151: Gate write-bound suites on "safe to write to", not "is it localhost"

**Scenario:** substrate — no user-facing surface. Test-harness capability.
**Status:** Open — buildable. **Verification against a branch waits on Don's account upgrade; the harness change does not.**
**Bundle:** launch
**Depends on:** T150 (the fail-loudly helper this extends). **Blocks:** the verified close of T120.

**Serves:**
- **Loop:** none directly — harness capability that unblocks verifying an access boundary.
- **Primitive shape:** none.

## Why the current gate blocks the branch route

The write-and-auth-bound suites gate on:

```
isLocal(SUPABASE_URL)   // hostname ∈ { localhost, 127.0.0.1, ::1 }
```

**A Supabase branch has a remote hostname, so it would skip exactly as the sandbox did.** The branch route cannot work until this changes.

**The intent behind the gate is right and must survive.** These suites create real auth users and write real objects; the existing comment correctly calls pointing them at a remote project unsafe. **The gate is asking the wrong question, not asking one it shouldn't.**

## What changes

**The question becomes *"is this instance safe to write to?"* and the answer is explicit, never inferred.**

- **A required opt-in variable**, `SUPABASE_TEST_EPHEMERAL=1`, asserting the target is a throwaway instance.
- **Runnable = that variable is set, AND the URL is either local or a recognised branch host, AND the keys are present.** Both halves. The variable alone is not enough, and a branch-shaped hostname alone is not enough.
- **Never inferred from the hostname alone.** *A relaxed hostname check is not an acceptable substitute* — a project URL and a branch URL differ by a subdomain, and the failure mode of getting it wrong is a destructive suite running against production data.
- **The failure message names the missing half specifically** — "no ephemeral marker" reads differently from "this looks like a production host."

**Add a guard, not just a gate:** if the URL matches the known production project ref, **refuse to run regardless of what any variable says.** Belt and braces on the one mistake that cannot be undone.

## Acceptance Criteria

- [ ] Write-bound suites run when the ephemeral marker is set **and** the host is local or a branch; skip-to-failure (per T150) otherwise.
- [ ] The marker alone, on a non-ephemeral host, does **not** enable them.
- [ ] A branch-shaped host without the marker does **not** enable them.
- [ ] The production project ref is refused unconditionally, with its own message.
- [ ] Tests cover all four combinations. **Per T150, the refusal paths must be proven to fire.**
- [ ] `.env.local.example` documents the recipe.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **M2 `engineering:code-review`** before commit — **this ticket decides where a destructive suite may point. Review it as a safety change, not a config change.**
- [ ] **M3 / M4** — do not fire. **Stated, not waived.**
- [ ] **DEVIATIONS entry.**

---

## Setup list for Don — ordered, no return trips

**Do these in order. Steps 1–3 are yours; step 4 is the handoff.**

**1. Upgrade the Supabase plan so branching is available.**
Supabase dashboard → the project → Settings → Billing. **Branching is a paid-plan feature; the upgrade is the whole blocker.** Nothing else on this list works until it's done.

**2. Turn branching on for the project.**
Dashboard → Branches → enable. It attaches to the connected GitHub repo. **Check the per-branch running cost on the plan you land on before creating a long-lived one** — the honest unknown from the decision doc, and better answered by the billing page than by me.

**3. Create one persistent branch called `test`.**
Not per-feature, not per-ticket — **one branch that exists to be written to and thrown away.** Creating it runs every migration against a fresh database, which is also a free check that the migration set applies cleanly from zero.

**4. Copy three values into `web/.env.test.local`** — from the branch's own settings page, **not the production project's:**

```
SUPABASE_URL=<the branch's project URL>
SUPABASE_ANON_KEY=<the branch's anon key>
SUPABASE_SERVICE_ROLE_KEY=<the branch's service-role key>
SUPABASE_TEST_EPHEMERAL=1
```

**That last line is the opt-in signal this ticket builds.** Without it the suites refuse to run, by design.

**Then: `npm test`.** The storage tests run against the branch, and the run goes from red to green **for the first honest reason** — something actually checked.

**Two cautions.**

- **`.env.test.local` must be git-ignored.** Confirm before pasting keys in. A service-role key in a public repo is a full-database compromise, and both repos here are public.
- **Do not paste production keys into this file, ever.** The production ref is refused unconditionally, but the guard exists because the mistake is easy — not to make it safe to try.

## Notes

- **The branch is not a staging environment** and should not become one. It exists so a destructive test suite has somewhere legitimate to be destructive.
- If branching turns out to cost more than it's worth, **the fallback is Docker once plus this gate change**, recorded as a deliberate downgrade rather than drifting into "we'll check it manually sometime."

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
