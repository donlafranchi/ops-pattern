# Capability: Pin Accuracy Verification

**Description:** Users can verify that a business's map pin is in the correct location, and flag it if it isn't.

**Bundles:** b1 (vendor confirmation), b2 (community flagging)

**User Stories:**

As a business owner registering my business, I want to confirm my pin is in the right spot before going live, so customers can actually find me.

As a community member, I want to flag a pin that's in the wrong place, so the map stays accurate without relying on a central admin.

**Scope:**

**b1 — Vendor Confirmation:**
- Map preview shown after address geocoding during registration
- Vendor confirms pin or drags to correct location
- Adjusted coordinates saved with source metadata

**b2 — Community Flagging:**
- "Flag location" button on business detail card (logged-in users only)
- Optional note field describing the issue
- Owner notified via dashboard to review and correct
- Multiple flags on same pin increase visibility to owner

**Out of Scope:**
- Admin review queue for flagged pins (b3)
- Automated cross-reference against third-party data (b3)
- Consumer-visible accuracy badges (not planned)

**Related Capabilities:**
- Business Registration (pin confirmation is part of reg flow)
- Map Search (accurate pins are the whole point)
- Business Detail View (flag button lives here)
- Community Signals (flagging is a form of community signal)
