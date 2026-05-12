# System: Vendor Self-Service & Data Quality

**Purpose:** Ensure all business/vendor data is entered by the business owners themselves through a fast, simple flow — and that map pin placement is accurate and verifiable.

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

**Core Principle:** The platform does not manually enter businesses. Every listing originates from the vendor, a community nomination, or a verified bulk source. The PM is not a data entry clerk — the system must scale without manual curation.

---

## T1 — MVP Tier

### Self-Service Registration
- Single-page registration form: name, address, category, ownership type, story
- Target: live on the map in under 3 minutes
- Minimal required fields — name, address, category, ownership tier
- Optional fields filled later (story, hours, photos deferred to T2)
- No admin approval gate — listing goes live immediately after geocode success
- Owner dashboard: edit listing details anytime after registration

### Geocoding Pipeline
- Address → lat/lng via geocoding API (Mapbox Geocoding or Google Geocoding API)
- Geocode runs on form submission before pin is placed
- If geocode returns low confidence or ambiguous results, show the vendor a confirmation step: "Is this the right location?" with a map preview
- Store both the raw address string and the resolved lat/lng
- Reject submissions where geocode fails entirely — prompt vendor to correct address

### Pin Accuracy — Vendor Confirmation
- After geocoding, show vendor a map preview with their pin placement
- Vendor confirms or drags pin to correct location
- Manual pin adjustment stored as `pin_source: vendor_adjusted` (vs `pin_source: geocoded`)
- This is the primary accuracy mechanism at T1: the vendor themselves verifies placement

---

## T2 — Core Tier

### Community Pin Flagging
- Any logged-in user can flag a pin as "wrong location"
- Flag includes optional note ("this pin is across the street", "business moved")
- Flagged pins get a visual indicator visible to the business owner in their dashboard
- Owner receives notification to review and correct pin placement
- Flag count stored — pins with multiple flags get surfaced for review

### Address Verification Service
- Integrate USPS Address Validation API or similar (Smarty, Lob) to normalize and verify addresses at registration time
- Verified addresses get a `address_verified: true` flag
- Unverifiable addresses still allowed but marked — owner prompted to double-check
- Periodic batch verification of existing listings against address service

### Community-Submitted Listings
- Community members can nominate a business (name + address + category)
- Nominated listings appear as "unverified" with a muted pin style
- Owner claim flow: verify identity → take ownership → upgrade to verified listing
- Nominated listings go through same geocoding pipeline

### Bulk Self-Service
- CSV upload for owners with multiple locations (franchisees, multi-location independents)
- Each row geocoded individually; failures flagged for manual correction
- Still requires an authenticated owner account — no anonymous bulk imports

---

## T3 — Polish Tier

### Geocoding Quality Layer
- Cross-reference geocoded pins against known business address databases (Google Places API, Foursquare, or similar)
- Confidence score per pin: high (geocode + vendor confirmed + address verified), medium (geocode only), low (flagged or unverified)
- Admin dashboard showing pins by confidence tier — low-confidence pins surfaced for outreach
- Automated detection of pins placed in bodies of water, highways, empty lots

### Vendor Data Quality Scoring
- Score each listing on completeness: name, address, category, story, hours, photos, ownership proof
- Incomplete listings get gentle nudges ("Add your hours to help customers find you")
- High-completeness listings get subtle visual boost in search results
- Quality score visible to owner in dashboard, never to consumers

### Third-Party Data Enrichment
- Optional integration with business data providers (Yelp API, Google Business Profile) to pre-fill hours, phone, website — with owner approval
- Owner always has final edit authority — enriched data is a suggestion, not an override
- Enrichment never changes ownership classification

---

## Integration Points

- **Business Data:** Stores all listing fields including geocode results, pin source, verification status
- **Map System:** Consumes lat/lng and pin confidence for display; flagged pins get visual treatment
- **Business Registration:** This system defines the registration pipeline; the capability describes the user-facing flow
- **Platform Core:** Auth (owner accounts), Identity Verification (T2 claim flow)
- **Ownership Classification:** Ownership tier entered by vendor at registration — self-reported, verified at T2+

## Key Decisions

- **Vendors enter their own data.** The platform never bulk-loads businesses without an owner on the other end. Community nominations (T2) are the exception, and those are explicitly marked unverified until claimed.
- **Geocoding service required from day one.** Manual lat/lng entry is not acceptable UX. Mapbox Geocoding is the default choice since we already use Mapbox GL for the map.
- **Pin accuracy is a layered problem.** T1 relies on vendor confirmation. T2 adds community flagging and address verification. T3 adds cross-reference and confidence scoring. No single solution — accuracy improves tier by tier.
- **No admin data entry queue.** The system is designed so that accuracy issues are resolved by the vendor (who knows where their business is) or surfaced by the community — not by a central admin manually reviewing every pin.
