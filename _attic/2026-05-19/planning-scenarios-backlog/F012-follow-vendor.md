# Scenario: Follow Vendor — User follows a vendor and manages their followed list

**Feature:** F012
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- The user is authenticated
- The user is viewing a vendor card (feed, search results) or vendor profile

### When
- The user taps the "Follow" button

### Then
- The button immediately transitions to "Following" state (no page reload)
- The vendor is added to the user's followed vendor list
- A brief toast/snackbar confirms: "Following [Vendor Name]"

### And When
- An unauthenticated guest taps "Follow"

### Then
- A prompt appears: "Sign up to follow [Vendor Name] and get updates when they're at the market"
- Options: "Sign Up" (primary) and "Maybe Later" (dismiss)
- If the user signs up, the follow is applied automatically to their new account

### And When
- The authenticated user navigates to their profile / saved vendors tab

### Then
- A list of followed vendors is shown, each card displaying:
  - Vendor photo + name
  - Product tagline
  - Next market appearance (e.g., "Next: Folsom Farmers Market · Sat Apr 26")
  - Unfollow button
- Vendors are sorted by next upcoming market date (soonest first)
- Vendors with no upcoming market dates appear at the bottom

### And When
- The user taps "Unfollow" on a followed vendor card

### Then
- A confirmation prompt appears: "Unfollow [Vendor Name]?"
- On confirm: vendor is removed from the list immediately
- On cancel: no change

### And When
- A followed vendor has an upcoming market appearance within 3 days

### Then
- A notification is sent (email in b1, push in b2): "[Vendor Name] will be at [Market] this [Day]!"
- Notification links directly to the vendor profile

## Edge Cases

- User follows 0 vendors: saved tab shows "You're not following anyone yet — browse vendors to find makers you love"
- Vendor deactivates their account: remove from followed list silently, do not send notifications
- Duplicate follow attempt (e.g., fast double-tap): idempotent — only one follow record created
- Notification opt-out: user can disable follow notifications from profile settings (b1: email only)

## Assumptions

- Follow is a simple many-to-many: one user, many vendors; one vendor, many followers
- Notification trigger: cron job runs nightly, checks followed vendors with market appearances in next 3 days
- Email notifications only in b1; push notifications deferred to b2
- Follow count is visible to vendors on their dashboard (not shown publicly to consumers in b1)

## Comments

The follow mechanic is the product's core retention loop. Without it, the app is just a directory. With it, the vendor-consumer relationship persists beyond a single market day. Email notifications in b1 are acceptable — the key behavior is that consumers can stay connected to specific vendors between markets.
