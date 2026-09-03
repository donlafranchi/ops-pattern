---
id: how-decision-charcoal-ramp-migration
purpose: When and how does the thesis §3 charcoal ramp replace the live neutral tokens app-wide?
layer: how
status: draft
source: T112 deviation routing 2026-09-02
---

# Decision: Charcoal ramp migration

**Question:** Does the thesis §3 six-step charcoal ramp replace `--color-fg` / `--color-fg-muted` / `--color-border` app-wide, and if so, when — and what becomes of the three interim nav tokens T112 shipped?

**Context:** `design-research-thesis.md` §3 specifies a full charcoal ramp (`--color-charcoal-900` #2B2B2B … `--color-charcoal-50` #F5F5F5) that is explicitly meant to *replace* the scattered grays: "The charcoal ramp replaces the scattered gray values (the current `--color-fg`, `--color-fg-muted`, `--color-border`, `--color-surface`) with a unified tonal family."

The live tokens have not moved: `--color-fg` is #1A1A1A (thesis wants #2B2B2B), `--color-fg-muted` is #6B6B6B (thesis §2 assumes #717171), `--color-border` is #E5E3DD (thesis assumes #EBEBEB). T112 needed the thesis values for the nav and could not repoint the globals from inside a nav ticket without restyling every surface in the app, so it shipped three scoped tokens instead: `--color-charcoal` (#3C3C3C — thesis's charcoal-700), `--color-nav-inactive` (#717171), `--color-nav-border` (#EBEBEB).

Every subsequent thesis-compliant surface ticket hits the same fork. Deciding once is cheaper than deciding per ticket.

**Options:**
- **A — Migrate the ramp now, as its own ticket.** Land all six `--color-charcoal-*` steps, repoint `--color-fg`/`--color-fg-muted`/`--color-border`/`--color-surface` to them, delete the three interim nav tokens. One visual-regression sweep across every surface, done once. Highest up-front cost; every later surface ticket inherits correct neutrals for free.
- **B — Migrate lazily, per surface.** Each thesis-compliance ticket adds the scoped tokens it needs, as T112 did. No big-bang regression risk, but the token table accretes one-off names and the "two families, no orphans" property the thesis is after never actually arrives.
- **C — Migrate at the b1 polish sweep.** Defer to the sub-bundle that already owns a cross-surface visual pass, and accept interim scoped tokens until then. Trigger is observable (b1 polish sweep opens); the token debt is bounded and time-boxed rather than open-ended.

**Stakes:** low member-safety, moderate consistency. The paucity-of-color principle in thesis §3 is a *design* commitment, not a member-protection one — the lexicographic rule barely engages. Reversibility is high for all three options (tokens are one file).

**Pointer:** DEVIATIONS T112 What (3) · `product/ui/design-research-thesis.md` §2, §3 · `web/src/app/globals.css`
