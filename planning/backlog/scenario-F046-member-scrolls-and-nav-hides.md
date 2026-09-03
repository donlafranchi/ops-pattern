---
purpose: Scenario — bottom tab bar auto-hides on scroll down, reappears on scroll up. Global behavior. Nav spec grounded in design-research-thesis.md §2.
layer: how
status: backlog
---

# F046: Member scrolls and the bottom navigation hides

**Bundle:** b1
**Sub-bundle:** integration-test prep (post b1.4 — polish pass on all tab surfaces)
**Work-map item:** No direct checklist entry — serves the unchecked integration test by maximizing content viewport across all tabs. Suggest adding a "Scroll-to-hide nav" line to the checklist.
**Loops:** 3 (Land here), 7 (Make and be found — discovery side), 8 (Follow what you love — feed browsing)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
**Primitive shape:** Person → any scrollable content surface (no schema change)
**Spec contract:** design-research-thesis.md §2 (nav visual treatment), §8 (PWA safe areas), §9 #4 ("the nav bar is furniture")
**Status:** backlog

> **Thesis reconciliation.** Thesis §9 #4 says the nav bar should be "structurally present and visually quiet — like a chair in a room." Scroll-to-hide doesn't contradict this — the nav is structurally present at rest (top of page, initial load, scroll-up) and quiet when the member is deep in content. The thesis doesn't specify scroll behavior; this scenario adds it. The thesis's "remain fixed" language (§5, about kind-filter pills on Explore) applies to the pills, not the nav bar — see the open question below about pill behavior during nav hide.

## The Person

Any member browsing any tab — Home, Explore, or You. The bottom tab bar (Home / Explore / You) occupies 44px of vertical space (per thesis §2, updated 2026-09-02) plus safe-area padding. On a mobile viewport, that's 6-8% of the screen permanently occupied by navigation chrome the member isn't using while scrolling.

## The Story

The member opens Home and starts scrolling through the feed. As they scroll down, the bottom tab bar slides out of view — a smooth CSS `translateY` transition over ~200ms. The full viewport is now content. When they flick upward (scroll direction reverses), the tab bar slides back in. If they scroll all the way to the top, the tab bar also reappears. The behavior is identical on Explore and You — global navigation pattern.

## Surfaces

- **Entry point:** Any tab (Home, Explore, You) — this is a global behavior
- **Primary action:** Scroll down to hide; scroll up or reach top to reveal
- **Interaction:** The tab bar uses `transform: translateY(100%)` to slide off-screen on scroll-down, and `translateY(0)` to return on scroll-up. Transition: ~200ms ease-out.
- **Completion:** Continuous behavior, no completion state.

## Data Captured

No new data. Pure interaction-layer change.

## Acceptance Criteria

### Nav hides on scroll down

**Given** a member is on any tab with scrollable content
**When** they scroll downward by more than 20px of downward delta
**Then** the bottom tab bar slides out of view with a smooth transition (~200ms ease-out). _Why: the tab bar consumes 52px + safe-area padding on mobile — hiding it during active scrolling maximizes the content viewport. The scroll-direction pattern is standard (Instagram, Safari, Chrome mobile). The 20px threshold prevents jitter on micro-scrolls._

### Nav reappears on scroll up

**Given** the tab bar is hidden because the member scrolled down
**When** they scroll upward by more than 20px of upward delta
**Then** the tab bar slides back into view with the same smooth transition. _Why: scroll-up intent signals "I want to navigate or orient myself" — the nav should be ready._

### Nav reappears at scroll top

**Given** the tab bar is hidden
**When** the member scrolls to the top of the page (scrollTop ≤ 0)
**Then** the tab bar is visible. _Why: at the top of the page, the member is in an orientation posture, not a consumption posture. The nav should always be present at rest._

### Nav is visible on initial page load

**Given** the member navigates to any tab
**When** the page first renders
**Then** the tab bar is visible (not hidden). _Why: the hide behavior is triggered only by active scroll-down, not by page state._

### Content does not jump on nav show/hide

**Given** the tab bar transitions between visible and hidden
**When** the transition completes
**Then** the scrollable content area expands/contracts smoothly without a layout shift or scroll-position jump. _Why: the tab bar is positioned fixed, not in the document flow, so its visibility doesn't affect content layout. Layout jumps break the immersive feel._

### Behavior is consistent across all tabs

**Given** the member is on Home, then switches to Explore, then to You
**When** they scroll down on each tab
**Then** the hide behavior is identical on all three. _Why: global navigation pattern, not per-page. Inconsistency between tabs would feel broken._

### Nav visual treatment matches thesis spec

**Given** the bottom nav is visible
**When** inspected
**Then** it matches the thesis §2 spec:
- Height: 44px (compact, TikTok-proportioned — per thesis §2 update 2026-09-02) + `env(safe-area-inset-bottom)` padding
- Icons: 24px outlined, 1.5px stroke weight; active icon transitions to filled variant
- Labels: 10px/500 (Inter Medium), 4px below icon
- Active state: icon and label in charcoal-700 (#3C3C3C) — not pistachio
- Inactive state: icon and label in #717171
- Top border: 1px #EBEBEB
- Background: white (#FFFFFF), no blur, no transparency

_Why: thesis §2 — "charcoal for the active state instead of pistachio: the 'paucity of color' principle. The nav bar is structural — it should communicate state without drawing the eye. Pistachio is reserved for CTAs and brand moments."_

## Edge Cases

- **Short content:** if the page doesn't scroll, the tab bar stays visible — no scroll event to trigger hiding.
- **Modal / bottom sheet open:** tab bar hide/show behavior pauses; tab bar remains in whatever state it was in before the overlay opened.
- **Keyboard open:** tab bar hides to prevent floating above the keyboard.
- **Rapid direction changes:** debounce or velocity threshold to prevent flicker on jittery scrolling.
- **Accessibility — reduced motion:** when `prefers-reduced-motion: reduce` is set, the tab bar appears/disappears instantly (no animation) but still follows the same show/hide logic.
- **Desktop viewport:** if nav is a side rail on desktop, this behavior does not apply.

## Resolved — Kind-filter pills on Explore

PM ratified 2026-09-02: pills stay, nav hides independently.

On Explore, the kind-filter pills (F045) sit above the nav bar. When the nav hides on scroll-down, the pills **stay fixed** — pills remain visible, nav slides out beneath them. The pills effectively become the new bottom edge.

Rationale: The pills are a frequent-tap control (thesis §5: "the user switches between kind views often"). Hiding them defeats the thumb-zone advantage. The nav is for tab-switching (infrequent during a browse session); the pills are for kind-switching (frequent). Different frequencies warrant different hide behaviors.

## Assumptions

- The bottom tab bar currently renders as a fixed-position element with three tabs (Home, Explore, You).
- On Explore, the kind-filter pills (F045) are a separate fixed element above the nav.
- The sticky search bar at the top of Explore is unaffected by this behavior.

## Out of Scope

- Hiding the search bar on Explore during scroll (the search bar stays visible — it's a primary orientation control).
- Tab bar badge notifications (b2).
- Gesture-based navigation (swipe between tabs) — b2.

## Capabilities unlocked

- **Presence & Findability** — refines the content-viewing experience across all surfaces (no new capability; polish on the Phase 2 consumer architecture).
