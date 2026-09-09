---
purpose: Decision stub — F061's "non-business Page sees only the neighbourhood question" branch has no composer to attach to yet.
layer: how
status: draft
---

# Decision: the non-business Page address/neighbourhood step

**Raised by:** T142 (`development/tickets/done/T142-location-step-address-and-neighbourhood.md`), logged in `development/DEVIATIONS.md`.

## The gap

F061's acceptance criteria say a Page whose kind implies no fixed premises (anything other than `business`) should see only the neighbourhood question when giving its location — no address field at all. T142 shipped the address/neighbourhood step (`<LocationPlaceFields>`) for the Sell walkthrough (business-kind only) and the Product/Service composers (pickup/service locations, unrelated to Page kind). None of those is the surface this criterion describes.

The actual non-business Page creation flow is T139's `/you/create`, which explicitly does not collect an address or location at all today.

## Not decided here

When a non-business Page creation flow grows its own address/location step, it should reuse `<LocationPlaceFields>` (`src/components/locations/LocationPlaceFields.tsx`) and default to (or force) neighbourhood mode for non-business kinds. Not actionable until that surface exists — this stub exists so the criterion isn't silently dropped when F061 is marked done.
