---
purpose: Safety standard — placeholder for safety-floor requirements.
layer: how
status: draft
---

# Safety

> **Stub — created 2026-05-19.** Placeholder for the safety standard. To be written:
> what the build must satisfy for safety, how it is verified, which ADRs and M-gates
> enforce it. Until written, treat existing scattered safety guidance in
> principles.md / policy.md / design-language.md as authoritative.

## Scope

(to be written)

## Requirements

(to be written)

## Verification

- Mutation testing (Stryker) on `web/src/lib/**` via `npm run mutate` — local-only at b1; CI gate deferred until a baseline threshold is established. T065.
