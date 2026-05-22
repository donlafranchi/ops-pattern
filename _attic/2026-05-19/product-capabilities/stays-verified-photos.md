# Capability: Verified Photos & Distance Audit

**Description:** Photos are verified against the actual property. Distance claims are computed from real routes, not host assertions.

**Bundles:** b1

**User Story:**
As a traveler, I want to trust that photos show the actual place and that "5 min to the beach" means 5 actual minutes, so I'm not deceived by aspirational marketing.

**Scope:**
- Photo upload requires geo-tagged images with recent timestamps
- Photo review process (manual at T1, ML-assisted at T3)
- Distance to landmarks computed from property address using real walking/driving routes
- Listing shows computed distances, not host-written claims
- Host can add landmarks; distances are always platform-computed
- Checkout task limits: platform defines maximum reasonable checkout expectations (no "do three loads of laundry")

**Out of Scope:**
- Video tours (T2)
- AI photo verification (T3)
- Real-time availability photos

**Related Capabilities:**
- Mandatory Disclosures
- Host Onboarding
- Guest Reviews (accuracy feedback)
