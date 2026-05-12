# T009: Shareable Listing Page with OG Metadata

**Scenario:** planning/scenarios/F004-shareable-listing.md
**Status:** Complete

## Acceptance Criteria

- [x] `/business/{slug}` route serves a full detail page for any business
- [x] Page is server-rendered (SSR via Next.js App Router) — no client-side loading spinner for content
- [x] Page displays: business name, address, category, ownership tier badge, owner story, support count, map preview showing pin location
- [x] OpenGraph metadata rendered in HTML head: `og:title` (business name), `og:description` (ownership tier + category + city), `og:image` (generic branded image with ownership tier color), `og:url` (canonical listing URL)
- [x] Business with no story: OG description falls back to ownership + category + city
- [x] Slug collision handled: slugs are unique (append numeric suffix at registration)
- [x] Social media crawlers receive full HTML without JavaScript execution
- [x] Share button on detail card copies `/business/{slug}` URL to clipboard
- [x] Confirmation toast appears after copying
- [x] Tests passing
- [x] BUILD-LOG.md updated

## Notes

Create:
- `src/app/business/[slug]/page.tsx` — SSR detail page using `generateMetadata()` for OG tags
- `src/components/MapPreview.tsx` — small static map showing the business pin (use Mapbox Static Images API or a small interactive map)
- `src/components/Toast.tsx` — simple toast notification component

Use Next.js `generateMetadata()` in the page component to set OG tags dynamically from the business data fetched server-side.

OG image: for MVP, use a generic branded image. Can use Mapbox Static Images API to generate a map thumbnail with a colored pin, or a simple colored card with the business name and tier. Keep it simple — a static fallback image with tier color is fine for b1.

The detail page reuses `BusinessDetailCard` from T007 but in a full-page layout rather than a slide-up card.

Clipboard API: `navigator.clipboard.writeText(url)`. Fall back to `document.execCommand('copy')` for older browsers.

## Completion

Date: 2026-04-09
Commit: 0f77469
