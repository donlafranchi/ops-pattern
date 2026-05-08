# QR Onboarding

**Tier:** T1
**Bundle:** b1
**Primitive:** Item / Location
**Loops served:** 7, 3

## What a Member can do

A person scans a QR card in the physical world — at a farmers market, a community board, a coffee shop counter — and creates their first Item in under 90 seconds, with the Location pre-filled from the QR card's origin. The QR card is the platform's bridge between physical presence and digital declaration. A maker at the Folsom Farmers Market scans the card at their booth; the Location is already set. They fill in what they make, tap publish, and their product Item is live with a public URL they can share.

## T1 scope (ships at b1)

- QR code encodes a URL with a Location pre-fill parameter (e.g., `/new?location=[location-slug]`)
- Scanning opens the unified Item composer with Location pre-attached
- If the scanner is not authenticated, the composer prompts sign-up first, then returns to the pre-filled composer after account creation
- Location pre-fill is read-only in the composer (the origin is known; the Member can add additional Locations after creation)
- The 90-second target: kind selection + title + description + category + submit with pre-filled Location
- QR cards are generated per Location; `locations.qr_code_url` stores the image URL
- Admin can generate a QR card for any Location from the Location management page

## Deferred

- NFC alternative to QR (b2)
- Dynamic QR codes that track scan counts (b2)
- Printed card design / fulfillment tooling (operations concern, not platform code)

## Acceptance signal

Scanning a Location QR code opens the Item composer with that Location pre-attached; a new Member can create and publish their first Item within 90 seconds of landing on the page.
