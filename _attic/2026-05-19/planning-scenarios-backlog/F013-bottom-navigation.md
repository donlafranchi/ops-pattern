# Scenario: Bottom Navigation — Persistent tab bar across the app

**Feature:** F013
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- The user is on any primary screen (Home, Search/Explore, Favorites, Profile)

### When
- The screen renders on a mobile viewport

### Then
- A bottom navigation bar is pinned to the bottom of the viewport with four tabs:
  1. **Home** (house icon) — links to the home feed (F008)
  2. **Explore** (magnifying glass icon) — links to the Search/Explore screen (F010)
  3. **Following** (heart icon) — links to the followed vendors list (F012)
  4. **You** (person icon) — links to the profile screen (shows profile, settings link, and "My Vendor Listing" link if user has a vendor account)
- The active tab is visually distinct (filled icon + label colored; inactive tabs are outline + muted)
- Tapping a tab navigates to that screen without a full page reload (client-side routing)

### And When
- The user taps the currently active tab

### Then
- If the screen supports it, scroll to top (e.g., Home feed scrolls to the top of the modules)
- Otherwise, no-op

### And When
- The user is not authenticated and taps "Following" or "You"

### Then
- They are prompted: "Sign up to follow vendors" (Following) or "Sign up to create your profile" (You) with a Sign Up / Cancel choice
- On Cancel, they remain on the current screen

### And When
- The screen is rendered on a desktop viewport (≥ 768px wide)

### Then
- The bottom nav is replaced with a top nav bar containing the same four destinations plus the search field
- The market pill moves into the top nav

## Edge Cases

- Vendor profile or deep sub-pages: bottom nav remains visible; tapping Home returns to feed, NOT back one step
- iOS safe-area inset: bottom nav respects the home indicator safe area
- Modal/bottom-sheet open (e.g., market selector): nav is obscured by the modal, reappears on close

## Cross-cutting UX Rule: Upward-Opening Menus

Any button, chip, or control positioned in the lower half of the viewport (including but not limited to: bottom nav items, action buttons above the tab bar, filter chips low on the screen, or floating action buttons) MUST open its associated menu, popover, or inline sheet **upward** (anchored at its top edge, expanding toward the top of the screen) so the menu does not clip below the viewport or behind the bottom nav.

- Full-screen modals and bottom sheets that slide up from the viewport bottom are exempt — they cover the nav by design
- Dropdowns from buttons in the upper half of the viewport open downward as normal
- Implementation note: use a positioning library (e.g., Floating UI / Radix primitives) with a `bottom` or `top` placement preference driven by the trigger's Y position relative to the viewport midpoint

## Assumptions

- Tab switching preserves each tab's scroll position and state (e.g., search results are not cleared when switching to Home and back)
- Icons use a consistent icon set (e.g., Lucide or Heroicons)
- The nav is implemented once in the app shell, not per-screen

## Comments

This is the app's skeleton. Without it, users have no way to move between the four primary destinations consistently. Etsy uses: Home, Search, You, Favorites, Cart. We drop Cart (no e-commerce in b1) and keep the four most relevant.
