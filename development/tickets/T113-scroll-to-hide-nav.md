# T113: Scroll-to-hide bottom nav behavior

**Scenario:** `planning/next/scenario-F046-member-scrolls-and-nav-hides.md`
**Status:** Done
**Bundle:** b1
**Depends on:** T112

**Serves:**
- **Loop:** 3 (Land here), 7 (Make and be found), 8 (Follow what you love) — maximizing content viewport across all browse surfaces lets Members see more of what's nearby.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → any scrollable content surface (no schema change)

## Workflow gates (mandatory during the migration phase)

- [x] **M2 — `engineering:code-review`** invoked on the diff before commit. Clean; two clarifications applied pre-commit (`will-change-transform` for compositor promotion; iOS/Android keyboard-detection asymmetry documented at the hook).
- [x] **M3 — `design:accessibility-review`** — PASS, no new WCAG 2.1 AA findings. Landmark retained in the a11y tree while off-screen (deliberate — see DEVIATIONS); `focus-within` returns the bar so the 2px focus ring is never off-viewport; contrast, 44x125 touch targets, and focus order unchanged from T112.
- [x] **M4 — `engineering:deploy-checklist`** — N/A; no migration, no schema, no env change.
- [x] **DEVIATIONS.md entry** appended at ticket close — four entries, all accepted-as-is.

## Acceptance Criteria

- [x] Create a `useScrollDirection` hook (e.g. `src/hooks/useScrollDirection.ts`) that tracks scroll direction and exposes a `navVisible` boolean. Scroll-down delta >20px → hidden. Scroll-up delta >20px → visible. `scrollTop ≤ 0` → always visible.
  _Why: the 20px threshold prevents jitter on micro-scrolls and matches the scenario's specified delta. Hook is extracted so the Explore page can consume it for pill positioning (T114)._
- [x] `BottomNav` uses `transform: translateY(100%)` to slide off-screen when hidden, `translateY(0)` when visible. Transition: ~200ms `ease-out`.
- [x] Nav is visible on initial page load (no flash of hidden state).
- [x] Content does not jump on nav show/hide — the nav is `position: fixed` and does not affect document flow.
  _Why: layout jumps break immersive feel; fixed positioning is the load-bearing property._
- [x] Behavior is consistent across Home, Explore, and You tabs.
- [x] When `prefers-reduced-motion: reduce`, the nav appears/disappears instantly (no animation) but same show/hide logic applies.
- [x] When a modal or bottom sheet is open, nav hide/show pauses (stays in current state).
- [x] When the virtual keyboard opens, nav hides to prevent floating above the keyboard.
- [x] Rapid scroll direction changes debounced — no flicker on jittery scrolling.
- [x] On desktop viewport (≥768px), if nav is a side rail, this behavior does not apply.
- [x] The `navVisible` state is exposed via context or export so downstream components (T114 pill row) can consume it.
  _Why: F045's kind-filter pills adjust their `bottom` position based on nav visibility — pills stay fixed when nav hides (PM ratified 2026-09-02)._
- [x] BUILD-LOG.md updated.

## Notes

The hook should use `useEffect` with a scroll event listener (passive) or `IntersectionObserver` for performance. Consider `requestAnimationFrame` throttling to avoid layout thrashing.

The nav's `translateY` transform should use a CSS custom property or a className toggle rather than inline styles — keeps the transition in CSS where `prefers-reduced-motion` can be handled via media query.

Edge case: short content that doesn't scroll — no scroll event fires, nav stays visible. No special handling needed.

Edge case: route changes — reset `navVisible` to `true` on navigation so the nav is always present on tab switch.

## Completion

Date: 2026-09-02
Commit: `ac179c1` (merge `63115c2`)
Branch: `t113` (merged to `main`)

**Shipped.** `useScrollDirection` (passive listener, rAF-throttled, 20px sustained-travel threshold, direction-flip debounce), `useOverlayOpen` (document-level MutationObserver on `[aria-modal="true"]` / `[data-nav-pause]`), `useKeyboardOpen` (`visualViewport` gap), `NavVisibilityProvider` (context export for T114's pill row), and the `translate-y-full` / `translate-y-0` class toggle on `BottomNav` at 200ms ease-out with `motion-reduce:transition-none`.

**Kind-filter pills stay fixed** per the 2026-09-02 ratification — the nav slides out beneath them. Confirmed live on `/explore`: the List/Map + market/category/day cluster held position through a full hide/show cycle.

**Live verification** at mobile 375x812: the bar settles at `translate: 0px 100%`, `top: 812` — fully off-screen, still `position: fixed`, no content jump. A 116px scroll-up brings it back. Tailwind v4 emits the `focus-within:` and `md:` variants after the base utility, so both correctly override `translate-y-full`.

**Tests:** 48 green across `useScrollDirection.test.ts` (13), `useOverlayOpen.test.ts` (4), `useKeyboardOpen.test.ts` (5), `NavVisibilityProvider.test.tsx` (5), and 8 added to `BottomNav.test.tsx`. Lint clean on every touched file; production build passes.

**Pre-existing suite failures** in `tests/ci-enforcement-rule-*`, `tests/ci-conformance-json`, `tests/eval-bootstrap`, and `EmailFirstSignup.test.tsx` are unrelated to T113 — they fail identically on `main` and vary run to run (they shell out to scripts and race). Untouched by this ticket.

**Deviations:** four, all accepted-as-is. See `development/DEVIATIONS.md` § T113.
