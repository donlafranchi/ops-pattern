# Capability: Identity Verification

**Description:** All listing owners must be natural persons. The platform verifies identity to block corporate entities and build trust across all listing types.

**Bundles:** b1 (basic), b2 (enhanced)

**Platform Layer:** Core

**User Story:**
As a consumer, I want to know the person behind any listing — a shop, a rental, a farm — is a real local individual, not a shell company or property management firm.

**Scope (b1):**
- Email verification via Supabase auth
- Natural person attestation (checkbox: "I am listing as an individual, not a business entity")
- One account per email address
- Role assignment: consumer (default), business_owner (on registration), extended by verticals (host, producer)

**Scope (b2):**
- Government ID verification via third-party service
- Verified identity badge on profile and all listings
- OAuth sign-in (Google, Apple)
- Two-factor authentication

**Out of Scope:**
- Background checks (liability and privacy concerns)
- Credit checks

**Related Capabilities:**
- Owner Profile
- Business Registration (triggers natural person check — core)
- Host Onboarding (triggers natural person check — Stays vertical)
- Producer Onboarding (triggers natural person check — Harvest vertical, TBD)
