---
id: spec-patch-2026-06-01-location-create-handler
purpose: Spec patch — `location.create` handler is referenced but not in the registry.
layer: how
status: open
filed: 2026-06-01
caught_by: T073
deviation_pointer: 2026-06-01 — T073
target_spec: product/systems/action-layer.md
target_section: § handler catalog
---

# `location.create` handler missing from action-layer catalog

**What's wrong:** T073 acceptance references a `location.create` handler that is not in the action-layer registry. The server action currently inserts directly into `locations` via the Supabase server client, bypassing the action layer's audit-event invariant.

**The fix:** Add `location.create` to `product/systems/action-layer.md` § handler catalog with input/output shape, OR remove the reference from T073 spec. Once the handler ships, swap `sellCreateLocationAction`'s body for a handler call (~3 lines).

**Caught by:** T073 during build

**Deviation pointer:** [`development/deviations/T073.md`](../../development/deviations/T073.md) § 2026-06-01 entry
