---
purpose: Ruled on shape — a Page gets a street address if it has a specific public location, a neighbourhood if it does not. Which composer asks for it is still open.
layer: how
status: ruled
---

# Decision: the non-business Page address/neighbourhood step

> **RULED 2026-09-09 on the shape question.** **A Page gets a street address if it has a specific location, or a neighbourhood if it does not.** The Page's kind is not what decides it — *having a specific location* is. So the branch this stub describes is right in outcome and wrong in its reason: a non-business Page with real premises should be able to give an address, and a business Page without premises should be able to give a neighbourhood.
>
> **The qualifier, verbatim from the PM:**
>
> > **We mean a PUBLIC location, not a home address. We won't stop someone entering a home address, but it is shown to anyone who views the Page — it does not stay private.**
>
> **Build requirement that follows:** the address field needs wording making public visibility **unmistakable before anyone types into it**, with the neighbourhood alternative visible in the same moment. **No legal or tax language in that string, or any user-facing string — standing rule.**
>
> **Still open, and this stub stays for it:** the create entry point [T139] collects no location at all, so there is no surface for a non-business Page to answer either question. Ruled ≠ built.
>
> Log entry: [`../DECISIONS.md`](../DECISIONS.md) § 2026-09-09 — A Page's address is a public location.

**Raised by:** T142 (`development/tickets/done/T142-location-step-address-and-neighbourhood.md`), logged in `development/DEVIATIONS.md`.

## The gap

F061's acceptance criteria say a Page whose kind implies no fixed premises (anything other than `business`) should see only the neighbourhood question when giving its location — no address field at all. T142 shipped the address/neighbourhood step (`<LocationPlaceFields>`) for the Sell walkthrough (business-kind only) and the Product/Service composers (pickup/service locations, unrelated to Page kind). None of those is the surface this criterion describes.

The actual non-business Page creation flow is T139's `/you/create`, which explicitly does not collect an address or location at all today.

## Not decided here

When a non-business Page creation flow grows its own address/location step, it should reuse `<LocationPlaceFields>` (`src/components/locations/LocationPlaceFields.tsx`) and default to (or force) neighbourhood mode for non-business kinds. Not actionable until that surface exists — this stub exists so the criterion isn't silently dropped when F061 is marked done.
