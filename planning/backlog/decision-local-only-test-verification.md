---
purpose: Decision stub — is "written, gated, unverified-in-this-session" an acceptable terminal state for a storage-API/RLS-bound test the agent sandbox can't run?
layer: how
status: draft
---

# Decision: local-only test verification — write-once, run-later acceptable?

**Raised by:** T120 (`development/tickets/done/T120-image-storage-substrate-and-upload-primitive.md`), logged in `development/DEVIATIONS.md`.

## The question

This project's convention (`tests/rls-coverage.test.ts`, `scripts/bootstrap-eval-helpers.ts`) is that write- or auth-bound tests must be gated to a local Supabase instance (`supabase start`, needs Docker) and skip cleanly otherwise — never pointed at the remote project. The agent sandbox this session ran in has no Docker daemon running, so `tests/media-bucket-storage-api.test.ts` (T120) — real storage-API rejection tests for MIME type, file size, and cross-member RLS — was written, type-checked, and confirmed to skip cleanly, but never actually executed against live infrastructure.

**Is that an acceptable terminal state for a ticket to close in, going forward?** Or should a ticket touching storage/RLS policies stay open (or get a follow-up ticket) until a human runs it once locally?

## Options considered

- **A. Accept as-is.** The test is correct by inspection and matches the exact shape of an already-running suite (`rls-coverage.test.ts`). Trust the pattern; the PM (or a future session with Docker available) runs it eventually, incidentally, the first time they touch this area.
- **B. Require a follow-up ticket** whose only acceptance criterion is "run `supabase start`, run this suite, report pass/fail" before the parent ticket can be considered fully verified.
- **C. Require the PM to run it once, now,** before merging T120 — blocks the merge on infrastructure the agent doesn't have.

## Not decided here

No ruling made. Recorded so it doesn't quietly become precedent by repetition — the next storage/RLS-bound ticket built in this sandbox will hit the identical gap.
