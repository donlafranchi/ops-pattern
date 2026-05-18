# T008: Business Registration Form

**Scenario:** planning/scenarios/F003-business-registration.md
**Status:** Complete
**Completed:** 2026-04-09T19:14:56-07:00

## Acceptance Criteria

- [x] Registration page at `/register-business` (requires authentication — redirect to `/auth/signup` if not logged in)
- [x] Form fields: business name (required), street address (required), city (required), state (required), zip (required), category (required, open text input with autocomplete from existing categories), ownership type (required, 6-tier selector with plain-language descriptions), story/about (optional, free text)
- [x] Category field is open text, NOT a fixed dropdown (per ADR-2)
- [x] Ownership selector shows all 6 tiers with brief descriptions
- [x] Selecting "Mission-driven" reveals additional field for certification type / rationale
- [x] On submit: address is geocoded to lat/lng via Mapbox Geocoding API
- [x] Slug is generated from business name (lowercase, hyphenated, collision-safe)
- [x] Business record is created in Supabase with all fields
- [x] After creation, user is redirected to their listing page (`/business/{slug}`)
- [x] Invalid address (geocoding fails): clear error message asking user to check address
- [x] Duplicate address: warn but allow submission
- [x] Missing required fields: form validation prevents submission
- [x] Tests passing
- [x] BUILD-LOG.md updated

## Notes

Create:
- `src/app/register/page.tsx` — registration form page
- `src/components/OwnershipSelector.tsx` — 6-tier radio/card selector with descriptions
- `src/components/CategoryInput.tsx` — text input with autocomplete from existing categories in DB
- `src/lib/slugify.ts` — slug generation with collision detection

Geocoding: use the same Mapbox Geocoding API wrapper from T006 (`src/lib/geocoding.ts`). Forward geocode the full address string.

Ownership tier descriptions (plain language for the selector):
- Independent: "I own this business myself or with a partner"
- Co-op: "This business is owned by its workers or members"
- Local Franchise: "I own a franchise location locally"
- Challenger: "We're a smaller company competing against big chains"
- Mission-driven: "We're a B Corp, PBC, or have a social mission"
- PE/Corporate: "This business is owned by a corporation or investment firm"

Category autocomplete: query distinct categories from `businesses` table as user types. Allow new categories — do not restrict to existing values.

## Completion

Date: 2026-04-09
Commit: 974e135
