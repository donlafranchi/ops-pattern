---
id: spec-patch-2026-06-02-rate-model-enum-drift
purpose: Spec patch — F040 scenario rate_model list drifts from the shipped CHECK enum.
layer: how
status: open
filed: 2026-06-02
caught_by: T081
deviation_pointer: 2026-06-02 — T081
target_spec: planning/now/scenario-F040-producer-lists-service.md
target_section: § Data Captured (Pricing model row) + § Edge Cases (Free service)
---

# Reconcile F040 rate_model enum vs shipped CHECK

**What's wrong:** scenario-F040 § Data Captured lists `rate_model` enum as `flat / hourly / per-session / free`, but the shipped `item_services.rate_model` CHECK (T056, `015_items.sql`) is `hourly / flat / quote / membership`. `per-session` has no schema slot (maps to `flat`); `free` is not a `rate_model` value — model it as `rate_cents = NULL` (as the build does).

**The fix:** Patch the scenario to the shipped enum + null-rate free, OR migrate the enum to include `per-session` / `free`.

**Caught by:** T081 during build

**Deviation pointer:** [`development/deviations/T081.md`](../../development/deviations/T081.md) § 2026-06-02 entry
