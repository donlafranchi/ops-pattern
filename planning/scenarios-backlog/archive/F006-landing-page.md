# Scenario: Landing Page — Visitor sees landing and authenticates

**Feature:** F006
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- The user is not authenticated
- The user navigates to the app root URL

### When
- The landing page loads

### Then
- The user sees:
  - App title "Movers, Makers & Shakers"
  - A one-line value proposition
  - A "Sign Up" button (primary)
  - A "Log In" button (secondary)
  - A "Browse as Guest" link
- No map is visible on the landing page

### And When
- The user taps "Sign Up"

### Then
- The user is taken to the sign-up form
- After completing sign-up, the user is redirected to the home feed

### And When
- The user taps "Log In"

### Then
- The user is taken to the login form
- After successful login, the user is redirected to the home feed

### And When
- The user taps "Browse as Guest"

### Then
- The user is taken directly to the home feed without authentication

### And When
- An already-authenticated user navigates to the root URL

### Then
- The user is redirected to the home feed (landing page is skipped)

## Edge Cases

- Deep links to `/vendors/[slug]` should not require landing page first
- Session expiry while on feed should not kick user to landing — only on next fresh visit
- "Browse as Guest" users can view feed and vendor profiles but cannot follow vendors or register

## Assumptions

- Auth state is checked via Supabase session cookie
- Landing page is a static page with no API calls
- Redirect target after auth is `/` which renders the home feed for authenticated users

## Comments

Keep it simple. One screen, three buttons, clear value prop. No carousel, no feature tour, no animation. Ship fast, iterate later.
