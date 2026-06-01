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

*(none — queue clear as of 2026-05-27, b1.x-spec-drain-sprint)*

---

**Historical Landed + Rescinded** — `planning/done/b1.x-spec-drain-sprint/spec-patches-landed.md`.
