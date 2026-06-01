---
id: how-spec-patches
purpose: Queue of product/ spec patches flagged by the build agent. Closes the Build → Product return path.
layer: how
status: active
---

# SPEC-PATCHES — open queue

When `build` writes a DEVIATIONS entry with `Disposition: flag-for-spec-revision`, it appends a one-line entry here. `explore` drains the queue as a gate before each bundle phase opens. Empty is the desired state at phase boundaries.

**Entry format.**

```
- [ ] {YYYY-MM-DD} · {spec path} § {section} — {one-line what's wrong}. Caught by T###. DEVIATIONS: {ticket-or-date pointer}.
```

Check the box and append `· landed YYYY-MM-DD ({commit hash})` when product patches; move to the sprint archive on next sprint close.

---

## Open

- [ ] 2026-06-01 · `development/tickets/T073-*.md` § Acceptance line 36 (Locality step writes `member_business_jurisdictions` row) — contradicts `review-F036.md` § cross-system consistency ("F036 does NOT need that substrate"). Two sources of truth diverged; pick one. Implementation chose UI-only at b1 (substrate ships with F037). Caught by T073. DEVIATIONS: 2026-06-01 — T073.
- [ ] 2026-06-01 · `product/systems/action-layer.md` § handler catalog — `location.create` handler is referenced by T073 acceptance but not in the registry. Add to the catalog with input/output shape, or remove the reference from the spec. Caught by T073. DEVIATIONS: 2026-06-01 — T073.

---

**Historical Landed + Rescinded** — `planning/done/b1.x-spec-drain-sprint/spec-patches-landed.md`.
