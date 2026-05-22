# Scenario: Vendor Profile — User views a vendor's full profile with market schedule

**Feature:** F011
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- A vendor exists in the database with a complete profile
- The user taps a vendor card from the feed, search results, or a direct link

### When
- The vendor profile page loads

### Then
- The page displays:
  - Vendor cover photo (full-width header image)
  - Vendor name (large, prominent)
  - Tagline — one sentence describing what they make (e.g., "Sourdough, pastries, and seasonal jams made in Folsom")
  - Product category chips (e.g., Bread, Jams, Pastries)
  - **Market Schedule section:**
    - List of markets the vendor attends, each showing:
      - Market name (e.g., "Folsom Farmers Market")
      - Days + hours (e.g., "Saturdays 8am–1pm")
      - Next upcoming date (e.g., "Next: Sat Apr 26")
  - About section: 2–4 sentences about the vendor's story/background (optional, vendor-supplied)
  - Contact / links section: website, Instagram, email (vendor-supplied, each optional)
  - Follow button (prominent, above the fold)
  - Share button (copies link or opens native share sheet)

### And When
- The user is already following this vendor

### Then
- The Follow button shows "Following" state (filled/active)
- Tapping it again shows a confirmation: "Unfollow [Vendor Name]?" with Confirm / Cancel

### And When
- The user taps a market name in the schedule

### Then
- A brief market info tooltip or sheet appears showing:
  - Market name, address, and days/hours
  - Link to "See all vendors at this market" (filters feed to that market)

### And When
- The vendor profile is accessed via a direct URL (shareable link)

### Then
- The page renders with full metadata for link previews (OG title, description, image)
- Unauthenticated users can view the profile but see a "Sign up to follow [Name]" prompt in place of the follow button

## Edge Cases

- Vendor with no photo: show a placeholder with vendor initials
- Vendor with no about section: hide that section entirely (no empty state copy)
- Vendor attending no markets: show "Currently not listed at any markets" in schedule section
- Very long product tag list: truncate to 5 chips with a "+N more" expander

## Assumptions

- Vendor profile URL is `/vendors/[slug]` (slug derived from vendor name, unique)
- Market schedule data is vendor-entered during registration and editable from their dashboard
- "Next upcoming date" is calculated from the market's recurring schedule (e.g., every Saturday)
- Profile is publicly viewable without authentication

## Comments

This is the core unit of the product — the page a consumer bookmarks and a vendor shares. It replaces the "business detail card" (F002) as the primary vendor view. The market schedule is the key differentiator from a generic business directory: you can see *when* and *where* to find this vendor.
