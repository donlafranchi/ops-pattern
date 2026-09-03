# T113: Scroll-to-hide bottom nav behavior

**Scenario:** `planning/next/scenario-F046-member-scrolls-and-nav-hides.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T112

**Serves:**
- **Loop:** 3 (Land here), 7 (Make and be found), 8 (Follow what you love) — maximizing content viewport across all browse surfaces lets Members see more of what's nearby.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → any scrollable content surface (no schema change)

## Workflow gates (mandatory during the migration phase)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — yes, this changes navigation visibility behavior.
- [ ] **M4 — `engineering:deploy-checklist`** — N/A; no migration.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [ ] Create a `useScrollDirection` hook (e.g. `src/hooks/useScrollDirection.ts`) that tracks scroll direction and exposes a `navVisible` boolean. Scroll-down delta >20px → hidden. Scroll-up delta >20px → visible. `scrollTop ≤ 0` → always visible.
  _Why: the 20px threshold prevents jitter on micro-scrolls and matches the scenario's specified delta. Hook is extracted so the Explore page can consume it for pill positioning (T114)._
- [ ] `BottomNav` uses `transform: translateY(100%)` to slide off-screen when hidden, `translateY(0)` when visible. Transition: ~200ms `ease-out`.
- [ ] Nav is visible on initial page load (no flash of hidden state).
- [ ] Content does not jump on nav show/hide — the nav is `position: fixed` and does not affect document flow.
  _Why: layout jumps break immersive feel; fixed positioning is the load-bearing property._
- [ ] Behavior is consistent across Home, Explore, and You tabs.
- [ ] When `prefers-reduced-motion: reduce`, the nav appears/disappears instantly (no animation) but same show/hide logic applies.
- [ ] When a modal or bottom sheet is open, nav hide/show pauses (stays in current state).
- [ ] When the virtual keyboard opens, nav hides to prevent floating above the keyboard.
- [ ] Rapid scroll direction changes debounced — no flicker on jittery scrolling.
- [ ] On desktop viewport (≥768px), if nav is a side rail, this behavior does not apply.
- [ ] The `navVisible` state is exposed via context or export so downstream components (T114 pill row) can consume it.
  _Why: F045's kind-filter pills adjust their `bottom` position based on nav visibility — pills stay fixed when nav hides (PM ratified 2026-09-02)._
- [ ] BUILD-LOG.md updated.

## Notes

The hook should use `useEffect` with a scroll event listener (passive) or `IntersectionObserver` for performance. Consider `requestAnimationFrame` throttling to avoid layout thrashing.

The nav's `translateY` transform should use a CSS custom property or a className toggle rather than inline styles — keeps the transition in CSS where `prefers-reduced-motion` can be handled via media query.

Edge case: short content that doesn't scroll — no scroll event fires, nav stays visible. No special handling needed.

Edge case: route changes — reset `navVisible` to `true` on navigation so the nav is always present on tab switch.

## Completion

Date:
Commit:
