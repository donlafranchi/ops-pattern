# T013: Bottom Navigation Shell

**Scenario:** planning/scenarios/F013-bottom-navigation.md
**Status:** Complete

## Acceptance Criteria

- [ ] Create `src/components/BottomNav.tsx` — pinned to viewport bottom on mobile, four tabs: Home / Explore / Following / You
- [ ] Active tab: filled icon + colored label; inactive: outline + muted
- [ ] Safe-area inset respected (`env(safe-area-inset-bottom)` padding)
- [ ] Tabs use Next.js `<Link>` for client-side routing; routes: `/`, `/explore`, `/following`, `/you`
- [ ] Tapping active tab scrolls the screen to top (scroll-to-top hook)
- [ ] Unauthenticated tap on Following or You: shows sign-up prompt (reuse existing auth prompt component or create minimal dialog)
- [ ] Desktop (≥ 768px): bottom nav is hidden and replaced by top nav with same destinations
- [ ] Placeholder pages created for `/explore`, `/following`, `/you` (each renders a stub with page title; real content ships in later tickets)
- [ ] Create `src/components/Popover.tsx` (or extend existing) with `placement="top"` support — used for any bottom-anchored menus per F013 cross-cutting rule. Use Radix UI `Popover` or Floating UI
- [ ] Nav is rendered in `src/app/layout.tsx` (or a shared layout wrapper) so it persists across route changes
- [ ] Tests: nav renders with four tabs, active state matches current route, unauthenticated prompt fires, desktop breakpoint hides bottom nav
- [ ] BUILD-LOG.md updated

## Notes

Icons: use `lucide-react` (already in package.json or add it). Icons: Home, Search, Heart, User.

The existing map-first home at `/` needs to be renamed/moved. Keep the map page accessible at `/map` for now (will be removed/repurposed when T015 lands the Explore+map). The root `/` will become the new home feed in T014.

Placeholder pages are one-liners — real content comes in T014 (home), T015 (explore), T017 (following), and T018 (you/profile).

## Completion

Date: 2026-04-24
Commit: 8c6b2bd
