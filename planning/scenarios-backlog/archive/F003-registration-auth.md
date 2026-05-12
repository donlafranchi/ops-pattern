# Scenario: Auth — User creates an account with email and password

**Feature:** F003 (product/systems/business-data.md)
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- The user does not have an account

### When
- The user navigates to the sign-up page and enters email + password

### Then
- An account is created via Supabase Auth
- The user is authenticated and redirected to the business registration form (if registering) or the map (if browsing)
- Session persists across page reloads

### And When
- An existing user navigates to the login page and enters email + password

### Then
- The user is authenticated and redirected to the map
- Session persists across page reloads

### And When
- The user taps "Sign out"

### Then
- Session is cleared
- User is returned to the map in unauthenticated state
- Support buttons show "Sign in to support" prompt

## Edge Cases

- Invalid email format: form validation prevents submission
- Password too short: minimum 8 characters, clear error message
- Email already registered: clear error, link to login
- Expired session: user is prompted to re-authenticate, no data loss

## Assumptions

- Supabase Auth handles email/password, session tokens, and password hashing
- No email verification for MVP (speed over gatekeeping)
- No OAuth or social login (b2)
- No password reset flow for MVP (b2)

## Comments

Auth is a gate to support and report — not to browse. The map and all listings are fully accessible without authentication. Auth is only required for actions that write data.
